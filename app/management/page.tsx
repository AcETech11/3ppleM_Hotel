"use client";
import React, { useEffect, useState } from "react";
import { client } from "@/lib/sanity/client";
import { motion } from "framer-motion";
import Link from "next/link";
import { 
  Bed, 
  Image as ImageIcon, 
  PenTool, 
  MessageSquare, 
  Activity, 
  Plus, 
  ArrowUpRight 
} from "lucide-react";

export default function ManagementHome() {
  const [counts, setCounts] = useState({ rooms: 0, journal: 0, reviews: 0, gallery: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCounts = async () => {
      const query = `{
        "rooms": count(*[_type == "room"]),
        "journal": count(*[_type == "journal"]),
        "reviews": count(*[_type == "guestVoice"]),
        "gallery": count(*[_type == "gallery"])
      }`;
      const data = await client.fetch(query);
      setCounts(data);
      setLoading(false);
    };
    fetchCounts();
  }, []);

  const cards = [
    { label: "Suites", value: counts.rooms, icon: Bed, href: "/management/room" },
    { label: "Gallery Sets", value: counts.gallery, icon: ImageIcon, href: "/management/gallery" },
    { label: "Journal Posts", value: counts.journal, icon: PenTool, href: "/management/journal" },
    { label: "Testimonials", value: counts.reviews, icon: MessageSquare, href: "/management/reviews" },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-12">
      {/* HEADER SECTION */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </div>
            <span className="text-[10px] uppercase tracking-[0.5em] text-[#C5A059] font-bold">
              3PPLEM Intelligence
            </span>
          </div>
          <h1 className="font-serif text-5xl md:text-7xl italic text-white tracking-tight">
            Dashboard.
          </h1>
        </div>
        <div className="text-right hidden md:block">
          <p className="text-stone-500 text-[10px] uppercase tracking-widest mb-1">Local Time</p>
          <p className="text-white font-serif italic text-xl">
            {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
          </p>
        </div>
      </header>

      {/* METRIC GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, i) => (
          <Link href={card.href} key={card.label}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="group relative bg-white/[0.02] border border-white/5 p-8 hover:bg-white/[0.04] hover:border-[#C5A059]/30 transition-all cursor-pointer"
            >
              <div className="flex justify-between items-start mb-8">
                <card.icon size={20} className="text-stone-600 group-hover:text-[#C5A059] transition-colors" />
                <ArrowUpRight size={14} className="text-stone-800 group-hover:text-[#C5A059] transition-colors" />
              </div>
              
              <h3 className="text-5xl font-serif text-white italic mb-2 tracking-tighter">
                {loading ? (
                  <span className="animate-pulse text-stone-800">...</span>
                ) : (
                  card.value.toString().padStart(2, '0')
                )}
              </h3>
              <p className="text-stone-500 text-[9px] uppercase tracking-[0.4em] font-medium group-hover:text-stone-300 transition-colors">
                {card.label}
              </p>
              
              {/* Decorative accent */}
              <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#C5A059] group-hover:w-full transition-all duration-500" />
            </motion.div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* RECENT ACTIVITY PLACEHOLDER */}
        <div className="lg:col-span-2 space-y-6">
          <h4 className="text-[10px] uppercase tracking-[0.4em] text-stone-500 font-bold border-b border-white/5 pb-4">
            Quick Actions
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button className="flex items-center justify-between p-6 bg-[#0D0D0D] border border-white/5 hover:border-[#C5A059]/50 transition-all text-left group">
              <Link href="/management/journal">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/5 text-[#C5A059]"><PenTool size={18}/></div>
                <div>
                  <p className="text-sm font-medium">New Journal</p>
                  <p className="text-[10px] text-stone-600 uppercase">Write story</p>
                </div>
              </div>
              </Link>
              <Plus size={16} className="text-stone-700 group-hover:text-white" />
            </button>
            <button className="flex items-center justify-between p-6 bg-[#0D0D0D] border border-white/5 hover:border-[#C5A059]/50 transition-all text-left group">
              <Link href="/management/gallery">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/5 text-[#C5A059]"><ImageIcon size={18}/></div>
                <div>
                  <p className="text-sm font-medium">Add Gallery</p>
                  <p className="text-[10px] text-stone-600 uppercase">Upload sets</p>
                </div>
              </div>
              </Link>
              <Plus size={16} className="text-stone-700 group-hover:text-white" />
            </button>
          </div>
        </div>

        {/* ADMIN NOTICE */}
        <div className="bg-[#C5A059]/5 border border-[#C5A059]/10 p-8 rounded-sm self-start">
          <div className="flex items-center gap-2 mb-6 text-[#C5A059]">
            <Activity size={16} />
            <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold">Terminal Note</h4>
          </div>
          <p className="text-stone-400 text-sm leading-relaxed italic font-serif">
            "You are accessing the 3PPLEM core database. Every update here reflects live on the guest portal. Maintain the high-standard aesthetic in all uploads."
          </p>
          <div className="mt-8 pt-6 border-t border-[#C5A059]/10">
            <div className="flex justify-between items-center">
               <span className="text-[8px] text-stone-600 uppercase tracking-widest">Database Version</span>
               <span className="text-[8px] text-[#C5A059] uppercase tracking-widest font-bold">v3.0.4</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}