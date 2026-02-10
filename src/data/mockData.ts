import { Product, Category } from '../types';

export const categories: Category[] = [
  {
    id: '1',
    name: 'Anarkali Suits',
    slug: 'anarkali',
    image: 'https://images.unsplash.com/photo-1583391733958-e02376e9ced3?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: '2',
    name: 'Straight Suits',
    slug: 'straight-suits',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: '3',
    name: 'Palazzo Sets',
    slug: 'palazzo-sets',
    image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: '4',
    name: 'Party Wear',
    slug: 'party-wear',
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=800&auto=format&fit=crop'
  }
];

export const products: Product[] = [
  {
    id: '1',
    name: 'Emerald Green Embroidered Anarkali',
    price: 6999,
    originalPrice: 6999,
    category: 'Anarkali',
    image: 'https://images.unsplash.com/photo-1593030761757-71faa11274dc?q=80&w=800&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1593030761757-71faa11274dc?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?q=80&w=800&auto=format&fit=crop'
    ],
    rating: 4.8,
    reviews: 124,
    isNew: true,
    isBestSeller: true,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Green', 'Maroon'],
    description: 'Exquisite emerald green Anarkali suit featuring intricate gold zari embroidery. Perfect for weddings and festive occasions.',
    fabric: 'Georgette'
  },
  {
    id: '2',
    name: 'Royal Blue Silk Straight Suit',
    price: 3499,
    originalPrice: 4500,
    category: 'Straight Suits',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=800&auto=format&fit=crop',
    rating: 4.5,
    reviews: 89,
    isNew: false,
    isBestSeller: true,
    sizes: ['M', 'L', 'XL'],
    colors: ['Blue', 'Pink'],
    description: 'Elegant straight cut suit in pure silk with minimal handwork.',
    fabric: 'Pure Silk'
  },
  {
    id: '3',
    name: 'Blush Pink Palazzo Set',
    price: 2999,
    category: 'Palazzo Sets',
    image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=800&auto=format&fit=crop',
    rating: 4.6,
    reviews: 56,
    isNew: true,
    isBestSeller: false,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Pink', 'Yellow'],
    description: 'Contemporary palazzo set with floral prints, ideal for day events.',
    fabric: 'Cotton'
  },
  {
    id: '4',
    name: 'Maroon Velvet Party Wear Suit',
    price: 8999,
    originalPrice: 12000,
    category: 'Party Wear',
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=800&auto=format&fit=crop',
    rating: 4.9,
    reviews: 210,
    isNew: false,
    isBestSeller: true,
    sizes: ['M', 'L', 'XL', 'XXL'],
    colors: ['Maroon'],
    description: 'Luxurious velvet suit with heavy zardosi work.',
    fabric: 'Velvet'
  },
  {
    id: '5',
    name: 'Mustard Yellow Festive Anarkali',
    price: 5500,
    category: 'Anarkali',
    image: '/product_images/mustard-yellow-festive-anarkali.webp',
    rating: 4.7,
    reviews: 45,
    isNew: true,
    isBestSeller: false,
    sizes: ['S', 'M', 'L'],
    colors: ['Yellow', 'Orange'],
    description: 'Bright and beautiful mustard anarkali for Haldi ceremonies.',
    fabric: 'Chiffon'
  },
  {
    id: '6',
    name: 'Ivory & Gold Straight Suit',
    price: 4200,
    category: 'Straight Suits',
    image: 'https://images.unsplash.com/photo-1589810635657-232948472d98?q=80&w=800&auto=format&fit=crop',
    rating: 4.4,
    reviews: 32,
    isNew: false,
    isBestSeller: false,
    sizes: ['M', 'L', 'XL'],
    colors: ['Ivory'],
    description: 'Classy ivory suit with gold foil print.',
    fabric: 'Chanderi'
  }
];
