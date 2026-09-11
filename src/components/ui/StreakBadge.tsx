"use client";

import { Flame } from "lucide-react";
import { motion } from "framer-motion";

interface StreakBadgeProps {
  streak: number;
  showLabel?: boolean;
}

export default function StreakBadge({ streak, showLabel = true }: StreakBadgeProps) {
  if (streak === 0) return null;

  return (
    <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="streak-badge" title={`${streak}-day streak`}>
      <Flame size={13} className="animate-flame" />
      <span className="tabular-nums">{streak}</span>
      {showLabel && <span className="hidden sm:inline font-medium">day streak</span>}
    </motion.div>
  );
}
