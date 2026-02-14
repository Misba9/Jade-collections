import express from 'express';
import {
  createOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
  getOrderInvoice,
} from '../controllers/orderController.js';
import { protectUser, protectAdmin } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validate.js';
import { createOrderSchema } from '../validators/orderValidators.js';

const router = express.Router();

router.post('/', protectUser, validate(createOrderSchema), createOrder);
router.get('/', protectUser, getUserOrders);
router.get('/all', protectAdmin, getAllOrders);
router.get('/:id/invoice', protectUser, getOrderInvoice);
router.put('/:id/cancel', protectUser, cancelOrder);
router.put('/:id/status', protectAdmin, updateOrderStatus);

export default router;
