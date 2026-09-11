"use client";

import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";
import { fadeUp, viewportOnce } from "@/lib/motion";

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  variants?: Variants;
  /** Animate immediately on mount rather than when scrolled into view. */
  immediate?: boolean;
  as?: "div" | "section" | "li" | "span";
}

/** Scroll-triggered entrance. Uses shared motion tokens so everything feels the same. */
export default function Reveal({ children, className, delay = 0, variants = fadeUp, immediate = false, as = "div" }: RevealProps) {
  const Comp = motion[as];
  return (
    <Comp
      className={className}
      variants={variants}
      initial="hidden"
      {...(immediate ? { animate: "visible" } : { whileInView: "visible", viewport: viewportOnce })}
      transition={{ delay }}
    >
      {children}
    </Comp>
  );
}
