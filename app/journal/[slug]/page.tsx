"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { client } from "@/lib/sanity/client";
import { urlFor } from "@/lib/sanity/image";
import { PortableText } from "@portabletext/react";
import { motion } from "framer-motion";
import { ArrowLeft, Share2, Clock } from "lucide-react";
import Navbar from "@/components/Navbar";

// Reuse the high-end styling components
const journalTextStyles = {
  block: {
    normal: ({ children }: any) => (
      <p className="text-stone-400 font-light leading-relaxed mb-8 tracking-wide text-lg md:text-xl">
        {children}
      </p>
    ),
    h2: ({ children }: any) => (
      <h2 className="font-serif text-3xl md:text-4xl text-white mt-16 mb-8 italic">
        {children}
      </h2>
    ),
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-2 border-[#C5A059] pl-8 my-12 italic text-white/90 text-2xl font-serif leading-relaxed">
        {children}
      </blockquote>
    ),
  },
  types: {
    image: ({ value }: any) => (
      <div className="my-16 relative aspect-video overflow-hidden rounded-sm border border-white/5">
        <Image
          src={urlFor(value).width(1200).url()}
          alt={value.alt || "Journal Image"}
          fill
          className="object-cover"
        />
        {value.caption && (
          <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-md px-4 py-2 text-[10px] text-stone-300 uppercase tracking-widest">
            {value.caption}
          </div>
        )}
      </div>
    ),
  },
};

export default function JournalArticle() {
  const { slug } = useParams();
  const [post, setPost] = useState<any>(null);

  useEffect(() => {
    const fetchPost = async () => {
      const query = `*[_type == "journal" && slug.current == $slug][0] {
        title,
        publishedAt,
        mainImage,
        body,
        excerpt
      }`;
      const data = await client.fetch(query, { slug });
      setPost(data);
    };
    fetchPost();
  }, [slug]);

  if (!post) return <div className="h-screen bg-[#0D0D0D] flex items-center justify-center text-[#C5A059]">Opening the archives...</div>;

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', { 
      month: 'long', day: 'numeric', year: 'numeric' 
    }).toUpperCase();
  };

  return (
    <>
    <Navbar />
    
    <main className="bg-[#0D0D0D] min-h-screen">
      {/* 1. EDITORIAL HERO */}
      <section className="relative h-[80vh] w-full flex items-center justify-center pt-20">
        <div className="absolute inset-0 z-0">
          <Image 
            src={urlFor(post.mainImage).width(1920).url()} 
            alt={post.title} 
            fill 
            className="object-cover opacity-40 grayscale"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0D0D0D]/60 via-[#0D0D0D]/80 to-[#0D0D0D]" />
        </div>

        <div className="relative z-10 max-w-4xl px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Link href="/journal" className="inline-flex items-center gap-2 text-[#C5A059] text-[10px] uppercase tracking-[0.4em] mb-12 hover:gap-4 transition-all">
              <ArrowLeft size={14} /> Back to Stories
            </Link>
            <span className="block text-stone-500 text-[10px] font-bold tracking-[0.4em] uppercase mb-6">
              {formatDate(post.publishedAt)}
            </span>
            <h1 className="text-4xl md:text-7xl font-serif text-white italic leading-[1.1]">
              {post.title}
            </h1>
          </motion.div>
        </div>
      </section>

      {/* 2. ARTICLE CONTENT */}
      <section className="pb-32 px-6">
        <div className="max-w-3xl mx-auto">
          {/* Article Meta Infobar */}
          <div className="flex items-center justify-between border-y border-white/5 py-8 mb-16">
            <div className="flex items-center gap-4 text-stone-500 text-[10px] font-bold tracking-widest uppercase">
              <Clock size={14} className="text-[#C5A059]" /> 5 min read
            </div>
            <div className="flex items-center gap-6">
              <Share2 size={16} className="text-stone-500 hover:text-white cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Excerpt/Intro */}
          {post.excerpt && (
            <p className="text-white text-2xl font-serif italic mb-16 leading-relaxed border-l-2 border-[#C5A059] pl-8">
              {post.excerpt}
            </p>
          )}

          {/* The Body Content */}
          <article className="journal-content">
            <PortableText value={post.body} components={journalTextStyles} />
          </article>
        </div>
      </section>

      {/* 3. NEXT STORY CTA */}
      <section className="py-32 bg-stone-900/20 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <span className="text-[10px] text-[#C5A059] uppercase tracking-[0.5em] mb-8 block">Continue Reading</span>
          <Link href="/journal" className="font-serif text-4xl text-white hover:italic transition-all">
            Explore more stories from the Coast —
          </Link>
        </div>
      </section>
    </main>
    </>
  );
}