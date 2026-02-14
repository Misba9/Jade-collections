import mongoose from 'mongoose';
import ApiError from '../utils/ApiError.js';

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, 'Quantity must be at least 1'],
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: true }
);

const shippingAddressSchema = new mongoose.Schema(
  {
    street: { type: String, trim: true },
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    zip: { type: String, trim: true },
    country: { type: String, trim: true },
    phone: { type: String, trim: true },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    orderItems: [orderItemSchema],
    shippingAddress: shippingAddressSchema,
    paymentMethod: {
      type: String,
      enum: ['cod', 'card', 'upi', 'razorpay', 'other'],
      default: 'cod',
    },
    paymentStatus: {
      type: String,
      enum: {
        values: ['pending', 'paid', 'failed'],
        message: '{VALUE} is not a valid payment status',
      },
      default: 'pending',
    },
    orderStatus: {
      type: String,
      enum: {
        values: ['processing', 'shipped', 'delivered', 'cancelled'],
        message: '{VALUE} is not a valid order status',
      },
      default: 'processing',
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    taxAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    deliveryCharge: {
      type: Number,
      default: 0,
      min: 0,
    },
    coupon: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Coupon',
    },
    discountAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    stockDeducted: {
      type: Boolean,
      default: false,
      select: false,
    },
    razorpayOrderId: { type: String, trim: true },
    razorpayPaymentId: { type: String, trim: true },
  },
  { timestamps: true }
);

// Helper: deduct stock for order items (supports session for transactions)
const deductStockForOrder = async (orderItems, session = null) => {
  const Product = mongoose.model('Product');
  const opts = session ? { session, validateBeforeSave: false } : { validateBeforeSave: false };
  for (const item of orderItems) {
    let query = Product.findById(item.product);
    if (session) query = query.session(session);
    const product = await query;
    if (!product) throw new ApiError(`Product ${item.product} not found`, 404);
    if (product.stock < item.quantity) {
      throw new ApiError(`Insufficient stock for ${product.title}. Only ${product.stock} available.`, 400);
    }
    product.stock -= item.quantity;
    await product.save(opts);
  }
};

// Helper: restore stock when order is cancelled
export const restoreStockForOrder = async (orderItems, session = null) => {
  const Product = mongoose.model('Product');
  const opts = session ? { session, validateBeforeSave: false } : { validateBeforeSave: false };
  for (const item of orderItems) {
    let query = Product.findById(item.product);
    if (session) query = query.session(session);
    const product = await query;
    if (product) {
      product.stock += item.quantity;
      await product.save(opts);
    }
  }
};

// Auto deduct stock when payment status becomes 'paid' (save)
orderSchema.pre('save', async function (next) {
  if (this.paymentStatus !== 'paid' || this.stockDeducted) return next();
  try {
    await deductStockForOrder(this.orderItems);
    this.stockDeducted = true;
    next();
  } catch (err) {
    next(err);
  }
});

// Auto deduct stock when payment status updated to 'paid' via findOneAndUpdate
orderSchema.pre('findOneAndUpdate', async function (next) {
  const update = this.getUpdate();
  const paymentStatus = update?.paymentStatus ?? update?.$set?.paymentStatus;
  if (paymentStatus !== 'paid') return next();

  try {
    const order = await this.model.findOne(this.getQuery()).select('orderItems stockDeducted');
    if (!order || order.stockDeducted) return next();
    await deductStockForOrder(order.orderItems);
    if (update.$set) {
      update.$set.stockDeducted = true;
    } else if (typeof update === 'object' && !Array.isArray(update)) {
      update.stockDeducted = true;
    }
    next();
  } catch (err) {
    next(err);
  }
});

const Order = mongoose.model('Order', orderSchema);

export default Order;
