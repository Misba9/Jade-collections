import mongoose from 'mongoose';
import ApiError from '../utils/ApiError.js';

const cartItemSchema = new mongoose.Schema(
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
      default: 1,
    },
    size: { type: String, trim: true },
    color: { type: String, trim: true },
    // Price snapshot at add time - used for total calculation
    unitPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    unitDiscountPrice: {
      type: Number,
      min: 0,
    },
  },
  { _id: true }
);

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    items: [cartItemSchema],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual: total price (uses discountPrice when available)
cartSchema.virtual('totalPrice').get(function () {
  return this.items.reduce((sum, item) => {
    const price = item.unitDiscountPrice ?? item.unitPrice;
    return sum + price * item.quantity;
  }, 0);
});

// Virtual: subtotal (original price before discount)
cartSchema.virtual('subtotal').get(function () {
  return this.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
});

// Virtual: total discount saved
cartSchema.virtual('discountSaved').get(function () {
  return this.items.reduce((sum, item) => {
    if (item.unitDiscountPrice != null) {
      return sum + (item.unitPrice - item.unitDiscountPrice) * item.quantity;
    }
    return sum;
  }, 0);
});

/**
 * Add item to cart
 * @param {ObjectId} productId
 * @param {number} quantity
 * @param {object} options - { size, color }
 * @returns {Promise<Cart>}
 */
cartSchema.methods.addItem = async function (productId, quantity = 1, options = {}) {
  const Product = mongoose.model('Product');
  const product = await Product.findById(productId).select('price discountPrice stock isActive');

  if (!product) throw new ApiError('Product not found', 404);
  if (!product.isActive) throw new ApiError('Product is not available', 400);
  if (product.stock < quantity) throw new ApiError(`Insufficient stock. Only ${product.stock} available.`, 400);

  const matchVariant = (i) =>
    i.product.toString() === productId.toString() &&
    (i.size || '') === (options.size || '') &&
    (i.color || '') === (options.color || '');

  const existingIndex = this.items.findIndex(matchVariant);

  if (existingIndex >= 0) {
    const newQty = this.items[existingIndex].quantity + quantity;
    if (product.stock < newQty) throw new ApiError(`Insufficient stock. Only ${product.stock} available.`, 400);
    this.items[existingIndex].quantity = newQty;
  } else {
    this.items.push({
      product: productId,
      quantity,
      size: options.size || undefined,
      color: options.color || undefined,
      unitPrice: product.price,
      unitDiscountPrice: product.discountPrice || undefined,
    });
  }

  return this.save();
};

/**
 * Remove item from cart
 * @param {ObjectId} productId
 * @param {object} options - { size, color } for variant matching
 */
cartSchema.methods.removeItem = function (productId, options = {}) {
  const matchVariant = (i) =>
    i.product.toString() === productId.toString() &&
    (i.size || '') === (options.size || '') &&
    (i.color || '') === (options.color || '');
  this.items = this.items.filter((i) => !matchVariant(i));
  return this.save();
};

/**
 * Update item quantity
 * @param {ObjectId} productId
 * @param {number} quantity
 * @param {object} options - { size, color }
 */
cartSchema.methods.updateQuantity = async function (productId, quantity, options = {}) {
  if (quantity < 1) {
    this.removeItem(productId, options);
    return this;
  }

  const Product = mongoose.model('Product');
  const product = await Product.findById(productId).select('stock');

  if (!product) throw new ApiError('Product not found', 404);
  if (product.stock < quantity) throw new ApiError(`Insufficient stock. Only ${product.stock} available.`, 400);

  const matchVariant = (i) =>
    i.product.toString() === productId.toString() &&
    (i.size || '') === (options.size || '') &&
    (i.color || '') === (options.color || '');
  const item = this.items.find(matchVariant);

  if (item) {
    item.quantity = quantity;
  }

  return this.save();
};

const Cart = mongoose.model('Cart', cartSchema);

export default Cart;
