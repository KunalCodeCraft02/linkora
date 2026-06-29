import express from 'express';
import { getLinks, createLink, updateLink, deleteLink, reorderLinks, startABTest, endABTest } from '../controllers/link.controller.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/', getLinks);
router.post('/', createLink);
router.put('/:id', updateLink);
router.delete('/:id', deleteLink);
router.put('/reorder', reorderLinks);
router.post('/:id/abtest', startABTest);
router.put('/:id/abtest/end', endABTest);

export default router;