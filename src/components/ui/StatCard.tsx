"use client";

import { motion } from "framer-motion";
import { type LucideIcon } from "lucide-react";
import Counter from "./Counter";
import type { Tone } from "@/lib/palette";
import { EASE } from "@/lib/motion";

interface StatCardProps {
  label: string;
  value: number;
  suffix?: string;
  icon: LucideIcon;
  tone?: Tone;
  delay?: number;
}

export default function StatCard({ label, value, suffix = "", icon: Icon, tone = "primary", delay = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.55, delay, ease: EASE }}
      className={`card card-hover p-5 text-center tone-${tone} group`}
    >
      <div className="tone-icon w-11 h-11 rounded-xl mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
        <Icon size={20} />
      </div>
      <div className="font-display text-3xl font-bold tone-text tabular-nums">
        <Counter value={value} suffix={suffix} />
      </div>
      <div className="text-xs text-muted font-medium mt-1">{label}</div>
    </motion.div>
  );
}
