import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, MapPin, Phone, Mail } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-jade-950 text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Info */}
          <div>
            <h3 className="font-serif text-2xl font-bold mb-6 text-gold-400">Jade Collections</h3>
            <p className="text-gray-300 text-sm leading-relaxed mb-6">
              Discover the essence of royal elegance with our premium collection of ethnic wear. Crafted for the modern woman who cherishes tradition.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-jade-900 flex items-center justify-center hover:bg-gold-500 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-jade-900 flex items-center justify-center hover:bg-gold-500 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-jade-900 flex items-center justify-center hover:bg-gold-500 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-lg font-semibold mb-6 text-gold-200">Quick Links</h4>
            <ul className="space-y-3 text-sm text-gray-300">
              <li><Link to="/shop" className="hover:text-gold-400 transition-colors">Shop All</Link></li>
              <li><Link to="/about" className="hover:text-gold-400 transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-gold-400 transition-colors">Contact Us</Link></li>
              <li><Link to="/blog" className="hover:text-gold-400 transition-colors">Fashion Blog</Link></li>
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h4 className="font-serif text-lg font-semibold mb-6 text-gold-200">Customer Care</h4>
            <ul className="space-y-3 text-sm text-gray-300">
              <li><Link to="/shipping" className="hover:text-gold-400 transition-colors">Shipping Policy</Link></li>
              <li><Link to="/returns" className="hover:text-gold-400 transition-colors">Returns & Refunds</Link></li>
              <li><Link to="/privacy" className="hover:text-gold-400 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-gold-400 transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-serif text-lg font-semibold mb-6 text-gold-200">Contact Us</h4>
            <ul className="space-y-4 text-sm text-gray-300">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gold-500 shrink-0" />
                <span>Road No. 10, Banjara Hills,<br/>Hyderabad, Telangana 500034</span>
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
          <p className="text-xs text-gray-400">© 2026 Jade Collections. All rights reserved.</p>
          <div className="flex gap-4">
            {/* Payment Icons Placeholders */}
            <div className="h-6 w-10 bg-white/10 rounded"></div>
            <div className="h-6 w-10 bg-white/10 rounded"></div>
            <div className="h-6 w-10 bg-white/10 rounded"></div>
            <div className="h-6 w-10 bg-white/10 rounded"></div>
          </div>
        </div>
      </div>
    </footer>
  );
};
