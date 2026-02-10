import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { categories } from '../data/mockData';

// Extended mock data for collections page
const collections = [
  ...categories,
  {
    id: '5',
    name: 'The Royal Wedding Edit',
    slug: 'wedding',
    image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=1000&auto=format&fit=crop',
    description: 'Opulent designs for your special day.'
  },
  {
    id: '6',
    name: 'Summer Breeze',
    slug: 'summer',
    image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=1000&auto=format&fit=crop',
    description: 'Lightweight cottons and pastels.'
  }
];

export const Collections = () => {
  return (
    <div className="pt-24 pb-16 bg-stone-50 min-h-screen">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-6">
          <h1 className="font-serif text-5xl md:text-6xl text-jade-950">Our Collections</h1>
          <p className="text-gray-600 text-lg font-light">
            Explore our thoughtfully curated edits, each designed with a specific mood and occasion in mind. From grand weddings to intimate gatherings.
          </p>
        </div>

        <div className="space-y-24">
          {collections.map((collection, index) => (
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              key={collection.id} 
              className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-12 items-center`}
            >
              <div className="w-full md:w-1/2 aspect-[4/3] overflow-hidden relative group">
                <img 
                  src={collection.image} 
                  alt={collection.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 border-[12px] border-white/90 pointer-events-none" />
              </div>
              
              <div className="w-full md:w-1/2 text-center md:text-left space-y-6 px-4 md:px-12">
                <span className="text-gold-600 font-bold uppercase tracking-widest text-xs">Collection 0{index + 1}</span>
                <h2 className="font-serif text-4xl md:text-5xl text-jade-900">{collection.name}</h2>
                <p className="text-gray-600 leading-relaxed text-lg">
                  {collection.description || `Discover the essence of ${collection.name}, featuring exquisite craftsmanship and timeless designs perfect for the modern woman.`}
                </p>
                <div className="pt-4">
                  <Link 
                    to={`/shop?category=${collection.slug}`}
                    className="inline-flex items-center gap-3 text-jade-900 font-bold uppercase tracking-widest text-xs hover:text-gold-600 transition-colors group"
                  >
                    View Products <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-2" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
