import { NextRequest, NextResponse } from "next/server";

// Simple in-memory rate limiter (resets on server restart)
// For production, use Redis or Upstash
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

const LIMITS: Record<string, { max: number; windowMs: number }> = {
  "/api/auth/login": { max: 10, windowMs: 60_000 },         // 10 attempts/min
  "/api/auth/register": { max: 5, windowMs: 60_000 },       // 5 attempts/min
  "/api/auth/forgot-password": { max: 3, windowMs: 300_000 }, // 3 per 5min
  "/api/auth/reset-password": { max: 5, windowMs: 300_000 },  // 5 per 5min
};

function getIP(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

export function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const limit = LIMITS[pathname];

  if (limit && req.method === "POST") {
    const ip = getIP(req);
    const key = `${ip}:${pathname}`;
    const now = Date.now();
    const entry = rateLimitMap.get(key);

    if (!entry || entry.resetAt < now) {
      rateLimitMap.set(key, { count: 1, resetAt: now + limit.windowMs });
    } else {
      entry.count += 1;
      if (entry.count > limit.max) {
        const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
        return NextResponse.json(
          { error: "Too many requests. Please try again later." },
          {
            status: 429,
            headers: {
              "Retry-After": String(retryAfter),
              "X-RateLimit-Limit": String(limit.max),
              "X-RateLimit-Remaining": "0",
            },
          }
        );
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/auth/:path*"],
};
