import VerificationApplication from '../models/VerificationApplication.js';
import User from '../models/User.js';

export const getApplications = async (req, res, next) => {
  try {
    const { password } = req.query;

    if (password !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const applications = await VerificationApplication.find({ status: 'pending' })
      .populate('userId', 'name username email')
      .sort('-createdAt');

    res.json(applications);
  } catch (error) {
    next(error);
  }
};

export const reviewApplication = async (req, res, next) => {
  try {
    const { password, status } = req.body;

    if (password !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const application = await VerificationApplication.findByIdAndUpdate(
      req.params.id,
      { status, reviewedAt: new Date() },
      { new: true }
    );

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    if (status === 'approved') {
      await User.findByIdAndUpdate(application.userId, {
        isVerified: true,
        verifiedBadgeType: application.badgeType
      });
    }

    res.json(application);
  } catch (error) {
    next(error);
  }
};