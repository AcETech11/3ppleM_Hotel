"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { client } from "@/lib/sanity/client";
import { urlFor } from "@/lib/sanity/image";
import { PortableText } from "@portabletext/react";
import { motion } from "framer-motion";
import { Wifi, BedDouble, Maximize2, PlayCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function RoomDetails() {
  const { slug } = useParams();
  const [room, setRoom] = useState<any>(null);

  useEffect(() => {
    const fetchRoom = async () => {
      const query = `*[_type == "room" && slug.current == $slug][0] {
        title,
        price,
        tags,
        gallery,
        details,
        "videoUrl": videoTour.asset->url
      }`;
      const data = await client.fetch(query, { slug });
      setRoom(data);
    };
    fetchRoom();
  }, [slug]);

  const portableTextComponents = {
  block: {
    normal: ({children}: any) => <p className="text-stone-400 leading-relaxed mb-4">{children}</p>,
  },
  list: {
    bullet: ({children}: any) => <ul className="list-disc list-inside text-[#C5A059] space-y-2 mb-4">{children}</ul>,
  },
  marks: {
    strong: ({children}: any) => <strong className="font-bold text-white">{children}</strong>,
  },
};

  if (!room) return <div className="h-screen bg-[#0D0D0D] flex items-center justify-center text-[#C5A059] animate-pulse">Refining your sanctuary...</div>;

  return (
    <>
    <Navbar />
    <main className="bg-[#0D0D0D] min-h-screen pb-20">
      {/* 1. HERO HEADER */}
      <section className="relative h-[70vh] w-full overflow-hidden">
        <Image 
          src={urlFor(room.gallery[0]).width(1920).url()} 
          alt={room.title} 
          fill 
          className="object-cover opacity-60"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-transparent to-transparent" />
        
        <div className="absolute inset-0 flex flex-col justify-end px-6 md:px-20 pb-16">
          <Link href="/rooms" className="flex items-center gap-2 text-[#C5A059] text-[10px] uppercase tracking-[0.3em] mb-8 hover:gap-4 transition-all">
            <ArrowLeft size={14} /> Back to Collection
          </Link>
          <h1 className="text-5xl md:text-8xl font-serif text-white uppercase tracking-tighter mb-4">
            {room.title}
          </h1>
          <div className="flex gap-8 text-[#C5A059] text-xs font-bold tracking-widest uppercase border-l border-[#C5A059] pl-6">
            <span>₦{room.price.toLocaleString()} / Night</span>
            <span className="text-stone-500">{room.tags?.join(" • ")}</span>
          </div>
        </div>
      </section>

      {/* 2. DESCRIPTION & VIDEO TOUR */}
      <section className="max-w-7xl mx-auto px-6 py-24 grid grid-cols-1 lg:grid-cols-12 gap-20">
        <div className="lg:col-span-7">
          <span className="text-[10px] text-[#C5A059] uppercase tracking-[0.5em] mb-6 block">
            The Suite Experience
          </span>
          
          <div className="prose prose-invert prose-stone max-w-none prose-p:text-stone-400 prose-p:tracking-wide prose-p:leading-relaxed font-sans text-lg">
            <PortableText 
                value={room.details} 
                components={portableTextComponents}/>
          </div>

          {/* Policy Notice Section */}
          <div className="mt-12 p-6 border border-white/5 bg-white/[0.02] rounded-sm">
            <p className="font-sans text-xs md:text-sm tracking-widest leading-loose text-stone-400 uppercase">
              Please note: our rooms are strictly{" "}
              <span className="text-red-500 font-bold border-b border-red-500/30">
                Non-Smoking
              </span>. 
              For your comfort, a refined smoking lounge is available at the ROOFTOP.
            </p>
          </div>
        </div>

        <div className="lg:col-span-5 flex flex-col gap-10">
          {/* Amenities Box */}
          <div className="bg-stone-900/30 border border-white/5 p-8 rounded-sm">
             <h4 className="text-white font-serif text-xl mb-6 italic">In-Room Comforts</h4>
             <div className="grid grid-cols-2 gap-6">
                {room.tags?.map((tag: string) => (
                  <div key={tag} className="flex items-center gap-3 text-stone-400 text-[10px] uppercase tracking-widest">
                    <div className="w-1.5 h-1.5 bg-[#C5A059] rounded-full" /> {tag}
                  </div>
                ))}
             </div>
          </div>

          {/* Video Tour Preview */}
          {room.videoUrl && (
            <div className="relative group overflow-hidden rounded-sm border border-white/10">
              <video 
                src={room.videoUrl} 
                className="w-full aspect-video object-cover opacity-50 group-hover:opacity-100 transition-opacity" 
                muted loop autoPlay playsInline
              />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <PlayCircle className="text-white/50 group-hover:scale-110 transition-transform" size={48} strokeWidth={1}/>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 3. FULL GALLERY GRID */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <h3 className="text-[#C5A059] text-[10px] uppercase tracking-[0.5em] mb-12 text-center">Visual Perspective</h3>
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {room.gallery.map((img: any, i: number) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative overflow-hidden group border border-white/5"
            >
              <Image 
                src={urlFor(img).width(1000).url()} 
                alt={img.alt || room.title} 
                width={1000} 
                height={800} 
                className="w-full h-auto transition-all duration-700"
              />
            </motion.div>
          ))}
        </div>
      </section>

      {/* 4. BOOKING CTA */}
      <section className="py-40 text-center border-t border-white/5 relative overflow-hidden">
        {/* Decorative background text */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/[0.02] text-[15vw] font-serif italic pointer-events-none whitespace-nowrap">
          {room.title}
        </div>

        <div className="relative z-10">
          <span className="text-[10px] text-[#C5A059] uppercase tracking-[0.5em] mb-8 block font-bold">
            Reserve Your Sanctuary
          </span>
          <h2 className="font-serif text-4xl md:text-6xl text-white mb-12 italic">
            Ready to experience <br /> {room.title}?
          </h2>
          
          <Link 
            href='/reserve'
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-6 px-12 py-6 border border-[#C5A059] text-[#C5A059] text-xs font-bold uppercase tracking-[0.4em] hover:bg-[#C5A059] hover:text-black transition-all duration-500"
          >
            Check Availability
            <div className="w-8 h-[1px] bg-[#C5A059] group-hover:bg-black transition-colors" />
          </Link>
          
          <p className="mt-8 text-stone-500 text-[9px] uppercase tracking-[0.2em]">
            Average Response Time: <span className="text-white">Under 5 Minutes</span>
          </p>
        </div>
      </section>
    </main>
    </>
  );
}