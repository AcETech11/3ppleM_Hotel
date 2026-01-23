"use client";
import { useState, useEffect } from "react";
import { client } from "@/lib/sanity/client";
import { ArrowLeft, Plus, Trash2, Loader2, ImageIcon, Edit3, MoreVertical } from "lucide-react";
import { CreateCollectionModal } from "./CreateCollectionModal";
import { EditGalleryModal } from "./EditGalleryModal"; 
import { urlFor } from "@/lib/sanity/image";
import { deleteGalleryItem } from "@/app/actions/gallery";
import { toast } from "react-hot-toast";
import Image from "next/image";

export function GalleryDetailView({ category, onBack }: any) {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const query = `*[_type == "gallery" && category._ref == $id] | order(_createdAt desc) {
        _id,
        title,
        image { asset->, alt, caption }
      }`;
      const data = await client.fetch(query, { id: category._id });
      setItems(data);
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Failed to sync media library");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchItems(); }, [category._id]);

  const handleDelete = async (id: string) => {
    if (window.confirm("Permanently remove this image?")) {
      const result = await deleteGalleryItem(id);
      if (result.success) {
        toast.success("Asset Deleted");
        fetchItems();
      }
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500 pb-20">
      {/* Top Navigation Bar - Sticky for easier access on mobile */}
      <div className="sticky top-0 z-20 bg-[#0D0D0D]/80 backdrop-blur-md py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5">
        <button 
          onClick={onBack} 
          className="flex items-center gap-2 text-stone-400 hover:text-white transition-all uppercase text-[10px] tracking-widest font-bold"
        >
          <ArrowLeft size={14} /> Back to Departments
        </button>
        
        <button 
          onClick={() => setIsCreateModalOpen(true)}
          className="w-full sm:w-auto bg-[#C5A059] text-black px-5 py-3 flex items-center justify-center gap-2 font-bold uppercase tracking-widest text-[10px] active:scale-95 transition-all"
        >
          <Plus size={16} /> Add to {category.title}
        </button>
      </div>

      {loading ? (
        <div className="h-64 flex flex-col items-center justify-center gap-3">
          <Loader2 className="animate-spin text-[#C5A059]" />
          <span className="text-[10px] text-stone-500 uppercase tracking-widest">Syncing content lake...</span>
        </div>
      ) : (
        <>
          {items.length === 0 ? (
            <div className="h-64 border border-dashed border-white/10 flex flex-col items-center justify-center text-stone-600 rounded-lg">
              <ImageIcon size={40} strokeWidth={1} className="mb-3 opacity-20" />
              <p className="text-[10px] uppercase tracking-[0.2em]">Empty Category</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {items.map((item) => (
                <div key={item._id} className="flex flex-col bg-[#141414] border border-white/5 rounded-sm overflow-hidden shadow-2xl">
                  
                  {/* Image Container - Fixed Aspect Ratio */}
                  <div className="relative aspect-square w-full bg-stone-900">
                    {item.image?.asset ? (
                      <Image 
                        src={urlFor(item.image).width(400).url()} 
                        alt={item.image.alt || ""} 
                        fill 
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-stone-800">
                        <ImageIcon size={32} />
                      </div>
                    )}
                  </div>

                  {/* Info & Action Bar - Persistent (No Hover Needed) */}
                  <div className="p-4 space-y-3">
                    <div className="min-h-[32px]">
                      <h3 className="text-white text-[11px] font-bold uppercase tracking-wider truncate">
                        {item.title || "Untitled Asset"}
                      </h3>
                      <p className="text-[#C5A059] text-[9px] uppercase tracking-tighter truncate opacity-70">
                        {item.image?.alt || "No SEO Alt Text"}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                      <button 
                        onClick={() => setEditingItem(item)} 
                        className="flex-1 flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 active:bg-white/20 text-white text-[9px] uppercase font-bold py-3 transition-colors"
                      >
                        <Edit3 size={12} className="text-[#C5A059]" /> Edit
                      </button>
                      
                      <button 
                        onClick={() => handleDelete(item._id)} 
                        className="w-12 flex items-center justify-center bg-red-500/10 hover:bg-red-500 active:bg-red-600 text-red-500 hover:text-white py-3 transition-all"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Modals */}
      <CreateCollectionModal 
        isOpen={isCreateModalOpen} 
        category={category} 
        onClose={() => setIsCreateModalOpen(false)} 
        onRefresh={fetchItems} 
      />

      {editingItem && (
        <EditGalleryModal 
          item={editingItem}
          onClose={() => setEditingItem(null)}
          onRefresh={fetchItems}
        />
      )}
    </div>
  );
}