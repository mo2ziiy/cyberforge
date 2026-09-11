"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, ArrowUpRight, Book, Library } from "lucide-react";
import { resources } from "@/data/resources";
import { books } from "@/data/books";
import { resourceTypeTone } from "@/lib/palette";
import { fadeUp, stagger } from "@/lib/motion";
import PageHeader from "@/components/ui/PageHeader";
import LogoImage from "@/components/ui/LogoImage";
import FilterDropdown from "@/components/ui/FilterDropdown";
import SearchInput from "@/components/ui/SearchInput";
import EmptyState from "@/components/ui/EmptyState";
import SpotlightCard from "@/components/ui/SpotlightCard";

const categories = ["All", ...Array.from(new Set(resources.map((r) => r.category)))];
const types = ["All", ...Array.from(new Set(resources.map((r) => r.type)))];
const bookCategories = ["All", ...Array.from(new Set(books.map((b) => b.category)))];

function BookCover({ src, title }: { src: string; title: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div className="w-full h-full flex items-center justify-center tone-amber tone-gradient">
        <Book size={36} className="tone-text opacity-60" />
      </div>
    );
  }
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={title} loading="lazy" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" onError={() => setFailed(true)} />;
}

export default function ResourcesPage() {
  const [activeSection, setActiveSection] = useState<"resources" | "books">("resources");
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeType, setActiveType] = useState("All");
  const [search, setSearch] = useState("");
  const [bookSearch, setBookSearch] = useState("");
  const [bookCategory, setBookCategory] = useState("All");

  const filteredResources = useMemo(() => {
    const q = search.toLowerCase().trim();
    return resources.filter((r) => {
      const matchCat = activeCategory === "All" || r.category === activeCategory;
      const matchType = activeType === "All" || r.type === activeType;
      const matchSearch = !q || r.name.toLowerCase().includes(q) || r.description.toLowerCase().includes(q) || r.tags.some((t) => t.includes(q));
      return matchCat && matchType && matchSearch;
    });
  }, [activeCategory, activeType, search]);

  const filteredBooks = useMemo(() => {
    const q = bookSearch.toLowerCase().trim();
    return books.filter((b) => {
      const matchCat = bookCategory === "All" || b.category === bookCategory;
      const matchSearch = !q || b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q) || b.description.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [bookCategory, bookSearch]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <PageHeader
        badge={`${resources.length} resources · ${books.length} books`}
        badgeIcon={Library}
        title="Resource"
        titleHighlight="Library"
        subtitle="Curated documentation, blogs, videos, tools, communities, and the essential books every security professional should read."
      >
        {/* Segmented control */}
        <div className="inline-flex p-1 rounded-xl bg-surface border border-border mb-6 relative">
          {(["resources", "books"] as const).map((section) => {
            const on = activeSection === section;
            return (
              <button key={section} onClick={() => setActiveSection(section)} className={`relative px-5 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 ${on ? "text-on-primary" : "text-muted hover:text-foreground"}`}>
                {on && <motion.span layoutId="res-tab" className="absolute inset-0 bg-primary rounded-lg shadow-[0_6px_18px_-8px_rgb(var(--glow)/0.8)]" transition={{ type: "spring", stiffness: 420, damping: 32 }} />}
                <span className="relative z-10 flex items-center gap-2">
                  {section === "resources" ? <BookOpen size={14} /> : <Book size={14} />}
                  {section === "resources" ? `Resources (${resources.length})` : `Books (${books.length})`}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex gap-2 max-w-xl mx-auto">
          {activeSection === "resources" ? (
            <>
              <SearchInput value={search} onChange={setSearch} placeholder="Search resources…" className="flex-1" />
              <FilterDropdown
                groups={[
                  { label: "Category", options: categories, active: activeCategory, onChange: setActiveCategory, color: "primary" },
                  { label: "Type", options: types, active: activeType, onChange: setActiveType, color: "secondary" },
                ]}
              />
            </>
          ) : (
            <>
              <SearchInput value={bookSearch} onChange={setBookSearch} placeholder="Search books, authors…" className="flex-1" />
              <FilterDropdown groups={[{ label: "Category", options: bookCategories, active: bookCategory, onChange: setBookCategory, color: "primary" }]} />
            </>
          )}
        </div>
      </PageHeader>

      <AnimatePresence mode="wait">
        {activeSection === "resources" ? (
          <motion.div key="resources" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.22 }}>
            <p className="text-sm text-muted mb-5">
              Showing <span className="text-foreground font-semibold tabular-nums">{filteredResources.length}</span> resources
            </p>

            <motion.div key={activeCategory + activeType + search} variants={stagger(0, 0.03)} initial="hidden" animate="visible" className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredResources.map((resource) => (
                <motion.div key={resource.name} variants={fadeUp}>
                  <a href={resource.url} target="_blank" rel="noopener noreferrer" className="group block h-full">
                    <SpotlightCard className="h-full p-5 flex flex-col">
                      <div className="flex items-start gap-3 mb-3">
                        <LogoImage src={resource.logo} name={resource.name} size={24} />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-display font-bold group-hover:text-primary transition-colors flex items-center gap-1.5 leading-tight">
                            <span className="truncate">{resource.name}</span>
                            <ArrowUpRight size={14} className="opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all text-primary shrink-0" />
                          </h3>
                          <span className="text-xs text-subtle">{resource.category}</span>
                        </div>
                      </div>
                      <p className="text-sm text-muted mb-4 line-clamp-2 leading-relaxed flex-1">{resource.description}</p>
                      <div className="flex items-center justify-between pt-3 border-t border-border">
                        <div className="flex gap-1.5 min-w-0">
                          {resource.tags.slice(0, 2).map((t) => (
                            <span key={t} className="chip text-[11px] py-0.5">
                              {t}
                            </span>
                          ))}
                        </div>
                        <span className={`tone-badge tone-${resourceTypeTone[resource.type] ?? "slate"}`}>{resource.type}</span>
                      </div>
                    </SpotlightCard>
                  </a>
                </motion.div>
              ))}
            </motion.div>

            {filteredResources.length === 0 && (
              <EmptyState
                icon={BookOpen}
                title="No resources found"
                actionLabel="Reset filters"
                onAction={() => {
                  setSearch("");
                  setActiveCategory("All");
                  setActiveType("All");
                }}
              />
            )}
          </motion.div>
        ) : (
          <motion.div key="books" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.22 }}>
            <p className="text-sm text-muted mb-5">
              Showing <span className="text-foreground font-semibold tabular-nums">{filteredBooks.length}</span> books
            </p>

            <motion.div key={bookCategory + bookSearch} variants={stagger(0, 0.04)} initial="hidden" animate="visible" className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filteredBooks.map((book) => (
                <motion.div key={book.title} variants={fadeUp}>
                  <a href={book.url} target="_blank" rel="noopener noreferrer" className="group block h-full">
                    <SpotlightCard className="h-full overflow-hidden flex flex-col">
                      <div className="relative w-full h-48 overflow-hidden bg-surface-2">
                        <BookCover src={book.cover} title={book.title} />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="absolute top-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="w-8 h-8 glass rounded-lg flex items-center justify-center">
                            <ArrowUpRight size={14} className="text-white" />
                          </span>
                        </div>
                        <div className="absolute bottom-2.5 left-2.5">
                          <span className="tone-badge tone-amber backdrop-blur-sm">{book.category}</span>
                        </div>
                      </div>
                      <div className="p-4 flex flex-col flex-1">
                        <h3 className="font-display font-bold text-sm leading-snug mb-1 group-hover:text-primary transition-colors line-clamp-2">{book.title}</h3>
                        <p className="text-xs text-subtle mb-2.5">{book.author}</p>
                        <p className="text-xs text-muted leading-relaxed line-clamp-3 mb-3 flex-1">{book.description}</p>
                        <div className="flex flex-wrap gap-1">
                          {book.tags.slice(0, 3).map((tag) => (
                            <span key={tag} className="chip text-[10px] py-0.5 px-1.5">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </SpotlightCard>
                  </a>
                </motion.div>
              ))}
            </motion.div>

            {filteredBooks.length === 0 && (
              <EmptyState
                icon={Book}
                title="No books found"
                actionLabel="Reset filters"
                onAction={() => {
                  setBookSearch("");
                  setBookCategory("All");
                }}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
