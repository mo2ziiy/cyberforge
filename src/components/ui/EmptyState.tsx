"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { SearchX } from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function EmptyState({ icon: Icon = SearchX, title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="text-center py-16 px-4"
    >
      <div className="relative w-20 h-20 mx-auto mb-5">
        <div className="absolute inset-0 rounded-full bg-primary/10 animate-ping-ring" />
        <div className="relative w-20 h-20 rounded-2xl card flex items-center justify-center">
          <Icon size={30} className="text-subtle" />
        </div>
      </div>
      <p className="font-display font-semibold text-lg">{title}</p>
      {description && <p className="text-sm text-muted mt-1.5 max-w-sm mx-auto">{description}</p>}
      {actionLabel && onAction && (
        <button onClick={onAction} className="btn btn-outline btn-sm mt-5">
          {actionLabel}
        </button>
      )}
    </motion.div>
  );
}
