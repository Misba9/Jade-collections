import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag } from 'lucide-react';
import { Product } from '../../types';
import { formatPrice } from '../../lib/utils';
import { motion } from 'framer-motion';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative bg-white"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.isNew && (
            <span className="bg-jade-900 text-white text-[10px] uppercase tracking-wider px-2 py-1 font-medium">New</span>
          )}
          {product.originalPrice && (
            <span className="bg-red-600 text-white text-[10px] uppercase tracking-wider px-2 py-1 font-medium">
              {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
            </span>
          )}
        </div>

        {/* Quick Actions */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 opacity-0 translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 px-4">
           <button className="flex-1 bg-white text-jade-900 py-2 text-sm font-medium shadow-lg hover:bg-jade-900 hover:text-white transition-colors flex items-center justify-center gap-2">
             <ShoppingBag className="w-4 h-4" /> Add to Cart
           </button>
           <button className="bg-white p-2 text-jade-900 shadow-lg hover:text-red-500 transition-colors">
             <Heart className="w-5 h-5" />
           </button>
        </div>
      </div>

      <div className="mt-4 space-y-1">
        <p className="text-xs text-gray-500 uppercase tracking-wide">{product.category}</p>
        <h3 className="text-base font-medium text-gray-900 line-clamp-1">
          <Link to={`/product/${product.id}`}>
            <span aria-hidden="true" className="absolute inset-0" />
            {product.name}
          </Link>
        </h3>
        <div className="flex items-center gap-2">
          <p className="text-lg font-bold text-jade-900">{formatPrice(product.price)}</p>
          {product.originalPrice && (
            <p className="text-sm text-gray-400 line-through">{formatPrice(product.originalPrice)}</p>
          )}
        </div>
      </div>
    </motion.div>
  );
};
