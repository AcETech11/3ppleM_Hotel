"use client";
import { useState } from "react";
import { client } from "@/lib/sanity/client";
import { manageJournalAction } from "@/app/actions/journal";
import { X, Loader2, Upload, Save, PlusCircle, Type, Image as ImageIcon, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";

type ContentBlock = 
  | { id: string; type: "text"; value: string }
  | { id: string; type: "image"; file: File | null; preview: string; caption: string };

export function CreateJournalModal({ isOpen, onClose, onRefresh }: any) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ title: "", excerpt: "" });
  const [coverImage, setCoverImage] = useState<File | null>(null);
  
  const [blocks, setBlocks] = useState<ContentBlock[]>([
    { id: Math.random().toString(36), type: "text", value: "" }
  ]);

  const addTextBlock = () => {
    setBlocks([...blocks, { id: Math.random().toString(36), type: "text", value: "" }]);
  };
  
  const addImageBlock = () => {
    setBlocks([...blocks, { id: Math.random().toString(36), type: "image", file: null, preview: "", caption: "" }]);
  };

  const removeBlock = (id: string) => {
    setBlocks(blocks.filter(b => b.id !== id));
  };

  // Helper to update specific block fields
  const updateBlock = (id: string, updates: Partial<ContentBlock>) => {
    setBlocks(prev => prev.map(b => b.id === id ? { ...b, ...updates } as ContentBlock : b));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let mainImage = null;
      if (coverImage) {
        const asset = await client.assets.upload("image", coverImage);
        mainImage = {
          _type: "image",
          asset: { _ref: asset._id, _type: "reference" },
          alt: formData.title
        };
      }

      const bodyBlocks = await Promise.all(blocks.map(async (block) => {
        if (block.type === "text") {
          return {
            _key: block.id,
            _type: 'block',
            styles: [{style: 'normal'}],
            children: [{ _key: Math.random().toString(36), _type: 'span', text: block.value, marks: [] }]
          };
        } else if (block.type === "image" && block.file) {
          const asset = await client.assets.upload("image", block.file);
          return {
            _key: block.id,
            _type: 'image',
            asset: { _ref: asset._id, _type: 'reference' },
            caption: block.caption
          };
        }
        return null;
      }));

      const result = await manageJournalAction({
        title: formData.title,
        excerpt: formData.excerpt,
        publishedAt: new Date().toISOString(),
        mainImage,
        body: bodyBlocks.filter(Boolean)
      });

      if (result.success) {
        toast.success("Story Published");
        onRefresh(); onClose();
      }
    } catch (err) {
      toast.error("Publishing failed");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex justify-center bg-black/98 backdrop-blur-sm sm:p-4">
      <div className="bg-[#050505] border-x border-white/10 w-full max-w-4xl h-full sm:h-auto overflow-y-auto custom-scrollbar shadow-2xl relative flex flex-col">
        
        {/* FIXED HEADER */}
        <div className="sticky top-0 z-[60] bg-[#050505]/90 backdrop-blur-md border-b border-white/5 p-6 sm:p-10 flex justify-between items-center">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl italic text-white">Drafting Story</h2>
            <p className="text-[9px] text-[#C5A059] uppercase tracking-widest mt-1">Editorial Suite</p>
          </div>
          <button onClick={onClose} className="p-2 text-stone-500 hover:text-white transition-all">
            <X size={24}/>
          </button>
        </div>

        {/* SCROLLABLE CONTENT AREA */}
        <div className="flex-1 p-6 sm:p-12">
          <form id="journal-form" onSubmit={handleSubmit} className="space-y-12 pb-20">
            {/* Header Data */}
            <div className="space-y-4">
              <label className="text-[9px] uppercase tracking-[0.2em] text-stone-500 font-bold">Main Headline</label>
              <input 
                placeholder="Article Headline..."
                className="w-full bg-transparent border-b border-white/10 pb-4 text-2xl sm:text-4xl font-serif italic text-white outline-none focus:border-[#C5A059] transition-all"
                value={formData.title} 
                onChange={(e) => setFormData({...formData, title: e.target.value})} 
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[9px] uppercase tracking-[0.2em] text-[#C5A059] font-bold">Cover Image</label>
                <div className="border border-dashed border-white/10 aspect-video flex flex-col items-center justify-center relative hover:bg-white/[0.02] transition-all group overflow-hidden">
                   {coverImage ? (
                    <div className="text-center p-4">
                      <ImageIcon className="mx-auto text-[#C5A059] mb-2" />
                      <span className="text-[10px] text-white italic block truncate max-w-[200px]">{coverImage.name}</span>
                    </div>
                  ) : (
                    <>
                      <Upload className="text-stone-600" />
                      <span className="text-[9px] text-stone-500 mt-2 tracking-widest uppercase">Select Asset</span>
                    </>
                  )}
                  <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => setCoverImage(e.target.files?.[0] || null)} />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[9px] uppercase tracking-[0.2em] text-[#C5A059] font-bold">Summary Hook</label>
                <textarea 
                  className="w-full h-full min-h-[120px] bg-white/5 border border-white/10 p-4 text-white text-xs outline-none focus:border-[#C5A059] resize-none leading-relaxed"
                  placeholder="Short summary for preview cards..."
                  value={formData.excerpt} 
                  onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
                />
              </div>
            </div>

            <hr className="border-white/5" />

            {/* DYNAMIC STORY BLOCKS */}
            <div className="space-y-10">
              <label className="text-[10px] uppercase tracking-[0.3em] text-stone-500 font-bold block">Story Composition</label>
              
              <div className="space-y-6">
                {blocks.map((block) => (
                  <div key={block.id} className="group relative bg-white/[0.02] border border-white/5 p-4 sm:p-8 transition-all hover:border-white/10">
                    <button 
                      type="button" 
                      onClick={() => removeBlock(block.id)}
                      className="absolute -top-3 -right-3 bg-[#1A1A1A] text-stone-500 hover:text-red-500 p-2 rounded-full border border-white/10 opacity-0 group-hover:opacity-100 transition-all z-20 shadow-xl"
                    >
                      <Trash2 size={14} />
                    </button>

                    {block.type === 'text' ? (
                      <div className="flex gap-4">
                        <Type size={16} className="text-[#C5A059] mt-1 shrink-0 opacity-40" />
                        <textarea 
                          placeholder="Continue the narrative..."
                          className="w-full bg-transparent text-white text-sm sm:text-base leading-relaxed outline-none min-h-[150px] resize-none font-light"
                          value={block.value}
                          onChange={(e) => updateBlock(block.id, { value: e.target.value })}
                        />
                      </div>
                    ) : (
                      <div className="space-y-4">
                         <div className="flex items-center gap-2 text-[#C5A059] mb-4">
                          <ImageIcon size={16} />
                          <span className="text-[9px] uppercase font-bold tracking-widest text-stone-400">Media Block</span>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-6">
                           <div className="w-full sm:w-48 aspect-video bg-black border border-white/10 relative flex items-center justify-center overflow-hidden">
                              {block.preview ? <img src={block.preview} className="object-cover w-full h-full" /> : <Upload size={18} className="text-stone-800" />}
                              <input 
                                type="file" className="absolute inset-0 opacity-0 cursor-pointer"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) updateBlock(block.id, { file, preview: URL.createObjectURL(file) });
                                }} 
                              />
                           </div>
                           <input 
                            placeholder="Add a caption..."
                            className="flex-1 bg-transparent border-b border-white/10 p-3 text-white text-xs outline-none focus:border-[#C5A059]"
                            value={block.caption} onChange={(e) => updateBlock(block.id, { caption: e.target.value })}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Block Controls */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button onClick={addTextBlock} type="button" className="flex-1 bg-white/5 border border-white/10 py-5 text-[10px] text-white uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-white hover:text-black transition-all">
                  <PlusCircle size={14} /> Add Paragraph
                </button>
                <button onClick={addImageBlock} type="button" className="flex-1 bg-white/5 border border-white/10 py-5 text-[10px] text-white uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-white hover:text-black transition-all">
                  <PlusCircle size={14} /> Insert Image
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* FIXED FOOTER */}
        <div className="sticky bottom-0 bg-[#050505] border-t border-white/10 p-4 sm:p-6 z-[60]">
          <button 
            form="journal-form"
            type="submit"
            disabled={loading} 
            className="w-full bg-[#C5A059] text-black font-bold py-5 uppercase tracking-[0.4em] text-[11px] flex items-center justify-center gap-3 hover:bg-white transition-all disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
            Synchronize & Publish Story
          </button>
        </div>
      </div>
    </div>
  );
}