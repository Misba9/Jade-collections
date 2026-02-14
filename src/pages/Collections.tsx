import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { categoriesApi } from '../lib/api';

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1583391733958-e02376e9ced3?q=80&w=800&auto=format&fit=crop';

interface Collection {
  id: string;
  name: string;
  slug: string;
  image: string;
  description?: string;
}

export const Collections = () => {
  const [collections, setCollections] = useState<Collection[]>([]);

  useEffect(() => {
    categoriesApi
      .listPublic()
      .then((res) => {
        const cats = (res.data.data ?? []).map((c: { _id: string; name: string; slug?: string; image?: string }) => ({
          id: c._id,
          name: c.name,
          slug: c.slug ?? c.name.toLowerCase().replace(/\s+/g, '-'),
          image: c.image ?? DEFAULT_IMAGE,
          description: `Discover the essence of ${c.name}, featuring exquisite craftsmanship.`,
        }));
        setCollections(cats);
      })
      .catch(() => setCollections([]));
  }, []);
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
