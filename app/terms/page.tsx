"use client";
import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TermsOfService() {
  const terms = [
    {
      title: "Reservations",
      content: "All reservations are subject to availability and confirmation. A valid credit card or proof of payment is required to secure your sanctuary."
    },
    {
      title: "Cancellation Policy",
      content: "Cancellations made within 48 hours of the arrival date may be subject to a fee equivalent to one night's stay."
    },
    {
      title: "Conduct",
      content: "3PPLEM is a sanctuary of peace. We reserve the right to refuse service to any guest whose conduct is incompatible with the comfort of others."
    }
  ];

  return (
    <main className="bg-[#0D0D0D] min-h-screen pt-40 pb-20">
      <div className="max-w-3xl mx-auto px-6">
        <Link href="/" className="flex items-center gap-2 text-[#C5A059] text-[10px] uppercase tracking-[0.3em] mb-12 hover:gap-4 transition-all">
          <ArrowLeft size={14} /> Return Home
        </Link>

        <header className="mb-20">
          <h1 className="font-serif text-5xl md:text-7xl text-white italic mb-6">Terms of Service.</h1>
          <p className="text-stone-500 text-[10px] uppercase tracking-[0.4em]">Effective Date: January 2026</p>
        </header>

        <div className="space-y-16">
          {terms.map((term, i) => (
            <section key={i} className="border-t border-white/5 pt-10">
              <h2 className="font-serif text-2xl text-[#C5A059] mb-6 italic">{term.title}</h2>
              <p className="text-stone-400 leading-relaxed tracking-wide font-light text-lg">
                {term.content}
              </p>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}