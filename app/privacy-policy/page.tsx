"use client";
import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPolicy() {
  const sections = [
    {
      title: "Data Collection",
      content: "We collect information you provide directly to us when you make a reservation, including your name, email, phone number, and payment details."
    },
    {
      title: "Use of Information",
      content: "Your data is used solely to provide our sanctuary services, process transactions, and send curated updates regarding your stay at 3PPLEM."
    },
    {
      title: "Security",
      content: "We implement rigorous architectural security measures to protect your personal information against unauthorized access or disclosure."
    }
  ];

  return (
    <main className="bg-[#0D0D0D] min-h-screen pt-40 pb-20">
      <div className="max-w-3xl mx-auto px-6">
        <Link href="/" className="flex items-center gap-2 text-[#C5A059] text-[10px] uppercase tracking-[0.3em] mb-12 hover:gap-4 transition-all">
          <ArrowLeft size={14} /> Return Home
        </Link>

        <header className="mb-20">
          <h1 className="font-serif text-5xl md:text-7xl text-white italic mb-6">Privacy Policy.</h1>
          <p className="text-stone-500 text-[10px] uppercase tracking-[0.4em]">Last Updated: January 2026</p>
        </header>

        <div className="space-y-16">
          {sections.map((section, i) => (
            <section key={i} className="border-t border-white/5 pt-10">
              <h2 className="font-serif text-2xl text-[#C5A059] mb-6 italic">{section.title}</h2>
              <p className="text-stone-400 leading-relaxed tracking-wide font-light text-lg">
                {section.content}
              </p>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}