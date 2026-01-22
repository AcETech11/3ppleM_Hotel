import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const tag = body._type;

    if (tag) {
      // The second argument '' handles that TS error we saw earlier
      revalidateTag(tag, ''); 
      return NextResponse.json({ revalidated: true, now: Date.now() });
    }

    return NextResponse.json({ message: "No tag provided" }, { status: 400 });
  } catch (err) {
    return NextResponse.json({ message: "Error revalidating" }, { status: 500 });
  }
}

// This line is the most important for the error you're seeing:
export const runtime = "edge";