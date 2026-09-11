"use client";

import { useState } from "react";

interface LogoImageProps {
  src: string;
  name: string;
  size?: number;
  className?: string;
}

/** External favicon/logo with graceful initials fallback. Always rendered on a white tile for legibility. */
export default function LogoImage({ src, name, size = 28, className = "" }: LogoImageProps) {
  const [error, setError] = useState(false);

  const initials = name
    .split(/[\s\-_]/)
    .filter(Boolean)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      className={`rounded-xl bg-white flex items-center justify-center shrink-0 overflow-hidden border border-border shadow-sm ${className}`}
      style={{ width: size + 12, height: size + 12 }}
    >
      {error ? (
        <span className="font-display font-bold text-slate-800" style={{ fontSize: size * 0.42 }}>
          {initials}
        </span>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={name}
          width={size}
          height={size}
          loading="lazy"
          referrerPolicy="no-referrer"
          className="object-contain"
          style={{ width: size, height: size }}
          onError={() => setError(true)}
          /*
           * Image-hover browser extensions (Hover Zoom and friends) append their
           * own class to every <img> before React hydrates, which otherwise
           * reports as an attribute mismatch on this element.
           */
          suppressHydrationWarning
        />
      )}
    </div>
  );
}
