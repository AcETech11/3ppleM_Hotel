"use client";
import React, { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

const Experience = () => {
  const sectionRef = useRef(null);
  const imageRef = useRef(null);

  useGSAP(() => {
    // Parallax effect on the image
    gsap.fromTo(imageRef.current, 
      { y: 50 }, 
      { 
        y: -50, 
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true
        } 
      }
    );

    // Text fade-in
    gsap.from(".exp-text", {
      opacity: 0,
      x: 30,
      stagger: 0.2,
      duration: 1,
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 70%",
      }
    });
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="relative py-24 md:py-40 px-6 overflow-hidden bg-background">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        
        {/* Left Side: The Image with a "Floating" Frame */}
        <div className="relative h-[500px] md:h-[700px] w-full overflow-hidden group">
          <div ref={imageRef} className="relative h-full w-full">
            <Image 
              src="/01_Home.jpg" 
              alt="3PPLEM Interior"
              fill
              className="object-cover scale-110"
            />
          </div>
          {/* Decorative Corner (Top Right) */}
          <div className="absolute top-4 right-4 w-20 h-20 border-t border-r border-gold/30 pointer-events-none" />
        </div>

        {/* Right Side: Editorial Text */}
        <div className="flex flex-col gap-6">
          <span className="exp-text text-[10px] uppercase tracking-[0.4em] text-gold font-bold">
            The 3PPLEM Experience
          </span>
          
          <h2 className="exp-text font-serif text-5xl md:text-7xl leading-tight text-foreground">
            A Sanctuary <br /> 
            <span className="italic">Above the Standard.</span>
          </h2>

          <p className="exp-text text-stone text-sm md:text-base leading-relaxed max-w-md mt-4">
            Nestled in the vibrant heart of Lekki, 3PPLEM Continental redefines urban sophistication. 
            Discover a world where bespoke service meets architectural brilliance, crafted for those 
            who demand more than just a stay.
          </p>

          <div className="exp-text mt-8">
            <Link href="/about" className="inline-block">
              <button className="group flex items-center gap-4 text-[10px] font-bold tracking-[0.3em] uppercase text-foreground cursor-pointer">
                <span className="w-12 h-[1px] bg-[#C5A059] group-hover:w-20 transition-all duration-500" />
                Learn More
              </button>
            </Link>
          </div>
        </div>

      </div>

      {/* Background Decorative "01" */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/4 opacity-[0.02] text-[40rem] font-serif pointer-events-none">
        01
      </div>
    </section>
  );
};

export default Experience;