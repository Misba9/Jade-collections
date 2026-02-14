import express from 'express';
import {
  createProduct,
  updateProduct,
  deleteProduct,
  getProduct,
  getProducts,
} from '../controllers/productController.js';
import { addReview, deleteReview } from '../controllers/reviewController.js';
import { protectUser, protectAdmin } from '../middleware/authMiddleware.js';
import { uploadMultipleOptional } from '../middleware/upload.js';
import { validate } from '../middleware/validate.js';
import { addReviewSchema } from '../validators/reviewValidators.js';

const router = express.Router();

// Public routes
router.get('/', getProducts);
router.get('/:idOrSlug', getProduct);

// Review routes (must be before /:id to avoid "reviews" matching as id)
router.post('/:productId/reviews', protectUser, validate(addReviewSchema), addReview);
router.delete('/:productId/reviews', protectUser, deleteReview);

// Admin-only routes (accepts both JSON and multipart/form-data)
router.post('/', protectAdmin, uploadMultipleOptional('images', 10), createProduct);
router.put('/:id', protectAdmin, uploadMultipleOptional('images', 10), updateProduct);
router.delete('/:id', protectAdmin, deleteProduct);

export default router;
