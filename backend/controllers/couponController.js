import Coupon from '../models/Coupon.js';
import ApiError from '../utils/ApiError.js';
import { validateAndApplyCoupon } from '../utils/couponUtils.js';

/**
 * @desc    Create coupon
 * @route   POST /api/coupons
 * @access  Private/Admin
 */
export const createCoupon = async (req, res, next) => {
  try {
    const {
      code,
      discountPercentage,
      minPurchase = 0,
      expiryDate,
      usageLimit,
      isActive = true,
    } = req.body;

    if (!code?.trim() || discountPercentage == null) {
      throw new ApiError('Code and discount percentage are required', 400);
    }

    if (!expiryDate) {
      throw new ApiError('Expiry date is required', 400);
    }

    const coupon = await Coupon.create({
      code: code.trim().toUpperCase(),
      discountPercentage,
      minPurchase: minPurchase || 0,
      expiryDate: new Date(expiryDate),
      usageLimit: usageLimit || null,
      isActive,
    });

    res.status(201).json({
      success: true,
      message: 'Coupon created successfully',
      data: coupon,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all coupons
 * @route   GET /api/coupons
 * @access  Private/Admin
 */
export const getCoupons = async (req, res, next) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: coupons.length,
      data: coupons,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update coupon
 * @route   PUT /api/coupons/:id
 * @access  Private/Admin
 */
export const updateCoupon = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { code, discountPercentage, minPurchase, expiryDate, usageLimit, isActive } = req.body;

    const coupon = await Coupon.findById(id);
    if (!coupon) throw new ApiError('Coupon not found', 404);

    if (code !== undefined) coupon.code = code.trim().toUpperCase();
    if (discountPercentage != null) coupon.discountPercentage = discountPercentage;
    if (minPurchase !== undefined) coupon.minPurchase = minPurchase || 0;
    if (expiryDate !== undefined) coupon.expiryDate = new Date(expiryDate);
    if (usageLimit !== undefined) coupon.usageLimit = usageLimit || null;
    if (isActive !== undefined) coupon.isActive = isActive === true || isActive === 'true';

    await coupon.save();

    res.status(200).json({
      success: true,
      message: 'Coupon updated successfully',
      data: coupon,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete coupon
 * @route   DELETE /api/coupons/:id
 * @access  Private/Admin
 */
export const deleteCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    if (!coupon) throw new ApiError('Coupon not found', 404);

    res.status(200).json({
      success: true,
      message: 'Coupon deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Validate coupon (for checkout preview)
 * @route   POST /api/coupons/validate
 * @access  Private
 */
export const validateCoupon = async (req, res, next) => {
  try {
    const { code, subtotal } = req.body;

    if (!code?.trim()) {
      throw new ApiError('Coupon code is required', 400);
    }

    const subtotalNum = parseFloat(subtotal);
    if (isNaN(subtotalNum) || subtotalNum < 0) {
      throw new ApiError('Valid subtotal is required', 400);
    }

    const result = await validateAndApplyCoupon(code, subtotalNum);

    res.status(200).json({
      success: true,
      data: {
        coupon: {
          code: result.coupon.code,
          discountPercentage: result.coupon.discountPercentage,
          discountAmount: result.discountAmount,
          finalAmount: result.finalAmount,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

