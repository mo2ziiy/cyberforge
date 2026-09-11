"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
  Wrench,
  FileText,
  Map,
  FlaskConical,
  BookOpen,
  Search,
  ArrowRight,
  Shield,
  Zap,
  Terminal,
  ChevronRight,
  Flame,
  Award,
  BookMarked,
  Brain,
  ScrollText,
  Trophy,
  Mail,
  Github,
  Linkedin,
  MessageSquare,
  Heart,
  User,
  Send,
  CheckCircle2,
  XCircle,
  Bug,
  Lightbulb,
  Globe,
  ExternalLink,
  Sparkles,
  Compass,
  Newspaper,
  Target,
} from "lucide-react";
import { tracks } from "@/data/tracks";
import { trackIconMap, trackToneClass } from "@/lib/trackIcons";
import { SITE } from "@/lib/site";
import { COUNTS, DEFAULT_XP_PER_TOPIC, POINTS_PER_TOPIC } from "@/lib/counts";
import { fadeUp, stagger, viewportOnce, EASE } from "@/lib/motion";
import ParticleBackground from "@/components/ui/ParticleBackground";
import StatCard from "@/components/ui/StatCard";
import SpotlightCard from "@/components/ui/SpotlightCard";
import Reveal from "@/components/ui/Reveal";
import Counter from "@/components/ui/Counter";
import { XLogo } from "@/components/ui/XLogo";
import HeroTerminal from "@/components/home/HeroTerminal";
import TypeWriter from "@/components/home/TypeWriter";
import ToolMarquee from "@/components/home/ToolMarquee";

const CyberOrb = dynamic(() => import("@/components/ui/CyberOrb"), {
  ssr: false,
  loading: () => (
    <div className="w-[300px] h-[300px] flex items-center justify-center">
      <div className="relative w-[190px] h-[190px]">
        <div className="absolute inset-0 rounded-full border border-primary/20 animate-pulse" />
        <div className="absolute inset-4 rounded-full border border-secondary/15 animate-pulse" style={{ animationDelay: "0.2s" }} />
        <div className="absolute inset-8 rounded-full border border-accent/10 animate-pulse" style={{ animationDelay: "0.4s" }} />
      </div>
    </div>
  ),
});

const rotatingWords = ["Cybersecurity", "Web Security", "Pentesting", "Network Defense", "Malware Analysis", "Cloud Security"];

const stats = [
  { label: "Security Tools", value: COUNTS.tools, icon: Wrench, tone: "cyan" as const },
  { label: "Cheat Sheets", value: COUNTS.cheatsheets, icon: FileText, tone: "violet" as const },
  { label: "Practice Labs", value: COUNTS.labs, icon: FlaskConical, tone: "emerald" as const },
  { label: "Learning Tracks", value: COUNTS.tracks, icon: Map, tone: "orange" as const },
];

const features = [
  { title: "Tools Library", desc: `${COUNTS.tools} curated security tools with install guides, commands, and real-world use cases.`, href: "/tools", icon: Wrench, tone: "tone-cyan", span: "md:col-span-2", count: COUNTS.tools, countLabel: "tools" },
  { title: "Learning Roadmaps", desc: "Structured Beginner-to-Advanced paths for every domain.", href: "/roadmaps", icon: Map, tone: "tone-emerald", span: "md:row-span-2", count: COUNTS.tracks, countLabel: "paths" },
  { title: "Cheat Sheets", desc: "Linux, Nmap, Wireshark, Metasploit, SQLi and more.", href: "/cheatsheets", icon: FileText, tone: "tone-violet", count: COUNTS.cheatsheets, countLabel: "sheets" },
  { title: "Labs & CTFs", desc: "TryHackMe, HTB, PortSwigger and 16 more platforms.", href: "/labs", icon: FlaskConical, tone: "tone-orange", count: COUNTS.labs, countLabel: "platforms" },
  { title: "Quizzes", desc: "Interactive quizzes across every security domain.", href: "/quiz", icon: Brain, tone: "tone-fuchsia", count: COUNTS.quizzes, countLabel: "quizzes" },
  { title: "Writeups", desc: "Step-by-step CTF and machine walkthroughs.", href: "/writeups", icon: ScrollText, tone: "tone-lime", count: COUNTS.writeups, countLabel: "writeups" },
  { title: "Certifications", desc: "Compare OSCP, CEH, Security+ and more.", href: "/certificates", icon: Award, tone: "tone-amber", count: COUNTS.certificates, countLabel: "certs" },
  { title: "Glossary", desc: "A-Z reference of security terms and acronyms.", href: "/glossary", icon: BookMarked, tone: "tone-indigo", count: COUNTS.glossary, countLabel: "terms" },
  { title: "Resources & News", desc: "Docs, blogs, videos, books, and the latest security news.", href: "/resources", icon: Newspaper, tone: "tone-sky", span: "md:col-span-2" },
];

export default function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [contactForm, setContactForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [contactStatus, setContactStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [contactType, setContactType] = useState("General");

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => setIsLoggedIn(Boolean(data?.user)))
      .catch(() => {});
  }, []);

  return (
    <div className="overflow-x-clip">
      {/* ========= HERO ========= */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden">
        <ParticleBackground />
        <div className="absolute inset-0 bg-grid opacity-40 mask-fade-y pointer-events-none" />
        <div className="absolute top-1/4 left-[10%] w-[30rem] h-[30rem] rounded-full blur-[120px] animate-pulse-soft pointer-events-none" style={{ background: "rgb(var(--glow) / 0.12)" }} />
        <div className="absolute bottom-[10%] right-[8%] w-[26rem] h-[26rem] rounded-full blur-[120px] animate-float-slow pointer-events-none" style={{ background: "color-mix(in srgb, var(--secondary) 18%, transparent)" }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-24 w-full">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-14 lg:gap-10 items-center">
            <div className="text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: EASE }}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold text-primary bg-primary/10 border border-primary/20 backdrop-blur-sm mb-7"
              >
                <Sparkles size={13} />
                <span className="relative flex w-1.5 h-1.5">
                  <span className="absolute inset-0 rounded-full bg-primary animate-ping-ring" />
                  <span className="relative w-1.5 h-1.5 rounded-full bg-primary" />
                </span>
                Free &amp; open cybersecurity knowledge base
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.08, ease: EASE }}
                className="text-hero mb-6"
              >
                <span className="block">Master</span>
                {/* Every rotating word now fits on one line at hero size, so a
                    single line of reserved height keeps the lines tight while
                    still preventing any type-in layout shift. */}
                <span className="block text-gradient-animated min-h-[1.1em]">
                  <TypeWriter words={rotatingWords} />
                </span>
                <span className="block">from one forge.</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.18, ease: EASE }}
                className="text-lg text-muted max-w-xl mx-auto lg:mx-0 mb-9 leading-relaxed"
              >
                Tools, cheat sheets, roadmaps, labs, quizzes, and writeups for every security domain — structured, curated, and completely free.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.26, ease: EASE }}
                className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-8"
              >
                <Link href="/tracks" className="btn btn-primary btn-lg group">
                  Explore Tracks
                  <ArrowRight size={17} className="transition-transform group-hover:translate-x-0.5" />
                </Link>
                <Link href="/tools" className="btn btn-outline btn-lg">
                  <Terminal size={17} className="text-primary" />
                  Browse Tools
                </Link>
              </motion.div>

              <motion.ul
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex flex-wrap items-center justify-center lg:justify-start gap-x-5 gap-y-2 text-xs text-muted"
              >
                {["No paywalls", "No subscriptions", "Community curated"].map((t) => (
                  <li key={t} className="flex items-center gap-1.5">
                    <CheckCircle2 size={13} className="text-accent" />
                    {t}
                  </li>
                ))}
              </motion.ul>
            </div>

            <motion.div initial={{ opacity: 0, y: 30, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.7, delay: 0.25, ease: EASE }} className="relative px-4 sm:px-0">
              <HeroTerminal />
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5, ease: EASE }}
            className="stats-grid gap-3 sm:gap-4 mt-20"
          >
            {stats.map((stat, i) => (
              <StatCard key={stat.label} {...stat} delay={i * 0.08} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* ========= TOOL MARQUEE ========= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 mb-10 gpu">
        <Reveal>
          <p className="eyebrow justify-center mb-4">Tooling you will actually use</p>
          <ToolMarquee />
        </Reveal>
      </section>

      {/* ========= DOMAINS ========= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <Reveal className="text-center mb-12">
          <p className="eyebrow justify-center mb-4">{COUNTS.tracks} specialization domains</p>
          <h2 className="text-section mb-3">Pick your battlefield</h2>
          <p className="text-muted text-lg max-w-2xl mx-auto">Every domain ships with a roadmap, tools, labs and a quiz — so you always know the next step.</p>
        </Reveal>

        <motion.div variants={stagger(0, 0.06)} initial="hidden" whileInView="visible" viewport={viewportOnce} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {tracks.map((track) => {
            const Icon = trackIconMap[track.id];
            return (
              <motion.div key={track.id} variants={fadeUp}>
                <Link href={`/roadmaps/${track.id}`} className={`group block h-full ${trackToneClass(track.id)}`}>
                  <SpotlightCard className="h-full p-5 text-center">
                    <div className="absolute inset-0 tone-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative">
                      <div className="tone-icon w-12 h-12 rounded-xl mx-auto mb-3 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300">
                        {Icon && <Icon size={22} />}
                      </div>
                      <h3 className="font-display font-semibold text-sm leading-tight group-hover:text-primary transition-colors">{track.name}</h3>
                      <p className="text-[11px] text-subtle mt-1">{track.topics.length} topics</p>
                    </div>
                  </SpotlightCard>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>

        <Reveal className="text-center mt-8">
          <Link href="/tracks" className="inline-flex items-center gap-1.5 text-primary text-sm font-medium link-underline">
            View all tracks <ChevronRight size={15} />
          </Link>
        </Reveal>
      </section>

      {/* ========= FEATURES (BENTO) ========= */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-dots opacity-30 mask-fade-y pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center mb-12">
            <p className="eyebrow justify-center mb-4">Everything in one place</p>
            <h2 className="text-section mb-3">The full arsenal</h2>
            <p className="text-muted text-lg max-w-2xl mx-auto">Nine tightly connected modules. Learn a concept, grab the tool, run the lab, pass the quiz.</p>
          </Reveal>

          <motion.div variants={stagger(0, 0.05)} initial="hidden" whileInView="visible" viewport={viewportOnce} className="grid md:grid-cols-3 gap-4 md:auto-rows-[200px]">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <motion.div key={f.title} variants={fadeUp} className={`${f.span ?? ""} ${f.tone}`}>
                  <Link href={f.href} className="group block h-full">
                    <SpotlightCard gradientBorder className="h-full p-6 flex flex-col">
                      <div className="absolute inset-0 tone-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="relative flex items-start justify-between mb-auto">
                        <div className="tone-icon w-12 h-12 rounded-xl group-hover:scale-110 transition-transform duration-300">
                          <Icon size={22} />
                        </div>
                        {f.count !== undefined && (
                          <div className="text-right">
                            <div className="font-display text-2xl font-bold tone-text tabular-nums">
                              <Counter value={f.count} />
                            </div>
                            <div className="text-[10px] uppercase tracking-wider text-subtle">{f.countLabel}</div>
                          </div>
                        )}
                      </div>
                      <div className="relative mt-4">
                        <h3 className="font-display text-lg font-bold mb-1 flex items-center gap-2 group-hover:text-primary transition-colors">
                          {f.title}
                          <ArrowRight size={15} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                        </h3>
                        <p className="text-sm text-muted leading-relaxed">{f.desc}</p>
                      </div>
                    </SpotlightCard>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ========= GAMIFICATION ========= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-12 items-center">
          <Reveal>
            <p className="eyebrow mb-4">Gamified learning</p>
            <h2 className="text-section mb-4">
              Build the habit.
              <br />
              <span className="text-gradient">Level up daily.</span>
            </h2>
            <p className="text-muted text-lg leading-relaxed mb-8">
              Every completed topic earns XP. Daily streaks unlock milestones. Your dashboard shows exactly where you stand across all {COUNTS.tracks} domains.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href={isLoggedIn ? "/dashboard" : "/sign-up"} className="btn btn-primary">
                {isLoggedIn ? "Open dashboard" : "Start earning XP"}
                <ArrowRight size={16} />
              </Link>
              <Link href="/quiz" className="btn btn-outline">
                <Brain size={16} className="text-secondary" />
                Take a quiz
              </Link>
            </div>
          </Reveal>

          <motion.div variants={stagger(0.1, 0.1)} initial="hidden" whileInView="visible" viewport={viewportOnce} className="grid sm:grid-cols-3 gap-4">
            <motion.div variants={fadeUp} className="tone-primary">
              <SpotlightCard className="p-6 h-full">
                <div className="tone-icon w-11 h-11 rounded-xl mb-5">
                  <Zap size={20} />
                </div>
                <div className="font-display text-3xl font-bold tone-text tabular-nums mb-1">
                  {/* Signed-out visitors get a stable headline number rather than a counter that reads 0. */}
                  {isLoggedIn ? <>+<Counter value={POINTS_PER_TOPIC} /></> : <>+{DEFAULT_XP_PER_TOPIC}</>}
                  <span className="text-base text-muted font-medium ml-1">XP</span>
                </div>
                <h3 className="font-semibold mb-1">Per topic</h3>
                <p className="text-xs text-muted leading-relaxed">Complete topics, favorite tools, and log in daily to grow your score.</p>
              </SpotlightCard>
            </motion.div>

            <motion.div variants={fadeUp} className="tone-orange">
              <SpotlightCard className="p-6 h-full">
                <div className="tone-icon w-11 h-11 rounded-xl mb-5">
                  <Flame size={20} className="animate-flame" />
                </div>
                <div className="flex items-end gap-1 mb-3 h-9">
                  {[40, 60, 45, 80, 65, 90, 100].map((h, i) => (
                    <motion.span
                      key={i}
                      initial={{ height: 0 }}
                      whileInView={{ height: `${h}%` }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + i * 0.06, duration: 0.5, ease: EASE }}
                      className="flex-1 rounded-sm"
                      style={{ background: `rgb(var(--tone) / ${0.35 + i * 0.09})` }}
                    />
                  ))}
                </div>
                <h3 className="font-semibold mb-1">Daily streaks</h3>
                <p className="text-xs text-muted leading-relaxed">Milestones at 3, 7, 14, 30 and 100 days keep you coming back.</p>
              </SpotlightCard>
            </motion.div>

            <motion.div variants={fadeUp} className="tone-emerald">
              <SpotlightCard className="p-6 h-full">
                <div className="relative w-16 h-16 mb-4">
                  <svg viewBox="0 0 64 64" className="w-16 h-16 -rotate-90">
                    <circle cx="32" cy="32" r="26" fill="none" stroke="rgb(var(--tone) / 0.15)" strokeWidth="6" />
                    <motion.circle
                      cx="32"
                      cy="32"
                      r="26"
                      fill="none"
                      stroke="rgb(var(--tone))"
                      strokeWidth="6"
                      strokeLinecap="round"
                      strokeDasharray={2 * Math.PI * 26}
                      initial={{ strokeDashoffset: 2 * Math.PI * 26 }}
                      whileInView={{ strokeDashoffset: 2 * Math.PI * 26 * 0.32 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.4, delay: 0.3, ease: EASE }}
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center font-display font-bold text-sm tone-text">68%</span>
                </div>
                <h3 className="font-semibold mb-1">Track progress</h3>
                <p className="text-xs text-muted leading-relaxed">Per-domain progress rings and achievements on your profile.</p>
              </SpotlightCard>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ========= ABOUT + ORB ========= */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-surface/40" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <Reveal className="flex items-center justify-center order-2 lg:order-1">
              <CyberOrb />
            </Reveal>
            <Reveal className="order-1 lg:order-2">
              <p className="eyebrow mb-4">
                <Heart size={12} className="text-secondary" /> About
              </p>
              <h2 className="text-section mb-5">
                Built for the <span className="text-gradient">community</span>
              </h2>
              <p className="text-muted text-lg leading-relaxed mb-4">
                CyberForge is a free, open platform built by security enthusiasts for security enthusiasts. Our mission is to make cybersecurity education accessible, structured, and genuinely enjoyable.
              </p>
              <p className="text-muted leading-relaxed mb-6">
                Every tool, roadmap, and resource here is free to access. Content is curated by real practitioners, so you get real writeups, real labs, and real-world relevance.
              </p>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: Compass, label: "Structured", tone: "tone-cyan" },
                  { icon: Target, label: "Practical", tone: "tone-violet" },
                  { icon: Globe, label: "Open", tone: "tone-emerald" },
                ].map(({ icon: Icon, label, tone }) => (
                  <div key={label} className={`card p-3 flex items-center gap-2.5 ${tone}`}>
                    <span className="tone-icon w-8 h-8 rounded-lg shrink-0">
                      <Icon size={14} />
                    </span>
                    <span className="text-sm font-medium">{label}</span>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ========= CONTACT ========= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <Reveal className="text-center mb-10">
          <p className="eyebrow justify-center mb-4">
            <MessageSquare size={12} className="text-accent" /> Contact
          </p>
          <h2 className="text-section mb-3">
            Get in <span className="text-gradient">touch</span>
          </h2>
          <p className="text-muted text-lg max-w-xl mx-auto">Have a question, suggestion, or want to contribute? We&apos;d love to hear from you.</p>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="card hairline-top overflow-hidden">
            <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />
            <div className="relative grid lg:grid-cols-2">
              <div className="p-8 sm:p-10 lg:border-r border-border flex flex-col">
                <h3 className="font-display text-2xl sm:text-3xl font-bold mb-3">
                  Have a question or <span className="text-gradient">suggestion?</span>
                </h3>
                <p className="text-muted leading-relaxed mb-8 text-sm">Whether you&apos;re reporting a bug, suggesting content, or just saying hi — every message is read.</p>

                <div className="space-y-3 mb-8">
                  {[
                    { icon: Mail, label: "Email", value: SITE.email, href: `mailto:${SITE.email}`, tone: "tone-primary" },
                    { icon: Github, label: "GitHub", value: SITE.githubHandle, href: SITE.github, tone: "tone-slate" },
                    { icon: XLogo, label: "X (Twitter)", value: SITE.xHandle, href: SITE.x, tone: "tone-slate" },
                    { icon: Linkedin, label: "LinkedIn", value: SITE.linkedinHandle, href: SITE.linkedin, tone: "tone-sky" },
                  ].map(({ icon: Icon, label, value, href, tone }) => (
                    <a
                      key={label}
                      href={href}
                      onClick={href === "#" ? (e) => e.preventDefault() : undefined}
                      target={href.startsWith("http") ? "_blank" : undefined}
                      rel="noopener noreferrer"
                      className={`flex items-center gap-3 group ${tone}`}
                    >
                      <span className="tone-icon w-10 h-10 rounded-xl shrink-0 transition-transform group-hover:scale-105">
                        <Icon size={16} />
                      </span>
                      <span className="flex-1 min-w-0">
                        <span className="block text-xs text-subtle">{label}</span>
                        <span className="block text-sm font-medium group-hover:text-primary transition-colors truncate">{value}</span>
                      </span>
                      <ExternalLink size={13} className="text-subtle opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                    </a>
                  ))}
                </div>

                <div className="mt-auto pt-6 border-t border-border">
                  <p className="eyebrow mb-3 text-[10px]">What can you reach out for?</p>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { icon: Bug, label: "Bug reports", tone: "tone-red" },
                      { icon: Lightbulb, label: "Suggestions", tone: "tone-amber" },
                      { icon: Globe, label: "Contribute", tone: "tone-green" },
                      { icon: MessageSquare, label: "General", tone: "tone-primary" },
                    ].map(({ icon: Icon, label, tone }) => (
                      <div key={label} className={`flex items-center gap-2 text-xs text-muted ${tone}`}>
                        <Icon size={13} className="tone-text" />
                        {label}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-8 sm:p-10">
                {contactStatus === "success" ? (
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="h-full flex flex-col items-center justify-center text-center py-8">
                    <div className="tone-icon tone-green w-16 h-16 rounded-full mb-5">
                      <CheckCircle2 size={30} />
                    </div>
                    <h3 className="font-display text-xl font-bold mb-2">Message sent</h3>
                    <p className="text-muted text-sm leading-relaxed mb-6 max-w-xs">Thanks for reaching out. We&apos;ll get back to you as soon as possible.</p>
                    <button
                      onClick={() => {
                        setContactStatus("idle");
                        setContactType("General");
                      }}
                      className="btn btn-outline btn-sm"
                    >
                      Send another message
                    </button>
                  </motion.div>
                ) : (
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      setContactStatus("sending");
                      try {
                        const res = await fetch("/api/contact", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ ...contactForm, type: contactType }),
                        });
                        if (res.ok) {
                          setContactStatus("success");
                          setContactForm({ name: "", email: "", subject: "", message: "" });
                        } else setContactStatus("error");
                      } catch {
                        setContactStatus("error");
                      }
                    }}
                    className="space-y-4"
                  >
                    <div>
                      <label className="eyebrow mb-2 text-[10px]">Type</label>
                      <div className="flex flex-wrap gap-2">
                        {[
                          { label: "General", icon: MessageSquare },
                          { label: "Bug Report", icon: Bug },
                          { label: "Suggestion", icon: Lightbulb },
                          { label: "Contribute", icon: Globe },
                        ].map(({ label, icon: Icon }) => (
                          <button key={label} type="button" onClick={() => setContactType(label)} className={`chip ${contactType === label ? "chip-active" : ""}`}>
                            <Icon size={12} />
                            {label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-muted mb-2">Name</label>
                        <div className="relative">
                          <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-subtle pointer-events-none" />
                          <input type="text" placeholder="Your name" className="input pl-10" value={contactForm.name} onChange={(e) => setContactForm((f) => ({ ...f, name: e.target.value }))} required />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-muted mb-2">Email</label>
                        <div className="relative">
                          <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-subtle pointer-events-none" />
                          <input type="email" placeholder="you@example.com" className="input pl-10" value={contactForm.email} onChange={(e) => setContactForm((f) => ({ ...f, email: e.target.value }))} required />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-muted mb-2">Subject</label>
                      <input type="text" placeholder="What's this about?" className="input" value={contactForm.subject} onChange={(e) => setContactForm((f) => ({ ...f, subject: e.target.value }))} required />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-xs font-semibold text-muted">Message</label>
                        <span className="text-xs text-subtle tabular-nums">{contactForm.message.length}/1000</span>
                      </div>
                      <textarea rows={4} placeholder="Tell us more…" className="input resize-none" maxLength={1000} value={contactForm.message} onChange={(e) => setContactForm((f) => ({ ...f, message: e.target.value }))} required />
                    </div>

                    {contactStatus === "error" && (
                      <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium tone-badge tone-red w-full justify-start">
                        <XCircle size={16} />
                        Failed to send. Please try again.
                      </motion.div>
                    )}

                    <button type="submit" disabled={contactStatus === "sending"} className="btn btn-primary w-full">
                      {contactStatus === "sending" ? (
                        <>
                          <span className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" />
                          Sending…
                        </>
                      ) : (
                        <>
                          <Send size={15} />
                          Send message
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ========= CTA ========= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
        <Reveal>
          <div className="relative card hairline-top overflow-hidden">
            <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgb(var(--glow) / 0.12), color-mix(in srgb, var(--secondary) 10%, transparent) 50%, color-mix(in srgb, var(--accent) 10%, transparent))" }} />
            <div className="absolute inset-0 bg-grid opacity-30 mask-fade-y" />
            <div className="absolute top-6 right-10 opacity-[0.08] animate-float text-primary">
              <Shield size={110} />
            </div>
            <div className="absolute bottom-6 left-10 opacity-[0.06] animate-float-slow text-secondary">
              <Terminal size={80} />
            </div>

            <div className="relative px-8 md:px-16 py-16 text-center">
              <p className="eyebrow justify-center mb-5">
                <Trophy size={12} className="text-warning" /> Free to get started
              </p>
              <h2 className="text-section mb-4">
                Start your <span className="text-gradient">security journey</span>
              </h2>
              <p className="text-muted text-lg max-w-xl mx-auto mb-9 leading-relaxed">
                Create a free account to track progress, bookmark resources, earn XP, and keep your favorite tools one click away.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href={isLoggedIn ? "/dashboard" : "/sign-up"} className="btn btn-primary btn-lg group">
                  {isLoggedIn ? "Go to dashboard" : "Create free account"}
                  <ArrowRight size={17} className="transition-transform group-hover:translate-x-0.5" />
                </Link>
                <Link href="/roadmaps" className="btn btn-outline btn-lg">
                  <Map size={17} className="text-secondary" />
                  View roadmaps
                </Link>
              </div>
              <div className="flex items-center justify-center gap-6 mt-8 text-xs text-subtle">
                <span className="flex items-center gap-1.5">
                  <Search size={12} /> Global search
                </span>
                <span className="flex items-center gap-1.5">
                  <BookOpen size={12} /> {COUNTS.glossary}+ glossary terms
                </span>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
