import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Tool from "@/models/Tool";

export async function POST(req: NextRequest) {
  try {
    const payload = await getCurrentUser();
    if (!payload || payload.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    await connectDB();

    const tool = await Tool.create(body);
    return NextResponse.json({ tool }, { status: 201 });
  } catch (error) {
    console.error("Admin add tool error:", error);
    return NextResponse.json({ error: "Failed to add tool" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const payload = await getCurrentUser();
    if (!payload || payload.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await connectDB();
    const tools = await Tool.find().sort({ createdAt: -1 });
    return NextResponse.json({ tools });
  } catch (error) {
    console.error("Admin get tools error:", error);
    return NextResponse.json({ error: "Failed to get tools" }, { status: 500 });
  }
}
