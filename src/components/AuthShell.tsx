"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import BrandLogo, { BrandMark } from "@/components/ui/BrandLogo";
import ParticleBackground from "@/components/ui/ParticleBackground";
import { EASE } from "@/lib/motion";

interface Feature {
  icon: LucideIcon;
  text: string;
}

interface AuthShellProps {
  heading: ReactNode;
  description: string;
  features?: Feature[];
  /** Card heading shown on desktop */
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
  /** Compact single-column variant (forgot/reset/verify). */
  compact?: boolean;
}

/** Shared two-panel layout for all auth screens. */
export default function AuthShell({ heading, description, features = [], title, subtitle, children, footer, compact = false }: AuthShellProps) {
  return (
    <div className="relative min-h-[88vh] flex items-center justify-center px-4 py-12 overflow-hidden">
      <ParticleBackground />
      <div className="absolute -top-20 left-1/4 w-[28rem] h-[28rem] rounded-full blur-3xl pointer-events-none" style={{ background: "rgb(var(--glow) / 0.10)" }} />

      <div className={`relative w-full ${compact ? "max-w-md" : "max-w-5xl grid lg:grid-cols-[1.05fr_1fr] gap-10 items-center"}`}>
        {!compact && (
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55, ease: EASE }}
            className="hidden lg:flex flex-col justify-center"
          >
            <div className="mb-10">
              <BrandLogo size={44} textClassName="text-xl" subtitle="Security platform" />
            </div>
            <h2 className="font-display text-4xl font-bold leading-[1.05] tracking-tight mb-5">{heading}</h2>
            <p className="text-muted leading-relaxed mb-9 max-w-md">{description}</p>

            <ul className="space-y-3">
              {features.map(({ icon: Icon, text }, i) => (
                <motion.li
                  key={text}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25 + i * 0.08, ease: EASE }}
                  className="flex items-center gap-3 text-sm text-muted"
                >
                  <span className="tone-icon tone-primary w-9 h-9 rounded-lg shrink-0">
                    <Icon size={15} />
                  </span>
                  {text}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.08, ease: EASE }} className="w-full">
          <div className={`flex flex-col items-center mb-8 ${compact ? "" : "lg:hidden"}`}>
            <div className="rounded-2xl border border-border shadow-lg overflow-hidden mb-4">
              <BrandMark size={56} />
            </div>
            <h1 className="font-display text-xl font-bold">{title}</h1>
            {subtitle && <p className="text-muted text-sm mt-1 text-center max-w-xs">{subtitle}</p>}
          </div>

          <div className="card hairline-top p-7 sm:p-8 backdrop-blur-sm bg-surface/85 shadow-[var(--shadow-lg)]">
            {!compact && (
              <div className="hidden lg:block mb-7">
                <h1 className="font-display text-2xl font-bold">{title}</h1>
                {subtitle && <p className="text-muted text-sm mt-1">{subtitle}</p>}
              </div>
            )}
            {children}
            {footer && <div className="mt-6 pt-5 border-t border-border text-center text-sm text-muted">{footer}</div>}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
