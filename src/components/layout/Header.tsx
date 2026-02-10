import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Search, ShoppingBag, User, Menu, X, Heart } from 'lucide-react';
import { cn } from '../../lib/utils';

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'New Arrivals', path: '/shop?sort=new' },
    { name: 'Collections', path: '/collections' },
    { name: 'About', path: '/about' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
      {/* Top Bar */}
      <div className="bg-jade-900 text-white text-xs py-2 text-center tracking-wide">
        <p>Free Shipping on orders above ₹2999 | Worldwide Shipping Available</p>
      </div>

      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          {/* Mobile Menu Button */}
          <button 
            className="lg:hidden p-2 text-gray-600"
            onClick={() => setIsMenuOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>

          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img 
              src="/jade-collections-logo.jpeg" 
              alt="Jade Collections Logo" 
              className="h-10 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  cn(
                    "text-sm font-medium uppercase tracking-wide transition-colors hover:text-gold-600",
                    isActive ? "text-gold-600" : "text-gray-800"
                  )
                }
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          {/* Icons */}
          <div className="flex items-center gap-4 lg:gap-6">
            <button className="text-gray-800 hover:text-gold-600 transition-colors">
              <Search className="h-5 w-5" />
            </button>
            <Link to="/wishlist" className="hidden lg:block text-gray-800 hover:text-gold-600 transition-colors">
              <Heart className="h-5 w-5" />
            </Link>
            <Link to="/cart" className="text-gray-800 hover:text-gold-600 transition-colors relative">
              <ShoppingBag className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 bg-jade-900 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">2</span>
            </Link>
            <Link to="/login" className="hidden lg:block text-gray-800 hover:text-gold-600 transition-colors">
              <User className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsMenuOpen(false)} />
          <div className="fixed inset-y-0 left-0 w-3/4 max-w-xs bg-white shadow-xl p-6">
            <div className="flex items-center justify-between mb-8">
              <span className="font-serif text-xl font-bold text-jade-900">Menu</span>
              <button onClick={() => setIsMenuOpen(false)}>
                <X className="h-6 w-6 text-gray-500" />
              </button>
            </div>
            <nav className="flex flex-col gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="text-lg font-medium text-gray-800 border-b border-gray-100 pb-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <Link to="/login" className="text-lg font-medium text-gray-800 border-b border-gray-100 pb-2 flex items-center gap-2">
                <User className="h-5 w-5" /> Login / Register
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};
