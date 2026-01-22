import { createClerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

export async function GET() {
  try {
    // 1. Get all users from Clerk
    const response = await clerk.users.getUserList();
    
    // 2. Map their emails to their last sign-in timestamp
    const activityMap: Record<string, number | null> = {};
    
    response.data.forEach(user => {
      user.emailAddresses.forEach(emailObj => {
        activityMap[emailObj.emailAddress.toLowerCase()] = user.lastSignInAt;
      });
    });

    return NextResponse.json(activityMap);
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch activity" }, { status: 500 });
  }
}