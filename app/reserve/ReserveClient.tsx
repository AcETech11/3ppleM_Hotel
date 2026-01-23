"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { client } from "@/lib/sanity/client";
import { Bed, Users, MessageCircle, Info, Calendar as CalendarIcon } from "lucide-react";
import { differenceInDays, isBefore, parseISO } from "date-fns";
import Navbar from "@/components/Navbar";

// 1. TypeScript Interfaces
interface BookingState {
  name: string;
  phone: string;
  checkIn: string;
  checkOut: string;
  roomTitle: string;
  roomPrice: number;
  guests: number;
  notes: string;
}

interface InputGroupProps {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  min?: string;
}

export default function ReservationPage() {
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [booking, setBooking] = useState<BookingState>({
    name: "",
    phone: "",
    checkIn: "",
    checkOut: "",
    roomTitle: "",
    roomPrice: 0,
    guests: 1,
    notes: ""
  });

  useEffect(() => {
    client.fetch(`*[_type == "room"]{title, price, "image": image.asset->url}`).then((data) => {
      setRooms(data);
      setLoading(false);
    });
  }, []);

  // 2. Date Guard & Logic
  const nights = (booking.checkIn && booking.checkOut) 
    ? differenceInDays(new Date(booking.checkOut), new Date(booking.checkIn)) 
    : 0;

  // Prevent negative nights if user picks invalid dates
  const validatedNights = nights < 0 ? 0 : nights;
  const totalPrice = validatedNights > 0 ? validatedNights * booking.roomPrice : booking.roomPrice;

  const sendToWhatsApp = () => {
    if (!booking.name || !booking.checkIn || !booking.roomTitle) {
      alert("Please fill in your name, dates, and select a room.");
      return;
    }

    const message = `*RESERVATION REQUEST - 3PPLEM*%0A` +
      `--------------------------%0A` +
      `*Guest:* ${booking.name}%0A` +
      `*Room:* ${booking.roomTitle}%0A` +
      `*Duration:* ${validatedNights} Night(s)%0A` +
      `*Dates:* ${booking.checkIn} to ${booking.checkOut}%0A` +
      `*Guests:* ${booking.guests}%0A` +
      `*Total:* ₦${totalPrice.toLocaleString()}%0A` +
      `--------------------------%0A` +
      `*from: 3pple M Continental Hotel & Suites Website*`;

    window.open(`https://wa.me/2348170777774?text=${message}`, "_blank");
  };

  return (
    <>
    <Navbar />
    
    <div className="min-h-screen bg-[#050505] text-white flex mt-20 flex-col lg:flex-row">
      {/* LEFT SIDE: THE FORM */}
      <div className="w-full lg:w-3/5 p-8 lg:p-24 flex flex-col justify-center">
        <motion.div 
          initial={{ opacity: 0, x: -20 }} 
          animate={{ opacity: 1, x: 0 }}
          className="max-w-xl w-full mx-auto"
        >
          <header className="mb-12">
            <span className="text-[#C5A059] text-[10px] uppercase tracking-[0.6em] block mb-4 font-bold">Request a stay</span>
            <h1 className="text-5xl md:text-7xl font-serif italic mb-6">Securing your sanctuary.</h1>
          </header>

          <div className="space-y-12">
            <section className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputGroup label="Full Name" value={booking.name} 
                  onChange={(v) => setBooking({...booking, name: v})} placeholder="John Doe" />
                <InputGroup label="Phone Number" value={booking.phone} 
                  onChange={(v) => setBooking({...booking, phone: v})} placeholder="+234..." />
              </div>
            </section>

            <section className="grid grid-cols-1 md:grid-cols-2 gap-8 py-10 border-y border-white/5">
              <div className="space-y-6">
                 <label className="text-[10px] uppercase tracking-widest text-stone-500 font-bold flex items-center gap-2">
                    <Bed size={14} className="text-[#C5A059]" /> Preferred Suite
                 </label>
                 <select 
                    className="w-full bg-transparent border-b border-white/10 py-4 outline-none focus:border-[#C5A059] transition-all appearance-none cursor-pointer text-sm"
                    onChange={(e) => {
                        const r = rooms.find(rm => rm.title === e.target.value);
                        if(r) setBooking({...booking, roomTitle: r.title, roomPrice: r.price});
                    }}
                 >
                    <option value="" className="bg-black text-stone-500">Choose a room...</option>
                    {rooms.map(r => <option key={r.title} value={r.title} className="bg-black">{r.title}</option>)}
                 </select>
              </div>

              <div className="space-y-6">
                <label className="text-[10px] uppercase tracking-widest text-stone-500 font-bold flex items-center gap-2">
                    <Users size={14} className="text-[#C5A059]" /> Party Size
                 </label>
                 <input type="number" min="0" max="10" className="w-full bg-transparent border-b border-white/10 py-4 outline-none focus:border-[#C5A059] text-sm"
                   value={booking.guests} onChange={(e) => setBooking({...booking, guests: parseInt(e.target.value) || 1})} />
              </div>
            </section>

            <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <InputGroup 
                  type="date" label="Arrival" 
                  value={booking.checkIn} 
                  onChange={(v) => setBooking({...booking, checkIn: v})} 
                />
                <InputGroup 
                  type="date" label="Departure" 
                  value={booking.checkOut} 
                  min={booking.checkIn} // Date Guard: Cannot pick date before check-in
                  onChange={(v) => setBooking({...booking, checkOut: v})} 
                />
            </section>

            <button 
              onClick={sendToWhatsApp}
              className="w-full py-6 bg-[#C5A059] text-black font-bold uppercase tracking-[0.4em] text-[10px] flex items-center justify-center gap-4 hover:bg-white transition-all group active:scale-95"
            >
              Request Booking <MessageCircle size={18} className="group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </motion.div>
      </div>

      {/* RIGHT SIDE: SUMMARY CARD */}
      <div className="w-full lg:w-2/5 bg-[#0A0A0A] border-l border-white/5 p-8 lg:p-24 flex flex-col justify-center items-center">
        <div className="w-full max-w-sm space-y-8">
            <div className="aspect-[4/5] bg-stone-900 overflow-hidden relative group border border-white/10 shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10" />
                {rooms.find(r => r.title === booking.roomTitle)?.image ? (
                    <img src={rooms.find(r => r.title === booking.roomTitle).image} className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-all duration-700" alt="Room" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-stone-800 italic font-serif p-12 text-center text-sm">Select your preferred suite to preview</div>
                )}
                <div className="absolute bottom-8 left-8 z-20">
                    <p className="text-[10px] uppercase tracking-[0.3em] text-[#C5A059] mb-2 font-bold tracking-widest">Your Choice</p>
                    <h2 className="text-3xl font-serif italic text-white leading-tight">{booking.roomTitle || "3PPLEM Suite"}</h2>
                </div>
            </div>

            <div className="space-y-4 pt-6 border-t border-white/10">
                <div className="flex justify-between text-stone-500 text-[10px] uppercase tracking-[0.2em] font-medium">
                    <span>Rate/Night</span>
                    <span className="text-stone-300">₦{booking.roomPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-stone-500 text-[10px] uppercase tracking-[0.2em] font-medium">
                    <span>Duration</span>
                    <span className="text-stone-300 font-mono tracking-tighter">{validatedNights} Night(s)</span>
                </div>
                <div className="flex justify-between items-end pt-4">
                    <span className="text-stone-400 font-serif italic text-lg">Estimated Total</span>
                    <span className="text-4xl text-[#C5A059] font-serif italic tracking-tighter">₦{totalPrice.toLocaleString()}</span>
                </div>
            </div>

            <div className="p-5 bg-white/[0.02] border border-white/5 rounded-sm flex gap-4 items-start shadow-inner">
                <Info size={16} className="text-[#C5A059] shrink-0 mt-0.5" />
                <p className="text-[9px] leading-relaxed text-stone-500 uppercase tracking-widest font-semibold">
                    Inquiry Policy: Availability is confirmed manually. Our TEAM will reach out via WhatsApp with the booking manifest and payment instructions.
                </p>
            </div>
        </div>
      </div>
    </div>
    </>
  );
}

// 3. Typed InputGroup Component
function InputGroup({ label, value, onChange, placeholder = "", type = "text", min }: InputGroupProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-[10px] uppercase tracking-[0.2em] text-stone-500 font-bold">{label}</label>
      <input 
        type={type}
        value={value}
        min={min}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="bg-transparent border-b border-white/10 py-4 outline-none focus:border-[#C5A059] text-sm transition-all placeholder:text-stone-800 [color-scheme:dark] text-white"
      />
    </div>
  );
}