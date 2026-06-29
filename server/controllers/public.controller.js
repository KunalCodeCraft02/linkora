import User from '../models/User.js';
import Link from '../models/Link.js';
import ClickEvent from '../models/ClickEvent.js';
import EmailCapture from '../models/EmailCapture.js';
import { sendCaptureConfirmation } from '../utils/email.js';

export const getPublicPage = async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.params.username.toLowerCase() }).select('-password -email -__v');
    if (!user) {
      return res.status(404).json({ message: 'Creator not found' });
    }

    const now = new Date();
    let links = await Link.find({ userId: user._id, isEnabled: true }).sort('order');

    links = links.filter(link => {
      if (link.goLiveAt && new Date(link.goLiveAt) > now) return false;
      if (link.expiresAt && new Date(link.expiresAt) < now) return false;
      return true;
    });

    const visitorCountry = req.query.country || '';

    if (visitorCountry) {
      links = links.filter(link => {
        if (link.geoShowIn && link.geoShowIn.length > 0) {
          return link.geoShowIn.includes(visitorCountry);
        }
        if (link.geoHideIn && link.geoHideIn.length > 0) {
          return !link.geoHideIn.includes(visitorCountry);
        }
        return true;
      });
    }

    res.json({
      user,
      links,
      pageScore: user.pageScore
    });
  } catch (error) {
    next(error);
  }
};

export const recordClick = async (req, res, next) => {
  try {
    const { linkId, referrer, country, isQR, abVariant } = req.body;

    const link = await Link.findById(linkId);
    if (!link) {
      return res.status(404).json({ message: 'Link not found' });
    }

    const user = await User.findOne({ username: req.params.username.toLowerCase() });
    if (!user) {
      return res.status(404).json({ message: 'Creator not found' });
    }

    const clickEvent = await ClickEvent.create({
      linkId,
      userId: user._id,
      referrer: referrer || '',
      country: country || '',
      isAffiliate: link.linkType === 'affiliate',
      isQR: isQR || false,
      abVariant: abVariant || ''
    });

    if (link.abTestActive && abVariant) {
      const variantIndex = abVariant === 'A' ? 0 : 1;
      if (link.abVariants[variantIndex]) {
        link.abVariants[variantIndex].clicks += 1;
        await link.save();
      }
    }

    res.json({ ok: true });
  } catch (error) {
    next(error);
  }
};

export const captureEmail = async (req, res, next) => {
  try {
    const { linkId, visitorName, visitorEmail, visitorWhatsApp, creatorUsername } = req.body;

    if (!visitorEmail) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const user = await User.findOne({ username: creatorUsername.toLowerCase() });
    if (!user) {
      return res.status(404).json({ message: 'Creator not found' });
    }

    const existing = await EmailCapture.findOne({ linkId, visitorEmail });
    if (existing) {
      return res.status(400).json({ message: 'Email already captured' });
    }

    await EmailCapture.create({
      linkId,
      userId: user._id,
      visitorName: visitorName || '',
      visitorEmail,
      visitorWhatsApp: visitorWhatsApp || ''
    });

    await sendCaptureConfirmation(visitorEmail, visitorName, user.name);

    res.json({ ok: true });
  } catch (error) {
    next(error);
  }
};

export const getMediaKitByToken = async (req, res, next) => {
  try {
    const MediaKit = (await import('../models/MediaKit.js')).default;
    const mediaKit = await MediaKit.findOne({ shareToken: req.params.token }).populate('userId', 'name avatar username');
    if (!mediaKit) {
      return res.status(404).json({ message: 'Media kit not found' });
    }
    res.json(mediaKit);
  } catch (error) {
    next(error);
  }
};

export const requestMediaKit = async (req, res, next) => {
  try {
    const { email, brandName } = req.body;
    const user = await User.findOne({ username: req.params.username.toLowerCase() });
    if (!user) {
      return res.status(404).json({ message: 'Creator not found' });
    }

    await sendEmail({
      to: user.email,
      subject: `New Media Kit Request from ${brandName || 'a brand'}`,
      html: `<p>${brandName || 'A brand'} (${email}) requested your media kit.</p>`
    });

    res.json({ ok: true });
  } catch (error) {
    next(error);
  }
};