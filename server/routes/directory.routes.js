import express from 'express';
import { getDirectory, getLeaderboard } from '../controllers/directory.controller.js';

const router = express.Router();

router.get('/', getDirectory);
router.get('/leaderboard', getLeaderboard);

export default router;