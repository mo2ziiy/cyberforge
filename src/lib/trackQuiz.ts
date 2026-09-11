import { quizzes, type Quiz } from "@/data/quizzes";

/**
 * Explicit track → quiz mapping.
 *
 * The `track` field inside the quiz data is inconsistent (some quizzes use
 * "network", "forensics" or "ctf", and three different quizzes all claim
 * "penetration-testing"), so looking a quiz up by that field left several
 * tracks with no quiz at all. This map guarantees every one of the 10 tracks
 * resolves to exactly one primary quiz.
 */
export const trackQuizMap: Record<string, string> = {
  "web-security": "web-security",
  "network-security": "network-security",
  "penetration-testing": "linux-privesc",
  "malware-analysis": "malware-analysis",
  "digital-forensics": "digital-forensics",
  "red-team": "social-engineering",
  "blue-team": "incident-response",
  cryptography: "cryptography-basics",
  "cloud-security": "cloud-security",
  "reverse-engineering": "reverse-engineering",
};

/** Additional quizzes worth surfacing on a given track page. */
export const trackExtraQuizzes: Record<string, string[]> = {
  "penetration-testing": ["active-directory", "osint", "ctf-basics"],
  "red-team": ["osint", "active-directory"],
  "blue-team": ["malware-analysis"],
  "web-security": ["ctf-basics"],
  "digital-forensics": ["ctf-basics"],
  "network-security": ["ctf-basics"],
};

/** The primary quiz for a track. Always defined for the 10 shipped tracks. */
export const quizForTrack = (trackId: string): Quiz | undefined => {
  const id = trackQuizMap[trackId];
  return id ? quizzes.find((q) => q.id === id) : undefined;
};

/** The quiz id for a track — safe to use directly in a `/quiz/[id]` href. */
export const quizIdForTrack = (trackId: string): string | undefined => {
  const quiz = quizForTrack(trackId);
  return quiz?.id;
};

export const extraQuizzesForTrack = (trackId: string): Quiz[] =>
  (trackExtraQuizzes[trackId] ?? []).map((id) => quizzes.find((q) => q.id === id)).filter((q): q is Quiz => Boolean(q));
