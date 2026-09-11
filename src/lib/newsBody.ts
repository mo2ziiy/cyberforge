import type { NewsArticle } from "@/data/news";

/**
 * Expands a news article's one-paragraph summary into a short, readable body.
 *
 * The dataset only stores a headline and summary, so the article body is
 * generated deterministically around that summary with category-aware framing
 * and a "why it matters" close. It is clearly editorial scaffolding, not
 * fabricated reporting: the source link remains the authoritative reference.
 */

const categoryAngle: Record<string, { lead: string; matters: string }> = {
  Vulnerabilities: {
    lead: "A newly disclosed vulnerability is drawing urgent attention from defenders.",
    matters: "Unpatched systems are the most common route into an organisation. Prioritise patching internet-facing assets and confirm your asset inventory reflects every affected version.",
  },
  Threats: {
    lead: "Threat researchers are tracking renewed activity from a capable adversary.",
    matters: "Understanding attacker tradecraft lets defenders write detections that fire on behaviour rather than on easily-changed indicators. Map the reported techniques to your own telemetry.",
  },
  Malware: {
    lead: "A new malware strain is circulating, and its capabilities are worth understanding early.",
    matters: "Early indicators and behavioural signatures let a SOC detect an infection before it spreads. Feed the reported indicators into your monitoring and hunt for the described behaviour.",
  },
  "AI Security": {
    lead: "The intersection of machine learning and security is producing both new attacks and new defences.",
    matters: "AI reshapes the economics of attacks like phishing and evasion. Assume adversaries have the same tools you do, and test your controls against machine-generated inputs.",
  },
  "Data Breaches": {
    lead: "Another significant breach underscores how exposure often arrives through a trusted third party.",
    matters: "Third-party and supply-chain exposure is now a leading breach vector. Review what data your vendors hold and what your incident plan assumes about their security.",
  },
  Research: {
    lead: "New research is challenging assumptions defenders have relied on.",
    matters: "Today's academic result is tomorrow's production attack. Track the research so your threat model does not lag the state of the art.",
  },
  Tools: {
    lead: "A notable update to the security toolchain is changing how practitioners work.",
    matters: "The right tooling compounds a team's effectiveness. Evaluate whether it fits your workflow before it becomes the community default.",
  },
  Policy: {
    lead: "A regulatory development is reshaping the compliance landscape for security teams.",
    matters: "Policy sets the floor for security programmes and carries real penalties. Confirm which obligations apply to you and where the current gaps are.",
  },
};

export function buildNewsBody(article: NewsArticle): string[] {
  const angle = categoryAngle[article.category] ?? {
    lead: "A developing story in the security world is worth a closer look.",
    matters: "Staying current with security news is part of the job. Weigh how this development affects your own environment.",
  };

  const paras = [angle.lead, article.summary];

  if (article.isBreaking) {
    paras.push(
      `Because ${article.source} has flagged this as a breaking, actively-developing story, details may change as more information becomes available. Treat the specifics below as a first read rather than a final account.`
    );
  } else {
    paras.push(
      `${article.source} reports the details above as part of its ongoing coverage in the ${article.category.toLowerCase()} space. The picture is likely to sharpen over the coming days as other researchers weigh in.`
    );
  }

  paras.push(
    `For security teams, the practical question is always the same: what changes because of this? ${angle.matters}`
  );

  paras.push("Follow the source link below for the full report and any indicators of compromise the original authors have published.");

  return paras;
}

/** Rough reading time for the generated body, in minutes. */
export function readingMinutes(article: NewsArticle): number {
  const words = (article.summary + article.title).split(/\s+/).length + 180;
  return Math.max(2, Math.round(words / 200));
}
