"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertCircle, Info, X, Zap } from "lucide-react";

export interface ToastData {
  id: string;
  message: string;
  type: "success" | "error" | "info" | "points";
}

const EVENT = "cyberforge:toast";
const DURATION = 3600;

const config = {
  success: { icon: CheckCircle2, tone: "tone-green" },
  error: { icon: AlertCircle, tone: "tone-red" },
  info: { icon: Info, tone: "tone-primary" },
  points: { icon: Zap, tone: "tone-amber" },
};

function ToastItem({ toast, onClose }: { toast: ToastData; onClose: () => void }) {
  const { icon: Icon, tone } = config[toast.type];

  useEffect(() => {
    const timer = setTimeout(onClose, DURATION);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 40, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 40, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 380, damping: 30 }}
      className={`relative overflow-hidden flex items-center gap-3 pl-3.5 pr-2.5 py-3 rounded-xl glass-strong min-w-[280px] max-w-[380px] ${tone}`}
      role="status"
    >
      <span className="tone-icon w-8 h-8 rounded-lg shrink-0">
        <Icon size={16} />
      </span>
      <p className="text-sm font-medium flex-1 text-foreground leading-snug">{toast.message}</p>
      <button onClick={onClose} className="icon-btn w-7 h-7 rounded-md shrink-0" aria-label="Dismiss">
        <X size={13} />
      </button>
      <motion.span
        className="absolute left-0 bottom-0 h-[2px] tone-bg"
        style={{ background: "rgb(var(--tone))" }}
        initial={{ width: "100%" }}
        animate={{ width: 0 }}
        transition={{ duration: DURATION / 1000, ease: "linear" }}
      />
    </motion.div>
  );
}

export default function ToastContainer() {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<Omit<ToastData, "id">>).detail;
      setToasts((prev) => [...prev.slice(-4), { ...detail, id: Math.random().toString(36).slice(2) }]);
    };
    window.addEventListener(EVENT, handler);
    return () => window.removeEventListener(EVENT, handler);
  }, []);

  const remove = (id: string) => setToasts((prev) => prev.filter((t) => t.id !== id));

  return (
    <div className="fixed bottom-6 right-5 z-[9999] flex flex-col gap-2 items-end pointer-events-none [&>*]:pointer-events-auto">
      <AnimatePresence mode="popLayout">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onClose={() => remove(t.id)} />
        ))}
      </AnimatePresence>
    </div>
  );
}

export function showToast(message: string, type: ToastData["type"] = "info") {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(EVENT, { detail: { message, type } }));
  }
}
