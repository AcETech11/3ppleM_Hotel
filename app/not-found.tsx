"use client";
import Link from "next/link";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <main className="h-screen w-full bg-[#0D0D0D] flex flex-col items-center justify-center px-6 relative overflow-hidden">
      
      {/* Background Decorative Element */}
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] pointer-events-none">
        <h1 className="text-[40vw] font-serif italic">Lost?</h1>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="z-10 text-center"
      >
        <span className="text-gold text-xs font-bold tracking-[0.5em] uppercase mb-6 block">
          Error 404
        </span>
        
        <h2 className="font-serif text-5xl md:text-8xl text-foreground mb-8">
          This Path is <br /> <span className="italic">Uncharted.</span>
        </h2>

        <p className="text-stone text-sm md:text-base max-w-md mx-auto mb-12 leading-relaxed">
          The page you are looking for has been moved or does not exist. 
          Let us guide you back to the sanctuary.
        </p>

        <Link 
          href="/" 
          className="inline-block px-12 py-5 bg-gold text-black text-[10px] font-black tracking-[0.3em] uppercase hover:bg-white transition-all duration-500"
        >
          Return to Home
        </Link>
      </motion.div>

      {/* Footer link for SEO/Navigation */}
      <div className="absolute bottom-10 text-[8px] tracking-[0.4em] text-stone uppercase">
        23/24 Muritala Eletu Way, Osapa London, Lekki.
      </div>
    </main>
  );
}