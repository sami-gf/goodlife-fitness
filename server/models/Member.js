import mongoose from 'mongoose';

const memberSchema = new mongoose.Schema(
  {
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
      match: [/^[0-9+\s\-]{10,15}$/, 'Invalid phone number format'],
    },
    planId: {
      type: String,
      required: [true, 'Membership plan is required'],
      enum: ['day-pass', 'basic-fit', 'pro-standard', 'vip-elite'],
      default: 'pro-standard',
    },
    branch: {
      type: String,
      default: 'Ghattekulo Main Branch, Kathmandu (44600)',
    },
    status: {
      type: String,
      enum: ['pending', 'active', 'cancelled'],
      default: 'pending',
    },
    registeredAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Prevent duplicate email registrations
memberSchema.index({ email: 1 }, { unique: false }); // allow re-registration

const Member = mongoose.model('Member', memberSchema);
export default Member;
