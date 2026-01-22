"use client";
import { useState } from "react";
import { client } from "@/lib/sanity/client";
import { manageGalleryAction } from "@/app/actions/gallery";
import { X, Loader2, Upload, PlusCircle } from "lucide-react";
import { toast } from "react-hot-toast";

export function CreateGalleryModal({ isOpen, categories, onClose, onRefresh }: any) {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [selectedImages, setSelectedImages] = useState<File[]>([]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryId || selectedImages.length === 0) return toast.error("Missing Category or Images");

    setLoading(true);
    try {
      // 1. Upload Images
      const uploadedImages = await Promise.all(
        selectedImages.map(async (file) => {
          const asset = await client.assets.upload("image", file);
          return {
            _key: Math.random().toString(36).substring(2, 11),
            _type: "image",
            asset: { _ref: asset._id, _type: "reference" },
            alt: name // Use gallery name as default alt
          };
        })
      );

      // 2. Save Gallery
      const result = await manageGalleryAction('gallery', {
        name,
        category: { _type: 'reference', _ref: categoryId },
        images: uploadedImages
      });

      if (result.success) {
        toast.success("Gallery Archive Updated");
        onRefresh(); onClose();
      }
    } catch (err) {
      toast.error("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-md p-4">
      <div className="bg-[#050505] border border-white/10 w-full max-w-xl p-10 shadow-2xl">
        <div className="flex justify-between items-center mb-8">
          <h2 className="font-serif text-3xl italic text-white">New Collection</h2>
          <button onClick={onClose} className="text-stone-500 hover:text-white"><X /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input 
            placeholder="Collection Name (e.g. Summer Poolside)"
            className="w-full bg-white/5 border border-white/10 p-4 text-white outline-none focus:border-[#C5A059]"
            value={name} onChange={(e) => setName(e.target.value)}
            required
          />

          <select 
            className="w-full bg-white/5 border border-white/10 p-4 text-white outline-none focus:border-[#C5A059] appearance-none"
            value={categoryId} onChange={(e) => setCategoryId(e.target.value)}
            required
          >
            <option value="">Select Category</option>
            {categories.map((cat: any) => (
              <option key={cat._id} value={cat._id} className="bg-black">{cat.title}</option>
            ))}
          </select>

          <div className="border-2 border-dashed border-white/10 p-10 text-center relative hover:border-[#C5A059] transition-all">
            <Upload className="mx-auto text-stone-500 mb-2" />
            <p className="text-[10px] uppercase tracking-widest text-stone-400">
              {selectedImages.length > 0 ? `${selectedImages.length} Files Selected` : "Drop Gallery Images"}
            </p>
            <input 
              type="file" multiple className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={(e) => setSelectedImages(Array.from(e.target.files || []))}
            />
          </div>

          <button disabled={loading} className="w-full bg-[#C5A059] text-black font-bold py-5 uppercase tracking-[0.3em] text-[11px] flex items-center justify-center gap-2">
            {loading ? <Loader2 className="animate-spin" /> : "Publish to Archive"}
          </button>
        </form>
      </div>
    </div>
  );
}