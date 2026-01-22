"use client";
import React, { useState, useEffect } from "react";
import { Calendar, Users, Bed, Send, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import { client } from "@/lib/sanity/client";

const BookingBar = () => {
  const [rooms, setRooms] = useState<any[]>([]);
  const [bookingData, setBookingData] = useState({
    name: "",
    checkIn: "",
    checkOut: "",
    roomType: "",
    guests: "1",
    notes: ""
  });

  // Fetch rooms from Sanity to populate the dropdown
  useEffect(() => {
    client.fetch(`*[_type == "room"]{title, price}`).then(setRooms);
  }, []);

  const handleWhatsAppBooking = () => {
    const { name, checkIn, checkOut, roomType, guests, notes } = bookingData;
    
    // Find the price of the selected room
    const selectedRoom = rooms.find(r => r.title === roomType);
    const priceText = selectedRoom ? `Total Price/Night: ₦${selectedRoom.price}` : "";

    const message = `*NEW RESERVATION REQUEST - 3PPLEM*%0A%0A` +
      `*Guest Name:* ${name}%0A` +
      `*Room:* ${roomType}%0A` +
      `*Check-In:* ${checkIn}%0A` +
      `*Check-Out:* ${checkOut}%0A` +
      `*Guests:* ${guests}%0A` +
      `*Notes:* ${notes || "None"}%0A%0A` +
      `${priceText}%0A%0A` +
      `_Please confirm availability for these dates._`;

    // Replace with your company WhatsApp number (e.g., 2348012345678)
    const whatsappNumber = "2348161725227"; 
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, "_blank");
  };

  return (
    <motion.div 
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 1, duration: 0.8 }}
      className="absolute bottom-10 left-0 w-full z-40 px-4 md:px-10"
    >
      <div className="max-w-7xl mx-auto bg-[#0A0A0A]/90 backdrop-blur-3xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        <div className="grid grid-cols-1 md:grid-cols-5 lg:grid-cols-6 items-center">
          
          {/* Guest Name */}
          <div className="p-4 border-b md:border-b-0 md:border-r border-white/10">
            <label className="text-[9px] uppercase tracking-[0.2em] text-[#C5A059] font-bold mb-1 block">Guest Name</label>
            <input 
              type="text" 
              placeholder="Your Name"
              className="bg-transparent text-white text-sm outline-none w-full placeholder:text-stone-600"
              onChange={(e) => setBookingData({...bookingData, name: e.target.value})}
            />
          </div>

          {/* Dates Section */}
          <div className="p-4 border-b md:border-b-0 md:border-r border-white/10 flex flex-col gap-1">
            <label className="text-[9px] uppercase tracking-[0.2em] text-[#C5A059] font-bold flex items-center gap-2">
              <Calendar size={10} /> Dates
            </label>
            <div className="flex gap-2 text-xs">
              <input 
                type="date" 
                className="bg-transparent text-white outline-none w-full [color-scheme:dark]" 
                onChange={(e) => setBookingData({...bookingData, checkIn: e.target.value})}
              />
              <span className="text-stone-600">-</span>
              <input 
                type="date" 
                className="bg-transparent text-white outline-none w-full [color-scheme:dark]" 
                onChange={(e) => setBookingData({...bookingData, checkOut: e.target.value})}
              />
            </div>
          </div>

          {/* Room Selection */}
          <div className="p-4 border-b md:border-b-0 md:border-r border-white/10">
            <label className="text-[9px] uppercase tracking-[0.2em] text-[#C5A059] font-bold flex items-center gap-2 mb-1">
              <Bed size={10} /> Selection
            </label>
            <select 
              className="bg-transparent text-white text-sm outline-none w-full cursor-pointer appearance-none"
              onChange={(e) => setBookingData({...bookingData, roomType: e.target.value})}
            >
              <option className="bg-[#0A0A0A]" value="">Select Suite</option>
              {rooms.map((room) => (
                <option key={room.title} className="bg-[#0A0A0A]" value={room.title}>
                  {room.title} - ₦{room.price}
                </option>
              ))}
            </select>
          </div>

          {/* Guests & Notes */}
          <div className="p-4 border-b md:border-b-0 md:border-r border-white/10 flex gap-4">
             <div className="w-16">
               <label className="text-[9px] uppercase tracking-[0.2em] text-[#C5A059] font-bold mb-1 block text-center">Qty</label>
               <input 
                type="number" min="1" defaultValue="1"
                className="bg-transparent text-white text-sm outline-none w-full text-center"
                onChange={(e) => setBookingData({...bookingData, guests: e.target.value})}
               />
             </div>
             <div className="flex-grow">
               <label className="text-[9px] uppercase tracking-[0.2em] text-[#C5A059] font-bold mb-1 block">Requests</label>
               <input 
                type="text" placeholder="Extra towels..."
                className="bg-transparent text-white text-sm outline-none w-full placeholder:text-stone-700 italic"
                onChange={(e) => setBookingData({...bookingData, notes: e.target.value})}
               />
             </div>
          </div>

          {/* WhatsApp Button */}
          <button 
            onClick={handleWhatsAppBooking}
            className="bg-[#C5A059] hover:bg-white text-black font-bold h-full py-6 md:py-0 md:h-full lg:col-span-1 transition-all flex items-center justify-center gap-3 group overflow-hidden"
          >
            <span className="text-[10px] uppercase tracking-[0.3em]">Confirm via WhatsApp</span>
            <Send size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </button>

        </div>
      </div>
    </motion.div>
  );
};

export default BookingBar;