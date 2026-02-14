import express from 'express';
import {
  createCategory,
  updateCategory,
  deleteCategory,
  getCategory,
  getCategories,
} from '../controllers/categoryController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';
import { uploadSingle } from '../middleware/upload.js';
import { validate } from '../middleware/validate.js';
import { createCategorySchema, updateCategorySchema } from '../validators/categoryValidators.js';

const router = express.Router();

// Public routes - no auth required
router.get('/', getCategories);
router.get('/:idOrSlug', getCategory);

// Admin-only routes
router.post('/', protectAdmin, uploadSingle('image'), validate(createCategorySchema), createCategory);
router.put('/:idOrSlug', protectAdmin, uploadSingle('image'), validate(updateCategorySchema), updateCategory);
router.delete('/:idOrSlug', protectAdmin, deleteCategory);

export default router;
