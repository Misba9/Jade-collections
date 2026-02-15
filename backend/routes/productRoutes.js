import express from 'express';
import {
  createProduct,
  updateProduct,
  deleteProduct,
  getProduct,
  getProducts,
  uploadProductImages,
} from '../controllers/productController.js';
import { addReview, deleteReview } from '../controllers/reviewController.js';
import { protectUser, protectAdmin } from '../middleware/authMiddleware.js';
import { uploadMultipleOptional } from '../middleware/upload.js'; // max 5 images, field "images"
import { validate } from '../middleware/validate.js';
import { addReviewSchema } from '../validators/reviewValidators.js';

const router = express.Router();

// Public routes
router.get('/', getProducts);
router.get('/:idOrSlug', getProduct);

// Review routes (must be before /:id to avoid "reviews" matching as id)
router.post('/:productId/reviews', protectUser, validate(addReviewSchema), addReview);
router.delete('/:productId/reviews', protectUser, deleteReview);

// Admin-only routes (must be before /:id)
router.post('/upload-images', protectAdmin, uploadMultipleOptional('images', 5), uploadProductImages);

// Admin CRUD (JSON only - images uploaded via upload-images, then attached to colors)
router.post('/', protectAdmin, createProduct);
router.put('/:id', protectAdmin, updateProduct);
router.delete('/:id', protectAdmin, deleteProduct);

export default router;
