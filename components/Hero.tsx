"use client";
import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ChevronDown, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

const Hero = () => {
  const container = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline();

    // 1. Initial Video Zoom & Fade-In from Poster
    tl.fromTo(videoRef.current, 
      { scale: 1.1, opacity: 0 }, 
      { scale: 1, opacity: 1, duration: 2, ease: "power3.out" }
    );

    // 2. Text Reveal Animation
    tl.from(".reveal-text", {
      y: 80,
      opacity: 0,
      stagger: 0.2,
      duration: 1.2,
      ease: "power4.out",
    }, "-=1.2");

    // 3. Address & Button Fade In
    tl.from(".hero-sub", {
      opacity: 0,
      y: 20,
      duration: 1,
      stagger: 0.1
    }, "-=0.8");
  }, { scope: container });

  return (
    <section 
      ref={container} 
      className="relative w-full h-[100vh] flex items-center justify-center overflow-hidden bg-[#080808]"
    >
      {/* 1. Loading Background (Skeleton Shimmer) */}
      <div className="absolute inset-0 z-0 bg-neutral-900 animate-pulse" />

      {/* 2. Background Video with Poster */}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        poster="/hero-poster.webp" 
        preload="metadata"
        className="absolute inset-0 w-full h-full object-cover z-1 opacity-60"
        style={{ filter: "brightness(0.7)" }}
      >
        <source src="https://3pplemcontinentalhotel.vercel.app/hero-video.mp4" type="video/mp4" />
      </video>

      {/* 3. Gradient Overlays for Readability */}
      <div className="absolute inset-0 z-2 bg-gradient-to-b from-black/60 via-transparent to-black" />
      <div className="absolute inset-0 z-2 bg-[radial-gradient(circle,transparent_20%,rgba(0,0,0,0.4)_100%)]" />

      {/* 4. Overlay Content */}
      <div className="relative z-10 text-center px-6 max-w-5xl">
        <div className="overflow-hidden mb-2">
          {/* Accessibility: Use <address> for location and <span> for non-heading labels */}
          <address className="hero-sub not-italic text-[#C5A059] uppercase tracking-[0.5em] text-[10px] md:text-xs font-bold mb-4 flex items-center justify-center gap-2">
            <MapPin size={14} className="animate-bounce" aria-hidden="true" /> 
            23/24 Muritala Eletu way, Osapa London
          </address>
        </div>

        {/* Accessibility: Semantic H1 for SEO and Screen Readers */}
        <h1 ref={titleRef} className="font-serif text-[clamp(2.5rem,8vw,6.5rem)] leading-[1.05] text-white">
          <span className="block overflow-hidden">
            <span className="reveal-text block">Where Lekki’s Pulse</span>
          </span>
          <span className="block overflow-hidden italic">
            <span className="reveal-text block text-[#C5A059]">Meets Timeless Luxury.</span>
          </span>
        </h1>

        <div className="hero-sub mt-10 flex flex-col md:flex-row items-center justify-center gap-6">
          <Link href="/rooms" aria-label="View our available suites">
            <button className="px-12 py-5 bg-[#C5A059] text-black font-black text-[10px] tracking-[0.4em] uppercase hover:bg-white transition-all duration-700 shadow-2xl w-full md:w-auto">
              Explore Suites
            </button>
          </Link>

          <Link href="/journal" aria-label="Read our story and journal">
            <button className="px-12 py-5 border border-white/20 backdrop-blur-xl text-white font-black text-[10px] tracking-[0.4em] uppercase hover:bg-white hover:text-black transition-all duration-700 w-full md:w-auto">
              Our Story
            </button>
          </Link>
        </div>
      </div>

      {/* 5. Scroll Indicator */}
      <motion.div 
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 text-white/40"
      >
        <div className="flex flex-col items-center gap-3">
          <span className="text-[8px] uppercase tracking-[0.5em] font-medium">Scroll to Discover</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-[#C5A059] to-transparent" aria-hidden="true" />
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;