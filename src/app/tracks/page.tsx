"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Map, ArrowRight, Wrench, Brain, Layers, BookOpen } from "lucide-react";
import { tracks } from "@/data/tracks";
import { quizIdForTrack } from "@/lib/trackQuiz";
import { trackIconMap, trackToneClass } from "@/lib/trackIcons";
import { fadeUp, stagger } from "@/lib/motion";
import PageHeader from "@/components/ui/PageHeader";
import SpotlightCard from "@/components/ui/SpotlightCard";

export default function TracksPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <PageHeader
        badge={`${tracks.length} Domains`}
        badgeIcon={Map}
        title="Cybersecurity"
        titleHighlight="Tracks"
        subtitle="Explore every major security domain. Each track includes a structured roadmap, related tools, key topics, and a quiz to test yourself."
      />

      <motion.div variants={stagger(0, 0.07)} initial="hidden" animate="visible" className="grid md:grid-cols-2 gap-5">
        {tracks.map((track, idx) => {
          const Icon = trackIconMap[track.id];
          const quizId = quizIdForTrack(track.id);
          return (
            <motion.div key={track.id} id={track.id} variants={fadeUp} className={`scroll-mt-28 ${trackToneClass(track.id)}`}>
              <SpotlightCard className="group h-full p-6 overflow-hidden">
                <div className="absolute inset-0 tone-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute -right-6 -bottom-8 opacity-[0.07] group-hover:opacity-[0.12] transition-opacity tone-text pointer-events-none" aria-hidden>
                  {Icon && <Icon size={180} />}
                </div>

                <div className="relative">
                  <div className="flex items-start gap-4 mb-5">
                    <div className="tone-icon w-14 h-14 rounded-2xl shrink-0 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300">
                      {Icon && <Icon size={26} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-[11px] tone-text opacity-70">{String(idx + 1).padStart(2, "0")}</span>
                        <Link href={`/tracks/${track.id}`} className="font-display text-xl font-bold group-hover:text-primary transition-colors">
                          <h2>{track.name}</h2>
                        </Link>
                      </div>
                      <p className="text-sm text-muted leading-relaxed">{track.description}</p>
                    </div>
                  </div>

                  <div className="mb-5">
                    <p className="eyebrow mb-2.5 text-[10px]">
                      <Layers size={11} /> Key topics
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {track.topics.map((topic) => (
                        <span key={topic} className="chip cursor-default">
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-4 border-t border-border">
                    <Link href={`/tracks/${track.id}`} className="btn btn-sm btn-primary">
                      <BookOpen size={14} />
                      Open track
                      <ArrowRight size={13} />
                    </Link>
                    <Link href={`/roadmaps/${track.id}`} className="btn btn-sm btn-outline">
                      <Map size={14} />
                      Roadmap
                    </Link>
                    <Link href={`/tracks/${track.id}#tools`} className="btn btn-sm btn-outline">
                      <Wrench size={14} />
                      Tools
                    </Link>
                    {/* Every track resolves to a quiz via trackQuizMap, so this button is never dropped. */}
                    <Link href={`/quiz/${quizId}`} className="btn btn-sm btn-ghost">
                      <Brain size={14} />
                      Quiz
                    </Link>
                  </div>
                </div>
              </SpotlightCard>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
