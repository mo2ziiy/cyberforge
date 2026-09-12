import type { NextConfig } from "next";

/**
 * Static export for GitHub Pages.
 *
 * The site is served from a project page at https://mo2ziiy.github.io/cyberforge/,
 * so production assets/routes need the "/cyberforge" base path. In local `next dev`
 * the base path is omitted so the app stays reachable at http://localhost:3000.
 *
 * This is a fully static frontend: there is no backend, authentication, or
 * database. Search runs client-side over the bundled data files, so the export
 * needs no server features (API routes, middleware, redirects).
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
