import mongoose from 'mongoose';
import { slugify } from '../utils/slugify.js';

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    comment: {
      type: String,
      required: [true, 'Review comment is required'],
      trim: true,
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5'],
    },
  },
  { timestamps: true }
);

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Product title is required'],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category is required'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    discountPrice: {
      type: Number,
      min: [0, 'Discount price cannot be negative'],
    },
    stock: {
      type: Number,
      required: [true, 'Stock is required'],
      min: [0, 'Stock cannot be negative'],
      default: 0,
    },
    sizes: [
      {
        type: String,
        trim: true,
      },
    ],
    colors: [
      {
        name: { type: String, trim: true },
        images: [
          {
            url: { type: String },
            public_id: { type: String },
            order: { type: Number, default: 0 },
          },
        ],
      },
    ],
    ratings: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviews: [reviewSchema],
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    sku: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      uppercase: true,
    },
    metaTitle: {
      type: String,
      trim: true,
    },
    metaDescription: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform(doc, ret) {
        // Normalize colors: support legacy string[] and new { name, images }[]
        if (ret.colors && Array.isArray(ret.colors)) {
          ret.colors = ret.colors.map((c) =>
            typeof c === 'string'
              ? { name: c, images: [] }
              : c
          );
        }
        return ret;
      },
    },
    toObject: { virtuals: true },
  }
);

// Auto-generate SKU if not provided
productSchema.pre('save', async function (next) {
  if (this.sku) return next();
  const prefix = 'JC';
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  const ts = Date.now().toString(36).toUpperCase();
  this.sku = `${prefix}-${ts}-${random}`;
  next();
});

// Auto-generate slug from title before save
productSchema.pre('save', async function (next) {
  if (!this.isModified('title')) return next();

  let baseSlug = slugify(this.title);
  let slug = baseSlug;
  let counter = 1;

  const Product = mongoose.model('Product');
  while (true) {
    const existing = await Product.findOne({ slug }).select('_id');
    if (!existing || existing._id.toString() === this._id?.toString()) {
      break;
    }
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  this.slug = slug;
  next();
});

// Text index for full-text search on title and description
productSchema.index({ title: 'text', description: 'text' });

// Compound index for common filter + sort combinations
productSchema.index({ isActive: 1, category: 1, price: 1 });
productSchema.index({ isActive: 1, ratings: -1, createdAt: -1 });
productSchema.index({ isDeleted: 1 });

// Update average rating when reviews change
productSchema.pre('save', function (next) {
  if (this.reviews?.length > 0) {
    const sum = this.reviews.reduce((acc, r) => acc + r.rating, 0);
    this.ratings = Math.round((sum / this.reviews.length) * 10) / 10;
  } else {
    this.ratings = 0;
  }
  next();
});

const Product = mongoose.model('Product', productSchema);

export default Product;
