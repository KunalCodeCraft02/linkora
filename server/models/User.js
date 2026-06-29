import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6 },
  username: { type: String, required: true, unique: true, lowercase: true, trim: true, match: [/^[a-z0-9_-]+$/, 'Username can only contain letters, numbers, underscores, and hyphens'] },
  avatar: { type: String, default: '' },
  bio: { type: String, default: '', maxlength: 150 },
  theme: { type: String, default: 'midnight' },
  language: { type: String, default: 'en', enum: ['en', 'hi', 'mr', 'ta', 'te', 'bn', 'kn', 'gu'] },
  niche: { type: String, default: '' },
  country: { type: String, default: '' },
  isVerified: { type: Boolean, default: false },
  verifiedBadgeType: { type: String, default: '' },
  referredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  referralCode: { type: String, unique: true },
  referralCount: { type: Number, default: 0 },
  referralRewardMonths: { type: Number, default: 0 },
  isPro: { type: Boolean, default: false },
  proExpiresAt: { type: Date, default: null },
  directoryOptIn: { type: Boolean, default: true },
  pageScore: { type: Number, default: 0 }
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;