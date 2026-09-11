"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Trophy, BookOpen, Wrench, CheckCircle2, Circle, Heart, HeartOff, BookmarkX, ChevronDown, ChevronRight, Map, FileText, FlaskConical, BookMarked, Brain, Target, ArrowRight, Sparkles } from "lucide-react";
import { tools } from "@/data/tools";
import { tracks } from "@/data/tracks";
import { resources } from "@/data/resources";
import { labs } from "@/data/labs";
import { trackIconMap, trackToneClass } from "@/lib/trackIcons";
import { EASE, fadeUp, stagger } from "@/lib/motion";
import StreakBadge from "@/components/ui/StreakBadge";
import { showToast } from "@/components/ui/Toast";
import { PageSpinner } from "@/components/ui/SkeletonCard";
import LogoImage from "@/components/ui/LogoImage";

interface User {
  name: string;
  email: string;
  role: string;
  avatar?: string | null;
  bookmarks: string[];
  favoriteTools: string[];
  completedTopics: string[];
  points: number;
  streak: number;
}

const totalTopics = tracks.reduce((acc, t) => acc + t.topics.length, 0);

function levelFor(pct: number) {
  if (pct >= 67) return { label: "Advanced", tone: "tone-red" };
  if (pct >= 34) return { label: "Intermediate", tone: "tone-amber" };
  if (pct > 0) return { label: "Beginner", tone: "tone-green" };
  return null;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => {
        if (!r.ok) throw new Error("Unauthenticated");
        return r.json();
      })
      .then((data) => setUser(data.user))
      .catch(() => router.push("/auth/login"))
      .finally(() => setLoading(false));
  }, [router]);

  const toggleTrack = (id: string) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const mutate = async (id: string, type: "bookmark" | "favoriteTool" | "completedTopic") => {
    const res = await fetch("/api/bookmarks", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, type }) });
    if (!res.ok) {
      showToast("Something went wrong. Please try again.", "error");
      return;
    }
    const data = await res.json();
    if (type === "completedTopic" && data.completedTopics.includes(id)) showToast(`+10 XP — ${id}`, "points");
    if (type === "favoriteTool" && data.favoriteTools.includes(id)) showToast("Added to favorites", "success");
    setUser((prev) => (prev ? { ...prev, bookmarks: data.bookmarks, favoriteTools: data.favoriteTools, completedTopics: data.completedTopics, points: data.points ?? prev.points } : prev));
  };

  const nextUp = useMemo(() => {
    if (!user) return [];
    const done = new Set(user.completedTopics);
    const out: { track: string; id: string; topic: string }[] = [];
    for (const t of tracks) {
      const first = t.topics.find((tp) => !done.has(tp));
      if (first) out.push({ track: t.name, id: t.id, topic: first });
      if (out.length === 3) break;
    }
    return out;
  }, [user]);

  if (loading) return <PageSpinner label="Loading your dashboard…" />;
  if (!user) return null;

  const progressPercent = totalTopics > 0 ? Math.round((user.completedTopics.length / totalTopics) * 100) : 0;
  const initials = user.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
  const r = 54;
  const circ = 2 * Math.PI * r;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ ease: EASE }} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl overflow-hidden flex items-center justify-center text-on-primary font-display font-bold text-xl shadow-[0_10px_30px_-10px_rgb(var(--glow)/0.7)]" style={{ background: "linear-gradient(135deg, var(--primary), var(--secondary))" }}>
            {user.avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              initials
            )}
          </div>
          <div>
            <p className="eyebrow mb-1 text-[10px]">Dashboard</p>
            <h1 className="font-display text-2xl font-bold leading-tight">Welcome back, {user.name.split(" ")[0]}</h1>
            <p className="text-muted text-sm">{user.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <StreakBadge streak={user.streak} />
          <div className="tone-badge tone-amber py-1.5 px-3 text-sm">
            <Zap size={14} />
            <span className="tabular-nums">{user.points}</span> XP
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div variants={stagger(0.05, 0.06)} initial="hidden" animate="visible" className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Overall progress", value: `${progressPercent}%`, icon: Trophy, tone: "tone-primary" },
          { label: "Topics done", value: `${user.completedTopics.length}/${totalTopics}`, icon: CheckCircle2, tone: "tone-green" },
          { label: "Favorite tools", value: user.favoriteTools.length, icon: Wrench, tone: "tone-violet" },
          { label: "Bookmarks", value: user.bookmarks.length, icon: BookOpen, tone: "tone-emerald" },
        ].map((s) => (
          <motion.div key={s.label} variants={fadeUp} className={`card card-hover p-4 ${s.tone}`}>
            <div className="flex items-center justify-between mb-3">
              <span className="tone-icon w-9 h-9 rounded-lg">
                <s.icon size={16} />
              </span>
            </div>
            <p className="font-display text-2xl font-bold tabular-nums tone-text">{s.value}</p>
            <p className="text-xs text-muted mt-0.5">{s.label}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Progress + Next up */}
      <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-6 mb-8">
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, ease: EASE }} className="card hairline-top p-6">
          <div className="flex flex-col sm:flex-row items-center gap-7">
            <div className="relative shrink-0">
              <svg width="144" height="144" viewBox="0 0 144 144" className="-rotate-90">
                <defs>
                  <linearGradient id="pgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="var(--primary)" />
                    <stop offset="100%" stopColor="var(--accent)" />
                  </linearGradient>
                </defs>
                <circle cx="72" cy="72" r={r} fill="none" stroke="var(--surface-2)" strokeWidth="11" />
                <motion.circle cx="72" cy="72" r={r} fill="none" stroke="url(#pgGrad)" strokeWidth="11" strokeLinecap="round" strokeDasharray={circ} initial={{ strokeDashoffset: circ }} animate={{ strokeDashoffset: circ - (progressPercent / 100) * circ }} transition={{ duration: 1.4, ease: EASE, delay: 0.4 }} />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-display text-3xl font-bold tabular-nums">{progressPercent}%</span>
                <span className="text-[11px] text-muted">complete</span>
              </div>
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h2 className="font-display font-bold text-lg mb-1">Overall learning progress</h2>
              <p className="text-muted text-sm mb-4">
                {user.completedTopics.length} of {totalTopics} topics completed across {tracks.length} domains
              </p>
              <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                {[
                  { label: "Beginner", tone: "tone-green", on: progressPercent > 0 && progressPercent < 34 },
                  { label: "Intermediate", tone: "tone-amber", on: progressPercent >= 34 && progressPercent < 67 },
                  { label: "Advanced", tone: "tone-red", on: progressPercent >= 67 },
                ].map((l) => (
                  <span key={l.label} className={`tone-badge ${l.tone} ${l.on ? "ring-2 ring-offset-2 ring-offset-surface" : "opacity-40"}`} style={l.on ? { boxShadow: "0 0 0 2px rgb(var(--tone) / 0.5)" } : undefined}>
                    {l.label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, ease: EASE }} className="card p-5">
          <h2 className="font-display font-bold flex items-center gap-2 mb-4">
            <span className="tone-icon tone-primary w-8 h-8 rounded-lg">
              <Sparkles size={14} />
            </span>
            Next up for you
          </h2>
          {nextUp.length === 0 ? (
            <p className="text-sm text-muted">You&apos;ve completed everything. Legend.</p>
          ) : (
            <ul className="space-y-2">
              {nextUp.map((n) => (
                <li key={n.topic}>
                  <button onClick={() => mutate(n.topic, "completedTopic")} className="w-full flex items-center gap-3 p-2.5 rounded-xl border border-border hover:border-primary/40 hover:bg-primary/5 transition-all text-left group">
                    <Circle size={15} className="text-subtle group-hover:text-primary shrink-0" />
                    <span className="flex-1 min-w-0">
                      <span className="block text-sm font-medium truncate">{n.topic}</span>
                      <span className="block text-[11px] text-subtle">{n.track}</span>
                    </span>
                    <span className="text-[11px] text-warning font-semibold flex items-center gap-0.5">
                      <Zap size={10} /> +10
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </motion.div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Track progress */}
        <div className="space-y-3">
          <h2 className="font-display font-bold text-lg flex items-center gap-2">
            <Target size={17} className="text-primary" /> Track progress
          </h2>
          {tracks.map((track, i) => {
            const Icon = trackIconMap[track.id];
            const completed = track.topics.filter((t) => user.completedTopics.includes(t)).length;
            const pct = Math.round((completed / track.topics.length) * 100);
            const isOpen = expanded.has(track.id);
            const lvl = levelFor(pct);

            return (
              <motion.div key={track.id} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.04 * i, ease: EASE }} className={`card overflow-hidden ${trackToneClass(track.id)}`}>
                <button onClick={() => toggleTrack(track.id)} className="w-full flex items-center gap-3 p-4 text-left hover:bg-surface-2/60 transition-colors" aria-expanded={isOpen}>
                  <span className="tone-icon w-9 h-9 rounded-lg shrink-0">{Icon && <Icon size={16} />}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-semibold truncate">{track.name}</span>
                      <div className="flex items-center gap-2 ml-2 shrink-0">
                        {lvl && <span className={`tone-badge text-[10px] py-0 ${lvl.tone}`}>{lvl.label}</span>}
                        <span className="text-xs text-muted tabular-nums">
                          {completed}/{track.topics.length}
                        </span>
                      </div>
                    </div>
                    <div className="progress h-1.5">
                      <motion.div className="progress-fill" initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.9, delay: 0.1 * i, ease: EASE }} />
                    </div>
                  </div>
                  <ChevronDown size={16} className={`text-subtle shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: EASE }} className="overflow-hidden">
                      <div className="px-4 pb-4 border-t border-border pt-3 space-y-1">
                        {track.topics.map((topic) => {
                          const done = user.completedTopics.includes(topic);
                          return (
                            <button key={topic} onClick={() => mutate(topic, "completedTopic")} className="flex items-center gap-2.5 w-full text-left text-sm group px-2 py-1.5 rounded-lg hover:bg-surface-2 transition-colors">
                              {done ? <CheckCircle2 size={16} className="text-primary shrink-0" /> : <Circle size={16} className="text-subtle shrink-0 group-hover:text-primary transition-colors" />}
                              <span className={done ? "line-through text-subtle" : "group-hover:text-primary transition-colors"}>{topic}</span>
                              {done && <Zap size={12} className="text-warning ml-auto opacity-70" />}
                            </button>
                          );
                        })}
                        <Link href={`/roadmaps/${track.id}`} className="flex items-center gap-1 text-xs text-primary mt-2 px-2 hover:underline">
                          Open roadmap <ArrowRight size={11} />
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Right column */}
        <div className="space-y-6">
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-bold text-lg flex items-center gap-2">
                <Wrench size={17} className="text-secondary" /> Favorite tools
              </h2>
              <Link href="/tools" className="text-xs text-primary hover:underline flex items-center gap-1">
                Browse <ChevronRight size={13} />
              </Link>
            </div>
            {user.favoriteTools.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-5 text-center">
                <span className="tone-icon tone-violet w-11 h-11 rounded-xl">
                  <Heart size={18} />
                </span>
                <p className="text-sm text-muted">No favorites yet.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {user.favoriteTools.map((slug) => {
                  const tool = tools.find((t) => t.slug === slug);
                  if (!tool) return null;
                  return (
                    <div key={slug} className="flex items-center gap-3 p-2.5 rounded-xl bg-surface-2/60 border border-border group">
                      <LogoImage src={tool.logo} name={tool.name} size={16} className="!rounded-md" />
                      <Link href={`/tools/${slug}`} className="text-sm font-medium flex-1 truncate hover:text-primary transition-colors">
                        {tool.name}
                      </Link>
                      <span className="badge badge-muted hidden sm:inline-flex">{tool.category}</span>
                      <button onClick={() => mutate(slug, "favoriteTool")} className="icon-btn w-7 h-7 rounded-md hover:!text-danger" aria-label="Remove favorite">
                        <HeartOff size={14} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
            <div className="mt-4 pt-4 border-t border-border">
              <p className="eyebrow mb-2 text-[10px]">Quick add</p>
              <div className="flex flex-wrap gap-1.5">
                {tools
                  .filter((t) => !user.favoriteTools.includes(t.slug))
                  .slice(0, 6)
                  .map((tool) => (
                    <button key={tool.slug} onClick={() => mutate(tool.slug, "favoriteTool")} className="chip hover:text-primary">
                      <Heart size={10} />
                      {tool.name}
                    </button>
                  ))}
              </div>
            </div>
          </div>

          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-bold text-lg flex items-center gap-2">
                <BookOpen size={17} className="text-accent" /> Bookmarks
              </h2>
              <Link href="/resources" className="text-xs text-primary hover:underline flex items-center gap-1">
                Browse <ChevronRight size={13} />
              </Link>
            </div>
            {user.bookmarks.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-5 text-center">
                <span className="tone-icon tone-emerald w-11 h-11 rounded-xl">
                  <BookMarked size={18} />
                </span>
                <p className="text-sm text-muted">No bookmarks yet.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {user.bookmarks.map((bm) => {
                  const match = resources.find((r) => r.name === bm || r.url === bm) ?? labs.find((l) => l.name === bm || l.url === bm);
                  return (
                    <div key={bm} className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-surface-2/60 border border-border">
                      {match ? (
                        <a href={match.url} target="_blank" rel="noopener noreferrer" className="text-sm font-medium truncate hover:text-primary transition-colors">
                          {match.name}
                        </a>
                      ) : (
                        <span className="text-sm truncate">{bm}</span>
                      )}
                      <button onClick={() => mutate(bm, "bookmark")} className="icon-btn w-7 h-7 rounded-md hover:!text-danger shrink-0" aria-label="Remove bookmark">
                        <BookmarkX size={14} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="card p-5">
            <h2 className="font-display font-bold mb-3">Quick access</h2>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "Roadmaps", href: "/roadmaps", Icon: Map, tone: "tone-violet" },
                { label: "Cheat sheets", href: "/cheatsheets", Icon: FileText, tone: "tone-purple" },
                { label: "Labs & CTFs", href: "/labs", Icon: FlaskConical, tone: "tone-orange" },
                { label: "Quizzes", href: "/quiz", Icon: Brain, tone: "tone-fuchsia" },
              ].map((item) => (
                <Link key={item.href} href={item.href} className={`flex items-center gap-2.5 p-2.5 rounded-xl border border-border hover:border-border-strong hover:bg-surface-2 transition-all group ${item.tone}`}>
                  <span className="tone-icon w-8 h-8 rounded-lg group-hover:scale-110 transition-transform">
                    <item.Icon size={14} />
                  </span>
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
