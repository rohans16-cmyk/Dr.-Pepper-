/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { 
  MapPin, 
  ChevronRight, 
  ShoppingBag, 
  Menu, 
  X, 
  Instagram, 
  Twitter, 
  Facebook, 
  ArrowRight,
  Droplets,
  Zap,
  Star,
  Clock
} from 'lucide-react';
import Insights from './Insights';
import FlavorQuiz from './FlavorQuiz';

// --- Types & Constants ---

interface Product {
  id: string;
  name: string;
  description: string;
  color: string;
  accent: string;
  image: string;
  tags: string[];
}

const PRODUCTS: Product[] = [
  {
    id: 'original',
    name: 'Dr Pepper Original',
    description: 'The one and only. A unique blend of 23 flavors that has been a favorite since 1885.',
    color: '#711F25',
    accent: '#F5F2ED',
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80&w=400',
    tags: ['Classic', '23 Flavors']
  },
  {
    id: 'cherry',
    name: 'Dr Pepper Cherry',
    description: 'A smooth addition of cherry flavor to the classic Dr Pepper blend.',
    color: '#9E1B32',
    accent: '#F5F2ED',
    image: 'https://images.unsplash.com/photo-1543253687-c931c8e01820?auto=format&fit=crop&q=80&w=400',
    tags: ['Smooth', 'Fruity']
  },
  {
    id: 'cream-soda',
    name: 'Dr Pepper & Cream Soda',
    description: 'The perfect pairing of Dr Pepper and smooth, rich cream soda.',
    color: '#D4AF37',
    accent: '#711F25',
    image: 'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?auto=format&fit=crop&q=80&w=400',
    tags: ['Rich', 'Creamy']
  },
  {
    id: 'zero-sugar',
    name: 'Dr Pepper Zero Sugar',
    description: 'All 23 flavors, zero sugar. The bold taste you love with none of the calories.',
    color: '#1A1A1A',
    accent: '#711F25',
    image: 'https://images.unsplash.com/photo-1581006852262-e4307cf6283a?auto=format&fit=crop&q=80&w=400',
    tags: ['Zero Sugar', 'Bold']
  }
];

// --- Components ---

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-[#711F25] py-3 shadow-xl' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <div className="flex items-center gap-8">
          <a href="#" className="text-2xl font-black tracking-tighter text-white uppercase italic">
            Dr <span className="text-[#F5F2ED]">Pepper</span>
          </a>
          <div className="hidden md:flex gap-6 text-sm font-bold uppercase tracking-widest text-[#F5F2ED]/80">
            <a href="#products" className="hover:text-white transition-colors">Products</a>
            <a href="#insights" className="hover:text-white transition-colors">Insights</a>
            <a href="#quiz" className="hover:text-white transition-colors">Quiz</a>
            <a href="#story" className="hover:text-white transition-colors">The 23 Story</a>
            <a href="#limited" className="hover:text-white transition-colors">Limited Drops</a>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="hidden md:flex items-center gap-2 bg-[#F5F2ED] text-[#711F25] px-5 py-2 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-white transition-all transform hover:scale-105">
            <MapPin size={14} />
            Find Near Me
          </button>
          <button onClick={() => setIsOpen(!isOpen)} className="text-white md:hidden">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full bg-[#711F25] border-t border-white/10 p-6 flex flex-col gap-4 md:hidden"
          >
            <a href="#products" className="text-xl font-bold text-white uppercase italic" onClick={() => setIsOpen(false)}>Products</a>
            <a href="#insights" className="text-xl font-bold text-white uppercase italic" onClick={() => setIsOpen(false)}>Insights</a>
            <a href="#quiz" className="text-xl font-bold text-white uppercase italic" onClick={() => setIsOpen(false)}>Quiz</a>
            <a href="#story" className="text-xl font-bold text-white uppercase italic" onClick={() => setIsOpen(false)}>The 23 Story</a>
            <a href="#limited" className="text-xl font-bold text-white uppercase italic" onClick={() => setIsOpen(false)}>Limited Drops</a>
            <button className="flex items-center justify-center gap-2 bg-[#F5F2ED] text-[#711F25] py-4 rounded-xl font-bold uppercase tracking-widest">
              <MapPin size={18} />
              Find Near Me
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = () => {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden bg-[#711F25]">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-[radial-gradient(circle_at_center,_#9E1B32_0%,_transparent_70%)] opacity-50 blur-3xl" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h1 className="text-6xl md:text-8xl font-black text-white leading-[0.9] italic uppercase mb-6">
            The One <br />
            <span className="text-[#F5F2ED]">You Crave.</span>
          </h1>
          <p className="text-xl text-[#F5F2ED]/80 max-w-md mb-8 font-medium">
            23 flavors. One unique taste. Since 1885, we've been crafting the boldest blend in the game.
          </p>
          <div className="flex flex-wrap gap-4">
            <button className="bg-[#F5F2ED] text-[#711F25] px-8 py-4 rounded-full font-black uppercase tracking-widest hover:bg-white transition-all transform hover:scale-105 flex items-center gap-2">
              Explore Flavors
              <ChevronRight size={20} />
            </button>
            <button className="border-2 border-[#F5F2ED] text-[#F5F2ED] px-8 py-4 rounded-full font-black uppercase tracking-widest hover:bg-[#F5F2ED] hover:text-[#711F25] transition-all flex items-center gap-2">
              <MapPin size={20} />
              Find A Store
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
          className="relative flex justify-center"
        >
          <div className="absolute inset-0 bg-white/10 blur-3xl rounded-full scale-75 animate-pulse" />
          <img 
            src="https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80&w=600" 
            alt="Dr Pepper Can" 
            className="relative z-10 w-full max-w-sm drop-shadow-[0_35px_35px_rgba(0,0,0,0.5)] transform hover:rotate-6 transition-transform duration-500 cursor-pointer"
            referrerPolicy="no-referrer"
          />
          
          {/* Floating Fizz Elements */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              animate={{ 
                y: [-20, -100], 
                x: [0, (i % 2 === 0 ? 20 : -20)],
                opacity: [0, 1, 0] 
              }}
              transition={{ 
                duration: 2 + Math.random() * 2, 
                repeat: Infinity, 
                delay: Math.random() * 2 
              }}
              className="absolute w-3 h-3 bg-white/40 rounded-full blur-sm"
              style={{ 
                left: `${20 + Math.random() * 60}%`, 
                bottom: '20%' 
              }}
            />
          ))}
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[#F5F2ED]/50"
      >
        <span className="text-[10px] uppercase tracking-[0.3em] font-bold">Scroll to Taste</span>
        <div className="w-px h-12 bg-gradient-to-b from-[#F5F2ED]/50 to-transparent" />
      </motion.div>
    </section>
  );
};

const ProductShowcase = () => {
  const [activeProduct, setActiveProduct] = useState(PRODUCTS[0]);

  return (
    <section id="products" className="py-24 bg-[#F5F2ED]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div>
            <span className="text-[#711F25] font-black uppercase tracking-[0.4em] text-xs mb-4 block">The Lineup</span>
            <h2 className="text-5xl md:text-7xl font-black text-[#711F25] italic uppercase leading-none">
              Choose Your <br />
              <span className="text-black/20">Vibe.</span>
            </h2>
          </div>
          <p className="text-[#711F25]/60 max-w-sm font-medium">
            From the original classic to smooth cream soda, there's a Dr Pepper for every craving.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-4">
            {PRODUCTS.map((product) => (
              <button
                key={product.id}
                onClick={() => setActiveProduct(product)}
                className={`w-full text-left p-6 rounded-2xl transition-all flex items-center justify-between group ${activeProduct.id === product.id ? 'bg-[#711F25] text-white shadow-2xl scale-[1.02]' : 'bg-white text-[#711F25] hover:bg-white/80'}`}
              >
                <div>
                  <h3 className="text-2xl font-black italic uppercase">{product.name}</h3>
                  <div className="flex gap-2 mt-2">
                    {product.tags.map(tag => (
                      <span key={tag} className={`text-[10px] uppercase tracking-widest font-bold px-2 py-1 rounded-md ${activeProduct.id === product.id ? 'bg-white/20' : 'bg-[#711F25]/10'}`}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <ChevronRight className={`transition-transform ${activeProduct.id === product.id ? 'rotate-90' : 'group-hover:translate-x-1'}`} />
              </button>
            ))}
          </div>

          <div className="lg:col-span-7 relative bg-white rounded-[3rem] p-12 min-h-[500px] flex items-center justify-center overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeProduct.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="grid md:grid-cols-2 gap-12 items-center w-full"
              >
                <div className="relative">
                  <div className="absolute inset-0 blur-3xl opacity-20" style={{ backgroundColor: activeProduct.color }} />
                  <img 
                    src={activeProduct.image} 
                    alt={activeProduct.name} 
                    className="relative z-10 w-full rounded-3xl shadow-2xl transform hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div>
                  <h4 className="text-4xl font-black text-[#711F25] italic uppercase mb-4 leading-tight">
                    {activeProduct.name}
                  </h4>
                  <p className="text-[#711F25]/70 mb-8 font-medium leading-relaxed">
                    {activeProduct.description}
                  </p>
                  <div className="flex flex-col gap-4">
                    <button className="bg-[#711F25] text-white py-4 rounded-xl font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-black transition-colors">
                      <ShoppingBag size={20} />
                      Buy Now
                    </button>
                    <button className="border-2 border-[#711F25]/10 text-[#711F25] py-4 rounded-xl font-black uppercase tracking-widest hover:bg-[#711F25]/5 transition-colors">
                      View Nutrition
                    </button>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

const FlavorStory = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const scale = useTransform(scrollYProgress, [0, 0.5], [0.8, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);

  return (
    <section id="story" ref={containerRef} className="py-24 bg-[#711F25] text-white overflow-hidden">
      <motion.div style={{ scale, opacity }} className="max-w-7xl mx-auto px-6 text-center">
        <span className="text-[#F5F2ED] font-black uppercase tracking-[0.4em] text-xs mb-6 block">The Secret Sauce</span>
        <h2 className="text-6xl md:text-9xl font-black italic uppercase leading-[0.8] mb-12">
          23 Flavors. <br />
          <span className="text-[#F5F2ED]/30">Zero Regrets.</span>
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8 mt-24">
          <div className="p-8 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-sm">
            <Droplets className="text-[#F5F2ED] mb-6" size={40} />
            <h3 className="text-2xl font-black italic uppercase mb-4">Unique Blend</h3>
            <p className="text-white/60 font-medium">A proprietary mix that defies categorization. Not a cola, not a root beer—it's Dr Pepper.</p>
          </div>
          <div className="p-8 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-sm">
            <Zap className="text-[#F5F2ED] mb-6" size={40} />
            <h3 className="text-2xl font-black italic uppercase mb-4">Bold Kick</h3>
            <p className="text-white/60 font-medium">Every sip delivers a complex explosion of taste that keeps you coming back for more.</p>
          </div>
          <div className="p-8 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-sm">
            <Clock className="text-[#F5F2ED] mb-6" size={40} />
            <h3 className="text-2xl font-black italic uppercase mb-4">Since 1885</h3>
            <p className="text-white/60 font-medium">The oldest major soft drink in America, born in Waco, Texas and loved worldwide.</p>
          </div>
        </div>

        <div className="mt-24 relative">
          <div className="absolute inset-0 bg-gradient-to-t from-[#711F25] to-transparent z-10 h-32 bottom-0" />
          <div className="flex gap-4 overflow-hidden opacity-20 select-none">
            {[...Array(23)].map((_, i) => (
              <span key={i} className="text-8xl font-black italic uppercase whitespace-nowrap">Flavor {i + 1}</span>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
};

const LimitedDrops = () => {
  return (
    <section id="limited" className="py-24 bg-black text-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="bg-gradient-to-br from-[#711F25] to-[#4A1418] rounded-[3rem] p-12 md:p-24 relative overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 blur-[100px] rounded-full -mr-48 -mt-48" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/40 blur-[80px] rounded-full -ml-32 -mb-32" />

          <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full mb-8">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest">Limited Edition Drop</span>
              </div>
              <h2 className="text-5xl md:text-7xl font-black italic uppercase leading-none mb-8">
                Dr Pepper <br />
                <span className="text-[#F5F2ED]">Dark Berry.</span>
              </h2>
              <p className="text-white/70 text-lg mb-12 max-w-md font-medium">
                The cult favorite is back for a limited time. A deep, mysterious blend of black cherry, black currant, and blackberry.
              </p>
              
              <div className="flex items-center gap-8 mb-12">
                <div className="text-center">
                  <span className="text-4xl font-black italic">08</span>
                  <span className="block text-[10px] uppercase tracking-widest opacity-50">Days</span>
                </div>
                <div className="text-4xl font-black opacity-20">:</div>
                <div className="text-center">
                  <span className="text-4xl font-black italic">14</span>
                  <span className="block text-[10px] uppercase tracking-widest opacity-50">Hours</span>
                </div>
                <div className="text-4xl font-black opacity-20">:</div>
                <div className="text-center">
                  <span className="text-4xl font-black italic">52</span>
                  <span className="block text-[10px] uppercase tracking-widest opacity-50">Mins</span>
                </div>
              </div>

              <button className="bg-[#F5F2ED] text-[#711F25] px-10 py-5 rounded-full font-black uppercase tracking-widest hover:bg-white transition-all transform hover:scale-105 shadow-2xl">
                Get Notified
              </button>
            </div>

            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&q=80&w=600" 
                alt="Limited Edition" 
                className="w-full rounded-3xl shadow-[0_50px_100px_rgba(0,0,0,0.5)] transform rotate-3 hover:rotate-0 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute -bottom-6 -right-6 bg-white text-[#711F25] p-8 rounded-3xl shadow-2xl transform -rotate-6">
                <Star className="mb-2" fill="currentColor" />
                <span className="text-2xl font-black italic uppercase block">Rare</span>
                <span className="text-[10px] uppercase tracking-widest font-bold opacity-50">Collector's Item</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const StoreLocator = () => {
  return (
    <section className="py-24 bg-[#F5F2ED]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1">
            <div className="bg-white p-4 rounded-[2rem] shadow-2xl">
              <div className="bg-gray-100 rounded-2xl h-[400px] flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20" />
                <div className="relative z-10 text-center p-8">
                  <MapPin size={48} className="text-[#711F25] mx-auto mb-4" />
                  <h3 className="text-2xl font-black italic uppercase text-[#711F25] mb-2">Interactive Map</h3>
                  <p className="text-[#711F25]/60 text-sm font-bold uppercase tracking-widest">Enable location to find stores</p>
                </div>
              </div>
            </div>
          </div>
          <div className="order-1 md:order-2">
            <span className="text-[#711F25] font-black uppercase tracking-[0.4em] text-xs mb-4 block">Availability</span>
            <h2 className="text-5xl md:text-7xl font-black text-[#711F25] italic uppercase leading-none mb-8">
              Find Your <br />
              <span className="text-black/20">Fix.</span>
            </h2>
            <p className="text-[#711F25]/60 text-lg mb-12 font-medium">
              Craving that unique 23-flavor blend? Use our store locator to find Dr Pepper retailers, restaurants, and vending machines near you.
            </p>
            
            <div className="flex flex-col gap-4">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Enter Zip Code or City" 
                  className="w-full bg-white border-2 border-[#711F25]/10 rounded-2xl px-6 py-5 font-bold text-[#711F25] focus:outline-none focus:border-[#711F25] transition-colors"
                />
                <button className="absolute right-3 top-1/2 -translate-y-1/2 bg-[#711F25] text-white p-3 rounded-xl hover:bg-black transition-colors">
                  <ArrowRight size={20} />
                </button>
              </div>
              <button className="flex items-center justify-center gap-2 text-[#711F25] font-black uppercase tracking-widest text-sm hover:underline">
                <MapPin size={16} />
                Use My Current Location
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="bg-[#711F25] text-[#F5F2ED] py-24 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-24">
          <div className="col-span-2">
            <a href="#" className="text-4xl font-black tracking-tighter text-white uppercase italic mb-8 block">
              Dr <span className="text-[#F5F2ED]">Pepper</span>
            </a>
            <p className="text-[#F5F2ED]/60 max-w-sm mb-8 font-medium">
              The oldest major soft drink in America. A unique blend of 23 flavors that's been a favorite since 1885.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-white hover:text-[#711F25] transition-all">
                <Instagram size={20} />
              </a>
              <a href="#" className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-white hover:text-[#711F25] transition-all">
                <Twitter size={20} />
              </a>
              <a href="#" className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-white hover:text-[#711F25] transition-all">
                <Facebook size={20} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-black uppercase tracking-[0.3em] mb-8 text-white">Explore</h4>
            <ul className="space-y-4 font-bold text-sm uppercase tracking-widest">
              <li><a href="#products" className="hover:text-white transition-colors">Products</a></li>
              <li><a href="#insights" className="hover:text-white transition-colors">Insights</a></li>
              <li><a href="#quiz" className="hover:text-white transition-colors">Quiz</a></li>
              <li><a href="#story" className="hover:text-white transition-colors">The 23 Story</a></li>
              <li><a href="#limited" className="hover:text-white transition-colors">Limited Drops</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-black uppercase tracking-[0.3em] mb-8 text-white">Stay Bold</h4>
            <p className="text-xs mb-6 opacity-60 font-bold uppercase tracking-widest">Get the latest flavor drops and news.</p>
            <div className="flex gap-2">
              <input 
                type="email" 
                placeholder="Email" 
                className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-white w-full"
              />
              <button className="bg-[#F5F2ED] text-[#711F25] px-4 py-2 rounded-lg font-black text-xs uppercase">Join</button>
            </div>
          </div>
        </div>

        <div className="pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-bold uppercase tracking-[0.2em] opacity-40">
          <p>© 2026 Dr Pepper/Seven Up, Inc. All Rights Reserved.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:opacity-100">Privacy Policy</a>
            <a href="#" className="hover:opacity-100">Terms of Use</a>
            <a href="#" className="hover:opacity-100">Accessibility</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

// --- Main App ---

export default function App() {
  return (
    <div className="min-h-screen font-sans selection:bg-[#711F25] selection:text-white">
      <Navbar />
      <main>
        <Hero />
        <ProductShowcase />
        <Insights />
        <FlavorQuiz />
        <FlavorStory />
        <LimitedDrops />
        <StoreLocator />
      </main>
      <Footer />

      {/* Sticky CTA for Mobile */}
      <div className="fixed bottom-6 left-6 right-6 z-40 md:hidden">
        <button className="w-full bg-[#711F25] text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-2xl flex items-center justify-center gap-2">
          <MapPin size={20} />
          Find Dr Pepper Near You
        </button>
      </div>
    </div>
  );
}
