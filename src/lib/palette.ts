/**
 * Theme-aware color tones. Each value is a CSS class defined in globals.css
 * (`.tone-*`) that sets `--tone` for `.tone-badge`, `.tone-icon`, `.tone-text`.
 */
export type Tone =
  | "cyan" | "blue" | "sky" | "indigo" | "violet" | "purple" | "fuchsia" | "pink"
  | "rose" | "red" | "orange" | "amber" | "yellow" | "lime" | "green" | "emerald"
  | "teal" | "slate" | "primary";

export const tone = (t: Tone) => `tone-${t}`;

export const difficultyTone: Record<string, Tone> = {
  Beginner: "green",
  Easy: "green",
  Entry: "green",
  Intermediate: "amber",
  Medium: "amber",
  Advanced: "red",
  Hard: "orange",
  Expert: "red",
  Insane: "red",
  "All Levels": "blue",
};

export const platformTone: Record<string, Tone> = {
  HackTheBox: "green",
  TryHackMe: "red",
  CTFtime: "blue",
  PicoCTF: "purple",
  VulnHub: "orange",
};

export const resourceTypeTone: Record<string, Tone> = {
  Documentation: "blue",
  Blog: "purple",
  Video: "red",
  Book: "amber",
  Course: "green",
  Community: "pink",
  Tool: "cyan",
  Reference: "indigo",
  Lab: "green",
  Certification: "red",
  Practice: "orange",
  Research: "violet",
  Path: "teal",
  Workshop: "indigo",
  Wargame: "rose",
};

export const newsCategoryTone: Record<string, Tone> = {
  Threats: "red",
  Vulnerabilities: "orange",
  Tools: "cyan",
  "AI Security": "purple",
  "Data Breaches": "rose",
  Malware: "red",
  Research: "blue",
  Policy: "slate",
};

export const writeupCategoryTone: Record<string, Tone> = {
  Web: "blue",
  Pwn: "red",
  Forensics: "teal",
  Crypto: "violet",
  Reverse: "orange",
  OSINT: "indigo",
  Misc: "slate",
  Network: "green",
};

export const quizCategoryTone: Record<string, Tone> = {
  "Web Security": "blue",
  "Network Security": "cyan",
  Cryptography: "purple",
  Linux: "green",
  "Malware Analysis": "red",
  CTF: "yellow",
  "Active Directory": "orange",
  "Cloud Security": "sky",
  "Digital Forensics": "teal",
  "Reverse Engineering": "pink",
  OSINT: "indigo",
  "Incident Response": "emerald",
  "Social Engineering": "amber",
};

export const certColorTone: Record<string, Tone> = {
  red: "red",
  blue: "blue",
  cyan: "cyan",
  green: "green",
  orange: "orange",
  purple: "purple",
  yellow: "yellow",
};

export const cheatsheetTone: Record<string, Tone> = {
  "linux-commands": "green",
  "nmap-cheatsheet": "blue",
  "wireshark-filters": "cyan",
  "metasploit-commands": "red",
  "burp-suite-shortcuts": "orange",
  "reverse-shells": "purple",
  "sql-injection": "yellow",
  "privilege-escalation": "rose",
};

export const toneOf = (map: Record<string, Tone>, key: string, fallback: Tone = "slate") =>
  `tone-${map[key] ?? fallback}`;
