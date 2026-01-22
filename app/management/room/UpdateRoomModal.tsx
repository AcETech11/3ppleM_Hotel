"use client";
import { useState } from "react";
import { client } from "@/lib/sanity/client";
import { urlFor } from "@/lib/sanity/image";
import { toast } from "react-hot-toast";
import { X, Save, Upload, Loader2, ExternalLink, ImageIcon } from "lucide-react";
// 1. IMPORT YOUR NEW SERVER ACTION
import { manageRoomAction } from "@/app/actions/room";

export function UpdateRoomModal({ room, onClose, onRefresh }: any) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: room.title,
    price: room.price,
    isAvailable: room.isAvailable ?? true,
    tags: room.tags?.join(", ") || "",
    details: room.details?.[0]?.children?.[0]?.text || "" 
  });

  const [newImages, setNewImages] = useState<{ [key: number]: File }>({});

  const handleImageChange = (index: number, file: File) => {
    setNewImages((prev) => ({ ...prev, [index]: file }));
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // FIX 1: Initialize currentGallery clearly
      let currentGallery = room.gallery ? [...room.gallery] : [];

      // FIX 2: Upload logic for new images
      const uploadPromises = Object.entries(newImages).map(async ([index, file]) => {
        const idx = parseInt(index);
        const asset = await client.assets.upload("image", file);
        
        currentGallery[idx] = {
          // Ensure every image has a unique key for Sanity's array reconciliation
          _key: currentGallery[idx]?._key || Math.random().toString(36).substring(2, 11),
          _type: "image",
          asset: { _ref: asset._id, _type: "reference" },
        };
      });

      await Promise.all(uploadPromises);

      // FIX 3: Type-safe tag processing
      const tagsArray = formData.tags
        .split(",")
        .map((tag: string) => tag.trim())
        .filter((tag: string) => tag !== "");

      // 4. Format Rich Text Description with REQUIRED UNIQUE KEYS
      // This removes the "Missing keys" error in Sanity Studio
      const descriptionBlocks = [{
        _key: Math.random().toString(36).substring(2, 11), // Unique key for the block
        _type: 'block',
        children: [{ 
          _key: Math.random().toString(36).substring(2, 11), // Unique key for the span
          _type: 'span', 
          text: formData.details,
          marks: [] 
        }],
        style: 'normal',
        markDefs: []
      }];

      const result = await manageRoomAction(room._id, {
        title: formData.title,
        price: Number(formData.price),
        isAvailable: formData.isAvailable,
        gallery: currentGallery,
        tags: tagsArray,
        details: descriptionBlocks
      });

      if (result.success) {
        toast.success("Suite Registry Updated");
        onRefresh(); 
        onClose();
      }
    } catch (err) {
      console.error("Update Registry Error:", err);
      toast.error("Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/98 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-[#050505] border border-white/10 w-full max-w-5xl p-10 my-auto shadow-2xl">
        
        <div className="flex justify-between items-start mb-10">
          <div>
            <h2 className="font-serif text-3xl italic text-white mb-2">Modify Suite Registry</h2>
            <p className="text-[10px] text-stone-500 uppercase tracking-[0.3em]">ID: {room._id}</p>
          </div>
          <button onClick={onClose} className="text-stone-500 hover:text-white transition-colors"><X size={28}/></button>
        </div>

        <form onSubmit={handleUpdate} className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          <div className="lg:col-span-4 space-y-8">
            <div className="space-y-6">
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-[#C5A059] block mb-3 font-bold">Suite Title</label>
                  <input 
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full bg-white/5 border border-white/5 p-4 text-white outline-none focus:border-[#C5A059] transition-all font-serif italic text-lg" 
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-widest text-[#C5A059] block mb-3 font-bold">Price per Night (₦)</label>
                  <input 
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    className="w-full bg-white/5 border border-white/5 p-4 text-white outline-none focus:border-[#C5A059] transition-all font-mono" 
                  />
                </div>

                {/* QUICK TAGS INPUT */}
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-[#C5A059] font-bold">Quick Tags (Comma Separated)</label>
                    <input 
                      value={formData.tags}
                      onChange={(e) => setFormData({...formData, tags: e.target.value})}
                      placeholder="e.g. WiFi, King Bed, City View"
                      className="w-full bg-white/5 border border-white/10 p-4 text-white outline-none focus:border-[#C5A059] font-mono text-xs" 
                    />
                    <p className="text-[9px] text-stone-500 italic">These will appear as pills on the room card.</p>
                  </div>

                  {/* ENHANCED DESCRIPTION */}
                  <div className="space-y-2 pt-4">
                    <label className="text-[10px] uppercase tracking-widest text-[#C5A059] font-bold block">Room Narrative</label>
                    <div className="bg-white/5 border border-white/10 p-2 flex gap-2 mb-1">
                      {/* Visual hint for the user that rich formatting is handled by Sanity */}
                      <span className="text-[9px] text-stone-600 uppercase font-bold px-2 border-r border-white/10">Rich Text Enabled</span>
                    </div>
                    <textarea 
                      value={formData.details}
                      onChange={(e) => setFormData({...formData, details: e.target.value})}
                      rows={6}
                      className="w-full bg-transparent border border-white/5 p-4 text-white outline-none focus:border-[#C5A059] resize-none text-sm leading-relaxed font-light"
                      placeholder="Describe the suite's ambiance..."
                    />
                  </div>

                <div className="flex items-center gap-4 bg-[#C5A059]/5 p-4 border border-[#C5A059]/20">
                  <input 
                    type="checkbox" 
                    checked={formData.isAvailable}
                    onChange={(e) => setFormData({...formData, isAvailable: e.target.checked})}
                    className="w-5 h-5 accent-[#C5A059] cursor-pointer" 
                  />
                  <span className="text-[10px] text-white uppercase tracking-widest font-bold">Live on Frontend</span>
                </div>
            </div>

            <div className="pt-6 border-t border-white/5">
                <label className="text-[10px] uppercase tracking-widest text-stone-500 block mb-4 font-bold">Video Asset</label>
                <a 
                  href={`/admin/structure/room;${room._id}`} 
                  target="_blank"
                  className="flex items-center justify-between p-4 bg-white/5 border border-white/10 hover:bg-white/10 transition-all group"
                >
                  <span className="text-[10px] text-stone-300 uppercase tracking-widest">Manage Video in Studio</span>
                  <ExternalLink size={14} className="text-[#C5A059] group-hover:translate-x-1 transition-transform" />
                </a>
            </div>
          </div>

          <div className="lg:col-span-8 space-y-6">
            <label className="text-[10px] uppercase tracking-widest text-stone-500 block font-bold">
              Gallery Management <span className="text-[#C5A059] ml-2">(Click to replace)</span>
            </label>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[0, 1, 2, 3, 4].map((index) => (
                <div key={index} className="relative aspect-square bg-white/5 border border-white/5 group overflow-hidden">
                  {newImages[index] ? (
                    <img src={URL.createObjectURL(newImages[index])} className="object-cover w-full h-full opacity-50" />
                  ) : room.gallery?.[index] ? (
                    <img src={urlFor(room.gallery[index]).width(400).url()} className="object-cover w-full h-full" />
                  ) : (
                    <div className="flex items-center justify-center h-full text-stone-800"><ImageIcon size={40}/></div>
                  )}
                  
                  <label className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <Upload size={20} className="text-[#C5A059] mb-1" />
                    <span className="text-[8px] uppercase tracking-widest text-white">Replace Image {index + 1}</span>
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="image/*" 
                      onChange={(e) => e.target.files?.[0] && handleImageChange(index, e.target.files[0])}
                    />
                  </label>

                  {newImages[index] && (
                    <div className="absolute top-2 right-2 bg-[#C5A059] text-black text-[8px] px-2 py-1 font-bold rounded-full animate-pulse">PENDING</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-12 pt-10 border-t border-white/5">
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-[#C5A059] text-black font-bold py-6 uppercase tracking-[0.4em] text-[12px] flex items-center justify-center gap-4 hover:bg-white transition-all disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
              {loading ? "Processing Assets..." : "Commit Changes to Registry"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}