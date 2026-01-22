"use client";
import { useState, useEffect } from "react";
import { client } from "@/lib/sanity/client";
import { 
  Star, Mail, Phone, CheckCircle, Trash2, 
  AlertCircle, MessageSquare, Download, Clock, Filter 
} from "lucide-react";
import { toast } from "react-hot-toast";

export default function ReviewManagement() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [filter, setFilter] = useState<'all' | 'bad' | 'good'>('bad'); // Default to bad for management focus
  const [showResolved, setShowResolved] = useState(false);

  const fetchReviews = async () => {
    // Fetching with more detail: including the creation date
    const data = await client.fetch(`*[_type == "guestVoice"] | order(_createdAt desc)`);
    setReviews(data);
  };

  useEffect(() => { fetchReviews(); }, []);

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      await client.patch(id).set({ status }).commit();
      toast.success(`Review marked as ${status}`);
      fetchReviews();
    } catch (err) {
      toast.error("Update failed. Check permissions.");
    }
  };

  const filteredReviews = reviews.filter(r => {
    const sentimentMatch = filter === 'all' ? true : (filter === 'bad' ? r.rating < 4 : r.rating >= 4);
    const statusMatch = showResolved ? true : r.status !== 'resolved';
    return sentimentMatch && statusMatch;
  });

  return (
    <div className="min-h-screen bg-[#050505] p-6 sm:p-12 text-white">
      <div className="max-w-6xl mx-auto">
        
        {/* DASHBOARD HEADER */}
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="font-serif text-4xl italic">Resolution Center</h1>
              {reviews.filter(r => r.rating < 4 && r.status !== 'resolved').length > 0 && (
                <span className="bg-red-600 text-[10px] px-2 py-0.5 rounded-full font-bold animate-pulse">
                  {reviews.filter(r => r.rating < 4 && r.status !== 'resolved').length} URGENT
                </span>
              )}
            </div>
            <p className="text-stone-500 text-[11px] uppercase tracking-[0.3em]">3PPLEM Continental Management Console</p>
          </div>

          <div className="flex flex-wrap gap-4 items-center">
            {/* RESOLVED TOGGLE */}
            <button 
              onClick={() => setShowResolved(!showResolved)}
              className={`flex items-center gap-2 px-4 py-2 border text-[10px] uppercase tracking-widest transition-all ${showResolved ? 'border-[#C5A059] text-[#C5A059]' : 'border-white/10 text-stone-500'}`}
            >
              <Clock size={14} /> {showResolved ? "Showing All" : "Hide Resolved"}
            </button>

            {/* SENTIMENT FILTER */}
            <div className="flex bg-white/5 p-1 border border-white/10">
              {['all', 'bad', 'good'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f as any)}
                  className={`px-4 py-2 text-[10px] uppercase tracking-widest transition-all ${filter === f ? 'bg-[#C5A059] text-black font-bold' : 'text-stone-500'}`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </header>

        {/* REVIEW GRID */}
        <div className="space-y-4">
          {filteredReviews.length > 0 ? (
            filteredReviews.map((review) => (
              <div 
                key={review._id} 
                className={`relative overflow-hidden bg-[#0A0A0A] border-l-4 ${review.rating < 4 ? 'border-l-red-600' : 'border-l-[#C5A059]'} border-y border-r border-white/5 p-8 transition-all hover:bg-[#111]`}
              >
                <div className="flex flex-col md:flex-row gap-10">
                  
                  {/* GUEST PROFILE */}
                  <div className="w-full md:w-56 space-y-4">
                    <div>
                      <div className="flex gap-0.5 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={12} fill={i < review.rating ? "#C5A059" : "none"} className={i < review.rating ? "text-[#C5A059]" : "text-stone-800"} />
                        ))}
                      </div>
                      <h3 className="text-xl font-serif italic text-white">{review.guestName}</h3>
                      <p className="text-stone-500 text-[10px] uppercase tracking-tighter">{review.role || "Guest"}</p>
                    </div>

                    {review.rating < 4 && (
                      <div className="space-y-2 pt-4 border-t border-white/5">
                        <a href={`mailto:${review.email}`} className="flex items-center gap-2 text-stone-400 hover:text-[#C5A059] text-xs transition-colors">
                          <Mail size={14} /> {review.email || "No Email"}
                        </a>
                        <a href={`tel:${review.phone}`} className="flex items-center gap-2 text-stone-400 hover:text-[#C5A059] text-xs transition-colors">
                          <Phone size={14} /> {review.phone || "No Phone"}
                        </a>
                      </div>
                    )}
                  </div>

                  {/* FEEDBACK CONTENT */}
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-4">
                       <span className="text-[9px] text-stone-600 uppercase tracking-widest">Received {new Date(review._createdAt).toLocaleDateString()}</span>
                       {review.status === 'resolved' && <span className="text-[9px] bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded">Resolved</span>}
                    </div>
                    <p className="text-stone-300 text-lg leading-relaxed font-light italic">
                      "{review.quote}"
                    </p>
                  </div>

                  {/* ACTION PANEL */}
                  <div className="flex md:flex-col gap-3 justify-center border-l border-white/5 pl-0 md:pl-10">
                    {review.status !== 'resolved' ? (
                      <button 
                        onClick={() => handleStatusUpdate(review._id, 'resolved')}
                        className="flex items-center gap-2 bg-emerald-600/10 text-emerald-500 border border-emerald-600/20 px-6 py-3 text-[10px] uppercase tracking-[0.2em] hover:bg-emerald-600 hover:text-white transition-all font-bold"
                      >
                        <CheckCircle size={14} /> Resolve
                      </button>
                    ) : (
                      <button 
                        onClick={() => handleStatusUpdate(review._id, 'new')}
                        className="text-stone-600 hover:text-white text-[10px] uppercase tracking-widest"
                      >
                        Re-open Case
                      </button>
                    )}
                    
                    <button 
                      onClick={async () => {
                        if(confirm('Permanent delete?')) {
                          await client.delete(review._id);
                          fetchReviews();
                        }
                      }}
                      className="p-3 text-stone-700 hover:text-red-500 transition-colors flex justify-center"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                {/* BACKGROUND DECOR */}
                {review.rating < 4 && review.status !== 'resolved' && (
                  <div className="absolute top-0 right-0 p-2">
                    <AlertCircle className="text-red-600 animate-pulse" size={16} />
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-32 border border-dashed border-white/10 rounded-xl">
              <MessageSquare className="mx-auto text-stone-800 mb-6" size={64} strokeWidth={1} />
              <p className="text-stone-500 font-serif text-xl italic">All Guest Concerns are Resolved.</p>
              <button onClick={() => {setFilter('all'); setShowResolved(true)}} className="mt-4 text-[#C5A059] text-[10px] uppercase tracking-widest hover:underline">View History</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}