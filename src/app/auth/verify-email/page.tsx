"use client";

import Link from "next/link";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import AuthShell from "@/components/AuthShell";

type Status = "loading" | "success" | "error";

function VerifyContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const [status, setStatus] = useState<Status>(token ? "loading" : "error");

  useEffect(() => {
    if (!token) return;
    const controller = new AbortController();
    fetch(`/api/auth/verify-email?token=${encodeURIComponent(token)}`, { signal: controller.signal })
      .then((r) => setStatus(r.ok ? "success" : "error"))
      .catch(() => {
        if (!controller.signal.aborted) setStatus("error");
      });
    return () => controller.abort();
  }, [token]);

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-4">
      {status === "loading" && (
        <>
          <span className="tone-icon tone-primary w-16 h-16 rounded-2xl mx-auto mb-4">
            <Loader2 size={30} className="animate-spin" />
          </span>
          <p className="text-muted">Verifying your email…</p>
        </>
      )}
      {status === "success" && (
        <>
          <span className="tone-icon tone-green w-16 h-16 rounded-2xl mx-auto mb-4">
            <CheckCircle2 size={30} />
          </span>
          <h2 className="font-display font-bold text-xl mb-2">Email verified</h2>
          <p className="text-muted text-sm mb-6">Your email has been successfully verified.</p>
          <Link href="/auth/login" className="btn btn-primary">
            Sign in now
          </Link>
        </>
      )}
      {status === "error" && (
        <>
          <span className="tone-icon tone-red w-16 h-16 rounded-2xl mx-auto mb-4">
            <XCircle size={30} />
          </span>
          <h2 className="font-display font-bold text-xl mb-2">Verification failed</h2>
          <p className="text-muted text-sm mb-6">The link is invalid or has expired.</p>
          <Link href="/auth/register" className="btn btn-outline btn-sm">
            Back to register
          </Link>
        </>
      )}
    </motion.div>
  );
}

export default function VerifyEmailPage() {
  return (
    <AuthShell compact heading={null} description="" title="Email verification">
      <Suspense fallback={<div className="text-center py-8 text-muted text-sm">Loading…</div>}>
        <VerifyContent />
      </Suspense>
    </AuthShell>
  );
}
