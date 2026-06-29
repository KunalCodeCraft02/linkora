import mongoose from 'mongoose';

const clickEventSchema = new mongoose.Schema({
  linkId: { type: mongoose.Schema.Types.ObjectId, ref: 'Link', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  clickedAt: { type: Date, default: Date.now },
  referrer: { type: String, default: '' },
  country: { type: String, default: '' },
  isAffiliate: { type: Boolean, default: false },
  isQR: { type: Boolean, default: false },
  abVariant: { type: String, default: '' }
});

clickEventSchema.index({ userId: 1, clickedAt: -1 });
clickEventSchema.index({ linkId: 1 });

const ClickEvent = mongoose.model('ClickEvent', clickEventSchema);
export default ClickEvent;