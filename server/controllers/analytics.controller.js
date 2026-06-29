import ClickEvent from '../models/ClickEvent.js';
import Link from '../models/Link.js';
import EmailCapture from '../models/EmailCapture.js';
import ABTest from '../models/ABTest.js';
import mongoose from 'mongoose';

export const getOverview = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const now = new Date();
    const sevenDaysAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(now - 30 * 24 * 60 * 60 * 1000);

    const [total, last7, last30] = await Promise.all([
      ClickEvent.countDocuments({ userId }),
      ClickEvent.countDocuments({ userId, clickedAt: { $gte: sevenDaysAgo } }),
      ClickEvent.countDocuments({ userId, clickedAt: { $gte: thirtyDaysAgo } })
    ]);

    const affiliateClicks = await ClickEvent.countDocuments({ userId, isAffiliate: true });

    const emailCaptures = await EmailCapture.countDocuments({ userId });

    res.json({ total, last7, last30, affiliateClicks, emailCaptures });
  } catch (error) {
    next(error);
  }
};

export const getByLink = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const result = await ClickEvent.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      { $group: { _id: '$linkId', clicks: { $sum: 1 } } },
      { $sort: { clicks: -1 } },
      { $limit: 20 }
    ]);

    const linkIds = result.map(r => r._id);
    const links = await Link.find({ _id: { $in: linkIds } }).select('title linkType');

    const linkMap = {};
    links.forEach(l => linkMap[l._id] = l);

    const data = result.map(r => ({
      link: linkMap[r._id] || { title: 'Deleted Link', linkType: 'custom' },
      clicks: r.clicks
    }));

    res.json(data);
  } catch (error) {
    next(error);
  }
};

export const getOverTime = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const fourteenDaysAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);

    const result = await ClickEvent.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId), clickedAt: { $gte: fourteenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$clickedAt' } },
          clicks: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json(result.map(r => ({ date: r._id, clicks: r.clicks })));
  } catch (error) {
    next(error);
  }
};

export const getCountries = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const result = await ClickEvent.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId), country: { $ne: '' } } },
      { $group: { _id: '$country', clicks: { $sum: 1 } } },
      { $sort: { clicks: -1 } },
      { $limit: 20 }
    ]);

    res.json(result.map(r => ({ country: r._id, clicks: r.clicks })));
  } catch (error) {
    next(error);
  }
};

export const getHeatmap = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const links = await Link.find({ userId }).sort('order');
    const linkIds = links.map(l => l._id);

    const clickCounts = await ClickEvent.aggregate([
      { $match: { linkId: { $in: linkIds } } },
      { $group: { _id: '$linkId', clicks: { $sum: 1 } } }
    ]);

    const countMap = {};
    clickCounts.forEach(c => countMap[c._id.toString()] = c.clicks);

    const maxClicks = Math.max(...clickCounts.map(c => c.clicks), 1);

    const heatmap = links.map((link, index) => {
      const clicks = countMap[link._id.toString()] || 0;
      const intensity = clicks / maxClicks;
      return {
        linkId: link._id,
        title: link.title,
        clicks,
        intensity,
        position: index,
        color: intensity > 0.7 ? 'red' : intensity > 0.4 ? 'orange' : intensity > 0.1 ? 'yellow' : 'blue'
      };
    });

    res.json(heatmap);
  } catch (error) {
    next(error);
  }
};

export const getEmailCaptures = async (req, res, next) => {
  try {
    const captures = await EmailCapture.find({ userId: req.user._id })
      .populate('linkId', 'title')
      .sort('-capturedAt');
    res.json(captures);
  } catch (error) {
    next(error);
  }
};

export const exportEmails = async (req, res, next) => {
  try {
    const captures = await EmailCapture.find({ userId: req.user._id }).select('visitorName visitorEmail capturedAt');

    let csv = 'Name,Email,Captured At\n';
    captures.forEach(c => {
      csv += `"${c.visitorName}","${c.visitorEmail}","${c.capturedAt}"\n`;
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=emails.csv');
    res.send(csv);
  } catch (error) {
    next(error);
  }
};

export const exportWhatsApp = async (req, res, next) => {
  try {
    const captures = await EmailCapture.find({ userId: req.user._id, visitorWhatsApp: { $ne: '' } })
      .select('visitorName visitorWhatsApp capturedAt');

    let csv = 'Name,WhatsApp Number,Captured At\n';
    captures.forEach(c => {
      csv += `"${c.visitorName}","${c.visitorWhatsApp}","${c.capturedAt}"\n`;
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=whatsapp.csv');
    res.send(csv);
  } catch (error) {
    next(error);
  }
};

export const getAffiliateStats = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const affiliateLinks = await Link.find({ userId, linkType: 'affiliate' });

    const stats = await Promise.all(
      affiliateLinks.map(async (link) => {
        const clicks = await ClickEvent.countDocuments({ linkId: link._id, isAffiliate: true });
        const estimatedEarnings = (clicks * link.commissionRate) / 100;
        return {
          link,
          clicks,
          estimatedEarnings
        };
      })
    );

    const totalClicks = stats.reduce((sum, s) => sum + s.clicks, 0);
    const totalEarnings = stats.reduce((sum, s) => sum + s.estimatedEarnings, 0);

    res.json({ stats, totalClicks, totalEarnings });
  } catch (error) {
    next(error);
  }
};

export const getABTestResults = async (req, res, next) => {
  try {
    const tests = await ABTest.find({ userId: req.user._id })
      .populate('linkId', 'title')
      .sort('-startedAt');
    res.json(tests);
  } catch (error) {
    next(error);
  }
};