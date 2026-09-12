import { tools } from "@/data/tools";
import { cheatsheets } from "@/data/cheatsheets";
import { labs } from "@/data/labs";
import { resources } from "@/data/resources";
import { writeups } from "@/data/writeups";
import { glossaryTerms } from "@/data/glossary";
import { newsArticles } from "@/data/news";

export type ResultType = "tool" | "cheatsheet" | "lab" | "resource" | "writeup" | "glossary" | "news";

export interface SearchResult {
  type: ResultType;
  title: string;
  description: string;
  href: string;
  category: string;
}

const has = (s: string, q: string) => s.toLowerCase().includes(q);

/**
 * Client-side search across every content collection. The platform ships as a
 * static export with no backend, so search runs entirely over the bundled data
 * files — the same logic that used to live in the /api/search route.
 */
export function performSearch(query: string): SearchResult[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const out: SearchResult[] = [];

  tools.forEach((t) => {
    if (has(t.name, q) || has(t.description, q) || t.tags.some((x) => has(x, q)) || has(t.category, q))
      out.push({ type: "tool", title: t.name, description: t.description, href: `/tools/${t.slug}`, category: t.category });
  });

  cheatsheets.forEach((cs) => {
    if (has(cs.title, q) || has(cs.category, q) || cs.sections.some((s) => s.items.some((i) => has(i.command, q) || has(i.description, q))))
      out.push({ type: "cheatsheet", title: cs.title, description: `${cs.sections.length} sections of commands`, href: `/cheatsheets/${cs.id}`, category: cs.category });
  });

  labs.forEach((l) => {
    if (has(l.name, q) || has(l.description, q) || has(l.category, q) || l.tags.some((x) => has(x, q)))
      out.push({ type: "lab", title: l.name, description: l.description, href: l.url, category: l.category });
  });

  resources.forEach((r) => {
    if (has(r.name, q) || has(r.description, q) || has(r.category, q) || r.tags.some((x) => has(x, q)))
      out.push({ type: "resource", title: r.name, description: r.description, href: r.url, category: r.category });
  });

  writeups.forEach((w) => {
    if (has(w.title, q) || has(w.description, q) || w.topics.some((x) => has(x, q)))
      out.push({ type: "writeup", title: w.title, description: w.description, href: `/writeups/${w.id}`, category: `${w.platform} · ${w.category}` });
  });

  glossaryTerms.forEach((g) => {
    if (has(g.term, q) || has(g.definition, q))
      out.push({ type: "glossary", title: g.term, description: g.definition, href: `/glossary#${g.term.toLowerCase().replace(/\s+/g, "-")}`, category: g.category });
  });

  newsArticles.forEach((n) => {
    if (has(n.title, q) || has(n.summary, q) || has(n.source, q))
      out.push({ type: "news", title: n.title, description: n.summary, href: n.url, category: n.category });
  });

  return out;
}
