import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Terminal, Hash, FileText, TerminalSquare, Search, Wifi, ShieldAlert, Bug, RefreshCw, Database, TrendingUp, type LucideIcon } from "lucide-react";
import { cheatsheets } from "@/data/cheatsheets";
import { cheatsheetTone } from "@/lib/palette";
import Breadcrumb from "@/components/ui/Breadcrumb";
import CopyButton from "@/components/ui/CopyButton";

const csIconMap: Record<string, LucideIcon> = {
  "linux-commands": TerminalSquare,
  "nmap-cheatsheet": Search,
  "wireshark-filters": Wifi,
  "metasploit-commands": ShieldAlert,
  "burp-suite-shortcuts": Bug,
  "reverse-shells": RefreshCw,
  "sql-injection": Database,
  "privilege-escalation": TrendingUp,
};

const slugify = (s: string) => s.replace(/\s+/g, "-").toLowerCase();

export function generateStaticParams() {
  return cheatsheets.map((cs) => ({ slug: cs.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const cs = cheatsheets.find((c) => c.id === slug);
  return cs ? { title: `${cs.title} Cheat Sheet` } : {};
}

export default async function CheatSheetDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cs = cheatsheets.find((c) => c.id === slug);
  if (!cs) notFound();

  const Icon = csIconMap[cs.id] ?? FileText;
  const toneCls = `tone-${cheatsheetTone[cs.id] ?? "primary"}`;
  const totalCommands = cs.sections.reduce((acc, s) => acc + s.items.length, 0);
  const allText = cs.sections.map((s) => `# ${s.title}\n${s.items.map((i) => `${i.command}  # ${i.description}`).join("\n")}`).join("\n\n");

  return (
    <div className={`max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 page-enter ${toneCls}`}>
      <Breadcrumb items={[{ label: "Cheat Sheets", href: "/cheatsheets" }, { label: cs.title }]} />

      {/* Hero */}
      <div className="card hairline-top overflow-hidden mb-8">
        <div className="absolute inset-0 tone-gradient opacity-70 pointer-events-none" />
        <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-[0.05] tone-text pointer-events-none">
          <Icon size={160} />
        </div>
        <div className="relative p-7 sm:p-8 flex flex-col sm:flex-row sm:items-center gap-5">
          <div className="tone-icon w-16 h-16 rounded-2xl shrink-0 shadow-lg">
            <Icon size={30} />
          </div>
          <div className="flex-1 min-w-0">
            <span className="eyebrow mb-1.5 text-[10px]">{cs.category}</span>
            <h1 className="font-display text-3xl sm:text-4xl font-bold mb-3">{cs.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted">
              <span className="flex items-center gap-1.5">
                <Hash size={14} className="tone-text" />
                {cs.sections.length} sections
              </span>
              <span className="flex items-center gap-1.5">
                <Terminal size={14} className="tone-text" />
                {totalCommands} commands
              </span>
            </div>
          </div>
          <CopyButton text={allText} label className="self-start sm:self-center !px-4 !py-2.5 !text-sm !rounded-xl" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-8 items-start">
        {/* Sticky TOC */}
        <aside className="hidden lg:block sticky top-24">
          <p className="eyebrow mb-3 text-[10px]">On this page</p>
          <nav className="space-y-0.5 border-l border-border">
            {cs.sections.map((s) => (
              <a key={s.title} href={`#${slugify(s.title)}`} className="block -ml-px pl-3.5 py-1.5 text-sm text-muted border-l border-transparent hover:border-primary hover:text-foreground transition-colors">
                {s.title}
                <span className="text-subtle text-xs ml-1.5">{s.items.length}</span>
              </a>
            ))}
          </nav>
        </aside>

        <div className="space-y-8 min-w-0">
          {cs.sections.map((section, si) => (
            <section key={section.title} id={slugify(section.title)} className="scroll-mt-28 animate-fade-up" style={{ animationDelay: `${si * 60}ms` }}>
              <div className="flex items-center gap-3 mb-3">
                <div className="tone-icon w-7 h-7 rounded-lg">
                  <Terminal size={13} />
                </div>
                <h2 className="font-display text-lg font-bold">{section.title}</h2>
                <span className="text-xs text-subtle ml-auto">{section.items.length} entries</span>
              </div>

              <div className="card overflow-hidden">
                <div className="hidden sm:grid grid-cols-[2fr_3fr_40px] border-b border-border bg-surface-2/60 px-4 py-2.5 text-[11px] font-semibold text-muted uppercase tracking-wider">
                  <span>Command / syntax</span>
                  <span>Description</span>
                  <span />
                </div>
                <ul className="divide-y divide-border">
                  {section.items.map((item, idx) => (
                    <li key={idx} className="group grid grid-cols-1 sm:grid-cols-[2fr_3fr_40px] gap-1 sm:gap-0 px-4 py-3 hover:bg-surface-2 transition-colors items-center">
                      <code className="tone-text font-mono text-[13px] break-all leading-relaxed sm:pr-4">{item.command}</code>
                      <span className="text-sm text-muted group-hover:text-foreground transition-colors leading-relaxed">{item.description}</span>
                      <CopyButton text={item.command} className="justify-self-end opacity-50 group-hover:opacity-100 hidden sm:inline-flex" />
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          ))}

          <div className="pt-6 border-t border-border">
            <Link href="/cheatsheets" className="btn btn-ghost btn-sm">
              <ArrowLeft size={14} />
              Back to cheat sheets
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
