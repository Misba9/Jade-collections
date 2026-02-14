import Banner from '../models/Banner.js';
import ApiError from '../utils/ApiError.js';
import { uploadToCloudinary } from '../utils/cloudinary.js';
import { CLOUDINARY_FOLDERS } from '../config/cloudinary.js';
import mongoose from 'mongoose';

/**
 * @desc    Create banner
 * @route   POST /api/banners
 * @access  Private/Admin
 */
export const createBanner = async (req, res, next) => {
  try {
    const { title, link, isActive, order, autoRotate } = req.body;

    let image = req.body.image?.trim();
    if (req.file) {
      const { url } = await uploadToCloudinary(
        req.file.buffer,
        req.file.mimetype,
        CLOUDINARY_FOLDERS.BANNERS
      );
      image = url;
    }

    if (!image) {
      throw new ApiError('Banner image is required', 400);
    }

    const banner = await Banner.create({
      title: title?.trim() || undefined,
      image,
      link: link?.trim() || undefined,
      isActive: isActive !== undefined ? isActive === 'true' || isActive === true : true,
      order: order !== undefined ? parseInt(order, 10) || 0 : 0,
      autoRotate: autoRotate !== undefined ? autoRotate === 'true' || autoRotate === true : true,
    });

    res.status(201).json({
      success: true,
      message: 'Banner created successfully',
      data: banner,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update banner
 * @route   PUT /api/banners/:id
 * @access  Private/Admin
 */
export const updateBanner = async (req, res, next) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner) {
      throw new ApiError('Banner not found', 404);
    }

    const { title, link, isActive, order, autoRotate, image } = req.body;

    if (title !== undefined) banner.title = title?.trim() || undefined;
    if (link !== undefined) banner.link = link?.trim() || undefined;
    if (isActive !== undefined) banner.isActive = isActive === 'true' || isActive === true;
    if (order !== undefined) banner.order = parseInt(order, 10) || 0;
    if (autoRotate !== undefined) banner.autoRotate = autoRotate === 'true' || autoRotate === true;

    if (req.file) {
      const { url } = await uploadToCloudinary(
        req.file.buffer,
        req.file.mimetype,
        CLOUDINARY_FOLDERS.BANNERS
      );
      banner.image = url;
    } else if (image !== undefined && image?.trim()) {
      banner.image = image.trim();
    }

    await banner.save();

    res.status(200).json({
      success: true,
      message: 'Banner updated successfully',
      data: banner,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete banner
 * @route   DELETE /api/banners/:id
 * @access  Private/Admin
 */
export const deleteBanner = async (req, res, next) => {
  try {
    const banner = await Banner.findByIdAndDelete(req.params.id);
    if (!banner) {
      throw new ApiError('Banner not found', 404);
    }

    res.status(200).json({
      success: true,
      message: 'Banner deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single banner
 * @route   GET /api/banners/:id
 * @access  Public
 */
export const getBanner = async (req, res, next) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner) {
      throw new ApiError('Banner not found', 404);
    }

    res.status(200).json({
      success: true,
      data: banner,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all banners (public: active only, admin: all)
 * @route   GET /api/banners
 * @access  Public
 */
export const getBanners = async (req, res, next) => {
  try {
    const { isActive } = req.query;

    const match = {};
    if (isActive !== undefined && isActive !== '' && isActive !== 'all') {
      match.isActive = isActive === 'true';
    }

    const banners = await Banner.find(match).sort({ order: 1, createdAt: 1 });

    res.status(200).json({
      success: true,
      count: banners.length,
      data: banners,
    });
  } catch (error) {
    next(error);
  }
};
