import User from '../models/User.js';
import ClickEvent from '../models/ClickEvent.js';
import mongoose from 'mongoose';

export const getDirectory = async (req, res, next) => {
  try {
    const { niche, verified, language, country, search, sort, page = 1, limit = 20 } = req.query;

    const query = { directoryOptIn: true };

    if (niche) query.niche = niche;
    if (verified === 'true') query.isVerified = true;
    if (language) query.language = language;
    if (country) query.country = country;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { username: { $regex: search, $options: 'i' } }
      ];
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'clicks') {
      sortOption = { pageScore: -1 };
    }

    const users = await User.find(query)
      .select('name username avatar bio niche isVerified verifiedBadgeType language country')
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await User.countDocuments(query);

    res.json({ users, total, page: parseInt(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    next(error);
  }
};

export const getLeaderboard = async (req, res, next) => {
  try {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const result = await ClickEvent.aggregate([
      { $match: { clickedAt: { $gte: sevenDaysAgo } } },
      { $group: { _id: '$userId', clicks: { $sum: 1 } } },
      { $sort: { clicks: -1 } },
      { $limit: 50 }
    ]);

    const userIds = result.map(r => r._id);
    const users = await User.find({ _id: { $in: userIds } })
      .select('name username avatar bio niche isVerified verifiedBadgeType');

    const userMap = {};
    users.forEach(u => userMap[u._id.toString()] = u);

    const leaderboard = result
      .filter(r => userMap[r._id.toString()])
      .map(r => ({
        user: userMap[r._id.toString()],
        clicks: r.clicks
      }));

    const niches = [...new Set(leaderboard.map(l => l.user.niche).filter(Boolean))];
    const leaderboardByNiche = {};
    niches.forEach(niche => {
      leaderboardByNiche[niche] = leaderboard
        .filter(l => l.user.niche === niche)
        .slice(0, 10);
    });

    leaderboardByNiche['all'] = leaderboard.slice(0, 10);

    res.json(leaderboardByNiche);
  } catch (error) {
    next(error);
  }
};