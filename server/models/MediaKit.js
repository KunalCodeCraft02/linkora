import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const mediaKitSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  niche: { type: String, default: '' },
  platforms: [{
    name: String,
    followers: Number,
    engagementRate: Number
  }],
  audienceAge: { type: String, default: '' },
  audienceGender: { type: String, default: '' },
  topContent: [{ type: String }],
  pastCollabs: [{
    brand: String,
    description: String
  }],
  rateCard: { type: String, default: '' },
  shareToken: { type: String, unique: true, default: () => uuidv4() },
  lastGeneratedAt: { type: Date, default: null }
}, { timestamps: true });

const MediaKit = mongoose.model('MediaKit', mediaKitSchema);
export default MediaKit;