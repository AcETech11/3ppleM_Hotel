import { createClient } from "next-sanity";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const apiVersion = "2024-01-01"; // or your preferred date

// Standard client for public fetching (Read-only)
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true, // Faster for public visitors
  token: process.env.SANITY_API_WRITE_TOKEN || process.env.NEXT_PUBLIC_SANITY_API_WRITE_TOKEN,
});

// Authenticated client for management tasks (Write)
export const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false, // Must be false for writes
  token: process.env.SANITY_API_WRITE_TOKEN, // The token from your .env
});


