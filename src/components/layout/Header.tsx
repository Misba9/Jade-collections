import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Search, ShoppingBag, User, Menu, X, Heart } from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'Collections', path: '/collections' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <>
      <header 
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-transparent",
          isScrolled || !isHome 
            ? "bg-white/95 backdrop-blur-md py-2 shadow-sm border-stone-100 text-jade-950" 
            : "bg-transparent py-6 text-white"
        )}
      >
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between">
            {/* Mobile Menu Button */}
            <button 
              className="lg:hidden p-2"
              onClick={() => setIsMenuOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </button>

            {/* Desktop Navigation - Left */}
            <nav className="hidden lg:flex items-center gap-8 flex-1">
              {navLinks.slice(0, 3).map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  className={({ isActive }) =>
                    cn(
                      "text-xs font-bold uppercase tracking-[0.15em] transition-colors hover:text-gold-500 relative group",
                      isActive ? "text-gold-500" : "text-inherit"
                    )
                  }
                >
                  {link.name}
                  <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-gold-500 transition-all duration-300 group-hover:w-full" />
                </NavLink>
              ))}
            </nav>

            {/* Logo - Center */}
            <Link to="/" className="flex-shrink-0 mx-auto">
              <div className="flex flex-col items-center">
                {/* We use text here for better control, but in real scenario could be SVG */}
                <h1 className={cn("font-serif text-2xl md:text-3xl font-bold tracking-tight", isScrolled || !isHome ? "text-jade-900" : "text-white")}>
                  JADE
                  <span className="text-gold-500">.</span>
                </h1>
                <span className={cn("text-[0.5rem] uppercase tracking-[0.4em]", isScrolled || !isHome ? "text-jade-800" : "text-white/80")}>Collections</span>
              </div>
            </Link>

            {/* Desktop Navigation - Right (Icons) */}
            <div className="hidden lg:flex items-center justify-end gap-6 flex-1">
              <nav className="flex gap-8 mr-8">
                {navLinks.slice(3).map((link) => (
                  <NavLink
                    key={link.name}
                    to={link.path}
                    className={({ isActive }) =>
                      cn(
                        "text-xs font-bold uppercase tracking-[0.15em] transition-colors hover:text-gold-500",
                        isActive ? "text-gold-500" : "text-inherit"
                      )
                    }
                  >
                    {link.name}
                  </NavLink>
                ))}
              </nav>
              
              <div className="flex items-center gap-5 border-l border-current pl-6">
                <button className="hover:text-gold-500 transition-colors">
                  <Search className="h-4 w-4" />
                </button>
                <Link to="/wishlist" className="hover:text-gold-500 transition-colors">
                  <Heart className="h-4 w-4" />
                </Link>
                <Link to="/cart" className="hover:text-gold-500 transition-colors relative group">
                  <ShoppingBag className="h-4 w-4" />
                  <span className="absolute -top-2 -right-2 bg-gold-500 text-white text-[9px] w-4 h-4 flex items-center justify-center rounded-full">2</span>
                </Link>
              </div>
            </div>
            
            {/* Mobile Cart Icon */}
            <Link to="/cart" className="lg:hidden relative">
              <ShoppingBag className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 bg-gold-500 text-white text-[9px] w-3 h-3 flex items-center justify-center rounded-full">2</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 lg:hidden"
          >
            <div className="fixed inset-0 bg-jade-950/60 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)} />
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-[85%] max-w-xs bg-white shadow-2xl p-8 flex flex-col"
            >
              <div className="flex items-center justify-between mb-12">
                <div>
                    <h2 className="font-serif text-2xl font-bold text-jade-900">JADE.</h2>
                    <p className="text-[0.6rem] uppercase tracking-[0.3em] text-jade-700">Collections</p>
                </div>
                <button onClick={() => setIsMenuOpen(false)} className="p-2 hover:bg-stone-100 rounded-full transition-colors">
                  <X className="h-6 w-6 text-jade-900" />
                </button>
              </div>
              
              <nav className="flex flex-col gap-6 flex-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    className="text-xl font-serif text-jade-950 hover:text-gold-600 transition-colors flex items-center justify-between group"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.name}
                    <span className="w-0 h-px bg-gold-500 transition-all duration-300 group-hover:w-8" />
                  </Link>
                ))}
              </nav>

              <div className="pt-8 border-t border-stone-100">
                <Link to="/login" className="flex items-center gap-3 text-jade-800 font-medium mb-4">
                    <User className="w-5 h-5" /> Sign In / Register
                </Link>
                <div className="flex gap-4 text-jade-400 mt-6">
                    {/* Social icons placeholder */}
                    <div className="w-8 h-8 rounded-full bg-jade-50 flex items-center justify-center">IG</div>
                    <div className="w-8 h-8 rounded-full bg-jade-50 flex items-center justify-center">FB</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
