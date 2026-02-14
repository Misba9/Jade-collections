/**
 * Razorpay configuration - uses centralized env config
 * Keys are only loaded when payment features are used
 */
import { env } from './env.js';

const razorpayConfig = {
  keyId: env.razorpay.keyId,
  secret: env.razorpay.secret,
  webhookSecret: env.razorpay.webhookSecret,
};

export default razorpayConfig;
