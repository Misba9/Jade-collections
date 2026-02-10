import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Star, Minus, Plus, Heart, Share2, Truck, RotateCcw, ShieldCheck } from 'lucide-react';
import { products } from '../data/mockData';
import { Button } from '../components/ui/Button';
import { formatPrice, cn } from '../lib/utils';
import { motion } from 'framer-motion';

export const ProductDetails = () => {
  const { id } = useParams();
  const product = products.find(p => p.id === id) || products[0];
  
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>(product.colors[0]);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(product.image);

  const images = product.images || [product.image, product.image, product.image];

  return (
    <div className="pt-24 pb-16 bg-white min-h-screen">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Image Gallery - Sticky */}
          <div className="space-y-6 lg:sticky lg:top-28 h-fit">
            <motion.div 
              key={activeImage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="aspect-[3/4] bg-stone-100 overflow-hidden w-full relative group"
            >
              <img 
                src={activeImage} 
                alt={product.name} 
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4 z-10">
                 <button className="p-3 rounded-full bg-white/80 backdrop-blur hover:bg-white text-jade-900 shadow-sm transition-all">
                    <Share2 className="w-5 h-5" />
                 </button>
              </div>
            </motion.div>
            <div className="grid grid-cols-4 gap-4">
              {images.map((img, idx) => (
                <button 
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={cn(
                    "aspect-[3/4] bg-stone-100 overflow-hidden border-2 transition-all",
                    activeImage === img ? "border-jade-900 opacity-100" : "border-transparent opacity-60 hover:opacity-100"
                  )}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-10 pt-4">
            <div className="space-y-4">
              <nav className="text-xs text-gray-500 uppercase tracking-widest mb-4">
                Home / Shop / {product.category}
              </nav>
              <h1 className="font-serif text-4xl lg:text-5xl text-jade-950 leading-tight">{product.name}</h1>
              
              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-1 text-gold-500">
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current text-gray-300" />
                  <span className="text-gray-500 ml-2 underline decoration-gray-300 underline-offset-4">{product.reviews} Reviews</span>
                </div>
                <span className="text-green-600 font-medium flex items-center gap-1"><ShieldCheck className="w-4 h-4" /> In Stock</span>
              </div>

              <div className="flex items-baseline gap-4 pt-2">
                <span className="text-3xl font-serif text-jade-900">{formatPrice(product.price)}</span>
                {product.originalPrice && (
                  <>
                    <span className="text-lg text-gray-400 line-through font-light">{formatPrice(product.originalPrice)}</span>
                    <span className="text-xs font-bold text-gold-600 uppercase tracking-wider border border-gold-200 bg-gold-50 px-2 py-1">
                      {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                    </span>
                  </>
                )}
              </div>
              <p className="text-xs text-gray-500">Inclusive of all taxes. Free shipping on orders above ₹2999.</p>
            </div>

            <div className="h-px bg-gray-100" />

            {/* Description Short */}
            <p className="text-gray-600 leading-relaxed font-light text-lg">
                {product.description} Crafted with precision to offer you a blend of comfort and royal aesthetics.
            </p>

            {/* Variants */}
            <div className="space-y-8">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-gray-900 block mb-3">Color: <span className="text-gray-500 font-normal">{selectedColor}</span></span>
                <div className="flex gap-3">
                  {product.colors.map(color => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={cn(
                        "h-10 px-4 border text-sm transition-all min-w-[3rem]",
                        selectedColor === color 
                          ? "border-jade-900 bg-jade-900 text-white" 
                          : "border-gray-200 text-gray-600 hover:border-gray-400"
                      )}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-widest text-gray-900">Size</span>
                  <button className="text-xs text-jade-800 underline underline-offset-4">Size Guide</button>
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
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <div className="flex items-center border border-gray-300 w-full sm:w-32 h-12">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 hover:bg-gray-50 text-gray-600 w-10 flex items-center justify-center"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="flex-1 text-center font-medium">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 hover:bg-gray-50 text-gray-600 w-10 flex items-center justify-center"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <Button className="flex-1 h-12" size="lg">Add to Cart</Button>
                <button className="h-12 w-12 border border-gray-300 text-gray-600 hover:border-red-500 hover:text-red-500 transition-colors flex items-center justify-center">
                  <Heart className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Accordion / Details */}
            <div className="border-t border-gray-100 pt-8 space-y-6">
                <div className="flex gap-4 items-start">
                    <Truck className="w-5 h-5 text-jade-800 mt-1 shrink-0" />
                    <div>
                        <h4 className="font-serif text-lg text-jade-900 mb-1">Shipping & Delivery</h4>
                        <p className="text-sm text-gray-500 leading-relaxed">Orders are shipped within 24 hours. Delivery takes 3-5 business days. Express shipping available at checkout.</p>
                    </div>
                </div>
                <div className="flex gap-4 items-start">
                    <RotateCcw className="w-5 h-5 text-jade-800 mt-1 shrink-0" />
                    <div>
                        <h4 className="font-serif text-lg text-jade-900 mb-1">Returns & Exchanges</h4>
                        <p className="text-sm text-gray-500 leading-relaxed">Easy returns within 7 days of delivery. Product must be unused and with original tags.</p>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
