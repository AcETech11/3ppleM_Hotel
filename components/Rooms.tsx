"use client";
import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Tilt from "react-parallax-tilt";
import Image from "next/image";
import Link from "next/link";
import { Wifi, BedDouble, ChevronRight } from "lucide-react";
import { client } from "@/lib/sanity/client";
import { urlFor } from "@/lib/sanity/image";

export default function Rooms() {
  const [rooms, setRooms] = useState<any[]>([]);
  const targetRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [translateX, setTranslateX] = useState(0);

  useEffect(() => {
    const fetchRooms = async () => {
      const query = `*[_type == "room"] | order(price asc) {
        title,
        price,
        "mainImage": gallery[0], 
        "slug": slug.current,
        tags 
      }`;
      try {
        const data = await client.fetch(query);
        setRooms(data);
      } catch (error) {
        console.error("Sanity fetch error:", error);
      }
    };
    fetchRooms();
  }, []);

  const { scrollYProgress } = useScroll({ target: targetRef });
  const x = useTransform(scrollYProgress, [0, 1], [0, translateX]);

  useEffect(() => {
    const updateScroll = () => {
      if (trackRef.current && rooms.length > 0) {
        const scrollDistance = trackRef.current.scrollWidth - window.innerWidth;
        setTranslateX(-(scrollDistance + 100)); 
      }
    };
    const timeout = setTimeout(updateScroll, 100);
    window.addEventListener("resize", updateScroll);
    return () => {
      window.removeEventListener("resize", updateScroll);
      clearTimeout(timeout);
    };
  }, [rooms]);

  return (
    <section ref={targetRef} className="relative h-[400vh] bg-[#0D0D0D]">
      <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden">
        
        {/* Header Section - Lower Z-Index */}
        <div className="px-6 md:px-20 mb-10 absolute top-20 left-0 z-0">
          <p className="font-sans text-[10px] text-[#C5A059] uppercase tracking-[0.5em] mb-4">Accommodation</p>
          <h2 className="text-6xl md:text-8xl font-serif text-white/5 leading-none select-none">
            Designed for <br/> <span className="italic">Absolute Comfort</span>
          </h2>
        </div>

        {/* The Horizontal Track - Higher Z-Index */}
        {rooms.length > 0 ? (
          <motion.div 
            ref={trackRef}
            style={{ x }} 
            className="flex gap-8 md:gap-12 px-[10vw] z-10 w-max mt-20 md:mt-0"
          >
            {rooms.map((room, i) => (
              <RoomCard 
                key={room.slug || i} 
                room={room} 
                index={i} 
                progress={scrollYProgress} 
                total={rooms.length} 
              />
            ))}
          </motion.div>
        ) : (
          <div className="w-full flex justify-center z-10">
             <p className="text-[#C5A059] font-serif italic text-2xl animate-pulse">Curating your sanctuary...</p>
          </div>
        )}

        {/* Progress bar */}
        <div className="absolute bottom-20 left-20 right-20 h-[1px] bg-white/10 z-20">
            <motion.div style={{ scaleX: scrollYProgress }} className="h-full bg-[#C5A059] origin-left w-full" />
        </div>
      </div>
    </section>
  );
}

function RoomCard({ room, index, progress, total }: any) {
  const stepInterval = 1 / total;
  const start = index * stepInterval;
  const end = (index + 1) * stepInterval;
  const scale = useTransform(progress, [start - 0.1, start, end, end + 0.1], [0.95, 1, 1, 0.95]);

  return (
    <motion.div style={{ scale }} className="flex-shrink-0">
      <Link href={`/rooms/${room.slug}`}>
        <Tilt
          tiltMaxAngleX={5}
          tiltMaxAngleY={5}
          perspective={1000}
          tiltEnable={typeof window !== 'undefined' && window.innerWidth > 768}
          className="w-[85vw] md:w-[450px] h-[55vh] md:h-[550px] bg-stone-950 border border-white/10 relative overflow-hidden group shadow-2xl cursor-pointer"
        >
          {/* Room Image */}
          <div className="absolute inset-0 bg-black">
            {room.mainImage && (
              <Image 
                src={urlFor(room.mainImage).width(800).height(1000).url()} 
                alt={room.title} 
                fill 
                className="object-cover opacity-60 group-hover:opacity-40 group-hover:scale-110 transition-all duration-700" 
              />
            )}
          </div>

          {/* View Details Overlay - Always visible on mobile, hover on desktop */}
          <div className="absolute inset-0 flex items-center justify-center opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-500">
             <div className="flex items-center gap-2 text-white font-sans text-[10px] md:text-xs uppercase tracking-[0.3em] border-b border-[#C5A059] pb-1 backdrop-blur-sm bg-black/10 px-4 py-2 md:p-0 md:bg-transparent">
               Explore Suite <ChevronRight size={14} className="text-[#C5A059]"/>
             </div>
          </div>

          {/* Content */}
          <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end bg-gradient-to-t from-black via-black/40 to-transparent">
            <h3 className="text-2xl md:text-3xl font-serif text-white mb-1 uppercase tracking-tight">{room.title}</h3>
            <p className="text-[#C5A059] text-[10px] md:text-xs font-bold tracking-[0.2em] mb-4 md:mb-6">
              FROM ₦{Number(room.price).toLocaleString()} / NIGHT
            </p>
            
            <div className="flex flex-wrap gap-x-4 gap-y-2 border-t border-white/10 pt-4 md:pt-6">
              {room.tags?.map((tag: string, idx: number) => (
                <div key={idx} className="flex items-center gap-2 text-[9px] md:text-[10px] text-stone-400 uppercase tracking-widest">
                  {tag.toLowerCase().includes('wifi') && <Wifi size={12}/>}
                  {tag.toLowerCase().includes('bed') && <BedDouble size={12}/>}
                  {tag}
                </div>
              ))}
            </div>
          </div>
        </Tilt>
      </Link>
    </motion.div>
  );
}