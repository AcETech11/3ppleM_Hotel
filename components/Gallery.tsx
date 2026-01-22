"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Tilt from "react-parallax-tilt";
import { ArrowUpRight } from "lucide-react";
import { client } from "@/lib/sanity/client";
import { urlFor } from "@/lib/sanity/image";

export default function Gallery() {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    const fetchGallery = async () => {
      // This query gets images from all gallery documents and flattens them
      const query = `*[_type == "gallery"] | order(_createdAt desc) {
        "photos": images[]{
          "url": asset->url,
          caption,
          alt,
          "metadata": asset->metadata
        }
      }[0...2]`; // Fetch last 2 gallery sets to fill the grid

      try {
        const data = await client.fetch(query);
        // Flatten the array of arrays into one list of 6-8 images for the home page
        const flattenedPhotos = data.flatMap((g: any) => g.photos).slice(0, 6);
        setItems(flattenedPhotos);
      } catch (error) {
        console.error("Gallery fetch error:", error);
      }
    };
    fetchGallery();
  }, []);

  // Define Bento Grid spans based on index
  const getGridClass = (i: number) => {
    const classes = [
      "md:col-span-8 h-[400px]", // Large
      "md:col-span-4 h-[400px]", // Small
      "md:col-span-4 h-[500px]", // Tall
      "md:col-span-8 h-[500px]", // Wide
      "md:col-span-6 h-[400px]", // Medium
      "md:col-span-6 h-[400px]", // Medium
    ];
    return classes[i % classes.length];
  };

  return (
    <section id="gallery" className="py-32 bg-[#0D0D0D]">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header with "View All" button */}
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

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {items.map((img, i) => (
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
                    className="object-cover transition-all duration-1000 ease-in-out 
                      grayscale-0 md:grayscale md:group-hover:grayscale-0 md:group-hover:scale-105" 
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  
                  {/* Subtle Dark Gradient Overlay - slightly stronger on mobile for text legibility */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent 
                    opacity-80 md:opacity-60 md:group-hover:opacity-40 transition-opacity" />

                  {/* BOTTOM LEFT CAPTION 
                      - Always visible and in position on mobile (opacity-100 translate-y-0)
                      - Hidden and slides up on desktop (md:opacity-0 md:translate-y-4)
                  */}
                  <div className="absolute bottom-6 left-6 z-10 
                    opacity-100 translate-y-0 
                    md:opacity-0 md:translate-y-4 md:group-hover:translate-y-0 md:group-hover:opacity-100 
                    transition-all duration-500">
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