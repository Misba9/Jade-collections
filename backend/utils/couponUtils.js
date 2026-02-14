import Coupon from '../models/Coupon.js';
import ApiError from '../utils/ApiError.js';

/**
 * Validate coupon and calculate discount
 * @param {string} code - Coupon code
 * @param {number} subtotal - Cart/order subtotal before discount
 * @returns {Promise<{coupon, discountAmount, finalAmount}>}
 */
export const validateAndApplyCoupon = async (code, subtotal) => {
  if (!code?.trim()) return null;

  const coupon = await Coupon.findOne({
    code: code.trim().toUpperCase(),
    isActive: true,
  });

  if (!coupon) {
    throw new ApiError('Invalid coupon code', 400);
  }

  if (new Date() > coupon.expiryDate) {
    throw new ApiError('Coupon has expired', 400);
  }

  if (coupon.usageLimit != null && coupon.usedCount >= coupon.usageLimit) {
    throw new ApiError('Coupon usage limit reached', 400);
  }

  if (subtotal < coupon.minPurchase) {
    throw new ApiError(
      `Minimum purchase of ₹${coupon.minPurchase} required for this coupon`,
      400
    );
  }

  const discountAmount = Math.round((subtotal * coupon.discountPercentage) / 100);
  const finalAmount = Math.max(0, subtotal - discountAmount);

  return {
    coupon,
    discountAmount,
    finalAmount,
  };
};

/**
 * Apply coupon during order creation - validates, increments usedCount, returns discount info
 * @param {string} code - Coupon code
 * @param {number} subtotal - Order subtotal
 * @param {object} session - Mongoose session for transaction
 */
export const applyCouponToOrder = async (code, subtotal, session = null) => {
  if (!code?.trim()) return null;

  const result = await validateAndApplyCoupon(code, subtotal);

  const opts = session ? { session } : {};
  await Coupon.findByIdAndUpdate(
    result.coupon._id,
    { $inc: { usedCount: 1 } },
    opts
  );

  return {
    coupon: result.coupon._id,
    discountAmount: result.discountAmount,
  };
};
