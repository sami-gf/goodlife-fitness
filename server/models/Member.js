import mongoose from 'mongoose';

const noteHistorySchema = new mongoose.Schema(
  {
    id: { type: String },
    text: { type: String, required: true },
    author: { type: String, default: 'Admin' },
    timestamp: { type: Date, default: Date.now },
  },
  { _id: false }
);

const memberSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      index: true,
      sparse: true,
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [60, 'Name must not exceed 60 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
      match: [/^[\w.+-]+@[\w-]+\.[a-z]{2,}$/i, 'Invalid email format'],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
      match: [/^[0-9+\s\-]{7,20}$/, 'Invalid phone number format'],
    },
    planId: {
      type: String,
      required: [true, 'Membership plan is required'],
      default: 'pro-standard',
    },
    branch: {
      type: String,
      default: 'Ghattekulo Main Branch (Kathmandu 44600)',
    },
    goal: {
      type: String,
      default: 'General Health & Fitness',
    },
    preferredTime: {
      type: String,
      default: 'Morning (6:00 AM - 9:00 AM)',
    },
    status: {
      type: String,
      enum: ['pending', 'contacted', 'active', 'cancelled'],
      default: 'pending',
    },
    paymentStatus: {
      type: String,
      default: 'Pending',
    },
    paymentMethod: {
      type: String,
      default: 'Unpaid',
    },
    amountPaid: {
      type: Number,
      default: 0,
    },
    receiptNumber: {
      type: String,
      default: null,
    },
    notes: {
      type: String,
      default: '',
    },
    notesHistory: {
      type: [noteHistorySchema],
      default: [],
    },
    registeredAt: {
      type: Date,
      default: Date.now,
    },
    expiryDate: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

memberSchema.index({ email: 1 }, { unique: false });
memberSchema.index({ phone: 1 }, { unique: false });

const Member = mongoose.models.Member || mongoose.model('Member', memberSchema);
export default Member;
