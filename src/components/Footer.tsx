"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Linkedin, ArrowUpRight, Mail } from "lucide-react";
import BrandLogo, { BrandMark } from "@/components/ui/BrandLogo";
import { XLogo } from "@/components/ui/XLogo";
import { GithubLogo } from "@/components/ui/GithubLogo";
import { SITE } from "@/lib/site";

const footerLinks = {
  Platform: [
    { href: "/tracks", label: "Tracks" },
    { href: "/tools", label: "Tools" },
    { href: "/cheatsheets", label: "Cheat Sheets" },
    { href: "/labs", label: "Labs & CTFs" },
    { href: "/news", label: "News" },
  ],
  Learning: [
    { href: "/roadmaps", label: "Roadmaps" },
    { href: "/resources", label: "Resources" },
    { href: "/glossary", label: "Glossary" },
    { href: "/writeups", label: "CTF Writeups" },
    { href: "/quiz", label: "Practice Quiz" },
    { href: "/certificates", label: "Certifications" },
  ],
};

export default function Footer() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => setIsLoggedIn(Boolean(data?.user)))
      .catch(() => {});
  }, []);

  const accountLinks = isLoggedIn
    ? [
        { href: "/dashboard", label: "Dashboard" },
        { href: "/profile", label: "Profile" },
      ]
    : [
        { href: "/sign-in", label: "Sign in" },
        { href: "/sign-up", label: "Create account" },
        { href: "/reset-password", label: "Reset password" },
      ];

  const socials = [
    { href: SITE.github, label: "GitHub", Icon: GithubLogo },
    { href: SITE.x, label: "X", Icon: XLogo },
    { href: SITE.linkedin, label: "LinkedIn", Icon: Linkedin },
    { href: `mailto:${SITE.email}`, label: "Email", Icon: Mail },
  ];

  return (
    <footer className="relative border-t border-border overflow-hidden mt-10">
      <div className="absolute inset-0 bg-surface/60" />
      <div className="absolute inset-0 bg-grid opacity-25 mask-fade-y" />
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, rgb(var(--glow) / 0.5), transparent)" }} />
      <div className="absolute -bottom-32 left-1/2 -translate-x-1/2 w-[40rem] h-[16rem] rounded-full blur-3xl pointer-events-none" style={{ background: "rgb(var(--glow) / 0.08)" }} />

      {/* Giant watermark */}
      <div className="absolute -bottom-10 -right-6 opacity-[0.035] pointer-events-none select-none hidden lg:block" aria-hidden>
        <BrandMark size={320} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-10 mb-14">
          <div className="col-span-2">
            <div className="mb-5">
              <BrandLogo size={40} subtitle="Security platform" />
            </div>
            <p className="text-sm text-muted leading-relaxed max-w-xs mb-6">
              The reference platform for security professionals, students, and enthusiasts. Learn, practice, and grow — all for free.
            </p>

            <div className="flex gap-2 mb-6">
              {socials.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  onClick={href === "#" ? (e) => e.preventDefault() : undefined}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-10 h-10 rounded-xl border border-border bg-surface/60 flex items-center justify-center text-muted hover:text-primary hover:border-primary/40 hover:-translate-y-0.5 hover:shadow-[0_8px_20px_-10px_rgb(var(--glow)/0.6)] transition-all"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full tone-badge tone-emerald">
              <span className="relative flex w-1.5 h-1.5">
                <span className="absolute inset-0 rounded-full bg-current animate-ping-ring" />
                <span className="relative w-1.5 h-1.5 rounded-full bg-current" />
              </span>
              Free &amp; open source
            </div>
          </div>

          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section} className="md:col-span-1">
              <h3 className="footer-heading">{section}</h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-muted hover:text-foreground link-underline transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="md:col-span-1">
            <h3 className="footer-heading">Account</h3>
            <ul className="space-y-2.5">
              {accountLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted hover:text-foreground link-underline transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-2 md:col-span-1">
            <h3 className="footer-heading">Contact</h3>
            <div className="flex flex-col items-start gap-3">
              <a href={`mailto:${SITE.email}`} className="block text-sm text-muted hover:text-primary transition-colors break-all">
                {SITE.email}
              </a>
              <p className="text-xs text-subtle leading-relaxed">Bug reports, suggestions and contributions are always welcome.</p>
            </div>
          </div>
        </div>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center">
            <div className="px-4 bg-surface flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-primary/50" />
              <BrandMark size={18} />
              <span className="w-1 h-1 rounded-full bg-primary/50" />
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted">
          <p>
            &copy; {new Date().getFullYear()} {SITE.name}. Built for the security community.
          </p>
          <p className="flex items-center gap-1.5">
            Developed by
            <a
              href={SITE.developer.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-0.5 text-primary hover:text-primary-dark transition-colors font-semibold"
            >
              {SITE.developer.name}
              <ArrowUpRight size={12} />
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
