import express from 'express';
import {
  getCart,
  addItem,
  updateQuantity,
  removeItem,
  clearCart,
} from '../controllers/cartController.js';
import { protectUser } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validate.js';
import { addCartItemSchema, updateQuantitySchema } from '../validators/cartValidators.js';

const router = express.Router();

router.use(protectUser);

router.get('/', getCart);
router.post('/items', validate(addCartItemSchema), addItem);
router.put('/items/:productId', validate(updateQuantitySchema), updateQuantity);
router.delete('/items/:productId', removeItem);
router.delete('/', clearCart);

export default router;
