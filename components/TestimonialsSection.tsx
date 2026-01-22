// Testimonials.tsx (Server Component)
import { client } from "@/lib/sanity/client";
import TestimonialsClient from "./Testimonials";

export default async function Testimonials() {
  const query = `*[_type == "guestVoice" && rating >= 4] | order(_createdAt desc)[0...6] {
    guestName, role, quote, rating
  }`;

  // Fetching on the server with the revalidation tag
  const reviews = await client.fetch(query, {}, {
    next: { 
      tags: ["guestVoice"],
      // Optional: Backup revalidation every hour
      revalidate: 3600 
    }
  });

  return <TestimonialsClient initialReviews={reviews} />;
}