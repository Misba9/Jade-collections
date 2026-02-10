import React, { useState } from 'react';
import { Filter, ChevronDown } from 'lucide-react';
import { products } from '../data/mockData';
import { ProductCard } from '../components/product/ProductCard';

export const Shop = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-jade-900">All Products</h1>
          <p className="text-gray-500 text-sm mt-1">Showing {products.length} results</p>
        </div>
        
        <div className="flex gap-4 w-full md:w-auto">
          <button 
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-sm hover:border-jade-900 transition-colors md:hidden"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            <Filter className="w-4 h-4" /> Filters
          </button>
          
          <div className="relative flex-1 md:flex-none">
            <select className="w-full appearance-none bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded-sm focus:outline-none focus:border-jade-900">
              <option>Sort by: Popularity</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Newest First</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Sidebar Filters (Desktop) */}
        <aside className="hidden md:block w-64 shrink-0 space-y-8">
          <div>
            <h3 className="font-serif font-bold text-lg mb-4 text-jade-900">Categories</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><label className="flex items-center gap-2 hover:text-jade-700 cursor-pointer"><input type="checkbox" className="accent-jade-900" /> Anarkali Suits</label></li>
              <li><label className="flex items-center gap-2 hover:text-jade-700 cursor-pointer"><input type="checkbox" className="accent-jade-900" /> Straight Suits</label></li>
              <li><label className="flex items-center gap-2 hover:text-jade-700 cursor-pointer"><input type="checkbox" className="accent-jade-900" /> Palazzo Sets</label></li>
              <li><label className="flex items-center gap-2 hover:text-jade-700 cursor-pointer"><input type="checkbox" className="accent-jade-900" /> Party Wear</label></li>
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
        <div className="flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          
          {/* Pagination */}
          <div className="mt-12 flex justify-center gap-2">
            <button className="w-10 h-10 border border-jade-900 bg-jade-900 text-white font-medium">1</button>
            <button className="w-10 h-10 border border-gray-300 hover:border-jade-900 transition-colors">2</button>
            <button className="w-10 h-10 border border-gray-300 hover:border-jade-900 transition-colors">3</button>
          </div>
        </div>
      </div>
    </div>
  );
};
