"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Tag, ChevronRight, Link2, Check } from "lucide-react";
import { glossaryTerms, glossaryCategories } from "@/data/glossary";
import { fadeUp, stagger } from "@/lib/motion";
import PageHeader from "@/components/ui/PageHeader";
import FilterDropdown from "@/components/ui/FilterDropdown";
import SearchInput from "@/components/ui/SearchInput";
import EmptyState from "@/components/ui/EmptyState";
import { PageSpinner } from "@/components/ui/SkeletonCard";

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const slugify = (s: string) => s.toLowerCase().replace(/\s+/g, "-");

const categoryTone: Record<string, string> = {
  General: "tone-primary",
  Attacks: "tone-red",
  Defense: "tone-green",
  Protocols: "tone-blue",
  Cryptography: "tone-violet",
  "Penetration Testing": "tone-orange",
  Tools: "tone-amber",
};

function GlossaryContent() {
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("q") ?? "");
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeLetter, setActiveLetter] = useState("All");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // scroll to #anchor after mount (used by global search links)
  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (!hash) return;
    const t = setTimeout(() => document.getElementById(hash)?.scrollIntoView({ behavior: "smooth", block: "center" }), 300);
    return () => clearTimeout(t);
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return glossaryTerms
      .filter((item) => {
        const matchSearch = !q || item.term.toLowerCase().includes(q) || item.definition.toLowerCase().includes(q);
        const matchCat = activeCategory === "All" || item.category === activeCategory;
        const matchLetter = activeLetter === "All" || item.term.toUpperCase().startsWith(activeLetter);
        return matchSearch && matchCat && matchLetter;
      })
      .sort((a, b) => a.term.localeCompare(b.term));
  }, [search, activeCategory, activeLetter]);

  const usedLetters = useMemo(() => new Set(glossaryTerms.map((t) => t.term[0].toUpperCase())), []);

  const copyLink = async (term: string) => {
    const id = slugify(term);
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/glossary#${id}`);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1400);
    } catch {
      /* ignore */
    }
  };

  const reset = () => {
    setSearch("");
    setActiveCategory("All");
    setActiveLetter("All");
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <PageHeader badge={`${glossaryTerms.length} terms`} badgeIcon={BookOpen} title="Security" titleHighlight="Glossary" subtitle="Essential cybersecurity terms and acronyms explained clearly and concisely. Click a related term to jump to it.">
        <div className="flex gap-2 max-w-xl mx-auto mb-6">
          <SearchInput value={search} onChange={setSearch} placeholder="Search terms or definitions…" className="flex-1" />
          <FilterDropdown groups={[{ label: "Category", options: ["All", ...glossaryCategories], active: activeCategory, onChange: setActiveCategory, color: "primary" }]} />
        </div>

        {/* A–Z */}
        <div className="flex flex-wrap justify-center gap-1">
          <button onClick={() => setActiveLetter("All")} className={`h-8 px-2.5 text-xs font-bold rounded-lg transition-all ${activeLetter === "All" ? "bg-primary text-on-primary" : "text-muted hover:text-foreground hover:bg-surface-2"}`}>
            All
          </button>
          {alphabet.map((letter) => {
            const has = usedLetters.has(letter);
            const on = activeLetter === letter;
            return (
              <button
                key={letter}
                onClick={() => setActiveLetter(on ? "All" : letter)}
                disabled={!has}
                className={`w-8 h-8 text-xs font-bold rounded-lg transition-all ${on ? "bg-primary text-on-primary shadow-[0_6px_18px_-8px_rgb(var(--glow)/0.8)]" : has ? "text-muted hover:text-foreground hover:bg-surface-2" : "text-border cursor-not-allowed"}`}
              >
                {letter}
              </button>
            );
          })}
        </div>
      </PageHeader>

      <p className="text-sm text-muted text-center mb-8">
        Showing <span className="text-foreground font-semibold tabular-nums">{filtered.length}</span> of {glossaryTerms.length} terms
      </p>

      <AnimatePresence mode="wait">
        <motion.div key={search + activeCategory + activeLetter} variants={stagger(0, 0.025)} initial="hidden" animate="visible" className="space-y-3">
          {filtered.map((item) => {
            const id = slugify(item.term);
            return (
              <motion.article key={item.term} id={id} variants={fadeUp} className={`card card-hover p-5 scroll-mt-28 group ${categoryTone[item.category] ?? "tone-slate"}`}>
                <div className="flex items-start gap-4">
                  <span className="hidden sm:flex tone-icon w-10 h-10 rounded-xl shrink-0 font-display font-bold text-sm">{item.term[0].toUpperCase()}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center flex-wrap gap-2 mb-2">
                      <h3 className="font-display font-bold text-lg">{item.term}</h3>
                      <span className="tone-badge">{item.category}</span>
                      <button onClick={() => copyLink(item.term)} className="ml-auto icon-btn w-7 h-7 rounded-md opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity" aria-label="Copy link" title="Copy link">
                        {copiedId === id ? <Check size={13} className="text-success" /> : <Link2 size={13} />}
                      </button>
                    </div>
                    <p className="text-sm text-muted leading-relaxed">{item.definition}</p>
                    {item.relatedTerms && item.relatedTerms.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5 mt-3">
                        <span className="text-xs text-subtle flex items-center gap-1 mr-1">
                          <Tag size={11} /> Related
                        </span>
                        {item.relatedTerms.map((rt) => (
                          <button
                            key={rt}
                            onClick={() => {
                              setActiveLetter("All");
                              setActiveCategory("All");
                              setSearch(rt);
                            }}
                            className="chip hover:text-primary"
                          >
                            {rt}
                            <ChevronRight size={10} />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.article>
            );
          })}
        </motion.div>
      </AnimatePresence>

      {filtered.length === 0 && <EmptyState icon={BookOpen} title="No terms found" description="Try another spelling or clear the filters." actionLabel="Clear filters" onAction={reset} />}
    </div>
  );
}

export default function GlossaryPage() {
  return (
    <Suspense fallback={<PageSpinner />}>
      <GlossaryContent />
    </Suspense>
  );
}
