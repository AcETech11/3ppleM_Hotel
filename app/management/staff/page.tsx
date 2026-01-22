"use client";
import { useState, useEffect } from "react";
import { client } from "@/lib/sanity/client";
import { UserPlus, Trash2, User, Loader2, Clock, ShieldAlert } from "lucide-react";
import { toast } from "react-hot-toast";
import { formatDistanceToNow } from "date-fns";

export default function StaffManagement() {
  const [staff, setStaff] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [formData, setFormData] = useState({ name: "", email: "", role: "Supervisor" });

  // 1. FETCH DATA (Sanity Staff + Clerk Activity)
  const fetchStaffAndActivity = async () => {
    try {
      setFetching(true);
      const sanityStaff = await client.fetch(`*[_type == "staff"] | order(_createdAt desc)`);
      
      // Fetch activity from our bridge API
      const response = await fetch('/api/manage-staff/activity');
      const activityData = await response.json();

      const merged = sanityStaff.map((s: any) => ({
        ...s,
        lastLogin: activityData[s.email.toLowerCase()] || null
      }));

      setStaff(merged);
    } catch (err) {
      console.error("Fetch error:", err);
      toast.error("Failed to load staff activity");
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => { fetchStaffAndActivity(); }, []);

  // 2. ADD STAFF FUNCTION
  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await client.create({
        _type: "staff",
        name: formData.name,
        email: formData.email.toLowerCase().trim(),
        role: formData.role
      });
      toast.success(`${formData.name} is now authorized`);
      setFormData({ name: "", email: "", role: "Supervisor" });
      fetchStaffAndActivity();
    } catch (err) {
      toast.error("Permission denied. Check Sanity Token.");
    } finally {
      setLoading(false);
    }
  };

  // 3. DELETE STAFF FUNCTION (The one that was missing)
  const deleteStaff = async (id: string, name: string) => {
    const confirmed = window.confirm(`Revoke all dashboard access for ${name}?`);
    if (!confirmed) return;

    try {
      await client.delete(id);
      toast.success("Access revoked successfully");
      fetchStaffAndActivity(); // Refresh the list
    } catch (err) {
      toast.error("Failed to remove staff member");
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] p-6 sm:p-12 text-white">
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 border-b border-white/5 pb-8 gap-4">
          <div>
            <h1 className="font-serif text-4xl italic mb-2 text-white">Security & Staff</h1>
            <p className="text-stone-500 text-[10px] uppercase tracking-[0.3em]">Access Control & Activity Monitor</p>
          </div>
          <div className="bg-emerald-500/5 border border-emerald-500/20 px-4 py-2 rounded">
             <p className="text-emerald-500 text-[9px] uppercase tracking-widest flex items-center gap-2">
               <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
               Authorization System Active
             </p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* LEFT: ADD STAFF FORM */}
          <div className="lg:col-span-1">
            <div className="bg-[#0A0A0A] border border-white/5 p-6 rounded-lg sticky top-8">
              <h3 className="text-[#C5A059] text-[11px] uppercase tracking-widest font-bold mb-6 flex items-center gap-2">
                <UserPlus size={14} /> New Authorization
              </h3>
              <form onSubmit={handleAddStaff} className="space-y-5">
                <div>
                  <label className="text-[9px] uppercase text-stone-500 mb-1.5 block tracking-wider">Staff Name</label>
                  <input 
                    required
                    className="w-full bg-white/5 border border-white/10 p-3 text-sm outline-none focus:border-[#C5A059] transition-colors"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-[9px] uppercase text-stone-500 mb-1.5 block tracking-wider">Clerk Email</label>
                  <input 
                    required type="email"
                    className="w-full bg-white/5 border border-white/10 p-3 text-sm outline-none focus:border-[#C5A059] transition-colors"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-[9px] uppercase text-stone-500 mb-1.5 block tracking-wider">Access Level</label>
                  <select 
                    className="w-full bg-white/5 border border-white/10 p-3 text-sm outline-none focus:border-[#C5A059] cursor-pointer"
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                  >
                    <option value="General Manager">General Manager</option>
                    <option value="OPM">OPM</option>
                    <option value="Supervisor">Supervisor</option>
                  </select>
                </div>
                <button 
                  disabled={loading}
                  className="w-full bg-[#C5A059] text-black font-bold py-4 text-[10px] uppercase tracking-[0.2em] hover:bg-white transition-all disabled:opacity-50 mt-2"
                >
                  {loading ? <Loader2 className="animate-spin mx-auto" size={16} /> : "Authorize Access"}
                </button>
              </form>
            </div>
          </div>

          {/* RIGHT: STAFF TABLE */}
          <div className="lg:col-span-3">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="text-left border-b border-white/10">
                    <th className="pb-5 text-[10px] uppercase text-stone-500 font-medium tracking-widest">Team Member</th>
                    <th className="pb-5 text-[10px] uppercase text-stone-500 font-medium tracking-widest">Designation</th>
                    <th className="pb-5 text-[10px] uppercase text-stone-500 font-medium tracking-widest">Last Activity</th>
                    <th className="pb-5 text-right text-[10px] uppercase text-stone-500 font-medium tracking-widest">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {fetching ? (
                    <tr><td colSpan={4} className="py-20 text-center text-stone-600 animate-pulse font-serif italic text-lg">Synchronizing secure data...</td></tr>
                  ) : staff.map((member) => (
                    <tr key={member._id} className="hover:bg-white/[0.01] transition-colors group">
                      <td className="py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded bg-stone-900 border border-white/10 flex items-center justify-center text-[#C5A059]">
                            <User size={18} strokeWidth={1.2} />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-stone-200">{member.name}</p>
                            <p className="text-[10px] text-stone-500 uppercase font-mono">{member.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-6">
                        <span className="text-[9px] bg-[#C5A059]/5 border border-[#C5A059]/20 text-[#C5A059] px-2.5 py-1 rounded tracking-tighter uppercase font-bold">
                          {member.role}
                        </span>
                      </td>
                      <td className="py-6">
                        {member.lastLogin ? (
                          <div className="flex items-center gap-2 text-stone-300">
                            <Clock size={12} className="text-emerald-500" />
                            <span className="text-xs font-light">
                              {formatDistanceToNow(new Date(member.lastLogin), { addSuffix: true })}
                            </span>
                          </div>
                        ) : (
                          <span className="text-[10px] text-stone-700 uppercase italic tracking-widest font-light">Inactive</span>
                        )}
                      </td>
                      <td className="py-6 text-right">
                        <button 
                          onClick={() => deleteStaff(member._id, member.name)}
                          className="text-stone-700 hover:text-red-500 transition-all duration-300 p-2"
                          title="Revoke Access"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {!fetching && staff.length === 0 && (
                <div className="text-center py-24 border border-dashed border-white/5 rounded-xl mt-4">
                  <ShieldAlert className="mx-auto text-stone-800 mb-4" size={48} strokeWidth={1} />
                  <p className="text-stone-600 font-serif text-lg italic tracking-wide">No additional staff members found.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}