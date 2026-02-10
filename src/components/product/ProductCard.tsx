import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Eye } from 'lucide-react';
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
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
      className="group relative bg-white"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-stone-100">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover object-top transition-transform duration-700 ease-in-out group-hover:scale-110"
        />
        
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-jade-950/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.isNew && (
            <span className="bg-white/90 backdrop-blur-sm text-jade-900 text-[10px] uppercase tracking-widest px-3 py-1 font-semibold shadow-sm">New Arrival</span>
          )}
          {product.originalPrice && (
            <span className="bg-gold-500 text-white text-[10px] uppercase tracking-widest px-3 py-1 font-semibold shadow-sm">
              Sale
            </span>
          )}
        </div>

        {/* Quick Actions */}
        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full transition-transform duration-300 group-hover:translate-y-0">
           <div className="flex gap-2">
             <button className="flex-1 bg-white text-jade-900 py-3 text-xs uppercase tracking-wider font-bold shadow-lg hover:bg-jade-900 hover:text-white transition-colors flex items-center justify-center gap-2">
               <ShoppingBag className="w-4 h-4" /> Add to Cart
             </button>
             <Link to={`/product/${product.id}`} className="bg-white p-3 text-jade-900 shadow-lg hover:bg-gold-500 hover:text-white transition-colors">
               <Eye className="w-4 h-4" />
             </Link>
           </div>
        </div>
        
        <button className="absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur-sm text-jade-900 opacity-0 translate-x-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 hover:text-red-500">
          <Heart className="w-4 h-4" />
        </button>
      </div>

      <div className="mt-5 text-center space-y-2 px-2">
        <p className="text-[10px] text-gold-600 uppercase tracking-widest font-semibold">{product.category}</p>
        <h3 className="text-base font-serif text-jade-950 line-clamp-1 group-hover:text-gold-600 transition-colors">
          <Link to={`/product/${product.id}`}>
            <span aria-hidden="true" className="absolute inset-0" />
            {product.name}
          </Link>
        </h3>
        <div className="flex items-center justify-center gap-3">
          <p className="text-sm font-bold text-jade-900">{formatPrice(product.price)}</p>
          {product.originalPrice && (
            <p className="text-xs text-gray-400 line-through decoration-gray-400">{formatPrice(product.originalPrice)}</p>
          )}
        </div>
      </div>
    </motion.div>
  );
};
