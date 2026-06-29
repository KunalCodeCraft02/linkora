import express from 'express';
import { generateBio, suggestTitle, generateInsight } from '../controllers/ai.controller.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/bio', generateBio);
router.post('/title', suggestTitle);
router.post('/insight', protect, generateInsight);

export default router;