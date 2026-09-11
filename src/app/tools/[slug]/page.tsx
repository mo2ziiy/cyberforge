import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, BookOpen, Download, Target, Terminal, Tag, ChevronRight } from "lucide-react";
import { tools } from "@/data/tools";
import Breadcrumb from "@/components/ui/Breadcrumb";
import LogoImage from "@/components/ui/LogoImage";
import CopyButton from "@/components/ui/CopyButton";

export function generateStaticParams() {
  return tools.map((tool) => ({ slug: tool.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const tool = tools.find((t) => t.slug === slug);
  return tool ? { title: tool.name, description: tool.description } : {};
}

export default async function ToolDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tool = tools.find((t) => t.slug === slug);
  if (!tool) notFound();

  const related = tools.filter((t) => t.category === tool.category && t.slug !== tool.slug).slice(0, 3);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 page-enter">
      <Breadcrumb items={[{ label: "Tools", href: "/tools" }, { label: tool.name }]} />

      {/* Hero */}
      <div className="card hairline-top overflow-hidden mb-8 tone-cyan">
        <div className="absolute inset-0 tone-gradient opacity-60 pointer-events-none" />
        <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />
        <div className="relative p-7 sm:p-8 flex flex-col sm:flex-row sm:items-center gap-5">
          <LogoImage src={tool.logo} name={tool.name} size={44} className="!rounded-2xl" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1.5">
              <span className="tone-badge tone-primary">{tool.category}</span>
              <span className="text-xs text-subtle flex items-center gap-1">
                <Terminal size={11} /> {tool.commands.length} commands
              </span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-bold mb-2">{tool.name}</h1>
            <p className="text-muted leading-relaxed max-w-2xl">{tool.description}</p>
            <div className="flex flex-wrap gap-1.5 mt-4">
              {tool.tags.map((tag) => (
                <span key={tag} className="chip">
                  <Tag size={10} />
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <a href={tool.officialDocs} target="_blank" rel="noopener noreferrer" className="btn btn-outline shrink-0 self-start sm:self-center">
            <BookOpen size={15} />
            Official docs
            <ArrowUpRight size={14} />
          </a>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_280px] gap-6">
        <div className="space-y-6 min-w-0">
          {/* Installation */}
          <section className="card overflow-hidden animate-fade-up" style={{ animationDelay: "60ms" }}>
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-border">
              <h2 className="font-display font-bold flex items-center gap-2">
                <span className="tone-icon tone-emerald w-7 h-7 rounded-lg">
                  <Download size={14} />
                </span>
                Installation
              </h2>
              <CopyButton text={tool.installation} label />
            </div>
            <pre className="codeblock rounded-none border-0 p-5 whitespace-pre-wrap break-words">
              <code>{tool.installation}</code>
            </pre>
          </section>

          {/* Commands */}
          <section className="card overflow-hidden animate-fade-up" style={{ animationDelay: "120ms" }}>
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-border">
              <h2 className="font-display font-bold flex items-center gap-2">
                <span className="tone-icon tone-primary w-7 h-7 rounded-lg">
                  <Terminal size={14} />
                </span>
                Commands &amp; usage
              </h2>
              <span className="text-xs text-subtle">{tool.commands.length} entries</span>
            </div>
            <ul className="divide-y divide-border">
              {tool.commands.map((cmd, i) => (
                <li key={i} className="group grid sm:grid-cols-[1fr_auto] gap-2 sm:gap-4 px-5 py-3.5 hover:bg-surface-2 transition-colors">
                  <div className="min-w-0">
                    <code className="text-primary font-mono text-[13px] break-all leading-relaxed">{cmd.command}</code>
                    <p className="text-sm text-muted mt-1 leading-snug">{cmd.description}</p>
                  </div>
                  <CopyButton text={cmd.command} className="opacity-60 group-hover:opacity-100 self-start" />
                </li>
              ))}
            </ul>
          </section>

          {/* Use cases */}
          <section className="card p-5 animate-fade-up" style={{ animationDelay: "180ms" }}>
            <h2 className="font-display font-bold flex items-center gap-2 mb-4">
              <span className="tone-icon tone-violet w-7 h-7 rounded-lg">
                <Target size={14} />
              </span>
              Use cases
            </h2>
            <div className="flex flex-wrap gap-2">
              {tool.useCases.map((uc) => (
                <span key={uc} className="tone-badge tone-violet text-[13px] py-1.5 px-3">
                  {uc}
                </span>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <aside className="space-y-4 animate-fade-up" style={{ animationDelay: "200ms" }}>
          <div className="card p-5">
            <p className="eyebrow mb-3 text-[10px]">Documentation</p>
            <a href={tool.officialDocs} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline break-all flex items-start gap-1.5">
              <ArrowUpRight size={14} className="shrink-0 mt-0.5" />
              {tool.officialDocs.replace(/^https?:\/\//, "")}
            </a>
          </div>

          {related.length > 0 && (
            <div className="card p-5">
              <p className="eyebrow mb-3 text-[10px]">Related tools</p>
              <ul className="space-y-1">
                {related.map((r) => (
                  <li key={r.slug}>
                    <Link href={`/tools/${r.slug}`} className="flex items-center gap-2.5 p-2 -mx-2 rounded-lg hover:bg-surface-2 transition-colors group">
                      <LogoImage src={r.logo} name={r.name} size={16} className="!rounded-md" />
                      <span className="text-sm font-medium flex-1 truncate group-hover:text-primary transition-colors">{r.name}</span>
                      <ChevronRight size={13} className="text-subtle" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <Link href="/tools" className="btn btn-ghost btn-sm w-full justify-start">
            <ArrowLeft size={14} />
            Back to library
          </Link>
        </aside>
      </div>
    </div>
  );
}
