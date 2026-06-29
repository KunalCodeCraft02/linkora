import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import { errorHandler } from './middleware/errorHandler.js';
import authRoutes from './routes/auth.routes.js';
import linkRoutes from './routes/link.routes.js';
import profileRoutes from './routes/profile.routes.js';
import publicRoutes from './routes/public.routes.js';
import analyticsRoutes from './routes/analytics.routes.js';
import productRoutes from './routes/product.routes.js';
import bookingRoutes from './routes/booking.routes.js';
import mediaKitRoutes from './routes/mediakit.routes.js';
import referralRoutes from './routes/referral.routes.js';
import directoryRoutes from './routes/directory.routes.js';
import verifyRoutes from './routes/verify.routes.js';
import aiRoutes from './routes/ai.routes.js';
import adminRoutes from './routes/admin.routes.js';

dotenv.config();
connectDB();

const app = express();

const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:5173',
  'http://localhost:3000'
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/links', linkRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/products', productRoutes);
app.use('/api/booking', bookingRoutes);
app.use('/api/mediakit', mediaKitRoutes);
app.use('/api/referral', referralRoutes);
app.use('/api/directory', directoryRoutes);
app.use('/api/verify', verifyRoutes);
app.use('/api/ai', aiRoutes);
app.use('/admin', adminRoutes);

app.get('/health', (_, res) => res.json({ ok: true }));

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
