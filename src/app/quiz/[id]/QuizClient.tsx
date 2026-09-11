"use client";

import { useState, useCallback, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, CheckCircle2, XCircle, ChevronRight, RotateCcw, ArrowLeft, Trophy, Target, AlertCircle, Sparkles, Share2, Check } from "lucide-react";
import { quizzes } from "@/data/quizzes";
import { difficultyTone, quizCategoryTone } from "@/lib/palette";
import { EASE } from "@/lib/motion";
import EmptyState from "@/components/ui/EmptyState";

function getScoreMessage(pct: number) {
  if (pct <= 50) return { message: "Keep practicing", sub: "Review the explanations and try again.", icon: Target, tone: "tone-red" };
  if (pct <= 75) return { message: "Good job", sub: "Solid foundation — a few more reps and you're there.", icon: Brain, tone: "tone-amber" };
  return { message: "Excellent", sub: "You've mastered this topic. On to the next one!", icon: Trophy, tone: "tone-green" };
}

const letters = ["A", "B", "C", "D", "E", "F"];

export default function QuizClient() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const quiz = quizzes.find((q) => q.id === id);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [copied, setCopied] = useState(false);

  const resetQuiz = useCallback(() => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setAnswered(false);
    setScore(0);
    setFinished(false);
  }, []);

  // keyboard shortcuts: 1-4 select, Enter next
  useEffect(() => {
    if (!quiz || finished) return;
    const onKey = (e: KeyboardEvent) => {
      const q = quiz.questions[currentIndex];
      if (!answered && /^[1-9]$/.test(e.key)) {
        const idx = Number(e.key) - 1;
        if (idx < q.options.length) {
          setSelectedOption(idx);
          setAnswered(true);
          if (idx === q.correct) setScore((s) => s + 1);
        }
      } else if (answered && e.key === "Enter") {
        if (currentIndex + 1 >= quiz.questions.length) setFinished(true);
        else {
          setCurrentIndex((i) => i + 1);
          setSelectedOption(null);
          setAnswered(false);
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [quiz, currentIndex, answered, finished]);

  if (!quiz) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20">
        <EmptyState icon={AlertCircle} title="Quiz not found" description="This quiz does not exist or has been removed." actionLabel="Back to quizzes" onAction={() => router.push("/quiz")} />
      </div>
    );
  }

  const toneCls = `tone-${quizCategoryTone[quiz.category] ?? "primary"}`;
  const question = quiz.questions[currentIndex];
  const total = quiz.questions.length;
  const progress = (currentIndex / total) * 100;
  const percentage = Math.round((score / total) * 100);
  const result = getScoreMessage(percentage);
  const isCorrect = selectedOption === question.correct;

  const handleSelect = (i: number) => {
    if (answered) return;
    setSelectedOption(i);
    setAnswered(true);
    if (i === question.correct) setScore((s) => s + 1);
  };

  const handleNext = () => {
    if (currentIndex + 1 >= total) setFinished(true);
    else {
      setCurrentIndex((i) => i + 1);
      setSelectedOption(null);
      setAnswered(false);
    }
  };

  const share = async () => {
    const text = `I scored ${score}/${total} (${percentage}%) on the "${quiz.title}" quiz at CyberForge!`;
    try {
      if (navigator.share) await navigator.share({ text, url: window.location.href });
      else {
        await navigator.clipboard.writeText(`${text} ${window.location.href}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 1600);
      }
    } catch {
      /* cancelled */
    }
  };

  const optionClass = (i: number) => {
    if (!answered) return "border-border bg-surface hover:border-primary/50 hover:bg-primary/5 cursor-pointer";
    if (i === question.correct) return "tone-green tone-border border-2 tone-bg";
    if (i === selectedOption) return "tone-red tone-border border-2 tone-bg";
    return "border-border bg-surface opacity-45";
  };

  /* ───────── Results ───────── */
  if (finished) {
    const RIcon = result.icon;
    const r = 56;
    const circ = 2 * Math.PI * r;
    return (
      <div className={`max-w-2xl mx-auto px-4 sm:px-6 py-12 ${toneCls}`}>
        <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, ease: EASE }} className="card hairline-top overflow-hidden">
          <div className="absolute inset-0 tone-gradient opacity-60 pointer-events-none" />
          <div className="relative p-8 sm:p-10 text-center">
            <div className={`relative w-36 h-36 mx-auto mb-6 ${result.tone}`}>
              <svg viewBox="0 0 128 128" className="w-36 h-36 -rotate-90">
                <circle cx="64" cy="64" r={r} fill="none" stroke="rgb(var(--tone) / 0.15)" strokeWidth="8" />
                <motion.circle
                  cx="64"
                  cy="64"
                  r={r}
                  fill="none"
                  stroke="rgb(var(--tone))"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={circ}
                  initial={{ strokeDashoffset: circ }}
                  animate={{ strokeDashoffset: circ - (percentage / 100) * circ }}
                  transition={{ duration: 1.4, delay: 0.3, ease: EASE }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring", stiffness: 240 }} className="tone-icon w-11 h-11 rounded-xl mb-1">
                  <RIcon size={20} />
                </motion.span>
                <span className="font-display text-2xl font-bold tone-text tabular-nums">{percentage}%</span>
              </div>
            </div>

            <h2 className="font-display text-3xl font-bold mb-1">{result.message}</h2>
            <p className="text-muted mb-8">{result.sub}</p>

            <div className="grid grid-cols-3 gap-3 mb-8">
              {[
                { label: "Score", value: `${score}/${total}` },
                { label: "Correct", value: score },
                { label: "Missed", value: total - score },
              ].map((s) => (
                <div key={s.label} className="p-4 rounded-xl bg-surface/70 border border-border">
                  <p className="font-display text-2xl font-bold tabular-nums">{s.value}</p>
                  <p className="text-xs text-muted mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button onClick={resetQuiz} className="btn btn-primary">
                <RotateCcw size={15} />
                Try again
              </button>
              <button onClick={share} className="btn btn-outline">
                {copied ? <Check size={15} className="text-success" /> : <Share2 size={15} />}
                {copied ? "Copied" : "Share result"}
              </button>
              <Link href="/quiz" className="btn btn-ghost">
                <ArrowLeft size={15} />
                All quizzes
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  /* ───────── Question ───────── */
  return (
    <div className={`max-w-2xl mx-auto px-4 sm:px-6 py-12 ${toneCls}`}>
      <div className="flex items-center justify-between mb-5 gap-3">
        <Link href="/quiz" className="btn btn-ghost btn-sm -ml-2">
          <ArrowLeft size={15} />
          Back
        </Link>
        <div className="flex items-center gap-2 min-w-0">
          <span className="tone-icon w-7 h-7 rounded-lg shrink-0">
            <Brain size={14} />
          </span>
          <span className="text-sm font-semibold truncate">{quiz.title}</span>
        </div>
        <span className="text-sm text-muted font-medium tabular-nums shrink-0">
          {currentIndex + 1} <span className="text-subtle">/ {total}</span>
        </span>
      </div>

      <div className="progress h-2 mb-8">
        <motion.div className="progress-fill" animate={{ width: `${progress}%` }} transition={{ duration: 0.5, ease: EASE }} />
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={currentIndex} initial={{ opacity: 0, x: 32 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -32 }} transition={{ duration: 0.3, ease: EASE }}>
          <div className="card p-6 sm:p-7 mb-4">
            <div className="flex items-center gap-2.5 mb-5">
              <span className={`tone-badge tone-${difficultyTone[question.difficulty] ?? "slate"}`}>{question.difficulty}</span>
              <span className="text-xs text-subtle">Question {currentIndex + 1}</span>
              <span className="ml-auto hidden sm:flex items-center gap-1 text-[11px] text-subtle">
                <kbd>1</kbd>–<kbd>{Math.min(question.options.length, 9)}</kbd> to answer
              </span>
            </div>

            <h2 className="font-display text-lg sm:text-xl font-semibold leading-relaxed mb-6">{question.question}</h2>

            <div className="space-y-2.5">
              {question.options.map((option, index) => {
                const showCorrect = answered && index === question.correct;
                const showWrong = answered && index === selectedOption && index !== question.correct;
                return (
                  <motion.button
                    key={index}
                    whileHover={!answered ? { x: 3 } : {}}
                    whileTap={!answered ? { scale: 0.99 } : {}}
                    onClick={() => handleSelect(index)}
                    disabled={answered}
                    className={`w-full text-left px-4 py-3.5 rounded-xl border transition-all flex items-center gap-3 ${optionClass(index)}`}
                  >
                    <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${answered && (showCorrect || showWrong) ? "tone-icon" : "bg-surface-2 border border-border text-muted"}`}>
                      {showCorrect ? <CheckCircle2 size={15} /> : showWrong ? <XCircle size={15} /> : letters[index]}
                    </span>
                    <span className={`text-sm leading-relaxed flex-1 ${showCorrect || showWrong ? "tone-text font-medium" : ""}`}>{option}</span>
                  </motion.button>
                );
              })}
            </div>
          </div>

          <AnimatePresence>
            {answered && (
              <motion.div
                initial={{ opacity: 0, y: 10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, y: 10, height: 0 }}
                transition={{ duration: 0.3, ease: EASE }}
                className={`overflow-hidden ${isCorrect ? "tone-green" : "tone-red"}`}
              >
                <div className="rounded-xl border tone-border tone-bg p-4 mb-4">
                  <div className="flex items-start gap-3">
                    <span className="tone-icon w-8 h-8 rounded-lg shrink-0">{isCorrect ? <Sparkles size={15} /> : <XCircle size={15} />}</span>
                    <div>
                      <p className="text-sm font-semibold mb-1 tone-text">{isCorrect ? "Correct!" : "Not quite"}</p>
                      <p className="text-sm text-muted leading-relaxed">{question.explanation}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted">
          <CheckCircle2 size={14} className="text-success" />
          <span className="tabular-nums">{score} correct so far</span>
        </div>
        <motion.button
          animate={answered ? { opacity: 1, y: 0 } : { opacity: 0, y: 6, pointerEvents: "none" }}
          transition={{ duration: 0.2 }}
          onClick={handleNext}
          className="btn btn-primary"
        >
          {currentIndex + 1 >= total ? "View results" : "Next"}
          <ChevronRight size={15} />
        </motion.button>
      </div>
    </div>
  );
}
