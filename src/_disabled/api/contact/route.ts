import { NextRequest, NextResponse } from "next/server";
import { sendContactEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("[Contact] Received:", body);

    const { name, email, subject, message } = body;

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    console.log("[Contact] Sending email...");
    await sendContactEmail({ name, email, subject, message });
    console.log("[Contact] Email sent successfully");

    return NextResponse.json({ message: "Message sent successfully" });
  } catch (error) {
    console.error("[Contact] Error:", error);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
