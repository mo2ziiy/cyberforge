"use client";

import { useState, useEffect, Suspense, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Wrench, FileText, FlaskConical, BookMarked, Flag, BookOpen, Newspaper, ArrowUpRight, ArrowRight, type LucideIcon } from "lucide-react";
import { tools } from "@/data/tools";
import { cheatsheets } from "@/data/cheatsheets";
import { labs } from "@/data/labs";
import { resources } from "@/data/resources";
import { fadeUp, stagger } from "@/lib/motion";
import { performSearch, type ResultType } from "@/lib/search";
import SearchInput from "@/components/ui/SearchInput";
import EmptyState from "@/components/ui/EmptyState";
import { PageSpinner } from "@/components/ui/SkeletonCard";

const typeMeta: Record<ResultType, { icon: LucideIcon; tone: string; label: string }> = {
  tool: { icon: Wrench, tone: "tone-cyan", label: "Tools" },
  cheatsheet: { icon: FileText, tone: "tone-violet", label: "Cheat sheets" },
  lab: { icon: FlaskConical, tone: "tone-green", label: "Labs" },
  resource: { icon: BookMarked, tone: "tone-orange", label: "Resources" },
  writeup: { icon: Flag, tone: "tone-red", label: "Writeups" },
  glossary: { icon: BookOpen, tone: "tone-purple", label: "Glossary" },
  news: { icon: Newspaper, tone: "tone-sky", label: "News" },
};

const suggestions = ["nmap", "sql injection", "privilege escalation", "wireshark", "reverse shell", "OSCP", "phishing"];

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(initialQuery);
  const [debounced, setDebounced] = useState(initialQuery);
  const [activeType, setActiveType] = useState<ResultType | "all">("all");

  useEffect(() => {
    const t = setTimeout(() => setDebounced(query), 250);
    return () => clearTimeout(t);
  }, [query]);

  useEffect(() => {
    const q = debounced.trim();
    const url = q ? `/search?q=${encodeURIComponent(q)}` : "/search";
    router.replace(url, { scroll: false });
  }, [debounced, router]);

  const results = useMemo(() => (debounced.trim() ? performSearch(debounced.trim()) : []), [debounced]);
  const counts = useMemo(() => results.reduce<Record<string, number>>((acc, r) => ((acc[r.type] = (acc[r.type] ?? 0) + 1), acc), {}), [results]);
  const visible = activeType === "all" ? results : results.filter((r) => r.type === activeType);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-8">
        <p className="eyebrow mb-3">
          <Search size={11} /> Global search
        </p>
        <h1 className="text-section mb-6">
          Find <span className="text-gradient">anything</span>
        </h1>
        <SearchInput value={query} onChange={setQuery} placeholder="Search tools, cheat sheets, labs, writeups, glossary, news…" size="lg" autoFocus />

        {!debounced.trim() && (
          <div className="flex flex-wrap items-center gap-2 mt-4">
            <span className="text-xs text-subtle">Try:</span>
            {suggestions.map((s) => (
              <button key={s} onClick={() => setQuery(s)} className="chip hover:text-primary">
                {s}
              </button>
            ))}
          </div>
        )}
      </motion.div>

      {debounced.trim() && (
        <>
          <div className="flex items-center gap-2 flex-wrap mb-6">
            <button onClick={() => setActiveType("all")} className={`pill ${activeType === "all" ? "pill-active" : ""}`}>
              All <span className="tabular-nums opacity-70">{results.length}</span>
            </button>
            {(Object.keys(typeMeta) as ResultType[])
              .filter((t) => counts[t])
              .map((t) => {
                const Icon = typeMeta[t].icon;
                return (
                  <button key={t} onClick={() => setActiveType(t)} className={`pill ${activeType === t ? "pill-active" : ""}`}>
                    <Icon size={12} />
                    {typeMeta[t].label} <span className="tabular-nums opacity-70">{counts[t]}</span>
                  </button>
                );
              })}
          </div>

          <p className="text-sm text-muted mb-4">
            <span className="text-foreground font-semibold tabular-nums">{visible.length}</span> result{visible.length !== 1 ? "s" : ""} for <span className="text-foreground font-medium">&ldquo;{debounced}&rdquo;</span>
          </p>
        </>
      )}

      <AnimatePresence mode="wait">
        <motion.div key={debounced + activeType} variants={stagger(0, 0.03)} initial="hidden" animate="visible" className="space-y-2.5">
          {visible.map((result, i) => {
            const external = result.href.startsWith("http");
            const meta = typeMeta[result.type];
            const Icon = meta.icon;
            const inner = (
              <div className={`card card-hover p-4 flex items-start gap-4 ${meta.tone}`}>
                <span className="tone-icon w-10 h-10 rounded-xl shrink-0">
                  <Icon size={17} />
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-display font-semibold truncate group-hover:text-primary transition-colors">{result.title}</h3>
                    <span className="tone-badge shrink-0">{meta.label.replace(/s$/, "")}</span>
                  </div>
                  <p className="text-sm text-muted line-clamp-2 leading-relaxed">{result.description}</p>
                  <span className="text-xs text-subtle mt-1.5 block">{result.category}</span>
                </div>
                <span className="text-subtle shrink-0 mt-1 group-hover:text-primary transition-colors">{external ? <ArrowUpRight size={16} /> : <ArrowRight size={16} />}</span>
              </div>
            );
            return (
              <motion.div key={`${result.href}-${i}`} variants={fadeUp} className="group">
                {external ? (
                  <a href={result.href} target="_blank" rel="noopener noreferrer" className="block">
                    {inner}
                  </a>
                ) : (
                  <Link href={result.href} className="block">
                    {inner}
                  </Link>
                )}
              </motion.div>
            );
          })}
        </motion.div>
      </AnimatePresence>

      {debounced.trim() && visible.length === 0 && <EmptyState title="No results" description="Try different keywords or a broader term." />}

      {!debounced.trim() && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-8">
          {(Object.keys(typeMeta) as ResultType[]).slice(0, 4).map((t) => {
            const Icon = typeMeta[t].icon;
            const total = t === "tool" ? tools.length : t === "cheatsheet" ? cheatsheets.length : t === "lab" ? labs.length : resources.length;
            return (
              <div key={t} className={`card p-4 flex items-center gap-3 ${typeMeta[t].tone}`}>
                <span className="tone-icon w-10 h-10 rounded-xl">
                  <Icon size={17} />
                </span>
                <div>
                  <p className="font-display font-bold text-lg tabular-nums leading-none">{total}</p>
                  <p className="text-xs text-muted mt-0.5">{typeMeta[t].label}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<PageSpinner />}>
      <SearchContent />
    </Suspense>
  );
}
