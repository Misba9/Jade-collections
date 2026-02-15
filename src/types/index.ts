export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  category: string;
  image: string;
  images?: string[];
  /** Color name -> image URLs (for color-wise image switching) */
  colorImages?: Record<string, string[]>;
  rating: number;
  reviews: number;
  isNew?: boolean;
  isBestSeller?: boolean;
  sizes: string[];
  colors: string[];
  description: string;
  fabric?: string;
}

export interface Category {
  id: string;
  name: string;
  image: string;
  slug: string;
  description?: string;
}

export interface CartItem extends Product {
  quantity: number;
  selectedSize: string;
  selectedColor: string;
}
