"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { client } from "@/lib/sanity/client";
import { urlFor } from "@/lib/sanity/image";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";


export default function RoomsPage() {
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRooms = async () => {
      const query = `*[_type == "room"] | order(price asc) {
        title,
        "slug": slug.current,
        price,
        tags,
        "thumbnail": gallery[0]
      }`;
      try {
        const data = await client.fetch(query);
        setRooms(data);
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);

  return (
    <>
    <Navbar />
    
    <main className="min-h-screen bg-[#0D0D0D] pt-40 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <header className="mb-20">
          <span className="text-[10px] uppercase tracking-[0.5em] text-[#C5A059] font-bold block mb-4">
            Accommodation
          </span>
          <h1 className="font-serif text-6xl md:text-8xl text-white italic">
            Private <span className="text-[#C5A059] not-italic">Sanctuaries.</span>
          </h1>
          <p className="text-stone-500 mt-6 max-w-lg text-sm tracking-widest leading-relaxed">
            EACH SUITE AT 3PPLEM IS A MASTERPIECE OF ARCHITECTURAL PRECISION AND CURATED COMFORT.
          </p>
        </header>

        {/* Rooms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-24">
          {rooms.map((room, i) => (
            <motion.div 
              key={room.slug}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Link href={`/rooms/${room.slug}`} className="group block">
                {/* Image Container */}
                <div className="relative aspect-[16/10] overflow-hidden mb-8 bg-stone-900">
                  <Image 
                    src={room.thumbnail ? urlFor(room.thumbnail).width(1200).url() : "/fallback-room.jpg"}
                    alt={room.title}
                    fill
                    className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000 ease-out"
                  />
                  
                  {/* Price Tag Overlay */}
                  <div className="absolute bottom-0 right-0 bg-black/80 backdrop-blur-md px-6 py-3 border-tl border-white/10">
                    <span className="text-white font-serif italic text-lg">
                      ₦{room.price.toLocaleString()}
                    </span>
                    <span className="text-[9px] text-stone-400 uppercase tracking-tighter ml-2">/ Night</span>
                  </div>
                </div>

                {/* Info */}
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h3 className="font-serif text-3xl text-white group-hover:text-[#C5A059] transition-colors">
                      {room.title}
                    </h3>
                    
                    {/* Dynamic Tags */}
                    <div className="flex flex-wrap gap-x-4 mt-3">
                      {room.tags?.map((tag: string) => (
                        <span key={tag} className="text-[10px] uppercase tracking-[0.2em] text-stone-500">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="h-[1px] flex-grow bg-white/5 mt-5 hidden md:block" />

                  <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#C5A059] mt-4 whitespace-nowrap">
                    View Details +
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
    </>
  );
}