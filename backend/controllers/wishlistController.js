import User from '../models/User.js';
import Product from '../models/Product.js';
import ApiError from '../utils/ApiError.js';
import mongoose from 'mongoose';

/**
 * @desc    Get wishlist
 * @route   GET /api/wishlist
 * @access  Private
 */
export const getWishlist = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('wishlist', 'title slug images price discountPrice stock isActive');

    res.status(200).json({
      success: true,
      data: user.wishlist || [],
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Add product to wishlist
 * @route   POST /api/wishlist/:productId
 * @access  Private
 */
export const addToWishlist = async (req, res, next) => {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      throw new ApiError('Invalid product ID', 400);
    }

    const product = await Product.findById(productId).select('_id isActive');
    if (!product) throw new ApiError('Product not found', 404);
    if (!product.isActive) throw new ApiError('Product is not available', 400);

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $addToSet: { wishlist: productId } },
      { new: true }
    ).populate('wishlist', 'title slug images price discountPrice stock');

    res.status(200).json({
      success: true,
      message: 'Product added to wishlist',
      data: user.wishlist,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Remove product from wishlist
 * @route   DELETE /api/wishlist/:productId
 * @access  Private
 */
export const removeFromWishlist = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $pull: { wishlist: productId } },
      { new: true }
    ).populate('wishlist', 'title slug images price discountPrice stock');

    res.status(200).json({
      success: true,
      message: 'Product removed from wishlist',
      data: user.wishlist,
    });
  } catch (error) {
    next(error);
  }
};
