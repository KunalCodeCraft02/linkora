import express from 'express';
import { applyForVerification, getVerificationStatus } from '../controllers/verify.controller.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/apply', protect, applyForVerification);
router.get('/status', protect, getVerificationStatus);

export default router;