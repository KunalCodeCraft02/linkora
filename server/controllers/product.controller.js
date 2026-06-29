import Product from '../models/Product.js';
import ProductSale from '../models/ProductSale.js';
import { uploadToCloudinary } from '../utils/cloudinary.js';
import { sendProductDownloadEmail } from '../utils/email.js';
import Razorpay from 'razorpay';

let razorpay;
const getRazorpay = () => {
  if (!razorpay) razorpay = new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET });
  return razorpay;
};

export const getProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ userId: req.user._id }).sort('-createdAt');
    res.json(products);
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (req, res, next) => {
  try {
    const { name, description, price, fileUrl, fileType } = req.body;

    const product = await Product.create({
      userId: req.user._id,
      name,
      description,
      price: price || 0,
      fileUrl: fileUrl || '',
      fileType: fileType || ''
    });

    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const { name, description, price, fileUrl, fileType, isActive } = req.body;

    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { name, description, price, fileUrl, fileType, isActive },
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted' });
  } catch (error) {
    next(error);
  }
};

export const createOrder = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.price === 0) {
      return res.status(400).json({ message: 'Free products do not need payment' });
    }

    const order = await getRazorpay().orders.create({
      amount: product.price * 100,
      currency: 'INR',
      receipt: `prod_${product._id}`,
      notes: { productId: product._id.toString() }
    });

    res.json(order);
  } catch (error) {
    next(error);
  }
};

export const verifyPayment = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, buyerName, buyerEmail, productId } = req.body;

    const crypto = await import('crypto');
    const expectedSignature = crypto.default
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: 'Payment verification failed' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const sale = await ProductSale.create({
      productId,
      userId: product.userId,
      buyerName,
      buyerEmail,
      amountPaid: product.price,
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id
    });

    product.totalSales += 1;
    product.totalRevenue += product.price;
    await product.save();

    await sendProductDownloadEmail(buyerEmail, buyerName, product.name, product.fileUrl);

    res.json({ sale, downloadUrl: product.fileUrl });
  } catch (error) {
    next(error);
  }
};

export const getSales = async (req, res, next) => {
  try {
    const sales = await ProductSale.find({ userId: req.user._id })
      .populate('productId', 'name price')
      .sort('-purchasedAt');
    res.json(sales);
  } catch (error) {
    next(error);
  }
};