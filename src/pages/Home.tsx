import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Star, Truck, ShieldCheck, Clock } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { ProductCard } from '../components/product/ProductCard';
import { products, categories } from '../data/mockData';

export const Home = () => {
  const featuredProducts = products.slice(0, 4);

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative h-[85vh] w-full overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1596462502278-27bfdd403348?q=80&w=1920&auto=format&fit=crop" 
            alt="Royal Ethnic Wear" 
            className="h-full w-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
        </div>
        
        <div className="relative container h-full flex items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-xl text-white space-y-6 px-4"
          >
            <span className="text-gold-400 uppercase tracking-[0.3em] text-sm font-semibold">New Collection 2026</span>
            <h1 className="font-serif text-5xl md:text-7xl font-bold leading-tight">
              Elegance in <br/> Every Thread
            </h1>
            <p className="text-gray-200 text-lg md:text-xl font-light">
              Discover our exclusive range of handcrafted Anarkalis and premium suits designed for the modern royal.
            </p>
            <div className="pt-4">
              <Link to="/shop">
                <Button size="lg" className="bg-white text-jade-900 hover:bg-gold-100">
                  Shop Latest Suits
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Strip */}
      <section className="bg-jade-50 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center gap-4 justify-center md:justify-start">
              <div className="p-3 bg-white rounded-full text-jade-800 shadow-sm">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900">Free Shipping</h4>
                <p className="text-sm text-gray-600">On all orders above ₹2999</p>
              </div>
            </div>
            <div className="flex items-center gap-4 justify-center md:justify-start">
              <div className="p-3 bg-white rounded-full text-jade-800 shadow-sm">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900">Secure Payment</h4>
                <p className="text-sm text-gray-600">100% secure payment gateways</p>
              </div>
            </div>
            <div className="flex items-center gap-4 justify-center md:justify-start">
              <div className="p-3 bg-white rounded-full text-jade-800 shadow-sm">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900">Fast Delivery</h4>
                <p className="text-sm text-gray-600">Within 3-5 business days</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-jade-900 mb-4">Shop by Category</h2>
          <div className="h-1 w-20 bg-gold-500 mx-auto" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <Link to={`/shop?category=${cat.slug}`} key={cat.id} className="group relative overflow-hidden aspect-[3/4]">
              <img 
                src={cat.image} 
                alt={cat.name} 
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
              <div className="absolute bottom-6 left-0 right-0 text-center">
                <h3 className="text-white font-serif text-2xl font-bold mb-2">{cat.name}</h3>
                <span className="text-white/80 text-sm uppercase tracking-wider underline underline-offset-4 decoration-gold-500">Explore</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="container mx-auto px-4">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-jade-900 mb-2">New Arrivals</h2>
            <p className="text-gray-600">Fresh from our designers, curated for you.</p>
          </div>
          <Link to="/shop" className="hidden md:flex items-center gap-2 text-jade-800 font-medium hover:text-gold-600 transition-colors">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        
        <div className="mt-8 text-center md:hidden">
           <Link to="/shop">
            <Button variant="outline" className="w-full">View All Products</Button>
           </Link>
        </div>
      </section>

      {/* Festival Banner */}
      <section className="container mx-auto px-4">
        <div className="relative rounded-sm overflow-hidden bg-jade-900">
          <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
          <div className="grid md:grid-cols-2 items-center relative z-10">
            <div className="p-12 md:p-16 text-center md:text-left">
              <span className="text-gold-400 uppercase tracking-widest font-semibold text-sm">Wedding Season Special</span>
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-white mt-4 mb-6 leading-tight">
                The Royal Wedding Collection
              </h2>
              <p className="text-jade-100 mb-8 max-w-md mx-auto md:mx-0">
                Handpicked designs that blend traditional craftsmanship with contemporary silhouettes. Make your special day unforgettable.
              </p>
              <Button variant="secondary" size="lg">Explore Collection</Button>
            </div>
            <div className="h-64 md:h-full min-h-[400px]">
              <img 
                src="https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=1000&auto=format&fit=crop" 
                alt="Wedding Collection" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-stone-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl font-bold text-jade-900">Loved by our Customers</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white p-8 shadow-sm border border-stone-100 text-center">
                <div className="flex justify-center gap-1 text-gold-500 mb-4">
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                </div>
                <p className="text-gray-600 italic mb-6">
                  "The quality of the fabric is absolutely premium. The fit was perfect and the delivery was super fast to Hyderabad. Highly recommended!"
                </p>
                <h4 className="font-bold text-jade-900">- Priya Reddy</h4>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
