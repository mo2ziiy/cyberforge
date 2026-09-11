"use client";

import { motion } from "framer-motion";

interface FilterBarProps {
  label?: string;
  options: string[];
  active: string;
  onChange: (val: string) => void;
  layoutId: string;
  color?: "primary" | "secondary" | "accent";
  className?: string;
  /** On mobile, keep pills on one line and scroll horizontally instead of wrapping. */
  scrollable?: boolean;
}

const bg = { primary: "bg-primary", secondary: "bg-secondary", accent: "bg-accent" };
const fg = { primary: "text-on-primary", secondary: "text-white", accent: "text-white" };

/** Horizontal pill filter with a sliding active indicator. */
export default function FilterBar({ label, options, active, onChange, layoutId, color = "primary", className = "", scrollable = false }: FilterBarProps) {
  return (
    <div className={`${scrollable ? "filter-tabs-container w-full" : ""} ${className}`}>
      {label && <p className="eyebrow mb-2.5">{label}</p>}
      <div className={scrollable ? "filter-tabs sm:flex-wrap sm:justify-center" : "flex flex-wrap gap-1.5"}>
        {options.map((opt) => {
          const on = active === opt;
          return (
            <button
              key={opt}
              onClick={() => onChange(opt)}
              className={`relative px-3.5 py-1.5 text-sm rounded-full font-medium transition-colors duration-200 ${
                on ? fg[color] : "text-muted hover:text-foreground border border-border hover:border-border-strong hover:bg-surface-2"
              }`}
            >
              {on && (
                <motion.span
                  layoutId={layoutId}
                  className={`absolute inset-0 ${bg[color]} rounded-full shadow-[0_6px_18px_-8px_rgb(var(--glow)/0.7)]`}
                  transition={{ type: "spring", stiffness: 420, damping: 32 }}
                />
              )}
              <span className="relative z-10">{opt}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
