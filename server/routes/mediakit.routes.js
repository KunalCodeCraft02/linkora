import express from 'express';
import { getMediaKit, updateMediaKit, generatePDF } from '../controllers/mediakit.controller.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, getMediaKit);
router.put('/', protect, updateMediaKit);
router.post('/generate', protect, generatePDF);

export default router;