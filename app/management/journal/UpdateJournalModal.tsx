"use client";
import { useState, useEffect } from "react";
import { client } from "@/lib/sanity/client";
import { manageJournalAction } from "@/app/actions/journal";
import { X, Loader2, Upload, Save, PlusCircle, Type, Image as ImageIcon, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { urlFor } from "@/lib/sanity/image";

export function UpdateJournalModal({ isOpen, article, onClose, onRefresh }: any) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ title: "", excerpt: "" });
  const [blocks, setBlocks] = useState<any[]>([]);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string>("");

  useEffect(() => {
    if (article && isOpen) {
      setFormData({ title: article.title, excerpt: article.excerpt || "" });
      setCoverPreview(article.mainImage ? urlFor(article.mainImage).url() : "");
      
      const initialBlocks = article.body?.map((b: any) => {
        if (b._type === 'block') {
          return { id: b._key, type: 'text', value: b.children?.[0]?.text || "" };
        } else {
          return { 
            id: b._key, 
            type: 'image', 
            preview: b.asset ? urlFor(b).url() : "", 
            caption: b.caption || "", 
            existingAsset: b.asset 
          };
        }
      }) || [];
      setBlocks(initialBlocks);
    }
  }, [article, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let mainImage = article.mainImage;
      if (coverImage) {
        const asset = await client.assets.upload("image", coverImage);
        mainImage = { _type: "image", asset: { _ref: asset._id, _type: "reference" }, alt: formData.title };
      }

      const bodyBlocks = await Promise.all(blocks.map(async (block) => {
        if (block.type === "text") {
          return {
            _key: block.id, _type: 'block', styles: [{style: 'normal'}],
            children: [{ _key: Math.random().toString(36), _type: 'span', text: block.value, marks: [] }]
          };
        } else {
          let assetRef = block.existingAsset;
          if (block.file) {
            const asset = await client.assets.upload("image", block.file);
            assetRef = { _ref: asset._id, _type: "reference" };
          }
          return { _key: block.id, _type: 'image', asset: assetRef, caption: block.caption };
        }
      }));

      await manageJournalAction({
        title: formData.title,
        excerpt: formData.excerpt,
        mainImage,
        body: bodyBlocks
      }, article._id);

      toast.success("Journal Entry Updated");
      onRefresh(); onClose();
    } catch (err) {
      toast.error("Update failed");
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
            <h2 className="font-serif text-2xl sm:text-3xl italic text-white">Edit Story</h2>
            <p className="text-[9px] text-[#C5A059] uppercase tracking-widest mt-1">Modifying Archive</p>
          </div>
          <button onClick={onClose} className="p-2 text-stone-500 hover:text-white transition-all">
            <X size={24}/>
          </button>
        </div>

        {/* SCROLLABLE CONTENT */}
        <div className="flex-1 p-6 sm:p-12">
          <form id="update-journal-form" onSubmit={handleSubmit} className="space-y-12 pb-20">
            <div className="space-y-4">
              <label className="text-[9px] uppercase tracking-[0.2em] text-stone-500 font-bold">Main Headline</label>
              <input 
                className="w-full bg-transparent border-b border-white/10 pb-4 text-2xl sm:text-4xl font-serif italic text-white outline-none focus:border-[#C5A059] transition-all"
                value={formData.title} 
                onChange={(e) => setFormData({...formData, title: e.target.value})} 
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[9px] uppercase tracking-[0.2em] text-[#C5A059] font-bold">Cover Image</label>
                <div className="border border-dashed border-white/10 aspect-video flex flex-col items-center justify-center relative hover:bg-white/[0.02] overflow-hidden bg-black">
                  {coverPreview || coverImage ? (
                    <img src={coverImage ? URL.createObjectURL(coverImage) : coverPreview} className="object-cover w-full h-full opacity-60" />
                  ) : (
                    <Upload className="text-stone-600" />
                  )}
                  <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => setCoverImage(e.target.files?.[0] || null)} />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[9px] uppercase tracking-[0.2em] text-[#C5A059] font-bold">Summary Hook</label>
                <textarea 
                  className="w-full h-full min-h-[120px] bg-white/5 border border-white/10 p-4 text-white text-xs outline-none focus:border-[#C5A059] resize-none leading-relaxed"
                  value={formData.excerpt} 
                  onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
                />
              </div>
            </div>

            <hr className="border-white/5" />

            {/* DYNAMIC BLOCKS */}
            <div className="space-y-10">
              <label className="text-[10px] uppercase tracking-[0.3em] text-stone-500 font-bold block">Story Composition</label>
              <div className="space-y-6">
                {blocks.map((block, idx) => (
                  <div key={block.id} className="group relative bg-white/[0.02] border border-white/5 p-4 sm:p-8 hover:border-white/10 transition-all">
                    <button 
                      type="button" 
                      onClick={() => setBlocks(blocks.filter(b => b.id !== block.id))}
                      className="absolute -top-3 -right-3 bg-[#1A1A1A] text-stone-500 hover:text-red-500 p-2 rounded-full border border-white/10 opacity-0 group-hover:opacity-100 transition-all z-20 shadow-xl"
                    >
                      <Trash2 size={14} />
                    </button>

                    {block.type === 'text' ? (
                      <div className="flex gap-4">
                        <Type size={16} className="text-[#C5A059] mt-1 shrink-0 opacity-40" />
                        <textarea 
                          className="w-full bg-transparent text-white text-sm sm:text-base leading-relaxed outline-none min-h-[150px] resize-none font-light"
                          value={block.value}
                          onChange={(e) => {
                            const b = [...blocks]; b[idx].value = e.target.value; setBlocks(b);
                          }}
                        />
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex flex-col sm:flex-row gap-6">
                           <div className="w-full sm:w-48 aspect-video bg-black border border-white/10 relative overflow-hidden">
                              <img src={block.preview} className="object-cover w-full h-full" />
                              <input 
                                type="file" className="absolute inset-0 opacity-0 cursor-pointer"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    const b = [...blocks];
                                    b[idx].file = file;
                                    b[idx].preview = URL.createObjectURL(file);
                                    setBlocks(b);
                                  }
                                }} 
                              />
                           </div>
                           <input 
                            placeholder="Add a caption..."
                            className="flex-1 bg-transparent border-b border-white/10 p-3 text-white text-xs outline-none focus:border-[#C5A059]"
                            value={block.caption}
                            onChange={(e) => {
                              const b = [...blocks]; b[idx].caption = e.target.value; setBlocks(b);
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button type="button" onClick={() => setBlocks([...blocks, {id: Math.random().toString(36), type: 'text', value: ''}])} className="flex-1 bg-white/5 border border-white/10 py-5 text-[10px] text-white uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-white hover:text-black transition-all">
                  <PlusCircle size={14} /> Add Paragraph
                </button>
                <button type="button" onClick={() => setBlocks([...blocks, {id: Math.random().toString(36), type: 'image', preview: '', caption: '', file: null}])} className="flex-1 bg-white/5 border border-white/10 py-5 text-[10px] text-white uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-white hover:text-black transition-all">
                  <PlusCircle size={14} /> Insert Image
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* FIXED FOOTER */}
        <div className="sticky bottom-0 bg-[#050505] border-t border-white/10 p-4 sm:p-6 z-[60]">
          <button 
            form="update-journal-form"
            type="submit"
            disabled={loading} 
            className="w-full bg-[#C5A059] text-black font-bold py-5 uppercase tracking-[0.4em] text-[11px] flex items-center justify-center gap-3 hover:bg-white transition-all disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
            Synchronize Changes
          </button>
        </div>
      </div>
    </div>
  );
}