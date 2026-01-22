"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { client } from "@/lib/sanity/client";
import { toast } from "react-hot-toast";
import { X, Loader2, Upload, Save, CheckCircle2 } from "lucide-react";
import { manageRoomAction } from "@/app/actions/room";

export function CreateRoomModal({ isOpen, onClose, onRefresh }: any) {
  const [loading, setLoading] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const { register, handleSubmit, reset } = useForm();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setSelectedImages(filesArray);
      toast.success(`${filesArray.length} images staged for upload`);
    }
  };

  const onSubmit = async (data: any) => {
    if (selectedImages.length === 0) {
      toast.error("Please select at least one image");
      return;
    }

    setLoading(true);
    try {
      // 1. Upload Images to Sanity (Browser-to-Sanity)
      const gallery = await Promise.all(
        selectedImages.map(async (file) => {
          const asset = await client.assets.upload("image", file);
          return {
            _key: Math.random().toString(36).substring(2, 9),
            _type: "image",
            asset: { _ref: asset._id, _type: "reference" },
          };
        })
      );

      // 2. Format Portable Text
      const descriptionBlock = [{
        _type: 'block',
        children: [{ _type: 'span', text: data.details || "" }]
      }];

      // 3. Call Server Action to create the Document
      const result = await manageRoomAction(null, {
        title: data.title,
        price: Number(data.price),
        isAvailable: true,
        details: descriptionBlock,
        gallery: gallery,
      });

      if (result.success) {
        toast.success("Suite Registered & Assets Synchronized");
        reset();
        setSelectedImages([]);
        onRefresh();
        onClose();
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      console.error("Sanity Upload Error:", error);
      // Detailed error logging to help you debug
      toast.error(error.message.includes('CORS') 
        ? "CORS Block: Ensure 'Allow Credentials' is checked in Sanity API settings." 
        : "Registry Sync Failed");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-[#050505] border border-white/10 w-full max-w-2xl p-10 my-auto shadow-2xl">
        <div className="flex justify-between items-center mb-8">
          <h2 className="font-serif text-3xl italic text-white">New Suite Entry</h2>
          <button onClick={onClose} className="text-stone-500 hover:text-white transition-colors"><X size={24}/></button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-[#C5A059] font-bold">Suite Name</label>
              <input {...register("title")} className="w-full bg-white/5 border border-white/10 p-4 text-white outline-none focus:border-[#C5A059]" required />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-[#C5A059] font-bold">Price per Night (₦)</label>
              <input type="number" {...register("price")} className="w-full bg-white/5 border border-white/10 p-4 text-white outline-none focus:border-[#C5A059]" required />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-[#C5A059] font-bold">Description</label>
            <textarea {...register("details")} rows={3} className="w-full bg-white/5 border border-white/10 p-4 text-white outline-none focus:border-[#C5A059] resize-none" />
          </div>

          {/* Image Upload Area */}
          <div className={`border-2 border-dashed p-8 text-center transition-all relative ${selectedImages.length > 0 ? 'border-[#C5A059] bg-[#C5A059]/5' : 'border-white/10 hover:border-[#C5A059]'}`}>
            {selectedImages.length > 0 ? <CheckCircle2 className="mx-auto text-[#C5A059] mb-2" /> : <Upload className="mx-auto text-stone-500 mb-2" />}
            <p className="text-[10px] uppercase tracking-widest text-white font-bold">
              {selectedImages.length > 0 ? `${selectedImages.length} Images Ready` : "Upload Suite Gallery"}
            </p>
            <input 
              type="file" multiple accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={handleFileChange}
            />
          </div>

          <button type="submit" disabled={loading} className="w-full bg-[#C5A059] text-black font-bold py-5 uppercase tracking-[0.3em] text-[11px] flex items-center justify-center gap-2 hover:bg-white transition-all disabled:opacity-50">
            {loading ? <Loader2 className="animate-spin" /> : <Save size={18} />}
            {loading ? "Synchronizing Assets..." : "Confirm Suite & Assets"}
          </button>
        </form>
      </div>
    </div>
  );
}