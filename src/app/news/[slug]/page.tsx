import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Calendar, Radio, Clock, Zap, ChevronRight, Newspaper } from "lucide-react";
import { newsArticles } from "@/data/news";
import { newsCategoryTone } from "@/lib/palette";
import { buildNewsBody, readingMinutes } from "@/lib/newsBody";
import Breadcrumb from "@/components/ui/Breadcrumb";
import NewsImage from "@/components/news/NewsImage";

export function generateStaticParams() {
  return newsArticles.map((a) => ({ slug: a.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const a = newsArticles.find((x) => x.id === slug);
  return a ? { title: a.title, description: a.summary } : {};
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

export default async function NewsArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = newsArticles.find((a) => a.id === slug);
  if (!article) notFound();

  const toneCls = `tone-${newsCategoryTone[article.category] ?? "slate"}`;
  const body = buildNewsBody(article);
  const minutes = readingMinutes(article);

  // Prefer same-category articles, then top up with the newest others.
  const sameCategory = newsArticles.filter((a) => a.category === article.category && a.id !== article.id);
  const others = newsArticles.filter((a) => a.category !== article.category && a.id !== article.id);
  const related = [...sameCategory, ...others].slice(0, 3);

  return (
    <div className={`max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 ${toneCls}`}>
      <Breadcrumb items={[{ label: "News", href: "/news" }, { label: article.title }]} />

      <article>
        {/* Header */}
        <header className="mb-6">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="tone-badge">{article.category}</span>
            {article.isBreaking && (
              <span className="tone-badge tone-red">
                <Zap size={10} className="fill-current" />
                Breaking
              </span>
            )}
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold leading-tight mb-5">{article.title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted">
            <span className="flex items-center gap-1.5 font-medium text-foreground/80">
              <Radio size={13} className="text-primary" />
              {article.source}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar size={13} />
              {formatDate(article.publishDate)}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock size={13} />
              {minutes} min read
            </span>
          </div>
        </header>

        {/* Featured image */}
        <div className="relative w-full aspect-[16/8] rounded-2xl overflow-hidden border border-border mb-8">
          <NewsImage src={article.image} title={article.title} category={article.category} />
          <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(to top, rgb(var(--tone) / 0.10), transparent 60%)" }} />
        </div>

        {/* Body */}
        <div className="max-w-2xl mx-auto">
          <p className="text-lg text-foreground/90 leading-relaxed mb-6 font-medium">{article.summary}</p>

          <div className="space-y-5 text-[15px] leading-[1.75] text-muted">
            {/* body[0] is the lead framing and body[1] repeats the summary shown above; skip both. */}
            {body.slice(2).map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-border flex flex-wrap items-center gap-3">
            <a href={article.url} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm">
              Read at {article.source}
              <ArrowUpRight size={14} />
            </a>
            <Link href="/news" className="btn btn-ghost btn-sm">
              <ArrowLeft size={14} />
              Back to News
            </Link>
          </div>
        </div>
      </article>

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-14 pt-10 border-t border-border">
          <h2 className="font-display text-xl font-bold mb-6 flex items-center gap-2.5">
            <Newspaper size={18} className="text-primary" />
            Related articles
          </h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {related.map((a) => (
              <Link key={a.id} href={`/news/${a.id}`} className={`group block h-full tone-${newsCategoryTone[a.category] ?? "slate"}`}>
                <div className="card card-hover h-full overflow-hidden flex flex-col">
                  <div className="w-full aspect-[16/9] overflow-hidden relative shrink-0">
                    <NewsImage src={a.image} title={a.title} category={a.category} />
                    <div className="absolute bottom-2 left-2">
                      <span className="tone-badge backdrop-blur-sm text-[10px] py-0.5">{a.category}</span>
                    </div>
                  </div>
                  <div className="p-4 flex flex-col flex-1">
                    <h3 className="font-display font-bold text-sm leading-snug mb-2 line-clamp-3 group-hover:text-primary transition-colors flex-1">{a.title}</h3>
                    <div className="flex items-center justify-between text-[11px] text-subtle pt-2 mt-auto border-t border-border">
                      <span className="truncate">{a.source}</span>
                      <ChevronRight size={12} className="shrink-0" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
