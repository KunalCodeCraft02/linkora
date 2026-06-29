import mongoose from 'mongoose';

const weeklyInsightSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  insights: [{ type: String }],
  weekOf: { type: Date, required: true },
  isRead: { type: Boolean, default: false }
}, { timestamps: true });

const WeeklyInsight = mongoose.model('WeeklyInsight', weeklyInsightSchema);
export default WeeklyInsight;