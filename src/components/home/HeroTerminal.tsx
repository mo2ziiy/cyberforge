"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Shield, Wifi, Lock } from "lucide-react";

type Line = { text: string; cls?: string; delay?: number };

const SCRIPT: Line[] = [
  { text: "$ cyberforge scan --target learner.local", cls: "text-foreground" },
  { text: "[+] Resolving knowledge gaps…", cls: "text-muted", delay: 500 },
  { text: "[+] 10 domains mapped", cls: "text-primary", delay: 350 },
  { text: "[+] tools/ cheatsheets/ roadmaps/ labs/ loaded", cls: "text-primary", delay: 350 },
  { text: "[!] weakness found: privilege-escalation", cls: "text-warning", delay: 600 },
  { text: "    -> roadmap: penetration-testing/intermediate", cls: "text-muted", delay: 300 },
  { text: "    -> cheat sheet: privilege-escalation", cls: "text-muted", delay: 250 },
  { text: "[ok] learning path generated  (+10 XP)", cls: "text-success", delay: 700 },
  { text: "$ _", cls: "text-foreground", delay: 900 },
];

/** Animated, looping terminal that "scans" the learner and builds a path. */
export default function HeroTerminal() {
  const [shown, setShown] = useState<Line[]>([]);

  useEffect(() => {
    let i = 0;
    let t: ReturnType<typeof setTimeout>;
    const step = () => {
      if (i >= SCRIPT.length) {
        t = setTimeout(() => {
          i = 0;
          setShown([]);
          step();
        }, 3800);
        return;
      }
      const line = SCRIPT[i];
      setShown((s) => [...s, line]);
      i += 1;
      t = setTimeout(step, line.delay ?? 400);
    };
    t = setTimeout(step, 600);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="relative w-full max-w-lg mx-auto lg:mx-0">
      {/* floating chips */}
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-5 -left-3 sm:-left-8 z-20 glass rounded-xl px-3 py-2 flex items-center gap-2 text-xs shadow-lg"
      >
        <span className="tone-icon tone-emerald w-6 h-6 rounded-md">
          <Shield size={12} />
        </span>
        <span className="font-medium">Shields up</span>
        <span className="text-success font-mono text-[10px]">100%</span>
      </motion.div>
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute -bottom-5 -right-2 sm:-right-6 z-20 glass rounded-xl px-3 py-2 flex items-center gap-2 text-xs shadow-lg"
      >
        <span className="tone-icon tone-violet w-6 h-6 rounded-md">
          <Wifi size={12} />
        </span>
        <span className="font-medium">Packets analysed</span>
        <span className="text-secondary font-mono text-[10px]">2.4k/s</span>
      </motion.div>
      <motion.div
        animate={{ y: [0, -6, 0], x: [0, 4, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute top-1/2 -right-4 sm:-right-10 z-20 glass rounded-xl p-2.5 shadow-lg hidden sm:flex"
      >
        <span className="tone-icon tone-amber w-8 h-8 rounded-lg">
          <Lock size={14} />
        </span>
      </motion.div>

      <div className="relative terminal">
        <div className="terminal-header">
          <span className="terminal-dot" style={{ background: "#ff5f57" }} />
          <span className="terminal-dot" style={{ background: "#febc2e" }} />
          <span className="terminal-dot" style={{ background: "#28c840" }} />
          <span className="ml-3 text-[11px] text-white/40 font-mono">cyberforge — zsh</span>
        </div>
        <div className="p-5 min-h-[248px] text-[12.5px] leading-[1.75] font-mono">
          {shown.map((l, i) => (
            <motion.p key={`${i}-${l.text}`} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.25 }} className={`${l.cls ?? ""} whitespace-pre`}>
              {l.text}
              {i === shown.length - 1 && <span className="inline-block w-2 h-3.5 bg-primary ml-0.5 align-middle animate-blink" />}
            </motion.p>
          ))}
        </div>
        {/* scanline */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[14px]">
          <div className="absolute left-0 right-0 h-8 opacity-30" style={{ background: "linear-gradient(180deg, transparent, rgb(var(--glow) / 0.25), transparent)", animation: "scanline 6s linear infinite" }} />
        </div>
      </div>
    </div>
  );
}
