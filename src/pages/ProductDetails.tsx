import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Star, Minus, Plus, Heart, Share2, Truck, RotateCcw } from 'lucide-react';
import { products } from '../data/mockData';
import { Button } from '../components/ui/Button';
import { formatPrice, cn } from '../lib/utils';

export const ProductDetails = () => {
  const { id } = useParams();
  const product = products.find(p => p.id === id) || products[0];
  
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>(product.colors[0]);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(product.image);

  const images = product.images || [product.image, product.image, product.image];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="aspect-[3/4] bg-gray-100 overflow-hidden w-full">
            <img 
              src={activeImage} 
              alt={product.name} 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {images.map((img, idx) => (
              <button 
                key={idx}
                onClick={() => setActiveImage(img)}
                className={cn(
                  "aspect-[3/4] bg-gray-100 overflow-hidden border-2 transition-colors",
                  activeImage === img ? "border-jade-900" : "border-transparent hover:border-gray-300"
                )}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-8">
          <div>
            <p className="text-sm text-gray-500 mb-2">{product.category}</p>
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-jade-900 mb-4">{product.name}</h1>
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-1 text-gold-500">
                <Star className="w-4 h-4 fill-current" />
                <span className="text-sm font-medium text-gray-700 ml-1">{product.rating}</span>
              </div>
              <span className="text-gray-300">|</span>
              <span className="text-sm text-gray-500">{product.reviews} Reviews</span>
            </div>
            <div className="flex items-baseline gap-4">
              <span className="text-3xl font-bold text-jade-900">{formatPrice(product.price)}</span>
              {product.originalPrice && (
                <span className="text-lg text-gray-400 line-through">{formatPrice(product.originalPrice)}</span>
              )}
              {product.originalPrice && (
                <span className="text-sm font-bold text-red-600 bg-red-50 px-2 py-1">
                  {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">Inclusive of all taxes</p>
          </div>

          <div className="h-px bg-gray-200" />

          {/* Variants */}
          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <span className="font-medium text-gray-900">Color: {selectedColor}</span>
              </div>
              <div className="flex gap-3">
                {product.colors.map(color => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={cn(
                      "px-4 py-2 border text-sm transition-all",
                      selectedColor === color 
                        ? "border-jade-900 bg-jade-50 text-jade-900 font-medium" 
                        : "border-gray-200 text-gray-600 hover:border-gray-400"
                    )}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="font-medium text-gray-900">Size</span>
                <button className="text-xs text-jade-700 underline">Size Guide</button>
              </div>
              <div className="grid grid-cols-5 gap-3">
                {product.sizes.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={cn(
                      "py-3 border text-sm transition-all text-center",
                      selectedSize === size 
                        ? "border-jade-900 bg-jade-900 text-white" 
                        : "border-gray-200 text-gray-600 hover:border-gray-400"
                    )}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity & Actions */}
            <div className="flex gap-4 pt-4">
              <div className="flex items-center border border-gray-300 w-32">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 hover:bg-gray-50 text-gray-600"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="flex-1 text-center font-medium">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-3 hover:bg-gray-50 text-gray-600"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <Button className="flex-1" size="lg">Add to Cart</Button>
              <button className="p-3 border border-gray-300 text-gray-600 hover:border-red-500 hover:text-red-500 transition-colors">
                <Heart className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="h-px bg-gray-200" />

          {/* Delivery & Info */}
          <div className="grid grid-cols-1 gap-4 text-sm text-gray-600">
            <div className="flex gap-3">
              <Truck className="w-5 h-5 text-jade-700 shrink-0" />
              <div>
                <p className="font-medium text-gray-900">Free Delivery</p>
                <p>Enter your pincode to check delivery date</p>
              </div>
            </div>
            <div className="flex gap-3">
              <RotateCcw className="w-5 h-5 text-jade-700 shrink-0" />
              <div>
                <p className="font-medium text-gray-900">Easy Returns</p>
                <p>7-day return policy for unstitched suits</p>
              </div>
            </div>
          </div>

          {/* Description Tab (Simplified) */}
          <div className="pt-4">
            <h3 className="font-serif font-bold text-lg mb-2">Product Description</h3>
            <p className="text-gray-600 leading-relaxed mb-4">{product.description}</p>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              <li>Fabric: {product.fabric}</li>
              <li>Pattern: Embroidered</li>
              <li>Occasion: Festive, Wedding</li>
              <li>Care: Dry Clean Only</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
