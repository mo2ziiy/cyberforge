"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { Home, ArrowLeft, Search, Compass, Wrench, Map, FlaskConical, FileText } from "lucide-react";
import { BrandMark } from "@/components/ui/BrandLogo";
import { EASE } from "@/lib/motion";

const quickLinks = [
  { href: "/tracks", label: "Tracks", Icon: Compass },
  { href: "/tools", label: "Tools", Icon: Wrench },
  { href: "/roadmaps", label: "Roadmaps", Icon: Map },
  { href: "/labs", label: "Labs", Icon: FlaskConical },
  { href: "/cheatsheets", label: "Cheat Sheets", Icon: FileText },
];

export default function NotFound() {
  const pathname = usePathname();
  return (
    <div className="relative min-h-[82vh] flex items-center justify-center px-4 overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-40 mask-fade-y pointer-events-none" />

      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, ease: EASE }} className="relative text-center max-w-xl w-full">
        {/* glitchy 404 */}
        <div className="relative mb-6 select-none">
          <p className="font-display text-[8rem] sm:text-[10rem] leading-none font-bold text-gradient opacity-90">404</p>
          <p className="absolute inset-0 font-display text-[8rem] sm:text-[10rem] leading-none font-bold text-primary/30 blur-sm animate-pulse-soft" aria-hidden>
            404
          </p>
          <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 opacity-10">
            <BrandMark size={220} />
          </div>
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} className="terminal inline-block px-4 py-2.5 mb-6 text-left">
          <span className="font-mono text-sm">
            <span className="text-success">$</span> <span className="text-foreground/80">access</span> <span className="text-primary">{pathname || "/unknown"}</span>
            <br />
            <span className="text-danger">error:</span> <span className="text-muted">ENOENT — route not found</span>
            <span className="inline-block w-2 h-3.5 bg-primary ml-1 align-middle animate-blink" />
          </span>
        </motion.div>

        <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="font-display text-2xl font-bold mb-2">
          This page slipped through the firewall
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-muted mb-8 leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist or has been moved. Let&apos;s get you back on track.
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/" className="btn btn-primary">
            <Home size={16} />
            Back to home
          </Link>
          <button onClick={() => window.history.back()} className="btn btn-outline">
            <ArrowLeft size={16} />
            Go back
          </button>
          <Link href="/search" className="btn btn-ghost">
            <Search size={16} />
            Search
          </Link>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-10 pt-6 border-t border-border">
          <p className="eyebrow justify-center mb-4 text-[10px]">Quick links</p>
          <div className="flex flex-wrap justify-center gap-2">
            {quickLinks.map(({ href, label, Icon }) => (
              <Link key={href} href={href} className="chip hover:text-primary py-1.5 px-3">
                <Icon size={12} />
                {label}
              </Link>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
