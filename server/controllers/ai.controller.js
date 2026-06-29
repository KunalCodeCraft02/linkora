import Groq from 'groq-sdk';
import User from '../models/User.js';
import Link from '../models/Link.js';
import ClickEvent from '../models/ClickEvent.js';
import WeeklyInsight from '../models/WeeklyInsight.js';

let groq;
const getGroq = () => {
  if (!groq) groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  return groq;
};

export const generateBio = async (req, res, next) => {
  try {
    const { niche, audience, cta } = req.body;

    const prompt = `Generate 5 bio options for a content creator profile page. Each bio must be under 150 characters.

Creator's niche: ${niche || 'general content'}
Audience: ${audience || 'followers'}
Main CTA: ${cta || 'check out my content'}

Generate bios in these tones:
1. Professional
2. Casual
3. Hype/Energetic
4. Minimal
5. Storytelling

Return as JSON array with format: [{tone: string, bio: string}]
Only return the JSON, no other text.`;

    const completion = await getGroq().chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama3-8b-8192',
      temperature: 0.8
    });

    const content = completion.choices[0]?.message?.content;
    const bios = JSON.parse(content);

    res.json(bios);
  } catch (error) {
    next(error);
  }
};

export const suggestTitle = async (req, res, next) => {
  try {
    const { url } = req.body;

    const prompt = `Analyze this URL and suggest 3 strong, action-oriented link titles for a creator's link-in-bio page.

URL: ${url}

Generate titles in these styles:
1. Curiosity-driven (makes people want to click)
2. Direct CTA (clear action)
3. Emoji-led (with relevant emoji)

Return as JSON array with format: [{style: string, title: string}]
Only return the JSON, no other text.`;

    const completion = await getGroq().chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama3-8b-8192',
      temperature: 0.7
    });

    const content = completion.choices[0]?.message?.content;
    const titles = JSON.parse(content);

    res.json(titles);
  } catch (error) {
    next(error);
  }
};

export const generateInsight = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const clicks = await ClickEvent.find({ userId, clickedAt: { $gte: sevenDaysAgo } });
    const links = await Link.find({ userId });

    const totalClicks = clicks.length;
    const topReferrers = {};
    const countryData = {};
    const linkClicks = {};

    clicks.forEach(c => {
      if (c.referrer) topReferrers[c.referrer] = (topReferrers[c.referrer] || 0) + 1;
      if (c.country) countryData[c.country] = (countryData[c.country] || 0) + 1;
      linkClicks[c.linkId] = (linkClicks[c.linkId] || 0) + 1;
    });

    const linkDetails = links.map(l => ({
      title: l.title,
      type: l.linkType,
      clicks: linkClicks[l._id] || 0
    }));

    const prompt = `Analyze this creator's weekly click data and generate 3 specific, actionable tips.

Total clicks this week: ${totalClicks}
Links: ${JSON.stringify(linkDetails)}
Top referrers: ${JSON.stringify(topReferrers)}
Countries: ${JSON.stringify(countryData)}

Generate 3 specific tips. Each tip should:
1. Reference actual data from their analytics
2. Be actionable (what they should do)
3. Be encouraging

Return as JSON array with format: [{tip: string}]
Only return the JSON, no other text.`;

    const completion = await getGroq().chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama3-8b-8192',
      temperature: 0.7
    });

    const content = completion.choices[0]?.message?.content;
    const insights = JSON.parse(content);

    const weeklyInsight = await WeeklyInsight.create({
      userId,
      insights: insights.map(i => i.tip),
      weekOf: new Date()
    });

    res.json(weeklyInsight);
  } catch (error) {
    next(error);
  }
};