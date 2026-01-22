"use client";
import React, { useState, useEffect } from "react";
import { client } from "@/lib/sanity/client";
import { Plus, Edit3, Trash2, BookOpen, Loader2, Calendar } from "lucide-react";
import { CreateJournalModal } from "./CreateJournalModal"; // We'll build this next
import { urlFor } from "@/lib/sanity/image";
import { toast } from "react-hot-toast";
import { UpdateJournalModal } from "./UpdateJournalModal";

export default function JournalManagerPage() {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<any>(null);

  const fetchArticles = async () => {
    const data = await client.fetch(`*[_type == "journal"] | order(publishedAt desc)`);
    setArticles(data);
    setLoading(false);
  };

  useEffect(() => { fetchArticles(); }, []);

  const handleDelete = async (id: string) => {
  if (confirm("Are you sure you want to delete this article? This cannot be undone.")) {
    try {
      await client.delete(id);
      toast.success("Article removed from archive");
      fetchArticles(); // Refresh the list
    } catch (err) {
      toast.error("Delete failed");
    }
  }
};

  return (
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 mb-12">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl italic text-white">The Journal</h1>
          <p className="text-stone-500 text-[9px] sm:text-[10px] uppercase tracking-[0.2em] mt-2">Editorial Management</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="w-full sm:w-auto bg-[#C5A059] text-black px-8 py-4 flex items-center justify-center gap-3 font-bold uppercase tracking-widest text-[10px] hover:bg-white transition-all"
        >
          <Plus size={16} /> Compose Article
        </button>
      </div>

      <div className="space-y-4">
        {articles.map((article) => (
          <div key={article._id} className="bg-[#0D0D0D] border border-white/5 p-4 flex flex-col sm:flex-row gap-4 sm:gap-6 items-start sm:items-center group hover:border-white/20 transition-all">
            {/* Image Box - Full width on mobile */}
            <div className="relative w-full sm:w-32 h-48 sm:h-20 bg-black flex-shrink-0 overflow-hidden">
              {article.mainImage ? (
                <img src={urlFor(article.mainImage).url()} className="object-cover w-full h-full grayscale group-hover:grayscale-0 transition-all duration-500" />
              ) : (
                <div className="w-full h-full flex items-center justify-center"><BookOpen className="text-stone-800" /></div>
              )}
            </div>
            
            <div className="flex-1 w-full">
              <div className="flex items-center gap-3 mb-1">
                <span className="text-[9px] text-[#C5A059] font-bold uppercase tracking-tighter flex items-center gap-1">
                  <Calendar size={10} /> {new Date(article.publishedAt).toLocaleDateString()}
                </span>
              </div>
              <h3 className="text-white font-serif text-lg sm:text-xl">{article.title}</h3>
              <p className="text-stone-500 text-[11px] line-clamp-2 italic mt-1">{article.excerpt}</p>
            </div>

            {/* Action Buttons - Pushed to bottom on mobile */}
            <div className="flex w-full sm:w-auto border-t sm:border-t-0 border-white/5 pt-4 sm:pt-0 gap-2 justify-end">
              <button 
                onClick={() => setSelectedArticle(article)}
                className="flex-1 sm:flex-none p-3 bg-white/5 sm:bg-transparent text-stone-500 hover:text-[#C5A059] flex justify-center transition-all"
              >
                <Edit3 size={18} />
              </button>
              <button 
                onClick={() => handleDelete(article._id)}
                className="flex-1 sm:flex-none p-3 bg-white/5 sm:bg-transparent text-stone-500 hover:text-red-500 flex justify-center transition-colors"
                >
                <Trash2 size={18} />
             </button>
            </div>
          </div>
        ))}
      </div>

      {selectedArticle && (
        <UpdateJournalModal 
          isOpen={!!selectedArticle}
          article={selectedArticle}
          onClose={() => setSelectedArticle(null)}
          onRefresh={fetchArticles}
        />
      )}

      <CreateJournalModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onRefresh={fetchArticles} 
      />
    </div>
  );
}