"use client";
import { useState, useEffect } from "react";
import { client } from "@/lib/sanity/client";
import { manageGalleryAction } from "@/app/actions/gallery";
import { X, Loader2, Upload, Trash2, Type, AlignLeft } from "lucide-react";
import { toast } from "react-hot-toast";
import { urlFor } from "@/lib/sanity/image";

export function UpdateCollectionModal({ isOpen, collection, onClose, onRefresh }: any) {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(collection.name);
  const [existingImages, setExistingImages] = useState<any[]>(collection.images || []);
  const [newImages, setNewImages] = useState<any[]>([]);

  // Reset state when a new collection is selected
  useEffect(() => {
    setName(collection.name);
    setExistingImages(collection.images || []);
    setNewImages([]);
  }, [collection]);

  const handleNewFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const items = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      alt: "",
      caption: ""
    }));
    setNewImages([...newImages, ...items]);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Upload new assets first
      const uploadedNew = await Promise.all(
        newImages.map(async (item) => {
          const asset = await client.assets.upload("image", item.file);
          return {
            _key: Math.random().toString(36).substring(2, 11),
            _type: "image",
            asset: { _ref: asset._id, _type: "reference" },
            alt: item.alt,
            caption: item.caption
          };
        })
      );

      // 2. Combine with existing (modified) images
      const finalGallery = [...existingImages, ...uploadedNew];

      const result = await manageGalleryAction('gallery', {
        name,
        images: finalGallery
      }, collection._id);

      if (result.success) {
        toast.success("Gallery Registry Updated");
        onRefresh();
        onClose();
      }
    } catch (err) {
      toast.error("Update failed");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-[#050505] border border-white/10 w-full max-w-4xl p-10 my-auto shadow-2xl">
        <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-6">
          <h2 className="font-serif text-3xl italic text-white">Modify Archive: {collection.name}</h2>
          <button onClick={onClose} className="text-stone-500 hover:text-white transition-colors"><X size={24}/></button>
        </div>

        <form onSubmit={handleUpdate} className="space-y-8">
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-[#C5A059] font-bold">Collection Title</label>
            <input 
              className="w-full bg-white/5 border border-white/10 p-4 text-white outline-none focus:border-[#C5A059]"
              value={name} onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[450px] overflow-y-auto pr-4 custom-scrollbar">
            {/* RENDER EXISTING IMAGES */}
            {existingImages.map((img, idx) => (
              <div key={img._key} className="flex gap-4 p-4 bg-white/5 border border-white/5 relative group">
                <div className="relative w-24 h-24 flex-shrink-0">
                  <img src={urlFor(img).url()} className="object-cover h-full w-full" alt="sanity" />
                </div>
                <div className="flex-1 space-y-2">
                  <input 
                    placeholder="Alt Text"
                    className="w-full bg-black/40 text-[10px] p-2 text-white outline-none border border-transparent focus:border-[#C5A059]"
                    value={img.alt || ""} 
                    onChange={(e) => {
                      const updated = [...existingImages];
                      updated[idx].alt = e.target.value;
                      setExistingImages(updated);
                    }}
                  />
                  <input 
                    placeholder="Caption"
                    className="w-full bg-black/40 text-[10px] p-2 text-white outline-none border border-transparent focus:border-[#C5A059]"
                    value={img.caption || ""} 
                    onChange={(e) => {
                      const updated = [...existingImages];
                      updated[idx].caption = e.target.value;
                      setExistingImages(updated);
                    }}
                  />
                </div>
                <button 
                  type="button"
                  onClick={() => setExistingImages(existingImages.filter((_, i) => i !== idx))}
                  className="absolute top-2 right-2 text-red-900 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}

            {/* ADD NEW IMAGES ZONE */}
            <label className="border-2 border-dashed border-white/10 h-32 flex flex-col items-center justify-center cursor-pointer hover:border-[#C5A059] transition-all bg-white/[0.02]">
              <Upload size={24} className="text-stone-600 mb-2" />
              <span className="text-[10px] uppercase text-stone-500 font-bold">Append New Assets</span>
              <input type="file" multiple className="hidden" onChange={handleNewFileSelect} />
            </label>
          </div>

          <button disabled={loading} className="w-full bg-[#C5A059] text-black font-bold py-5 uppercase tracking-[0.3em] text-[11px] flex items-center justify-center gap-2">
            {loading ? <Loader2 className="animate-spin" /> : "Synchronize Gallery Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}