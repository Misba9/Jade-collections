import Product from '../models/Product.js';
import ApiError from '../utils/ApiError.js';
import { hasUserPurchasedProduct } from '../utils/reviewUtils.js';
import mongoose from 'mongoose';

/**
 * @desc    Add or update review (one per user per product)
 * @route   POST /api/products/:productId/reviews
 * @access  Private
 */
export const addReview = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { rating, comment } = req.body;

    if (!rating || !comment?.trim()) {
      throw new ApiError('Rating and comment are required', 400);
    }

    const ratingNum = parseFloat(rating);
    if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
      throw new ApiError('Rating must be between 1 and 5', 400);
    }

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      throw new ApiError('Invalid product ID', 400);
    }

    const product = await Product.findById(productId);
    if (!product) throw new ApiError('Product not found', 404);
    if (!product.isActive) throw new ApiError('Product not found', 404);

    const hasPurchased = await hasUserPurchasedProduct(req.user.id, productId);
    if (!hasPurchased) {
      throw new ApiError('You can only review products you have purchased', 403);
    }

    const existingIndex = product.reviews.findIndex(
      (r) => r.user.toString() === req.user.id
    );

    const reviewData = {
      user: req.user.id,
      rating: ratingNum,
      comment: comment.trim(),
    };

    if (existingIndex >= 0) {
      product.reviews[existingIndex].rating = ratingNum;
      product.reviews[existingIndex].comment = comment.trim();
    } else {
      product.reviews.push(reviewData);
    }

    await product.save();

    const updatedProduct = await Product.findById(productId)
      .populate('reviews.user', 'name')
      .select('reviews ratings');

    res.status(200).json({
      success: true,
      message: existingIndex >= 0 ? 'Review updated successfully' : 'Review added successfully',
      data: {
        reviews: updatedProduct.reviews,
        ratings: updatedProduct.ratings,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete own review
 * @route   DELETE /api/products/:productId/reviews
 * @access  Private
 */
export const deleteReview = async (req, res, next) => {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      throw new ApiError('Invalid product ID', 400);
    }

    const product = await Product.findById(productId);
    if (!product) throw new ApiError('Product not found', 404);

    const existingIndex = product.reviews.findIndex(
      (r) => r.user.toString() === req.user.id
    );

    if (existingIndex < 0) {
      throw new ApiError('You have not reviewed this product', 404);
    }

    product.reviews.splice(existingIndex, 1);
    await product.save();

    const updatedProduct = await Product.findById(productId)
      .populate('reviews.user', 'name')
      .select('reviews ratings');

    res.status(200).json({
      success: true,
      message: 'Review deleted successfully',
      data: {
        reviews: updatedProduct.reviews,
        ratings: updatedProduct.ratings,
      },
    });
  } catch (error) {
    next(error);
  }
};
