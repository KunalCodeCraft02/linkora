import mongoose from 'mongoose';

const creatorAvailabilitySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  availableDays: [{ type: Number, min: 0, max: 6 }],
  timeSlots: [{ type: String }],
  duration: { type: Number, default: 30 },
  price: { type: Number, default: 0 },
  bufferMinutes: { type: Number, default: 15 },
  sessionName: { type: String, default: 'Session' },
  isActive: { type: Boolean, default: true }
});

const CreatorAvailability = mongoose.model('CreatorAvailability', creatorAvailabilitySchema);
export default CreatorAvailability;