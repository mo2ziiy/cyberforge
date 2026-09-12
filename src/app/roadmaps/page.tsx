"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Map, ArrowRight, Clock, Layers, BookOpen } from "lucide-react";
import { tracks } from "@/data/tracks";
import { roadmaps } from "@/data/roadmaps";
import { trackIconMap, trackToneClass } from "@/lib/trackIcons";
import { fadeUp, stagger } from "@/lib/motion";
import PageHeader from "@/components/ui/PageHeader";
import SpotlightCard from "@/components/ui/SpotlightCard";

const levels = [
  { label: "Beginner", tone: "tone-green" },
  { label: "Intermediate", tone: "tone-amber" },
  { label: "Advanced", tone: "tone-red" },
];

export default function RoadmapsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <PageHeader
        badge={`${roadmaps.length} Learning Paths`}
        badgeIcon={Map}
        title="Learning"
        titleHighlight="Roadmaps"
        subtitle="Structured three-level paths, from Beginner to Advanced, for every cybersecurity domain, with hand-picked resources at each step."
      />

      <motion.div variants={stagger(0, 0.06)} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tracks.map((track) => {
          const Icon = trackIconMap[track.id];
          const roadmap = roadmaps.find((r) => r.trackId === track.id);
          const topics = roadmap?.levels.reduce((a, l) => a + l.topics.length, 0) ?? 0;
          const resources = roadmap?.levels.reduce((a, l) => a + l.resources.length, 0) ?? 0;

          return (
            <motion.div key={track.id} variants={fadeUp} className={trackToneClass(track.id)}>
              <Link href={`/roadmaps/${track.id}`} className="group block h-full">
                <SpotlightCard className="h-full p-5">
                  <div className="absolute inset-0 tone-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative">
                    <div className="flex items-center gap-4 mb-5">
                      <div className="tone-icon w-12 h-12 rounded-xl shrink-0 group-hover:scale-110 transition-transform duration-300">
                        {Icon && <Icon size={22} />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-display text-lg font-bold group-hover:text-primary transition-colors">{track.name}</h3>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted mt-0.5">
                          <span className="flex items-center gap-1">
                            <Layers size={11} /> {topics} topics
                          </span>
                          <span className="flex items-center gap-1">
                            <BookOpen size={11} /> {resources} resources
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock size={11} /> ~6 months
                          </span>
                        </div>
                      </div>
                      <ArrowRight size={18} className="text-subtle opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-primary transition-all" />
                    </div>

                    {/* level track */}
                    <div className="relative flex items-center gap-2">
                      {levels.map((lvl, i) => (
                        <div key={lvl.label} className={`flex-1 ${lvl.tone}`}>
                          <div className="h-1.5 rounded-full tone-bg overflow-hidden">
                            <div className="h-full rounded-full" style={{ width: "100%", background: `rgb(var(--tone) / ${0.45 + i * 0.2})` }} />
                          </div>
                          <p className="text-[11px] mt-1.5 font-medium tone-text">{lvl.label}</p>
                        </div>
                      ))}
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
