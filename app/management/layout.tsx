"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image"; // Added for the logo
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { Toaster } from "react-hot-toast";
import { 
  Menu, 
  X, 
  Bed, 
  Image as ImageIcon, 
  MessageSquare, 
  PenTool, 
  LayoutDashboard, 
  ShieldCheck // Added for Staff Management
} from "lucide-react";
import { ClerkProvider } from "@clerk/nextjs";

export default function ManagementLayout({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { name: "Overview", href: "/management", icon: LayoutDashboard },
    { name: "Rooms", href: "/management/room", icon: Bed },
    { name: "Gallery", href: "/management/gallery", icon: ImageIcon },
    { name: "Journal", href: "/management/journal", icon: PenTool },
    { name: "Guest Voice", href: "/management/reviews", icon: MessageSquare },
    { name: "Staff & Security", href: "/management/staff", icon: ShieldCheck }, // NEW LINK
  ];

  return (
    <ClerkProvider 
      appearance={{
        variables: { colorPrimary: '#C5A059' } 
      }}
    >
    <div className="min-h-screen bg-[#050505] text-white">
      <Toaster position="bottom-right" />
      
      {/* MOBILE NAVBAR */}
      <header className="lg:hidden flex items-center justify-between p-6 border-b border-white/5 bg-[#0D0D0D]">
        <Image 
          src="/3ppleM_logo.png" 
          alt="3PPLEM Logo" 
          width={100} 
          height={40} 
          className="object-contain"
        />
        <button onClick={() => setIsOpen(true)} className="text-[#C5A059]"><Menu /></button>
      </header>

      <div className="flex">
        {/* SIDEBAR */}
        <aside className={`
          fixed inset-y-0 left-0 z-50 w-72 bg-[#0D0D0D] border-r border-white/5 transform transition-transform duration-300
          lg:translate-x-0 lg:static lg:inset-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}>
          <div className="p-8 flex flex-col h-full">
            <div className="flex justify-between items-center mb-12">
              <Image 
                src="/3ppleM_Logo.png" 
                alt="3PPLEM Logo" 
                width={140} 
                height={60} 
                className="object-contain"
                priority
              />
              <button className="lg:hidden text-stone-500" onClick={() => setIsOpen(false)}><X /></button>
            </div>

            <nav className="flex-grow space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-4 px-6 py-4 text-[10px] uppercase tracking-[0.3em] transition-all rounded-sm
                    ${pathname === item.href 
                      ? "bg-[#C5A059] text-black font-bold shadow-lg shadow-[#C5A059]/10" 
                      : "text-stone-500 hover:text-white hover:bg-white/5"}`}
                >
                  <item.icon size={16} strokeWidth={pathname === item.href ? 2.5 : 1.5} /> 
                  {item.name}
                </Link>
              ))}
            </nav>

            <div className="pt-6 border-t border-white/5 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[9px] text-[#C5A059] font-bold uppercase tracking-widest">Portal Access</span>
                <span className="text-[8px] text-stone-600 uppercase tracking-tighter">Verified Session</span>
              </div>
              <UserButton 
                afterSignOutUrl="/" 
                appearance={{
                  elements: {
                    userButtonAvatarBox: "border border-[#C5A059]/50"
                  }
                }}
              />
            </div>
          </div>
        </aside>

        {/* PAGE CONTENT */}
        <main className="flex-grow p-6 lg:p-12 overflow-x-hidden min-h-screen">
          <div className="max-w-7xl mx-auto">
             {children}
          </div>
        </main>
      </div>
    </div>
    </ClerkProvider>
  );
}