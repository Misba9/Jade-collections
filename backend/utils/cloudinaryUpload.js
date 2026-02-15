/**
 * Production-ready Cloudinary upload utility
 * Handles image upload with resize, optimization, and deletion
 */
import { v2 as cloudinary } from 'cloudinary';
import cloudinaryConfig, { CLOUDINARY_FOLDERS } from '../config/cloudinary.js';

const isConfigured = !!(
  cloudinaryConfig?.cloudName &&
  cloudinaryConfig?.apiKey &&
  cloudinaryConfig?.apiSecret
);

if (isConfigured) {
  cloudinary.config({
    cloud_name: cloudinaryConfig.cloudName,
    api_key: cloudinaryConfig.apiKey,
    api_secret: cloudinaryConfig.apiSecret,
  });
}

/**
 * Check if Cloudinary is configured
 * @throws {Error} if not configured
 */
const ensureConfigured = () => {
  if (!isConfigured) {
    throw new Error(
      'Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in .env'
    );
  }
};

/**
 * Upload a single image to Cloudinary
 * @param {Buffer} fileBuffer - File buffer from multer
 * @param {string} mimetype - MIME type (e.g. 'image/jpeg')
 * @param {string} folder - Cloudinary folder path
 * @returns {Promise<{secure_url: string, public_id: string}>}
 */
export const uploadToCloudinary = async (
  fileBuffer,
  mimetype = 'image/jpeg',
  folder = CLOUDINARY_FOLDERS.PRODUCTS
) => {
  ensureConfigured();

  const dataUri = `data:${mimetype};base64,${fileBuffer.toString('base64')}`;

  const result = await cloudinary.uploader.upload(dataUri, {
    folder,
    resource_type: 'image',
    transformation: [
      {
        width: 800,
        height: 800,
        crop: 'limit', // Max 800x800, preserve aspect ratio
      },
    ],
    quality: 'auto',
    fetch_format: 'auto',
  });

  return {
    secure_url: result.secure_url,
    public_id: result.public_id,
  };
};

/**
 * Upload multiple images to Cloudinary (max 5 for products)
 * @param {Array<{buffer: Buffer, mimetype: string}>} files - Files from multer
 * @param {string} folder - Cloudinary folder
 * @returns {Promise<Array<{secure_url: string, public_id: string}>>}
 */
export const uploadMultipleToCloudinary = async (
  files,
  folder = CLOUDINARY_FOLDERS.PRODUCTS
) => {
  if (!files?.length) return [];

  ensureConfigured();

  const uploadPromises = files.map((file) =>
    uploadToCloudinary(file.buffer, file.mimetype, folder)
  );
  return Promise.all(uploadPromises);
};

/**
 * Delete a single image from Cloudinary
 * @param {string} publicId - Cloudinary public_id
 * @returns {Promise<object>}
 */
export const deleteFromCloudinary = async (publicId) => {
  if (!publicId) return null;
  ensureConfigured();
  return cloudinary.uploader.destroy(publicId);
};

/**
 * Delete multiple images from Cloudinary
 * @param {string[]} publicIds - Array of public_ids
 * @returns {Promise<Array<object>>}
 */
export const deleteMultipleFromCloudinary = async (publicIds) => {
  if (!publicIds?.length) return [];

  ensureConfigured();

  const deletePromises = publicIds
    .filter(Boolean)
    .map((publicId) => cloudinary.uploader.destroy(publicId));

  return Promise.all(deletePromises);
};

export { CLOUDINARY_FOLDERS };
