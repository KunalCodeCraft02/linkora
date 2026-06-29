import express from 'express';
import {
  getOverview, getByLink, getOverTime, getCountries, getHeatmap,
  getEmailCaptures, exportEmails, exportWhatsApp, getAffiliateStats, getABTestResults
} from '../controllers/analytics.controller.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/overview', getOverview);
router.get('/by-link', getByLink);
router.get('/over-time', getOverTime);
router.get('/countries', getCountries);
router.get('/heatmap', getHeatmap);
router.get('/emails', getEmailCaptures);
router.get('/emails/export', exportEmails);
router.get('/whatsapp/export', exportWhatsApp);
router.get('/affiliate', getAffiliateStats);
router.get('/abtests', getABTestResults);

export default router;