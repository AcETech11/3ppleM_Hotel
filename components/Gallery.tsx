// GallerySection.tsx (Server Component)
import { client } from "@/lib/sanity/client";
import GalleryClient from "./GalleryClient";

export default async function GallerySection() {
  const query = `*[_type == "gallery"] | order(_createdAt desc) {
    "photos": images[]{
      "url": asset->url,
      caption,
      alt,
      "metadata": asset->metadata
    }
  }[0...2]`;

  const data = await client.fetch(query, {}, {
    next: { 
      tags: ["gallery"],
      revalidate: 3600 
    }
  });

  // Flatten the array of arrays on the server
  const flattenedPhotos = data?.flatMap((g: any) => g.photos || []).slice(0, 6) || [];

  return <GalleryClient initialItems={flattenedPhotos} />;
}