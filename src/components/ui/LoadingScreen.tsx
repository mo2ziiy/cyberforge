"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BrandMark } from "./BrandLogo";

const KEY = "cyberforge:booted";

/** First-visit boot screen. Shows once per browser session, then never again. */
export default function LoadingScreen() {
  const [show, setShow] = useState<boolean | null>(null);

  useEffect(() => {
    let booted = false;
    try {
      booted = sessionStorage.getItem(KEY) === "1";
    } catch {
      /* ignore */
    }
    if (booted) {
      const id = requestAnimationFrame(() => setShow(false));
      return () => cancelAnimationFrame(id);
    }
    const id = requestAnimationFrame(() => setShow(true));
    const timer = setTimeout(() => {
      setShow(false);
      try {
        sessionStorage.setItem(KEY, "1");
      } catch {
        /* ignore */
      }
    }, 1000);
    return () => {
      cancelAnimationFrame(id);
      clearTimeout(timer);
    };
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="boot"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.5, ease: "easeInOut" } }}
          className="fixed inset-0 z-[9999] bg-background flex flex-col items-center justify-center overflow-hidden"
        >
          <div className="absolute inset-0 bg-grid opacity-40 mask-fade-y" />
          <div className="absolute w-[32rem] h-[32rem] rounded-full blur-3xl" style={{ background: "radial-gradient(closest-side, rgb(var(--glow) / 0.16), transparent)" }} />

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex flex-col items-center gap-6"
          >
            <div className="relative">
              <div className="absolute -inset-6 rounded-[28px] border border-primary/15 animate-ping-ring" />
              <div className="[filter:drop-shadow(0_0_24px_rgb(var(--glow)/0.45))]">
                <BrandMark size={84} draw />
              </div>
            </div>

            <p className="font-display text-2xl font-bold tracking-tight">
              <span className="text-primary">Cyber</span>
              <span className="text-foreground">Forge</span>
            </p>

            <div className="w-44 h-1 bg-surface-2 rounded-full overflow-hidden border border-border">
              <motion.div
                className="h-full rounded-full"
                style={{ background: "linear-gradient(90deg, var(--primary), var(--secondary), var(--accent))" }}
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.3, ease: [0.65, 0, 0.35, 1] }}
              />
            </div>

            <p className="font-mono text-[11px] text-subtle tracking-widest uppercase">initializing secure session</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
