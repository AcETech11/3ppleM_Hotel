"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Instagram, Twitter, Linkedin, ArrowRight } from "lucide-react";

const Footer = () => {
  return (
    <footer className="relative bg-[#080808] pt-32 pb-10 overflow-hidden border-t border-white/5">
      
      {/* 1. The Ghost Logo (10/10 Branding Trick) */}
      <div className="absolute bottom-[-10%] left-1/2 -translate-x-1/2 w-[120%] pointer-events-none select-none opacity-[0.03]">
        <h1 className="text-[30vw] font-black tracking-tighter text-white text-center leading-none">
          3PPLEM
        </h1>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-24">
          
          {/* Column 1: Brand Info */}
          <div className="md:col-span-1">
            <div className="relative w-32 h-12 mb-6">
              <Image src="/3ppleM_Logo.png" alt="3PPLEM Logo" fill className="object-contain" />
            </div>
            <p className="text-stone text-xs leading-relaxed tracking-wide">
              A sanctuary above the standard. Nestled in the heart of Osapa London, 
              defining the new era of Lekki hospitality.
            </p>
          </div>

          {/* Column 2: Navigation */}
          <div className="flex flex-col gap-4">
            <span className="text-[10px] uppercase tracking-[0.4em] text-gold font-bold mb-2">Explore</span>
            <Link href="/rooms" className="text-xs text-foreground/70 hover:text-gold transition-colors">The Suites</Link>
            <Link href="https://3pplemhotel-menu.vercel.app" className="text-xs text-foreground/70 hover:text-gold transition-colors">Dining</Link>
            <Link href="/gallery" className="text-xs text-foreground/70 hover:text-gold transition-colors">Gallery</Link>
            <Link href="/journal" className="text-xs text-foreground/70 hover:text-gold transition-colors">Journal</Link>
          </div>

          {/* Column 3: Contact & Location */}
          <div className="flex flex-col gap-4">
            <span className="text-[10px] uppercase tracking-[0.4em] text-gold font-bold mb-2">Location</span>
            <p className="text-xs text-foreground/70 leading-loose">
              23/24 Muritala Eletu Way, <br />
              Osapa London, Lekki, <br />
              Lagos, Nigeria.
            </p>
            <div className="flex gap-4 mt-4">
              <Link href="#" className="text-stone hover:text-white transition-colors"><Instagram size={18} /></Link>
              <Link href="#" className="text-stone hover:text-white transition-colors"><Twitter size={18} /></Link>
              <Link href="#" className="text-stone hover:text-white transition-colors"><Linkedin size={18} /></Link>
            </div>
          </div>

          {/* Column 4: Newsletter */}
          <div className="flex flex-col gap-4">
            <span className="text-[10px] uppercase tracking-[0.4em] text-gold font-bold mb-2">Newsletter</span>
            <p className="text-[10px] text-stone uppercase tracking-widest mb-2">Join the inner circle</p>
            <div className="relative group">
              <input 
                type="email" 
                placeholder="EMAIL ADDRESS" 
                className="w-full bg-transparent border-b border-white/20 pb-4 text-[10px] tracking-widest focus:outline-none focus:border-gold transition-colors"
              />
              <button className="absolute right-0 bottom-4 text-gold group-hover:translate-x-2 transition-transform">
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[8px] tracking-[0.4em] text-stone uppercase">
            © 2026 3PPLEM CONTINENTAL HOTEL. ALL RIGHTS RESERVED.
          </p>
          <div className="flex gap-8">
            <Link href="/privacy-policy" className="text-[8px] tracking-[0.4em] text-stone uppercase hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-[8px] tracking-[0.4em] text-stone uppercase hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;