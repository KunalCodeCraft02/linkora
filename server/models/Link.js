import mongoose from 'mongoose';

const linkSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true, trim: true },
  url: { type: String, required: true },
  linkType: {
    type: String,
    required: true,
    enum: [
      'youtube', 'instagram', 'twitter', 'github', 'product', 'affiliate',
      'free_download', 'event', 'newsletter', 'spotify', 'pay_tip',
      'whatsapp', 'instagram_grid', 'book_session', 'custom'
    ]
  },
  icon: { type: String, default: '' },
  isEnabled: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
  commissionRate: { type: Number, default: 0 },
  productName: { type: String, default: '' },
  goLiveAt: { type: Date, default: null },
  expiresAt: { type: Date, default: null },
  geoShowIn: [{ type: String }],
  geoHideIn: [{ type: String }],
  abTestActive: { type: Boolean, default: false },
  abVariants: [{
    title: String,
    clicks: { type: Number, default: 0 }
  }],
  abWinner: { type: String, default: '' },
  abStartedAt: { type: Date, default: null }
}, { timestamps: true });

linkSchema.index({ userId: 1, order: 1 });

const Link = mongoose.model('Link', linkSchema);
export default Link;