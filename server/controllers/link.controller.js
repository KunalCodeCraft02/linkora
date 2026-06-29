import Link from '../models/Link.js';
import ClickEvent from '../models/ClickEvent.js';
import ABTest from '../models/ABTest.js';

export const getLinks = async (req, res, next) => {
  try {
    const links = await Link.find({ userId: req.user._id }).sort('order');
    res.json(links);
  } catch (error) {
    next(error);
  }
};

export const createLink = async (req, res, next) => {
  try {
    const { title, url, linkType, icon, commissionRate, productName, goLiveAt, expiresAt, geoShowIn, geoHideIn } = req.body;

    const maxOrder = await Link.findOne({ userId: req.user._id }).sort('-order');
    const order = maxOrder ? maxOrder.order + 1 : 0;

    const link = await Link.create({
      userId: req.user._id,
      title,
      url,
      linkType,
      icon: icon || '',
      order,
      commissionRate: commissionRate || 0,
      productName: productName || '',
      goLiveAt: goLiveAt || null,
      expiresAt: expiresAt || null,
      geoShowIn: geoShowIn || [],
      geoHideIn: geoHideIn || []
    });

    res.status(201).json(link);
  } catch (error) {
    next(error);
  }
};

export const updateLink = async (req, res, next) => {
  try {
    const { title, url, linkType, icon, isEnabled, commissionRate, productName, goLiveAt, expiresAt, geoShowIn, geoHideIn } = req.body;

    const link = await Link.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { title, url, linkType, icon, isEnabled, commissionRate, productName, goLiveAt, expiresAt, geoShowIn, geoHideIn },
      { new: true, runValidators: true }
    );

    if (!link) {
      return res.status(404).json({ message: 'Link not found' });
    }

    res.json(link);
  } catch (error) {
    next(error);
  }
};

export const deleteLink = async (req, res, next) => {
  try {
    const link = await Link.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!link) {
      return res.status(404).json({ message: 'Link not found' });
    }
    res.json({ message: 'Link deleted' });
  } catch (error) {
    next(error);
  }
};

export const reorderLinks = async (req, res, next) => {
  try {
    const { orderedIds } = req.body;

    const bulkOps = orderedIds.map((id, index) => ({
      updateOne: {
        filter: { _id: id, userId: req.user._id },
        update: { $set: { order: index } }
      }
    }));

    await Link.bulkWrite(bulkOps);
    res.json({ message: 'Links reordered' });
  } catch (error) {
    next(error);
  }
};

export const startABTest = async (req, res, next) => {
  try {
    const link = await Link.findOne({ _id: req.params.id, userId: req.user._id });
    if (!link) {
      return res.status(404).json({ message: 'Link not found' });
    }

    if (link.abTestActive) {
      return res.status(400).json({ message: 'A/B test already active for this link' });
    }

    const abTest = await ABTest.create({
      linkId: link._id,
      userId: req.user._id,
      variantA: { title: link.title, clicks: 0 },
      variantB: { title: req.body.variantBTitle || link.title, clicks: 0 },
      status: 'active',
      startedAt: new Date()
    });

    link.abTestActive = true;
    link.abVariants = abTest.variantA;
    link.abStartedAt = new Date();
    await link.save();

    res.status(201).json(abTest);
  } catch (error) {
    next(error);
  }
};

export const endABTest = async (req, res, next) => {
  try {
    const abTest = await ABTest.findOne({ _id: req.body.abTestId, userId: req.user._id });
    if (!abTest) {
      return res.status(404).json({ message: 'A/B test not found' });
    }

    const totalA = abTest.variantA.clicks;
    const totalB = abTest.variantB.clicks;
    const total = totalA + totalB;

    let winner = 'tie';
    if (total > 0) {
      if (totalA / total > 0.6) winner = 'A';
      else if (totalB / total > 0.6) winner = 'B';
    }

    abTest.status = 'completed';
    abTest.winner = winner;
    abTest.endedAt = new Date();
    await abTest.save();

    const link = await Link.findById(abTest.linkId);
    if (link) {
      link.abTestActive = false;
      if (winner === 'B') {
        link.title = abTest.variantB.title;
      }
      link.abWinner = winner;
      await link.save();
    }

    res.json(abTest);
  } catch (error) {
    next(error);
  }
};