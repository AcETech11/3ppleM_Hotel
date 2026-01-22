import { createClient } from "next-sanity";
import { NextResponse } from "next/server";
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
  apiVersion: '2023-05-03',
});

export async function POST(req: Request) {
  try {
    const text = await req.text();
    if (!text) return NextResponse.json({ error: "Empty body" }, { status: 400 });
    
    const data = JSON.parse(text);

    // 1. Create in Sanity
    await writeClient.create({
      _type: "guestVoice",
      guestName: data.guestName,
      role: data.role,
      quote: data.quote,
      rating: data.rating,
      email: data.email || "",
      phone: data.phone || "",
      status: "new"
    });

    // 2. Handle Emails
    if (data.rating < 4) {
  const emailString = process.env.MANAGEMENT_EMAILS || "";
  const managementEmails = emailString
    .split(',')
    .map(email => email.trim())
    .filter(email => email.length > 0);

  const { data: emailData, error } = await resend.emails.send({
    // While testing, keep this as onboarding@resend.dev
    from: 'Hotel Alert <onboarding@resend.dev>', 
    to: managementEmails,
    subject: `🚨 Urgent: ${data.rating}-Star Feedback`,
    html: `<h3>New Feedback from ${data.guestName}</h3><p>${data.quote}</p>`
  });

  if (error) {
    // If it's the "Only send to yourself" error, we print a clear reminder
    if (error.name === "validation_error") {
      console.warn("⚠️ RESEND TESTING LIMIT: You can only send to henrymmerigwo4@gmail.com until the domain is verified.");
    } else {
      console.error("Resend Error:", error);
    }
    // Note: We don't 'throw' here anymore so the user still gets their "Thank You" screen
  }
}

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Full API Error Details:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}