import express from 'express';
import {
  createBanner,
  updateBanner,
  deleteBanner,
  getBanner,
  getBanners,
} from '../controllers/bannerController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';
import { uploadSingle } from '../middleware/upload.js';

const router = express.Router();

// Public routes
router.get('/', getBanners);
router.get('/:id', getBanner);

// Admin-only routes
router.post('/', protectAdmin, uploadSingle('image'), createBanner);
router.put('/:id', protectAdmin, uploadSingle('image'), updateBanner);
router.delete('/:id', protectAdmin, deleteBanner);

export default router;
