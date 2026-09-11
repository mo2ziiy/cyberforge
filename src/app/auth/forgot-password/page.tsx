"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, ArrowLeft, CheckCircle2, AlertCircle, Send } from "lucide-react";
import AuthShell from "@/components/AuthShell";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
      if (res.ok) setSent(true);
      else {
        const data = await res.json();
        setError(data.error || "Something went wrong");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell compact heading={null} description="" title="Forgot your password?" subtitle="No worries — enter your email and we'll send you a reset link.">
      {sent ? (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-4">
          <span className="tone-icon tone-green w-16 h-16 rounded-2xl mx-auto mb-4">
            <CheckCircle2 size={30} />
          </span>
          <h2 className="font-display font-bold text-lg mb-2">Check your inbox</h2>
          <p className="text-muted text-sm mb-6 leading-relaxed">
            If <span className="text-foreground font-medium">{email}</span> is registered, you&apos;ll receive a password reset link shortly.
          </p>
          <Link href="/auth/login" className="btn btn-outline btn-sm">
            <ArrowLeft size={14} />
            Back to sign in
          </Link>
        </motion.div>
      ) : (
        <>
          {error && (
            <div className="tone-red tone-bg tone-border border rounded-xl px-4 py-3 text-sm tone-text flex items-center gap-2 mb-5">
              <AlertCircle size={16} />
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-2">Email address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-subtle" />
                <input type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input pl-10" placeholder="you@example.com" />
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn btn-primary w-full">
              {loading ? (
                <span className="w-5 h-5 border-2 border-current/30 border-t-current rounded-full animate-spin" />
              ) : (
                <>
                  <Send size={15} /> Send reset link
                </>
              )}
            </button>
          </form>
          <div className="mt-5 text-center">
            <Link href="/auth/login" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground transition-colors">
              <ArrowLeft size={14} />
              Back to sign in
            </Link>
          </div>
        </>
      )}
    </AuthShell>
  );
}
