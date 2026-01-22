"use client";
import { useState } from "react";
import { client } from "@/lib/sanity/client";
import { manageGalleryAction } from "@/app/actions/gallery";
import { X, Loader2, Upload, Type, AlignLeft } from "lucide-react";
import { toast } from "react-hot-toast";
import Image from "next/image";

export function CreateCollectionModal({ isOpen, category, onClose, onRefresh }: any) {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [stagedImages, setStagedImages] = useState<any[]>([]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newItems = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      alt: "",
      caption: ""
    }));
    setStagedImages([...stagedImages, ...newItems]);
  };

  const updateSEO = (index: number, field: 'alt' | 'caption', value: string) => {
    const updated = [...stagedImages];
    updated[index][field] = value;
    setStagedImages(updated);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (stagedImages.length === 0) return toast.error("Select images first");
    
    setLoading(true);
    try {
      const uploadedImages = await Promise.all(
        stagedImages.map(async (item) => {
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

      await manageGalleryAction('gallery', {
        name,
        category: { _type: 'reference', _ref: category._id },
        images: uploadedImages
      });

      toast.success("Collection Published");
      onRefresh();
      onClose();
    } catch (error) {
      toast.error("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/95 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-[#050505] border border-white/10 w-full max-w-4xl p-8 my-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="font-serif text-2xl italic text-white">New {category.title} Collection</h2>
            <p className="text-[10px] text-stone-500 uppercase tracking-widest mt-1">Add assets and SEO metadata</p>
          </div>
          <button onClick={onClose} className="text-stone-500 hover:text-white"><X /></button>
        </div>

        <form onSubmit={onSubmit} className="space-y-8">
          <input 
            placeholder="Collection Title (e.g., Rooftop Sunset)"
            className="w-full bg-white/5 border border-white/10 p-4 text-white outline-none focus:border-[#C5A059]"
            value={name} onChange={(e) => setName(e.target.value)} required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {stagedImages.map((item, idx) => (
              <div key={idx} className="flex gap-4 p-4 bg-white/5 border border-white/5 items-center">
                <div className="relative w-24 h-24 flex-shrink-0 bg-black">
                  <Image src={item.preview} alt="preview" fill className="object-cover" />
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2 bg-black/40 p-2">
                    <Type size={12} className="text-[#C5A059]" />
                    <input 
                      placeholder="Alt Text (SEO)"
                      className="bg-transparent text-[10px] text-white outline-none w-full"
                      value={item.alt} onChange={(e) => updateSEO(idx, 'alt', e.target.value)}
                    />
                  </div>
                  <div className="flex items-center gap-2 bg-black/40 p-2">
                    <AlignLeft size={12} className="text-[#C5A059]" />
                    <input 
                      placeholder="Caption"
                      className="bg-transparent text-[10px] text-white outline-none w-full"
                      value={item.caption} onChange={(e) => updateSEO(idx, 'caption', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ))}

            <label className="border-2 border-dashed border-white/10 h-32 flex flex-col items-center justify-center cursor-pointer hover:border-[#C5A059] transition-all">
              <Upload size={20} className="text-stone-600 mb-2" />
              <span className="text-[10px] uppercase text-stone-500">Add Photos</span>
              <input type="file" multiple className="hidden" onChange={handleFileSelect} />
            </label>
          </div>

          <button disabled={loading} className="w-full bg-[#C5A059] text-black font-bold py-5 uppercase tracking-[0.3em] text-[11px] flex items-center justify-center gap-2 disabled:opacity-50">
            {loading ? <Loader2 className="animate-spin" /> : "Authorize & Upload Collection"}
          </button>
        </form>
      </div>
    </div>
  );
}