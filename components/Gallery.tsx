// GallerySection.tsx (Server Component)
import { client } from "@/lib/sanity/client";
import GalleryClient from "./GalleryClient";

export default async function GallerySection() {
  // NEW QUERY: Fetch individual 'gallery' documents
  // We project 'url' explicitly so GalleryClient can find it easily
  const query = `*[_type == "gallery"] | order(_createdAt desc) [0...12] {
    _id,
    title,
    "category": category->title,
    "url": image.asset->url,
    "image": image {
      asset->,
      alt,
      caption
    }
  }`;

  const data = await client.fetch(query, {}, {
    next: { 
      tags: ["gallery"],
      revalidate: 60 // Lowered for development so you see changes faster
    }
  });

  // No need to flatMap anymore because documents are individual, not nested arrays
  const items = data || [];

  return <GalleryClient initialItems={items} />;
}