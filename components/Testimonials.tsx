"use client";
import React, { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { Quote, Star } from "lucide-react";
import { client } from "@/lib/sanity/client";

export default function Testimonials() {
  const [reviews, setReviews] = useState<any[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      // FIX: Added rating filtering (>= 4) and limited to 5 reviews
      const query = `*[_type == "guestVoice" && rating >= 4] | order(_createdAt desc)[0...5] {
        guestName,
        role,
        quote,
        rating
      }`;
      try {
        const data = await client.fetch(query);
        setReviews(data);
      } catch (error) {
        console.error("Sanity fetch error:", error);
      }
    };
    fetchReviews();
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "-10%"]);
  // Fades the header out faster to clear space for the cards
  const headerOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const headerScale = useTransform(scrollYProgress, [0, 0.15], [1, 0.9]);

  return (
    <section ref={containerRef} className="relative h-[500vh] bg-[#050505]">
      <div className="sticky top-0 h-screen w-full flex flex-col overflow-hidden">
        
        {/* BACKGROUND LAYER */}
        <motion.div style={{ y: bgY }} className="absolute inset-0 z-0 opacity-40">
          <div className="absolute inset-0 bg-[#050505]" />
          <div 
            className="absolute inset-0 opacity-[0.03] mix-blend-soft-light" 
            style={{ backgroundImage: `url("https://www.transparenttextures.com/patterns/asfalt-dark.png")` }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#C5A059]/5 to-transparent" />
        </motion.div>

        {/* 1. Header Section - Fixed height and margin to prevent overlap */}
        <motion.div 
          style={{ opacity: headerOpacity, scale: headerScale }}
          className="relative z-30 pt-20 pb-10 text-center px-6 shrink-0"
        >
          <span className="font-sans text-[10px] text-[#C5A059] uppercase tracking-[0.6em] block mb-4">
            Guest Impressions
          </span>
          <h2 className="font-serif text-white text-4xl md:text-6xl italic">
            Whispers of the Coast
          </h2>
        </motion.div>

        {/* 2. Testimonial Stage - Centered flex container */}
        <div className="flex-grow relative w-full max-w-5xl mx-auto z-10 px-6 mb-20">
          {reviews.length > 0 ? (
            reviews.map((review, i) => (
              <ReviewCard 
                key={i} 
                review={review} 
                index={i} 
                total={reviews.length} 
                progress={scrollYProgress} 
              />
            ))
          ) : (
            <div className="flex h-full items-center justify-center">
               <p className="text-[#C5A059]/30 font-serif italic text-xl animate-pulse text-center tracking-widest">
                 Curating the finest experiences...
               </p>
            </div>
          )}
        </div>

        {/* 3. Footer Indicator */}
        <div className="relative z-20 pb-10 flex flex-col items-center gap-4 opacity-20">
            <span className="text-[8px] text-[#C5A059] uppercase tracking-[0.5em] [writing-mode:vertical-rl]">Scroll</span>
            <div className="w-[1px] h-10 bg-gradient-to-b from-[#C5A059] to-transparent" />
        </div>
      </div>
    </section>
  );
}

function ReviewCard({ review, index, total, progress }: any) {
  // We offset the start so cards only appear after the header fades
  const start = (index / total) * 0.8 + 0.1;
  const end = ((index + 1) / total) * 0.8 + 0.1;

  const opacity = useTransform(progress, [start, start + 0.1, end - 0.1, end], [0, 1, 1, 0]);
  const scale = useTransform(progress, [start, start + 0.1, end], [0.9, 1, 1.1]);
  const yDrift = useTransform(progress, [start, end], ["20px", "-20px"]);
  
  const smoothScale = useSpring(scale, { stiffness: 60, damping: 25 });

  return (
    <motion.div
      style={{ 
        opacity, 
        scale: smoothScale, 
        left: "50%",
        top: "50%",
        x: "-50%",
        y: "-50%",
        marginTop: yDrift, // Subtle vertical movement
        position: "absolute",
      }}
      className="w-full max-w-2xl flex flex-col items-center text-center px-4"
    >
      <div className="relative mb-8">
        <Quote className="text-[#C5A059] opacity-10 absolute -top-12 -left-8 md:-left-16" size={80} strokeWidth={1} />
        
        <div className="flex justify-center gap-1.5 mb-8">
          {[...Array(review.rating || 5)].map((_, i) => (
            <Star key={i} size={12} className="fill-[#C5A059] text-[#C5A059]" />
          ))}
        </div>

        <p className="font-serif text-3xl md:text-5xl text-white leading-[1.2] italic select-none">
          &ldquo;{review.quote}&rdquo;
        </p>
      </div>
      
      <div className="flex flex-col items-center mt-4">
        <div className="h-[1px] w-12 bg-[#C5A059]/40 mb-6" />
        <h4 className="text-[#C5A059] text-[12px] font-bold tracking-[0.5em] uppercase mb-2">
          {review.guestName}
        </h4>
        <p className="text-stone-500 text-[9px] tracking-[0.4em] uppercase font-medium">
          {review.role}
        </p>
      </div>
    </motion.div>
  );
}






