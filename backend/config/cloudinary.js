/**
 * Cloudinary configuration - uses centralized env config
 * Used for image uploads and media storage
 */
import { env } from './env.js';

const cloudinaryConfig = {
  cloudName: env.cloudinary.cloudName,
  apiKey: env.cloudinary.apiKey,
  apiSecret: env.cloudinary.apiSecret,
};

// Folder structure for organized storage
export const CLOUDINARY_FOLDERS = {
  PRODUCTS: 'jade-collections/products',
  CATEGORIES: 'jade-collections/categories',
  BANNERS: 'jade-collections/banners',
  DEFAULT: 'jade-collections',
};

export default cloudinaryConfig;
