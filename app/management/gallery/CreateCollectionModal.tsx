"use client";
import { useState, useRef } from "react";
import { client } from "@/lib/sanity/client";
import { manageGalleryAction } from "@/app/actions/gallery";
import { X, Loader2, Upload, Type, AlignLeft, Trash2, Image as ImageIcon } from "lucide-react";
import { toast } from "react-hot-toast";
import Image from "next/image";

export function CreateCollectionModal({ isOpen, category, onClose, onRefresh }: any) {
  const [loading, setLoading] = useState(false);
  const [stagedImages, setStagedImages] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newItems = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      title: file.name.split('.')[0].replace(/[-_]/g, ' '), // Clean up filename for default title
      alt: "",
      caption: ""
    }));
    setStagedImages(prev => [...prev, ...newItems]);
  };

  const removeItem = (index: number) => {
    setStagedImages(prev => prev.filter((_, i) => i !== index));
  };

  const updateMetadata = (index: number, field: string, value: string) => {
    setStagedImages(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (stagedImages.length === 0) return toast.error("Please select at least one image");
    
    // Validate Alt text as you marked it 'required' in the UI
    const missingAlt = stagedImages.some(img => !img.alt.trim());
    if (missingAlt) return toast.error("All images require Alt Text for SEO");

    setLoading(true);
    const toastId = toast.loading(`Uploading 0/${stagedImages.length} images...`);

    try {
      let completed = 0;
      
      await Promise.all(
        stagedImages.map(async (item) => {
          const asset = await client.assets.upload("image", item.file);
          const result = await manageGalleryAction('gallery', {
            title: item.title,
            category: { _type: 'reference', _ref: category._id },
            image: {
              _type: 'image',
              asset: { _ref: asset._id, _type: "reference" },
              alt: item.alt,
              caption: item.caption
            }
          });
          
          completed++;
          toast.loading(`Uploading ${completed}/${stagedImages.length} images...`, { id: toastId });
          return result;
        })
      );

      toast.success(`${stagedImages.length} Assets Published to ${category.title}`, { id: toastId });
      onRefresh();
      onClose();
      setStagedImages([]);
    } catch (error) {
      toast.error("Upload failed. Please check connection.", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/95 backdrop-blur-xl p-4 md:p-8">
      <div className="bg-[#0A0A0A] border border-white/10 w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl">
        
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-black">
          <div>
            <h2 className="font-serif text-2xl italic text-white flex items-center gap-3">
              <ImageIcon className="text-[#C5A059]" size={20} />
              Library Intake: {category.title}
            </h2>
            <p className="text-[10px] text-stone-500 uppercase tracking-widest mt-1">
              Configure metadata for SEO and guest experience
            </p>
          </div>
          <button onClick={onClose} className="p-2 text-stone-500 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Scrollable Body */}
        <form onSubmit={onSubmit} className="flex-1 overflow-hidden flex flex-col">
          <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar bg-[#050505]">
            {stagedImages.length === 0 ? (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="h-64 border-2 border-dashed border-white/5 flex flex-col items-center justify-center cursor-pointer hover:bg-white/[0.02] transition-all group"
              >
                <Upload size={32} className="text-stone-700 group-hover:text-[#C5A059] mb-4 transition-colors" />
                <p className="text-[11px] uppercase tracking-[0.2em] text-stone-500">Click to browse or drag photos here</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {stagedImages.map((item, idx) => (
                  <div key={idx} className="flex flex-col md:flex-row gap-6 p-5 bg-white/[0.03] border border-white/5 rounded-sm relative group">
                    <button 
                      type="button"
                      onClick={() => removeItem(idx)}
                      className="absolute top-2 right-2 p-2 text-stone-600 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>

                    {/* Preview */}
                    <div className="relative w-full md:w-32 h-32 flex-shrink-0 bg-black rounded-sm overflow-hidden border border-white/10">
                      <Image src={item.preview} alt="preview" fill className="object-cover" />
                    </div>

                    {/* Inputs */}
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-4">
                        <div>
                          <label className="text-[9px] uppercase text-[#C5A059] mb-1 block font-bold">Image Title</label>
                          <input 
                            placeholder="e.g., Ocean Front Suite"
                            className="w-full bg-black border border-white/10 p-3 text-xs text-white outline-none focus:border-[#C5A059] transition-all"
                            value={item.title} 
                            onChange={(e) => updateMetadata(idx, 'title', e.target.value)} 
                            required
                          />
                        </div>
                        <div>
                          <label className="text-[9px] uppercase text-[#C5A059] mb-1 block font-bold">Alt Text (SEO)</label>
                          <div className="flex items-center gap-2 bg-black p-3 border border-white/10 focus-within:border-[#C5A059] transition-all">
                            <Type size={14} className="text-stone-600" />
                            <input 
                              placeholder="Describe for search engines..."
                              className="bg-transparent text-xs text-white outline-none w-full"
                              value={item.alt} 
                              onChange={(e) => updateMetadata(idx, 'alt', e.target.value)} 
                              required
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col">
                        <label className="text-[9px] uppercase text-[#C5A059] mb-1 block font-bold">Public Caption</label>
                        <div className="flex-1 flex items-start gap-2 bg-black p-3 border border-white/10 focus-within:border-[#C5A059] transition-all">
                          <AlignLeft size={14} className="text-stone-600 mt-1" />
                          <textarea 
                            placeholder="Guest-facing description..."
                            className="bg-transparent text-xs text-white outline-none w-full h-full min-h-[80px] resize-none"
                            value={item.caption} 
                            onChange={(e) => updateMetadata(idx, 'caption', e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Add more button */}
                <button 
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="py-6 border border-dashed border-white/10 text-stone-500 hover:text-white hover:border-white/30 text-[10px] uppercase tracking-widest transition-all"
                >
                  + Append more photos to this batch
                </button>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="p-6 bg-black border-t border-white/10">
            <input 
              type="file" 
              multiple 
              ref={fileInputRef}
              className="hidden" 
              onChange={handleFileSelect} 
              accept="image/*"
            />
            
            <div className="flex flex-col md:flex-row gap-4">
              <button 
                type="button"
                onClick={onClose}
                className="flex-1 px-8 py-4 border border-white/10 text-white text-[10px] uppercase tracking-[0.2em] hover:bg-white/5 transition-all"
              >
                Cancel
              </button>
              <button 
                disabled={loading || stagedImages.length === 0} 
                className="flex-[2] bg-[#C5A059] text-black font-bold py-4 uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-3 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white transition-all shadow-xl"
              >
                {loading ? (
                  <><Loader2 className="animate-spin" size={16} /> Processing Assets...</>
                ) : (
                  `Publish ${stagedImages.length} Images to Library`
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}