/** Single source of truth for brand + external links. */
export const SITE = {
  name: "CyberForge",
  tagline: "Cybersecurity Knowledge Platform",
  description:
    "The ultimate cybersecurity learning platform. Tools, cheat sheets, roadmaps, labs, quizzes, and resources for every security domain — free and open.",
  email: "hello@cyberforge.dev",
  // Social profiles are placeholders — CyberForge has no live media pages yet,
  // so the links are inert ("#") while the handles stay readable for display.
  github: "#",
  githubHandle: "github.com/cyberforge",
  x: "#",
  xHandle: "@cyberforgedev",
  linkedin: "#",
  linkedinHandle: "linkedin.com/company/cyberforge",
  developer: { name: "mo2ziiiy", url: "https://mo2ziiy.github.io/mo2ziiiy/" },
} as const;

export const NAV_LINKS = [
  { href: "/tracks", label: "Tracks" },
  { href: "/tools", label: "Tools" },
  { href: "/cheatsheets", label: "Cheat Sheets" },
  { href: "/roadmaps", label: "Roadmaps" },
  { href: "/labs", label: "Labs" },
  { href: "/writeups", label: "Writeups" },
  { href: "/quiz", label: "Quiz" },
  { href: "/resources", label: "Resources" },
  { href: "/news", label: "News" },
  { href: "/glossary", label: "Glossary" },
  { href: "/certificates", label: "Certificates" },
] as const;
