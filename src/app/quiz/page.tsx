"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Brain, Globe, Network, Lock, Terminal, Bug, Flag, ChevronRight, HelpCircle, Server, Cloud, Search, Cpu, Eye, ShieldCheck, Users, Clock, type LucideIcon } from "lucide-react";
import { quizzes } from "@/data/quizzes";
import { quizCategoryTone } from "@/lib/palette";
import { fadeUp, stagger } from "@/lib/motion";
import PageHeader from "@/components/ui/PageHeader";
import SpotlightCard from "@/components/ui/SpotlightCard";

const iconMap: Record<string, LucideIcon> = { Globe, Network, Lock, Terminal, Bug, Flag, Server, Cloud, Search, Cpu, Eye, ShieldCheck, Users };

export default function QuizPage() {
  const totalQuestions = quizzes.reduce((a, q) => a + q.questions.length, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <PageHeader
        badge={`${quizzes.length} quizzes · ${totalQuestions} questions`}
        badgeIcon={Brain}
        title="Practice"
        titleHighlight="Quizzes"
        subtitle="Test and reinforce your knowledge with interactive quizzes covering every major security domain. Instant feedback, clear explanations."
      />

      <motion.div variants={stagger(0, 0.06)} initial="hidden" animate="visible" className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {quizzes.map((quiz) => {
          const QuizIcon = quiz.icon ? iconMap[quiz.icon] ?? HelpCircle : HelpCircle;
          const toneCls = `tone-${quizCategoryTone[quiz.category] ?? "primary"}`;
          const counts = {
            Easy: quiz.questions.filter((q) => q.difficulty === "Easy").length,
            Medium: quiz.questions.filter((q) => q.difficulty === "Medium").length,
            Hard: quiz.questions.filter((q) => q.difficulty === "Hard").length,
          };

          return (
            <motion.div key={quiz.id} variants={fadeUp} className={toneCls}>
              <Link href={`/quiz/${quiz.id}`} className="group block h-full">
                <SpotlightCard className="h-full flex flex-col overflow-hidden">
                  {/* Banner */}
                  <div className="relative h-36 overflow-hidden tone-gradient">
                    <div className="absolute inset-0 bg-grid opacity-40" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full blur-2xl" style={{ background: "rgb(var(--tone) / 0.25)" }} />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="tone-icon w-16 h-16 rounded-2xl backdrop-blur-sm group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300 shadow-lg">
                        <QuizIcon size={30} />
                      </div>
                    </div>
                    <div className="absolute top-3 left-3">
                      <span className="tone-badge backdrop-blur-sm">{quiz.category}</span>
                    </div>
                    <div className="absolute top-3 right-3">
                      <span className="badge badge-muted backdrop-blur-sm">
                        <HelpCircle size={10} />
                        {quiz.questions.length} Q
                      </span>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 h-10" style={{ background: "linear-gradient(to top, var(--surface), transparent)" }} />
                  </div>

                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="font-display font-bold text-base leading-snug group-hover:text-primary transition-colors mb-2">{quiz.title}</h3>
                    <p className="text-sm text-muted leading-relaxed line-clamp-2 mb-4 flex-1">{quiz.description}</p>

                    {/* difficulty distribution bar */}
                    <div className="mb-4">
                      <div className="flex h-1.5 rounded-full overflow-hidden bg-surface-2 gap-px">
                        {counts.Easy > 0 && <span className="tone-green" style={{ flex: counts.Easy, background: "rgb(var(--tone))" }} />}
                        {counts.Medium > 0 && <span className="tone-amber" style={{ flex: counts.Medium, background: "rgb(var(--tone))" }} />}
                        {counts.Hard > 0 && <span className="tone-red" style={{ flex: counts.Hard, background: "rgb(var(--tone))" }} />}
                      </div>
                      <div className="flex gap-3 mt-2 text-[11px] text-muted">
                        {counts.Easy > 0 && (
                          <span className="tone-green flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full" style={{ background: "rgb(var(--tone))" }} /> {counts.Easy} easy
                          </span>
                        )}
                        {counts.Medium > 0 && (
                          <span className="tone-amber flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full" style={{ background: "rgb(var(--tone))" }} /> {counts.Medium} medium
                          </span>
                        )}
                        {counts.Hard > 0 && (
                          <span className="tone-red flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full" style={{ background: "rgb(var(--tone))" }} /> {counts.Hard} hard
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-border">
                      <span className="flex items-center gap-1.5 text-xs text-muted">
                        <Clock size={12} />~{quiz.questions.length} min
                      </span>
                      <span className="tone-badge py-1.5 px-3 group-hover:brightness-110 transition-all">
                        Start quiz
                        <ChevronRight size={13} className="transition-transform group-hover:translate-x-0.5" />
                      </span>
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
