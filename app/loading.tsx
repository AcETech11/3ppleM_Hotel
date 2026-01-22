"use client";
import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function Loading() {
  const [progress, setProgress] = useState(0);
  const containerRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    // 1. Counter Logic
    const timer = setInterval(() => {
      setProgress((prev) => (prev < 100 ? prev + 1 : 100));
    }, 20);

    // 2. Entrance & Exit Animation
    const tl = gsap.timeline();
    tl.to(textRef.current, { 
      opacity: 1, 
      y: 0, 
      duration: 1, 
      ease: "power4.out" 
    })
    .to(containerRef.current, {
      yPercent: -100,
      duration: 1.2,
      ease: "expo.inOut",
      delay: 2.2 // Sync with the 100% counter
    });

    return () => clearInterval(timer);
  }, []);
  

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-[200] bg-[#0D0D0D] flex flex-col items-center justify-center"
    >
      <div className="relative overflow-hidden h-20 w-full flex items-center justify-center">
        <h2 
          ref={textRef}
          className="font-serif text-gold text-4xl md:text-6xl italic opacity-0 translate-y-10"
        >
          3PPLEM Continental
        </h2>
      </div>
      
      {/* Percentage Counter */}
      <div className="absolute bottom-10 right-10">
        <span className="font-sans text-[10vw] font-black text-white/5 leading-none">
          {progress}%
        </span>
      </div>

      <div className="mt-4 w-48 h-[1px] bg-white/10 relative">
        <div 
          className="absolute top-0 left-0 h-full bg-gold transition-all duration-100" 
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}