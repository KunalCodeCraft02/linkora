import mongoose from 'mongoose';

const emailCaptureSchema = new mongoose.Schema({
  linkId: { type: mongoose.Schema.Types.ObjectId, ref: 'Link', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  visitorName: { type: String, default: '' },
  visitorEmail: { type: String, required: true },
  visitorWhatsApp: { type: String, default: '' },
  capturedAt: { type: Date, default: Date.now }
});

emailCaptureSchema.index({ userId: 1, capturedAt: -1 });

const EmailCapture = mongoose.model('EmailCapture', emailCaptureSchema);
export default EmailCapture;