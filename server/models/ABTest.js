import mongoose from 'mongoose';

const abTestSchema = new mongoose.Schema({
  linkId: { type: mongoose.Schema.Types.ObjectId, ref: 'Link', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  variantA: { title: String, clicks: { type: Number, default: 0 } },
  variantB: { title: String, clicks: { type: Number, default: 0 } },
  status: { type: String, enum: ['active', 'completed'], default: 'active' },
  winner: { type: String, default: '' },
  startedAt: { type: Date, default: Date.now },
  endedAt: { type: Date, default: null }
});

const ABTest = mongoose.model('ABTest', abTestSchema);
export default ABTest;