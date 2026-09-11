import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { awardPoints, deductPoints } from "@/lib/gamification";

export async function POST(req: NextRequest) {
  try {
    const payload = await getCurrentUser();
    if (!payload) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { id, type } = await req.json();

    await connectDB();
    const user = await User.findById(payload.userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    let isAdding = false;
    let isRemoving = false;

    if (type === "bookmark") {
      const idx = user.bookmarks.indexOf(id);
      if (idx > -1) {
        user.bookmarks.splice(idx, 1);
        isRemoving = true;
      } else {
        user.bookmarks.push(id);
        isAdding = true;
      }
    } else if (type === "favoriteTool") {
      const idx = user.favoriteTools.indexOf(id);
      if (idx > -1) {
        user.favoriteTools.splice(idx, 1);
        isRemoving = true;
      } else {
        user.favoriteTools.push(id);
        isAdding = true;
      }
    } else if (type === "completedTopic") {
      const idx = user.completedTopics.indexOf(id);
      if (idx > -1) {
        user.completedTopics.splice(idx, 1);
        isRemoving = true;
      } else {
        user.completedTopics.push(id);
        isAdding = true;
      }
    }

    await user.save();

    if (isAdding) {
      if (type === "completedTopic") {
        await awardPoints(payload.userId, "completeTopic", `Completed: ${id}`);
      } else if (type === "favoriteTool") {
        await awardPoints(payload.userId, "favoriteTool", `Favorited: ${id}`);
      } else if (type === "bookmark") {
        await awardPoints(payload.userId, "bookmark", `Bookmarked: ${id}`);
      }
    } else if (isRemoving) {
      if (type === "completedTopic") {
        await deductPoints(payload.userId, "completeTopic");
      } else if (type === "favoriteTool") {
        await deductPoints(payload.userId, "favoriteTool");
      } else if (type === "bookmark") {
        await deductPoints(payload.userId, "bookmark");
      }
    }

    // Get updated points
    const updated = await User.findById(payload.userId).select("points");

    return NextResponse.json({
      bookmarks: user.bookmarks,
      favoriteTools: user.favoriteTools,
      completedTopics: user.completedTopics,
      points: updated?.points ?? 0,
    });
  } catch (error) {
    console.error("Bookmark error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
