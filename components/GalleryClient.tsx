"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import Tilt from "react-parallax-tilt";
import { ArrowUpRight } from "lucide-react";

export default function GalleryClient({ initialItems }: { initialItems: any[] }) {
  const getGridClass = (i: number) => {
    const classes = [
      "md:col-span-8 h-[400px]", 
      "md:col-span-4 h-[400px]", 
      "md:col-span-4 h-[500px]", 
      "md:col-span-8 h-[500px]", 
      "md:col-span-6 h-[400px]", 
      "md:col-span-6 h-[400px]", 
    ];
    return classes[i % classes.length];
  };

  return (
    <section id="gallery" className="py-32 bg-[#0D0D0D]">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div>
            <span className="text-[10px] uppercase tracking-[0.4em] text-[#C5A059] font-bold">Visual Stories</span>
            <h2 className="font-serif text-5xl md:text-7xl text-white mt-4 italic">The Gallery.</h2>
          </div>
          
          <Link 
            href="/gallery" 
            className="group flex items-center gap-3 text-[#C5A059] text-xs uppercase tracking-[0.2em] font-bold border-b border-[#C5A059]/20 pb-2 hover:border-[#C5A059] transition-all"
          >
            Explore Full Archive 
            <ArrowUpRight size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {initialItems.map((img, i) => (
            <div key={i} className={`${getGridClass(i)} overflow-hidden group relative`}>
              <Tilt 
                tiltMaxAngleX={3} 
                tiltMaxAngleY={3} 
                className="w-full h-full"
                tiltEnable={typeof window !== 'undefined' && window.innerWidth > 768}
              >
                <div className="relative w-full h-full overflow-hidden rounded-sm border border-white/5">
                  <Image 
                    src={img.url} 
                    alt={img.alt || "3PPLEM Gallery"} 
                    fill 
                    className="object-cover transition-all duration-1000 ease-in-out grayscale-0 md:grayscale md:group-hover:grayscale-0 md:group-hover:scale-105" 
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 md:opacity-60 md:group-hover:opacity-40 transition-opacity" />

                  <div className="absolute bottom-6 left-6 z-10 opacity-100 translate-y-0 md:opacity-0 md:translate-y-4 md:group-hover:translate-y-0 md:group-hover:opacity-100 transition-all duration-500">
                    <p className="text-white font-serif italic text-lg md:text-xl leading-tight">
                      {img.caption || "Sanctuary Details"}
                    </p>
                    <div className="h-[1px] w-8 bg-[#C5A059] mt-2" />
                  </div>
                </div>
              </Tilt>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}