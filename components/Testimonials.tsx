"use client";
import React, { useRef } from "react"; // Removed useEffect, useState
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { Quote, Star } from "lucide-react";

// Add initialReviews to the props
export default function TestimonialsClient({ initialReviews }: { initialReviews: any[] }) {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: targetRef });
  
  const xRaw = useTransform(scrollYProgress, [0, 1], ["0%", "-60%"]);
  const x = useSpring(xRaw, { stiffness: 50, damping: 20 });

  return (
    <section ref={targetRef} className="relative h-[300vh] bg-[#050505]">
      <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden">
        
        {/* ... (Your existing Background Grid and Titles) ... */}

        <div className="flex items-center">
          <motion.div style={{ x }} className="flex gap-6 md:gap-12 px-8 md:px-24">
            {/* Use initialReviews here */}
            {initialReviews.map((review, i) => (
              <ReviewCard key={i} review={review} />
            ))}
          </motion.div>
        </div>

        {/* ... (Your existing Progress Indicator) ... */}
      </div>
    </section>
  );
}

// ReviewCard remains exactly the same
function ReviewCard({ review }: any) {
  return (
    <div className="w-[80vw] md:w-[420px] h-[400px] md:h-[450px] flex-shrink-0 bg-neutral-900/50 backdrop-blur-sm border border-white/[0.03] p-8 md:p-12 flex flex-col relative group transition-all duration-700">
      
      {/* Small Quote Icon */}
      <Quote className="text-[#C5A059] opacity-20 mb-6" size={32} strokeWidth={1} />
      
      <div className="flex gap-1 mb-6">
        {[...Array(review.rating || 5)].map((_, i) => (
          <Star key={i} size={8} className="fill-[#C5A059] text-[#C5A059]" />
        ))}
      </div>

      <p className="font-sans text-sm md:text-lg text-stone-300 leading-relaxed tracking-wide italic mb-auto">
        &ldquo;{review.quote}&rdquo;
      </p>

      <div className="pt-8 mt-8 border-t border-white/5">
        <h4 className="text-white text-[10px] font-bold tracking-[0.4em] uppercase mb-1">
          {review.guestName}
        </h4>
        <p className="text-[#C5A059] text-[8px] tracking-[0.3em] uppercase opacity-70">
          {review.role}
        </p>
      </div>
    </div>
  );
}






