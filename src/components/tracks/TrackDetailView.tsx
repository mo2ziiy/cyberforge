"use client";

import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  ArrowLeft,
  Map,
  Wrench,
  Brain,
  BookOpen,
  Clock,
  Layers,
  Target,
  CheckCircle2,
  GraduationCap,
  Briefcase,
  ListChecks,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import type { Track } from "@/data/tracks";
import type { TrackDetail } from "@/data/trackDetails";
import { tools } from "@/data/tools";
import { roadmaps } from "@/data/roadmaps";
import { labs } from "@/data/labs";
import { quizForTrack, extraQuizzesForTrack } from "@/lib/trackQuiz";
import { trackIconMap, trackToneClass } from "@/lib/trackIcons";
import { difficultyTone } from "@/lib/palette";
import { EASE } from "@/lib/motion";
import SpotlightCard from "@/components/ui/SpotlightCard";
import LogoImage from "@/components/ui/LogoImage";

const TABS = ["Overview", "Roadmap", "Tools", "Quiz"] as const;
type Tab = (typeof TABS)[number];

const levelTone = { Beginner: "tone-green", Intermediate: "tone-amber", Advanced: "tone-red" } as const;

const tabFromHash = (hash: string): Tab | null => {
  const key = hash.replace(/^#/, "").toLowerCase();
  return TABS.find((t) => t.toLowerCase() === key) ?? null;
};

export default function TrackDetailView({ track, detail }: { track: Track; detail: TrackDetail }) {
  const [tab, setTab] = useState<Tab>("Overview");

  /*
   * Deep links like /tracks/web-security#tools select a tab on arrival.
   * A hash is used rather than a query param so the page can stay statically
   * prerendered (useSearchParams would opt it out).
   */
  useEffect(() => {
    const sync = () => {
      const next = tabFromHash(window.location.hash);
      if (next) setTab(next);
    };
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  const selectTab = useCallback((next: Tab) => {
    setTab(next);
    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", next === "Overview" ? window.location.pathname : `#${next.toLowerCase()}`);
    }
  }, []);

  const Icon = trackIconMap[track.id];
  const toneCls = trackToneClass(track.id);
  const roadmap = roadmaps.find((r) => r.trackId === track.id);
  const quiz = quizForTrack(track.id);
  const extraQuizzes = extraQuizzesForTrack(track.id);
  const trackTools = tools.filter((t) => detail.toolCategories.includes(t.category));
  const trackLabs = labs.filter((l) => l.category === track.name || detail.toolCategories.includes(l.category)).slice(0, 4);

  // Split the 10 key topics into the three named modules for a real outline.
  const per = Math.ceil(track.topics.length / 3);
  const moduleGroups = detail.modules.map((name, i) => ({
    name,
    topics: track.topics.slice(i * per, (i + 1) * per),
  }));

  return (
    <div className={toneCls}>
      {/* ========= HERO ========= */}
      <div className="card hairline-top overflow-hidden mb-8">
        <div className="absolute inset-0 tone-gradient opacity-70 pointer-events-none" />
        <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />
        <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-[0.07] tone-text pointer-events-none hidden sm:block" aria-hidden>
          {Icon && <Icon size={200} />}
        </div>

        <div className="relative p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-start gap-5">
            <div className="tone-icon w-16 h-16 rounded-2xl shrink-0 shadow-lg">{Icon && <Icon size={30} />}</div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="tone-badge">{detail.domain}</span>
                <span className={`tone-badge ${levelTone[detail.level]}`}>{detail.level}</span>
                <span className="tone-badge tone-slate">
                  <Clock size={10} />
                  {detail.estimatedTime}
                </span>
              </div>
              <h1 className="font-display text-3xl sm:text-4xl font-bold mb-2.5">{track.name}</h1>
              <p className="text-muted leading-relaxed max-w-2xl">{track.description}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-7 pt-6 border-t border-border/60">
            {[
              { icon: Layers, label: `${track.topics.length} Topics`, sub: "Key concepts" },
              { icon: Map, label: `${roadmap?.levels.length ?? 3} Levels`, sub: "Beginner to Advanced" },
              { icon: Wrench, label: `${trackTools.length} Tools`, sub: "Curated for this track" },
              { icon: Brain, label: quiz ? `${quiz.questions.length} Questions` : "Quiz", sub: "Test yourself" },
            ].map((s) => (
              <div key={s.label} className="flex items-center gap-2.5">
                <div className="tone-icon w-9 h-9 rounded-lg shrink-0">
                  <s.icon size={15} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold leading-none truncate">{s.label}</p>
                  <p className="text-[11px] text-muted mt-1 truncate">{s.sub}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-2.5 mt-7">
            <Link href={`/roadmaps/${track.id}`} className="btn btn-primary">
              Start learning
              <ArrowRight size={16} />
            </Link>
            {quiz && (
              <Link href={`/quiz/${quiz.id}`} className="btn btn-outline">
                <Brain size={15} />
                Take the quiz
              </Link>
            )}
            <Link href="/tracks" className="btn btn-ghost">
              <ArrowLeft size={15} />
              All tracks
            </Link>
          </div>
        </div>
      </div>

      {/* ========= TABS ========= */}
      <div className="filter-tabs-container mb-7 border-b border-border">
        <div className="filter-tabs !gap-0 relative" role="tablist" aria-label="Track sections">
          {TABS.map((t) => {
            const on = tab === t;
            return (
              <button
                key={t}
                role="tab"
                aria-selected={on}
                onClick={() => selectTab(t)}
                className={`relative px-4 sm:px-5 py-3 text-sm font-semibold whitespace-nowrap transition-colors ${
                  on ? "text-primary" : "text-muted hover:text-foreground"
                }`}
              >
                {t}
                {on && <motion.span layoutId="track-tab" className="absolute left-2 right-2 -bottom-px h-0.5 rounded-full bg-primary" transition={{ duration: 0.22, ease: EASE }} />}
              </button>
            );
          })}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.2, ease: EASE }}>
          {/* ---------- OVERVIEW ---------- */}
          {tab === "Overview" && (
            <div className="grid lg:grid-cols-[1fr_310px] gap-6 items-start">
              <div className="space-y-6 min-w-0">
                <section className="card p-6">
                  <h2 className="font-display text-lg font-bold mb-4 flex items-center gap-2.5">
                    <span className="tone-icon w-8 h-8 rounded-lg">
                      <BookOpen size={15} />
                    </span>
                    About this track
                  </h2>
                  <p className="text-primary/90 font-medium mb-4 leading-relaxed">{detail.tagline}</p>
                  <div className="space-y-3.5">
                    {detail.summary.map((p, i) => (
                      <p key={i} className="text-muted leading-relaxed">
                        {p}
                      </p>
                    ))}
                  </div>
                </section>

                {/* KEY TOPICS — structured outline */}
                <section className="card p-6">
                  <h2 className="font-display text-lg font-bold mb-1.5 flex items-center gap-2.5">
                    <span className="tone-icon w-8 h-8 rounded-lg">
                      <ListChecks size={15} />
                    </span>
                    Key topics
                  </h2>
                  <p className="text-sm text-muted mb-6">{track.topics.length} topics grouped into three modules, in the order you should meet them.</p>

                  <ol className="space-y-7">
                    {moduleGroups.map((group, gi) => (
                      <li key={group.name}>
                        <div className="flex items-center gap-3 mb-3.5">
                          <span className="font-mono text-xs font-bold tone-text opacity-70">{String(gi + 1).padStart(2, "0")}</span>
                          <h3 className="font-display font-bold text-base">{group.name}</h3>
                          <span className="h-px flex-1 bg-border" />
                          <span className="text-[11px] text-subtle">{group.topics.length} topics</span>
                        </div>
                        <ul className="space-y-2 pl-1">
                          {group.topics.map((topic, ti) => (
                            <li key={topic} className="flex items-start gap-3 p-3 rounded-xl bg-surface-2/50 border border-border hover:border-border-strong transition-colors">
                              <span className="font-mono text-[11px] text-subtle mt-0.5 shrink-0 tabular-nums">{gi * per + ti + 1}.</span>
                              <div className="min-w-0">
                                <p className="text-sm font-semibold leading-snug">{topic}</p>
                                {detail.topicNotes[topic] && <p className="text-[13px] text-muted leading-relaxed mt-1">{detail.topicNotes[topic]}</p>}
                              </div>
                            </li>
                          ))}
                        </ul>
                      </li>
                    ))}
                  </ol>
                </section>

                <section className="card p-6">
                  <h2 className="font-display text-lg font-bold mb-4 flex items-center gap-2.5">
                    <span className="tone-icon tone-emerald w-8 h-8 rounded-lg">
                      <Target size={15} />
                    </span>
                    What you&apos;ll be able to do
                  </h2>
                  <ul className="space-y-2.5">
                    {detail.outcomes.map((o) => (
                      <li key={o} className="flex items-start gap-2.5">
                        <CheckCircle2 size={16} className="tone-text shrink-0 mt-0.5 opacity-70" />
                        <span className="text-sm leading-relaxed">{o}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              </div>

              <aside className="space-y-4 lg:sticky lg:top-24">
                <div className="card p-5">
                  <p className="eyebrow mb-3 text-[10px]">
                    <GraduationCap size={11} /> Prerequisites
                  </p>
                  <ul className="space-y-2">
                    {detail.prerequisites.map((p) => (
                      <li key={p} className="text-sm text-muted flex items-start gap-2">
                        <span className="w-1 h-1 rounded-full mt-2 shrink-0" style={{ background: "rgb(var(--tone))" }} />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="card p-5">
                  <p className="eyebrow mb-3 text-[10px]">
                    <Briefcase size={11} /> Career paths
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {detail.careers.map((c) => (
                      <span key={c} className="chip">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>

                {trackLabs.length > 0 && (
                  <div className="card p-5">
                    <p className="eyebrow mb-3 text-[10px]">Practice here</p>
                    <ul className="space-y-1">
                      {trackLabs.map((l) => (
                        <li key={l.name}>
                          <a href={l.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 p-2 -mx-2 rounded-lg hover:bg-surface-2 transition-colors group">
                            <LogoImage src={l.logo} name={l.name} size={16} className="!rounded-lg" />
                            <span className="text-sm font-medium flex-1 truncate group-hover:text-primary transition-colors">{l.name}</span>
                            <ExternalLink size={12} className="text-subtle shrink-0" />
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </aside>
            </div>
          )}

          {/* ---------- ROADMAP ---------- */}
          {tab === "Roadmap" && (
            <div className="space-y-5">
              {roadmap ? (
                <>
                  {roadmap.levels.map((level, i) => (
                    <section key={level.level} className={`card overflow-hidden ${levelTone[level.level]}`}>
                      <div className="tone-gradient px-6 py-4 border-b border-border flex items-center justify-between flex-wrap gap-3">
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-xs font-bold tone-text opacity-70">{String(i + 1).padStart(2, "0")}</span>
                          <h2 className="font-display text-lg font-bold tone-text">{level.level}</h2>
                        </div>
                        <span className="text-xs text-muted">
                          {level.topics.length} topics · {level.resources.length} resources
                        </span>
                      </div>
                      <div className="p-6 grid md:grid-cols-2 gap-6">
                        <div>
                          <h3 className="eyebrow mb-3 text-[10px]">
                            <Target size={11} /> Topics
                          </h3>
                          <ul className="space-y-2">
                            {level.topics.map((t) => (
                              <li key={t} className="flex items-start gap-2.5">
                                <CheckCircle2 size={15} className="tone-text shrink-0 mt-0.5 opacity-60" />
                                <span className="text-sm leading-snug">{t}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h3 className="eyebrow mb-3 text-[10px]">
                            <BookOpen size={11} /> Resources
                          </h3>
                          <ul className="space-y-2">
                            {level.resources.map((r) => (
                              <li key={r.name} className="flex items-center gap-2.5 p-2.5 rounded-xl bg-surface-2/60 border border-border">
                                <span className="text-sm font-medium flex-1 leading-snug">{r.name}</span>
                                <span className="text-[10px] font-semibold uppercase tracking-wider text-subtle shrink-0">{r.type}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </section>
                  ))}
                  <Link href={`/roadmaps/${track.id}`} className="btn btn-primary">
                    Open the full roadmap
                    <ArrowRight size={15} />
                  </Link>
                </>
              ) : (
                <p className="text-muted">No roadmap is available for this track yet.</p>
              )}
            </div>
          )}

          {/* ---------- TOOLS ---------- */}
          {tab === "Tools" && (
            <div>
              <p className="text-sm text-muted mb-5">
                <span className="text-foreground font-semibold tabular-nums">{trackTools.length}</span> tools from the{" "}
                {detail.toolCategories.join(", ")} {detail.toolCategories.length > 1 ? "categories" : "category"}.
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                {trackTools.map((t) => (
                  <Link key={t.slug} href={`/tools/${t.slug}`} className="group block h-full">
                    <SpotlightCard className="h-full p-5">
                      <div className="relative flex items-start gap-3.5">
                        <LogoImage src={t.logo} name={t.name} size={26} />
                        <div className="min-w-0 flex-1">
                          <h3 className="font-display font-bold mb-1 flex items-center gap-1.5 group-hover:text-primary transition-colors">
                            {t.name}
                            <ChevronRight size={14} className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                          </h3>
                          <p className="text-sm text-muted leading-relaxed line-clamp-2 mb-3">{t.description}</p>
                          <div className="flex flex-wrap gap-1.5">
                            {t.tags.slice(0, 3).map((tag) => (
                              <span key={tag} className="chip text-[11px] py-0.5">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </SpotlightCard>
                  </Link>
                ))}
              </div>
              <Link href="/tools" className="btn btn-outline btn-sm mt-6">
                <Wrench size={14} />
                Browse all tools
              </Link>
            </div>
          )}

          {/* ---------- QUIZ ---------- */}
          {tab === "Quiz" && (
            <div className="space-y-5">
              {quiz ? (
                <SpotlightCard className="p-6">
                  <div className="relative flex flex-col sm:flex-row sm:items-center gap-5">
                    <div className="tone-icon w-14 h-14 rounded-2xl shrink-0">
                      <Brain size={26} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="tone-badge">{quiz.category}</span>
                        <span className="badge badge-muted">{quiz.questions.length} questions</span>
                      </div>
                      <h2 className="font-display text-xl font-bold mb-1.5">{quiz.title}</h2>
                      <p className="text-sm text-muted leading-relaxed">{quiz.description}</p>
                    </div>
                    <Link href={`/quiz/${quiz.id}`} className="btn btn-primary shrink-0">
                      Start quiz
                      <ArrowRight size={15} />
                    </Link>
                  </div>

                  <div className="relative mt-6 pt-5 border-t border-border grid grid-cols-3 gap-3 text-center">
                    {(["Easy", "Medium", "Hard"] as const).map((d) => {
                      const n = quiz.questions.filter((q) => q.difficulty === d).length;
                      return (
                        <div key={d} className={`p-3 rounded-xl bg-surface-2/60 border border-border tone-${difficultyTone[d] ?? "slate"}`}>
                          <p className="font-display text-xl font-bold tone-text tabular-nums">{n}</p>
                          <p className="text-[11px] text-muted mt-0.5">{d}</p>
                        </div>
                      );
                    })}
                  </div>
                </SpotlightCard>
              ) : (
                <p className="text-muted">No quiz is available for this track yet.</p>
              )}

              {extraQuizzes.length > 0 && (
                <div>
                  <p className="eyebrow mb-3 text-[10px]">Also worth taking</p>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {extraQuizzes.map((q) => (
                      <Link key={q.id} href={`/quiz/${q.id}`} className="card card-hover p-4 flex items-center gap-3 group">
                        <span className="tone-icon tone-slate w-10 h-10 rounded-xl shrink-0">
                          <Brain size={17} />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block font-semibold text-sm truncate group-hover:text-primary transition-colors">{q.title}</span>
                          <span className="block text-[11px] text-subtle">{q.questions.length} questions</span>
                        </span>
                        <ChevronRight size={14} className="text-subtle shrink-0" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
