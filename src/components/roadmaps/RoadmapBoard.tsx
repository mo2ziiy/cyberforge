"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Brain,
  CheckCircle2,
  Clock,
  ExternalLink,
  RotateCcw,
  Target,
  TrendingUp,
  Wrench,
  FlaskConical,
  FileText,
  Video,
  Award,
  Lightbulb,
  type LucideIcon,
} from "lucide-react";
import type { Roadmap, RoadmapLevel } from "@/data/roadmaps";
import type { Track } from "@/data/tracks";
import type { TrackDetail } from "@/data/trackDetails";
import { tools } from "@/data/tools";
import { quizForTrack } from "@/lib/trackQuiz";
import { trackIconMap, trackToneClass } from "@/lib/trackIcons";
import { resourceTypeTone } from "@/lib/palette";
import { EASE } from "@/lib/motion";
import LogoImage from "@/components/ui/LogoImage";

const resourceIcon: Record<string, LucideIcon> = {
  Lab: FlaskConical,
  Course: BookOpen,
  Book: FileText,
  Tool: Wrench,
  Certification: Award,
  Video: Video,
  Reference: ExternalLink,
  Practice: Target,
  Research: Lightbulb,
  Path: TrendingUp,
  Workshop: Wrench,
  Wargame: Target,
};

const levelConfig = {
  Beginner: { number: "01", tone: "tone-green", duration: "4 – 8 weeks" },
  Intermediate: { number: "02", tone: "tone-amber", duration: "8 – 16 weeks" },
  Advanced: { number: "03", tone: "tone-red", duration: "12 – 24 weeks" },
} as const;

const storageKey = (trackId: string) => `cyberforge:roadmap:${trackId}`;

export default function RoadmapBoard({ roadmap, track, detail }: { roadmap: Roadmap; track: Track; detail?: TrackDetail }) {
  const [done, setDone] = useState<Record<string, boolean>>({});
  const [hydrated, setHydrated] = useState(false);

  const Icon = trackIconMap[track.id];
  const toneCls = trackToneClass(track.id);
  const quiz = quizForTrack(track.id);
  const trackTools = useMemo(() => (detail ? tools.filter((t) => detail.toolCategories.includes(t.category)).slice(0, 6) : []), [detail]);

  /* Progress is per-viewer UI state only — kept in localStorage, never sent anywhere. */
  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey(track.id));
      if (raw) setDone(JSON.parse(raw));
    } catch {
      /* storage unavailable (private window, blocked site data) */
    }
    setHydrated(true);
  }, [track.id]);

  const persist = useCallback(
    (next: Record<string, boolean>) => {
      setDone(next);
      try {
        localStorage.setItem(storageKey(track.id), JSON.stringify(next));
      } catch {
        /* non-fatal */
      }
    },
    [track.id]
  );

  const toggle = (key: string) => persist({ ...done, [key]: !done[key] });

  const reset = () => {
    persist({});
  };

  const levelProgress = (level: RoadmapLevel) => {
    const completed = level.topics.filter((t) => done[`${level.level}::${t}`]).length;
    return { completed, total: level.topics.length, pct: level.topics.length ? Math.round((completed / level.topics.length) * 100) : 0 };
  };

  const totalTopics = roadmap.levels.reduce((a, l) => a + l.topics.length, 0);
  const totalDone = roadmap.levels.reduce((a, l) => a + levelProgress(l).completed, 0);
  const overallPct = totalTopics ? Math.round((totalDone / totalTopics) * 100) : 0;

  return (
    <div className={toneCls}>
      {/* ========= HERO ========= */}
      <div className="card hairline-top overflow-hidden mb-8">
        <div className="absolute inset-0 tone-gradient opacity-70 pointer-events-none" />
        <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />
        <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-[0.06] tone-text pointer-events-none hidden sm:block" aria-hidden>
          {Icon && <Icon size={190} />}
        </div>

        <div className="relative p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-start gap-5">
            <div className="tone-icon w-16 h-16 rounded-2xl shrink-0 shadow-lg">{Icon && <Icon size={30} />}</div>
            <div className="flex-1 min-w-0">
              <span className="eyebrow mb-1.5 text-[10px]">Learning roadmap</span>
              <h1 className="font-display text-3xl sm:text-4xl font-bold mb-2">{roadmap.title}</h1>
              <p className="text-muted leading-relaxed max-w-2xl">{track.description}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-7 pt-6 border-t border-border/60">
            {[
              { icon: TrendingUp, label: `${roadmap.levels.length} Levels`, sub: "Beginner to Advanced" },
              { icon: CheckCircle2, label: `${totalTopics} Topics`, sub: "Across all levels" },
              { icon: BookOpen, label: `${roadmap.levels.reduce((a, l) => a + l.resources.length, 0)} Resources`, sub: "Labs, courses, books" },
              { icon: Clock, label: detail?.estimatedTime ?? "~6 months", sub: "Estimated total" },
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

          {/* Overall progress */}
          <div className="mt-7 pt-6 border-t border-border/60">
            <div className="flex items-center justify-between mb-2.5 gap-3 flex-wrap">
              <p className="text-sm font-semibold">
                Overall progress
                <span className="text-muted font-normal ml-2 tabular-nums">
                  {totalDone} / {totalTopics} topics
                </span>
              </p>
              <div className="flex items-center gap-3">
                <span className="font-display font-bold text-lg tone-text tabular-nums">{overallPct}%</span>
                {totalDone > 0 && (
                  <button onClick={reset} className="btn btn-ghost btn-sm" aria-label="Reset progress">
                    <RotateCcw size={13} />
                    Reset
                  </button>
                )}
              </div>
            </div>
            <div className="progress">
              <motion.div className="progress-fill" initial={false} animate={{ width: `${overallPct}%` }} transition={{ duration: 0.5, ease: EASE }} />
            </div>
            <p className="text-[11px] text-subtle mt-2">Checkboxes are saved in this browser only. Nothing is uploaded.</p>
          </div>
        </div>
      </div>

      {/* ========= THREE-COLUMN LEVELS ========= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-8 items-start">
        {roadmap.levels.map((level, i) => {
          const cfg = levelConfig[level.level];
          const { completed, total, pct } = levelProgress(level);

          return (
            <motion.section
              key={level.level}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: i * 0.09, ease: EASE }}
              className={`card overflow-hidden ${cfg.tone}`}
              aria-label={`${level.level} level`}
            >
              <div className="tone-gradient px-5 py-4 border-b border-border">
                <div className="flex items-center gap-2.5 mb-3">
                  <span className="font-mono text-xs font-bold tone-text opacity-70">{cfg.number}</span>
                  <h2 className="font-display text-lg font-bold tone-text flex-1">{level.level}</h2>
                  <span className="tone-badge">
                    <Clock size={10} />
                    {cfg.duration}
                  </span>
                </div>

                {/* Per-level progress bar */}
                <div className="flex items-center gap-3">
                  <div className="progress flex-1">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: "rgb(var(--tone))" }}
                      initial={false}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.4, ease: EASE }}
                    />
                  </div>
                  <span className="text-xs font-semibold tone-text tabular-nums shrink-0">
                    {completed}/{total}
                  </span>
                </div>
              </div>

              <div className="p-5">
                <h3 className="eyebrow mb-3 text-[10px]">
                  <Target size={11} /> Topics
                </h3>
                <ul className="space-y-1 mb-6">
                  {level.topics.map((topic) => {
                    const key = `${level.level}::${topic}`;
                    const checked = Boolean(done[key]);
                    return (
                      <li key={topic}>
                        <label
                          className={`flex items-start gap-2.5 p-2.5 -mx-1 rounded-xl cursor-pointer transition-colors ${
                            checked ? "tone-bg" : "hover:bg-surface-2/70"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggle(key)}
                            disabled={!hydrated}
                            className="mt-0.5 w-4 h-4 shrink-0 rounded cursor-pointer"
                            style={{ accentColor: "rgb(var(--tone))" }}
                          />
                          <span className={`text-sm leading-snug transition-all ${checked ? "text-muted line-through decoration-1" : ""}`}>{topic}</span>
                        </label>
                      </li>
                    );
                  })}
                </ul>

                <h3 className="eyebrow mb-3 text-[10px]">
                  <BookOpen size={11} /> Resources
                </h3>
                <ul className="space-y-2">
                  {level.resources.map((res) => {
                    const RIcon = resourceIcon[res.type] ?? ExternalLink;
                    return (
                      <li
                        key={res.name}
                        className={`flex items-center gap-2.5 p-2.5 rounded-xl tone-bg tone-border border tone-${resourceTypeTone[res.type] ?? "slate"}`}
                      >
                        <RIcon size={13} className="tone-text shrink-0" />
                        <span className="text-[13px] font-medium leading-snug flex-1 min-w-0">{res.name}</span>
                        <span className="text-[10px] font-semibold uppercase tracking-wider tone-text opacity-80 shrink-0">{res.type}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </motion.section>
          );
        })}
      </div>

      {/* ========= TOOLS FOR THIS ROADMAP ========= */}
      {trackTools.length > 0 && (
        <section className="card p-6 mb-8">
          <div className="flex items-center justify-between gap-3 flex-wrap mb-5">
            <h2 className="font-display text-lg font-bold flex items-center gap-2.5">
              <span className="tone-icon w-8 h-8 rounded-lg">
                <Wrench size={15} />
              </span>
              Tools you&apos;ll use
            </h2>
            <Link href={`/tracks/${track.id}#tools`} className="text-sm text-primary font-medium link-underline">
              See all for this track
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {trackTools.map((t) => (
              <Link key={t.slug} href={`/tools/${t.slug}`} className="card card-hover p-3.5 flex items-center gap-3 group">
                <LogoImage src={t.logo} name={t.name} size={20} />
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold text-sm truncate group-hover:text-primary transition-colors">{t.name}</span>
                  <span className="block text-[11px] text-subtle truncate">{t.category}</span>
                </span>
                <ArrowRight size={13} className="text-subtle shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ========= CTA ========= */}
      <div className="card hairline-top overflow-hidden">
        <div className="absolute inset-0 tone-gradient opacity-50 pointer-events-none" />
        <div className="relative p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-display font-bold text-lg mb-1">Ready to go deeper?</h3>
            <p className="text-sm text-muted">Read the full {track.name} track, or test yourself with the quiz.</p>
          </div>
          <div className="flex flex-wrap gap-2 shrink-0">
            <Link href={`/tracks/${track.id}`} className="btn btn-primary btn-sm">
              Open track
              <ArrowRight size={14} />
            </Link>
            {quiz && (
              <Link href={`/quiz/${quiz.id}`} className="btn btn-outline btn-sm">
                <Brain size={14} />
                Take quiz
              </Link>
            )}
            <Link href="/roadmaps" className="btn btn-ghost btn-sm">
              <ArrowLeft size={14} />
              All roadmaps
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
