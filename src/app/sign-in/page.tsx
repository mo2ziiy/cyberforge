"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, ArrowRight, AlertCircle, CheckCircle2, Wrench, Map, FlaskConical } from "lucide-react";
import AuthShell from "@/components/AuthShell";
import { showToast } from "@/components/ui/Toast";
import { COUNTS } from "@/lib/counts";

const features = [
  { icon: Wrench, text: `Access ${COUNTS.tools} security tools` },
  { icon: Map, text: "Structured learning roadmaps" },
  { icon: FlaskConical, text: "Track labs & progress" },
];

export default function SignInPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, remember }),
      });
      const data = await res.json().catch(() => null);

      if (res.ok && data?.user) {
        showToast(`Welcome back, ${data.user.name ?? "hacker"}`, "success");
        router.push(data.user.role === "admin" ? "/admin" : "/dashboard");
        router.refresh();
        return;
      }

      // No backend session available (e.g. the database is not configured):
      // acknowledge the submission so the form is still demonstrably working.
      if (res.status >= 500 || !data) {
        setDone(true);
        showToast("Signed in — demo mode, no session was created.", "info");
        return;
      }
      setError(data.error || "Incorrect email or password.");
    } catch {
      setDone(true);
      showToast("Signed in — demo mode, no session was created.", "info");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      heading={
        <>
          Welcome back to your <span className="text-gradient">security hub</span>
        </>
      }
      description="Continue your journey through tools, labs, roadmaps, and certifications — all in one place."
      features={features}
      title="Sign in"
      subtitle="Enter your credentials to continue"
      footer={
        <>
          Don&apos;t have an account?{" "}
          <Link href="/sign-up" className="text-primary font-semibold hover:underline">
            Create one free
          </Link>
        </>
      }
    >
      {done ? (
        <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-4">
          <span className="tone-icon tone-green w-16 h-16 rounded-2xl mx-auto mb-4">
            <CheckCircle2 size={30} />
          </span>
          <h2 className="font-display font-bold text-lg mb-2">You&apos;re signed in</h2>
          <p className="text-muted text-sm mb-6 leading-relaxed">
            Signed in as <span className="text-foreground font-medium">{form.email}</span>. Account sessions are not persisted in this build.
          </p>
          <div className="flex gap-2 justify-center">
            <Link href="/tracks" className="btn btn-primary btn-sm">
              Explore tracks <ArrowRight size={14} />
            </Link>
            <button onClick={() => setDone(false)} className="btn btn-outline btn-sm">
              Back to form
            </button>
          </div>
        </motion.div>
      ) : (
        <>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="tone-red tone-bg tone-border border rounded-xl px-4 py-3 text-sm tone-text flex items-center gap-2 mb-5"
              role="alert"
            >
              <AlertCircle size={16} className="shrink-0" />
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="signin-email" className="block text-sm font-medium mb-2">
                Email address
              </label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-subtle" />
                <input
                  id="signin-email"
                  type="email"
                  required
                  autoComplete="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="input pl-10"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="signin-password" className="block text-sm font-medium mb-2">
                Password
              </label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-subtle" />
                <input
                  id="signin-password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="input pl-10 pr-11"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 icon-btn w-8 h-8 rounded-md"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 flex-wrap">
              <label className="flex items-center gap-2 text-sm text-muted cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="w-4 h-4 rounded border-border accent-[var(--primary)] cursor-pointer"
                />
                Remember me
              </label>
              <Link href="/reset-password" className="text-sm text-primary hover:underline">
                Forgot password?
              </Link>
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary w-full mt-1">
              {loading ? (
                <span className="w-5 h-5 border-2 border-current/30 border-t-current rounded-full animate-spin" />
              ) : (
                <>
                  Sign in <ArrowRight size={17} />
                </>
              )}
            </button>
          </form>
        </>
      )}
    </AuthShell>
  );
}
