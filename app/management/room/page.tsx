"use client";
import React, { useState, useEffect } from "react";
import { client } from "@/lib/sanity/client";
import { toast } from "react-hot-toast";
import { Edit3, Trash2, Loader2, Eye, EyeOff } from "lucide-react";
import { UpdateRoomModal } from "./UpdateRoomModal";
import Image from "next/image";
import { urlFor } from "@/lib/sanity/image";
import { CreateRoomModal } from "./CreateRoomModal"; // Ensure path is correct
import { Plus } from "lucide-react"; // Add Plus icon
import { DeleteRoomModal } from "./DeleteRoomModal";

// Verify this is DEFAULT export
export default function RoomManagerPage() {
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState<any>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState<any>(null);

  const fetchRooms = async () => {
    try {
      const data = await client.fetch(`*[_type == "room"] | order(_createdAt desc)`);
      setRooms(data);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRooms(); }, []);

  const toggleMute = async (id: string, currentStatus: boolean) => {
    try {
      await client.patch(id).set({ isAvailable: !currentStatus }).commit();
      toast.success(currentStatus ? "Room Muted" : "Room Live");
      fetchRooms();
    } catch { toast.error("Update failed"); }
  };

  if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-[#C5A059]" /></div>;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-10">
        <h1 className="font-serif text-4xl italic text-white">Room Inventory</h1>
        <button 
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-[#C5A059] text-black px-6 py-3 flex items-center gap-2 font-bold uppercase tracking-widest text-[10px] hover:bg-white transition-all"
        >
          <Plus size={16} /> New Suite
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {rooms.map((room) => (
          <div key={room._id} className={`bg-[#0D0D0D] border border-white/5 overflow-hidden transition-all ${!room.isAvailable ? 'opacity-40' : ''}`}>
             <div className="relative h-64 w-full">
               {room.gallery?.[0] && (
                 <Image 
                   src={urlFor(room.gallery[0]).url()} 
                   alt={room.title} 
                   fill 
                   className="object-cover"
                 />
               )}
             </div>
             <div className="p-6">
               <div className="flex justify-between items-start mb-4">
                 <h3 className="font-serif text-2xl text-white italic">{room.title}</h3>
                 <p className="text-[#C5A059] font-mono font-bold">₦{room.price?.toLocaleString()}</p>
               </div>
               
               <div className="flex gap-4 border-t border-white/5 pt-4">
                 <button onClick={() => setSelectedRoom(room)} className="flex-1 bg-white/5 py-3 flex justify-center hover:bg-white/10 text-white transition-all">
                    <Edit3 size={18} />
                 </button>
                 <button onClick={() => toggleMute(room._id, room.isAvailable)} className="flex-1 bg-white/5 py-3 flex justify-center hover:bg-white/10 text-white transition-all">
                    {room.isAvailable ? <EyeOff size={18} /> : <Eye size={18} />}
                 </button>
                 <button
                 onClick={() => setRoomToDelete(room)}
                 className="flex-1 bg-red-900/10 py-3 flex justify-center hover:bg-red-600 text-red-500 hover:text-white transition-all">
                    <Trash2 size={18} />
                 </button>
               </div>
             </div>
          </div>
        ))}
      </div>

      {/* CREATE MODAL */}
      <CreateRoomModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
        onRefresh={fetchRooms} 
      />

      {/* NEW DELETE MODAL */}
      {roomToDelete && (
        <DeleteRoomModal 
          room={roomToDelete} 
          onClose={() => setRoomToDelete(null)} 
          onRefresh={fetchRooms} 
        />
      )}

      {selectedRoom && (
        <UpdateRoomModal 
          room={selectedRoom} 
          onClose={() => setSelectedRoom(null)} 
          onRefresh={fetchRooms} 
        />
      )}
    </div>
  );
}