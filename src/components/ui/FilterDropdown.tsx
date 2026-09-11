"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SlidersHorizontal, X, ChevronDown, RotateCcw } from "lucide-react";

export interface FilterGroup {
  label: string;
  options: string[];
  active: string;
  onChange: (val: string) => void;
  color?: "primary" | "secondary" | "accent";
}

interface FilterDropdownProps {
  groups: FilterGroup[];
}

const activeClass: Record<string, string> = {
  primary: "bg-primary text-on-primary border-transparent shadow-[0_6px_18px_-8px_rgb(var(--glow)/0.8)]",
  secondary: "bg-secondary text-white border-transparent",
  accent: "bg-accent text-white border-transparent",
};

export default function FilterDropdown({ groups }: FilterDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const activeCount = groups.filter((g) => g.active !== "All").length;

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <div className="relative shrink-0" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className={`flex items-center gap-2 h-11 px-4 rounded-xl border font-medium text-sm transition-all ${
          open || activeCount > 0
            ? "bg-primary/10 border-primary/40 text-foreground"
            : "border-border bg-surface/60 text-muted hover:text-foreground hover:border-border-strong"
        }`}
      >
        <SlidersHorizontal size={15} />
        <span>Filters</span>
        {activeCount > 0 && (
          <span className="w-5 h-5 rounded-full bg-primary text-on-primary text-[11px] font-bold flex items-center justify-center">{activeCount}</span>
        )}
        <ChevronDown size={14} className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="absolute right-0 top-[calc(100%+8px)] z-50 w-80 max-w-[calc(100vw-2rem)] glass-strong rounded-2xl overflow-hidden"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <span className="text-sm font-semibold">Refine results</span>
              <div className="flex items-center gap-1">
                {activeCount > 0 && (
                  <button
                    onClick={() => groups.forEach((g) => g.onChange("All"))}
                    className="flex items-center gap-1 text-xs text-muted hover:text-primary transition-colors px-2 py-1 rounded-md hover:bg-surface-2"
                  >
                    <RotateCcw size={11} /> Reset
                  </button>
                )}
                <button onClick={() => setOpen(false)} className="icon-btn w-7 h-7 rounded-md" aria-label="Close filters">
                  <X size={13} />
                </button>
              </div>
            </div>

            <div className="p-4 space-y-4 max-h-[60vh] overflow-y-auto">
              {groups.map((group) => (
                <div key={group.label}>
                  <p className="eyebrow mb-2.5 text-[10px]">{group.label}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {group.options.map((opt) => {
                      const on = group.active === opt;
                      return (
                        <button
                          key={opt}
                          onClick={() => group.onChange(opt)}
                          className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                            on ? activeClass[group.color ?? "primary"] : "border-border text-muted hover:text-foreground hover:border-border-strong hover:bg-surface-2"
                          }`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
