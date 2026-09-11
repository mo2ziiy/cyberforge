"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Wrench,
  FileText,
  FlaskConical,
  BookMarked,
  Flag,
  BookOpen,
  Newspaper,
  ArrowRight,
  CornerDownLeft,
  Map,
  Brain,
  Award,
  Compass,
  ExternalLink,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { NAV_LINKS } from "@/lib/site";

interface SearchResult {
  type: string;
  title: string;
  description: string;
  href: string;
  category: string;
}

const typeMeta: Record<string, { icon: React.ElementType; tone: string; label: string }> = {
  tool: { icon: Wrench, tone: "tone-cyan", label: "Tool" },
  cheatsheet: { icon: FileText, tone: "tone-violet", label: "Cheat sheet" },
  lab: { icon: FlaskConical, tone: "tone-green", label: "Lab" },
  resource: { icon: BookMarked, tone: "tone-orange", label: "Resource" },
  writeup: { icon: Flag, tone: "tone-red", label: "Writeup" },
  glossary: { icon: BookOpen, tone: "tone-purple", label: "Glossary" },
  news: { icon: Newspaper, tone: "tone-sky", label: "News" },
};

const quickIcons: Record<string, React.ElementType> = {
  "/tracks": Compass,
  "/tools": Wrench,
  "/cheatsheets": FileText,
  "/roadmaps": Map,
  "/labs": FlaskConical,
  "/writeups": Flag,
  "/quiz": Brain,
  "/resources": BookMarked,
  "/news": Newspaper,
  "/glossary": BookOpen,
  "/certificates": Award,
};

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function CommandPalette({ open, onClose }: Props) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // items shown: either search results or quick links
  const quick = NAV_LINKS.map((l) => ({ type: "page", title: l.label, description: `Go to ${l.label}`, href: l.href, category: "Navigate" }));
  const items: SearchResult[] = query.trim() ? results : quick;

  useEffect(() => {
    if (!open) return;
    const id = requestAnimationFrame(() => inputRef.current?.focus());
    return () => cancelAnimationFrame(id);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const search = useCallback((q: string) => {
    if (!q.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    fetch(`/api/search?q=${encodeURIComponent(q.trim())}`)
      .then((r) => r.json())
      .then((d) => setResults((d.results ?? []).slice(0, 12)))
      .catch(() => setResults([]))
      .finally(() => setLoading(false));
  }, []);

  const onChange = (v: string) => {
    setQuery(v);
    setActive(0);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => search(v), 220);
  };

  const go = useCallback(
    (item: SearchResult) => {
      onClose();
      setQuery("");
      setResults([]);
      if (item.href.startsWith("http")) window.open(item.href, "_blank", "noopener,noreferrer");
      else router.push(item.href);
    },
    [onClose, router]
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowDown") {
        e.preventDefault();
        setActive((a) => Math.min(a + 1, items.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActive((a) => Math.max(a - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (items[active]) go(items[active]);
        else if (query.trim()) {
          onClose();
          router.push(`/search?q=${encodeURIComponent(query.trim())}`);
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, items, active, go, onClose, query, router]);

  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>(`[data-idx="${active}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [active]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 z-[100] flex items-start justify-center pt-[12vh] px-4"
          onMouseDown={onClose}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            onMouseDown={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl glass-strong rounded-2xl overflow-hidden hairline-top"
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
          >
            <div className="flex items-center gap-3 px-4 h-14 border-b border-border">
              {loading ? (
                <div className="w-4 h-4 rounded-full border-2 border-primary/30 border-t-primary animate-spin shrink-0" />
              ) : (
                <Search size={17} className="text-subtle shrink-0" />
              )}
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Search tools, cheat sheets, labs, writeups, glossary…"
                className="flex-1 bg-transparent outline-none text-[15px] placeholder:text-subtle"
                aria-label="Search"
              />
              <kbd className="hidden sm:inline-flex">Esc</kbd>
            </div>

            <div ref={listRef} className="max-h-[52vh] overflow-y-auto p-2">
              {!query.trim() && <p className="eyebrow px-3 pt-2 pb-2 text-[10px]">Quick navigation</p>}
              {query.trim() && !loading && items.length === 0 && (
                <div className="py-12 text-center">
                  <p className="text-sm text-muted">
                    No matches for <span className="text-foreground font-medium">&ldquo;{query}&rdquo;</span>
                  </p>
                </div>
              )}
              {items.map((item, i) => {
                const meta = typeMeta[item.type];
                const Icon = meta?.icon ?? quickIcons[item.href] ?? ArrowRight;
                const on = i === active;
                const external = item.href.startsWith("http");
                return (
                  <button
                    key={`${item.href}-${i}`}
                    data-idx={i}
                    onMouseEnter={() => setActive(i)}
                    onClick={() => go(item)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors ${on ? "bg-primary/10" : "hover:bg-surface-2"}`}
                  >
                    <span className={`tone-icon w-9 h-9 rounded-lg shrink-0 ${meta?.tone ?? "tone-primary"}`}>
                      <Icon size={15} />
                    </span>
                    <span className="flex-1 min-w-0">
                      <span className="block text-sm font-medium text-foreground truncate">{item.title}</span>
                      <span className="block text-xs text-muted truncate">{item.description}</span>
                    </span>
                    <span className="hidden sm:flex items-center gap-2 shrink-0">
                      <span className="text-[10px] uppercase tracking-wider text-subtle">{meta?.label ?? item.category}</span>
                      {external ? <ExternalLink size={12} className="text-subtle" /> : on && <CornerDownLeft size={13} className="text-primary" />}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between px-4 py-2.5 border-t border-border text-[11px] text-subtle">
              <span className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <kbd>
                    <ArrowUp size={9} />
                  </kbd>
                  <kbd>
                    <ArrowDown size={9} />
                  </kbd>
                  navigate
                </span>
                <span className="flex items-center gap-1">
                  <kbd>
                    <CornerDownLeft size={9} />
                  </kbd>
                  open
                </span>
              </span>
              {query.trim() && (
                <button
                  onClick={() => {
                    onClose();
                    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
                  }}
                  className="flex items-center gap-1 text-primary hover:underline"
                >
                  All results <ArrowRight size={11} />
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
