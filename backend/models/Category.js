import mongoose from 'mongoose';
import { slugify } from '../utils/slugify.js';

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    image: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Auto-generate slug from name
categorySchema.pre('save', async function (next) {
  if (!this.isModified('name')) return next();

  let baseSlug = slugify(this.name);
  let slug = baseSlug;
  let counter = 1;

  const Category = mongoose.model('Category');
  while (true) {
    const existing = await Category.findOne({ slug }).select('_id');
    if (!existing || existing._id.toString() === this._id?.toString()) {
      break;
    }
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  this.slug = slug;
  next();
});

const Category = mongoose.model('Category', categorySchema);

export default Category;
