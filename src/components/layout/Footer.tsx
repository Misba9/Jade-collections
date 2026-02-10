import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, MapPin, Phone, Mail, ArrowRight } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-jade-950 text-white pt-20 pb-10 border-t border-gold-900/30">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Info */}
          <div className="space-y-6">
            <Link to="/" className="block">
                <h3 className="font-serif text-3xl font-bold text-white">JADE<span className="text-gold-500">.</span></h3>
                <span className="text-[0.6rem] uppercase tracking-[0.4em] text-jade-300">Collections</span>
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
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-lg font-medium mb-6 text-gold-200">Explore</h4>
            <ul className="space-y-4 text-sm text-jade-100/80">
              <li><Link to="/shop" className="hover:text-gold-400 transition-colors flex items-center gap-2 group"><span className="w-0 group-hover:w-2 h-px bg-gold-400 transition-all"></span> Shop All</Link></li>
              <li><Link to="/collections" className="hover:text-gold-400 transition-colors flex items-center gap-2 group"><span className="w-0 group-hover:w-2 h-px bg-gold-400 transition-all"></span> Collections</Link></li>
              <li><Link to="/about" className="hover:text-gold-400 transition-colors flex items-center gap-2 group"><span className="w-0 group-hover:w-2 h-px bg-gold-400 transition-all"></span> Our Story</Link></li>
              <li><Link to="/blog" className="hover:text-gold-400 transition-colors flex items-center gap-2 group"><span className="w-0 group-hover:w-2 h-px bg-gold-400 transition-all"></span> Journal</Link></li>
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h4 className="font-serif text-lg font-medium mb-6 text-gold-200">Customer Care</h4>
            <ul className="space-y-4 text-sm text-jade-100/80">
              <li><Link to="/shipping" className="hover:text-gold-400 transition-colors">Shipping Policy</Link></li>
              <li><Link to="/returns" className="hover:text-gold-400 transition-colors">Returns & Refunds</Link></li>
              <li><Link to="/privacy" className="hover:text-gold-400 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-gold-400 transition-colors">Terms of Service</Link></li>
              <li><Link to="/contact" className="hover:text-gold-400 transition-colors">Contact Support</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-serif text-lg font-medium mb-6 text-gold-200">Visit Us</h4>
            <ul className="space-y-6 text-sm text-jade-100/80">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gold-500 shrink-0 mt-1" />
                <span className="leading-relaxed">Road No. 10, Banjara Hills,<br/>Hyderabad, Telangana 500034</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-gold-500 shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gold-500 shrink-0" />
                <span>support@jadecollections.in</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-jade-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-jade-400 font-light">© 2026 Jade Collections. All rights reserved.</p>
          <div className="flex gap-2 opacity-60">
            {/* Payment Icons Placeholders */}
            <div className="h-6 w-10 bg-white/10 rounded-sm"></div>
            <div className="h-6 w-10 bg-white/10 rounded-sm"></div>
            <div className="h-6 w-10 bg-white/10 rounded-sm"></div>
          </div>
        </div>
      </div>
    </footer>
  );
};
