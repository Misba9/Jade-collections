import Order from '../models/Order.js';

/**
 * Check if user has purchased a product (paid order)
 * @param {string} userId
 * @param {string} productId
 * @returns {Promise<boolean>}
 */
export const hasUserPurchasedProduct = async (userId, productId) => {
  const order = await Order.findOne({
    user: userId,
    paymentStatus: 'paid',
    orderStatus: { $nin: ['cancelled'] },
    'orderItems.product': productId,
  }).select('_id');

  return !!order;
};
