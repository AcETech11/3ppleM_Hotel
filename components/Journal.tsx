// Journal.tsx (Server Component)
import { client } from "@/lib/sanity/client";
import JournalClient from "./JournalClient";

export default async function Journal() {
  const query = `*[_type == "journal"] | order(publishedAt desc)[0...3] {
    title,
    "slug": slug.current,
    mainImage, 
    publishedAt,
    excerpt
  }`;

  const posts = await client.fetch(query, {}, {
    next: { 
      tags: ["journal"],
      revalidate: 3600 
    }
  });

  // Simple date formatter to keep the Client Component lean
  const formattedPosts = posts.map((post: any) => ({
    ...post,
    formattedDate: post.publishedAt 
      ? new Date(post.publishedAt).toLocaleDateString('en-US', { 
          year: 'numeric', month: 'long', day: 'numeric' 
        }).toUpperCase()
      : ""
  }));

  return <JournalClient initialPosts={formattedPosts} />;
}

