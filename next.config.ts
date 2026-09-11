import type { NextConfig } from "next";

/**
 * Static export for GitHub Pages.
 *
 * The site is served from a project page at https://mo2ziiy.github.io/cyberforge/,
 * so production assets/routes need the "/cyberforge" base path. In local `next dev`
 * the base path is omitted so the app stays reachable at http://localhost:3000.
 *
 * Server features (API routes, middleware, redirects) are not available on a static
 * host — the backend code is kept under src/_disabled/ for a future real deployment.
 */
const repo = "cyberforge";
const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  basePath: isProd ? `/${repo}` : undefined,
};

export default nextConfig;
