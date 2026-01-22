"use client";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { 
  Shield, Sparkles, Coffee, ArrowRight, 
  MapPin, Phone, Mail, MessageCircle 
} from "lucide-react";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "Our Story & Philosophy",
  description: "Learn about the essence of 3PPLEM. A sanctuary of calm and sophisticated hospitality in Osapa London, Lagos.",
};

const FadeIn = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8, delay, ease: "easeOut" }}
  >
    {children}
  </motion.div>
);

export default function AboutPage() {
  return (
    <>
    <Navbar />
    
    <div className="bg-[#050505] text-white overflow-x-hidden">
      
      {/* 1. HERO SECTION */}
      <section className="relative h-[80vh] flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <img 
            src="/3ppleM_exterior.webp" 
            alt="3PPLEM Exterior"
            className="w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-[#050505]" />
        </div>
        <div className="relative z-10 text-center px-6">
          <motion.span 
            initial={{ opacity: 0, letterSpacing: "0.2em" }}
            animate={{ opacity: 1, letterSpacing: "0.8em" }}
            transition={{ duration: 1 }}
            className="text-[#C5A059] text-[10px] md:text-xs uppercase font-bold mb-6 block"
          >
            The Genesis
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 1 }}
            className="text-6xl md:text-9xl font-serif italic tracking-tighter"
          >
            Our Story.
          </motion.h1>
        </div>
      </section>

      {/* 2. PHILOSOPHY SECTION */}
      <section className="max-w-7xl mx-auto px-6 py-24 md:py-40">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <FadeIn>
            <h2 className="text-[#C5A059] text-[10px] uppercase tracking-[0.5em] font-bold mb-8">Philosophy</h2>
            <p className="text-3xl md:text-5xl font-serif italic leading-tight mb-8 text-white">
              "Luxury is not a loud statement; it is a quiet understanding."
            </p>
            <div className="space-y-6 text-stone-500 text-sm md:text-base leading-relaxed max-w-lg">
              <p>
                3PPLEM was born from a singular desire: to create a sanctuary in Osapa London that balances the vibrant energy of Lekki with the profound stillness of a private estate.
              </p>
              <p>
                We believe that true hospitality is the art of anticipation—knowing what a guest needs before they have to ask.
              </p>
            </div>
          </FadeIn>
          <div className="relative">
            <FadeIn delay={0.2}>
              <div className="aspect-[4/5] overflow-hidden border border-white/5">
                <img src="/3ppleM_interior_1.webp" alt="Design" className="w-full h-full object-cover" />
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* 3. THE PILLARS (BENTO) */}
      <section className="bg-white/[0.02] py-32 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <PillarCard icon={<Shield size={20}/>} title="Privacy" desc="Secluded layouts designed for high-profile stays." />
          <PillarCard icon={<Sparkles size={20}/>} title="Sophistication" desc="Curated art and premium finishes in every suite." />
          <PillarCard icon={<Coffee size={20}/>} title="Service" desc="Attentive, yet invisible excellence in hospitality." />
        </div>
      </section>

      {/* 4. LOCATION & CONTACT SECTION */}
      <section className="max-w-7xl mx-auto px-6 py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Map/Image Card */}
          <FadeIn>
            <div className="relative group overflow-hidden border border-white/10 aspect-video lg:aspect-square">
              {/* Replace the src with a styled map screenshot of Osapa London */}
              <img 
                src="/map_osapa.png" 
                alt="3PPLEM Location" 
                className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-80 transition-all duration-1000"
              />
              <div className="absolute inset-0 bg-black/40" />
              <div className="absolute bottom-8 left-8">
                <div className="flex items-center gap-3 text-[#C5A059] mb-2">
                  <MapPin size={18} />
                  <span className="text-[10px] uppercase tracking-widest font-bold">The Enclave</span>
                </div>
                <p className="text-white font-serif italic text-xl">23/24 Muritala Eletu Way,<br/>Osapa London, Lekki.</p>
              </div>
              <a 
                href="https://www.google.com/maps/place/3pple+M+Continental+Hotel+%26+Suites/@6.4398347,3.51088,62m/data=!3m1!1e3!4m18!1m8!3m7!1s0x104e0baf7da48d0d:0x99a8fe4168c50bc8!2sNigeria!3b1!8m2!3d9.081999!4d8.675277!16zL20vMDVjZ3Y!3m8!1s0x103bf7dd2406f1d7:0xc1894bca66488c1a!5m2!4m1!1i2!8m2!3d6.4399204!4d3.5110659!16s%2Fg%2F11vylxw8_j?entry=ttu&g_ep=EgoyMDI2MDExMy4wIKXMDSoKLDEwMDc5MjA3M0gBUAM%3D" // Replace with your actual Google Maps Link
                target="_blank"
                className="absolute top-8 right-8 bg-white/10 backdrop-blur-md p-4 rounded-full hover:bg-[#C5A059] transition-colors group/btn"
              >
                <ArrowRight size={20} className="text-white group-hover/btn:text-black -rotate-45" />
              </a>
            </div>
          </FadeIn>

          {/* Contact Details */}
          <div className="flex flex-col justify-center space-y-12">
            <FadeIn delay={0.2}>
              <h2 className="text-[#C5A059] text-[10px] uppercase tracking-[0.5em] font-bold mb-4">Get in Touch</h2>
              <h3 className="text-4xl md:text-5xl font-serif italic mb-10">We are at your disposal.</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <ContactItem icon={<Phone size={16}/>} label="Phone" value="+234 817 077 7774" href="tel:+2348170777774" />
                <ContactItem icon={<Mail size={16}/>} label="Email" value="info@3pplemcontinentalhotel.ng" href="mailto:info@3pplemcontinentalhotel.ng" />
                <ContactItem icon={<MessageCircle size={16}/>} label="WhatsApp" value="Live Chat" href="https://wa.me/2348170777774" />
                <ContactItem icon={<MapPin size={16}/>} label="Location" value="Osapa London, Lagos" href="#" />
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* 5. CTA */}
      <section className="py-32 text-center border-t border-white/5">
        <FadeIn>
          <h2 className="text-5xl font-serif italic mb-10">Experience the Sanctuary.</h2>
          <Link href="/reserve" className="px-16 py-6 bg-[#C5A059] text-black font-bold uppercase text-[10px] tracking-[0.4em] hover:bg-white transition-all inline-block">
            Book Now
          </Link>
        </FadeIn>
      </section>
    </div>
    </>
  );
}

function PillarCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="bg-[#0D0D0D] p-10 border border-white/5 hover:border-[#C5A059]/30 transition-all">
      <div className="text-[#C5A059] mb-6">{icon}</div>
      <h3 className="text-lg font-serif italic mb-3">{title}</h3>
      <p className="text-[10px] text-stone-500 uppercase leading-relaxed tracking-widest">{desc}</p>
    </div>
  );
}

function ContactItem({ icon, label, value, href }: { icon: React.ReactNode, label: string, value: string, href: string }) {
  return (
    <a href={href} className="group block">
      <div className="flex items-center gap-4 mb-2">
        <div className="text-[#C5A059]">{icon}</div>
        <span className="text-[9px] uppercase tracking-widest text-stone-600 font-bold group-hover:text-white transition-colors">{label}</span>
      </div>
      <p className="text-stone-300 font-serif italic text-lg group-hover:text-[#C5A059] transition-colors">{value}</p>
    </a>
  );
}