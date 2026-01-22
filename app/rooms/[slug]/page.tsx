// /rooms/[slug]/page.tsx (Server Component)
import { client } from "@/lib/sanity/client";
import RoomDetailsClient from "./RoomDetailsClient";
import { Metadata } from "next";

// This helps SEO: The tab title will now show the actual Room Name
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { slug } = params;
  return { title: `${slug.charAt(0).toUpperCase() + slug.slice(1)} | 3PPLEM Sanctuary` };
}

export default async function RoomPage({ params }: { params: { slug: string } }) {
  const { slug } = params;

  const query = `*[_type == "room" && slug.current == $slug][0] {
    title,
    price,
    tags,
    gallery,
    details,
    "videoUrl": videoTour.asset->url
  }`;

  // This is the CRITICAL part: the 'room' tag
  const room = await client.fetch(query, { slug }, {
    next: { 
      tags: ['room'], 
      revalidate: 3600 
    }
  });

  if (!room) return <div className="h-screen bg-[#0D0D0D] flex items-center justify-center text-[#C5A059]">Sanctuary not found.</div>;

  return <RoomDetailsClient room={room} />;
}