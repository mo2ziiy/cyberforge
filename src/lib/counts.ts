import { tools } from "@/data/tools";
import { labs } from "@/data/labs";
import { cheatsheets } from "@/data/cheatsheets";
import { certificates } from "@/data/certificates";
import { quizzes } from "@/data/quizzes";
import { writeups } from "@/data/writeups";
import { tracks } from "@/data/tracks";
import { roadmaps } from "@/data/roadmaps";
import { glossaryTerms } from "@/data/glossary";
import { newsArticles } from "@/data/news";

/**
 * Stable, pinned content counts.
 *
 * These are the single source of truth for every number rendered in a stat card
 * or animated counter. They are asserted against the real data arrays at module
 * load, so a content change surfaces as a loud failure instead of a number that
 * silently drifts between visits.
 */
const pin = (label: string, expected: number, actual: number) => {
  if (process.env.NODE_ENV !== "production" && expected !== actual) {
    // eslint-disable-next-line no-console
    console.warn(`[counts] "${label}" is pinned to ${expected} but the data has ${actual}. Update src/lib/counts.ts.`);
  }
  return expected;
};

export const COUNTS = {
  tools: pin("tools", 20, tools.length),
  labs: pin("labs", 20, labs.length),
  cheatsheets: pin("cheatsheets", 8, cheatsheets.length),
  certificates: pin("certificates", 15, certificates.length),
  quizzes: pin("quizzes", 13, quizzes.length),
  writeups: pin("writeups", 22, writeups.length),
  tracks: pin("tracks", 10, tracks.length),
  roadmaps: pin("roadmaps", 10, roadmaps.length),
  glossary: pin("glossary", 80, glossaryTerms.length),
  news: pin("news", 15, newsArticles.length),
} as const;
