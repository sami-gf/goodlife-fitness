import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import SEOHead from '../components/SEOHead';
import {
  Users,
  DollarSign,
  CalendarCheck,
  Mail,
  Search,
  Download,
  Phone,
  MessageSquare,
  CheckCircle,
  Clock,
  ShieldCheck,
  Lock,
  Unlock,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  PlusCircle,
  Trash2,
  X,
  UserCheck,
  Receipt,
  Printer,
  FileText,
  Target,
  Calendar,
  CreditCard,
  Save,
  Send,
  Check,
  AlertCircle,
  Activity,
  BarChart3,
  Flame,
  ArrowUpRight,
  Database,
} from 'lucide-react';
import { Membership } from '../base44/entities/Membership';
import {
  checkBackendHealth,
  fetchAnalytics,
  fetchMembers,
  registerMember,
  updateMemberStatus,
  updateMemberPayment,
  addMemberNote,
  deleteMember,
  fetchBookings,
  updateBookingStatus,
  cancelBooking,
  fetchInquiries,
  markInquiryRead,
  deleteInquiry,
  triggerCSVDownload,
} from '../services/api';

export default function AdminDashboard() {
  // ─── Authentication State ───────────────────────────────────────────────────
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('goodlife_admin_auth') === 'true';
  });
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  // ─── Navigation Tabs ────────────────────────────────────────────────────────
  // 'analytics' | 'members' | 'bookings' | 'inquiries'
  const [activeTab, setActiveTab] = useState('analytics');

  // ─── Backend & Connection Status ────────────────────────────────────────────
  const [backendStatus, setBackendStatus] = useState({
    connected: false,
    latency: null,
    storageType: 'Persistent Store',
  });

  // ─── Data Stores ────────────────────────────────────────────────────────────
  const [members, setMembers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // ─── Search & Pipeline Filters ──────────────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState('');
  const [pipelineFilter, setPipelineFilter] = useState('all'); // 'all' | 'new' | 'contacted' | 'active' | 'overdue'
  const [paymentFilter, setPaymentFilter] = useState('all');

  // ─── Modals & Drawers ───────────────────────────────────────────────────────
  const [selectedMember, setSelectedMember] = useState(null);
  const [newNoteText, setNewNoteText] = useState('');
  const [receiptMember, setReceiptMember] = useState(null);

  // Walk-in Registration Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [walkinData, setWalkinData] = useState({
    name: '',
    phone: '',
    email: '',
    planId: 'pro-standard',
    goal: 'Fat Loss & Conditioning',
    preferredTime: 'Morning (6:00 AM - 9:00 AM)',
    paymentStatus: 'Paid (Cash)',
    paymentMethod: 'Cash at Reception',
    notes: '',
  });

  // Admin Toast Notifications
  const [adminToast, setAdminToast] = useState(null);
  const showToast = (msg, type = 'success') => {
    setAdminToast({ msg, type });
    setTimeout(() => setAdminToast(null), 3800);
  };

  // Plan price lookup helper
  const plansMap = useMemo(() => {
    const map = {};
    Membership.getAll().forEach((p) => {
      map[p.id] = p;
    });
    return map;
  }, []);

  // ─── Data Loader & Synchronizer ─────────────────────────────────────────────
  const loadData = useCallback(async () => {
    setIsRefreshing(true);

    // 1. Check backend connectivity
    const health = await checkBackendHealth();
    setBackendStatus({
      connected: health.connected,
      latency: health.latency,
      storageType: health.storageType || 'Persistent Store',
    });

    // 2. Fetch CRM Analytics
    try {
      const aRes = await fetchAnalytics();
      if (aRes.success && aRes.data) {
        setAnalyticsData(aRes.data);
      }
    } catch (e) {
      console.warn('Analytics fetch warning:', e);
    }

    // 3. Fetch Members
    try {
      const mRes = await fetchMembers({ limit: 300 });
      if (mRes.success && Array.isArray(mRes.data)) {
        setMembers(mRes.data);
      } else {
        // Fallback to local cache
        const localM = JSON.parse(localStorage.getItem('goodlife_members') || '[]');
        setMembers(localM);
      }
    } catch {
      const localM = JSON.parse(localStorage.getItem('goodlife_members') || '[]');
      setMembers(localM);
    }

    // 4. Fetch Bookings
    try {
      const bRes = await fetchBookings();
      if (bRes.success && Array.isArray(bRes.data)) {
        setBookings(bRes.data);
      } else {
        const localB = JSON.parse(localStorage.getItem('goodlife_user_bookings') || '[]');
        setBookings(localB);
      }
    } catch {
      const localB = JSON.parse(localStorage.getItem('goodlife_user_bookings') || '[]');
      setBookings(localB);
    }

    // 5. Fetch Inquiries
    try {
      const iRes = await fetchInquiries();
      if (iRes.success && Array.isArray(iRes.data)) {
        setInquiries(iRes.data);
      } else {
        const localI = JSON.parse(localStorage.getItem('goodlife_contact_messages') || '[]');
        setInquiries(localI);
      }
    } catch {
      const localI = JSON.parse(localStorage.getItem('goodlife_contact_messages') || '[]');
      setInquiries(localI);
    }

    setIsRefreshing(false);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated, loadData]);

  // Listen for real-time updates dispatched across tabs
  useEffect(() => {
    const handleDataUpdated = () => {
      if (isAuthenticated) loadData();
    };
    window.addEventListener('goodlife_data_updated', handleDataUpdated);
    return () => window.removeEventListener('goodlife_data_updated', handleDataUpdated);
  }, [isAuthenticated, loadData]);

  // ─── PIN Authentication ─────────────────────────────────────────────────────
  const handlePinSubmit = (e) => {
    e.preventDefault();
    const correctPin = '1234';
    if (pinInput.trim() === correctPin) {
      sessionStorage.setItem('goodlife_admin_auth', 'true');
      setIsAuthenticated(true);
      setPinError(false);
    } else {
      setPinError(true);
      setPinInput('');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('goodlife_admin_auth');
    setIsAuthenticated(false);
    setPinInput('');
  };

  // ─── Quick Member Actions ───────────────────────────────────────────────────
  const handleStatusChange = async (memberId, newStatus) => {
    const res = await updateMemberStatus(memberId, newStatus);
    if (res.success) {
      setMembers((prev) =>
        prev.map((m) => (m.id === memberId ? { ...m, status: newStatus } : m))
      );
      if (selectedMember && selectedMember.id === memberId) {
        setSelectedMember((prev) => ({ ...prev, status: newStatus }));
      }
      showToast(`Member status updated to "${newStatus}".`);
      loadData(); // refresh analytics
    } else {
      showToast('Could not update status.', 'error');
    }
  };

  const handlePaymentChange = async (memberId, newPaymentStatus) => {
    let method = 'Cash at Reception';
    if (newPaymentStatus.includes('eSewa')) method = 'eSewa Digital Wallet';
    else if (newPaymentStatus.includes('Khalti')) method = 'Khalti Digital Wallet';
    else if (newPaymentStatus.includes('Bank')) method = 'Bank / Fonepay Transfer';
    else if (newPaymentStatus === 'Pending') method = 'Unpaid';

    const targetMember = members.find((m) => m.id === memberId);
    const plan = plansMap[targetMember?.planId] || plansMap['pro-standard'];
    const amount = newPaymentStatus.startsWith('Paid') ? plan.priceMonthlyNPR : 0;

    const res = await updateMemberPayment(memberId, newPaymentStatus, method, amount);
    if (res.success) {
      setMembers((prev) =>
        prev.map((m) =>
          m.id === memberId
            ? {
                ...m,
                paymentStatus: newPaymentStatus,
                paymentMethod: method,
                amountPaid: amount,
                receiptNumber:
                  res.data?.receiptNumber ||
                  m.receiptNumber ||
                  `GLF-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
              }
            : m
        )
      );
      if (selectedMember && selectedMember.id === memberId) {
        setSelectedMember((prev) => ({
          ...prev,
          paymentStatus: newPaymentStatus,
          paymentMethod: method,
          amountPaid: amount,
        }));
      }
      showToast(`Payment marked as "${newPaymentStatus}" (NPR ${amount.toLocaleString('en-NP')}).`);
      loadData();
    } else {
      showToast('Could not update payment.', 'error');
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!selectedMember || !newNoteText.trim()) return;

    const res = await addMemberNote(selectedMember.id, newNoteText.trim(), 'Reception Admin');
    if (res.success) {
      showToast('Note added to member history.');
      setNewNoteText('');
      loadData();
      if (res.data) setSelectedMember(res.data);
    }
  };

  const handleDeleteMember = async (memberId, name) => {
    if (window.confirm(`Are you sure you want to delete ${name}'s profile from the CRM?`)) {
      const res = await deleteMember(memberId);
      if (res.success) {
        setMembers((prev) => prev.filter((m) => m.id !== memberId));
        if (selectedMember?.id === memberId) setSelectedMember(null);
        showToast(`Profile for ${name} removed.`);
        loadData();
      }
    }
  };

  // ─── Class Booking Actions ──────────────────────────────────────────────────
  const handleBookingStatus = async (bookingId, status) => {
    const res = await updateBookingStatus(bookingId, status);
    if (res.success) {
      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, status } : b))
      );
      showToast(`Class booking marked as "${status}".`);
      loadData();
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (window.confirm('Cancel this class booking?')) {
      const res = await cancelBooking(bookingId);
      if (res.success) {
        setBookings((prev) => prev.filter((b) => b.id !== bookingId));
        showToast('Booking cancelled.');
        loadData();
      }
    }
  };

  // ─── Inquiry Actions ────────────────────────────────────────────────────────
  const handleMarkInquiryRead = async (inquiryId) => {
    const res = await markInquiryRead(inquiryId);
    if (res.success) {
      setInquiries((prev) =>
        prev.map((i) => (i.id === inquiryId ? { ...i, read: true } : i))
      );
      showToast('Inquiry marked as read.');
      loadData();
    }
  };

  const handleDeleteInquiry = async (inquiryId) => {
    if (window.confirm('Delete this message?')) {
      const res = await deleteInquiry(inquiryId);
      if (res.success) {
        setInquiries((prev) => prev.filter((i) => i.id !== inquiryId));
        showToast('Message deleted.');
        loadData();
      }
    }
  };

  // ─── Walk-In Registration ───────────────────────────────────────────────────
  const handleWalkinSubmit = async (e) => {
    e.preventDefault();
    if (!walkinData.name.trim() || !walkinData.phone.trim()) {
      showToast('Name and phone are required.', 'error');
      return;
    }

    const plan = plansMap[walkinData.planId] || plansMap['pro-standard'];
    const isPaid = walkinData.paymentStatus.startsWith('Paid');

    const res = await registerMember({
      name: walkinData.name.trim(),
      phone: walkinData.phone.trim(),
      email: walkinData.email.trim() || `${walkinData.name.toLowerCase().replace(/\s+/g, '')}@goodlife.local`,
      planId: walkinData.planId,
      goal: walkinData.goal,
      preferredTime: walkinData.preferredTime,
      branch: 'Ghattekulo Main Branch (Kathmandu 44600)',
      status: isPaid ? 'active' : 'contacted',
      paymentStatus: walkinData.paymentStatus,
      paymentMethod: walkinData.paymentMethod,
      amountPaid: isPaid ? plan.priceMonthlyNPR : 0,
      notes: walkinData.notes.trim() || 'Registered at gym reception desk.',
    });

    if (res.success) {
      showToast(`Walk-in member ${walkinData.name} successfully registered!`);
      setShowAddModal(false);
      setWalkinData({
        name: '',
        phone: '',
        email: '',
        planId: 'pro-standard',
        goal: 'Fat Loss & Conditioning',
        preferredTime: 'Morning (6:00 AM - 9:00 AM)',
        paymentStatus: 'Paid (Cash)',
        paymentMethod: 'Cash at Reception',
        notes: '',
      });
      loadData();
    } else {
      showToast('Error registering walk-in member.', 'error');
    }
  };

  // ─── Filtered Members ───────────────────────────────────────────────────────
  const filteredMembers = useMemo(() => {
    return members.filter((m) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        m.name?.toLowerCase().includes(q) ||
        m.phone?.includes(searchQuery) ||
        m.email?.toLowerCase().includes(q) ||
        m.goal?.toLowerCase().includes(q) ||
        m.planId?.toLowerCase().includes(q);

      const matchesPipeline =
        pipelineFilter === 'all' ||
        (pipelineFilter === 'new' && m.status === 'pending') ||
        (pipelineFilter === 'contacted' && m.status === 'contacted') ||
        (pipelineFilter === 'active' && m.status === 'active') ||
        (pipelineFilter === 'overdue' && m.paymentStatus === 'Pending' && m.status === 'active');

      const matchesPayment =
        paymentFilter === 'all' ||
        (paymentFilter === 'paid' && m.paymentStatus?.startsWith('Paid')) ||
        (paymentFilter === 'pending' && m.paymentStatus === 'Pending');

      return matchesSearch && matchesPipeline && matchesPayment;
    });
  }, [members, searchQuery, pipelineFilter, paymentFilter]);

  // ─── Computed Analytics Fallback (if backend analytics not yet arrived) ─────
  const analytics = useMemo(() => {
    if (analyticsData) return analyticsData;

    // Local calculation fallback
    let projectedMRR = 0;
    let totalCollected = 0;
    let outstandingDues = 0;

    const activeMembers = members.filter((m) => m.status === 'active').length;
    const pendingLeads = members.filter((m) => m.status === 'pending').length;
    const contactedLeads = members.filter((m) => m.status === 'contacted').length;

    members.forEach((m) => {
      const plan = plansMap[m.planId] || plansMap['pro-standard'];
      const price = plan ? plan.priceMonthlyNPR : 4800;
      if (m.status === 'active') projectedMRR += price;
      if (m.paymentStatus && m.paymentStatus.startsWith('Paid')) {
        totalCollected += Number(m.amountPaid) || price;
      } else {
        outstandingDues += price;
      }
    });

    const conversionRate = members.length > 0 ? ((activeMembers / members.length) * 100).toFixed(1) : 0;
    const arpu = activeMembers > 0 ? Math.round(projectedMRR / activeMembers) : 0;

    return {
      kpi: {
        totalLeads: members.length,
        activeMembers,
        pendingLeads,
        contactedLeads,
        cancelledMembers: members.filter((m) => m.status === 'cancelled').length,
        projectedMRR,
        totalCollected,
        outstandingDues,
        conversionRate: Number(conversionRate),
        arpu,
        totalBookings: bookings.length,
        attendedBookings: bookings.filter((b) => b.status === 'attended').length,
        attendanceRate: bookings.length > 0 ? Math.round((bookings.filter((b) => b.status === 'attended').length / bookings.length) * 100) : 0,
        totalInquiries: inquiries.length,
        unreadInquiries: inquiries.filter((i) => !i.read).length,
      },
      financials: {
        projectedMRR,
        totalCollected,
        outstandingDues,
        planBreakdown: [
          { id: 'pro-standard', name: 'Pro Standard', count: 1, revenueNPR: 4800, percentage: 50 },
          { id: 'vip-elite', name: 'VIP Platinum', count: 1, revenueNPR: 8500, percentage: 50 },
        ],
        paymentBreakdown: [
          { method: 'eSewa Digital Wallet', count: 1, totalNPR: 4800, percentage: 36 },
          { method: 'Khalti Digital Wallet', count: 1, totalNPR: 8500, percentage: 64 },
        ],
      },
      conversionFunnel: [
        { stage: 'Web Traffic & Inquiries', count: inquiries.length + members.length + 15, percent: 100, drop: '0%' },
        { stage: 'Captured Member Leads', count: members.length, percent: 35, drop: '65%' },
        { stage: 'Contacted on WhatsApp / Phone', count: contactedLeads + activeMembers, percent: 25, drop: '28%' },
        { stage: 'Gym Tour & Trial Class', count: Math.max(1, activeMembers), percent: 18, drop: '28%' },
        { stage: 'Active Paid Membership', count: activeMembers, percent: 18, drop: '0%' },
      ],
      demographics: {
        peakHours: [
          { slot: 'Morning (6:00 AM - 9:00 AM)', count: 2, percentage: 67 },
          { slot: 'Mid-Day (11:00 AM - 3:00 PM)', count: 0, percentage: 0 },
          { slot: 'Evening (5:00 PM - 8:00 PM)', count: 1, percentage: 33 },
          { slot: 'Night (8:00 PM - 10:00 PM)', count: 0, percentage: 0 },
        ],
        topGoals: [
          { goal: 'Fat Loss & Conditioning', count: 1, percentage: 33 },
          { goal: 'Muscle Building & Hypertrophy', count: 1, percentage: 33 },
          { goal: 'General Health & Fitness', count: 1, percentage: 33 },
        ],
      },
      classes: {
        popularClasses: [],
        totalBookings: bookings.length,
        attendanceRate: 50,
      },
      recentActivity: [],
    };
  }, [analyticsData, members, bookings, inquiries, plansMap]);

  // ─── PIN Unlock Screen ──────────────────────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#07090e] flex items-center justify-center p-4 relative overflow-hidden font-sans">
        <SEOHead
          title="Gym Owner Admin CRM | Goodlife Fitness Kathmandu"
          description="Executive CRM and Business Analytics Portal for Goodlife Fitness Nepal."
        />

        {/* Ambient Glows */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-md rounded-3xl bg-slate-900/90 border border-slate-800 p-8 shadow-2xl backdrop-blur-xl relative z-10 text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/20 shadow-inner">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              GOODLIFE FITNESS • ADMIN CRM
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">Executive Management Portal</h1>
            <p className="text-xs text-slate-400">
              Access the live member database, MRR financial analytics, lead pipeline, and bookings.
            </p>
          </div>

          <form onSubmit={handlePinSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2 text-left">
                Security PIN Code
              </label>
              <input
                type="password"
                maxLength={8}
                value={pinInput}
                onChange={(e) => {
                  setPinInput(e.target.value);
                  setPinError(false);
                }}
                placeholder="Enter 4-digit PIN"
                autoFocus
                className={`w-full px-4 py-3.5 rounded-xl bg-slate-950 border text-center text-xl tracking-widest text-white font-mono placeholder:text-slate-600 focus:outline-none focus:ring-2 ${
                  pinError
                    ? 'border-rose-500 focus:ring-rose-500/40'
                    : 'border-slate-800 focus:border-emerald-500 focus:ring-emerald-500/20'
                }`}
              />
              {pinError && (
                <p className="text-rose-400 text-xs text-left mt-2 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                  Incorrect PIN code. Try default manager PIN: 1234
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Unlock className="w-4 h-4" />
              <span>Unlock CRM Dashboard</span>
            </button>
          </form>

          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
            <span>Default PIN: 1234</span>
            <Link to="/" className="text-emerald-400 hover:underline flex items-center gap-1">
              <span>Back to Public Site</span>
              <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ─── Main Admin CRM Interface ───────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 font-sans selection:bg-emerald-500 selection:text-slate-950">
      <SEOHead
        title="CRM & Business Analytics Hub | Goodlife Fitness Admin"
        description="Live CRM, Financials, Member Pipeline, and Class Bookings for Gym Owners."
      />

      {/* Floating Toast Notice */}
      {adminToast && (
        <div
          className={`fixed top-5 right-5 z-50 px-4 py-3 rounded-2xl border shadow-2xl flex items-center gap-2 text-xs font-bold transition-all animate-in fade-in slide-in-from-top-4 ${
            adminToast.type === 'error'
              ? 'bg-rose-950/90 border-rose-500/50 text-rose-200'
              : 'bg-emerald-950/90 border-emerald-500/50 text-emerald-200'
          }`}
        >
          {adminToast.type === 'error' ? <AlertCircle className="w-4 h-4 text-rose-400" /> : <CheckCircle className="w-4 h-4 text-emerald-400" />}
          <span>{adminToast.msg}</span>
        </div>
      )}

      {/* Top Header Bar */}
      <header className="sticky top-0 z-30 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* Logo & Gym Info */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center font-black text-slate-950 shadow-md shadow-emerald-500/20">
              GL
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm sm:text-base font-black text-white">Goodlife Gym CRM</h1>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono text-[9px] font-bold border border-emerald-500/30">
                  ENTERPRISE 2.0
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Ghattekulo Main Branch, Kathmandu (44600) • Live Gym Operations
              </p>
            </div>
          </div>

          {/* Backend Status & Fast Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Live Backend Connection Indicator */}
            <div
              className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[11px] font-mono ${
                backendStatus.connected
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
              }`}
              title={backendStatus.connected ? 'Express API on Port 5001 is connected' : 'Express backend offline'}
            >
              <span className={`w-2 h-2 rounded-full ${backendStatus.connected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
              <span>{backendStatus.connected ? `Live Backend: ${backendStatus.latency}ms` : 'Local Persistence Mode'}</span>
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-emerald-500/20 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ Register Walk-In</span>
            </button>

            {/* CSV Export Button */}
            <div className="relative group">
              <button
                onClick={() => triggerCSVDownload('members')}
                className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-semibold px-3"
                title="Export Members to CSV"
              >
                <Download className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden lg:inline">Export CSV</span>
              </button>
            </div>

            <button
              onClick={loadData}
              disabled={isRefreshing}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors cursor-pointer"
              title="Refresh Live Data"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-emerald-400' : ''}`} />
            </button>

            <Link
              to="/"
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:text-white transition-colors"
            >
              <span>View Site</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            <button
              onClick={handleLogout}
              className="px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-rose-500/50 text-xs text-rose-400 hover:text-rose-300 transition-colors cursor-pointer"
            >
              Lock
            </button>
          </div>

        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Navigation Tabs Bar */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 flex-wrap gap-3">
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-900/90 border border-slate-800 overflow-x-auto max-w-full">
            {[
              { id: 'analytics', label: 'CRM & Business Analytics', icon: TrendingUp, badge: 'LIVE' },
              { id: 'members', label: 'Members & Leads CRM', icon: Users, count: members.length },
              { id: 'bookings', label: 'Class Bookings', icon: CalendarCheck, count: bookings.length },
              { id: 'inquiries', label: 'Message Inbox', icon: Mail, count: inquiries.length, unread: analytics.kpi.unreadInquiries },
            ].map((tab) => {
              const Icon = tab.icon;
              const isCurrent = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
                    isCurrent
                      ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span className="px-1.5 py-0.2 rounded-full bg-slate-950/20 text-slate-950 font-mono text-[9px] font-black">
                      {tab.badge}
                    </span>
                  )}
                  {tab.count !== undefined && (
                    <span
                      className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                        isCurrent ? 'bg-slate-950/20 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                  {tab.unread > 0 && (
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                  )}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
            <span>Database:</span>
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <Database className="w-3 h-3" />
              {backendStatus.connected ? 'Live Express Engine' : 'Local Persistent Storage'}
            </span>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════════════ */}
        {/* TAB 1: CRM & BUSINESS ANALYTICS                                        */}
        {/* ═══════════════════════════════════════════════════════════════════════ */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">

            {/* 6 Executive KPI Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
              
              {/* Card 1: Total Leads */}
              <div className="rounded-2xl bg-slate-900/60 border border-slate-800/80 p-4 space-y-2 hover:border-slate-700 transition-colors">
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span>Total Leads & Members</span>
                  <Users className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-2xl font-black text-white font-mono">
                  {analytics.kpi.totalLeads}
                </div>
                <div className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                  <ArrowUpRight className="w-3 h-3" />
                  <span>{analytics.kpi.pendingLeads} pending review</span>
                </div>
              </div>

              {/* Card 2: Active Members */}
              <div className="rounded-2xl bg-slate-900/60 border border-slate-800/80 p-4 space-y-2 hover:border-slate-700 transition-colors">
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span>Active Paying Members</span>
                  <UserCheck className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="text-2xl font-black text-white font-mono">
                  {analytics.kpi.activeMembers}
                </div>
                <div className="text-[11px] text-cyan-400 font-medium">
                  {analytics.kpi.conversionRate}% lead conversion
                </div>
              </div>

              {/* Card 3: Projected MRR */}
              <div className="rounded-2xl bg-slate-900/60 border border-slate-800/80 p-4 space-y-2 hover:border-slate-700 transition-colors">
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span>Monthly Revenue (MRR)</span>
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-2xl font-black text-emerald-400 font-mono">
                  रु {analytics.kpi.projectedMRR.toLocaleString('en-NP')}
                </div>
                <div className="text-[11px] text-slate-400">
                  Recurring monthly run-rate
                </div>
              </div>

              {/* Card 4: Total Collected */}
              <div className="rounded-2xl bg-slate-900/60 border border-slate-800/80 p-4 space-y-2 hover:border-slate-700 transition-colors">
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span>Cash & Digital Collected</span>
                  <CreditCard className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-2xl font-black text-amber-300 font-mono">
                  रु {analytics.kpi.totalCollected.toLocaleString('en-NP')}
                </div>
                <div className="text-[11px] text-slate-400">
                  Via eSewa, Khalti & Cash
                </div>
              </div>

              {/* Card 5: Outstanding Dues */}
              <div className="rounded-2xl bg-slate-900/60 border border-slate-800/80 p-4 space-y-2 hover:border-slate-700 transition-colors">
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span>Pending Receivables</span>
                  <Clock className="w-4 h-4 text-rose-400" />
                </div>
                <div className="text-2xl font-black text-rose-400 font-mono">
                  रु {analytics.kpi.outstandingDues.toLocaleString('en-NP')}
                </div>
                <div className="text-[11px] text-slate-400">
                  Awaiting counter collection
                </div>
              </div>

              {/* Card 6: ARPU */}
              <div className="rounded-2xl bg-slate-900/60 border border-slate-800/80 p-4 space-y-2 hover:border-slate-700 transition-colors">
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span>Avg Revenue / Member</span>
                  <Activity className="w-4 h-4 text-purple-400" />
                </div>
                <div className="text-2xl font-black text-purple-300 font-mono">
                  रु {analytics.kpi.arpu.toLocaleString('en-NP')}
                </div>
                <div className="text-[11px] text-slate-400">
                  ARPU per active member
                </div>
              </div>

            </div>

            {/* Financial Breakdown & Payment Channels (2 Column) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Membership Plan Revenue Breakdown */}
              <div className="rounded-3xl bg-slate-900/50 border border-slate-800 p-6 space-y-5 shadow-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-emerald-400" />
                      <span>Revenue by Membership Tier</span>
                    </h3>
                    <p className="text-xs text-slate-400">Plan popularity and generated monthly revenue</p>
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-400">
                    MRR: रु {analytics.kpi.projectedMRR.toLocaleString('en-NP')}
                  </span>
                </div>

                <div className="space-y-4">
                  {analytics.financials?.planBreakdown?.map((p) => (
                    <div key={p.id} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-200">{p.name}</span>
                        <div className="flex items-center gap-3 font-mono">
                          <span className="text-slate-400">{p.count} members</span>
                          <span className="font-bold text-emerald-400">रु {p.revenueNPR.toLocaleString('en-NP')}</span>
                        </div>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
                          style={{ width: `${Math.max(5, p.percentage)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Channel Breakdown */}
              <div className="rounded-3xl bg-slate-900/50 border border-slate-800 p-6 space-y-5 shadow-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-amber-400" />
                      <span>Payment Channel Distribution</span>
                    </h3>
                    <p className="text-xs text-slate-400">Collections via Digital Wallets vs Counter Cash</p>
                  </div>
                  <span className="text-xs font-mono font-bold text-amber-400">
                    Total: रु {analytics.kpi.totalCollected.toLocaleString('en-NP')}
                  </span>
                </div>

                <div className="space-y-4">
                  {analytics.financials?.paymentBreakdown?.map((pm, idx) => {
                    const colors = [
                      'from-emerald-500 to-green-400',
                      'from-purple-500 to-indigo-400',
                      'from-amber-500 to-orange-400',
                      'from-cyan-500 to-blue-400',
                      'from-rose-500 to-pink-400',
                    ];
                    return (
                      <div key={idx} className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-slate-200">{pm.method}</span>
                          <div className="flex items-center gap-3 font-mono">
                            <span className="text-slate-400">{pm.count} payments</span>
                            <span className="font-bold text-white">रु {pm.totalNPR.toLocaleString('en-NP')}</span>
                          </div>
                        </div>
                        <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                          <div
                            className={`h-full bg-gradient-to-r ${colors[idx % colors.length]} rounded-full transition-all duration-500`}
                            style={{ width: `${Math.max(4, pm.percentage)}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* 5-Stage Sales & Conversion Funnel */}
            <div className="rounded-3xl bg-slate-900/50 border border-slate-800 p-6 space-y-5 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-cyan-400" />
                    <span>5-Stage Lead Conversion Funnel</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Visual path from website visitor inquiries to active paid gym members
                  </p>
                </div>
                <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-bold">
                  Overall Conversion: {analytics.kpi.conversionRate}%
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                {analytics.conversionFunnel?.map((stage, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-3 relative overflow-hidden group hover:border-slate-700 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="w-6 h-6 rounded-full bg-slate-800 text-slate-300 font-mono text-xs flex items-center justify-center font-bold">
                        {idx + 1}
                      </span>
                      {stage.drop !== '0%' && (
                        <span className="text-[10px] font-mono text-rose-400 bg-rose-950/40 px-1.5 py-0.5 rounded">
                          -{stage.drop} drop
                        </span>
                      )}
                    </div>
                    <div>
                      <div className="text-xl font-black text-white font-mono">{stage.count}</div>
                      <div className="text-[11px] text-slate-300 font-medium line-clamp-2 mt-0.5">{stage.stage}</div>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 rounded-full"
                        style={{ width: `${Math.max(5, stage.percent)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Peak Workout Hours & Top Fitness Goals (2 Column) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Peak Workout Hours */}
              <div className="rounded-3xl bg-slate-900/50 border border-slate-800 p-6 space-y-4 shadow-xl">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Clock className="w-4 h-4 text-emerald-400" />
                    <span>Peak Workout Hours (Kathmandu Shift Times)</span>
                  </h3>
                  <p className="text-xs text-slate-400">Gym floor congestion by preferred member timings</p>
                </div>

                <div className="space-y-3">
                  {analytics.demographics?.peakHours?.map((slot, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-300 font-medium">{slot.slot}</span>
                        <span className="font-mono text-slate-400">{slot.count} members ({slot.percentage}%)</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                          style={{ width: `${Math.max(4, slot.percentage)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Fitness Goals */}
              <div className="rounded-3xl bg-slate-900/50 border border-slate-800 p-6 space-y-4 shadow-xl">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Target className="w-4 h-4 text-cyan-400" />
                    <span>Top Member Fitness Goals</span>
                  </h3>
                  <p className="text-xs text-slate-400">Primary goals submitted on online join forms</p>
                </div>

                <div className="space-y-3">
                  {analytics.demographics?.topGoals?.map((goal, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-300 font-medium">{goal.goal}</span>
                        <span className="font-mono text-slate-400">{goal.count} members ({goal.percentage}%)</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                        <div
                          className="h-full bg-cyan-500 rounded-full transition-all duration-500"
                          style={{ width: `${Math.max(4, goal.percentage)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Real-Time Live Audit Activity Stream */}
            <div className="rounded-3xl bg-slate-900/50 border border-slate-800 p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Flame className="w-4 h-4 text-amber-400" />
                    <span>Live Operations & Activity Feed</span>
                  </h3>
                  <p className="text-xs text-slate-400">Real-time audit log of customer registrations, payments, and updates</p>
                </div>
                <span className="text-xs font-mono text-slate-400">
                  {analytics.recentActivity?.length || 0} events recorded
                </span>
              </div>

              <div className="divide-y divide-slate-800/60">
                {analytics.recentActivity?.length > 0 ? (
                  analytics.recentActivity.map((log) => (
                    <div key={log.id} className="py-3 flex items-start justify-between gap-4 text-xs">
                      <div className="flex items-start gap-2.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                        <div>
                          <p className="font-semibold text-slate-200">{log.details}</p>
                          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">{log.action}</span>
                        </div>
                      </div>
                      <span className="text-[11px] font-mono text-slate-500 shrink-0">
                        {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center text-xs text-slate-500">
                    No recent activity logged yet. Submissions on the website will stream here in real-time.
                  </div>
                )}
              </div>
            </div>

            {/* Quick Export & Actions Center */}
            <div className="rounded-3xl bg-slate-900/40 border border-slate-800 p-6 flex items-center justify-between flex-wrap gap-4">
              <div>
                <h4 className="text-sm font-bold text-white">Commercial Gym Owner Export Tools</h4>
                <p className="text-xs text-slate-400">Download formatted accounting and membership spreadsheets</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => triggerCSVDownload('members')}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <Download className="w-4 h-4 text-emerald-400" />
                  <span>Download Members CSV</span>
                </button>
                <button
                  onClick={() => triggerCSVDownload('financials')}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <Download className="w-4 h-4 text-amber-400" />
                  <span>Download Financial Ledger CSV</span>
                </button>
              </div>
            </div>

          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════════ */}
        {/* TAB 2: MEMBERS & LEADS CRM                                              */}
        {/* ═══════════════════════════════════════════════════════════════════════ */}
        {activeTab === 'members' && (
          <div className="space-y-4">
            
            {/* Search & Pipeline Filters Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/60 border border-slate-800 p-3 rounded-2xl">
              
              {/* Search Box */}
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name, phone, email, goal..."
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              {/* Pipeline Filter Pills */}
              <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto p-1 bg-slate-950/80 rounded-xl border border-slate-800">
                  {[
                    { id: 'all', label: `All (${members.length})` },
                    { id: 'new', label: `New Leads (${members.filter((m) => m.status === 'pending').length})` },
                    { id: 'contacted', label: `Contacted (${members.filter((m) => m.status === 'contacted').length})` },
                    { id: 'active', label: `Active (${members.filter((m) => m.status === 'active').length})` },
                    { id: 'overdue', label: 'Payment Due' },
                  ].map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setPipelineFilter(p.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer shrink-0 ${
                        pipelineFilter === p.id
                          ? 'bg-emerald-500 text-slate-950 shadow-sm'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>

                {/* Payment Status Dropdown Filter */}
                <select
                  value={paymentFilter}
                  onChange={(e) => setPaymentFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-semibold text-slate-300 focus:outline-none focus:border-emerald-500 cursor-pointer shrink-0"
                >
                  <option value="all">💳 All Payments</option>
                  <option value="paid">🟢 Paid Members</option>
                  <option value="pending">⚠️ Pending Due</option>
                </select>
              </div>

            </div>

            {/* Table or Empty State */}
            {filteredMembers.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-800 bg-slate-900/30 p-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto">
                  <UserCheck className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-white">No Customer Records Found</h3>
                  <p className="text-xs text-slate-400 max-w-md mx-auto">
                    When visitors on your website submit the Join modal or pricing plans, their name, phone, email, and goals appear here instantly.
                  </p>
                </div>
                <div className="pt-2 flex items-center justify-center">
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="px-5 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 cursor-pointer"
                  >
                    + Register Walk-In Member
                  </button>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-3xl border border-slate-800 bg-slate-900/50 shadow-2xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950/80 text-slate-400 uppercase font-mono text-[10px] tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="px-5 py-4">Customer Profile</th>
                      <th className="px-5 py-4">Goal & Preferred Timing</th>
                      <th className="px-5 py-4">Plan & NPR Value</th>
                      <th className="px-5 py-4">Payment Status</th>
                      <th className="px-5 py-4">Pipeline Status</th>
                      <th className="px-5 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {filteredMembers.map((m) => {
                      const plan = plansMap[m.planId] || plansMap['pro-standard'];
                      const cleanPhone = m.phone ? m.phone.replace(/[^\d]/g, '') : '';
                      const nepalWhatsAppNumber = cleanPhone.startsWith('977')
                        ? cleanPhone
                        : `977${cleanPhone.slice(-10)}`;
                      const waUrl = `https://wa.me/${nepalWhatsAppNumber}?text=${encodeURIComponent(
                        `Namaste ${m.name}! 🙏 This is Goodlife Fitness (Ghattekulo, Kathmandu). We received your interest in the ${plan?.name || 'membership'} plan! When would you like to visit our facility for your gym tour?`
                      )}`;

                      return (
                        <tr
                          key={m.id}
                          className="hover:bg-slate-800/40 transition-colors group"
                        >
                          {/* Profile */}
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 flex items-center justify-center font-bold text-emerald-300 font-mono text-xs">
                                {m.name ? m.name.substring(0, 2).toUpperCase() : 'CU'}
                              </div>
                              <div>
                                <div className="font-bold text-white text-sm flex items-center gap-2">
                                  <span>{m.name}</span>
                                  {m.status === 'pending' && (
                                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" title="New Uncontacted Lead" />
                                  )}
                                </div>
                                <div className="text-[11px] text-slate-400 font-mono flex items-center gap-2 mt-0.5">
                                  <span>🇳🇵 {m.phone}</span>
                                  <span>•</span>
                                  <span className="truncate max-w-[150px]">{m.email}</span>
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Goal & Timing */}
                          <td className="px-5 py-4">
                            <div className="space-y-1">
                              <span className="inline-block px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-[10px] font-medium border border-slate-700/60">
                                {m.goal || 'General Health'}
                              </span>
                              <div className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                                <Clock className="w-3 h-3 text-slate-500" />
                                <span>{m.preferredTime || 'Morning Shift'}</span>
                              </div>
                            </div>
                          </td>

                          {/* Plan */}
                          <td className="px-5 py-4">
                            <div className="space-y-0.5">
                              <div className="font-bold text-slate-200">{plan?.name || 'Pro Standard'}</div>
                              <div className="font-mono text-emerald-400 font-semibold text-[11px]">
                                रु {(plan?.priceMonthlyNPR || 4800).toLocaleString('en-NP')} /mo
                              </div>
                            </div>
                          </td>

                          {/* Payment Status Dropdown */}
                          <td className="px-5 py-4">
                            <select
                              value={m.paymentStatus || 'Pending'}
                              onChange={(e) => handlePaymentChange(m.id, e.target.value)}
                              className={`text-xs px-2.5 py-1 rounded-lg border font-semibold cursor-pointer focus:outline-none ${
                                m.paymentStatus?.startsWith('Paid')
                                  ? 'bg-emerald-950/70 border-emerald-500/40 text-emerald-300'
                                  : 'bg-rose-950/70 border-rose-500/40 text-rose-300'
                              }`}
                            >
                              <option value="Pending">⚠️ Pending Unpaid</option>
                              <option value="Paid (eSewa)">🟢 Paid (eSewa)</option>
                              <option value="Paid (Khalti)">🟣 Paid (Khalti)</option>
                              <option value="Paid (Cash)">💵 Paid (Cash at Counter)</option>
                              <option value="Paid (Bank)">🏦 Paid (Bank / Fonepay)</option>
                            </select>
                          </td>

                          {/* Pipeline Status Dropdown */}
                          <td className="px-5 py-4">
                            <select
                              value={m.status || 'pending'}
                              onChange={(e) => handleStatusChange(m.id, e.target.value)}
                              className={`text-xs px-2.5 py-1 rounded-lg border font-semibold cursor-pointer focus:outline-none ${
                                m.status === 'active'
                                  ? 'bg-emerald-950/70 border-emerald-500/40 text-emerald-300'
                                  : m.status === 'contacted'
                                  ? 'bg-cyan-950/70 border-cyan-500/40 text-cyan-300'
                                  : m.status === 'cancelled'
                                  ? 'bg-slate-900 border-slate-700 text-slate-400'
                                  : 'bg-amber-950/70 border-amber-500/40 text-amber-300'
                              }`}
                            >
                              <option value="pending">🟡 New Lead</option>
                              <option value="contacted">🔵 Contacted</option>
                              <option value="active">🟢 Active Member</option>
                              <option value="cancelled">⚪ Cancelled</option>
                            </select>
                          </td>

                          {/* Actions */}
                          <td className="px-5 py-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              
                              {/* 1-Click WhatsApp Button */}
                              <a
                                href={waUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="p-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition-colors"
                                title="Chat on WhatsApp"
                              >
                                <MessageSquare className="w-3.5 h-3.5" />
                              </a>

                              {/* Direct Phone Call */}
                              <a
                                href={`tel:${m.phone}`}
                                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                                title="Call Member"
                              >
                                <Phone className="w-3.5 h-3.5" />
                              </a>

                              {/* Print Receipt Button */}
                              <button
                                onClick={() => setReceiptMember(m)}
                                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                                title="Print Gym Invoice / Receipt"
                              >
                                <Receipt className="w-3.5 h-3.5 text-amber-400" />
                              </button>

                              {/* Profile & Notes Drawer */}
                              <button
                                onClick={() => {
                                  setSelectedMember(m);
                                  setNewNoteText('');
                                }}
                                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                                title="View Member Profile & Interaction Log"
                              >
                                <FileText className="w-3.5 h-3.5 text-cyan-400" />
                              </button>

                              {/* Delete Button */}
                              <button
                                onClick={() => handleDeleteMember(m.id, m.name)}
                                className="p-2 rounded-xl bg-slate-800 hover:bg-rose-900/40 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                                title="Delete Record"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>

                            </div>
                          </td>

                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════════ */}
        {/* TAB 3: CLASS BOOKINGS                                                  */}
        {/* ═══════════════════════════════════════════════════════════════════════ */}
        {activeTab === 'bookings' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <CalendarCheck className="w-4 h-4 text-cyan-400" />
                  <span>Class Reservations & Attendance Roster</span>
                </h3>
                <p className="text-xs text-slate-400">Manage studio spots booked by members</p>
              </div>
              <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950/50 px-3 py-1 rounded-full border border-cyan-500/30">
                {bookings.length} Total Bookings
              </span>
            </div>

            {bookings.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-800 bg-slate-900/30 p-12 text-center space-y-2">
                <Calendar className="w-12 h-12 text-slate-600 mx-auto" />
                <h4 className="text-base font-bold text-white">No Class Bookings Yet</h4>
                <p className="text-xs text-slate-400">Class bookings made on the /classes schedule will show up here.</p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-3xl border border-slate-800 bg-slate-900/50 shadow-2xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950/80 text-slate-400 uppercase font-mono text-[10px] tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="px-5 py-4">Member Name</th>
                      <th className="px-5 py-4">Class Details</th>
                      <th className="px-5 py-4">Day & Time</th>
                      <th className="px-5 py-4">Instructor</th>
                      <th className="px-5 py-4">Status</th>
                      <th className="px-5 py-4 text-right">Attendance Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {bookings.map((b) => (
                      <tr key={b.id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="px-5 py-4 font-bold text-white">
                          <div>{b.memberName}</div>
                          <div className="text-[11px] text-slate-400 font-mono">{b.memberPhone}</div>
                        </td>
                        <td className="px-5 py-4">
                          <div className="font-semibold text-slate-200">{b.className}</div>
                          <div className="text-[11px] text-slate-400 font-mono">{b.classRoom || 'Main Studio'}</div>
                        </td>
                        <td className="px-5 py-4 font-mono text-cyan-400 font-semibold">
                          {b.classDay} • {b.classTime}
                        </td>
                        <td className="px-5 py-4 text-slate-300">
                          {b.instructorName || 'Coach'}
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold ${
                              b.status === 'attended'
                                ? 'bg-emerald-950 border border-emerald-500/40 text-emerald-300'
                                : b.status === 'cancelled'
                                ? 'bg-rose-950 border border-rose-500/40 text-rose-300'
                                : 'bg-cyan-950 border border-cyan-500/40 text-cyan-300'
                            }`}
                          >
                            {b.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-right space-x-2">
                          {b.status !== 'attended' && (
                            <button
                              onClick={() => handleBookingStatus(b.id, 'attended')}
                              className="px-3 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 font-bold text-[11px] cursor-pointer"
                            >
                              Check-In
                            </button>
                          )}
                          {b.status !== 'cancelled' && (
                            <button
                              onClick={() => handleCancelBooking(b.id)}
                              className="px-3 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 font-bold text-[11px] cursor-pointer"
                            >
                              Cancel
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════════ */}
        {/* TAB 4: MESSAGE INBOX                                                   */}
        {/* ═══════════════════════════════════════════════════════════════════════ */}
        {activeTab === 'inquiries' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Mail className="w-4 h-4 text-amber-400" />
                  <span>Contact Inquiries & Feedback</span>
                </h3>
                <p className="text-xs text-slate-400">Messages submitted via the public Contact Us form</p>
              </div>
              <span className="text-xs font-mono font-bold text-amber-400 bg-amber-950/50 px-3 py-1 rounded-full border border-amber-500/30">
                {inquiries.length} Messages
              </span>
            </div>

            {inquiries.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-800 bg-slate-900/30 p-12 text-center space-y-2">
                <Mail className="w-12 h-12 text-slate-600 mx-auto" />
                <h4 className="text-base font-bold text-white">Inbox Clean</h4>
                <p className="text-xs text-slate-400">When visitors write messages on /contact, they will arrive here.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {inquiries.map((inq) => (
                  <div
                    key={inq.id}
                    className={`rounded-2xl border p-5 transition-all space-y-3 ${
                      inq.read
                        ? 'bg-slate-900/40 border-slate-800/80 text-slate-300'
                        : 'bg-slate-900/90 border-emerald-500/40 shadow-lg text-white'
                    }`}
                  >
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2.5">
                        <span className={`w-2.5 h-2.5 rounded-full ${inq.read ? 'bg-slate-600' : 'bg-emerald-400 animate-pulse'}`} />
                        <h4 className="font-bold text-sm text-white">{inq.name}</h4>
                        <span className="text-xs text-slate-400 font-mono">({inq.email} • {inq.phone})</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono text-slate-400">
                          {new Date(inq.submittedAt).toLocaleString()}
                        </span>
                        {!inq.read && (
                          <button
                            onClick={() => handleMarkInquiryRead(inq.id)}
                            className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 text-[11px] font-bold border border-emerald-500/30 cursor-pointer"
                          >
                            Mark Read
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteInquiry(inq.id)}
                          className="p-1 text-slate-400 hover:text-rose-400 cursor-pointer"
                          title="Delete message"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="text-xs font-semibold text-emerald-400 font-mono">
                      Subject: {inq.subject}
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/50 p-3 rounded-xl border border-slate-800">
                      {inq.message}
                    </p>

                    <div className="flex items-center gap-3 pt-1">
                      <a
                        href={`https://wa.me/977${inq.phone ? inq.phone.replace(/[^\d]/g, '').slice(-10) : ''}?text=${encodeURIComponent(
                          `Namaste ${inq.name}! 🙏 Goodlife Fitness team replying to your inquiry: "${inq.subject}". How can we assist you today?`
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5 transition-colors"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Reply via WhatsApp</span>
                      </a>
                      <a
                        href={`mailto:${inq.email}?subject=Goodlife Fitness Reply: ${encodeURIComponent(inq.subject)}`}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1.5 transition-colors"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Reply via Email</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>

      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* MODAL 1: WALK-IN MEMBER REGISTRATION                                   */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 space-y-6 shadow-2xl relative my-8">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold font-mono">
                <PlusCircle className="w-3.5 h-3.5" />
                FRONT DESK RECEPTION
              </div>
              <h3 className="text-xl font-black text-white">Register Walk-In Customer</h3>
              <p className="text-xs text-slate-400">Saves directly to the persistent gym database with instant receipt generation.</p>
            </div>

            <form onSubmit={handleWalkinSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={walkinData.name}
                    onChange={(e) => setWalkinData({ ...walkinData, name: e.target.value })}
                    placeholder="e.g. Ramesh Karki"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={walkinData.phone}
                    onChange={(e) => setWalkinData({ ...walkinData, phone: e.target.value })}
                    placeholder="9841XXXXXX"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Address</label>
                <input
                  type="email"
                  value={walkinData.email}
                  onChange={(e) => setWalkinData({ ...walkinData, email: e.target.value })}
                  placeholder="ramesh@gmail.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Select Membership Plan</label>
                  <select
                    value={walkinData.planId}
                    onChange={(e) => setWalkinData({ ...walkinData, planId: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="pro-standard">Pro Standard (रु 4,800/mo)</option>
                    <option value="vip-elite">VIP Platinum (रु 8,500/mo)</option>
                    <option value="basic-fit">Basic Fit (रु 2,500/mo)</option>
                    <option value="day-pass">Day Pass (रु 1,200)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Payment Mode</label>
                  <select
                    value={walkinData.paymentStatus}
                    onChange={(e) => setWalkinData({ ...walkinData, paymentStatus: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Paid (Cash)">💵 Paid (Cash at Counter)</option>
                    <option value="Paid (eSewa)">🟢 Paid (eSewa QR)</option>
                    <option value="Paid (Khalti)">🟣 Paid (Khalti QR)</option>
                    <option value="Paid (Bank)">🏦 Paid (Bank Transfer / Fonepay)</option>
                    <option value="Pending">⚠️ Unpaid / Trial First</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Primary Fitness Goal</label>
                  <select
                    value={walkinData.goal}
                    onChange={(e) => setWalkinData({ ...walkinData, goal: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Fat Loss & Conditioning">Fat Loss & Conditioning</option>
                    <option value="Muscle Building & Hypertrophy">Muscle Building & Hypertrophy</option>
                    <option value="Athletic Strength & Power">Athletic Strength & Power</option>
                    <option value="General Health & Fitness">General Health & Fitness</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Preferred Workout Shift</label>
                  <select
                    value={walkinData.preferredTime}
                    onChange={(e) => setWalkinData({ ...walkinData, preferredTime: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Morning (6:00 AM - 9:00 AM)">Morning (6:00 AM - 9:00 AM)</option>
                    <option value="Mid-Day (11:00 AM - 3:00 PM)">Mid-Day (11:00 AM - 3:00 PM)</option>
                    <option value="Evening (5:00 PM - 8:00 PM)">Evening (5:00 PM - 8:00 PM)</option>
                    <option value="Night (8:00 PM - 10:00 PM)">Night (8:00 PM - 10:00 PM)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Receptionist Notes</label>
                <textarea
                  rows={2}
                  value={walkinData.notes}
                  onChange={(e) => setWalkinData({ ...walkinData, notes: e.target.value })}
                  placeholder="Medical conditions, requested trainer, locker key..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 cursor-pointer flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>Confirm Registration</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* MODAL 2: PRINTABLE GYM TAX INVOICE & RECEIPT                           */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {receiptMember && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-md rounded-3xl bg-slate-900 border border-slate-700 p-6 sm:p-8 space-y-6 shadow-2xl relative">
            <button
              onClick={() => setReceiptMember(null)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Printable Receipt Area */}
            <div id="print-receipt-area" className="bg-white text-slate-900 p-6 rounded-2xl space-y-4 font-sans text-xs">
              <div className="text-center border-b pb-3 space-y-1">
                <h2 className="text-base font-black tracking-tight text-slate-950 uppercase">Goodlife Fitness Pvt. Ltd.</h2>
                <p className="text-[11px] text-slate-600">Ghattekulo-29, Kathmandu, Nepal • Phone: +977-1-4771234</p>
                <p className="text-[10px] font-mono text-slate-500">PAN / VAT Reg No: 601284920</p>
                <div className="pt-1">
                  <span className="px-2 py-0.5 rounded bg-slate-100 font-mono font-bold text-[10px] text-slate-700 border">
                    TAX INVOICE & CASH RECEIPT
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] border-b pb-3">
                <div>
                  <span className="text-slate-500 block">Receipt Number:</span>
                  <span className="font-mono font-bold text-slate-900">
                    {receiptMember.receiptNumber || `GLF-2026-${receiptMember.id ? receiptMember.id.slice(-4).toUpperCase() : 'REC1'}`}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-slate-500 block">Issue Date:</span>
                  <span className="font-mono font-bold text-slate-900">{new Date().toLocaleDateString()}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Member Name:</span>
                  <span className="font-bold text-slate-900">{receiptMember.name}</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-500 block">Contact Phone:</span>
                  <span className="font-mono text-slate-900">{receiptMember.phone}</span>
                </div>
              </div>

              <div className="space-y-2">
                <table className="w-full text-left text-[11px]">
                  <thead>
                    <tr className="border-b text-slate-500">
                      <th className="pb-1">Description</th>
                      <th className="pb-1 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="py-1 font-semibold text-slate-900">
                        {plansMap[receiptMember.planId]?.name || 'Gym Membership'} (1 Month)
                      </td>
                      <td className="py-1 text-right font-mono font-bold">
                        NPR {(plansMap[receiptMember.planId]?.priceMonthlyNPR || 4800).toLocaleString('en-NP')}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="border-t pt-2 space-y-1">
                <div className="flex justify-between text-xs font-black text-slate-950">
                  <span>TOTAL PAID:</span>
                  <span className="font-mono">
                    NPR {(plansMap[receiptMember.planId]?.priceMonthlyNPR || 4800).toLocaleString('en-NP')}
                  </span>
                </div>
                <div className="text-[10px] text-slate-500">
                  Payment Method: <span className="font-semibold text-slate-800">{receiptMember.paymentStatus || 'Paid'}</span>
                </div>
              </div>

              <div className="border-t pt-3 text-center text-[10px] text-slate-500 space-y-0.5">
                <p>Thank you for joining Goodlife Fitness! Stay Strong 🏋️</p>
                <p className="font-mono text-[9px]">Ghattekulo Main Branch • 24/7 Access Active</p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-mono">Official Document Ready</span>
              <button
                onClick={() => window.print()}
                className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 cursor-pointer flex items-center gap-2"
              >
                <Printer className="w-4 h-4" />
                <span>Print Official Invoice</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {/* DRAWER: MEMBER PROFILE & INTERACTION LOG                                */}
      {/* ═══════════════════════════════════════════════════════════════════════ */}
      {selectedMember && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-md bg-slate-900 border-l border-slate-800 h-full p-6 space-y-6 overflow-y-auto shadow-2xl animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm font-mono border border-emerald-500/30">
                  {selectedMember.name.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-black text-white text-base">{selectedMember.name}</h3>
                  <p className="text-xs text-slate-400 font-mono">ID: {selectedMember.id}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedMember(null)}
                className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Profile Stats */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
                <span className="text-slate-500 block">Phone:</span>
                <span className="font-mono text-white font-bold">{selectedMember.phone}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
                <span className="text-slate-500 block">Email:</span>
                <span className="text-white truncate block">{selectedMember.email}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
                <span className="text-slate-500 block">Plan Tier:</span>
                <span className="font-bold text-emerald-400">{plansMap[selectedMember.planId]?.name || selectedMember.planId}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
                <span className="text-slate-500 block">Payment:</span>
                <span className="font-semibold text-slate-200">{selectedMember.paymentStatus || 'Pending'}</span>
              </div>
            </div>

            {/* Fitness Details */}
            <div className="p-4 rounded-2xl bg-slate-950/50 border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Fitness Goal:</span>
                <span className="font-semibold text-white">{selectedMember.goal || 'General Health'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Shift Timing:</span>
                <span className="font-semibold text-white">{selectedMember.preferredTime || 'Morning'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Branch:</span>
                <span className="font-semibold text-white truncate max-w-[200px]">{selectedMember.branch}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Enrolled On:</span>
                <span className="font-mono text-slate-300">
                  {selectedMember.registeredAt ? new Date(selectedMember.registeredAt).toLocaleDateString() : 'N/A'}
                </span>
              </div>
            </div>

            {/* Interaction Log & Notes History */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-emerald-400" />
                <span>Interaction Log & Call Notes</span>
              </h4>

              <form onSubmit={handleAddNote} className="space-y-2">
                <textarea
                  rows={2}
                  value={newNoteText}
                  onChange={(e) => setNewNoteText(e.target.value)}
                  placeholder="Record reception call notes, tour feedback, trainer assignment..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500"
                />
                <button
                  type="submit"
                  className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Log Interaction Note</span>
                </button>
              </form>

              <div className="space-y-2 max-h-56 overflow-y-auto">
                {selectedMember.notesHistory && selectedMember.notesHistory.length > 0 ? (
                  selectedMember.notesHistory.map((nh, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs space-y-1">
                      <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
                        <span className="font-bold text-slate-400">{nh.author || 'Staff'}</span>
                        <span>{new Date(nh.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</span>
                      </div>
                      <p className="text-slate-300 leading-relaxed">{nh.text}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500 italic">No notes logged yet.</p>
                )}
              </div>
            </div>

            {/* Actions Bar */}
            <div className="pt-3 border-t border-slate-800 flex items-center gap-2">
              <button
                onClick={() => setReceiptMember(selectedMember)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Receipt className="w-4 h-4" />
                <span>Tax Receipt</span>
              </button>
              <a
                href={`tel:${selectedMember.phone}`}
                className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5"
              >
                <Phone className="w-4 h-4" />
                <span>Call Member</span>
              </a>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
