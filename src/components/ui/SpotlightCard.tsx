"use client";

import { useRef, type ReactNode, type MouseEvent } from "react";

interface SpotlightCardProps {
  children: ReactNode;
  className?: string;
  /** Adds the animated conic gradient border on hover. */
  gradientBorder?: boolean;
  hover?: boolean;
}

/**
 * Card with a cursor-following radial highlight. Sets --mx/--my on the element,
 * consumed by `.spotlight::before` in globals.css.
 */
export default function SpotlightCard({ children, className = "", gradientBorder = false, hover = true }: SpotlightCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      className={`card spotlight ${hover ? "card-hover" : ""} ${gradientBorder ? "gradient-border" : ""} ${className}`}
    >
      {children}
    </div>
  );
}
