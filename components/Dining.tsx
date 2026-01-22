"use client";
import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Dining = () => {
  const container = useRef(null);

  useGSAP(() => {
    // 1. Image Scroll Animation (Keep this as scrub)
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container.current,
        start: "top 80%",
        end: "bottom 20%",
        scrub: 1,
      }
    });

    tl.from(".dining-img-left", { xPercent: -15, opacity: 0.5, duration: 1 }, 0);
    tl.from(".dining-img-right", { xPercent: 15, opacity: 0.1, duration: 1 }, 0);

    // 2. Text Entrance Animation (Crucial for LCP)
    // We animate FROM these values, meaning the text is ALREADY in the DOM/Visible
    gsap.from(".lcp-text", {
      y: 40,
      opacity: 0,
      duration: 1.2,
      stagger: 0.1,
      ease: "power4.out",
      scrollTrigger: {
        trigger: container.current,
        start: "top 90%", // Starts earlier to avoid LCP delay
      }
    });
  }, { scope: container });

  return (
    <section ref={container} className="relative py-32 bg-[#0D0D0D] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
        
        {/* Left Visual: The "Kitchen" Side */}
        <div className="md:col-span-5 relative h-[400px] md:h-[600px] dining-img-left">
          <Image 
            src="/dining-1.png" 
            alt="Fine Dining at 3PPLEM"
            fill
            priority // SEO FIX: Higher loading priority
            sizes="(max-width: 768px) 100vw, 40vw"
            className="object-cover rounded-tl-[100px]"
          />
        </div>

        {/* Center Content */}
        <div className="md:col-span-7 z-10">
          <div className="flex flex-col gap-6 md:pl-12">
            {/* Added 'lcp-text' class for controlled entrance without hiding from Google */}
            <span className="lcp-text text-[10px] uppercase tracking-[0.4em] text-[#C5A059] font-bold block">
              Culinary Artistry
            </span>
            
            <h2 className="lcp-text font-serif text-5xl md:text-8xl text-white leading-[0.9]">
              Savor the <br /> 
              <span className="italic text-[#C5A059]">Exceptional.</span>
            </h2>

            <p className="lcp-text text-stone-400 text-sm md:text-lg max-w-lg mt-4 leading-relaxed">
              From dawn to dusk, our kitchen serves as a canvas for local flavors and global 
              sophistication. Experience the best of Osapa London&apos;s dining scene without leaving the lobby.
            </p>

            <div className="lcp-text flex flex-wrap gap-4 mt-8">
              <Link 
                href="https://3pplemhotel-menu.vercel.app" 
                target="_blank"
                className="px-8 py-4 border border-[#C5A059] text-[#C5A059] text-[10px] font-bold tracking-[0.3em] uppercase hover:bg-[#C5A059] hover:text-black transition-all"
              >
                View Digital Menu
              </Link>
              <Link href="/reserve">
                <button className="px-8 py-4 bg-white text-black text-[10px] font-bold tracking-[0.3em] uppercase hover:bg-[#C5A059] transition-all">
                  Reservation
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Floating Right Image: The "Ambiance" Side */}
        <div className="hidden md:block absolute right-[-5%] top-1/2 -translate-y-1/2 w-[30%] h-[400px] dining-img-right opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
          <Image 
            src="/dining-2.jpg" 
            alt="3PPLEM Restaurant Interior"
            fill
            className="object-cover rounded-br-[100px]"
          />
        </div>

      </div>
    </section>
  );
};

export default Dining;