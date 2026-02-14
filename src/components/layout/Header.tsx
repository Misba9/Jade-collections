import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Search, ShoppingBag, User, Menu, X, Heart, LogOut } from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';

export const Header = () => {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
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
      <motion.header 
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b bg-logo-pattern",
          isScrolled || !isHome 
            ? "py-2 shadow-lg border-gold-900/20 text-white backdrop-blur-[2px]" 
            : "py-6 border-white/10 text-white"
        )}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
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
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="flex-shrink-0 mx-auto"
            >
              <Link to="/" aria-label="Jade Collections - Home">
                <img src="/jade-logo.png" alt="Jade Collections" className="h-10 md:h-12 w-auto object-contain" />
              </Link>
            </motion.div>

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
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-gold-500 text-white text-[9px] min-w-[1rem] h-4 flex items-center justify-center rounded-full px-1">
                      {cartCount}
                    </span>
                  )}
                </Link>
              </div>
            </div>
            
            {/* Mobile Cart Icon */}
            <Link to="/cart" className="lg:hidden relative">
              <ShoppingBag className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gold-500 text-white text-[9px] min-w-[0.75rem] h-3 flex items-center justify-center rounded-full px-0.5">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </motion.header>

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
                <Link to="/" onClick={() => setIsMenuOpen(false)} className="block">
                  <img src="/jade-logo.png" alt="Jade Collections" className="h-9 w-auto object-contain" />
                </Link>
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
                {user ? (
                  <>
                    <Link to="/profile" className="flex items-center gap-3 text-jade-800 font-medium mb-2" onClick={() => setIsMenuOpen(false)}>
                      <User className="w-5 h-5" /> {user.name}
                    </Link>
                    <button onClick={() => { logout(); setIsMenuOpen(false); }} className="flex items-center gap-3 text-stone-600 hover:text-red-600 mb-4">
                      <LogOut className="w-5 h-5" /> Sign Out
                    </button>
                  </>
                ) : (
                  <Link to="/login" className="flex items-center gap-3 text-jade-800 font-medium mb-4" onClick={() => setIsMenuOpen(false)}>
                    <User className="w-5 h-5" /> Sign In / Register
                  </Link>
                )}
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
