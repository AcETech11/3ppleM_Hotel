"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X, MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // 1. Lock Body Scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  // Handle Sticky Scroll Effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Rooms", href: "/rooms" },
    { name: "Dining", href: "https://3pplemhotel-menu.vercel.app" },
    { name: "Gallery", href: "/gallery" },
    { name: "Journal", href: "/journal" },
  ];

  const menuVariants = {
    closed: { opacity: 0, x: "100%" },
    open: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } 
    }
  };

  const linkVariants = {
    closed: { opacity: 0, y: 20 },
    open: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: 0.1 * i, duration: 0.5 }
    })
  };

  return (
    <nav 
      className={`fixed top-0 w-full z-[100] transition-all duration-500 ${
        scrolled 
          ? "h-16 bg-black/90 backdrop-blur-xl border-b border-white/10" 
          : "h-24 bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="relative w-32 h-10 transition-transform hover:scale-105 z-[110]">
          <Image 
            src="/3ppleM_Logo.png" 
            alt="3PPLEM Logo" 
            fill 
            className="object-contain"
            priority
          />
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href} 
              className="group relative text-[10px] uppercase tracking-[0.3em] font-bold text-white/80 hover:text-[#C5A059] transition-colors"
            >
              {link.name}
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#C5A059] transition-all group-hover:w-full" />
            </Link>
          ))}
          <Link 
            href="/reserve" 
            className="bg-[#C5A059] text-black px-6 py-3 text-[10px] font-black tracking-widest flex items-center gap-2 hover:bg-white transition-all duration-300"
          >
            RESERVATION
          </Link>
        </div>

        {/* Mobile Toggle - Key Fix: Higher Z-Index */}
        <button 
          className="md:hidden z-[120] text-white p-2" 
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Menu"
        >
          {isOpen ? <X size={32} strokeWidth={1} /> : <Menu size={32} strokeWidth={1} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            variants={menuVariants}
            initial="closed"
            animate="open"
            exit="closed"
            // Key Fix: h-screen and fixed inset-0 ensures it fills the viewport exactly
            className="fixed inset-0 h-screen w-screen bg-[#0D0D0D] z-[105] flex flex-col justify-center px-10 md:hidden overflow-hidden"
          >
            {/* Background Decorative Text */}
            <div className="absolute top-20 left-10 opacity-5 text-7xl font-serif rotate-90 origin-left pointer-events-none text-white">
              3PPLEM
            </div>

            <div className="flex flex-col gap-8 relative z-20">
              {navLinks.map((link, i) => (
                <motion.div key={link.name} custom={i} variants={linkVariants}>
                  <Link 
                    href={link.href} 
                    onClick={() => setIsOpen(false)}
                    className="text-5xl font-serif text-white hover:text-[#C5A059] transition-colors block italic"
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
              
              <motion.div variants={linkVariants} custom={navLinks.length}>
                <Link 
                  href="/reserve" 
                  onClick={() => setIsOpen(false)}
                  className="mt-8 bg-[#C5A059] text-black w-full py-5 text-center text-sm font-bold tracking-[0.3em] flex items-center justify-center gap-3 active:scale-95 transition-transform"
                >
                  <MessageCircle size={18} /> RESERVATION
                </Link>
              </motion.div>
            </div>

            {/* Bottom Contact Info */}
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              transition={{ delay: 0.6 }}
              className="absolute bottom-10 left-10 right-10 text-[8px] md:text-[10px] tracking-[0.2em] text-stone-500 leading-relaxed uppercase"
            >
              Osapa London, Lekki, Lagos • info@3pplemcontinentalhotel.ng
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;