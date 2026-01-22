"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X, MessageCircle } from "lucide-react";
import { motion, AnimatePresence, Variants } from "framer-motion";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";
    } else {
      document.body.style.overflow = "unset";
      document.body.style.touchAction = "auto";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Rooms", href: "/rooms" },
    { name: "Dining", href: "https://3pplemhotel-menu.vercel.app" },
    { name: "Gallery", href: "/gallery" },
    { name: "Journal", href: "/journal" },
  ];

  const menuVariants: Variants = {
    open: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "circOut" }
    },
    closed: {
      x: "100%",
      opacity: 0,
      transition: { duration: 0.4, ease: "circIn" }
    }
  };

  const linkVariants: Variants = {
    closed: { opacity: 0, y: 20 },
    open: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: 0.1 * i, duration: 0.5, ease: "easeOut" }
    })
  };

  return (
    <>
      <nav 
        className={`fixed top-0 w-full z-[999] transition-all duration-500 ${
          scrolled 
            ? "h-16 bg-black/95 backdrop-blur-xl border-b border-white/10" 
            : "h-24 bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          
          <Link href="/" className="relative w-32 h-10 z-[1000]" aria-label="3PPLEM Home">
            <Image 
              src="/3ppleM_Logo.png" 
              alt="3PPLEM Logo" 
              fill 
              sizes="128px"
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
                className="text-[10px] uppercase tracking-[0.3em] font-bold text-white/80 hover:text-[#C5A059] transition-colors"
              >
                {link.name}
              </Link>
            ))}
            <Link 
              href="/reserve" 
              className="bg-[#C5A059] text-black px-6 py-3 text-[10px] font-black tracking-widest hover:bg-white transition-all duration-300"
            >
              RESERVATION
            </Link>
          </div>

          {/* Mobile Toggle Button */}
          <button 
            type="button"
            className="md:hidden relative z-[1001] text-white p-4 -mr-4" 
            onClick={(e) => {
              e.preventDefault();
              setIsOpen(!isOpen);
            }}
            aria-label="Toggle Menu"
          >
            {isOpen ? <X size={32} strokeWidth={1.5} /> : <Menu size={32} strokeWidth={1.5} />}
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isOpen && (
            <motion.div 
              key="mobile-menu"
              variants={menuVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="fixed inset-0 h-screen w-screen bg-[#0D0D0D] z-[998] flex flex-col justify-center px-10 md:hidden overflow-hidden"
            >
              {/* Background Decorative Text */}
              <div className="absolute top-24 left-6 opacity-[0.03] text-8xl font-serif rotate-90 origin-left text-white select-none pointer-events-none">
                3PPLEM
              </div>

              <div className="flex flex-col gap-8 relative z-[1002]">
                {navLinks.map((link, i) => (
                  <motion.div key={link.name} custom={i} variants={linkVariants}>
                    <Link 
                      href={link.href} 
                      onClick={() => setIsOpen(false)}
                      className="text-5xl font-serif text-white hover:text-[#C5A059] italic block"
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

              {/* Bottom Contact Info (The missing write-up) */}
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                transition={{ delay: 0.6 }}
                className="absolute bottom-12 left-10 right-10 text-[9px] tracking-[0.2em] text-stone-500 leading-relaxed uppercase"
              >
                Osapa London, Lekki, Lagos <br /> 
                info@3pplemcontinentalhotel.ng
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
};

export default Navbar;


