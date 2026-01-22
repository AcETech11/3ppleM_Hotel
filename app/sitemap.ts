import { MetadataRoute } from 'next'
import { client } from "@/lib/sanity/client";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://3pplemcontinentalhotel.ng'

  // Fetch all room slugs from Sanity to include in sitemap
  const rooms = await client.fetch(`*[_type == "room"]{ "slug": slug.current }`);
  
  const roomUrls = rooms.map((room: any) => ({
    url: `${baseUrl}/rooms/${room.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9, // Higher priority because these are your "selling" pages
  }));

  const staticUrls = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 1 },
    { url: `${baseUrl}/rooms`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'yearly' as const, priority: 0.5 },
    { url: `${baseUrl}/reserve`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.7 },
  ];

  return [...staticUrls, ...roomUrls];
}