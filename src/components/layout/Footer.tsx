import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Facebook, Instagram, Twitter, MapPin, Phone, Mail } from 'lucide-react';
import { container, item } from '../../lib/animations';

export const Footer = () => {
  return (
    <motion.footer 
      className="bg-logo-pattern text-white pt-20 pb-10 border-t border-gold-900/30"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-100px" }}
      variants={container}
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Info */}
          <motion.div className="space-y-6" variants={item}>
            <Link to="/" className="block w-fit" aria-label="Jade Collections - Home">
              <img src="/jade-logo.png" alt="Jade Collections" className="h-20 w-auto object-contain" />
            </Link>
            <p className="text-jade-200 text-sm leading-relaxed max-w-xs font-light">
              Discover the essence of royal elegance with our premium collection of ethnic wear. Crafted for the modern woman who cherishes tradition.
            </p>
            <div className="flex gap-4 pt-2">
              <a href="#" className="w-10 h-10 rounded-full bg-jade-900 flex items-center justify-center hover:bg-gold-500 hover:text-white transition-all duration-300">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-jade-900 flex items-center justify-center hover:bg-gold-500 hover:text-white transition-all duration-300">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-jade-900 flex items-center justify-center hover:bg-gold-500 hover:text-white transition-all duration-300">
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={item}>
            <h4 className="font-serif text-lg font-medium mb-6 text-gold-200">Explore</h4>
            <ul className="space-y-4 text-sm text-jade-100/80">
              <li><Link to="/shop" className="hover:text-gold-400 transition-colors flex items-center gap-2 group"><span className="w-0 group-hover:w-2 h-px bg-gold-400 transition-all"></span> Shop All</Link></li>
              <li><Link to="/collections" className="hover:text-gold-400 transition-colors flex items-center gap-2 group"><span className="w-0 group-hover:w-2 h-px bg-gold-400 transition-all"></span> Collections</Link></li>
              <li><Link to="/about" className="hover:text-gold-400 transition-colors flex items-center gap-2 group"><span className="w-0 group-hover:w-2 h-px bg-gold-400 transition-all"></span> Our Story</Link></li>
              <li><Link to="/blog" className="hover:text-gold-400 transition-colors flex items-center gap-2 group"><span className="w-0 group-hover:w-2 h-px bg-gold-400 transition-all"></span> Journal</Link></li>
            </ul>
          </motion.div>

          {/* Policies */}
          <motion.div variants={item}>
            <h4 className="font-serif text-lg font-medium mb-6 text-gold-200">Customer Care</h4>
            <ul className="space-y-4 text-sm text-jade-100/80">
              <li><Link to="/shipping" className="hover:text-gold-400 transition-colors">Shipping Policy</Link></li>
              <li><Link to="/returns" className="hover:text-gold-400 transition-colors">Returns & Refunds</Link></li>
              <li><Link to="/privacy" className="hover:text-gold-400 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-gold-400 transition-colors">Terms of Service</Link></li>
              <li><Link to="/contact" className="hover:text-gold-400 transition-colors">Contact Support</Link></li>
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div variants={item}>
            <h4 className="font-serif text-lg font-medium mb-6 text-gold-200">Visit Us</h4>
            <ul className="space-y-6 text-sm text-jade-100/80">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gold-500 shrink-0 mt-1" />
                <span className="leading-relaxed">Road No. 10, Banjara Hills,<br/>Hyderabad, Telangana 500034</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-gold-500 shrink-0" />
                <span>+91 987** **210</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gold-500 shrink-0" />
                <span>support@jadecollections.in</span>
              </li>
            </ul>
          </motion.div>
        </div>

        <motion.div 
          className="border-t border-jade-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-4"
          variants={item}
        >
          <p className="text-xs text-jade-400 font-light">© 2026 Jade Collections. All rights reserved.</p>
          <div className="flex gap-2 opacity-60">
            {/* Payment Icons Placeholders */}
            <div className="h-6 w-10 bg-white/10 rounded-sm"></div>
            <div className="h-6 w-10 bg-white/10 rounded-sm"></div>
            <div className="h-6 w-10 bg-white/10 rounded-sm"></div>
          </div>
        </motion.div>
      </div>
    </motion.footer>
  );
};
