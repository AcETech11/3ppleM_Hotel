"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";

export default function Loading() {
  const [progress, setProgress] = useState(0);
  const containerRef = useRef(null);
  const contentRef = useRef(null);
  const logoRef = useRef(null);

  useEffect(() => {
    // 1. Counter Logic (slightly slower for a premium feel)
    const timer = setInterval(() => {
      setProgress((prev) => (prev < 100 ? prev + 1 : 100));
    }, 25);

    // 2. Entrance & Exit Animation
    const tl = gsap.timeline();
    
    // Initial Reveal
    tl.to([logoRef.current, contentRef.current], { 
      opacity: 1, 
      y: 0, 
      duration: 1.2, 
      stagger: 0.2,
      ease: "power4.out" 
    })
    // Sophisticated Exit
    .to(containerRef.current, {
      yPercent: -100,
      duration: 1.5,
      ease: "expo.inOut",
      delay: 2.5 // Allows the user to see the 100% mark briefly
    });

    return () => clearInterval(timer);
  }, []);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-[200] bg-[#050505] flex flex-col items-center justify-center"
    >
      {/* Central Branding */}
      <div className="flex flex-col items-center gap-6">
        <div ref={logoRef} className="opacity-0 translate-y-10">
          <Image 
            src="/3ppleM_Logo.png" 
            alt="3PPLEM Logo" 
            width={120} 
            height={120} 
            className="object-contain"
            priority
          />
        </div>
        
        <div className="relative overflow-hidden flex flex-col items-center text-center">
          <h2 
            ref={contentRef}
            className="font-serif text-[#C5A059] text-3xl md:text-5xl italic opacity-0 translate-y-10 tracking-tight"
          >
            3PPLEM Continental <br />
            <span className="text-xs md:text-sm font-sans uppercase tracking-[0.6em] text-white/40 not-italic block mt-2">
              Hotel & Suites
            </span>
          </h2>
        </div>
      </div>
      
      {/* Background Percentage Counter */}
      <div className="absolute bottom-10 right-10 pointer-events-none">
        <span className="font-sans text-[12vw] font-black text-white/[0.03] leading-none select-none">
          {progress}%
        </span>
      </div>

      {/* Elegant Progress Line */}
      <div className="mt-12 w-32 md:w-48 h-[1px] bg-white/5 relative">
        <div 
          className="absolute top-0 left-0 h-full bg-[#C5A059] transition-all duration-150 ease-out" 
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}