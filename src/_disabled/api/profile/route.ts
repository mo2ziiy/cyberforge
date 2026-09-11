import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function PATCH(req: NextRequest) {
  try {
    const payload = await getCurrentUser();
    if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { name, bio, location, website, github, twitter, avatar } = body;

    if (name !== undefined && (!name || name.trim().length < 2)) {
      return NextResponse.json({ error: "Name must be at least 2 characters" }, { status: 400 });
    }

    // Validate avatar size (base64 ~300KB limit)
    if (avatar !== undefined && avatar !== null && avatar.length > 400_000) {
      return NextResponse.json({ error: "Avatar image too large (max 300KB)" }, { status: 400 });
    }

    const update: Record<string, string | null> = {};
    if (name !== undefined) update.name = name.trim();
    if (bio !== undefined) update.bio = bio?.trim() ?? null;
    if (location !== undefined) update.location = location?.trim() ?? null;
    if (website !== undefined) update.website = website?.trim() ?? null;
    if (github !== undefined) update.github = github?.trim() ?? null;
    if (twitter !== undefined) update.twitter = twitter?.trim() ?? null;
    if (avatar !== undefined) update.avatar = avatar;

    await connectDB();
    const user = await User.findByIdAndUpdate(
      payload.userId,
      update,
      { new: true }
    ).select("-password");

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Profile PATCH error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
