import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import MemberModel from './models/Member.js';
import BookingModel from './models/Booking.js';
import ContactModel from './models/Contact.js';
import connectDB, { isMongoConnected, getMongoDetails } from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'gym_store.json');

// Plan Price Lookup (NPR)
export const PLAN_PRICES = {
  'day-pass': { name: 'Day Pass', monthlyNPR: 1200, category: 'pass' },
  'basic-fit': { name: 'Basic Fit', monthlyNPR: 2500, category: 'membership' },
  'pro-standard': { name: 'Pro Standard', monthlyNPR: 4800, category: 'membership' },
  'vip-elite': { name: 'VIP Platinum', monthlyNPR: 8500, category: 'membership' },
};

// Initial Seed Data (Loaded if storage file doesn't exist yet)
const INITIAL_STORE = {
  members: [
    {
      id: 'mem-1001',
      name: 'Bikash Adhikari',
      email: 'bikash.adhikari@gmail.com',
      phone: '9841234567',
      planId: 'pro-standard',
      goal: 'Fat Loss & Conditioning',
      preferredTime: 'Morning (6:00 AM - 9:00 AM)',
      branch: 'Ghattekulo Main Branch (Kathmandu 44600)',
      status: 'active',
      paymentStatus: 'Paid (eSewa)',
      paymentMethod: 'eSewa Digital Wallet',
      amountPaid: 4800,
      receiptNumber: 'GLF-2026-0812',
      notes: 'Requested trainer induction on Monday morning.',
      notesHistory: [
        { id: 'n1', text: 'Enrolled via online portal. Payment received via eSewa.', author: 'System', timestamp: new Date(Date.now() - 12 * 86400000).toISOString() }
      ],
      registeredAt: new Date(Date.now() - 12 * 86400000).toISOString(),
      expiryDate: new Date(Date.now() + 18 * 86400000).toISOString(),
    },
    {
      id: 'mem-1002',
      name: 'Pooja Thapa',
      email: 'pooja.thapa@outlook.com',
      phone: '9813987654',
      planId: 'vip-elite',
      goal: 'Muscle Building & Hypertrophy',
      preferredTime: 'Evening (5:00 PM - 8:00 PM)',
      branch: 'Ghattekulo Main Branch (Kathmandu 44600)',
      status: 'active',
      paymentStatus: 'Paid (Khalti)',
      paymentMethod: 'Khalti Digital Wallet',
      amountPaid: 8500,
      receiptNumber: 'GLF-2026-0813',
      notes: 'VIP locker assigned #14. Sauna access active.',
      notesHistory: [
        { id: 'n2', text: 'VIP enrollment completed with Khalti.', author: 'System', timestamp: new Date(Date.now() - 8 * 86400000).toISOString() }
      ],
      registeredAt: new Date(Date.now() - 8 * 86400000).toISOString(),
      expiryDate: new Date(Date.now() + 22 * 86400000).toISOString(),
    },
    {
      id: 'mem-1003',
      name: 'Rohan Shrestha',
      email: 'rohan.shrestha@gmail.com',
      phone: '9860112233',
      planId: 'basic-fit',
      goal: 'General Health & Fitness',
      preferredTime: 'Morning (6:00 AM - 9:00 AM)',
      branch: 'Ghattekulo Main Branch (Kathmandu 44600)',
      status: 'contacted',
      paymentStatus: 'Pending',
      paymentMethod: 'Cash at Counter',
      amountPaid: 0,
      receiptNumber: null,
      notes: 'Called on WhatsApp. Coming for facility tour tomorrow at 7:30 AM.',
      notesHistory: [
        { id: 'n3', text: 'Submitted website join form.', author: 'System', timestamp: new Date(Date.now() - 3 * 86400000).toISOString() },
        { id: 'n4', text: 'Reception called to confirm gym tour timing.', author: 'Receptionist', timestamp: new Date(Date.now() - 1 * 86400000).toISOString() }
      ],
      registeredAt: new Date(Date.now() - 3 * 86400000).toISOString(),
      expiryDate: new Date(Date.now() + 27 * 86400000).toISOString(),
    }
  ],
  bookings: [
    {
      id: 'bkg-201',
      memberName: 'Bikash Adhikari',
      memberEmail: 'bikash.adhikari@gmail.com',
      memberPhone: '9841234567',
      classId: 'crossfit-cl1',
      className: 'High-Intensity CrossFit',
      classDay: 'Monday',
      classTime: '06:30 AM',
      classRoom: 'Functional Training Arena (Studio A)',
      instructorName: 'Ramesh Thapa',
      category: 'CrossFit',
      status: 'attended',
      bookedAt: new Date(Date.now() - 4 * 86400000).toISOString(),
    },
    {
      id: 'bkg-202',
      memberName: 'Pooja Thapa',
      memberEmail: 'pooja.thapa@outlook.com',
      memberPhone: '9813987654',
      classId: 'yoga-cl2',
      className: 'Morning Vinyasa Yoga Flow',
      classDay: 'Wednesday',
      classTime: '07:00 AM',
      classRoom: 'Zen Yoga Studio (Studio B)',
      instructorName: 'Sunita Gurung',
      category: 'Yoga',
      status: 'confirmed',
      bookedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    }
  ],
  inquiries: [
    {
      id: 'inq-301',
      name: 'Suman Sharma',
      email: 'suman.sharma@gmail.com',
      phone: '9851098765',
      subject: 'Inquiry on Personal Training for Weight Loss',
      message: 'Hello Goodlife team, do you provide 1-on-1 personal training packages with customized Nepali diet charts? Looking to join next week.',
      read: true,
      submittedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    }
  ],
  auditLogs: [
    {
      id: 'log-1',
      action: 'SYSTEM_INIT',
      details: 'Goodlife Fitness CRM storage initialized with high-availability local persistence and MongoDB Atlas sync.',
      category: 'system',
      timestamp: new Date().toISOString(),
    }
  ]
};

class GymStorage {
  constructor() {
    this.memoryStore = null;
    this.isSyncing = false;
    this.lastSyncedAt = null;
    this.initPromise = this.init();
  }

  async init() {
    try {
      if (process.env.VERCEL) {
        this.memoryStore = JSON.parse(JSON.stringify(INITIAL_STORE));
        return;
      }

      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }

      if (fs.existsSync(DATA_FILE)) {
        const raw = fs.readFileSync(DATA_FILE, 'utf8');
        this.memoryStore = JSON.parse(raw);
      } else {
        this.memoryStore = JSON.parse(JSON.stringify(INITIAL_STORE));
        await this.persist();
      }

      // Schedule background initial sync with MongoDB once connection is active
      setTimeout(() => {
        this.syncWithMongoDB().catch((err) => {
          console.warn('Initial MongoDB sync notice:', err.message);
        });
      }, 1500);
    } catch (err) {
      console.error('⚠️ Error initializing persistent gym storage:', err.message);
      this.memoryStore = JSON.parse(JSON.stringify(INITIAL_STORE));
    }
  }

  async persist() {
    if (process.env.VERCEL) return; // Serverless filesystem is read-only
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      const dataStr = JSON.stringify(this.memoryStore, null, 2);
      await fs.promises.writeFile(DATA_FILE, dataStr, 'utf8');
    } catch (err) {
      console.error('🔴 Failed to write storage file to disk:', err.message);
    }
  }

  async ensureReady() {
    if (!this.memoryStore) {
      await this.initPromise;
    }
    if (!isMongoConnected()) {
      try {
        await connectDB();
      } catch {
        // Continue with resilient local memory fallback
      }
    }
  }

  // ─── Cloud MongoDB Two-Way Synchronization ──────────────────────────────────
  async syncWithMongoDB() {
    await this.ensureReady();
    if (!isMongoConnected()) {
      return {
        success: false,
        message: 'MongoDB is currently offline. Operating on resilient local storage.',
        isMongo: false,
        counts: {
          members: this.memoryStore.members.length,
          bookings: this.memoryStore.bookings.length,
          inquiries: this.memoryStore.inquiries.length,
        },
      };
    }

    if (this.isSyncing) {
      return { success: true, message: 'Sync already in progress.' };
    }

    this.isSyncing = true;
    try {
      // 1. Sync Members
      const mongoMembers = await MemberModel.find().lean();
      const localMembers = this.memoryStore.members;

      // Upsert each local member into Atlas
      for (const m of localMembers) {
        await MemberModel.findOneAndUpdate(
          { $or: [{ id: m.id }, { email: m.email }] },
          {
            $set: {
              id: m.id,
              name: m.name,
              email: m.email,
              phone: m.phone,
              planId: m.planId,
              branch: m.branch,
              goal: m.goal,
              preferredTime: m.preferredTime,
              status: m.status,
              paymentStatus: m.paymentStatus,
              paymentMethod: m.paymentMethod,
              amountPaid: m.amountPaid,
              receiptNumber: m.receiptNumber,
              notes: m.notes,
              notesHistory: m.notesHistory,
              registeredAt: m.registeredAt,
              expiryDate: m.expiryDate,
            },
          },
          { upsert: true, returnDocument: 'after' }
        );
      }

      // Merge any member in Atlas back into local store if missing
      for (const mm of mongoMembers) {
        const exists = localMembers.some(
          (lm) => (mm.id && lm.id === mm.id) || lm.email === mm.email
        );
        if (!exists) {
          localMembers.push({
            id: mm.id || `mem-${mm._id}`,
            name: mm.name,
            email: mm.email,
            phone: mm.phone,
            planId: mm.planId || 'pro-standard',
            goal: mm.goal || 'General Health & Fitness',
            preferredTime: mm.preferredTime || 'Morning (6:00 AM - 9:00 AM)',
            branch: mm.branch || 'Ghattekulo Main Branch (Kathmandu 44600)',
            status: mm.status || 'pending',
            paymentStatus: mm.paymentStatus || 'Pending',
            paymentMethod: mm.paymentMethod || 'Unpaid',
            amountPaid: mm.amountPaid || 0,
            receiptNumber: mm.receiptNumber || null,
            notes: mm.notes || '',
            notesHistory: mm.notesHistory || [],
            registeredAt: mm.registeredAt || mm.createdAt || new Date().toISOString(),
            expiryDate: mm.expiryDate || null,
          });
        }
      }

      // 2. Sync Bookings
      const mongoBookings = await BookingModel.find().lean();
      const localBookings = this.memoryStore.bookings;

      for (const b of localBookings) {
        await BookingModel.findOneAndUpdate(
          { $or: [{ id: b.id }, { memberEmail: b.memberEmail, classId: b.classId, classDay: b.classDay }] },
          {
            $set: {
              id: b.id,
              memberName: b.memberName,
              memberEmail: b.memberEmail,
              memberPhone: b.memberPhone,
              classId: b.classId,
              className: b.className,
              classDay: b.classDay,
              classTime: b.classTime,
              classRoom: b.classRoom,
              instructorName: b.instructorName,
              category: b.category,
              status: b.status,
              bookedAt: b.bookedAt,
            },
          },
          { upsert: true, returnDocument: 'after' }
        );
      }

      for (const mb of mongoBookings) {
        const exists = localBookings.some(
          (lb) => (mb.id && lb.id === mb.id) || (lb.memberEmail === mb.memberEmail && lb.classId === mb.classId && lb.classDay === mb.classDay)
        );
        if (!exists) {
          localBookings.push({
            id: mb.id || `bkg-${mb._id}`,
            memberName: mb.memberName,
            memberEmail: mb.memberEmail,
            memberPhone: mb.memberPhone,
            classId: mb.classId,
            className: mb.className,
            classDay: mb.classDay,
            classTime: mb.classTime,
            classRoom: mb.classRoom || 'Main Studio',
            instructorName: mb.instructorName || 'Coach',
            category: mb.category || 'Fitness',
            status: mb.status || 'confirmed',
            bookedAt: mb.bookedAt || mb.createdAt || new Date().toISOString(),
          });
        }
      }

      // 3. Sync Contact Inquiries
      const mongoContacts = await ContactModel.find().lean();
      const localInquiries = this.memoryStore.inquiries;

      for (const inq of localInquiries) {
        await ContactModel.findOneAndUpdate(
          { $or: [{ id: inq.id }, { email: inq.email, message: inq.message }] },
          {
            $set: {
              id: inq.id,
              name: inq.name,
              email: inq.email,
              phone: inq.phone,
              subject: inq.subject,
              message: inq.message,
              read: inq.read,
              repliedAt: inq.repliedAt,
              submittedAt: inq.submittedAt,
            },
          },
          { upsert: true, returnDocument: 'after' }
        );
      }

      for (const mc of mongoContacts) {
        const exists = localInquiries.some(
          (li) => (mc.id && li.id === mc.id) || (li.email === mc.email && li.message === mc.message)
        );
        if (!exists) {
          localInquiries.push({
            id: mc.id || `inq-${mc._id}`,
            name: mc.name,
            email: mc.email,
            phone: mc.phone || '',
            subject: mc.subject || 'General Membership Inquiry',
            message: mc.message || '',
            read: mc.read || false,
            repliedAt: mc.repliedAt || null,
            submittedAt: mc.submittedAt || mc.createdAt || new Date().toISOString(),
          });
        }
      }

      await this.persist();
      this.lastSyncedAt = new Date().toISOString();

      return {
        success: true,
        message: 'MongoDB Atlas and local storage successfully synchronized.',
        isMongo: true,
        mongoDetails: getMongoDetails(),
        counts: {
          members: localMembers.length,
          bookings: localBookings.length,
          inquiries: localInquiries.length,
        },
        syncedAt: this.lastSyncedAt,
      };
    } catch (err) {
      console.error('Error during MongoDB sync:', err);
      return {
        success: false,
        message: `Sync warning: ${err.message}`,
        counts: {
          members: this.memoryStore.members.length,
          bookings: this.memoryStore.bookings.length,
          inquiries: this.memoryStore.inquiries.length,
        },
      };
    } finally {
      this.isSyncing = false;
    }
  }

  // ─── Audit Log ───────────────────────────────────────────────────────────────
  async logActivity(action, details, category = 'crm') {
    await this.ensureReady();
    const entry = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      action,
      details,
      category,
      timestamp: new Date().toISOString(),
    };
    this.memoryStore.auditLogs.unshift(entry);
    if (this.memoryStore.auditLogs.length > 250) {
      this.memoryStore.auditLogs = this.memoryStore.auditLogs.slice(0, 250);
    }
    await this.persist();
    return entry;
  }

  async getAuditLogs(limit = 50) {
    await this.ensureReady();
    return this.memoryStore.auditLogs.slice(0, limit);
  }

  // ─── Members & Leads CRM ─────────────────────────────────────────────────────
  async getMembers({ search = '', status = '', paymentStatus = '', limit = 200, page = 1 } = {}) {
    await this.ensureReady();
    let list = [];

    // Query live MongoDB Atlas directly when connected
    if (isMongoConnected()) {
      try {
        const mongoList = await MemberModel.find().lean();
        if (mongoList && mongoList.length > 0) {
          list = mongoList.map((m) => ({
            ...m,
            id: m.id || `mem-${m._id}`,
            _id: undefined,
          }));
        }
      } catch (err) {
        console.warn('Direct Atlas member read notice:', err.message);
      }
    }

    // Merge in any memory store records not present in Atlas
    if (this.memoryStore?.members) {
      for (const lm of this.memoryStore.members) {
        if (!list.some((m) => (m.id && m.id === lm.id) || (m.email && m.email === lm.email))) {
          list.push(lm);
        }
      }
    }

    if (search) {
      const q = search.toLowerCase().trim();
      list = list.filter(
        (m) =>
          m.name?.toLowerCase().includes(q) ||
          m.email?.toLowerCase().includes(q) ||
          m.phone?.includes(q) ||
          m.goal?.toLowerCase().includes(q) ||
          m.planId?.toLowerCase().includes(q) ||
          m.branch?.toLowerCase().includes(q) ||
          m.paymentMethod?.toLowerCase().includes(q)
      );
    }

    if (status && status !== 'all') {
      list = list.filter((m) => m.status === status);
    }

    if (paymentStatus && paymentStatus !== 'all') {
      if (paymentStatus === 'paid') {
        list = list.filter((m) => m.paymentStatus && m.paymentStatus.startsWith('Paid'));
      } else if (paymentStatus === 'pending') {
        list = list.filter((m) => m.paymentStatus === 'Pending');
      } else {
        list = list.filter((m) => m.paymentStatus === paymentStatus);
      }
    }

    // Sort newest first
    list.sort((a, b) => new Date(b.registeredAt || 0) - new Date(a.registeredAt || 0));

    const total = list.length;
    const startIndex = (page - 1) * limit;
    const paginated = list.slice(startIndex, startIndex + limit);

    return {
      members: paginated,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }

  async getMemberById(id) {
    await this.ensureReady();
    if (isMongoConnected()) {
      try {
        const found = await MemberModel.findOne({ id }).lean();
        if (found) {
          return { ...found, id: found.id || `mem-${found._id}`, _id: undefined };
        }
      } catch (err) {
        console.warn('Atlas getMemberById notice:', err.message);
      }
    }
    return this.memoryStore.members.find((m) => m.id === id) || null;
  }

  async createMember(data) {
    await this.ensureReady();

    const cleanName = (data.name || '').trim();
    const cleanEmail = (data.email || '').trim().toLowerCase();
    const cleanPhone = (data.phone || '').trim().replace(/[^\d+]/g, '');

    const existingIndex = this.memoryStore.members.findIndex(
      (m) => (m.email && m.email === cleanEmail) || (cleanPhone && m.phone === cleanPhone)
    );

    const planId = data.planId || 'pro-standard';
    const planInfo = PLAN_PRICES[planId] || PLAN_PRICES['pro-standard'];

    const expiry = new Date();
    expiry.setDate(expiry.getDate() + 30);

    const newMember = {
      id: data.id || `mem-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: cleanName,
      email: cleanEmail,
      phone: cleanPhone,
      planId: planId,
      goal: data.goal || 'General Health & Fitness',
      preferredTime: data.preferredTime || 'Morning (6:00 AM - 9:00 AM)',
      branch: data.branch || 'Ghattekulo Main Branch (Kathmandu 44600)',
      status: data.status || 'pending',
      paymentStatus: data.paymentStatus || 'Pending',
      paymentMethod: data.paymentMethod || 'Unpaid',
      amountPaid: data.amountPaid || (data.paymentStatus?.startsWith('Paid') ? planInfo.monthlyNPR : 0),
      receiptNumber: data.paymentStatus?.startsWith('Paid')
        ? `GLF-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`
        : null,
      notes: data.notes || '',
      notesHistory: [
        {
          id: `nh-${Date.now()}`,
          text: data.notes ? `Initial Note: ${data.notes}` : 'Member lead registered via website portal.',
          author: data.registeredBy || 'Web Portal',
          timestamp: new Date().toISOString(),
        },
      ],
      registeredAt: new Date().toISOString(),
      expiryDate: data.expiryDate || expiry.toISOString(),
    };

    if (existingIndex !== -1) {
      const existing = this.memoryStore.members[existingIndex];
      if (existing.status === 'pending') {
        const mergedMember = {
          ...existing,
          ...newMember,
          id: existing.id,
          registeredAt: existing.registeredAt,
          notesHistory: [
            ...existing.notesHistory,
            {
              id: `nh-${Date.now()}`,
              text: 'Re-submitted registration form on website.',
              author: 'System',
              timestamp: new Date().toISOString(),
            },
          ],
        };
        this.memoryStore.members[existingIndex] = mergedMember;
        await this.persist();
        await this.logActivity('LEAD_RESUBMITTED', `Existing lead ${cleanName} resubmitted interest in ${planInfo.name}.`);

        if (isMongoConnected()) {
          try {
            await MemberModel.findOneAndUpdate(
              { $or: [{ id: mergedMember.id }, { email: mergedMember.email }] },
              { $set: mergedMember },
              { upsert: true }
            );
          } catch (err) {
            console.warn('Atlas member upsert notice:', err.message);
          }
        }

        return mergedMember;
      }
    }

    this.memoryStore.members.unshift(newMember);
    await this.persist();

    await this.logActivity(
      'NEW_LEAD_CAPTURED',
      `New customer ${cleanName} registered for ${planInfo.name} (${cleanPhone}).`
    );

    // Synchronize to MongoDB Atlas immediately
    if (isMongoConnected()) {
      try {
        await MemberModel.findOneAndUpdate(
          { $or: [{ id: newMember.id }, { email: newMember.email }] },
          { $set: newMember },
          { upsert: true, returnDocument: 'after' }
        );
      } catch (err) {
        console.warn('Atlas member create notice:', err.message);
      }
    }

    return newMember;
  }

  async updateMember(id, updates) {
    await this.ensureReady();
    const index = this.memoryStore.members.findIndex((m) => m.id === id);
    if (index === -1) return null;

    const current = this.memoryStore.members[index];
    const planInfo = PLAN_PRICES[updates.planId || current.planId] || PLAN_PRICES['pro-standard'];

    let receiptNumber = current.receiptNumber;
    let amountPaid = current.amountPaid;

    if (updates.paymentStatus && updates.paymentStatus.startsWith('Paid') && !current.receiptNumber) {
      receiptNumber = `GLF-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      amountPaid = updates.amountPaid !== undefined ? updates.amountPaid : planInfo.monthlyNPR;
    }

    const updated = {
      ...current,
      ...updates,
      receiptNumber,
      amountPaid: updates.amountPaid !== undefined ? updates.amountPaid : amountPaid,
      updatedAt: new Date().toISOString(),
    };

    this.memoryStore.members[index] = updated;
    await this.persist();

    if (updates.status && updates.status !== current.status) {
      await this.logActivity(
        'MEMBER_STATUS_CHANGED',
        `Member ${current.name} status updated from "${current.status}" to "${updates.status}".`
      );
    }
    if (updates.paymentStatus && updates.paymentStatus !== current.paymentStatus) {
      await this.logActivity(
        'PAYMENT_RECORDED',
        `Payment marked for ${current.name}: ${updates.paymentStatus} (NPR ${updated.amountPaid}).`
      );
    }

    // Synchronize update to Atlas
    if (isMongoConnected()) {
      try {
        await MemberModel.findOneAndUpdate(
          { $or: [{ id: id }, { email: current.email }] },
          { $set: updated },
          { returnDocument: 'after' }
        );
      } catch (err) {
        console.warn('Atlas member update notice:', err.message);
      }
    }

    return updated;
  }

  async addMemberNote(id, noteText, author = 'Admin') {
    await this.ensureReady();
    const index = this.memoryStore.members.findIndex((m) => m.id === id);
    if (index === -1) return null;

    const current = this.memoryStore.members[index];
    const noteEntry = {
      id: `nh-${Date.now()}`,
      text: noteText.trim(),
      author,
      timestamp: new Date().toISOString(),
    };

    const notesHistory = Array.isArray(current.notesHistory) ? current.notesHistory : [];
    notesHistory.unshift(noteEntry);

    current.notesHistory = notesHistory;
    current.notes = noteText.trim();
    current.updatedAt = new Date().toISOString();

    this.memoryStore.members[index] = current;
    await this.persist();

    await this.logActivity('NOTE_ADDED', `Note logged on profile of ${current.name}: "${noteText.slice(0, 50)}..."`);

    if (isMongoConnected()) {
      try {
        await MemberModel.findOneAndUpdate(
          { $or: [{ id: id }, { email: current.email }] },
          { $set: { notes: current.notes, notesHistory: current.notesHistory, updatedAt: current.updatedAt } }
        );
      } catch (err) {
        console.warn('Atlas note update notice:', err.message);
      }
    }

    return current;
  }

  async deleteMember(id) {
    await this.ensureReady();
    const index = this.memoryStore.members.findIndex((m) => m.id === id);
    if (index === -1) return false;

    const removed = this.memoryStore.members.splice(index, 1)[0];
    await this.persist();

    await this.logActivity('MEMBER_DELETED', `Member profile for ${removed.name} was removed from CRM.`);

    if (isMongoConnected()) {
      try {
        await MemberModel.deleteOne({ $or: [{ id: id }, { email: removed.email }] });
      } catch (err) {
        console.warn('Atlas member delete notice:', err.message);
      }
    }

    return true;
  }

  // ─── Class Bookings ──────────────────────────────────────────────────────────
  async getBookings({ email = '', classId = '', status = '' } = {}) {
    await this.ensureReady();
    let list = [];

    if (isMongoConnected()) {
      try {
        const mongoBookings = await BookingModel.find().lean();
        if (mongoBookings && mongoBookings.length > 0) {
          list = mongoBookings.map((b) => ({
            ...b,
            id: b.id || `bkg-${b._id}`,
            _id: undefined,
          }));
        }
      } catch (err) {
        console.warn('Atlas getBookings notice:', err.message);
      }
    }

    if (this.memoryStore?.bookings) {
      for (const lb of this.memoryStore.bookings) {
        if (!list.some((b) => (b.id && b.id === lb.id) || (b.memberEmail === lb.memberEmail && b.classId === lb.classId && b.classDay === lb.classDay))) {
          list.push(lb);
        }
      }
    }

    if (email) {
      list = list.filter((b) => b.memberEmail?.toLowerCase() === email.toLowerCase().trim());
    }
    if (classId) {
      list = list.filter((b) => b.classId === classId);
    }
    if (status && status !== 'all') {
      list = list.filter((b) => b.status === status);
    }

    list.sort((a, b) => new Date(b.bookedAt || 0) - new Date(a.bookedAt || 0));
    return list;
  }

  async createBooking(data) {
    await this.ensureReady();

    const cleanEmail = (data.memberEmail || '').trim().toLowerCase();
    const cleanPhone = (data.memberPhone || '').trim();
    const cleanName = (data.memberName || '').trim();

    const duplicate = this.memoryStore.bookings.find(
      (b) =>
        b.memberEmail?.toLowerCase() === cleanEmail &&
        b.classId === data.classId &&
        b.classDay === data.classDay &&
        b.status === 'confirmed'
    );

    if (duplicate) {
      return { duplicate: true, booking: duplicate };
    }

    const newBooking = {
      id: `bkg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      memberName: cleanName,
      memberEmail: cleanEmail,
      memberPhone: cleanPhone,
      classId: data.classId,
      className: data.className,
      classDay: data.classDay,
      classTime: data.classTime,
      classRoom: data.classRoom || 'Main Studio',
      instructorName: data.instructorName || 'Goodlife Trainer',
      category: data.category || 'Fitness',
      status: 'confirmed',
      bookedAt: new Date().toISOString(),
    };

    this.memoryStore.bookings.unshift(newBooking);
    await this.persist();

    await this.logActivity(
      'CLASS_BOOKED',
      `${cleanName} reserved spot for ${data.className} (${data.classDay} at ${data.classTime}).`
    );

    if (isMongoConnected()) {
      try {
        await BookingModel.findOneAndUpdate(
          { id: newBooking.id },
          { $set: newBooking },
          { upsert: true, returnDocument: 'after' }
        );
      } catch (err) {
        console.warn('Atlas booking create notice:', err.message);
      }
    }

    return { duplicate: false, booking: newBooking };
  }

  async updateBooking(id, updates) {
    await this.ensureReady();
    const index = this.memoryStore.bookings.findIndex((b) => b.id === id);
    if (index === -1) return null;

    const current = this.memoryStore.bookings[index];
    const updated = {
      ...current,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    this.memoryStore.bookings[index] = updated;
    await this.persist();

    if (updates.status && updates.status !== current.status) {
      await this.logActivity(
        'BOOKING_STATUS_CHANGED',
        `Booking for ${current.memberName} (${current.className}) updated to ${updates.status}.`
      );
    }

    if (isMongoConnected()) {
      try {
        await BookingModel.findOneAndUpdate(
          { id: id },
          { $set: updated },
          { returnDocument: 'after' }
        );
      } catch (err) {
        console.warn('Atlas booking update notice:', err.message);
      }
    }

    return updated;
  }

  async deleteBooking(id) {
    await this.ensureReady();
    const index = this.memoryStore.bookings.findIndex((b) => b.id === id);
    if (index === -1) return false;

    const removed = this.memoryStore.bookings.splice(index, 1)[0];
    await this.persist();

    await this.logActivity('BOOKING_CANCELLED', `Cancelled booking for ${removed.memberName} (${removed.className}).`);

    if (isMongoConnected()) {
      try {
        await BookingModel.deleteOne({ id: id });
      } catch (err) {
        console.warn('Atlas booking delete notice:', err.message);
      }
    }

    return true;
  }

  // ─── Contact Inquiries ───────────────────────────────────────────────────────
  async getInquiries() {
    await this.ensureReady();
    let list = [];

    if (isMongoConnected()) {
      try {
        const mongoInquiries = await ContactModel.find().lean();
        if (mongoInquiries && mongoInquiries.length > 0) {
          list = mongoInquiries.map((c) => ({
            ...c,
            id: c.id || `inq-${c._id}`,
            _id: undefined,
          }));
        }
      } catch (err) {
        console.warn('Atlas getInquiries notice:', err.message);
      }
    }

    if (this.memoryStore?.inquiries) {
      for (const li of this.memoryStore.inquiries) {
        if (!list.some((i) => (i.id && i.id === li.id) || (i.email === li.email && i.message === li.message))) {
          list.push(li);
        }
      }
    }

    list.sort((a, b) => new Date(b.submittedAt || 0) - new Date(a.submittedAt || 0));
    return list;
  }

  async createInquiry(data) {
    await this.ensureReady();
    const cleanName = (data.name || '').trim();
    const cleanEmail = (data.email || '').trim().toLowerCase();

    const newInquiry = {
      id: `inq-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: cleanName,
      email: cleanEmail,
      phone: (data.phone || '').trim(),
      subject: data.subject || 'General Membership Inquiry',
      message: (data.message || '').trim(),
      read: false,
      submittedAt: new Date().toISOString(),
    };

    this.memoryStore.inquiries.unshift(newInquiry);
    await this.persist();

    await this.logActivity('INQUIRY_RECEIVED', `Inquiry from ${cleanName} regarding "${newInquiry.subject}".`);

    if (isMongoConnected()) {
      try {
        await ContactModel.findOneAndUpdate(
          { id: newInquiry.id },
          { $set: newInquiry },
          { upsert: true, returnDocument: 'after' }
        );
      } catch (err) {
        console.warn('Atlas inquiry create notice:', err.message);
      }
    }

    return newInquiry;
  }

  async updateInquiry(id, updates) {
    await this.ensureReady();
    const index = this.memoryStore.inquiries.findIndex((i) => i.id === id);
    if (index === -1) return null;

    const current = this.memoryStore.inquiries[index];
    const updated = {
      ...current,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    this.memoryStore.inquiries[index] = updated;
    await this.persist();

    if (isMongoConnected()) {
      try {
        await ContactModel.findOneAndUpdate(
          { id: id },
          { $set: updated },
          { returnDocument: 'after' }
        );
      } catch (err) {
        console.warn('Atlas inquiry update notice:', err.message);
      }
    }

    return updated;
  }

  async deleteInquiry(id) {
    await this.ensureReady();
    const index = this.memoryStore.inquiries.findIndex((i) => i.id === id);
    if (index === -1) return false;

    this.memoryStore.inquiries.splice(index, 1);
    await this.persist();

    if (isMongoConnected()) {
      try {
        await ContactModel.deleteOne({ id: id });
      } catch (err) {
        console.warn('Atlas inquiry delete notice:', err.message);
      }
    }

    return true;
  }

  // ─── CRM Analytics Calculation Engine ────────────────────────────────────────
  async calculateAnalytics() {
    await this.ensureReady();

    const { members } = await this.getMembers({ limit: 10000 });
    const bookings = await this.getBookings();
    const inquiries = await this.getInquiries();
    const auditLogs = this.memoryStore.auditLogs;

    // 1. High-Level KPI Summary
    const totalLeads = members.length;
    const activeMembers = members.filter((m) => m.status === 'active').length;
    const pendingLeads = members.filter((m) => m.status === 'pending').length;
    const contactedLeads = members.filter((m) => m.status === 'contacted').length;
    const cancelledMembers = members.filter((m) => m.status === 'cancelled').length;

    // Revenue calculations (NPR)
    let projectedMRR = 0;
    let totalCollected = 0;
    let outstandingDues = 0;

    const planRevenueMap = {
      'day-pass': { id: 'day-pass', name: 'Day Pass', count: 0, revenueNPR: 0, price: 1200 },
      'basic-fit': { id: 'basic-fit', name: 'Basic Fit', count: 0, revenueNPR: 0, price: 2500 },
      'pro-standard': { id: 'pro-standard', name: 'Pro Standard', count: 0, revenueNPR: 0, price: 4800 },
      'vip-elite': { id: 'vip-elite', name: 'VIP Platinum', count: 0, revenueNPR: 0, price: 8500 },
    };

    const paymentMethodMap = {
      'eSewa': { method: 'eSewa Digital Wallet', count: 0, totalNPR: 0 },
      'Khalti': { method: 'Khalti Digital Wallet', count: 0, totalNPR: 0 },
      'Cash': { method: 'Cash at Reception', count: 0, totalNPR: 0 },
      'Bank': { method: 'Bank Transfer / Fonepay', count: 0, totalNPR: 0 },
      'Pending': { method: 'Payment Pending', count: 0, totalNPR: 0 },
    };

    const timeDistributionMap = {
      'Morning (6:00 AM - 9:00 AM)': 0,
      'Mid-Day (11:00 AM - 3:00 PM)': 0,
      'Evening (5:00 PM - 8:00 PM)': 0,
      'Night (8:00 PM - 10:00 PM)': 0,
      'Flexible': 0,
    };

    const goalDistributionMap = {
      'Fat Loss & Conditioning': 0,
      'Muscle Building & Hypertrophy': 0,
      'Athletic Strength & Power': 0,
      'General Health & Fitness': 0,
      'Endurance & Cardio': 0,
    };

    const branchDistributionMap = {};

    members.forEach((m) => {
      const plan = planRevenueMap[m.planId] || planRevenueMap['pro-standard'];
      plan.count += 1;

      if (m.status === 'active') {
        projectedMRR += plan.price;
      }

      if (m.paymentStatus && m.paymentStatus.startsWith('Paid')) {
        const paidAmount = Number(m.amountPaid) || plan.price;
        totalCollected += paidAmount;
        plan.revenueNPR += paidAmount;

        if (m.paymentStatus.includes('eSewa')) {
          paymentMethodMap['eSewa'].count += 1;
          paymentMethodMap['eSewa'].totalNPR += paidAmount;
        } else if (m.paymentStatus.includes('Khalti')) {
          paymentMethodMap['Khalti'].count += 1;
          paymentMethodMap['Khalti'].totalNPR += paidAmount;
        } else if (m.paymentStatus.includes('Cash')) {
          paymentMethodMap['Cash'].count += 1;
          paymentMethodMap['Cash'].totalNPR += paidAmount;
        } else {
          paymentMethodMap['Bank'].count += 1;
          paymentMethodMap['Bank'].totalNPR += paidAmount;
        }
      } else {
        outstandingDues += plan.price;
        paymentMethodMap['Pending'].count += 1;
        paymentMethodMap['Pending'].totalNPR += plan.price;
      }

      if (m.preferredTime && timeDistributionMap[m.preferredTime] !== undefined) {
        timeDistributionMap[m.preferredTime] += 1;
      } else {
        timeDistributionMap['Flexible'] += 1;
      }

      if (m.goal && goalDistributionMap[m.goal] !== undefined) {
        goalDistributionMap[m.goal] += 1;
      } else if (m.goal) {
        goalDistributionMap[m.goal] = (goalDistributionMap[m.goal] || 0) + 1;
      }

      const bName = m.branch || 'Ghattekulo Main Branch (Kathmandu 44600)';
      branchDistributionMap[bName] = (branchDistributionMap[bName] || 0) + 1;
    });

    const conversionRate = totalLeads > 0 ? ((activeMembers / totalLeads) * 100).toFixed(1) : 0;
    const arpu = activeMembers > 0 ? Math.round(projectedMRR / activeMembers) : 0;

    // 2. Class Booking Analytics
    const totalBookings = bookings.length;
    const attendedBookings = bookings.filter((b) => b.status === 'attended').length;
    const cancelledBookings = bookings.filter((b) => b.status === 'cancelled').length;
    const attendanceRate = totalBookings > 0 ? ((attendedBookings / totalBookings) * 100).toFixed(1) : 0;

    const classStatsMap = {};
    bookings.forEach((b) => {
      if (!classStatsMap[b.className]) {
        classStatsMap[b.className] = {
          name: b.className,
          instructor: b.instructorName,
          category: b.category,
          bookingsCount: 0,
          attendedCount: 0,
        };
      }
      classStatsMap[b.className].bookingsCount += 1;
      if (b.status === 'attended') classStatsMap[b.className].attendedCount += 1;
    });

    const popularClasses = Object.values(classStatsMap)
      .sort((a, b) => b.bookingsCount - a.bookingsCount)
      .slice(0, 5);

    // 3. 5-Stage Sales Funnel
    const funnelStage1 = inquiries.length + totalLeads + 12;
    const funnelStage2 = totalLeads;
    const funnelStage3 = contactedLeads + activeMembers;
    const funnelStage4 = Math.max(attendedBookings, Math.round(activeMembers * 0.8));
    const funnelStage5 = activeMembers;

    const conversionFunnel = [
      { stage: 'Web Traffic & Inquiries', count: funnelStage1, percent: 100, drop: '0%' },
      {
        stage: 'Captured Member Leads',
        count: funnelStage2,
        percent: funnelStage1 > 0 ? Math.round((funnelStage2 / funnelStage1) * 100) : 0,
        drop: funnelStage1 > 0 ? `${Math.round(((funnelStage1 - funnelStage2) / funnelStage1) * 100)}%` : '0%',
      },
      {
        stage: 'Contacted on WhatsApp / Phone',
        count: funnelStage3,
        percent: funnelStage1 > 0 ? Math.round((funnelStage3 / funnelStage1) * 100) : 0,
        drop: funnelStage2 > 0 ? `${Math.round(((funnelStage2 - funnelStage3) / funnelStage2) * 100)}%` : '0%',
      },
      {
        stage: 'Gym Tour & Trial Class',
        count: funnelStage4,
        percent: funnelStage1 > 0 ? Math.round((funnelStage4 / funnelStage1) * 100) : 0,
        drop: funnelStage3 > 0 ? `${Math.round(((funnelStage3 - funnelStage4) / funnelStage3) * 100)}%` : '0%',
      },
      {
        stage: 'Active Paid Membership',
        count: funnelStage5,
        percent: funnelStage1 > 0 ? Math.round((funnelStage5 / funnelStage1) * 100) : 0,
        drop: funnelStage4 > 0 ? `${Math.round(((funnelStage4 - funnelStage5) / funnelStage4) * 100)}%` : '0%',
      },
    ];

    const peakHours = Object.entries(timeDistributionMap).map(([slot, count]) => ({
      slot,
      count,
      percentage: totalLeads > 0 ? Math.round((count / totalLeads) * 100) : 0,
    }));

    const topGoals = Object.entries(goalDistributionMap).map(([goal, count]) => ({
      goal,
      count,
      percentage: totalLeads > 0 ? Math.round((count / totalLeads) * 100) : 0,
    }));

    const planBreakdown = Object.values(planRevenueMap).map((p) => ({
      ...p,
      percentage: totalLeads > 0 ? Math.round((p.count / totalLeads) * 100) : 0,
    }));

    const paymentBreakdown = Object.values(paymentMethodMap).map((pm) => ({
      ...pm,
      percentage: totalLeads > 0 ? Math.round((pm.count / totalLeads) * 100) : 0,
    }));

    const mongoStatus = getMongoDetails();

    return {
      kpi: {
        totalLeads,
        activeMembers,
        pendingLeads,
        contactedLeads,
        cancelledMembers,
        projectedMRR,
        totalCollected,
        outstandingDues,
        conversionRate: Number(conversionRate),
        arpu,
        totalBookings,
        attendedBookings,
        cancelledBookings,
        attendanceRate: Number(attendanceRate),
        totalInquiries: inquiries.length,
        unreadInquiries: inquiries.filter((i) => !i.read).length,
      },
      financials: {
        projectedMRR,
        totalCollected,
        outstandingDues,
        planBreakdown,
        paymentBreakdown,
      },
      conversionFunnel,
      demographics: {
        peakHours,
        topGoals,
        branches: branchDistributionMap,
      },
      classes: {
        popularClasses,
        totalBookings,
        attendanceRate: Number(attendanceRate),
      },
      recentActivity: auditLogs.slice(0, 15),
      storageInfo: {
        mode: mongoStatus.connected ? 'MongoDB Atlas (Cloud Synchronized)' : 'High-Availability Local JSON Persistent Store',
        isMongo: mongoStatus.connected,
        mongoDetails: mongoStatus,
        lastSyncedAt: this.lastSyncedAt,
        path: DATA_FILE,
        lastUpdated: new Date().toISOString(),
      },
    };
  }

  // ─── CSV Exporters ───────────────────────────────────────────────────────────
  async exportMembersCSV() {
    await this.ensureReady();
    const headers = [
      'ID',
      'Name',
      'Phone',
      'Email',
      'Plan',
      'Status',
      'Payment Status',
      'Amount Paid (NPR)',
      'Receipt No',
      'Fitness Goal',
      'Preferred Timing',
      'Branch',
      'Registered Date',
      'Expiry Date',
      'Notes',
    ];

    const rows = this.memoryStore.members.map((m) => [
      `"${m.id || ''}"`,
      `"${(m.name || '').replace(/"/g, '""')}"`,
      `"${m.phone || ''}"`,
      `"${m.email || ''}"`,
      `"${m.planId || ''}"`,
      `"${m.status || ''}"`,
      `"${m.paymentStatus || ''}"`,
      m.amountPaid || 0,
      `"${m.receiptNumber || ''}"`,
      `"${(m.goal || '').replace(/"/g, '""')}"`,
      `"${(m.preferredTime || '').replace(/"/g, '""')}"`,
      `"${(m.branch || '').replace(/"/g, '""')}"`,
      `"${m.registeredAt ? new Date(m.registeredAt).toLocaleDateString() : ''}"`,
      `"${m.expiryDate ? new Date(m.expiryDate).toLocaleDateString() : ''}"`,
      `"${(m.notes || '').replace(/"/g, '""')}"`,
    ]);

    return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  }

  async exportFinancialsCSV() {
    await this.ensureReady();
    const headers = ['Receipt No', 'Member Name', 'Phone', 'Email', 'Plan ID', 'Payment Mode', 'Amount Paid (NPR)', 'Date'];
    const paidMembers = this.memoryStore.members.filter((m) => m.paymentStatus && m.paymentStatus.startsWith('Paid'));

    const rows = paidMembers.map((m) => [
      `"${m.receiptNumber || 'N/A'}"`,
      `"${(m.name || '').replace(/"/g, '""')}"`,
      `"${m.phone || ''}"`,
      `"${m.email || ''}"`,
      `"${m.planId || ''}"`,
      `"${m.paymentStatus || ''}"`,
      m.amountPaid || 0,
      `"${m.registeredAt ? new Date(m.registeredAt).toLocaleDateString() : ''}"`,
    ]);

    return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  }
}

// Singleton storage instance
export const storage = new GymStorage();
export default storage;
