import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { container, item } from '../lib/animations';

export const Contact = () => {
  return (
    <motion.div 
      className="pt-24 pb-16 bg-stone-50 min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
            <h1 className="font-serif text-4xl md:text-5xl text-jade-900 mb-4">Contact Us</h1>
            <p className="text-gray-600">We'd love to hear from you. Visit our boutique or send us a message.</p>
        </motion.div>

        <motion.div 
          className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto"
          initial="hidden"
          animate="show"
          variants={container}
        >
            {/* Contact Info */}
            <motion.div className="space-y-8" variants={item}>
                <div className="bg-white p-8 shadow-sm border border-stone-100 space-y-6">
                    <h3 className="font-serif text-2xl text-jade-900">Boutique Information</h3>
                    
                    <div className="space-y-4">
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 bg-jade-50 rounded-full flex items-center justify-center text-jade-900 shrink-0">
                                <MapPin className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900">Address</h4>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    Jade Collections Flagship Store,<br/>
                                    Road No. 10, Banjara Hills,<br/>
                                    Hyderabad, Telangana 500034
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 bg-jade-50 rounded-full flex items-center justify-center text-jade-900 shrink-0">
                                <Phone className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900">Phone</h4>
                                <p className="text-gray-600 text-sm">+91 9----5 43210</p>
                                <p className="text-gray-600 text-sm">+91 40 ---4 5678</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 bg-jade-50 rounded-full flex items-center justify-center text-jade-900 shrink-0">
                                <Mail className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900">Email</h4>
                                <p className="text-gray-600 text-sm">support@jadecollections.in</p>
                                <p className="text-gray-600 text-sm">sales@jadecollections.in</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 bg-jade-50 rounded-full flex items-center justify-center text-jade-900 shrink-0">
                                <Clock className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900">Opening Hours</h4>
                                <p className="text-gray-600 text-sm">Mon - Sat: 10:30 AM - 8:30 PM</p>
                                <p className="text-gray-600 text-sm">Sun: 11:00 AM - 7:00 PM</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Map Placeholder */}
                <div className="bg-gray-200 h-64 w-full rounded-sm overflow-hidden relative">
                    <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1000&auto=format&fit=crop" alt="Map" className="w-full h-full object-cover opacity-50 grayscale" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="bg-white px-4 py-2 text-sm font-bold shadow-md">View on Google Maps</span>
                    </div>
                </div>
            </motion.div>

            {/* Form */}
            <motion.div className="bg-white p-8 lg:p-12 shadow-lg border-t-4 border-jade-900" variants={item}>
                <h3 className="font-serif text-2xl text-jade-900 mb-6">Send us a Message</h3>
                <form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-gray-500">First Name</label>
                            <input type="text" className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-jade-900 transition-colors bg-transparent" placeholder="Jane" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Last Name</label>
                            <input type="text" className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-jade-900 transition-colors bg-transparent" placeholder="Doe" />
                        </div>
                    </div>
                    
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Email Address</label>
                        <input type="email" className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-jade-900 transition-colors bg-transparent" placeholder="jane@example.com" />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Subject</label>
                        <select className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-jade-900 transition-colors bg-transparent">
                            <option>General Inquiry</option>
                            <option>Order Status</option>
                            <option>Returns & Exchanges</option>
                            <option>Custom Orders</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Message</label>
                        <textarea rows={4} className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-jade-900 transition-colors bg-transparent resize-none" placeholder="How can we help you?"></textarea>
                    </div>

                    <div className="pt-4">
                        <Button className="w-full" size="lg">Send Message</Button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};
