import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Star, Leaf, Award, Sparkles } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { ProductCard } from '../components/product/ProductCard';
import { products, categories } from '../data/mockData';

const fadeIn = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
};

export const Home = () => {
  const featuredProducts = products.slice(0, 4);

  return (
    <div className="bg-stone-50">
      {/* Hero Section */}
      <section className="relative h-screen w-full overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1583391733958-e02376e9ced3?q=80&w=2000&auto=format&fit=crop" 
            alt="Royal Ethnic Wear" 
            className="h-full w-full object-cover object-top scale-105 animate-[kenburns_20s_infinite_alternate]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
          <div className="absolute inset-0 bg-jade-950/30 mix-blend-multiply" />
        </div>
        
        <div className="relative container h-full flex items-center justify-center text-center">
          <motion.div 
            initial="initial"
            animate="animate"
            variants={{
              animate: { transition: { staggerChildren: 0.2 } }
            }}
            className="max-w-4xl text-white space-y-8 px-4"
          >
            <motion.div variants={fadeIn}>
                <span className="inline-block border border-white/30 backdrop-blur-sm px-4 py-1.5 text-xs font-bold uppercase tracking-[0.3em] text-gold-200 mb-4">
                    Spring / Summer 2026
                </span>
            </motion.div>
            
            <motion.h1 variants={fadeIn} className="font-serif text-5xl md:text-7xl lg:text-8xl font-medium leading-none tracking-tight">
              The Art of <br/> <span className="italic text-gold-200">Timeless</span> Elegance
            </motion.h1>
            
            <motion.p variants={fadeIn} className="text-stone-200 text-lg md:text-xl font-light max-w-2xl mx-auto leading-relaxed">
              Curated ethnic wear that blends royal heritage with contemporary finesse.
            </motion.p>
            
            <motion.div variants={fadeIn} className="pt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/shop">
                <Button variant="gold" size="lg" className="min-w-[180px]">
                  Shop Collection
                </Button>
              </Link>
              <Link to="/collections">
                <Button variant="outline" size="lg" className="min-w-[180px] border-white text-white hover:bg-white hover:text-jade-900">
                  Explore Categories
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
        
        {/* Scroll Indicator */}
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/60"
        >
            <span className="text-[10px] uppercase tracking-widest">Scroll</span>
            <div className="w-px h-12 bg-gradient-to-b from-white to-transparent" />
        </motion.div>
      </section>

      {/* Brand Values */}
      <section className="py-20 bg-white border-b border-stone-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center divide-y md:divide-y-0 md:divide-x divide-stone-100">
            <div className="px-4 py-4 space-y-4">
              <div className="w-12 h-12 mx-auto bg-jade-50 rounded-full flex items-center justify-center text-jade-800">
                <Leaf className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-jade-900">Premium Fabrics</h3>
              <p className="text-sm text-gray-500 leading-relaxed max-w-xs mx-auto">Sourced from the finest artisans, ensuring breathability and luxurious drape.</p>
            </div>
            <div className="px-4 py-4 space-y-4">
              <div className="w-12 h-12 mx-auto bg-jade-50 rounded-full flex items-center justify-center text-jade-800">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-jade-900">Handcrafted</h3>
              <p className="text-sm text-gray-500 leading-relaxed max-w-xs mx-auto">Intricate embroidery and detailing done by master craftsmen.</p>
            </div>
            <div className="px-4 py-4 space-y-4">
              <div className="w-12 h-12 mx-auto bg-jade-50 rounded-full flex items-center justify-center text-jade-800">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-jade-900">Exclusive Designs</h3>
              <p className="text-sm text-gray-500 leading-relaxed max-w-xs mx-auto">Limited edition pieces that ensure you stand out in every gathering.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories - Editorial Style */}
      <section className="py-24 container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-lg">
            <span className="text-gold-600 font-bold uppercase tracking-widest text-xs mb-2 block">Curated Collections</span>
            <h2 className="font-serif text-4xl md:text-5xl font-medium text-jade-950">Shop by Category</h2>
          </div>
          <Link to="/collections" className="group flex items-center gap-2 text-jade-900 font-bold uppercase tracking-widest text-xs border-b border-jade-900 pb-1">
            View All Collections <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-auto md:h-[600px]">
          {/* Large Item */}
          <Link to={`/shop?category=${categories[0].slug}`} className="md:col-span-6 relative group overflow-hidden h-[400px] md:h-full">
            <img 
              src={categories[0].image} 
              alt={categories[0].name} 
              className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
            <div className="absolute bottom-8 left-8 text-white">
              <h3 className="font-serif text-3xl md:text-4xl mb-2">{categories[0].name}</h3>
              <span className="text-xs font-bold uppercase tracking-widest underline decoration-gold-500 underline-offset-4">Explore</span>
            </div>
          </Link>

          {/* Smaller Items Grid */}
          <div className="md:col-span-6 grid grid-cols-2 gap-6 h-full">
             {categories.slice(1, 3).map((cat) => (
                <Link to={`/shop?category=${cat.slug}`} key={cat.id} className="relative group overflow-hidden h-[300px] md:h-auto">
                    <img 
                    src={cat.image} 
                    alt={cat.name} 
                    className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
                    <div className="absolute bottom-6 left-6 text-white">
                        <h3 className="font-serif text-2xl mb-2">{cat.name}</h3>
                        <span className="text-[10px] font-bold uppercase tracking-widest underline decoration-gold-500 underline-offset-4">Explore</span>
                    </div>
                </Link>
             ))}
             <Link to="/shop" className="col-span-2 bg-jade-900 flex flex-col items-center justify-center text-center p-8 text-white group overflow-hidden relative">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <div className="relative z-10">
                    <h3 className="font-serif text-3xl mb-4 italic">The Wedding Edit</h3>
                    <p className="text-jade-200 text-sm mb-6 max-w-xs mx-auto">Discover our handcrafted bridal and bridesmaid collection.</p>
                    <Button variant="gold" size="sm">View Collection</Button>
                </div>
             </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <span className="text-gold-600 font-bold uppercase tracking-widest text-xs">New Arrivals</span>
            <h2 className="font-serif text-4xl md:text-5xl font-medium text-jade-950">Trending This Season</h2>
            <div className="w-24 h-px bg-jade-200 mx-auto mt-6" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          
          <div className="mt-16 text-center">
             <Link to="/shop">
              <Button variant="outline" size="lg" className="min-w-[200px]">View All Products</Button>
             </Link>
          </div>
        </div>
      </section>

      {/* Story/About Teaser */}
      <section className="py-24 bg-stone-100 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="relative order-2 md:order-1">
               <div className="aspect-[4/5] bg-gray-300 relative z-10">
                 <img src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1000&auto=format&fit=crop" alt="Craftsmanship" className="w-full h-full object-cover" />
               </div>
               <div className="absolute -bottom-8 -left-8 w-2/3 h-2/3 border border-jade-900 z-0 hidden md:block" />
               <div className="absolute -top-8 -right-8 w-2/3 h-2/3 bg-jade-900/5 z-0 hidden md:block" />
            </div>
            
            <div className="space-y-8 order-1 md:order-2">
              <h2 className="font-serif text-4xl md:text-5xl font-medium text-jade-950 leading-tight">
                Weaving Stories in <br/> <span className="text-jade-800 italic">Silk & Thread</span>
              </h2>
              <p className="text-gray-600 leading-relaxed text-lg">
                Jade Collections began with a simple vision: to bring the grandeur of Indian royal heritage to the modern woman's wardrobe. Every piece tells a story of tradition, crafted with patience and passion.
              </p>
              <div className="grid grid-cols-2 gap-8 pt-4">
                <div>
                    <h4 className="font-serif text-3xl font-bold text-gold-600">15+</h4>
                    <p className="text-sm text-gray-500 uppercase tracking-wider mt-1">Years of Legacy</p>
                </div>
                <div>
                    <h4 className="font-serif text-3xl font-bold text-gold-600">5000+</h4>
                    <p className="text-sm text-gray-500 uppercase tracking-wider mt-1">Happy Customers</p>
                </div>
              </div>
              <div className="pt-4">
                <Link to="/about">
                    <Button variant="primary">Read Our Story</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-24 bg-jade-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
        <div className="container mx-auto px-4 relative z-10 text-center max-w-2xl">
          <h2 className="font-serif text-3xl md:text-4xl mb-6">Join the Inner Circle</h2>
          <p className="text-jade-200 mb-10 font-light">Subscribe to receive updates, access to exclusive deals, and more.</p>
          <form className="flex flex-col sm:flex-row gap-4">
            <input 
              type="email" 
              placeholder="Your email address" 
              className="flex-1 bg-transparent border border-jade-700 px-6 py-4 text-white placeholder:text-jade-500 focus:outline-none focus:border-gold-500 transition-colors"
            />
            <Button variant="gold" className="px-10">Subscribe</Button>
          </form>
        </div>
      </section>
    </div>
  );
};
