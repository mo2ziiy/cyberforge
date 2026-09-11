"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

interface CopyButtonProps {
  text: string;
  className?: string;
  label?: boolean;
}

export default function CopyButton({ text, className = "", label = false }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={copied ? "Copied" : "Copy to clipboard"}
      className={`inline-flex items-center gap-1.5 rounded-lg text-xs font-medium transition-all ${
        copied ? "text-success" : "text-muted hover:text-foreground"
      } ${label ? "px-2.5 py-1.5 border border-border hover:border-border-strong bg-surface/60" : "w-7 h-7 justify-center hover:bg-surface-2"} ${className}`}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={copied ? "ok" : "copy"}
          initial={{ scale: 0.6, opacity: 0, rotate: -20 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          exit={{ scale: 0.6, opacity: 0, rotate: 20 }}
          transition={{ duration: 0.15 }}
          className="inline-flex"
        >
          {copied ? <Check size={13} /> : <Copy size={13} />}
        </motion.span>
      </AnimatePresence>
      {label && (copied ? "Copied" : "Copy")}
    </button>
  );
}
