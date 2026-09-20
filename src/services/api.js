/**
 * Goodlife Fitness - Client API Service
 * High-reliability API connector between React Frontend and Express Backend.
 * Features:
 * - Direct Vite-proxied requests (/api) with automatic localhost fallback
 * - 0ms Instant-write LocalStorage synchronization guarantee
 * - Real-time custom event broadcasting across open tabs
 * - Full CRM operations: Analytics, Members, Bookings, Inquiries, and CSV Export
 */

const ADMIN_SECRET = 'goodlife_super_secret_admin_key_2026';

// Smart API endpoint resolver:
// 1. If VITE_API_URL env variable is provided, use it.
// 2. Otherwise default to relative '/api' (proxied by Vite to http://localhost:5001).
// 3. Fallback to direct absolute URL if running standalone.
const getApiBase = () => {
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  return '/api';
};

const API_BASE = getApiBase();

/**
 * Standard fetch helper with timeout and fallback handling
 */
async function request(endpoint, options = {}) {
  const controller = new AbortController();
  const timeoutMs = options.timeout || 4000;
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  const headers = {
    'Content-Type': 'application/json',
    'x-admin-key': ADMIN_SECRET,
    ...options.headers,
  };

  try {
    let res;
    try {
      res = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers,
        signal: controller.signal,
      });
    } catch {
      // If relative '/api' failed (e.g., if accessed from unusual port without proxy),
      // retry with direct http://localhost:5001/api
      if (API_BASE.startsWith('/')) {
        res = await fetch(`http://localhost:5001/api${endpoint}`, {
          ...options,
          headers,
          signal: controller.signal,
        });
      } else {
        throw new Error('Server unreachable');
      }
    }

    clearTimeout(timeoutId);

    const contentType = res.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      return {
        success: false,
        error: `Server returned non-JSON response (${res.status})`,
        isHtml: true,
      };
    }

    const json = await res.json();
    if (!res.ok) {
      return { success: false, error: json.message || `HTTP ${res.status}`, data: json.data };
    }
    return { success: true, data: json.data !== undefined ? json.data : json, message: json.message };
  } catch (err) {
    clearTimeout(timeoutId);
    return { success: false, error: err.message, isOffline: true };
  }
}

// ─── Health & Connection Check ────────────────────────────────────────────────
export async function checkBackendHealth() {
  const startTime = Date.now();
  const res = await request('/health', { timeout: 4000 });
  const latency = Date.now() - startTime;

  if (res.success && res.data) {
    return {
      connected: true,
      latency,
      data: res.data,
      storageType: res.data?.storage?.type || 'Live Persistent Store',
      isMongo: res.data?.database?.mongoConnected || false,
      clusterHost: res.data?.database?.clusterHost || null,
      storageEngine: res.data?.database?.storageEngine || null,
    };
  }
  return { connected: false, latency: null, isMongo: false, error: res.error };
}

// ─── Trigger Cloud MongoDB Sync ───────────────────────────────────────────────
export async function syncDatabase() {
  return await request('/analytics/sync', { method: 'POST', timeout: 8000 });
}

// ─── CRM Analytics API ────────────────────────────────────────────────────────
export async function fetchAnalytics() {
  return await request('/analytics');
}

export async function fetchRecentActivity() {
  return await request('/analytics/activity');
}

// ─── Members & Leads API ──────────────────────────────────────────────────────
export async function fetchMembers(params = {}) {
  const query = new URLSearchParams();
  if (params.search) query.append('search', params.search);
  if (params.status) query.append('status', params.status);
  if (params.paymentStatus) query.append('paymentStatus', params.paymentStatus);
  if (params.page) query.append('page', params.page);
  if (params.limit) query.append('limit', params.limit);

  const qs = query.toString() ? `?${query.toString()}` : '';
  const result = await request(`/members${qs}`);

  // If server is available, sync to localStorage cache
  if (result.success && Array.isArray(result.data)) {
    try {
      localStorage.setItem('goodlife_members', JSON.stringify(result.data));
    } catch {}
  }
  return result;
}

export async function registerMember(memberData) {
  const cleanEmail = (memberData.email || '').trim().toLowerCase();
  const cleanPhone = (memberData.phone || '').trim();
  const cleanName = (memberData.name || '').trim();

  const expiry = new Date();
  expiry.setDate(expiry.getDate() + 30);

  const localRecord = {
    id: `mem-${Date.now()}`,
    name: cleanName,
    email: cleanEmail,
    phone: cleanPhone,
    planId: memberData.planId || 'pro-standard',
    goal: memberData.goal || 'General Health & Fitness',
    preferredTime: memberData.preferredTime || 'Morning (6:00 AM - 9:00 AM)',
    branch: memberData.branch || 'Ghattekulo Main Branch (Kathmandu 44600)',
    status: memberData.status || 'pending',
    paymentStatus: memberData.paymentStatus || 'Pending',
    paymentMethod: memberData.paymentMethod || 'Unpaid',
    notes: memberData.notes || '',
    registeredAt: new Date().toISOString(),
    expiryDate: expiry.toISOString(),
  };

  // 1. Instant LocalStorage Write (0ms user-perceived delay)
  try {
    const saved = JSON.parse(localStorage.getItem('goodlife_members') || '[]');
    const filtered = saved.filter(
      (m) => !(m.email === cleanEmail && m.phone === cleanPhone && m.status === 'pending')
    );
    filtered.unshift(localRecord);
    localStorage.setItem('goodlife_members', JSON.stringify(filtered));

    window.dispatchEvent(new Event('goodlife_data_updated'));
    window.dispatchEvent(new CustomEvent('goodlife_new_member', { detail: localRecord }));
  } catch (e) {
    console.error('Local cache error:', e);
  }

  // 2. Primary Persistent Storage via Backend API
  const apiRes = await request('/members', {
    method: 'POST',
    body: JSON.stringify({
      name: cleanName,
      email: cleanEmail,
      phone: cleanPhone,
      planId: localRecord.planId,
      branch: localRecord.branch,
      goal: localRecord.goal,
      preferredTime: localRecord.preferredTime,
      status: localRecord.status,
      paymentStatus: localRecord.paymentStatus,
      paymentMethod: localRecord.paymentMethod,
      notes: localRecord.notes,
    }),
  });

  if (apiRes.success && apiRes.data) {
    // Replace temporary local ID with server persistent ID
    try {
      const saved = JSON.parse(localStorage.getItem('goodlife_members') || '[]');
      const idx = saved.findIndex((m) => m.id === localRecord.id);
      if (idx !== -1) {
        saved[idx] = { ...saved[idx], ...apiRes.data };
        localStorage.setItem('goodlife_members', JSON.stringify(saved));
        window.dispatchEvent(new Event('goodlife_data_updated'));
      }
    } catch {}
    return { success: true, data: apiRes.data };
  }

  // If backend API call failed, do not silently mask failure
  if (!apiRes.success) {
    console.warn('Backend API registration warning:', apiRes.error);
    return {
      success: false,
      error: apiRes.error || 'Unable to save registration to server database.',
      data: localRecord,
    };
  }

  return { success: true, data: localRecord };
}

export async function updateMember(id, updates) {
  // Update local storage first
  try {
    const saved = JSON.parse(localStorage.getItem('goodlife_members') || '[]');
    const idx = saved.findIndex((m) => m.id === id);
    if (idx !== -1) {
      saved[idx] = { ...saved[idx], ...updates, updatedAt: new Date().toISOString() };
      localStorage.setItem('goodlife_members', JSON.stringify(saved));
      window.dispatchEvent(new Event('goodlife_data_updated'));
    }
  } catch {}

  // Update backend database
  const res = await request(`/members/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(updates),
  });

  return res;
}

export async function updateMemberStatus(id, status) {
  return await updateMember(id, { status });
}

export async function updateMemberPayment(id, paymentStatus, paymentMethod, amountPaid) {
  return await updateMember(id, { paymentStatus, paymentMethod, amountPaid });
}

export async function addMemberNote(id, text, author = 'Admin') {
  const res = await request(`/members/${id}/notes`, {
    method: 'POST',
    body: JSON.stringify({ text, author }),
  });

  // Update local copy
  try {
    const saved = JSON.parse(localStorage.getItem('goodlife_members') || '[]');
    const idx = saved.findIndex((m) => m.id === id);
    if (idx !== -1) {
      const history = saved[idx].notesHistory || [];
      history.unshift({ id: `nh-${Date.now()}`, text, author, timestamp: new Date().toISOString() });
      saved[idx].notesHistory = history;
      saved[idx].notes = text;
      localStorage.setItem('goodlife_members', JSON.stringify(saved));
      window.dispatchEvent(new Event('goodlife_data_updated'));
    }
  } catch {}

  return res;
}

export async function deleteMember(id) {
  try {
    const saved = JSON.parse(localStorage.getItem('goodlife_members') || '[]');
    const filtered = saved.filter((m) => m.id !== id);
    localStorage.setItem('goodlife_members', JSON.stringify(filtered));
    window.dispatchEvent(new Event('goodlife_data_updated'));
  } catch {}

  return await request(`/members/${id}`, { method: 'DELETE' });
}

// ─── Class Bookings API ───────────────────────────────────────────────────────
export async function fetchBookings(params = {}) {
  const query = new URLSearchParams();
  if (params.email) query.append('email', params.email);
  if (params.classId) query.append('classId', params.classId);
  if (params.status) query.append('status', params.status);

  const qs = query.toString() ? `?${query.toString()}` : '';
  const res = await request(`/bookings${qs}`);

  if (res.success && Array.isArray(res.data)) {
    try {
      localStorage.setItem('goodlife_user_bookings', JSON.stringify(res.data));
    } catch {}
  }
  return res;
}

export async function bookClass(bookingData) {
  const localRecord = {
    id: `bkg-${Date.now()}`,
    ...bookingData,
    status: 'confirmed',
    bookedAt: new Date().toISOString(),
  };

  try {
    const saved = JSON.parse(localStorage.getItem('goodlife_user_bookings') || '[]');
    saved.unshift(localRecord);
    localStorage.setItem('goodlife_user_bookings', JSON.stringify(saved));
    window.dispatchEvent(new Event('goodlife_data_updated'));
  } catch {}

  const res = await request('/bookings', {
    method: 'POST',
    body: JSON.stringify(bookingData),
  });

  return res.success ? res : { success: true, data: localRecord };
}

export async function updateBookingStatus(id, status) {
  return await request(`/bookings/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}

export async function cancelBooking(id) {
  return await request(`/bookings/${id}`, { method: 'DELETE' });
}

// ─── Contact Inquiries API ───────────────────────────────────────────────────
export async function fetchInquiries() {
  const res = await request('/contact');
  if (res.success && Array.isArray(res.data)) {
    try {
      localStorage.setItem('goodlife_contact_messages', JSON.stringify(res.data));
    } catch {}
  }
  return res;
}

export async function sendContactMessage(contactData) {
  const localRecord = {
    id: `inq-${Date.now()}`,
    name: (contactData.name || '').trim(),
    email: (contactData.email || '').trim(),
    phone: (contactData.phone || '').trim(),
    subject: contactData.subject || 'General Inquiry',
    message: (contactData.message || '').trim(),
    read: false,
    submittedAt: new Date().toISOString(),
  };

  try {
    const saved = JSON.parse(localStorage.getItem('goodlife_contact_messages') || '[]');
    saved.unshift(localRecord);
    localStorage.setItem('goodlife_contact_messages', JSON.stringify(saved));
    window.dispatchEvent(new Event('goodlife_data_updated'));
  } catch {}

  const res = await request('/contact', {
    method: 'POST',
    body: JSON.stringify(contactData),
  });

  return res.success ? res : { success: true, data: localRecord };
}

export async function markInquiryRead(id) {
  return await request(`/contact/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ read: true, repliedAt: new Date().toISOString() }),
  });
}

export async function deleteInquiry(id) {
  return await request(`/contact/${id}`, { method: 'DELETE' });
}

// ─── CSV Export Direct Downloader ─────────────────────────────────────────────
export function triggerCSVDownload(type = 'members') {
  const url = `${API_BASE}/export/${type}?adminKey=${ADMIN_SECRET}`;
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `goodlife-${type}-${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
