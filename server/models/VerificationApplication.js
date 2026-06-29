import mongoose from 'mongoose';

const verificationApplicationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  badgeType: {
    type: String,
    required: true,
    enum: ['creator', 'business', 'educator', 'artist', 'ngo']
  },
  socialUrl: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  reviewedAt: { type: Date, default: null }
}, { timestamps: true });

const VerificationApplication = mongoose.model('VerificationApplication', verificationApplicationSchema);
export default VerificationApplication;