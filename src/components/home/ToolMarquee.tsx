"use client";

import Link from "next/link";
import LogoImage from "@/components/ui/LogoImage";
import { tools } from "@/data/tools";

/** Infinite horizontal strip of tool logos. */
export default function ToolMarquee() {
  const items = [...tools, ...tools];
  return (
    <div className="relative py-2 mask-fade-x overflow-hidden">
      <div className="flex gap-3 w-max animate-marquee hover:[animation-play-state:paused]">
        {items.map((t, i) => (
          <Link
            key={`${t.slug}-${i}`}
            href={`/tools/${t.slug}`}
            className="flex items-center gap-2.5 pl-1.5 pr-4 py-1.5 rounded-full border border-border bg-surface/70 hover:border-primary/40 hover:bg-primary/5 transition-colors shrink-0"
          >
            <LogoImage src={t.logo} name={t.name} size={18} className="!rounded-full" />
            <span className="text-sm font-medium whitespace-nowrap">{t.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
