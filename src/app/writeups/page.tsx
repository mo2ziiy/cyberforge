"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Flag, ArrowRight, User, Calendar, Tag, Trophy } from "lucide-react";
import { writeups } from "@/data/writeups";
import { difficultyTone, platformTone, writeupCategoryTone } from "@/lib/palette";
import { fadeUp, stagger } from "@/lib/motion";
import PageHeader from "@/components/ui/PageHeader";
import FilterDropdown from "@/components/ui/FilterDropdown";
import SearchInput from "@/components/ui/SearchInput";
import EmptyState from "@/components/ui/EmptyState";
import SpotlightCard from "@/components/ui/SpotlightCard";

const platforms = ["All", ...Array.from(new Set(writeups.map((w) => w.platform)))];
const categories = ["All", ...Array.from(new Set(writeups.map((w) => w.category)))];
const difficulties = ["All", "Easy", "Medium", "Hard", "Insane"];

export default function WriteupsPage() {
  const [search, setSearch] = useState("");
  const [activePlatform, setActivePlatform] = useState("All");
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeDifficulty, setActiveDifficulty] = useState("All");

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return writeups.filter((w) => {
      const matchSearch = !q || w.title.toLowerCase().includes(q) || w.description.toLowerCase().includes(q) || w.topics.some((t) => t.toLowerCase().includes(q));
      const matchPlatform = activePlatform === "All" || w.platform === activePlatform;
      const matchCategory = activeCategory === "All" || w.category === activeCategory;
      const matchDifficulty = activeDifficulty === "All" || w.difficulty === activeDifficulty;
      return matchSearch && matchPlatform && matchCategory && matchDifficulty;
    });
  }, [search, activePlatform, activeCategory, activeDifficulty]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <PageHeader
        badge={`${writeups.length} Writeups`}
        badgeIcon={Flag}
        title="CTF"
        titleHighlight="Writeups"
        subtitle="Detailed walkthroughs of CTF challenges and HackTheBox / TryHackMe machines with techniques and lessons learned."
      >
        <div className="flex gap-2 max-w-xl mx-auto">
          <SearchInput value={search} onChange={setSearch} placeholder="Search writeups, techniques…" className="flex-1" />
          <FilterDropdown
            groups={[
              { label: "Platform", options: platforms, active: activePlatform, onChange: setActivePlatform, color: "primary" },
              { label: "Category", options: categories, active: activeCategory, onChange: setActiveCategory, color: "secondary" },
              { label: "Difficulty", options: difficulties, active: activeDifficulty, onChange: setActiveDifficulty, color: "accent" },
            ]}
          />
        </div>
      </PageHeader>

      <p className="text-sm text-muted mb-5">
        Showing <span className="text-foreground font-semibold tabular-nums">{filtered.length}</span> of {writeups.length} writeups
      </p>

      <AnimatePresence mode="wait">
        <motion.div key={activePlatform + activeCategory + activeDifficulty + search} variants={stagger(0, 0.04)} initial="hidden" animate="visible" className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((w) => (
            <motion.div key={w.id} variants={fadeUp}>
              <Link href={`/writeups/${w.id}`} className="group block h-full">
                <SpotlightCard className="h-full p-5 flex flex-col">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className={`tone-icon w-9 h-9 rounded-lg shrink-0 tone-${writeupCategoryTone[w.category] ?? "slate"}`}>
                        <Flag size={15} />
                      </span>
                      <h3 className="font-display font-bold text-base leading-snug group-hover:text-primary transition-colors truncate">{w.title}</h3>
                    </div>
                    <span className={`tone-badge shrink-0 tone-${difficultyTone[w.difficulty] ?? "slate"}`}>{w.difficulty}</span>
                  </div>

                  <div className="flex items-center gap-2 mb-3 flex-wrap">
                    <span className={`tone-badge tone-${platformTone[w.platform] ?? "slate"}`}>{w.platform}</span>
                    <span className="badge badge-muted">{w.category}</span>
                    {w.points && (
                      <span className="ml-auto text-xs text-muted flex items-center gap-1 tabular-nums">
                        <Trophy size={11} className="text-warning" />
                        {w.points} pts
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-muted leading-relaxed line-clamp-3 mb-4 flex-1">{w.description}</p>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {w.topics.slice(0, 3).map((topic) => (
                      <span key={topic} className="chip">
                        <Tag size={10} className="text-primary" />
                        {topic}
                      </span>
                    ))}
                    {w.topics.length > 3 && <span className="text-xs text-subtle self-center px-1">+{w.topics.length - 3}</span>}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-border">
                    <div className="flex items-center gap-3 text-xs text-muted">
                      <span className="flex items-center gap-1">
                        <User size={11} />
                        {w.author}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar size={11} />
                        {w.date}
                      </span>
                    </div>
                    <span className="flex items-center gap-1 text-xs font-medium text-primary">
                      Read <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </SpotlightCard>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      {filtered.length === 0 && (
        <EmptyState
          icon={Flag}
          title="No writeups found"
          description="Try adjusting your filters or search query."
          actionLabel="Reset filters"
          onAction={() => {
            setSearch("");
            setActivePlatform("All");
            setActiveCategory("All");
            setActiveDifficulty("All");
          }}
        />
      )}
    </div>
  );
}
