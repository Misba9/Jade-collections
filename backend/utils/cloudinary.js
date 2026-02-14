import { v2 as cloudinary } from 'cloudinary';
import cloudinaryConfig from '../config/cloudinary.js';

const isConfigured = cloudinaryConfig.cloudName && cloudinaryConfig.apiKey && cloudinaryConfig.apiSecret;

if (isConfigured) {
  cloudinary.config({
    cloud_name: cloudinaryConfig.cloudName,
    api_key: cloudinaryConfig.apiKey,
    api_secret: cloudinaryConfig.apiSecret,
  });
}

/**
 * Upload image to Cloudinary
 * @param {Buffer} fileBuffer - File buffer from multer
 * @param {string} mimetype - File MIME type (e.g. 'image/jpeg')
 * @param {string} folder - Cloudinary folder (e.g. 'categories')
 * @param {object} options - Additional options
 * @returns {Promise<{url: string, publicId: string}>}
 */
export const uploadToCloudinary = async (
  fileBuffer,
  mimetype = 'image/jpeg',
  folder = 'jade-collections',
  options = {}
) => {
  if (!isConfigured) {
    throw new Error('Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in .env');
  }
  const dataUri = `data:${mimetype};base64,${fileBuffer.toString('base64')}`;
  const result = await cloudinary.uploader.upload(dataUri, {
    folder,
    resource_type: 'image',
    ...options,
  });
  return {
    url: result.secure_url,
    publicId: result.public_id,
  };
};

/**
 * Upload multiple images to Cloudinary
 * @param {Array<{buffer: Buffer, mimetype: string}>} files - Array of file objects from multer
 * @param {string} folder - Cloudinary folder
 * @returns {Promise<Array<{url: string, publicId: string}>>}
 */
export const uploadMultipleToCloudinary = async (files, folder = 'jade-collections') => {
  if (!files?.length) return [];

  if (!isConfigured) {
    throw new Error('Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in .env');
  }

  const uploadPromises = files.map((file) =>
    uploadToCloudinary(file.buffer, file.mimetype, folder)
  );
  return Promise.all(uploadPromises);
};

/**
 * Delete image from Cloudinary
 * @param {string} publicId - Cloudinary public ID
 */
export const deleteFromCloudinary = async (publicId) => {
  return cloudinary.uploader.destroy(publicId);
};
