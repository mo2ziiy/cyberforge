"use client";

import { motion } from "framer-motion";
import { type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { EASE } from "@/lib/motion";

interface PageHeaderProps {
  badge?: string;
  badgeIcon?: LucideIcon;
  title: string;
  titleHighlight?: string;
  subtitle?: string;
  centered?: boolean;
  /** Optional content rendered under the subtitle (filters, stats, actions). */
  children?: ReactNode;
}

export default function PageHeader({ badge, badgeIcon: BadgeIcon, title, titleHighlight, subtitle, centered = true, children }: PageHeaderProps) {
  return (
    <header className={`relative mb-12 ${centered ? "text-center" : ""}`}>
      {/* soft glow behind the title */}
      <div
        aria-hidden
        className={`pointer-events-none absolute -top-16 h-56 w-[36rem] max-w-full rounded-full blur-3xl opacity-60 ${
          centered ? "left-1/2 -translate-x-1/2" : "-left-24"
        }`}
        style={{ background: "radial-gradient(closest-side, rgb(var(--glow) / 0.16), transparent)" }}
      />

      {badge && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: EASE }}
          className="relative inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide text-primary bg-primary/10 border border-primary/20 mb-5 backdrop-blur-sm"
        >
          {BadgeIcon && <BadgeIcon size={13} />}
          <span className="relative flex w-1.5 h-1.5">
            <span className="absolute inset-0 rounded-full bg-primary animate-ping-ring" />
            <span className="relative w-1.5 h-1.5 rounded-full bg-primary" />
          </span>
          {badge}
        </motion.div>
      )}

      <motion.h1
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.08, ease: EASE }}
        className="relative text-section mb-3"
      >
        {title}
        {titleHighlight && (
          <>
            {" "}
            <span className="text-gradient">{titleHighlight}</span>
          </>
        )}
      </motion.h1>

      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.16, ease: EASE }}
          className={`relative text-muted text-base sm:text-lg leading-relaxed max-w-2xl ${centered ? "mx-auto" : ""}`}
        >
          {subtitle}
        </motion.p>
      )}

      {children && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.24, ease: EASE }}
          className="relative mt-8"
        >
          {children}
        </motion.div>
      )}
    </header>
  );
}
