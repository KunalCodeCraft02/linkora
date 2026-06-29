import User from '../models/User.js';
import { generateAccessToken, generateRefreshToken, setTokenCookies, clearTokenCookies } from '../utils/tokens.js';
import jwt from 'jsonwebtoken';

const generateReferralCode = () => {
  return Math.random().toString(36).substring(2, 8);
};

export const register = async (req, res, next) => {
  try {
    const { name, email, password, username, referralCode } = req.body;

    if (!name || !email || !password || !username) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { username: username.toLowerCase() }] });
    if (existingUser) {
      return res.status(400).json({ message: existingUser.email === email ? 'Email already registered' : 'Username already taken' });
    }

    let referredBy = null;
    if (referralCode) {
      const referrer = await User.findOne({ referralCode });
      if (referrer) referredBy = referrer._id;
    }

    const user = await User.create({
      name,
      email,
      password,
      username: username.toLowerCase(),
      referralCode: generateReferralCode(),
      referredBy
    });

    if (referredBy) {
      await User.findByIdAndUpdate(referredBy, { $inc: { referralCount: 1 } });
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    setTokenCookies(res, accessToken, refreshToken);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      username: user.username,
      avatar: user.avatar,
      bio: user.bio,
      theme: user.theme,
      isPro: user.isPro,
      referralCode: user.referralCode
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    setTokenCookies(res, accessToken, refreshToken);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      username: user.username,
      avatar: user.avatar,
      bio: user.bio,
      theme: user.theme,
      isPro: user.isPro
    });
  } catch (error) {
    next(error);
  }
};

export const logout = (req, res) => {
  clearTokenCookies(res);
  res.json({ message: 'Logged out' });
};

export const getMe = async (req, res) => {
  res.json(req.user);
};

export const refresh = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return res.status(401).json({ message: 'No refresh token' });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    const accessToken = generateAccessToken(user._id);
    const newRefreshToken = generateRefreshToken(user._id);

    setTokenCookies(res, accessToken, newRefreshToken);

    res.json({ ok: true });
  } catch (error) {
    return res.status(401).json({ message: 'Invalid refresh token' });
  }
};