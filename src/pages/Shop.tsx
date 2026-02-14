import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Filter, ChevronDown } from 'lucide-react';
import { productsApi, categoriesApi } from '../lib/api';
import { ProductCard } from '../components/product/ProductCard';
import { apiProductToProduct } from '../lib/productMapper';
import type { Product, Category } from '../types';
import { container, item } from '../lib/animations';

export const Shop = () => {
  const [searchParams] = useSearchParams();
  const categorySlug = searchParams.get('category');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sort, setSort] = useState('latest');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const categoriesRes = await categoriesApi.listPublic();
        const cats = (categoriesRes.data.data ?? []).map((c: { _id: string; name: string; slug?: string; image?: string }) => ({
          id: c._id,
          name: c.name,
          slug: c.slug ?? c.name.toLowerCase().replace(/\s+/g, '-'),
          image: c.image ?? '',
        }));
        setCategories(cats);

        const categoryId = categorySlug ? cats.find((c: { slug: string }) => c.slug === categorySlug)?.id : undefined;
        const productsRes = await productsApi.list({
          limit: 24,
          sort,
          ...(categoryId && { category: categoryId }),
          isActive: 'true',
        });
        const prods = (productsRes.data.data ?? []).map(apiProductToProduct);
        setProducts(prods);
      } catch {
        setProducts([]);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [categorySlug, sort]);

  return (
    <motion.div 
      className="container mx-auto px-4 pt-16 pb-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header */}
      <motion.div 
        className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <h1 className="font-serif text-3xl font-bold text-jade-900">All Products</h1>
          <p className="text-gray-500 text-sm mt-1">
            {loading ? 'Loading...' : `Showing ${products.length} results`}
          </p>
        </div>
        
        <div className="flex gap-4 w-full md:w-auto">
          <button 
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-sm hover:border-jade-900 transition-colors md:hidden"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            <Filter className="w-4 h-4" /> Filters
          </button>
          
          <div className="relative flex-1 md:flex-none">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-full appearance-none bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded-sm focus:outline-none focus:border-jade-900"
            >
              <option value="latest">Newest First</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="popularity">Popularity</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
          </div>
        </div>
      </motion.div>

      <div className="flex gap-8">
        {/* Sidebar Filters (Desktop) */}
        <aside className="hidden md:block w-64 shrink-0 space-y-8">
          <div>
            <h3 className="font-serif font-bold text-lg mb-4 text-jade-900">Categories</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <a href="/shop" className={`block hover:text-jade-700 ${!categorySlug ? 'font-semibold text-jade-900' : ''}`}>
                  All Products
                </a>
              </li>
              {categories.map((cat) => (
                <li key={cat.id}>
                  <a
                    href={`/shop?category=${cat.slug}`}
                    className={`block hover:text-jade-700 ${categorySlug === cat.slug ? 'font-semibold text-jade-900' : ''}`}
                  >
                    {cat.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-serif font-bold text-lg mb-4 text-jade-900">Price Range</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" className="accent-jade-900" /> Under ₹2000</label>
              <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" className="accent-jade-900" /> ₹2000 - ₹5000</label>
              <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" className="accent-jade-900" /> ₹5000 - ₹10000</label>
              <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" className="accent-jade-900" /> Above ₹10000</label>
            </div>
          </div>

          <div>
            <h3 className="font-serif font-bold text-lg mb-4 text-jade-900">Size</h3>
            <div className="grid grid-cols-3 gap-2">
              {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map(size => (
                <button key={size} className="border border-gray-200 py-2 text-sm hover:border-jade-900 hover:text-jade-900 transition-colors">
                  {size}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1 min-w-0">
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
            initial="hidden"
            animate="show"
            variants={container}
          >
            {(loading ? [] : products).map((product) => (
              <motion.div key={product.id} variants={item} className="h-full min-w-0">
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
          
          {!loading && products.length === 0 && (
            <p className="text-center text-stone-500 py-12">No products found.</p>
          )}
        </div>
      </div>
    </motion.div>
  );
};
