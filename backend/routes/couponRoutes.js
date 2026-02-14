import express from 'express';
import {
  createCoupon,
  getCoupons,
  updateCoupon,
  deleteCoupon,
  validateCoupon,
} from '../controllers/couponController.js';
import { protectUser, protectAdmin } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validate.js';
import { validateCouponSchema, createCouponSchema } from '../validators/couponValidators.js';

const router = express.Router();

// Validate coupon (for checkout - user)
router.post('/validate', protectUser, validate(validateCouponSchema), validateCoupon);

router.route('/').get(protectAdmin, getCoupons).post(protectAdmin, validate(createCouponSchema), createCoupon);
router.route('/:id').put(protectAdmin, updateCoupon).delete(protectAdmin, deleteCoupon);

export default router;
