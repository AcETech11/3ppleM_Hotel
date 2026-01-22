import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

// Changed 'Request' to 'NextRequest'
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const tag = body._type;

    if (tag) {
      // Satisfying the 2-argument requirement with 'default'
      revalidateTag(tag, 'default'); 
      
      return NextResponse.json({ 
        revalidated: true, 
        now: Date.now(),
        tag: tag 
      });
    }

    return NextResponse.json({ message: "No tag provided" }, { status: 400 });
  } catch (err) {
    console.error("Revalidation Error:", err);
    return NextResponse.json({ message: "Error revalidating" }, { status: 500 });
  }
}

export const runtime = "edge";