"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/**
 * Replays a short fade-in on every route change.
 *
 * Keying on the pathname remounts the wrapper, which restarts the CSS
 * animation — without it the animation only ever runs on the first paint and
 * subsequent navigations land with a hard content swap.
 */
export default function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return (
    <main key={pathname} className="page-transition flex-1 relative z-10">
      {children}
    </main>
  );
}
