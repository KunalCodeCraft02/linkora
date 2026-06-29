import express from 'express';
import { getReferralStats, getReferralLink } from '../controllers/referral.controller.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/stats', protect, getReferralStats);
router.get('/link', protect, getReferralLink);

export default router;