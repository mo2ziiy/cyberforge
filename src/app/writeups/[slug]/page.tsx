import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Flag,
  Tag,
  User,
  Calendar,
  ArrowUpRight,
  Target,
  BookOpen,
  ChevronRight,
  Trophy,
  Layers,
  Search,
  Crosshair,
  ArrowUpNarrowWide,
  type LucideIcon,
} from "lucide-react";
import { writeups } from "@/data/writeups";
import { difficultyTone, platformTone, writeupCategoryTone } from "@/lib/palette";
import { buildWriteupSections } from "@/lib/writeupBody";
import Breadcrumb from "@/components/ui/Breadcrumb";
import CodeBlock from "@/components/ui/CodeBlock";

export function generateStaticParams() {
  return writeups.map((w) => ({ slug: w.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const w = writeups.find((x) => x.id === slug);
  return w ? { title: `${w.title} — ${w.platform} writeup`, description: w.description } : {};
}

const sectionIcon: Record<string, LucideIcon> = {
  reconnaissance: Search,
  exploitation: Crosshair,
  "privilege-escalation": ArrowUpNarrowWide,
  flags: Flag,
};

const sectionTone: Record<string, string> = {
  reconnaissance: "tone-primary",
  exploitation: "tone-red",
  "privilege-escalation": "tone-amber",
  flags: "tone-green",
};

export default async function WriteupDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const writeup = writeups.find((w) => w.id === slug);
  if (!writeup) notFound();

  const related = writeups.filter((w) => w.category === writeup.category && w.id !== writeup.id).slice(0, 3);
  const catTone = `tone-${writeupCategoryTone[writeup.category] ?? "slate"}`;
  const sections = buildWriteupSections(writeup);

  return (
    <div className={`max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 ${catTone}`}>
      <Breadcrumb items={[{ label: "Writeups", href: "/writeups" }, { label: writeup.title }]} />

      {/* Hero */}
      <div className="card hairline-top overflow-hidden mb-8">
        <div className="absolute inset-0 tone-gradient opacity-70 pointer-events-none" />
        <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />
        <div className="relative p-7 sm:p-8">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className={`tone-badge tone-${platformTone[writeup.platform] ?? "slate"}`}>{writeup.platform}</span>
            <span className={`tone-badge tone-${difficultyTone[writeup.difficulty] ?? "slate"}`}>{writeup.difficulty}</span>
            <span className="tone-badge">
              <Flag size={10} />
              {writeup.category}
            </span>
            {writeup.points && (
              <span className="tone-badge tone-amber">
                <Trophy size={10} />
                {writeup.points} pts
              </span>
            )}
          </div>

          <h1 className="font-display text-3xl sm:text-4xl font-bold mb-4">{writeup.title}</h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-muted">
            <span className="flex items-center gap-1.5">
              <User size={14} />
              {writeup.author}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar size={14} />
              {writeup.date}
            </span>
            <a href={writeup.url} target="_blank" rel="noopener noreferrer" className="ml-auto btn btn-outline btn-sm">
              Original source
              <ArrowUpRight size={13} />
            </a>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_290px] gap-6 items-start">
        <div className="space-y-5 min-w-0">
          {/* Overview */}
          <section className="card p-6">
            <h2 className="font-display text-lg font-bold mb-3 flex items-center gap-2.5">
              <span className="tone-icon tone-primary w-8 h-8 rounded-lg">
                <BookOpen size={15} />
              </span>
              Overview
            </h2>
            <p className="text-muted leading-relaxed">{writeup.description}</p>
            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border">
              {writeup.topics.map((topic) => (
                <span key={topic} className="chip text-[12px]">
                  <Tag size={10} className="text-primary" />
                  {topic}
                </span>
              ))}
            </div>
          </section>

          {/* Generated walkthrough sections */}
          {sections.map((section, i) => {
            const SIcon = sectionIcon[section.id] ?? Target;
            const tone = sectionTone[section.id] ?? "tone-primary";
            return (
              <section key={section.id} id={section.id} className="card p-6 scroll-mt-24">
                <h2 className="font-display text-lg font-bold mb-3 flex items-center gap-2.5">
                  <span className={`tone-icon ${tone} w-8 h-8 rounded-lg`}>
                    <SIcon size={15} />
                  </span>
                  <span className="font-mono text-xs text-subtle">{String(i + 1).padStart(2, "0")}</span>
                  {section.title}
                </h2>
                <div className="space-y-3">
                  {section.body.map((p, bi) => (
                    <p key={bi} className="text-muted leading-relaxed">
                      {p}
                    </p>
                  ))}
                </div>
                {section.code && <CodeBlock title={section.code.title} code={section.code.code} />}
              </section>
            );
          })}

          <p className="text-[11px] text-subtle leading-relaxed px-1">
            Commands are illustrative of the technique and platform, not a live exploit against a specific target. Follow the original source link for the authoritative walkthrough.
          </p>
        </div>

        {/* Sidebar */}
        <aside className="space-y-4 lg:sticky lg:top-24">
          {/* On this page */}
          <div className="card p-5">
            <p className="eyebrow mb-3 text-[10px]">On this page</p>
            <ul className="space-y-1">
              {sections.map((s) => {
                const SIcon = sectionIcon[s.id] ?? Target;
                return (
                  <li key={s.id}>
                    <a href={`#${s.id}`} className="flex items-center gap-2.5 p-2 -mx-2 rounded-lg hover:bg-surface-2 transition-colors text-sm text-muted hover:text-foreground">
                      <SIcon size={13} className="tone-text shrink-0" />
                      {s.title}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="card p-5">
            <p className="eyebrow mb-3 text-[10px]">
              <Layers size={11} /> Details
            </p>
            <dl className="grid grid-cols-2 gap-3 text-sm">
              {[
                ["Platform", writeup.platform],
                ["Category", writeup.category],
                ["Difficulty", writeup.difficulty],
                ["Points", writeup.points ?? "—"],
              ].map(([k, v]) => (
                <div key={String(k)} className="p-3 rounded-xl bg-surface-2/60 border border-border">
                  <dt className="text-[11px] text-subtle mb-0.5">{k}</dt>
                  <dd className="font-semibold">{v}</dd>
                </div>
              ))}
            </dl>
          </div>

          {related.length > 0 && (
            <div className="card p-5">
              <p className="eyebrow mb-3 text-[10px]">Related writeups</p>
              <ul className="space-y-1">
                {related.map((w) => (
                  <li key={w.id}>
                    <Link href={`/writeups/${w.id}`} className="flex items-center gap-2.5 p-2 -mx-2 rounded-lg hover:bg-surface-2 transition-colors group">
                      <span className="flex-1 min-w-0">
                        <span className="block text-sm font-medium truncate group-hover:text-primary transition-colors">{w.title}</span>
                        <span className="block text-[11px] text-subtle">
                          {w.platform} · {w.difficulty}
                        </span>
                      </span>
                      <ChevronRight size={13} className="text-subtle" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <Link href="/writeups" className="btn btn-ghost btn-sm w-full justify-start">
            <ArrowLeft size={14} />
            Back to writeups
          </Link>
        </aside>
      </div>
    </div>
  );
}
