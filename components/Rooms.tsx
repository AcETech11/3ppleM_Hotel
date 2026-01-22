"use client";
import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
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
        title, price, "mainImage": gallery[0], "slug": slug.current
      }`;
      try {
        const data = await client.fetch(query);
        setRooms(data);
      } catch (error) { console.error(error); }
    };
    fetchRooms();
  }, []);

  const { scrollYProgress } = useScroll({ target: targetRef });
  const xRaw = useTransform(scrollYProgress, [0.1, 1], [0, translateX]);
  const x = useSpring(xRaw, { stiffness: 40, damping: 15 });

  const titleY = useTransform(scrollYProgress, [0, 1], ["0%", "-15%"]);
  // Increased opacity for readability
  const titleOpacity = useTransform(scrollYProgress, [0, 0.2, 0.5], [1, 0.8, 0]);

  useEffect(() => {
    const updateScroll = () => {
      if (trackRef.current && rooms.length > 0) {
        const scrollDistance = trackRef.current.scrollWidth - window.innerWidth;
        setTranslateX(-(scrollDistance + window.innerWidth * 0.05)); 
      }
    };
    updateScroll();
    window.addEventListener("resize", updateScroll);
    return () => window.removeEventListener("resize", updateScroll);
  }, [rooms]);

  return (
    <section ref={targetRef} className="relative h-[400vh] bg-[#050505]">
      <div className="sticky top-0 h-screen flex flex-col justify-start md:justify-center overflow-hidden">
        
        {/* Background Title Section */}
        <motion.div 
          style={{ y: titleY, opacity: titleOpacity }}
          className="absolute top-[10vh] md:top-[12vh] left-0 w-full px-6 md:px-20 z-0 pointer-events-none"
        >
          <p className="font-sans text-[10px] text-[#C5A059] uppercase tracking-[0.5em] mb-4 drop-shadow-md">
            The Collection
          </p>
          <h2 className="text-6xl md:text-[11rem] font-serif text-white/[0.07] leading-[0.9] uppercase italic font-black tracking-tighter shadow-black">
            Absolute <br/> Comfort
          </h2>
        </motion.div>

        {/* The Horizontal Track */}
        <div className="relative z-10 mt-[32vh] md:mt-0">
          {rooms.length > 0 ? (
            <motion.div 
              ref={trackRef}
              style={{ x }} 
              className="flex gap-5 md:gap-16 px-[6vw] w-max items-center"
            >
              {rooms.map((room, i) => (
                <RoomCard key={room.slug || i} room={room} index={i} />
              ))}
            </motion.div>
          ) : (
            <div className="w-full flex justify-center py-20">
               <div className="h-1 w-16 bg-[#C5A059] animate-pulse" />
            </div>
          )}
        </div>

        {/* Minimalist Progress Indicator */}
        <div className="absolute bottom-10 left-6 md:left-20 flex items-center gap-4 z-20">
            <span className="text-[#C5A059] font-sans text-[10px] font-bold">01</span>
            <div className="w-24 md:w-64 h-[2px] bg-white/5 relative">
                <motion.div style={{ scaleX: scrollYProgress }} className="absolute inset-0 bg-[#C5A059] origin-left" />
            </div>
            <span className="text-white/20 font-sans text-[10px]">0{rooms.length}</span>
        </div>
      </div>
    </section>
  );
}

function RoomCard({ room, index }: any) {
  return (
    <motion.div className="flex-shrink-0 group">
      <Link href={`/rooms/${room.slug}`}>
        <Tilt
          tiltMaxAngleX={2}
          tiltMaxAngleY={2}
          perspective={1000}
          tiltEnable={typeof window !== 'undefined' && window.innerWidth > 768}
          className="w-[85vw] md:w-[500px] h-[55vh] md:h-[620px] bg-neutral-900 border border-white/10 relative overflow-hidden shadow-2xl"
        >
          {/* Room Image with Darker Overlay */}
          <div className="absolute inset-0">
            {room.mainImage && (
              <Image 
                src={urlFor(room.mainImage).width(1000).height(1200).url()} 
                alt={room.title} 
                fill 
                className="object-cover opacity-90 group-hover:scale-105 transition-transform duration-[2s] ease-out" 
              />
            )}
            {/* Hardened gradient for text legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90" />
          </div>

          {/* Top Info */}
          <div className="absolute top-6 left-8 flex items-center gap-3">
             <span className="text-white/30 font-serif italic text-4xl">0{index + 1}</span>
          </div>

          {/* Content Box */}
          <div className="absolute bottom-0 left-0 w-full p-8 md:p-10">
            <div className="mb-4">
              <p className="text-[#C5A059] text-[11px] font-black tracking-[0.3em] uppercase mb-1">
                ₦{Number(room.price).toLocaleString()} / Night
              </p>
              <h3 className="text-3xl md:text-4xl font-serif text-white uppercase leading-tight tracking-wide">
                {room.title}
              </h3>
            </div>
            
            <div className="flex items-center justify-between pt-5 border-t border-white/20">
              <div className="flex gap-5">
                <div className="flex items-center gap-2 text-[9px] text-white/70 uppercase tracking-widest font-bold">
                  <Wifi size={14} className="text-[#C5A059]" /> Wi-Fi
                </div>
                <div className="flex items-center gap-2 text-[9px] text-white/70 uppercase tracking-widest font-bold">
                  <BedDouble size={14} className="text-[#C5A059]" /> King Bed
                </div>
              </div>
              
              <div className="w-12 h-12 rounded-full border border-[#C5A059]/50 flex items-center justify-center text-white bg-black/40 group-hover:bg-[#C5A059] transition-all duration-500">
                <ChevronRight size={24} />
              </div>
            </div>
          </div>
        </Tilt>
      </Link>
    </motion.div>
  );
}