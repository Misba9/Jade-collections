import type { Product } from '../types';

/** API product image shape */
export interface ApiProductImage {
  url: string;
  public_id?: string;
}

/** API color variant: { name, images } */
export interface ApiColorVariant {
  name: string;
  images?: ApiProductImage[];
}

/** API product shape from backend - images only inside colors */
export interface ApiProduct {
  _id: string;
  title: string;
  slug?: string;
  price: number;
  discountPrice?: number;
  category?: { _id: string; name: string } | string;
  ratings?: number;
  reviews?: Array<unknown>;
  sizes?: string[];
  colors?: (string | ApiColorVariant)[];
  description?: string;
  isFeatured?: boolean;
  isActive?: boolean;
  createdAt?: string;
}

/** Extract URL from image (handles { url, public_id } or legacy string) */
function getImageUrl(img: string | ApiProductImage | undefined): string {
  if (!img) return '';
  return typeof img === 'string' ? img : img?.url ?? '';
}

/** Extract color names and colorImages from colors */
function parseColors(colors: (string | ApiColorVariant)[] | undefined): {
  names: string[];
  colorImages: Record<string, string[]>;
} {
  if (!colors?.length) return { names: ['Default'], colorImages: {} };
  const names: string[] = [];
  const colorImages: Record<string, string[]> = {};
  for (const c of colors) {
    if (typeof c === 'string') {
      names.push(c);
    } else if (c?.name) {
      names.push(c.name);
      if (c.images?.length) {
        colorImages[c.name] = c.images.map((img) => getImageUrl(img)).filter(Boolean);
      }
    }
  }
  return { names, colorImages };
}

/** Map API product to frontend Product type - images come from colors only */
export function apiProductToProduct(api: ApiProduct): Product {
  const categoryName = typeof api.category === 'object' ? api.category?.name : api.category;
  const effectivePrice = api.discountPrice ?? api.price;
  const originalPrice = api.discountPrice ? api.price : undefined;

  const { names: colorNames, colorImages } = parseColors(api.colors);

  // First image: from first color's first image
  const firstColor = api.colors?.[0];
  const firstColorImages =
    typeof firstColor === 'object' && firstColor?.images?.length
      ? firstColor.images.map((img) => getImageUrl(img)).filter(Boolean)
      : [];
  const image = firstColorImages[0] || '';
  const images = firstColorImages.length ? firstColorImages : (image ? [image] : []);

  return {
    id: api._id,
    name: api.title,
    price: effectivePrice,
    originalPrice,
    category: categoryName ?? 'Uncategorized',
    image,
    images,
    colorImages: Object.keys(colorImages).length ? colorImages : undefined,
    rating: api.ratings ?? 0,
    reviews: Array.isArray(api.reviews) ? api.reviews.length : 0,
    isNew: api.createdAt
      ? new Date(api.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      : false,
    isBestSeller: api.isFeatured ?? false,
    sizes: api.sizes ?? [],
    colors: colorNames,
    description: api.description ?? '',
    fabric: '',
  };
}
