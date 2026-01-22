"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { client } from "@/lib/sanity/client";
import { urlFor } from "@/lib/sanity/image";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";

export default function JournalArchive() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      const query = `*[_type == "journal"] | order(publishedAt desc) {
        title,
        "slug": slug.current,
        publishedAt,
        mainImage,
        excerpt
      }`;
      try {
        const data = await client.fetch(query);
        setPosts(data);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', { 
      month: 'short', day: 'numeric', year: 'numeric' 
    }).toUpperCase();
  };

  if (loading) return <div className="min-h-screen bg-[#0D0D0D]" />;

  const featuredPost = posts[0];
  const remainingPosts = posts.slice(1);

  return (
    <>
    <Navbar/>
    
    <main className="min-h-screen bg-[#0D0D0D] pt-40 pb-32">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <header className="mb-20">
          <span className="text-[10px] uppercase tracking-[0.5em] text-[#C5A059] font-bold block mb-4">
            The Archive
          </span>
          <h1 className="font-serif text-6xl md:text-8xl text-white italic">
            Stories & <span className="text-[#C5A059] not-italic">Perspectives.</span>
          </h1>
        </header>

        {/* 1. FEATURED POST */}
        {featuredPost && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-32"
          >
            <Link href={`/journal/${featuredPost.slug}`} className="group grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-8 relative aspect-[16/9] overflow-hidden rounded-sm border border-white/5">
                <Image 
                  src={urlFor(featuredPost.mainImage).width(1200).url()}
                  alt={featuredPost.title}
                  fill
                  className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000"
                />
              </div>
              <div className="lg:col-span-4">
                <span className="text-[10px] text-[#C5A059] font-bold tracking-[0.3em] uppercase">Latest Story — {formatDate(featuredPost.publishedAt)}</span>
                <h2 className="font-serif text-4xl md:text-5xl text-white mt-6 mb-6 group-hover:text-[#C5A059] transition-colors leading-tight">
                  {featuredPost.title}
                </h2>
                <p className="text-stone-500 text-sm leading-relaxed tracking-wide mb-8">
                  {featuredPost.excerpt}
                </p>
                <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-white border-b border-[#C5A059] pb-2">
                  Read Full Article
                </span>
              </div>
            </Link>
          </motion.div>
        )}

        {/* 2. REGULAR GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-20">
          {remainingPosts.map((post, i) => (
            <motion.div 
              key={post.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Link href={`/journal/${post.slug}`} className="group">
                <div className="relative aspect-[4/5] overflow-hidden mb-8 border border-white/5">
                  <Image 
                    src={urlFor(post.mainImage).width(800).url()}
                    alt={post.title}
                    fill
                    className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000"
                  />
                </div>
                <span className="text-[9px] text-stone-500 font-bold tracking-[0.3em] uppercase">
                  {formatDate(post.publishedAt)}
                </span>
                <h3 className="font-serif text-2xl text-white mt-4 group-hover:text-[#C5A059] transition-colors line-clamp-2">
                  {post.title}
                </h3>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
    </>
  );
}