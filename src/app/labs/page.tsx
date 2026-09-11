"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FlaskConical, ArrowUpRight, Lock, Unlock } from "lucide-react";
import { labs } from "@/data/labs";
import { difficultyTone } from "@/lib/palette";
import { fadeUp, stagger } from "@/lib/motion";
import PageHeader from "@/components/ui/PageHeader";
import LogoImage from "@/components/ui/LogoImage";
import FilterDropdown from "@/components/ui/FilterDropdown";
import SearchInput from "@/components/ui/SearchInput";
import EmptyState from "@/components/ui/EmptyState";
import SpotlightCard from "@/components/ui/SpotlightCard";

const categories = ["All", ...Array.from(new Set(labs.map((l) => l.category)))];
const difficulties = ["All", "Beginner", "Intermediate", "Advanced", "All Levels"];
const access = ["All", "Free", "Paid"];

export default function LabsPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeDifficulty, setActiveDifficulty] = useState("All");
  const [activeAccess, setActiveAccess] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return labs.filter((lab) => {
      const matchCat = activeCategory === "All" || lab.category === activeCategory;
      const matchDiff = activeDifficulty === "All" || lab.difficulty === activeDifficulty;
      const matchAccess = activeAccess === "All" || (activeAccess === "Free" ? lab.free : !lab.free);
      const matchSearch = !q || lab.name.toLowerCase().includes(q) || lab.description.toLowerCase().includes(q) || lab.tags.some((t) => t.includes(q));
      return matchCat && matchDiff && matchAccess && matchSearch;
    });
  }, [activeCategory, activeDifficulty, activeAccess, search]);

  const freeCount = labs.filter((l) => l.free).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <PageHeader
        badge={`${labs.length} platforms · ${freeCount} free`}
        badgeIcon={FlaskConical}
        title="Labs &"
        titleHighlight="CTFs"
        subtitle="Hands-on practice platforms, capture-the-flag events, and intentionally vulnerable environments to sharpen your skills."
      >
        <div className="flex gap-2 max-w-xl mx-auto">
          <SearchInput value={search} onChange={setSearch} placeholder="Search labs…" className="flex-1" />
          <FilterDropdown
            groups={[
              { label: "Category", options: categories, active: activeCategory, onChange: setActiveCategory, color: "primary" },
              { label: "Difficulty", options: difficulties, active: activeDifficulty, onChange: setActiveDifficulty, color: "secondary" },
              { label: "Access", options: access, active: activeAccess, onChange: setActiveAccess, color: "accent" },
            ]}
          />
        </div>
      </PageHeader>

      <p className="text-sm text-muted mb-5">
        Showing <span className="text-foreground font-semibold tabular-nums">{filtered.length}</span> of {labs.length} platforms
      </p>

      <AnimatePresence mode="wait">
        <motion.div key={activeCategory + activeDifficulty + activeAccess + search} variants={stagger(0, 0.04)} initial="hidden" animate="visible" className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((lab) => (
            <motion.div key={lab.name} variants={fadeUp}>
              <a href={lab.url} target="_blank" rel="noopener noreferrer" className="group block h-full">
                <SpotlightCard className="h-full p-5 flex flex-col">
                  <div className="flex items-start gap-3 mb-3">
                    <LogoImage src={lab.logo} name={lab.name} size={26} />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-display font-bold group-hover:text-primary transition-colors flex items-center gap-1.5 leading-tight">
                        <span className="truncate">{lab.name}</span>
                        <ArrowUpRight size={14} className="opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all text-primary shrink-0" />
                      </h3>
                      <div className="mt-1">
                        {lab.free ? (
                          <span className="tone-badge tone-emerald">
                            <Unlock size={9} /> Free
                          </span>
                        ) : (
                          <span className="badge badge-muted">
                            <Lock size={9} /> Paid
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-muted mb-4 line-clamp-2 leading-relaxed">{lab.description}</p>

                  <div className="flex items-center justify-between mt-auto pt-3 border-t border-border">
                    <span className="badge badge-muted">{lab.category}</span>
                    <span className={`tone-badge tone-${difficultyTone[lab.difficulty] ?? "slate"}`}>{lab.difficulty}</span>
                  </div>
                </SpotlightCard>
              </a>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      {filtered.length === 0 && (
        <EmptyState
          icon={FlaskConical}
          title="No labs found"
          description="Try a broader search or reset the filters."
          actionLabel="Reset filters"
          onAction={() => {
            setSearch("");
            setActiveCategory("All");
            setActiveDifficulty("All");
            setActiveAccess("All");
          }}
        />
      )}
    </div>
  );
}
