import crypto from 'crypto';
import razorpayConfig from '../config/razorpay.js';

/**
 * Verify Razorpay payment signature (from frontend callback)
 * @param {string} orderId - Razorpay order ID
 * @param {string} paymentId - Razorpay payment ID
 * @param {string} signature - Razorpay signature
 */
export const verifyPaymentSignature = (orderId, paymentId, signature) => {
  const body = `${orderId}|${paymentId}`;
  const expectedSignature = crypto
    .createHmac('sha256', razorpayConfig.secret)
    .update(body)
    .digest('hex');
  return expectedSignature === signature;
};

/**
 * Verify Razorpay webhook signature
 * @param {Buffer|string} body - Raw request body
 * @param {string} signature - X-Razorpay-Signature header value
 */
export const verifyWebhookSignature = (body, signature) => {
  if (!razorpayConfig.webhookSecret) return false;
  const bodyStr = Buffer.isBuffer(body) ? body.toString('utf8') : body;
  const expectedSignature = crypto
    .createHmac('sha256', razorpayConfig.webhookSecret)
    .update(bodyStr)
    .digest('hex');
  return expectedSignature === signature;
};
