import { client } from "@/lib/sanity/client";
import RoomDetailsClient from "./RoomDetailsClient";
import { Metadata } from "next";

// 1. Fix Metadata by awaiting params
export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}): Promise<Metadata> {
  const { slug } = await params;
  return { 
    title: `${slug.charAt(0).toUpperCase() + slug.slice(1)} | 3PPLEM Sanctuary` 
  };
}

export default async function RoomPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  // 2. CRITICAL FIX: Await params before using slug
  const { slug } = await params;

  const query = `*[_type == "room" && slug.current == $slug][0] {
    title,
    price,
    tags,
    gallery,
    details,
    "videoUrl": videoTour.asset->url
  }`;

  try {
    const room = await client.fetch(query, { slug }, {
      next: { 
        tags: ['room'], 
        revalidate: 3600 
      }
    });

    // 3. Safety Check: If room doesn't exist, don't pass null to Client Component
    if (!room) {
      return (
        <div className="h-screen bg-[#050505] flex flex-col items-center justify-center text-center px-6">
          <h2 className="font-serif text-[#C5A059] text-3xl mb-4 italic">Sanctuary not found</h2>
          <p className="text-stone-500 text-xs uppercase tracking-widest">This room may have been moved or renamed.</p>
        </div>
      );
    }

    return <RoomDetailsClient room={room} />;
    
  } catch (error) {
    // 4. Log the actual error to your Vercel console for debugging
    console.error("Sanity Fetch Error:", error);
    return (
      <div className="h-screen bg-[#050505] flex items-center justify-center text-[#C5A059]">
        An error occurred while preparing your sanctuary.
      </div>
    );
  }
}