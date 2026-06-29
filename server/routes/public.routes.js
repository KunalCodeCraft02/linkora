import express from 'express';
import { getPublicPage, recordClick, captureEmail, getMediaKitByToken, requestMediaKit } from '../controllers/public.controller.js';

const router = express.Router();

router.get('/:username', getPublicPage);
router.post('/:username/click', recordClick);
router.post('/capture-email', captureEmail);
router.get('/mediakit/:token', getMediaKitByToken);
router.post('/:username/mediakit/request', requestMediaKit);

export default router;