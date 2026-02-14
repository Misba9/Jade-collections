import Cart from '../models/Cart.js';
import ApiError from '../utils/ApiError.js';

/**
 * Get or create cart for user
 */
const getOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId }).populate('items.product', 'title slug images price discountPrice stock');
  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
  }
  return cart;
};

/**
 * @desc    Get cart
 * @route   GET /api/cart
 * @access  Private
 */
export const getCart = async (req, res, next) => {
  try {
    const cart = await getOrCreateCart(req.user.id);
    await cart.populate('items.product', 'title slug images price discountPrice stock');

    const cartObj = cart.toObject();
    cartObj.totalPrice = cart.totalPrice;
    cartObj.subtotal = cart.subtotal;
    cartObj.discountSaved = cart.discountSaved;

    res.status(200).json({
      success: true,
      data: cartObj,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Add item to cart
 * @route   POST /api/cart/items
 * @access  Private
 */
export const addItem = async (req, res, next) => {
  try {
    const { productId, quantity = 1, size, color } = req.body;

    if (!productId) {
      throw new ApiError('Product ID is required', 400);
    }

    const cart = await getOrCreateCart(req.user.id);
    await cart.addItem(productId, quantity, { size, color });
    await cart.populate('items.product', 'title slug images price discountPrice stock');

    const cartObj = cart.toObject();
    cartObj.totalPrice = cart.totalPrice;
    cartObj.subtotal = cart.subtotal;
    cartObj.discountSaved = cart.discountSaved;

    res.status(200).json({
      success: true,
      message: 'Item added to cart',
      data: cartObj,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update item quantity
 * @route   PUT /api/cart/items/:productId
 * @access  Private
 */
export const updateQuantity = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { quantity, size, color } = req.body;

    if (quantity === undefined || quantity === null) {
      throw new ApiError('Quantity is required', 400);
    }

    const cart = await getOrCreateCart(req.user.id);
    await cart.updateQuantity(productId, parseInt(quantity, 10), { size, color });
    await cart.populate('items.product', 'title slug images price discountPrice stock');

    const cartObj = cart.toObject();
    cartObj.totalPrice = cart.totalPrice;
    cartObj.subtotal = cart.subtotal;
    cartObj.discountSaved = cart.discountSaved;

    res.status(200).json({
      success: true,
      message: 'Cart updated',
      data: cartObj,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Remove item from cart
 * @route   DELETE /api/cart/items/:productId
 * @access  Private
 */
export const removeItem = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { size, color } = req.body;

    const cart = await getOrCreateCart(req.user.id);
    await cart.removeItem(productId, { size, color });
    await cart.populate('items.product', 'title slug images price discountPrice stock');

    const cartObj = cart.toObject();
    cartObj.totalPrice = cart.totalPrice;
    cartObj.subtotal = cart.subtotal;
    cartObj.discountSaved = cart.discountSaved;

    res.status(200).json({
      success: true,
      message: 'Item removed from cart',
      data: cartObj,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Clear cart
 * @route   DELETE /api/cart
 * @access  Private
 */
export const clearCart = async (req, res, next) => {
  try {
    const cart = await getOrCreateCart(req.user.id);
    cart.items = [];
    await cart.save();

    res.status(200).json({
      success: true,
      message: 'Cart cleared',
      data: cart,
    });
  } catch (error) {
    next(error);
  }
};
