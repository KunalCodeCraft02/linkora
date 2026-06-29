import User from '../models/User.js';
import Link from '../models/Link.js';
import ClickEvent from '../models/ClickEvent.js';
import { uploadToCloudinary } from '../utils/cloudinary.js';
import QRCode from 'qrcode';

export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { name, bio, username, theme, language, niche, country, directoryOptIn } = req.body;

    if (username && username !== req.user.username) {
      const existing = await User.findOne({ username: username.toLowerCase(), _id: { $ne: req.user._id } });
      if (existing) {
        return res.status(400).json({ message: 'Username already taken' });
      }
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        name, bio, username: username?.toLowerCase(), theme, language, niche, country, directoryOptIn
      },
      { new: true, runValidators: true }
    ).select('-password');

    res.json(user);
  } catch (error) {
    next(error);
  }
};

export const uploadAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const result = await uploadToCloudinary(req.file.buffer, 'avatars');

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar: result.secure_url },
      { new: true }
    ).select('-password');

    res.json(user);
  } catch (error) {
    next(error);
  }
};

export const getPageScore = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const links = await Link.find({ userId: req.user._id });

    let score = 0;
    const checklist = [];

    if (user.avatar) { score += 10; checklist.push({ item: 'Add avatar', points: 10, done: true }); }
    else { checklist.push({ item: 'Add avatar', points: 10, done: false }); }

    if (user.bio && user.bio.length > 20) { score += 15; checklist.push({ item: 'Write bio', points: 15, done: true }); }
    else { checklist.push({ item: 'Write bio (20+ chars)', points: 15, done: false }); }

    if (links.length >= 3) { score += 20; checklist.push({ item: 'Add 3+ links', points: 20, done: true }); }
    else { checklist.push({ item: `Add 3+ links (${links.length}/3)`, points: 20, done: false }); }

    if (user.theme && user.theme !== 'midnight') { score += 10; checklist.push({ item: 'Set a custom theme', points: 10, done: true }); }
    else { checklist.push({ item: 'Set a custom theme', points: 10, done: false }); }

    if (user.bio && user.bio.length > 50) { score += 5; checklist.push({ item: 'Detailed bio (50+ chars)', points: 5, done: true }); }
    else { checklist.push({ item: 'Detailed bio (50+ chars)', points: 5, done: false }); }

    const hasMonetization = links.some(l => ['product', 'affiliate', 'pay_tip', 'book_session'].includes(l.linkType));
    if (hasMonetization) { score += 20; checklist.push({ item: 'Add a monetization link', points: 20, done: true }); }
    else { checklist.push({ item: 'Add a monetization link', points: 20, done: false }); }

    if (links.length >= 5) { score += 10; checklist.push({ item: 'Add 5+ links', points: 10, done: true }); }
    else { checklist.push({ item: `Add 5+ links (${links.length}/5)`, points: 10, done: false }); }

    if (user.username) { score += 5; checklist.push({ item: 'Set username', points: 5, done: true }); }

    await User.findByIdAndUpdate(req.user._id, { pageScore: score });

    res.json({ score, checklist });
  } catch (error) {
    next(error);
  }
};

export const getQRCode = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const url = `${process.env.CLIENT_URL}/u/${user.username}?ref=qr`;

    const { fgColor, bgColor } = req.query;

    const qrDataUrl = await QRCode.toDataURL(url, {
      width: 400,
      margin: 2,
      color: {
        dark: fgColor || '#000000',
        light: bgColor || '#ffffff'
      }
    });

    res.json({ qr: qrDataUrl, url });
  } catch (error) {
    next(error);
  }
};