import Booking from '../models/Booking.js';
import CreatorAvailability from '../models/CreatorAvailability.js';
import User from '../models/User.js';
import { sendBookingConfirmation, sendCreatorBookingNotification } from '../utils/email.js';
import Razorpay from 'razorpay';

let razorpay;
const getRazorpay = () => {
  if (!razorpay) razorpay = new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET });
  return razorpay;
};

export const setAvailability = async (req, res, next) => {
  try {
    const { availableDays, timeSlots, duration, price, bufferMinutes, sessionName } = req.body;

    const availability = await CreatorAvailability.findOneAndUpdate(
      { userId: req.user._id },
      { availableDays, timeSlots, duration, price, bufferMinutes, sessionName, isActive: true },
      { new: true, upsert: true, runValidators: true }
    );

    res.json(availability);
  } catch (error) {
    next(error);
  }
};

export const getAvailability = async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.params.username.toLowerCase() });
    if (!user) {
      return res.status(404).json({ message: 'Creator not found' });
    }

    const availability = await CreatorAvailability.findOne({ userId: user._id });
    if (!availability || !availability.isActive) {
      return res.status(404).json({ message: 'Booking not available' });
    }

    const { date } = req.query;
    const requestedDate = new Date(date);
    const dayOfWeek = requestedDate.getDay();

    if (!availability.availableDays.includes(dayOfWeek)) {
      return res.json({ slots: [] });
    }

    const existingBookings = await Booking.find({
      userId: user._id,
      bookedDate: requestedDate,
      status: { $in: ['pending', 'confirmed'] }
    });

    const bookedSlots = existingBookings.map(b => b.bookedSlot);

    const availableSlots = availability.timeSlots.filter(slot => !bookedSlots.includes(slot));

    res.json({ slots: availableSlots, duration: availability.duration, price: availability.price, sessionName: availability.sessionName });
  } catch (error) {
    next(error);
  }
};

export const createBooking = async (req, res, next) => {
  try {
    const { username, date, slot, visitorName, visitorEmail, sessionName } = req.body;

    const creator = await User.findOne({ username: username.toLowerCase() });
    if (!creator) {
      return res.status(404).json({ message: 'Creator not found' });
    }

    const availability = await CreatorAvailability.findOne({ userId: creator._id });
    if (!availability) {
      return res.status(404).json({ message: 'Booking not available' });
    }

    const existingBooking = await Booking.findOne({
      userId: creator._id,
      bookedDate: new Date(date),
      bookedSlot: slot,
      status: { $in: ['pending', 'confirmed'] }
    });

    if (existingBooking) {
      return res.status(400).json({ message: 'Slot already booked' });
    }

    const order = await getRazorpay().orders.create({
      amount: availability.price * 100,
      currency: 'INR',
      receipt: `booking_${Date.now()}`
    });

    const booking = await Booking.create({
      userId: creator._id,
      sessionName: sessionName || availability.sessionName,
      duration: availability.duration,
      price: availability.price,
      visitorName,
      visitorEmail,
      bookedDate: new Date(date),
      bookedSlot: slot,
      razorpayOrderId: order.id
    });

    res.json({ booking, order });
  } catch (error) {
    next(error);
  }
};

export const verifyBooking = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } = req.body;

    const crypto = await import('crypto');
    const expectedSignature = crypto.default
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: 'Payment verification failed' });
    }

    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      { status: 'confirmed', razorpayPaymentId: razorpay_payment_id },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    const creator = await User.findById(booking.userId);

    await sendBookingConfirmation(
      booking.visitorEmail,
      booking.visitorName,
      creator.name,
      booking.sessionName,
      booking.bookedDate.toLocaleDateString(),
      booking.bookedSlot
    );

    await sendCreatorBookingNotification(
      creator.email,
      creator.name,
      booking.visitorName,
      booking.visitorEmail,
      booking.sessionName,
      booking.bookedDate.toLocaleDateString(),
      booking.bookedSlot
    );

    res.json(booking);
  } catch (error) {
    next(error);
  }
};

export const getBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id }).sort('-bookedDate');
    res.json(bookings);
  } catch (error) {
    next(error);
  }
};

export const cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { status: 'cancelled' },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json(booking);
  } catch (error) {
    next(error);
  }
};