"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Newspaper, ArrowUpRight, Calendar, Zap, Radio } from "lucide-react";
import { newsArticles } from "@/data/news";
import { newsCategoryTone } from "@/lib/palette";
import { fadeUp, stagger } from "@/lib/motion";
import PageHeader from "@/components/ui/PageHeader";
import FilterDropdown from "@/components/ui/FilterDropdown";
import SearchInput from "@/components/ui/SearchInput";
import EmptyState from "@/components/ui/EmptyState";
import SpotlightCard from "@/components/ui/SpotlightCard";
import NewsImage from "@/components/news/NewsImage";
import Link from "next/link";

const allCategories = ["All", ...Array.from(new Set(newsArticles.map((a) => a.category)))];
const sorted = [...newsArticles].sort((a, b) => b.publishDate.localeCompare(a.publishDate));

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}


export default function NewsPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const breaking = sorted.filter((a) => a.isBreaking);

  const q = search.toLowerCase().trim();
  const filtered = sorted.filter((a) => {
    const matchCat = activeCategory === "All" || a.category === activeCategory;
    const matchSearch = !q || a.title.toLowerCase().includes(q) || a.summary.toLowerCase().includes(q) || a.source.toLowerCase().includes(q);
    return matchCat && matchSearch;
  });

  const showBreaking = breaking.length > 0 && !search && activeCategory === "All";
  const mainArticles = showBreaking ? filtered.filter((a) => !a.isBreaking) : filtered;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <PageHeader
        badge={`${newsArticles.length} Articles`}
        badgeIcon={Newspaper}
        title="Cybersecurity"
        titleHighlight="News"
        subtitle="Latest threats, vulnerabilities, tools, research, and policy updates from across the security world."
      >
        <div className="flex gap-2 max-w-xl mx-auto">
          <SearchInput value={search} onChange={setSearch} placeholder="Search news, sources…" className="flex-1" />
          <FilterDropdown groups={[{ label: "Category", options: allCategories, active: activeCategory, onChange: setActiveCategory, color: "primary" }]} />
        </div>
      </PageHeader>

      {showBreaking && (
        <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <span className="tone-badge tone-red py-1.5 px-3">
              <span className="relative flex w-1.5 h-1.5">
                <span className="absolute inset-0 rounded-full bg-current animate-ping-ring" />
                <span className="relative w-1.5 h-1.5 rounded-full bg-current" />
              </span>
              Breaking
            </span>
            <span className="text-sm text-muted">Top stories right now</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {breaking.map((article) => (
              <Link key={article.id} href={`/news/${article.id}`} className="group block">
                <SpotlightCard className="overflow-hidden h-full">
                  <div className="flex flex-col sm:flex-row h-full">
                    <div className="sm:w-52 h-44 sm:h-auto shrink-0 overflow-hidden relative">
                      <NewsImage src={article.image} title={article.title} category={article.category} />
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent to-surface/40 hidden sm:block" />
                    </div>
                    <div className="p-5 flex flex-col justify-between flex-1">
                      <div>
                        <div className="flex items-center gap-2 mb-2.5">
                          <span className={`tone-badge tone-${newsCategoryTone[article.category] ?? "slate"}`}>{article.category}</span>
                          <span className="tone-badge tone-red">
                            <Zap size={10} className="fill-current" />
                            Breaking
                          </span>
                        </div>
                        <h3 className="font-display font-bold leading-snug mb-2 group-hover:text-primary transition-colors line-clamp-2">
                          {article.title}
                          <ArrowUpRight size={13} className="inline ml-1.5 opacity-0 group-hover:opacity-100 text-primary transition-opacity" />
                        </h3>
                        <p className="text-sm text-muted leading-relaxed line-clamp-3">{article.summary}</p>
                      </div>
                      <div className="flex items-center justify-between mt-4 pt-3 border-t border-border text-xs text-muted">
                        <span className="font-medium text-foreground/80 flex items-center gap-1.5">
                          <Radio size={11} className="text-primary" />
                          {article.source}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar size={11} />
                          {formatDate(article.publishDate)}
                        </span>
                      </div>
                    </div>
                  </div>
                </SpotlightCard>
              </Link>
            ))}
          </div>
        </motion.section>
      )}

      <p className="text-sm text-muted mb-5">
        Showing <span className="text-foreground font-semibold tabular-nums">{mainArticles.length}</span> articles
      </p>

      <AnimatePresence mode="wait">
        <motion.div key={activeCategory + search} variants={stagger(0, 0.04)} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {mainArticles.map((article) => (
            <motion.div key={article.id} variants={fadeUp}>
              <Link href={`/news/${article.id}`} className="group block h-full">
                <SpotlightCard className="h-full overflow-hidden flex flex-col">
                  <div className="w-full h-44 overflow-hidden relative shrink-0">
                    <NewsImage src={article.image} title={article.title} category={article.category} />
                    <div className="absolute inset-0" style={{ background: "linear-gradient(to top, var(--surface) 0%, transparent 55%)" }} />
                    <div className="absolute bottom-3 left-3">
                      <span className={`tone-badge backdrop-blur-sm tone-${newsCategoryTone[article.category] ?? "slate"}`}>{article.category}</span>
                    </div>
                    {article.isBreaking && (
                      <div className="absolute top-3 right-3">
                        <span className="tone-badge tone-red backdrop-blur-sm">
                          <Zap size={10} className="fill-current" />
                          Breaking
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="font-display font-bold leading-snug mb-2 group-hover:text-primary transition-colors line-clamp-2 flex items-start gap-1.5">
                      <span>{article.title}</span>
                      <ArrowUpRight size={13} className="opacity-0 group-hover:opacity-100 text-primary transition-opacity shrink-0 mt-1" />
                    </h3>
                    <p className="text-sm text-muted leading-relaxed line-clamp-3 flex-1 mb-4">{article.summary}</p>
                    <div className="flex items-center justify-between pt-3 border-t border-border text-xs text-muted">
                      <span className="font-medium text-foreground/80">{article.source}</span>
                      <span className="flex items-center gap-1">
                        <Calendar size={11} />
                        {formatDate(article.publishDate)}
                      </span>
                    </div>
                  </div>
                </SpotlightCard>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      {mainArticles.length === 0 && (
        <EmptyState
          icon={Newspaper}
          title="No articles found"
          description="Try a different keyword or category."
          actionLabel="Reset filters"
          onAction={() => {
            setSearch("");
            setActiveCategory("All");
          }}
        />
      )}
    </div>
  );
}
