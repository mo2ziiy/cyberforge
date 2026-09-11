"use client";

import { useState } from "react";
import { Newspaper } from "lucide-react";
import { newsCategoryTone } from "@/lib/palette";

/** Article image with a themed placeholder fallback when the remote image fails. */
export default function NewsImage({ src, title, category }: { src: string; title: string; category: string }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className={`w-full h-full flex items-center justify-center tone-gradient tone-${newsCategoryTone[category] ?? "slate"}`}>
        <Newspaper size={40} className="tone-text opacity-40" />
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={title}
      loading="lazy"
      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      onError={() => setFailed(true)}
      suppressHydrationWarning
    />
  );
}
