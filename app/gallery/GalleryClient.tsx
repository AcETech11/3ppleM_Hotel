"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { client } from "@/lib/sanity/client";
import { urlFor } from "@/lib/sanity/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, Share2, Check } from "lucide-react";
import Navbar from "@/components/Navbar";

export default function GalleryClient() {
  const [items, setItems] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>(["All"]);
  const [activeTab, setActiveTab] = useState("All");
  const [selectedImg, setSelectedImg] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchGallery = async () => {
      const query = `*[_type == "gallery"] | order(_createdAt desc) {
        name,
        images[]{
          asset,
          alt,
          caption
        }
      }`;
      const data = await client.fetch(query);
      
      const catNames = ["All", ...new Set(data.map((g: any) => g.name))];
      setCategories(catNames as string[]);

      const allImages = data.flatMap((g: any) => 
        g.images.map((img: any) => ({ ...img, category: g.name }))
      );
      setItems(allImages);
    };
    fetchGallery();
  }, []);

  const handleShare = async (e: React.MouseEvent, img: any) => {
    e.stopPropagation();
    const shareData = {
      title: "3PPLEM | Sanctuary",
      text: `Exploring ${img.caption || 'the perspective'} at 3PPLEM, Lekki.`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      console.error("Error sharing:", err);
    }
  };

  const filteredItems = activeTab === "All" 
    ? items 
    : items.filter(item => item.category === activeTab);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#050505] pt-40 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          
          {/* Header */}
          <header className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <span className="text-[10px] uppercase tracking-[0.5em] text-[#C5A059] font-bold block mb-4">
                Visual Archive
              </span>
              <h1 className="font-serif text-6xl md:text-8xl text-white italic">
                The <span className="text-[#C5A059] not-italic">Perspective.</span>
              </h1>
            </div>

            <nav className="flex flex-wrap gap-4 border-b border-white/5 pb-4">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveTab(cat)}
                  className={`relative px-4 py-2 text-[10px] uppercase tracking-[0.3em] font-bold transition-all duration-500 ${
                    activeTab === cat ? "text-[#C5A059]" : "text-stone-500 hover:text-white"
                  }`}
                >
                  {cat}
                  {activeTab === cat && (
                    <motion.div 
                      layoutId="activeUnderline"
                      className="absolute bottom-0 left-0 w-full h-[1px] bg-[#C5A059]"
                    />
                  )}
                </button>
              ))}
            </nav>
          </header>

          <motion.div 
            layout
            className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6"
          >
            <AnimatePresence mode="popLayout">
              {filteredItems.map((img, i) => (
                <motion.div
                  key={img.asset?._ref || i}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                  onClick={() => setSelectedImg(img)}
                  className="relative group cursor-pointer overflow-hidden border border-white/5 bg-stone-900"
                >
                  <Image
                    src={urlFor(img).width(800).url()}
                    alt={img.alt || "3PPLEM Gallery"}
                    width={800}
                    height={1000}
                    // FIXED: Mobile is full color (grayscale-0), Desktop is grayscale and becomes color on hover
                    className="w-full h-auto transition-all duration-1000 grayscale-0 md:grayscale md:group-hover:grayscale-0 md:group-hover:scale-110"
                  />
                  
                  {/* FIXED: Mobile overlay is always visible (opacity-100), Desktop is hidden (md:opacity-0) until hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6 md:p-8">
                    <span className="text-[#C5A059] text-[8px] uppercase tracking-widest font-bold mb-2">
                      {img.category}
                    </span>
                    <p className="text-white font-serif italic text-lg md:text-xl">
                      {img.caption || "View Perspective"}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* LIGHTBOX remains unchanged */}
        <AnimatePresence>
  {selectedImg && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      // Use fixed inset-0 and a higher z-index to ensure it covers everything
      className="fixed inset-0 z-[200] bg-[#050505] overflow-y-auto"
    >
      <div className="min-h-screen w-full flex flex-col pt-12 pb-24 md:pb-12 px-6">
        
        {/* 1. Header Area: Category Label */}
        <div className="text-center mb-8">
          <p className="text-[#C5A059] text-[10px] uppercase tracking-[0.5em] font-bold">
            {selectedImg.category || "Sanctuary"}
          </p>
        </div>

        {/* 2. Main Image Container: Centered but scrollable */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="relative w-full max-w-6xl mx-auto h-[60vh] md:h-[75vh]"
          onClick={() => setSelectedImg(null)}
        >
          <Image
            src={urlFor(selectedImg).width(1600).url()}
            alt={selectedImg.alt || "3PPLEM Exclusive"}
            fill
            className="object-contain cursor-zoom-out"
            priority
          />
        </motion.div>

        {/* 3. Narrative Section: Scrollable text area below the image */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="max-w-2xl mx-auto text-center mt-12 md:mt-16"
        >
          <h2 className="text-white font-serif italic text-3xl md:text-5xl leading-tight mb-6">
            {selectedImg.caption || "A Moment of Peace"}
          </h2>
          <div className="h-[1px] w-12 bg-[#C5A059]/40 mx-auto" />
        </motion.div>

        {/* 4. Bottom Fixed Controls: Keeps buttons away from the top Nav Bar */}
        <div className="fixed bottom-0 left-0 w-full p-6 md:p-10 flex justify-between items-center bg-gradient-to-t from-[#050505] via-[#050505]/80 to-transparent pointer-events-none">
          
          {/* Share Button */}
          <button 
            onClick={(e) => { e.stopPropagation(); handleShare(e, selectedImg); }}
            className="pointer-events-auto flex items-center gap-3 bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 px-6 py-3 transition-all duration-500"
          >
            <Share2 size={14} className="text-[#C5A059]" />
            <span className="text-[10px] uppercase tracking-[0.3em] font-medium text-white/70">
              {copied ? "Copied" : "Share"}
            </span>
          </button>

          {/* Close Button */}
          <button 
            onClick={() => setSelectedImg(null)}
            className="pointer-events-auto flex items-center gap-3 bg-[#C5A059] px-6 py-3 transition-all duration-500 hover:brightness-110"
          >
            <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-black">
              Close
            </span>
            <X size={18} strokeWidth={2} className="text-black" />
          </button>
        </div>
      </div>
    </motion.div>
  )}
</AnimatePresence>
      </main>
    </>
  );
}