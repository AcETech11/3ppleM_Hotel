"use client";
import React, { useState, useEffect } from "react";
import { client } from "@/lib/sanity/client";
import { Plus, Folder, Image as ImageIcon, ArrowLeft, ChevronRight, Loader2, FolderPlus, Trash2 } from "lucide-react";
import { CreateCategoryModal } from "./CreateCategoryModal";
import { GalleryDetailView } from "./GalleryDetailView"; // Component for specific category

export default function GalleryPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);

  const fetchCategories = async () => {
    setLoading(true);
    const data = await client.fetch(`*[_type == "category"]{..., "count": count(*[_type == "gallery" && references(^._id)])}`);
    setCategories(data);
    setLoading(false);
  };

  useEffect(() => { fetchCategories(); }, []);

  if (selectedCategory) {
    return <GalleryDetailView category={selectedCategory} onBack={() => { setSelectedCategory(null); fetchCategories(); }} />;
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-12">
        <div>
          <h1 className="font-serif text-4xl italic text-white">Media Library</h1>
          <p className="text-stone-500 text-[10px] uppercase tracking-widest mt-2">Organize by Department</p>
        </div>
        <button 
          onClick={() => setIsCatModalOpen(true)}
          className="border border-white/10 text-white px-6 py-3 flex items-center gap-2 font-bold uppercase tracking-widest text-[10px] hover:bg-white hover:text-black transition-all"
        >
          <FolderPlus size={16} /> New Category
        </button>
      </div>

      {loading ? (
        <div className="h-64 flex items-center justify-center"><Loader2 className="animate-spin text-[#C5A059]" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <div 
              key={cat._id}
              onClick={() => setSelectedCategory(cat)}
              className="group cursor-pointer bg-[#0D0D0D] border border-white/5 p-8 hover:border-[#C5A059]/50 transition-all relative overflow-hidden"
            >
              <Folder className="text-[#C5A059] mb-4 group-hover:scale-110 transition-transform" size={32} />
              <h3 className="text-white font-serif text-xl italic">{cat.title}</h3>
              <p className="text-stone-500 text-[9px] uppercase tracking-widest mt-1">{cat.count} Collections</p>
              <ChevronRight className="absolute bottom-8 right-8 text-stone-700 group-hover:text-[#C5A059] transition-colors" size={16} />
            </div>
          ))}
        </div>
      )}

      <CreateCategoryModal 
        isOpen={isCatModalOpen} 
        onClose={() => setIsCatModalOpen(false)} 
        onRefresh={fetchCategories} 
      />
    </div>
  );
}