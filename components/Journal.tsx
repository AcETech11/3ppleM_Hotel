"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { client } from "@/lib/sanity/client";
import { urlFor } from "@/lib/sanity/image";

export default function Journal() {
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const query = `*[_type == "journal"] | order(publishedAt desc)[0...3] {
        title,
        "slug": slug.current,
        mainImage, 
        publishedAt,
        excerpt
      }`;
      try {
        const data = await client.fetch(query);
        setPosts(data);
      } catch (error) {
        console.error("Journal fetch error:", error);
      }
    };
    fetchPosts();
  }, []);

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options).toUpperCase();
  };

  return (
    <section id="journal" className="py-32 bg-[#0D0D0D] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header Section Restored */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-2xl">
            <span className="text-[10px] uppercase tracking-[0.4em] text-[#C5A059] font-bold block mb-4">
              The Journal
            </span>
            <h2 className="font-serif text-5xl md:text-7xl text-white">
              Stories from <br /> <span className="italic text-[#C5A059]">the Coast.</span>
            </h2>
          </div>
          <Link href="/journal" className="text-[10px] font-bold tracking-[0.2em] uppercase text-stone-500 hover:text-[#C5A059] transition-colors pb-2 border-b border-stone-800 hover:border-[#C5A059]">
            View All Stories
          </Link>
        </div>

        {/* 3-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {posts.map((post, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="group cursor-pointer"
            >
              <Link href={`/journal/${post.slug}`}>
                {/* Image Container */}
                <div className="relative aspect-[4/5] overflow-hidden mb-8 rounded-sm border border-white/5">
                  <Image 
                    src={post.mainImage ? urlFor(post.mainImage).width(600).url() : "/fallback.jpg"}
                    alt={post.title}
                    fill
                    className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000 ease-out"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  
                  {/* Floating Icon Overlay */}
                  <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md p-3 opacity-0 group-hover:opacity-100 transition-all duration-500">
                    <ArrowUpRight className="text-[#C5A059]" size={20} />
                  </div>
                </div>

                {/* Text Content Restored */}
                <div className="space-y-4">
                  <span className="text-[10px] text-stone-500 font-bold tracking-[0.2em] uppercase">
                    {formatDate(post.publishedAt)}
                  </span>
                  
                  <h3 className="font-serif text-2xl md:text-3xl text-white/90 group-hover:text-[#C5A059] transition-colors duration-500 leading-snug">
                    {post.title}
                  </h3>

                  <div className="pt-4 overflow-hidden">
                    <span className="inline-block text-[10px] font-bold tracking-[0.2em] uppercase text-[#C5A059] 
                      opacity-100 translate-y-0 
                      md:opacity-0 md:translate-y-4 md:group-hover:opacity-100 md:group-hover:translate-y-0 transition-all duration-500">
                      Read Story —
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}


