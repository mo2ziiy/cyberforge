import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function GET() {
  try {
    const payload = await getCurrentUser();
    if (!payload) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    await connectDB();
    const user = await User.findById(payload.userId).select("-password");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar ?? null,
        bio: user.bio ?? null,
        location: user.location ?? null,
        website: user.website ?? null,
        github: user.github ?? null,
        twitter: user.twitter ?? null,
        bookmarks: user.bookmarks,
        favoriteTools: user.favoriteTools,
        completedTopics: user.completedTopics,
        points: user.points ?? 0,
        streak: user.streak ?? 0,
        emailVerified: user.emailVerified ?? false,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Auth me error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
