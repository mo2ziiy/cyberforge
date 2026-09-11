import { NextRequest, NextResponse } from "next/server";
import { tools } from "@/data/tools";
import { cheatsheets } from "@/data/cheatsheets";
import { labs } from "@/data/labs";
import { resources } from "@/data/resources";
import { writeups } from "@/data/writeups";
import { glossaryTerms } from "@/data/glossary";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.toLowerCase() || "";

  if (!q) {
    return NextResponse.json({ results: [] });
  }

  const results: { type: string; title: string; description: string; href: string; category: string }[] = [];

  tools.forEach((t) => {
    if (t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q) || t.tags.some((tag) => tag.toLowerCase().includes(q))) {
      results.push({ type: "tool", title: t.name, description: t.description, href: `/tools/${t.slug}`, category: t.category });
    }
  });

  cheatsheets.forEach((cs) => {
    if (cs.title.toLowerCase().includes(q) || cs.category.toLowerCase().includes(q)) {
      results.push({ type: "cheatsheet", title: cs.title, description: `${cs.sections.length} sections`, href: `/cheatsheets/${cs.id}`, category: cs.category });
    }
  });

  labs.forEach((l) => {
    if (l.name.toLowerCase().includes(q) || l.description.toLowerCase().includes(q)) {
      results.push({ type: "lab", title: l.name, description: l.description, href: l.url, category: l.category });
    }
  });

  resources.forEach((r) => {
    if (r.name.toLowerCase().includes(q) || r.description.toLowerCase().includes(q) || r.category.toLowerCase().includes(q)) {
      results.push({ type: "resource", title: r.name, description: r.description, href: r.url, category: r.category });
    }
  });

  writeups.forEach((w) => {
    if (w.title.toLowerCase().includes(q) || w.description.toLowerCase().includes(q) || w.topics.some((t) => t.toLowerCase().includes(q))) {
      results.push({ type: "writeup", title: w.title, description: w.description, href: `/writeups/${w.id}`, category: w.category });
    }
  });

  glossaryTerms.forEach((g) => {
    if (g.term.toLowerCase().includes(q) || g.definition.toLowerCase().includes(q)) {
      results.push({ type: "glossary", title: g.term, description: g.definition.slice(0, 100) + "...", href: `/glossary#${g.term.toLowerCase().replace(/\s+/g, "-")}`, category: g.category });
    }
  });

  return NextResponse.json({ results });
}
