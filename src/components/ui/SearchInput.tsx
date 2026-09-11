"use client";

import { Search, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface SearchInputProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
  size?: "md" | "lg";
  autoFocus?: boolean;
  id?: string;
}

export default function SearchInput({ value, onChange, placeholder = "Search...", className = "", size = "md", autoFocus, id }: SearchInputProps) {
  const h = size === "lg" ? "h-13 text-base pl-13 pr-12" : "h-11 text-sm pl-11 pr-11";
  return (
    <div className={`relative group ${className}`}>
      <Search
        size={size === "lg" ? 18 : 16}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-subtle group-focus-within:text-primary transition-colors pointer-events-none"
      />
      <input
        id={id}
        type="text"
        value={value}
        autoFocus={autoFocus}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`input rounded-xl ${h}`}
        style={size === "lg" ? { paddingLeft: "3.25rem", height: "3.25rem" } : undefined}
      />
      <AnimatePresence>
        {value && (
          <motion.button
            type="button"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            transition={{ duration: 0.15 }}
            onClick={() => onChange("")}
            aria-label="Clear search"
            className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-lg flex items-center justify-center text-muted hover:text-foreground hover:bg-surface-2 transition-colors"
          >
            <X size={14} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
