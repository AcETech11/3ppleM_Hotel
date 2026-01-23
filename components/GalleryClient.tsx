"use client";
import React, { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import Tilt from "react-parallax-tilt";
import { ArrowUpRight, ImageIcon } from "lucide-react";
import { urlFor } from "@/lib/sanity/image";

export default function GalleryClient({ initialItems }: { initialItems: any[] }) {
  
  // 1. Process items to ensure unique categories
  const featuredItems = useMemo(() => {
    const seenCategories = new Set();
    
    return (initialItems || [])
      .filter((item) => {
        // Ensure image exists
        if (!item?.image?.asset) return false;
        
        // Handle Category as a Reference or a String
        // If it's a reference from Sanity, we usually want the ID or the expanded title
        const categoryId = item.category?._ref || item.category?._id || "general";
        
        if (!seenCategories.has(categoryId)) {
          seenCategories.add(categoryId);
          return true;
        }
        return false;
      })
      .slice(0, 6); 
  }, [initialItems]);

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

  // If no items, show a small placeholder or null to prevent crash
  if (!featuredItems || featuredItems.length === 0) {
    return (
        <section className="py-20 bg-[#0D0D0D] text-center">
            <p className="text-stone-500 text-[10px] uppercase tracking-widest font-bold">
                Gallery Assets Syncing...
            </p>
        </section>
    );
  }

  return (
    <section id="gallery" className="py-32 bg-[#0D0D0D]">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div className="animate-in fade-in slide-in-from-left duration-700">
            <span className="text-[10px] uppercase tracking-[0.4em] text-[#C5A059] font-bold block mb-2">Visual Stories</span>
            <h2 className="font-serif text-5xl md:text-7xl text-white italic">The Gallery.</h2>
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
          {featuredItems.map((item, i) => {
            // Use the urlFor helper to handle Sanity image objects properly
            const displayUrl = item.image ? urlFor(item.image).width(1200).url() : null;
            const displayAlt = item.image?.alt || item.title || "Gallery Image";
            const displayCaption = item.title || item.image?.caption || "View Details";

            return (
              <div key={item._id || i} className={`${getGridClass(i)} overflow-hidden group relative animate-in fade-in zoom-in-95 duration-1000 delay-${i * 100}`}>
                <Tilt 
                  tiltMaxAngleX={3} 
                  tiltMaxAngleY={3} 
                  className="w-full h-full"
                  tiltEnable={typeof window !== 'undefined' && window.innerWidth > 768}
                >
                  <div className="relative w-full h-full overflow-hidden rounded-sm border border-white/5 bg-stone-900/50">
                    {displayUrl ? (
                      <Image 
                        src={displayUrl} 
                        alt={displayAlt} 
                        fill 
                        className="object-cover transition-all duration-1000 ease-in-out grayscale-0 md:grayscale md:group-hover:grayscale-0 md:group-hover:scale-105" 
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        priority={i < 2}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-stone-900">
                        <ImageIcon className="text-stone-800" />
                      </div>
                    )}
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-transparent opacity-80 md:opacity-60 md:group-hover:opacity-40 transition-opacity" />

                    <div className="absolute bottom-6 left-6 z-10 opacity-100 translate-y-0 md:opacity-0 md:translate-y-4 md:group-hover:translate-y-0 md:group-hover:opacity-100 transition-all duration-500">
                      <span className="text-[#C5A059] text-[8px] uppercase tracking-widest font-bold mb-1 block">
                        Featured Selection
                      </span>
                      <p className="text-white font-serif italic text-lg md:text-xl leading-tight">
                        {displayCaption}
                      </p>
                      <div className="h-[1px] w-8 bg-[#C5A059] mt-2" />
                    </div>
                  </div>
                </Tilt>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}