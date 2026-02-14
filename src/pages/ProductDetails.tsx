import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Minus, Plus, Heart, Share2, Truck, RotateCcw, ShieldCheck } from 'lucide-react';
import { productsApi, cartApi } from '../lib/api';
import { apiProductToProduct } from '../lib/productMapper';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/Button';
import { formatPrice, cn } from '../lib/utils';
import { motion } from 'framer-motion';
import { container, item } from '../lib/animations';

export const ProductDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [product, setProduct] = useState<ReturnType<typeof apiProductToProduct> | null>(null);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    productsApi
      .get(id)
      .then((res) => setProduct(apiProductToProduct(res.data.data)))
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = async () => {
    if (!product || !user) return;
    setAddingToCart(true);
    try {
      await cartApi.addItem(product.id, 1, selectedSize || undefined, selectedColor || undefined);
      alert('Added to cart!');
    } catch {
      alert('Failed to add to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  const p = product;
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>(p?.colors?.[0] ?? '');
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(p?.images?.[0] ?? p?.image ?? '');

  useEffect(() => {
    if (p) {
      setSelectedColor(p.colors?.[0] ?? '');
      setActiveImage(p.images?.[0] ?? p.image ?? '');
    }
  }, [p]);

  if (loading) {
    return (
      <div className="pt-24 pb-16 min-h-[60vh] flex items-center justify-center">
        <div className="animate-pulse text-stone-500">Loading...</div>
      </div>
    );
  }

  if (!p) {
    return (
      <div className="pt-24 pb-16 min-h-[60vh] flex flex-col items-center justify-center">
        <p className="text-stone-600 mb-4">Product not found.</p>
        <Link to="/shop">
          <Button>Back to Shop</Button>
        </Link>
      </div>
    );
  }

  const images = p.images?.length ? p.images : [p.image, p.image, p.image];

  return (
    <motion.div 
      className="pt-24 pb-16 bg-white min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="container mx-auto px-4">
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20"
          initial="hidden"
          animate="show"
          variants={container}
        >
          {/* Image Gallery - Sticky */}
          <motion.div className="space-y-6 lg:sticky lg:top-28 h-fit" variants={item}>
            <motion.div 
              key={activeImage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="aspect-[3/4] bg-stone-100 overflow-hidden w-full relative group"
            >
              <img 
              src={activeImage} 
              alt={p.name}
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
          </motion.div>

          {/* Product Info */}
          <motion.div className="space-y-10 pt-4" variants={item}>
            <div className="space-y-4">
              <nav className="text-xs text-gray-500 uppercase tracking-widest mb-4">
                Home / Shop / {p.category}
              </nav>
              <h1 className="font-serif text-4xl lg:text-5xl text-jade-950 leading-tight">{p.name}</h1>
              
              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-1 text-gold-500">
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current text-gray-300" />
                  <span className="text-gray-500 ml-2 underline decoration-gray-300 underline-offset-4">{p.reviews} Reviews</span>
                </div>
                <span className="text-green-600 font-medium flex items-center gap-1"><ShieldCheck className="w-4 h-4" /> In Stock</span>
              </div>

              <div className="flex items-baseline gap-4 pt-2">
                <span className="text-3xl font-serif text-jade-900">{formatPrice(p.price)}</span>
                {p.originalPrice && (
                  <>
                    <span className="text-lg text-gray-400 line-through font-light">{formatPrice(p.originalPrice)}</span>
                    <span className="text-xs font-bold text-gold-600 uppercase tracking-wider border border-gold-200 bg-gold-50 px-2 py-1">
                      {Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)}% OFF
                    </span>
                  </>
                )}
              </div>
              <p className="text-xs text-gray-500">Inclusive of all taxes. Free shipping on orders above ₹2999.</p>
            </div>

            <div className="h-px bg-gray-100" />

            {/* Description Short */}
            <p className="text-gray-600 leading-relaxed font-light text-lg">
                {p.description || 'Crafted with precision to offer you a blend of comfort and royal aesthetics.'}
            </p>

            {/* Variants */}
            <div className="space-y-8">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-gray-900 block mb-3">Color: <span className="text-gray-500 font-normal">{selectedColor}</span></span>
                <div className="flex gap-3">
                  {(p.colors?.length ? p.colors : ['Default']).map(color => (
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
                  {(p.sizes?.length ? p.sizes : ['S', 'M', 'L', 'XL']).map(size => (
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
                {user ? (
                  <Button type="button" className="flex-1 h-12" size="lg" onClick={handleAddToCart} isLoading={addingToCart}>
                    Add to Cart
                  </Button>
                ) : (
                  <Link to={`/login?redirect=/product/${id}`} className="flex-1">
                    <Button className="w-full h-12" size="lg">
                      Sign in to Add to Cart
                    </Button>
                  </Link>
                )}
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
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};
