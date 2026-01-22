// Rooms.tsx (Server Component)
import { client } from "@/lib/sanity/client";
import RoomsClient from "./RoomsClient";

export default async function Rooms() {
  const query = `*[_type == "room"] | order(price asc) {
    title, 
    price, 
    "mainImage": gallery[0], 
    "slug": slug.current
  }`;

  // This ensures that when the "room" tag is revalidated, 
  // this data updates instantly across the site.
  const rooms = await client.fetch(query, {}, {
    next: { 
      tags: ["room"],
      revalidate: 3600 
    }
  });

  return <RoomsClient initialRooms={rooms} />;
}