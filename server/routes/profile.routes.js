import express from 'express';
import multer from 'multer';
import { getProfile, updateProfile, uploadAvatar, getPageScore, getQRCode } from '../controllers/profile.controller.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

router.use(protect);

router.get('/', getProfile);
router.put('/', updateProfile);
router.post('/avatar', upload.single('avatar'), uploadAvatar);
router.get('/score', getPageScore);
router.get('/qr', getQRCode);

export default router;