import express from 'express';
import {
  getRazorpayKey,
  createRazorpayOrder,
  verifyPayment,
  handlePaymentFailed,
} from '../controllers/paymentController.js';
import { protectUser } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validate.js';
import {
  createRazorpayOrderSchema,
  verifyPaymentSchema,
  paymentFailedSchema,
} from '../validators/paymentValidators.js';

const router = express.Router();

// Public - get key for frontend
router.get('/key', getRazorpayKey);

// Protected routes
router.post('/create-order', protectUser, validate(createRazorpayOrderSchema), createRazorpayOrder);
router.post('/verify', protectUser, validate(verifyPaymentSchema), verifyPayment);
router.post('/failed', protectUser, validate(paymentFailedSchema), handlePaymentFailed);

export default router;
