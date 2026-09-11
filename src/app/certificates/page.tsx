"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Award, ArrowUpRight, Star, DollarSign, Clock, Eye, X, Building2, ListChecks } from "lucide-react";
import { certificates, Certificate } from "@/data/certificates";
import { certColorTone, difficultyTone } from "@/lib/palette";
import { fadeUp, stagger } from "@/lib/motion";
import PageHeader from "@/components/ui/PageHeader";
import FilterBar from "@/components/ui/FilterBar";
import EmptyState from "@/components/ui/EmptyState";
import SpotlightCard from "@/components/ui/SpotlightCard";

const levels = ["All", "Entry", "Intermediate", "Advanced", "Expert"];
const categories = ["All", ...Array.from(new Set(certificates.map((c) => c.category)))];

function CertificatePreviewModal({ cert, onClose }: { cert: Certificate; onClose: () => void }) {
  const toneCls = `tone-${certColorTone[cert.color] ?? "blue"}`;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4" onMouseDown={onClose} role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 20 }}
        transition={{ type: "spring", stiffness: 320, damping: 28 }}
        className={`relative z-10 w-full max-w-lg max-h-[90vh] overflow-y-auto glass-strong rounded-2xl ${toneCls}`}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="h-1" style={{ background: "linear-gradient(90deg, transparent, rgb(var(--tone)), transparent)" }} />
        <button onClick={onClose} className="absolute top-3 right-3 icon-btn w-8 h-8 rounded-lg" aria-label="Close">
          <X size={15} />
        </button>

        <div className="p-6">
          <div className="flex items-start gap-4 mb-5">
            <div className="tone-icon w-16 h-16 rounded-2xl shrink-0 overflow-hidden">
              {cert.sampleImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={cert.sampleImage} alt={`${cert.name} badge`} className="w-full h-full object-contain p-1.5" />
              ) : (
                <Award size={28} />
              )}
            </div>
            <div className="min-w-0 pr-8">
              <h2 className="font-display text-2xl font-bold tone-text">{cert.name}</h2>
              <p className="text-sm text-muted">{cert.fullName}</p>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <span className={`tone-badge tone-${difficultyTone[cert.level] ?? "slate"}`}>{cert.level}</span>
                <span className="text-xs text-muted flex items-center gap-1">
                  <Building2 size={11} /> {cert.issuer}
                </span>
              </div>
            </div>
          </div>

          {cert.sampleImage && (
            <div className="rounded-xl overflow-hidden border border-border mb-5 bg-surface-2 flex items-center justify-center p-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={cert.sampleImage} alt={`${cert.name} certificate`} className="max-h-64 w-full object-contain" />
            </div>
          )}

          <div className="grid grid-cols-3 gap-3 mb-5 text-center">
            {[
              { label: "Cost", value: cert.cost },
              { label: "Level", value: cert.level },
              { label: "Category", value: cert.category },
            ].map((m) => (
              <div key={m.label} className="bg-surface-2/70 rounded-xl p-3 border border-border">
                <p className="text-[11px] text-subtle mb-0.5">{m.label}</p>
                <p className="text-sm font-semibold truncate">{m.value}</p>
              </div>
            ))}
          </div>

          <div className="mb-5">
            <p className="eyebrow mb-2 text-[10px]">
              <Clock size={11} /> Duration
            </p>
            <p className="text-sm text-muted">{cert.duration}</p>
          </div>

          <div className="mb-5">
            <p className="eyebrow mb-2 text-[10px]">
              <ListChecks size={11} /> Prerequisites
            </p>
            <ul className="space-y-1">
              {cert.prerequisites.map((p) => (
                <li key={p} className="text-sm text-muted flex items-start gap-2">
                  <span className="w-1 h-1 rounded-full mt-2 shrink-0" style={{ background: "rgb(var(--tone))" }} />
                  {p}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-wrap gap-1.5 mb-6">
            {cert.topics.map((t) => (
              <span key={t} className="chip">
                {t}
              </span>
            ))}
          </div>

          <div className="flex gap-3">
            <a href={cert.url} target="_blank" rel="noopener noreferrer" className="btn btn-primary flex-1">
              Official site <ArrowUpRight size={14} />
            </a>
            <button onClick={onClose} className="btn btn-outline flex-1">
              Close
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>,
    document.body
  );
}

export default function CertificatesPage() {
  const [activeLevel, setActiveLevel] = useState("All");
  const [activeCategory, setActiveCategory] = useState("All");
  const [preview, setPreview] = useState<Certificate | null>(null);

  const filtered = useMemo(
    () => certificates.filter((c) => (activeLevel === "All" || c.level === activeLevel) && (activeCategory === "All" || c.category === activeCategory)),
    [activeLevel, activeCategory]
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <PageHeader
        badge={`${certificates.length} Certifications`}
        badgeIcon={Award}
        title="Cybersecurity"
        titleHighlight="Certifications"
        subtitle="A curated guide to the most valuable certifications — from entry-level to expert, covering every specialization."
      >
        <div className="flex flex-col items-center gap-4">
          <FilterBar scrollable options={levels} active={activeLevel} onChange={setActiveLevel} layoutId="cert-level" color="primary" />
          <FilterBar scrollable options={categories} active={activeCategory} onChange={setActiveCategory} layoutId="cert-cat" color="secondary" />
        </div>
      </PageHeader>

      <p className="text-sm text-muted mb-5">
        Showing <span className="text-foreground font-semibold tabular-nums">{filtered.length}</span> of {certificates.length} certifications
      </p>

      <AnimatePresence mode="wait">
        <motion.div key={activeLevel + activeCategory} variants={stagger(0, 0.05)} initial="hidden" animate="visible" className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((cert) => {
            const toneCls = `tone-${certColorTone[cert.color] ?? "blue"}`;
            return (
              <motion.div key={cert.id} variants={fadeUp} className={toneCls}>
                <SpotlightCard className="h-full p-5 flex flex-col group">
                  <div className="absolute inset-0 tone-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {cert.recommended && (
                    <div className="absolute top-3 right-3 z-10">
                      <span className="tone-badge tone-amber">
                        <Star size={10} className="fill-current" />
                        Recommended
                      </span>
                    </div>
                  )}

                  <div className="relative flex flex-col h-full">
                    <div className="flex items-start gap-3 mb-4">
                      <div className="tone-icon w-12 h-12 rounded-xl shrink-0 overflow-hidden group-hover:scale-105 transition-transform">
                        {cert.sampleImage ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={cert.sampleImage} alt="" loading="lazy" className="w-full h-full object-contain p-1" />
                        ) : (
                          <Award size={22} />
                        )}
                      </div>
                      <div className="min-w-0 pr-16">
                        <h3 className="font-display font-bold text-2xl leading-none tracking-tight mb-1 tone-text">{cert.name}</h3>
                        <p className="text-xs text-muted line-clamp-1">{cert.fullName}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap mb-4">
                      <span className={`tone-badge tone-${difficultyTone[cert.level] ?? "slate"}`}>{cert.level}</span>
                      <span className="badge badge-muted">{cert.category}</span>
                      <span className="ml-auto text-xs text-muted flex items-center gap-1">
                        <Building2 size={11} /> {cert.issuer}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 mb-4 text-xs">
                      <div className="p-2.5 rounded-lg bg-surface-2/60 border border-border">
                        <DollarSign size={12} className="tone-text mb-1" />
                        <p className="font-semibold truncate">{cert.cost}</p>
                      </div>
                      <div className="p-2.5 rounded-lg bg-surface-2/60 border border-border col-span-2">
                        <Clock size={12} className="tone-text mb-1" />
                        <p className="font-medium text-muted line-clamp-1">{cert.duration}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mb-4 flex-1">
                      {cert.topics.slice(0, 3).map((topic) => (
                        <span key={topic} className="chip text-[11px] py-0.5">
                          {topic}
                        </span>
                      ))}
                      {cert.topics.length > 3 && <span className="text-xs text-subtle self-center px-1">+{cert.topics.length - 3}</span>}
                    </div>

                    <div className="pt-3 border-t border-border mt-auto flex gap-2">
                      <button onClick={() => setPreview(cert)} className="btn btn-sm flex-1 tone-bg tone-border border tone-text hover:brightness-110">
                        <Eye size={13} /> Preview
                      </button>
                      <a href={cert.url} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline flex-1">
                        <ArrowUpRight size={13} /> Official
                      </a>
                    </div>
                  </div>
                </SpotlightCard>
              </motion.div>
            );
          })}
        </motion.div>
      </AnimatePresence>

      {filtered.length === 0 && (
        <EmptyState
          icon={Award}
          title="No certifications found"
          actionLabel="Reset filters"
          onAction={() => {
            setActiveLevel("All");
            setActiveCategory("All");
          }}
        />
      )}

      <AnimatePresence>{preview && <CertificatePreviewModal cert={preview} onClose={() => setPreview(null)} />}</AnimatePresence>
    </div>
  );
}
