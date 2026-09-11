import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function GET(req: NextRequest) {
  try {
    const token = req.nextUrl.searchParams.get("token");
    if (!token) return NextResponse.json({ error: "Token required" }, { status: 400 });

    await connectDB();
    const user = await User.findOne({ emailVerifyToken: token });
    if (!user) return NextResponse.json({ error: "Invalid token" }, { status: 400 });

    user.emailVerified = true;
    user.emailVerifyToken = undefined;
    await user.save();

    return NextResponse.json({ message: "Email verified successfully." });
  } catch (error) {
    console.error("Verify email error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
