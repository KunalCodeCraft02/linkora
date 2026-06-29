import express from 'express';
import { getProducts, createProduct, updateProduct, deleteProduct, createOrder, verifyPayment, getSales } from '../controllers/product.controller.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, getProducts);
router.post('/', protect, createProduct);
router.put('/:id', protect, updateProduct);
router.delete('/:id', protect, deleteProduct);
router.post('/:id/order', protect, createOrder);
router.post('/verify', protect, verifyPayment);
router.get('/sales', protect, getSales);

export default router;