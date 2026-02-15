import Product from '../models/Product.js';
import Category from '../models/Category.js';
import ApiError from '../utils/ApiError.js';
import {
  uploadMultipleToCloudinary,
  deleteMultipleFromCloudinary,
  CLOUDINARY_FOLDERS,
} from '../utils/cloudinaryUpload.js';
import { logAdminActivity } from '../services/activityLogService.js';
import { parseProductForm } from '../utils/parseProductForm.js';
import mongoose from 'mongoose';

/**
 * Extract public_ids from product images (for Cloudinary deletion)
 * Handles both { url, public_id } and legacy string format
 */
const getPublicIds = (images) => {
  if (!Array.isArray(images)) return [];
  return images
    .map((img) => (typeof img === 'object' && img?.public_id ? img.public_id : null))
    .filter(Boolean);
};

/**
 * @desc    Create product
 * @route   POST /api/products
 * @access  Private/Admin
 * Accepts JSON with colors: [{ name, images: [{ url, public_id }] }]
 */
export const createProduct = async (req, res, next) => {
  try {
    const productData = parseProductForm(req);

    if (!productData.title?.trim()) {
      throw new ApiError('Product title is required', 400);
    }
    if (!productData.category) {
      throw new ApiError('Category is required', 400);
    }
    if (productData.price === undefined || productData.price === null) {
      throw new ApiError('Price is required', 400);
    }
    if (productData.stock === undefined || productData.stock === null) {
      throw new ApiError('Stock is required', 400);
    }

    const category = await Category.findOne({
      _id: productData.category,
      isActive: true,
    });
    if (!category) {
      throw new ApiError('Invalid or inactive category', 400);
    }

    // Normalize colors: ensure images have order by array index
    const colors = (productData.colors || []).map((c, ci) => ({
      name: c.name || '',
      images: (c.images || []).map((img, ii) => ({
        url: typeof img === 'string' ? img : img?.url,
        public_id: typeof img === 'object' ? img?.public_id : null,
        order: ii,
      })),
    }));

    const product = await Product.create({
      ...productData,
      colors,
    });

    logAdminActivity({
      action: 'product_create',
      adminId: req.admin?.id,
      req,
      targetType: 'Product',
      targetId: product._id,
      details: { title: product.title },
    }).catch(() => {});

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update product
 * @route   PUT /api/products/:id
 * @access  Private/Admin
 * Colors only. Handles: color removed -> delete images from Cloudinary;
 * image removed -> delete from Cloudinary; new images -> client pre-uploads via upload-images.
 */
export const updateProduct = async (req, res, next) => {
  try {
    const productData = parseProductForm(req);
    const existing = await Product.findById(req.params.id);

    if (!existing) {
      throw new ApiError('Product not found', 404);
    }

    const incomingColors = productData.colors || [];
    const existingColors = existing.colors || [];

    // Collect public_ids to delete: from removed colors + removed images within kept colors
    const toDelete = [];

    for (const existingColor of existingColors) {
      const incomingColor = incomingColors.find(
        (c) => c.name?.toLowerCase() === existingColor.name?.toLowerCase()
      );

      if (!incomingColor) {
        // Entire color removed - delete all its images
        toDelete.push(...getPublicIds(existingColor.images || []));
      } else {
        // Color kept - find removed images
        const incomingIds = new Set(
          (incomingColor.images || [])
            .map((img) => (typeof img === 'object' ? img?.public_id : null))
            .filter(Boolean)
        );
        for (const img of existingColor.images || []) {
          const pid = typeof img === 'object' ? img?.public_id : null;
          if (pid && !incomingIds.has(pid)) {
            toDelete.push(pid);
          }
        }
      }
    }

    if (toDelete.length > 0) {
      await deleteMultipleFromCloudinary(toDelete);
    }

    // Normalize colors with order
    const colors = incomingColors.map((c, ci) => ({
      name: c.name || '',
      images: (c.images || []).map((img, ii) => ({
        url: typeof img === 'string' ? img : img?.url,
        public_id: typeof img === 'object' ? img?.public_id : null,
        order: ii,
      })),
    }));

    productData.colors = colors;

    if (productData.category) {
      const category = await Category.findOne({
        _id: productData.category,
        isActive: true,
      });
      if (!category) {
        throw new ApiError('Invalid or inactive category', 400);
      }
    }

    const updateData = Object.fromEntries(
      Object.entries(productData).filter(([, v]) => v !== undefined && v !== null)
    );

    if (Object.keys(updateData).length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No changes to update',
        data: existing,
      });
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    logAdminActivity({
      action: 'product_update',
      adminId: req.admin?.id,
      req,
      targetType: 'Product',
      targetId: product._id,
      details: { title: product.title },
    }).catch(() => {});

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Upload product images (returns URLs for client to attach to color)
 * @route   POST /api/products/upload-images
 * @access  Private/Admin
 * Returns [{ url, public_id }] for use in product create/update colors
 */
export const uploadProductImages = async (req, res, next) => {
  try {
    const files = req.files || [];
    if (files.length === 0) {
      throw new ApiError('No images provided', 400);
    }

    const uploads = await uploadMultipleToCloudinary(
      files,
      CLOUDINARY_FOLDERS.PRODUCTS
    );

    const images = uploads.map((u) => ({
      url: u.secure_url,
      public_id: u.public_id,
    }));

    res.status(200).json({
      success: true,
      data: images,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete product (hard delete)
 * @route   DELETE /api/products/:id
 * @access  Private/Admin
 * Deletes all color images from Cloudinary, then deletes product from database
 */
export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      throw new ApiError('Product not found', 404);
    }

    // Delete color-wise images from Cloudinary
    if (product.colors?.length) {
      for (const color of product.colors) {
        if (color.images?.length) {
          const colorPublicIds = getPublicIds(color.images);
          if (colorPublicIds.length > 0) {
            await deleteMultipleFromCloudinary(colorPublicIds);
          }
        }
      }
    }

    await Product.findByIdAndDelete(req.params.id);

    logAdminActivity({
      action: 'product_delete',
      adminId: req.admin?.id,
      req,
      targetType: 'Product',
      targetId: product._id,
      details: { title: product.title },
    }).catch(() => {});

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single product (by id or slug)
 * @route   GET /api/products/:idOrSlug
 * @access  Public
 */
export const getProduct = async (req, res, next) => {
  try {
    const { idOrSlug } = req.params;

    const isObjectId = mongoose.Types.ObjectId.isValid(idOrSlug) &&
      new mongoose.Types.ObjectId(idOrSlug).toString() === idOrSlug;

    const query = isObjectId
      ? { _id: idOrSlug }
      : { slug: idOrSlug };

    const product = await Product.findOne({
      ...query,
      isDeleted: { $ne: true },
    })
      .populate('category', 'name slug')
      .populate('reviews.user', 'name');

    if (!product) {
      throw new ApiError('Product not found', 404);
    }

    if (!product.isActive) {
      throw new ApiError('Product not found', 404);
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all products with pagination, sorting, filtering, search
 * @route   GET /api/products
 * @access  Public
 *
 * Query params:
 * - search: string (MongoDB text search on title, description)
 * - category: ObjectId
 * - minPrice, maxPrice: number (price range)
 * - minRating: number
 * - isFeatured: boolean
 * - isActive: boolean (default true)
 * - sort: latest|price_asc|price_desc|popularity|title_asc|title_desc
 * - page: number (default 1)
 * - limit: number (default 12)
 */
export const getProducts = async (req, res, next) => {
  try {
    const {
      search,
      category,
      minPrice,
      maxPrice,
      minRating,
      isFeatured,
      isActive = 'true',
      includeDeleted,
      sort = 'latest',
      sortBy,
      sortOrder,
      page = 1,
      limit = 12,
    } = req.query;

    // Support legacy sortBy/sortOrder
    let resolvedSort = sort;
    if (sortBy && sortOrder) {
      if (sortBy === 'price') resolvedSort = sortOrder === 'asc' ? 'price_asc' : 'price_desc';
      else if (sortBy === 'createdAt') resolvedSort = 'latest';
      else if (sortBy === 'ratings') resolvedSort = 'popularity';
      else if (sortBy === 'title') resolvedSort = sortOrder === 'asc' ? 'title_asc' : 'title_desc';
    }

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    // Build match stage
    const matchStage = {};

    if (isActive !== undefined && isActive !== '' && isActive !== 'all') {
      matchStage.isActive = isActive === 'true';
    }

    // Exclude soft-deleted products unless admin explicitly includes them
    if (includeDeleted !== 'true') {
      matchStage.isDeleted = { $ne: true };
    }

    // MongoDB text search (uses text index)
    const searchQuery = search?.trim();
    if (searchQuery) {
      matchStage.$text = { $search: searchQuery };
    }

    if (category && mongoose.Types.ObjectId.isValid(category)) {
      matchStage.category = new mongoose.Types.ObjectId(category);
    }

    const minPriceNum = minPrice !== undefined && !isNaN(parseFloat(minPrice))
      ? parseFloat(minPrice)
      : null;
    const maxPriceNum = maxPrice !== undefined && !isNaN(parseFloat(maxPrice))
      ? parseFloat(maxPrice)
      : null;
    if (minPriceNum !== null || maxPriceNum !== null) {
      matchStage.price = {};
      if (minPriceNum !== null) matchStage.price.$gte = minPriceNum;
      if (maxPriceNum !== null) matchStage.price.$lte = maxPriceNum;
    }

    if (minRating !== undefined && !isNaN(parseFloat(minRating))) {
      matchStage.ratings = { $gte: parseFloat(minRating) };
    }

    if (isFeatured !== undefined) {
      matchStage.isFeatured = isFeatured === 'true';
    }

    // Sort: latest, price_asc, price_desc, popularity, title_asc, title_desc
    const pipeline = [
      { $match: Object.keys(matchStage).length ? matchStage : {} },
      ...(searchQuery
        ? [{ $addFields: { textScore: { $meta: 'textScore' } } }]
        : []),
      ...(resolvedSort === 'popularity'
        ? [{ $addFields: { reviewCount: { $size: { $ifNull: ['$reviews', []] } } } }]
        : []),
      {
        $lookup: {
          from: 'categories',
          localField: 'category',
          foreignField: '_id',
          as: 'categoryInfo',
        },
      },
      {
        $addFields: {
          categoryInfo: { $arrayElemAt: ['$categoryInfo', 0] },
        },
      },
      {
        $sort: (() => {
          if (searchQuery) {
            return { textScore: -1, ratings: -1, createdAt: -1 };
          }
          const sortMap = {
            latest: { createdAt: -1 },
            price_asc: { price: 1 },
            price_desc: { price: -1 },
            popularity: { ratings: -1, reviewCount: -1 },
            title_asc: { title: 1 },
            title_desc: { title: -1 },
          };
          return sortMap[resolvedSort] || { createdAt: -1 };
        })(),
      },
      {
        $facet: {
          products: [
            { $skip: skip },
            { $limit: limitNum },
            {
              $addFields: {
                category: '$categoryInfo',
              },
            },
            {
              $project: {
                categoryInfo: 0,
                textScore: 0,
                reviewCount: 0,
              },
            },
          ],
          totalCount: [{ $count: 'count' }],
        },
      },
    ];

    const [result] = await Product.aggregate(pipeline);
    const products = result?.products || [];
    const totalCount = result?.totalCount?.[0]?.count || 0;

    res.status(200).json({
      success: true,
      data: products,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: totalCount,
        pages: Math.ceil(totalCount / limitNum) || 1,
      },
    });
  } catch (error) {
    next(error);
  }
};
