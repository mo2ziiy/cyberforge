import {
  Globe,
  Network,
  Target,
  Bug,
  Search,
  ShieldAlert,
  Shield,
  Lock,
  Cloud,
  Cpu,
  type LucideIcon,
} from "lucide-react";
import type { Tone } from "./palette";

export const trackIconMap: Record<string, LucideIcon> = {
  "web-security": Globe,
  "network-security": Network,
  "penetration-testing": Target,
  "malware-analysis": Bug,
  "digital-forensics": Search,
  "red-team": ShieldAlert,
  "blue-team": Shield,
  "cryptography": Lock,
  "cloud-security": Cloud,
  "reverse-engineering": Cpu,
};

/** Theme-aware tone per track (see globals.css `.tone-*`). */
export const trackTone: Record<string, Tone> = {
  "web-security": "blue",
  "network-security": "green",
  "penetration-testing": "red",
  "malware-analysis": "yellow",
  "digital-forensics": "purple",
  "red-team": "rose",
  "blue-team": "indigo",
  "cryptography": "teal",
  "cloud-security": "sky",
  "reverse-engineering": "orange",
};

export const trackToneClass = (id: string) => `tone-${trackTone[id] ?? "cyan"}`;

/* Legacy exports kept for compatibility */
export const trackColorMap: Record<string, string> = Object.fromEntries(
  Object.keys(trackIconMap).map((id) => [id, "tone-gradient"])
);
export const trackIconColorMap: Record<string, string> = Object.fromEntries(
  Object.keys(trackIconMap).map((id) => [id, "tone-text"])
);
