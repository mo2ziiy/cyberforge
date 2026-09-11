"use client";

import { useEffect, useRef, useState } from "react";

interface CounterProps {
  value: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  className?: string;
}

/**
 * Animates from 0 → value with an ease-out curve when scrolled into view.
 *
 * The count-up is driven by an IntersectionObserver, backed by two safety nets
 * so the number can never be left stranded at 0:
 *  - an immediate geometric check on mount (handles elements already on screen,
 *    and observers that never deliver a first entry),
 *  - a scroll/resize listener as a fallback for the same case after scrolling.
 * Whichever fires first starts the animation; the rest are torn down.
 */
export default function Counter({ value, duration = 1400, suffix = "", prefix = "", className }: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) {
      setDisplay(value);
      return;
    }

    // Respect reduced-motion: show the final value immediately.
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplay(value);
      return;
    }

    let raf = 0;
    let started = false;
    let io: IntersectionObserver | null = null;
    let fallbackTimer = 0;

    const cleanupWatchers = () => {
      io?.disconnect();
      io = null;
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (fallbackTimer) window.clearTimeout(fallbackTimer);
    };

    const run = () => {
      if (started) return;
      started = true;
      cleanupWatchers();

      const t0 = performance.now();
      const tick = (now: number) => {
        const p = Math.min(1, (now - t0) / duration);
        const eased = 1 - Math.pow(1 - p, 3);
        setDisplay(Math.round(eased * value));
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };

    /** True when any part of the element sits inside the viewport. */
    const isVisible = () => {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      const vw = window.innerWidth || document.documentElement.clientWidth;
      return r.bottom > 0 && r.top < vh && r.right > 0 && r.left < vw;
    };

    function onScroll() {
      if (isVisible()) run();
    }

    if (typeof IntersectionObserver !== "undefined") {
      io = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) run();
        },
        { threshold: 0, rootMargin: "0px 0px -10% 0px" }
      );
      io.observe(el);
    }

    // Net 1: already on screen at mount (next frame, so layout is settled).
    raf = requestAnimationFrame(() => {
      if (isVisible()) run();
    });

    // Net 2: scrolling brings it into view but the observer stayed silent.
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    // Net 3: absolute backstop — never leave a visible counter reading 0.
    fallbackTimer = window.setTimeout(() => {
      if (!started && isVisible()) run();
    }, 1200);

    return () => {
      cleanupWatchers();
      cancelAnimationFrame(raf);
    };
  }, [value, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {display.toLocaleString()}
      {suffix}
    </span>
  );
}
