import mongoose from 'mongoose';

const productSaleSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  buyerName: { type: String, default: '' },
  buyerEmail: { type: String, required: true },
  amountPaid: { type: Number, required: true },
  razorpayOrderId: { type: String, default: '' },
  razorpayPaymentId: { type: String, default: '' },
  purchasedAt: { type: Date, default: Date.now }
});

const ProductSale = mongoose.model('ProductSale', productSaleSchema);
export default ProductSale;