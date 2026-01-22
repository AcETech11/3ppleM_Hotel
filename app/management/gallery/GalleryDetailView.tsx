"use client";
import { useState, useEffect } from "react";
import { client } from "@/lib/sanity/client";
import { ArrowLeft, Plus, Image as ImageIcon, Trash2, Edit3, Loader2 } from "lucide-react";
import { CreateCollectionModal } from "./CreateCollectionModal";
import { UpdateCollectionModal } from "./UpdateCollectionModal"; // Import the fix
import { urlFor } from "@/lib/sanity/image";
import { deleteGalleryItem } from "@/app/actions/gallery";
import { toast } from "react-hot-toast";

export function GalleryDetailView({ category, onBack }: any) {
  const [collections, setCollections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [collectionToEdit, setCollectionToEdit] = useState<any>(null); // State for the edit modal

  const fetchCollections = async () => {
    setLoading(true);
    try {
      const data = await client.fetch(
        `*[_type == "gallery" && category._ref == $id] | order(_createdAt desc)`, 
        { id: category._id }
      );
      setCollections(data);
    } catch (error) {
      toast.error("Failed to load collections");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCollections(); }, [category._id]);

  const handleDelete = async (id: string) => {
    if (confirm("Permanently delete this entire collection?")) {
      const result = await deleteGalleryItem(id);
      if (result.success) {
        toast.success("Collection Deleted");
        fetchCollections();
      } else {
        toast.error("Delete failed");
      }
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <button 
          onClick={onBack} 
          className="flex items-center gap-2 text-stone-500 hover:text-white transition-all uppercase text-[10px] tracking-widest font-bold group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 
          Back to Library
        </button>
        <button 
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-[#C5A059] text-black px-6 py-3 flex items-center gap-2 font-bold uppercase tracking-widest text-[10px] hover:bg-white transition-all shadow-lg"
        >
          <Plus size={16} /> Add {category.title} Set
        </button>
      </div>

      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <Loader2 className="animate-spin text-[#C5A059]" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {collections.map((set) => (
            <div key={set._id} className="bg-[#0D0D0D] border border-white/5 overflow-hidden group hover:border-[#C5A059]/30 transition-all">
              {/* Image Preview Strip */}
              <div className="grid grid-cols-3 h-48 bg-black gap-1">
                {set.images?.slice(0, 3).map((img: any, i: number) => (
                  <div key={img._key || i} className="relative h-full w-full opacity-60 group-hover:opacity-100 transition-opacity">
                    <img src={urlFor(img).url()} className="object-cover h-full w-full" alt={img.alt || "gallery"} />
                  </div>
                ))}
                {(!set.images || set.images.length === 0) && (
                  <div className="col-span-3 flex items-center justify-center text-stone-800">
                    <ImageIcon size={40} />
                  </div>
                )}
              </div>

              {/* Info & Actions Section */}
              <div className="p-6 flex justify-between items-center">
                <div>
                  <h3 className="font-serif text-xl text-white italic">{set.name}</h3>
                  <p className="text-[9px] text-stone-500 uppercase tracking-widest">{set.images?.length || 0} Assets Organized</p>
                </div>
                <div className="flex gap-1">
                  {/* EDIT BUTTON: Now triggers state */}
                  <button 
                    onClick={() => setCollectionToEdit(set)} 
                    className="p-3 text-stone-500 hover:text-[#C5A059] hover:bg-white/5 rounded-full transition-all"
                    title="Edit Collection"
                  >
                    <Edit3 size={18}/>
                  </button>
                  <button 
                    onClick={() => handleDelete(set._id)} 
                    className="p-3 text-stone-500 hover:text-red-500 hover:bg-red-500/5 rounded-full transition-all"
                    title="Delete Collection"
                  >
                    <Trash2 size={18}/>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE MODAL */}
      <CreateCollectionModal 
        isOpen={isCreateModalOpen} 
        category={category} 
        onClose={() => setIsCreateModalOpen(false)} 
        onRefresh={fetchCollections} 
      />

      {/* UPDATE MODAL: Conditional rendering is key for the fix */}
      {collectionToEdit && (
        <UpdateCollectionModal 
          isOpen={!!collectionToEdit}
          collection={collectionToEdit}
          onClose={() => setCollectionToEdit(null)}
          onRefresh={fetchCollections}
        />
      )}
    </div>
  );
}