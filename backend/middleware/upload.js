import multer from 'multer';
import ApiError from '../utils/ApiError.js';

// Store in memory for Cloudinary upload
const storage = multer.memoryStorage();

const ALLOWED_MIMETYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB per file

const fileFilter = (req, file, cb) => {
  if (ALLOWED_MIMETYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new ApiError('Invalid file type. Only JPEG, PNG, WebP and GIF are allowed.', 400), false);
  }
};

const multerConfig = {
  storage,
  fileFilter,
  limits: { fileSize: MAX_FILE_SIZE },
};

/**
 * Single file upload middleware
 * @param {string} fieldName - Form field name (default: 'image')
 */
export const uploadSingle = (fieldName = 'image') =>
  multer(multerConfig).single(fieldName);

/**
 * Multiple files upload middleware
 * @param {string} fieldName - Form field name (default: 'images')
 * @param {number} maxCount - Max number of files (default: 10)
 */
export const uploadMultiple = (fieldName = 'images', maxCount = 10) =>
  multer(multerConfig).array(fieldName, maxCount);

/**
 * Product images: max 5 images, field name "images"
 * Uses memory storage - no temp files (buffer goes directly to Cloudinary)
 */
export const uploadProductImages = (fieldName = 'images', maxCount = 5) =>
  multer(multerConfig).array(fieldName, maxCount);

/**
 * Optional multiple files - skips multer when Content-Type is not multipart (e.g. JSON)
 * Use for routes that accept both JSON and FormData
 */
export const uploadMultipleOptional = (fieldName = 'images', maxCount = 5) => (req, res, next) => {
  const contentType = req.headers['content-type'] || '';
  if (!contentType.includes('multipart/form-data')) {
    req.files = [];
    return next();
  }
  multer(multerConfig).array(fieldName, maxCount)(req, res, next);
};
