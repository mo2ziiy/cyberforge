"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, AlertCircle, CheckCircle2, Target, BookOpen, Trophy } from "lucide-react";
import AuthShell from "@/components/AuthShell";
import { tracks } from "@/data/tracks";

function getPasswordStrength(password: string) {
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return Math.min(score, 4);
}

const strength = [
  { label: "", tone: "" },
  { label: "Weak", tone: "tone-red" },
  { label: "Fair", tone: "tone-orange" },
  { label: "Good", tone: "tone-amber" },
  { label: "Strong", tone: "tone-green" },
];

const features = [
  { icon: Target, text: `Track progress across ${tracks.length} domains` },
  { icon: Trophy, text: "Earn XP, badges & daily streaks" },
  { icon: BookOpen, text: "Bookmark tools & resources" },
];

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const score = useMemo(() => getPasswordStrength(form.password), [form.password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Registration failed");
        return;
      }
      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      heading={
        <>
          Begin your <span className="text-gradient">security career</span>
        </>
      }
      description="Join learners mastering cybersecurity through structured paths, hands-on labs, and real-world challenges."
      features={features}
      title="Create account"
      subtitle="Free forever — no credit card needed"
      footer={
        <>
          Already have an account?{" "}
          <Link href="/auth/login" className="text-primary font-semibold hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      {error && (
        <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} className="tone-red tone-bg tone-border border rounded-xl px-4 py-3 text-sm tone-text flex items-center gap-2 mb-5">
          <AlertCircle size={16} className="shrink-0" />
          {error}
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium mb-2">Full name</label>
          <div className="relative">
            <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-subtle" />
            <input type="text" required autoComplete="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input pl-10" placeholder="Your name" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Email address</label>
          <div className="relative">
            <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-subtle" />
            <input type="email" required autoComplete="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input pl-10" placeholder="you@example.com" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Password</label>
          <div className="relative">
            <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-subtle" />
            <input type={showPassword ? "text" : "password"} required minLength={6} autoComplete="new-password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="input pl-10 pr-11" placeholder="Min. 6 characters" />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 icon-btn w-8 h-8 rounded-md" aria-label="Toggle password visibility">
              {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>

          {form.password.length > 0 && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className={`mt-2.5 overflow-hidden ${strength[score].tone}`}>
              <div className="flex gap-1 mb-1.5">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-1.5 flex-1 rounded-full transition-all duration-300" style={{ background: i <= score ? "rgb(var(--tone))" : "var(--border)" }} />
                ))}
              </div>
              <p className="text-xs tone-text font-medium">{strength[score].label} password</p>
            </motion.div>
          )}
        </div>

        <button type="submit" disabled={loading} className="btn btn-primary w-full mt-1">
          {loading ? (
            <span className="w-5 h-5 border-2 border-current/30 border-t-current rounded-full animate-spin" />
          ) : (
            <>
              Create free account <ArrowRight size={17} />
            </>
          )}
        </button>

        <p className="text-[11px] text-subtle text-center flex items-center justify-center gap-1.5">
          <CheckCircle2 size={11} className="text-accent" /> No credit card. Full access from day one.
        </p>
      </form>
    </AuthShell>
  );
}
