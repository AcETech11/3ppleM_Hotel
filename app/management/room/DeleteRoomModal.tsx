"use client";
import { useState } from "react";
import { X, AlertTriangle, Loader2, Trash2 } from "lucide-react";
import { deleteRoomAction } from "@/app/actions/room";
import { toast } from "react-hot-toast";

export function DeleteRoomModal({ room, onClose, onRefresh }: any) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    const result = await deleteRoomAction(room._id);
    
    if (result.success) {
      toast.success(`${room.title} removed from registry.`);
      onRefresh();
      onClose();
    } else {
      toast.error("Failed to delete asset.");
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/90 backdrop-blur-xl p-4">
      <div className="bg-[#0A0A0A] border border-red-900/30 w-full max-w-md p-10 shadow-2xl shadow-red-900/10">
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-red-900/20 rounded-full flex items-center justify-center mb-6">
            <AlertTriangle size={32} className="text-red-500" />
          </div>
          
          <h2 className="font-serif text-2xl text-white mb-4">Permanent Removal</h2>
          
          <p className="text-stone-400 text-sm leading-relaxed mb-8">
            Are you sure you want to delete <span className="text-white font-bold italic">"{room.title}"</span>? 
            Every asset, price record, and description associated with this suite will be purged from the database permanently.
          </p>

          <div className="grid grid-cols-2 gap-4 w-full">
            <button 
              onClick={onClose}
              className="py-4 bg-white/5 text-stone-400 uppercase tracking-widest text-[10px] hover:bg-white/10 transition-all font-bold"
            >
              Cancel
            </button>
            <button 
              onClick={handleDelete}
              disabled={loading}
              className="py-4 bg-red-600 text-white uppercase tracking-widest text-[10px] hover:bg-red-500 transition-all font-bold flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" size={14} /> : <Trash2 size={14} />}
              Confirm Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}