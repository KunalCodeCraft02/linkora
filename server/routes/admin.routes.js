import express from 'express';
import { getApplications, reviewApplication } from '../controllers/admin.controller.js';

const router = express.Router();

router.get('/applications', getApplications);
router.put('/applications/:id', reviewApplication);

export default router;