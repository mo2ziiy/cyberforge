"use client";

import Link from "next/link";
import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Lock, Eye, EyeOff, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";
import AuthShell from "@/components/AuthShell";

function ResetForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const [form, setForm] = useState({ password: "", confirm: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      setError("Passwords do not match");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ token, password: form.password }) });
      if (res.ok) {
        setSuccess(true);
        setTimeout(() => router.push("/auth/login"), 2500);
      } else {
        const data = await res.json();
        setError(data.error || "Reset failed. The link may have expired.");
      }
    } catch {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="text-center py-6">
        <span className="tone-icon tone-red w-16 h-16 rounded-2xl mx-auto mb-4">
          <AlertCircle size={30} />
        </span>
        <p className="text-muted mb-4">Invalid or missing reset token.</p>
        <Link href="/auth/forgot-password" className="btn btn-outline btn-sm">
          Request a new link
        </Link>
      </div>
    );
  }

  if (success) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-6">
        <span className="tone-icon tone-green w-16 h-16 rounded-2xl mx-auto mb-4">
          <CheckCircle2 size={30} />
        </span>
        <h2 className="font-display font-bold text-lg mb-2">Password reset</h2>
        <p className="text-muted text-sm">Redirecting you to sign in…</p>
      </motion.div>
    );
  }

  return (
    <>
      {error && (
        <div className="tone-red tone-bg tone-border border rounded-xl px-4 py-3 text-sm tone-text flex items-center gap-2 mb-5">
          <AlertCircle size={16} />
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">New password</label>
          <div className="relative">
            <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-subtle" />
            <input type={showPw ? "text" : "password"} required minLength={6} autoComplete="new-password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="input pl-10 pr-11" placeholder="Min. 6 characters" />
            <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 icon-btn w-8 h-8 rounded-md" aria-label="Toggle password visibility">
              {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Confirm password</label>
          <div className="relative">
            <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-subtle" />
            <input type={showPw ? "text" : "password"} required autoComplete="new-password" value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })} className="input pl-10" placeholder="Repeat password" />
          </div>
        </div>
        <button type="submit" disabled={loading} className="btn btn-primary w-full">
          {loading ? (
            <span className="w-5 h-5 border-2 border-current/30 border-t-current rounded-full animate-spin" />
          ) : (
            <>
              Reset password <ArrowRight size={17} />
            </>
          )}
        </button>
      </form>
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <AuthShell compact heading={null} description="" title="Reset password" subtitle="Choose a strong new password">
      <Suspense fallback={<div className="text-muted text-center py-8 text-sm">Loading…</div>}>
        <ResetForm />
      </Suspense>
    </AuthShell>
  );
}
