import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      index: true,
      sparse: true,
    },
    // Who booked
    memberName: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    memberEmail: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
    },
    memberPhone: {
      type: String,
      trim: true,
    },
    // Which class
    classId: {
      type: String,
      required: [true, 'Class ID is required'],
    },
    className: {
      type: String,
      required: true,
    },
    classDay: {
      type: String,
      required: true,
    },
    classTime: {
      type: String,
      required: true,
    },
    classRoom: {
      type: String,
      default: 'Main Studio',
    },
    instructorName: {
      type: String,
      default: 'Coach',
    },
    category: {
      type: String,
      default: 'Fitness',
    },
    // Status
    status: {
      type: String,
      enum: ['confirmed', 'cancelled', 'attended'],
      default: 'confirmed',
    },
    bookedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Booking = mongoose.models.Booking || mongoose.model('Booking', bookingSchema);
export default Booking;
