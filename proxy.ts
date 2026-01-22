import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createClient } from "next-sanity";

// We need a lightweight client for the middleware
const readClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2023-05-03',
  useCdn: false, // Set to false to ensure instant access after adding staff
});

const isManagementRoute = createRouteMatcher(['/management(.*)']);

export default clerkMiddleware(async (auth, req) => {
  if (isManagementRoute(req)) {
    const session = await auth();
    if (!session.userId) return session.redirectToSignIn();

    const userEmail = session.sessionClaims?.email as string;

    // 1. Check if it's the "Super Admin" (The Boss - always has access)
    const superAdmins = ["henrymmerigwo4@gmail.com", "fastrivestudio@gmail.com"];
    if (superAdmins.includes(userEmail?.toLowerCase())) {
      return NextResponse.next();
    }

    // 2. Query Sanity to see if this email is in the "staff" list
    const query = `*[_type == "staff" && email == $email][0]`;
    const staffMember = await readClient.fetch(query, { email: userEmail?.toLowerCase() });

    // 3. If they aren't a Super Admin and not in Sanity, block them
    if (!staffMember) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }
});

export const config = {
  matcher: ['/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)', '/(api|trpc)(.*)'],
};