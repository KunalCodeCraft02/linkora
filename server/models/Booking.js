import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sessionName: { type: String, required: true },
  duration: { type: Number, required: true },
  price: { type: Number, required: true },
  visitorName: { type: String, required: true },
  visitorEmail: { type: String, required: true },
  bookedDate: { type: Date, required: true },
  bookedSlot: { type: String, required: true },
  status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' },
  razorpayOrderId: { type: String, default: '' },
  razorpayPaymentId: { type: String, default: '' }
}, { timestamps: true });

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;