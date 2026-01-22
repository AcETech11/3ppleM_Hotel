"use client";
import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import Tilt from "react-parallax-tilt";
import Image from "next/image";
import Link from "next/link";
import { Wifi, BedDouble, ChevronRight } from "lucide-react";
import { urlFor } from "@/lib/sanity/image";

export default function RoomsClient({ initialRooms }: { initialRooms: any[] }) {
  const targetRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [translateX, setTranslateX] = useState(0);

  const { scrollYProgress } = useScroll({ target: targetRef });
  
  // Smooth the scroll transition
  const xRaw = useTransform(scrollYProgress, [0, 1], [0, translateX]);
  const x = useSpring(xRaw, { stiffness: 50, damping: 20, mass: 0.5 });

  const titleY = useTransform(scrollYProgress, [0, 1], ["0%", "-20%"]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.2, 0.4], [1, 0.5, 0]);

  useEffect(() => {
    const updateScroll = () => {
      if (trackRef.current) {
        // Calculate the total width of the content minus the visible screen width
        const trackWidth = trackRef.current.scrollWidth;
        const viewportWidth = window.innerWidth;
        // We subtract viewportWidth to stop exactly at the last card
        setTranslateX(-(trackWidth - viewportWidth));
      }
    };

    updateScroll();
    // Use a small timeout to ensure Sanity images/layout are settled
    const timeout = setTimeout(updateScroll, 500);
    
    window.addEventListener("resize", updateScroll);
    return () => {
      window.removeEventListener("resize", updateScroll);
      clearTimeout(timeout);
    };
  }, [initialRooms]);

  return (
    <section ref={targetRef} className="relative h-[400vh] bg-[#050505]">
      <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden">
        
        {/* Background Large Text */}
        <motion.div 
          style={{ y: titleY, opacity: titleOpacity }}
          className="absolute top-[12vh] left-0 w-full px-6 md:px-20 z-0 pointer-events-none"
        >
          <p className="font-sans text-[10px] text-[#C5A059] uppercase tracking-[0.5em] mb-4">
            The Collection
          </p>
          <h2 className="text-6xl md:text-[11rem] font-serif text-white/[0.05] leading-[0.9] uppercase italic font-black tracking-tighter">
            Absolute <br/> Comfort
          </h2>
        </motion.div>

        {/* Horizontal Scroll Track */}
        <div className="relative z-10">
          <motion.div 
            ref={trackRef}
            style={{ x }} 
            // Added flex-nowrap and extra padding-right to prevent desktop overlapping
            className="flex flex-nowrap gap-6 md:gap-16 px-[10vw] pr-[25vw] w-max items-center"
          >
            {initialRooms.map((room, i) => (
              <RoomCard key={room.slug || i} room={room} index={i} />
            ))}
          </motion.div>
        </div>

        {/* Bottom UI / Progress */}
        <div className="absolute bottom-12 left-6 md:left-20 flex items-center gap-8 z-20">
            <div className="flex flex-col">
                <span className="text-[#C5A059] font-sans text-[10px] font-bold tracking-widest">SCROLL</span>
                <span className="text-white/20 font-sans text-[10px]">TO EXPLORE</span>
            </div>
            
            <div className="w-32 md:w-64 h-[1px] bg-white/10 relative">
                <motion.div 
                  style={{ scaleX: scrollYProgress }} 
                  className="absolute inset-0 bg-[#C5A059] origin-left" 
                />
            </div>
            
            <div className="text-white/40 font-serif italic text-lg">
                0{initialRooms.length}
            </div>
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
          className="w-[85vw] md:w-[480px] h-[60vh] md:h-[650px] bg-neutral-900 border border-white/5 relative overflow-hidden shadow-2xl rounded-sm"
        >
          {/* Image Layer */}
          <div className="absolute inset-0">
            {room.mainImage && (
              <Image 
                src={urlFor(room.mainImage).width(800).height(1100).url()} 
                alt={room.title} 
                fill 
                className="object-cover opacity-80 group-hover:scale-110 transition-transform duration-[2.5s] ease-out" 
                sizes="(max-width: 768px) 85vw, 480px"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-90" />
          </div>

          {/* Room Number */}
          <div className="absolute top-8 left-8">
             <span className="text-white/10 font-serif italic text-6xl">0{index + 1}</span>
          </div>

          {/* Info Layer */}
          <div className="absolute bottom-0 left-0 w-full p-8 md:p-12">
            <div className="mb-6">
              <p className="text-[#C5A059] text-[10px] font-bold tracking-[0.4em] uppercase mb-2">
                ₦{Number(room.price).toLocaleString()} / Night
              </p>
              <h3 className="text-3xl md:text-5xl font-serif text-white uppercase leading-none tracking-tighter">
                {room.title.split(' ').map((word: string, i: number) => (
                  <span key={i} className={i === 1 ? "italic block" : ""}>{word} </span>
                ))}
              </h3>
            </div>
            
            <div className="flex items-center justify-between pt-6 border-t border-white/10">
              <div className="flex gap-6">
                <div className="flex items-center gap-2 text-[9px] text-white/50 uppercase tracking-widest font-bold">
                  <Wifi size={14} className="text-[#C5A059]" /> Wi-Fi
                </div>
                <div className="flex items-center gap-2 text-[9px] text-white/50 uppercase tracking-widest font-bold">
                  <BedDouble size={14} className="text-[#C5A059]" /> King Bed
                </div>
              </div>
              
              <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white group-hover:bg-[#C5A059] group-hover:border-[#C5A059] group-hover:text-black transition-all duration-500">
                <ChevronRight size={20} />
              </div>
            </div>
          </div>
        </Tilt>
      </Link>
    </motion.div>
  );
}