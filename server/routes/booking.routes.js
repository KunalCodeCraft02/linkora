import express from 'express';
import { setAvailability, getAvailability, createBooking, verifyBooking, getBookings, cancelBooking } from '../controllers/booking.controller.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/availability', protect, setAvailability);
router.get('/availability/:username', getAvailability);
router.post('/create', createBooking);
router.post('/verify', verifyBooking);
router.get('/list', protect, getBookings);
router.put('/:id/cancel', protect, cancelBooking);

export default router;