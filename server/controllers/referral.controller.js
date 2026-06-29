import User from '../models/User.js';

export const getReferralStats = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    let rewardMonths = 0;
    if (user.referralCount >= 25) rewardMonths = -1;
    else if (user.referralCount >= 10) rewardMonths = 3;
    else if (user.referralCount >= 3) rewardMonths = 1;

    res.json({
      referralCode: user.referralCode,
      referralCount: user.referralCount,
      rewardMonths,
      referralLink: `${process.env.CLIENT_URL}/register?ref=${user.referralCode}`,
      nextMilestone: user.referralCount < 3 ? 3 : user.referralCount < 10 ? 10 : 25
    });
  } catch (error) {
    next(error);
  }
};

export const getReferralLink = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({
      link: `${process.env.CLIENT_URL}/register?ref=${user.referralCode}`,
      code: user.referralCode
    });
  } catch (error) {
    next(error);
  }
};