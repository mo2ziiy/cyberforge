"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FileText, Terminal, Hash, TerminalSquare, Search, Wifi, ShieldAlert, Bug, RefreshCw, Database, TrendingUp, ArrowRight, type LucideIcon } from "lucide-react";
import { cheatsheets } from "@/data/cheatsheets";
import { cheatsheetTone } from "@/lib/palette";
import { fadeUp, stagger } from "@/lib/motion";
import PageHeader from "@/components/ui/PageHeader";
import SpotlightCard from "@/components/ui/SpotlightCard";

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

export default function CheatsheetsPage() {
  const totalCommands = cheatsheets.reduce((acc, c) => acc + c.sections.reduce((a, s) => a + s.items.length, 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <PageHeader
        badge={`${cheatsheets.length} sheets · ${totalCommands} commands`}
        badgeIcon={FileText}
        title="Quick Reference"
        titleHighlight="Cheat Sheets"
        subtitle="Essential commands, shortcuts, and techniques for every security tool and domain. Copy with one click."
      />

      <motion.div variants={stagger(0, 0.06)} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cheatsheets.map((cs) => {
          const count = cs.sections.reduce((acc, s) => acc + s.items.length, 0);
          const Icon = csIconMap[cs.id] ?? FileText;
          const toneCls = `tone-${cheatsheetTone[cs.id] ?? "primary"}`;
          return (
            <motion.div key={cs.id} variants={fadeUp} className={toneCls}>
              <Link href={`/cheatsheets/${cs.id}`} className="group block h-full">
                <SpotlightCard className="h-full p-5 flex flex-col">
                  <div className="absolute inset-0 tone-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative">
                    <div className="flex items-start gap-3 mb-4">
                      <div className="tone-icon w-12 h-12 rounded-xl shrink-0 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300">
                        <Icon size={22} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-display font-bold text-base group-hover:text-primary transition-colors flex items-center gap-1.5">
                          {cs.title}
                          <ArrowRight size={14} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                        </h3>
                        <span className="badge badge-muted mt-1">{cs.category}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-muted mb-4">
                      <span className="flex items-center gap-1.5">
                        <Hash size={13} className="tone-text" />
                        {cs.sections.length} sections
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Terminal size={13} className="tone-text" />
                        {count} commands
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {cs.sections.slice(0, 3).map((section) => (
                        <span key={section.title} className="chip">
                          {section.title}
                        </span>
                      ))}
                      {cs.sections.length > 3 && <span className="text-xs text-subtle self-center px-1">+{cs.sections.length - 3} more</span>}
                    </div>
                  </div>
                </SpotlightCard>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
