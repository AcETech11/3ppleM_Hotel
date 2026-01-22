"use client";
import { useState } from "react";
import { Star, Send, ExternalLink, CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";

export default function GuestVoicePage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    guestName: "",
    role: "",
    quote: "",
    rating: 5,
    email: "", 
    phone: ""
  });

  // Updated with your specific Google Review Link
  const GOOGLE_REVIEW_LINK = "https://www.google.com/travel/search?q=3pple%20m%20continental&g2lb=4965990%2C72471280%2C72560029%2C72573224%2C72647020%2C72686036%2C72803964%2C72882230%2C72958624%2C73059275%2C73064764%2C73107089%2C73192290%2C121490197&hl=en-NG&gl=ng&cs=1&ssta=1&ts=CAEaRwopEicyJTB4MTAzYmY3ZGQyNDA2ZjFkNzoweGMxODk0YmNhNjY0ODhjMWESGhIUCgcI6g8QARgWEgcI6g8QARgXGAEyAhAA&qs=CAEyFENnc0ltcGlpc3FiNTBzVEJBUkFCOAJCCQkajEhmykuJwUIJCRqMSGbKS4nB&ap=ugEHcmV2aWV3cw&ictx=111&ved=0CAAQ5JsGahcKEwjw1a7W9JqSAxUAAAAAHQAAAAAQBw";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/guest-voice", {
        method: "POST",
        // FIX: Explicitly set headers to prevent "Unexpected end of JSON input"
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStep(3);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to submit");
      }
    } catch (err: any) {
      toast.error(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (step === 3) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 text-center">
        <div className="max-w-md space-y-8 animate-in fade-in zoom-in duration-700">
          <CheckCircle2 className="mx-auto text-[#C5A059]" size={64} strokeWidth={1} />
          <h2 className="font-serif text-3xl italic text-white">
            {formData.rating >= 4 ? "Thank you for the kind words." : "Thank you for your honesty."}
          </h2>
          <p className="text-stone-400 text-sm leading-relaxed">
            {formData.rating >= 4 
              ? "Your feedback helps us provide the best experience possible. Would you mind sharing this on Google to help other travelers?" 
              : "We have received your feedback. Our management team will review this personally and reach out to you shortly to resolve any issues."}
          </p>
          
          {formData.rating >= 4 && (
            <a 
              href={GOOGLE_REVIEW_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#C5A059] text-black px-8 py-4 text-[10px] uppercase font-bold tracking-[0.3em] hover:bg-white transition-all"
            >
              Post to Google <ExternalLink size={14}/>
            </a>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-[#C5A059]/30">
      <div className="max-w-2xl mx-auto px-6 py-20">
        <header className="text-center mb-16">
          <span className="text-[#C5A059] text-[10px] uppercase tracking-[0.5em] font-bold block mb-4">The Guest Voice</span>
          <h1 className="font-serif text-4xl italic">How was your stay?</h1>
        </header>

        <form onSubmit={handleSubmit} className="space-y-12">
          {/* STAR RATING */}
          <div className="flex flex-col items-center gap-6">
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setFormData({ ...formData, rating: star })}
                  className={`transition-all duration-300 ${formData.rating >= star ? 'text-[#C5A059]' : 'text-stone-800 hover:text-stone-600'}`}
                >
                  <Star size={32} fill={formData.rating >= star ? "currentColor" : "none"} strokeWidth={1} />
                </button>
              ))}
            </div>
            <p className="text-[10px] uppercase tracking-widest text-stone-500 italic">
              {formData.rating === 5 && "Exceeded Expectations"}
              {formData.rating === 4 && "Very Good"}
              {formData.rating < 4 && "Room for Improvement"}
            </p>
          </div>

          <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
            <input 
              required
              placeholder="Your Full Name"
              className="w-full bg-transparent border-b border-white/10 py-4 text-xl font-serif italic outline-none focus:border-[#C5A059] transition-all"
              value={formData.guestName}
              onChange={(e) => setFormData({...formData, guestName: e.target.value})}
            />

            <input 
              placeholder="Your Designation (e.g. Designer, Traveler)"
              className="w-full bg-transparent border-b border-white/10 py-4 text-sm uppercase tracking-widest outline-none focus:border-[#C5A059] transition-all"
              value={formData.role}
              onChange={(e) => setFormData({...formData, role: e.target.value})}
            />

            <textarea 
              required
              placeholder="Share your experience..."
              className="w-full bg-white/5 border border-white/10 p-6 text-sm leading-relaxed outline-none focus:border-[#C5A059] min-h-[150px] resize-none"
              value={formData.quote}
              onChange={(e) => setFormData({...formData, quote: e.target.value})}
            />

            {/* CONDITIONAL FIELDS FOR BAD REVIEWS */}
            {formData.rating < 4 && (
              <div className="space-y-6 pt-6 border-t border-white/5 animate-in fade-in duration-500">
                <p className="text-[#C5A059] text-[11px] italic">We are sorry we didn't meet your expectations. Please leave your contact so we can make it right.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input 
                    type="email" required placeholder="Email Address"
                    className="bg-white/5 border border-white/10 p-4 text-sm outline-none"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                  <input 
                    type="tel" required placeholder="Phone Number"
                    className="bg-white/5 border border-white/10 p-4 text-sm outline-none"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
              </div>
            )}
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-[#C5A059] text-black font-bold py-6 uppercase tracking-[0.4em] text-[11px] flex items-center justify-center gap-3 hover:bg-white transition-all disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={16} /> : <Send size={16}/>}
            Submit Feedback
          </button>
        </form>
      </div>
    </div>
  );
}
// https://www.google.com/travel/search?q=3pple%20m%20continental&g2lb=4965990%2C72471280%2C72560029%2C72573224%2C72647020%2C72686036%2C72803964%2C72882230%2C72958624%2C73059275%2C73064764%2C73107089%2C73192290%2C121490197&hl=en-NG&gl=ng&cs=1&ssta=1&ts=CAEaRwopEicyJTB4MTAzYmY3ZGQyNDA2ZjFkNzoweGMxODk0YmNhNjY0ODhjMWESGhIUCgcI6g8QARgWEgcI6g8QARgXGAEyAhAA&qs=CAEyFENnc0ltcGlpc3FiNTBzVEJBUkFCOAJCCQkajEhmykuJwUIJCRqMSGbKS4nB&ap=ugEHcmV2aWV3cw&ictx=111&ved=0CAAQ5JsGahcKEwjw1a7W9JqSAxUAAAAAHQAAAAAQBw