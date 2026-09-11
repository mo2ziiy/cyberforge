"use client";

import { useEffect, useState } from "react";

interface TypeWriterProps {
  words: string[];
  typeMs?: number;
  eraseMs?: number;
  holdMs?: number;
  className?: string;
}

/** Type → hold → erase → next word. Single timer, no cascading renders. */
export default function TypeWriter({ words, typeMs = 70, eraseMs = 38, holdMs = 2000, className = "" }: TypeWriterProps) {
  const [state, setState] = useState({ w: 0, len: 0, erasing: false });

  useEffect(() => {
    const target = words[state.w];
    let delay = state.erasing ? eraseMs : typeMs;
    if (!state.erasing && state.len === target.length) delay = holdMs;
    if (state.erasing && state.len === 0) delay = 260;

    const t = setTimeout(() => {
      setState((s) => {
        const word = words[s.w];
        if (!s.erasing) {
          if (s.len < word.length) return { ...s, len: s.len + 1 };
          return { ...s, erasing: true };
        }
        if (s.len > 0) return { ...s, len: s.len - 1 };
        return { w: (s.w + 1) % words.length, len: 0, erasing: false };
      });
    }, delay);
    return () => clearTimeout(t);
  }, [state, words, typeMs, eraseMs, holdMs]);

  return (
    <span className={className}>
      {words[state.w].slice(0, state.len)}
      <span className="inline-block w-[3px] bg-primary ml-1 align-baseline animate-blink rounded-sm" style={{ height: "0.8em" }} />
    </span>
  );
}
