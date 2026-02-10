import React from 'react';
import { motion } from 'framer-motion';

export const About = () => {
  return (
    <div className="pt-20 bg-white">
      {/* Hero */}
      <section className="relative h-[60vh] bg-jade-950 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 opacity-40">
            <img src="https://images.unsplash.com/photo-1605218427368-35b016df2e87?q=80&w=2000&auto=format&fit=crop" alt="Fabric texture" className="w-full h-full object-cover" />
        </div>
        <div className="relative z-10 text-center text-white px-4">
            <h1 className="font-serif text-5xl md:text-7xl mb-6">Our Story</h1>
            <p className="text-xl font-light text-jade-100 max-w-2xl mx-auto">Crafting elegance since 2010.</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-24 container mx-auto px-4">
        <div className="max-w-4xl mx-auto space-y-16">
            <div className="text-center space-y-6">
                <h2 className="font-serif text-3xl md:text-4xl text-jade-900">The Jade Philosophy</h2>
                <p className="text-gray-600 leading-loose text-lg">
                    Jade Collections was born out of a desire to bridge the gap between traditional Indian craftsmanship and modern aesthetics. We believe that clothing is not just about covering the body, but about expressing one's identity and heritage. Our name, inspired by the precious gemstone, symbolizes purity, serenity, and timeless beauty—qualities we strive to imbue in every garment we create.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                <img src="https://images.unsplash.com/photo-1575958951208-4e610250bc7b?q=80&w=800&auto=format&fit=crop" alt="Workshop" className="w-full h-full object-cover aspect-square" />
                <div className="flex flex-col justify-center space-y-6 p-8 bg-stone-50">
                    <h3 className="font-serif text-2xl text-jade-900">Artisanal Excellence</h3>
                    <p className="text-gray-600 leading-relaxed">
                        We work directly with master weavers and artisans from across India. From the intricate Zardosi of Lucknow to the vibrant prints of Jaipur, our collections are a celebration of India's diverse textile heritage. Every stitch is placed with precision, ensuring that the final product is nothing short of a masterpiece.
                    </p>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 md:flex-row-reverse">
                <div className="flex flex-col justify-center space-y-6 p-8 bg-stone-50 order-2 md:order-1">
                    <h3 className="font-serif text-2xl text-jade-900">Sustainable Luxury</h3>
                    <p className="text-gray-600 leading-relaxed">
                        We are committed to sustainable fashion. We use natural fabrics, eco-friendly dyes, and ensure fair wages for our artisans. We believe that true luxury lies in conscious creation and consumption. When you buy from Jade Collections, you are investing in a piece that is kind to the planet and its people.
                    </p>
                </div>
                <img src="https://images.unsplash.com/photo-1604176354204-9268737828e4?q=80&w=800&auto=format&fit=crop" alt="Sustainability" className="w-full h-full object-cover aspect-square order-1 md:order-2" />
            </div>
        </div>
      </section>
    </div>
  );
};
