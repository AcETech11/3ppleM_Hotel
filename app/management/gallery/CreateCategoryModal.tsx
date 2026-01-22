"use client";
import { useState } from "react";
import { manageGalleryAction } from "@/app/actions/gallery";
import { X, Save } from "lucide-react";
import { toast } from "react-hot-toast";

export function CreateCategoryModal({ isOpen, onClose, onRefresh }: any) {
  const [title, setTitle] = useState("");

  if (!isOpen) return null;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const slug = title.toLowerCase().replace(/\s+/g, '-');
    const result = await manageGalleryAction('category', { title, slug: { current: slug } });
    if (result.success) {
      toast.success("New Department Created");
      setTitle(""); onRefresh(); onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/90 p-4">
      <div className="bg-[#0D0D0D] border border-white/10 w-full max-w-sm p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-serif text-xl text-white">Create Category</h2>
          <button onClick={onClose} className="text-stone-500 hover:text-white"><X /></button>
        </div>
        <form onSubmit={onSubmit} className="space-y-6">
          <input 
            placeholder="Category Name (e.g., Interior)"
            className="w-full bg-black border border-white/10 p-4 text-white outline-none focus:border-[#C5A059]"
            value={title} onChange={(e) => setTitle(e.target.value)} required
          />
          <button className="w-full bg-[#C5A059] text-black font-bold py-4 uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-2">
            <Save size={14} /> Establish Category
          </button>
        </form>
      </div>
    </div>
  );
}