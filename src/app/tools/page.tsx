"use client";

import Link from "next/link";
import { useState, Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Wrench, ArrowUpRight, Tag, Terminal } from "lucide-react";
import { tools } from "@/data/tools";
import { fadeUp, stagger } from "@/lib/motion";
import PageHeader from "@/components/ui/PageHeader";
import LogoImage from "@/components/ui/LogoImage";
import FilterDropdown from "@/components/ui/FilterDropdown";
import SearchInput from "@/components/ui/SearchInput";
import EmptyState from "@/components/ui/EmptyState";
import SpotlightCard from "@/components/ui/SpotlightCard";
import { PageSpinner } from "@/components/ui/SkeletonCard";

const categories = ["All", ...Array.from(new Set(tools.map((t) => t.category)))];

function ToolsContent() {
  const searchParams = useSearchParams();
  const initialCat = searchParams.get("category") || "All";
  const [activeCategory, setActiveCategory] = useState(categories.includes(initialCat) ? initialCat : "All");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return tools.filter((tool) => {
      const matchCat = activeCategory === "All" || tool.category === activeCategory;
      const matchSearch = !q || tool.name.toLowerCase().includes(q) || tool.description.toLowerCase().includes(q) || tool.tags.some((t) => t.toLowerCase().includes(q));
      return matchCat && matchSearch;
    });
  }, [activeCategory, search]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <PageHeader
        badge={`${tools.length} Security Tools`}
        badgeIcon={Wrench}
        title="Tools"
        titleHighlight="Library"
        subtitle="Cybersecurity tools with installation guides, essential commands, and real-world use cases."
      >
        <div className="flex gap-2 max-w-xl mx-auto">
          <SearchInput value={search} onChange={setSearch} placeholder="Search tools, tags…" className="flex-1" />
          <FilterDropdown groups={[{ label: "Category", options: categories, active: activeCategory, onChange: setActiveCategory, color: "primary" }]} />
        </div>
      </PageHeader>

      <div className="flex items-center justify-between mb-5 text-sm text-muted">
        <p>
          Showing <span className="text-foreground font-semibold tabular-nums">{filtered.length}</span> of {tools.length} tools
          {activeCategory !== "All" && (
            <>
              {" "}
              in <span className="text-primary font-medium">{activeCategory}</span>
            </>
          )}
        </p>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={activeCategory + search} variants={stagger(0, 0.04)} initial="hidden" animate="visible" className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((tool) => (
            <motion.div key={tool.slug} variants={fadeUp}>
              <Link href={`/tools/${tool.slug}`} className="group block h-full">
                <SpotlightCard className="h-full p-5 flex flex-col">
                  <div className="flex items-start gap-3 mb-3">
                    <LogoImage src={tool.logo} name={tool.name} size={26} />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-display font-bold text-base group-hover:text-primary transition-colors flex items-center gap-1.5 leading-tight">
                        <span className="truncate">{tool.name}</span>
                        <ArrowUpRight size={14} className="opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all text-primary shrink-0" />
                      </h3>
                      <span className="badge badge-muted mt-1">{tool.category}</span>
                    </div>
                  </div>

                  <p className="text-sm text-muted mb-4 line-clamp-2 leading-relaxed">{tool.description}</p>

                  <div className="mt-auto flex items-center justify-between gap-2 pt-3 border-t border-border">
                    <div className="flex flex-wrap gap-1.5 min-w-0">
                      {tool.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md bg-primary/5 border border-primary/15 text-primary/80">
                          <Tag size={9} />
                          {tag}
                        </span>
                      ))}
                    </div>
                    <span className="flex items-center gap-1 text-[11px] text-subtle shrink-0">
                      <Terminal size={11} />
                      {tool.commands.length}
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
          title="No tools match"
          description="Try a different keyword or clear the category filter."
          actionLabel="Clear filters"
          onAction={() => {
            setSearch("");
            setActiveCategory("All");
          }}
        />
      )}
    </div>
  );
}

export default function ToolsPage() {
  return (
    <Suspense fallback={<PageSpinner />}>
      <ToolsContent />
    </Suspense>
  );
}
