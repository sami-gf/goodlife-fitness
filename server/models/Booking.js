import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
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
      required: [true, 'Phone is required'],
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
    },
    instructorName: {
      type: String,
    },
    category: {
      type: String,
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

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;
