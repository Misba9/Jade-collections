import type { Product } from '../types';

/** API product shape from backend */
export interface ApiProduct {
  _id: string;
  title: string;
  slug?: string;
  price: number;
  discountPrice?: number;
  images?: string[];
  category?: { _id: string; name: string } | string;
  ratings?: number;
  reviews?: Array<unknown>;
  sizes?: string[];
  colors?: string[];
  description?: string;
  isFeatured?: boolean;
  isActive?: boolean;
  createdAt?: string;
}

/** Map API product to frontend Product type */
export function apiProductToProduct(api: ApiProduct): Product {
  const categoryName = typeof api.category === 'object' ? api.category?.name : api.category;
  const effectivePrice = api.discountPrice ?? api.price;
  const originalPrice = api.discountPrice ? api.price : undefined;
  const image = api.images?.[0] ?? '';

  return {
    id: api._id,
    name: api.title,
    price: effectivePrice,
    originalPrice,
    category: categoryName ?? 'Uncategorized',
    image,
    images: api.images?.length ? api.images : [image],
    rating: api.ratings ?? 0,
    reviews: Array.isArray(api.reviews) ? api.reviews.length : 0,
    isNew: api.createdAt
      ? new Date(api.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      : false,
    isBestSeller: api.isFeatured ?? false,
    sizes: api.sizes ?? [],
    colors: api.colors ?? ['Default'],
    description: api.description ?? '',
    fabric: '',
  };
}
