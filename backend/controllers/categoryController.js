import Category from '../models/Category.js';
import Product from '../models/Product.js';
import ApiError from '../utils/ApiError.js';
import { uploadToCloudinary } from '../utils/cloudinary.js';
import { CLOUDINARY_FOLDERS } from '../config/cloudinary.js';
import mongoose from 'mongoose';

/**
 * @desc    Create category
 * @route   POST /api/categories
 * @access  Private/Admin
 */
export const createCategory = async (req, res, next) => {
  try {
    const { name, isActive } = req.body;

    if (!name?.trim()) {
      throw new ApiError('Category name is required', 400);
    }

    const escaped = name.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const existingName = await Category.findOne({
      name: { $regex: new RegExp(`^${escaped}$`, 'i') },
    });
    if (existingName) {
      throw new ApiError('Category with this name already exists', 400);
    }

    const categoryData = {
      name: name.trim(),
      isActive: isActive !== undefined ? isActive === 'true' || isActive === true : true,
    };

    // Image: from file upload or URL in body
    if (req.file) {
      const { url } = await uploadToCloudinary(
        req.file.buffer,
        req.file.mimetype,
        CLOUDINARY_FOLDERS.CATEGORIES
      );
      categoryData.image = url;
    } else if (req.body.image?.trim()) {
      categoryData.image = req.body.image.trim();
    }

    const category = await Category.create(categoryData);

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: category,
    });
  } catch (error) {
    if (error.code === 11000) {
      return next(new ApiError('Category with this name or slug already exists', 400));
    }
    next(error);
  }
};

/**
 * @desc    Update category
 * @route   PUT /api/categories/:id
 * @access  Private/Admin
 */
export const updateCategory = async (req, res, next) => {
  try {
    const { idOrSlug } = req.params;

    const isObjectId = mongoose.Types.ObjectId.isValid(idOrSlug) &&
      new mongoose.Types.ObjectId(idOrSlug).toString() === idOrSlug;

    const query = isObjectId ? { _id: idOrSlug } : { slug: idOrSlug };
    const category = await Category.findOne(query);

    if (!category) {
      throw new ApiError('Category not found', 404);
    }

    const { name, isActive } = req.body;

    if (name !== undefined) {
      const trimmedName = name.trim();
      const escaped = trimmedName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const duplicate = await Category.findOne({
        name: { $regex: new RegExp(`^${escaped}$`, 'i') },
        _id: { $ne: category._id },
      });
      if (duplicate) {
        throw new ApiError('Category with this name already exists', 400);
      }
      category.name = trimmedName;
    }
    if (isActive !== undefined) {
      category.isActive = isActive === 'true' || isActive === true;
    }

    if (req.file) {
      const { url } = await uploadToCloudinary(
        req.file.buffer,
        req.file.mimetype,
        CLOUDINARY_FOLDERS.CATEGORIES
      );
      category.image = url;
    } else if (req.body.image !== undefined) {
      category.image = req.body.image?.trim() || null;
    }

    await category.save();

    res.status(200).json({
      success: true,
      message: 'Category updated successfully',
      data: category,
    });
  } catch (error) {
    if (error.code === 11000) {
      return next(new ApiError('Category with this name or slug already exists', 400));
    }
    next(error);
  }
};

/**
 * @desc    Delete category
 * @route   DELETE /api/categories/:id
 * @access  Private/Admin
 */
export const deleteCategory = async (req, res, next) => {
  try {
    const { idOrSlug } = req.params;

    const isObjectId = mongoose.Types.ObjectId.isValid(idOrSlug) &&
      new mongoose.Types.ObjectId(idOrSlug).toString() === idOrSlug;

    const query = isObjectId ? { _id: idOrSlug } : { slug: idOrSlug };
    const category = await Category.findOne(query);

    if (!category) {
      throw new ApiError('Category not found', 404);
    }

    const productCount = await Product.countDocuments({ category: category._id });
    if (productCount > 0) {
      throw new ApiError(
        `Cannot delete: ${productCount} product(s) use this category. Reassign or remove them first.`,
        400
      );
    }

    await Category.deleteOne({ _id: category._id });

    res.status(200).json({
      success: true,
      message: 'Category deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single category (by id or slug)
 * @route   GET /api/categories/:idOrSlug
 * @access  Public
 */
export const getCategory = async (req, res, next) => {
  try {
    const { idOrSlug } = req.params;

    const isObjectId = mongoose.Types.ObjectId.isValid(idOrSlug) &&
      new mongoose.Types.ObjectId(idOrSlug).toString() === idOrSlug;

    const query = isObjectId ? { _id: idOrSlug } : { slug: idOrSlug };

    const category = await Category.findOne(query);

    if (!category) {
      throw new ApiError('Category not found', 404);
    }

    res.status(200).json({
      success: true,
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all categories
 * @route   GET /api/categories
 * @access  Public (filter by isActive for user site; admin can get all with isActive=all)
 */
export const getCategories = async (req, res, next) => {
  try {
    const { isActive, sortBy = 'name', sortOrder = 'asc' } = req.query;

    const matchStage = {};
    if (isActive === 'all') {
      // Admin: return all categories
    } else if (isActive !== undefined && isActive !== '') {
      matchStage.isActive = isActive === 'true';
    } else {
      // Default: public gets only active categories
      matchStage.isActive = true;
    }

    const sortField = ['name', 'createdAt'].includes(sortBy) ? sortBy : 'name';
    const sortDirection = sortOrder === 'desc' ? -1 : 1;

    const categories = await Category.find(matchStage).sort({ [sortField]: sortDirection });

    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};
