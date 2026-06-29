import VerificationApplication from '../models/VerificationApplication.js';

export const applyForVerification = async (req, res, next) => {
  try {
    const { badgeType, socialUrl, description } = req.body;

    const existing = await VerificationApplication.findOne({
      userId: req.user._id,
      status: 'pending'
    });

    if (existing) {
      return res.status(400).json({ message: 'You already have a pending application' });
    }

    const application = await VerificationApplication.create({
      userId: req.user._id,
      badgeType,
      socialUrl,
      description
    });

    res.status(201).json(application);
  } catch (error) {
    next(error);
  }
};

export const getVerificationStatus = async (req, res, next) => {
  try {
    const application = await VerificationApplication.findOne({ userId: req.user._id })
      .sort('-createdAt');

    res.json(application || { status: 'none' });
  } catch (error) {
    next(error);
  }
};