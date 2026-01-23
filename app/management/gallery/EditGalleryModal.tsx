"use client";
import { useState, useRef } from "react";
import { manageGalleryAction } from "@/app/actions/gallery";
import { writeClient } from "@/lib/sanity/client"; // Use writeClient for uploading
import { toast } from "react-hot-toast";
import { X, Loader2, Upload, ImageIcon } from "lucide-react";
import Image from "next/image";
import { urlFor } from "@/lib/sanity/image";

export function EditGalleryModal({ item, onClose, onRefresh }: any) {
  const [loading, setLoading] = useState(false);
  const [newFile, setNewFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: item.title || "",
    alt: item.image?.alt || "",
    caption: item.image?.caption || "",
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageAsset = item.image; // Start with existing image data

      // If a new file was selected, upload it first
      if (newFile) {
        toast.loading("Uploading new image...", { id: "upload" });
        const asset = await writeClient.assets.upload("image", newFile);
        imageAsset = {
          _type: "image",
          asset: { _ref: asset._id, _type: "reference" },
          alt: formData.alt,
          caption: formData.caption,
        };
        toast.success("New image uploaded", { id: "upload" });
      } else {
        // Just update metadata on existing image
        imageAsset = {
          ...item.image,
          alt: formData.alt,
          caption: formData.caption,
        };
      }

      const updateData = {
        title: formData.title,
        image: imageAsset,
      };

      const result = await manageGalleryAction("gallery", updateData, item._id);

      if (result.success) {
        toast.success("Asset Updated Successfully");
        onRefresh();
        onClose();
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
      <div className="bg-[#111] border border-white/10 w-full max-w-2xl p-8 relative max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 text-stone-500 hover:text-white">
          <X size={20} />
        </button>

        <h2 className="font-serif text-2xl text-white italic mb-6">Edit Gallery Asset</h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Side: Image Preview & Upload */}
          <div className="space-y-4">
            <label className="block text-[10px] uppercase tracking-[0.2em] text-stone-500">Current / New Image</label>
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="relative aspect-square bg-white/5 border border-dashed border-white/10 flex items-center justify-center cursor-pointer group overflow-hidden"
            >
              {previewUrl || item.image ? (
                <>
                  <Image 
                    src={previewUrl || urlFor(item.image).url()} 
                    alt="Preview" 
                    fill 
                    className="object-cover opacity-50 group-hover:opacity-30 transition-opacity" 
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Upload className="text-white mb-2" />
                    <span className="text-[8px] text-white uppercase font-bold tracking-widest">Replace Image</span>
                  </div>
                </>
              ) : (
                <ImageIcon className="text-stone-700" size={40} />
              )}
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              className="hidden" 
              accept="image/*" 
            />
            {newFile && <p className="text-[#C5A059] text-[10px] italic">New file selected: {newFile.name}</p>}
          </div>

          {/* Right Side: Metadata */}
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] uppercase tracking-[0.2em] text-stone-500 mb-2">Internal Title</label>
              <input 
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full bg-white/5 border border-white/10 px-4 py-3 text-white focus:border-[#C5A059] outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-[0.2em] text-stone-500 mb-2">Alt Text (SEO)</label>
              <input 
                value={formData.alt}
                onChange={(e) => setFormData({...formData, alt: e.target.value})}
                className="w-full bg-white/5 border border-white/10 px-4 py-3 text-white focus:border-[#C5A059] outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-[0.2em] text-stone-500 mb-2">Display Caption</label>
              <textarea 
                rows={4}
                value={formData.caption}
                onChange={(e) => setFormData({...formData, caption: e.target.value})}
                className="w-full bg-white/5 border border-white/10 px-4 py-3 text-white focus:border-[#C5A059] outline-none transition-all resize-none"
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-[#C5A059] text-black font-bold uppercase tracking-widest text-[10px] py-4 hover:bg-white transition-all disabled:opacity-50 flex items-center justify-center"
            >
              {loading ? <Loader2 className="animate-spin" size={16} /> : "Update Asset"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}