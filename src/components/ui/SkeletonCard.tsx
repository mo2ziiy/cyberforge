"use client";

const WIDTHS = ["92%", "78%", "86%", "70%", "95%", "82%"];

export function SkeletonCard({ lines = 3 }: { lines?: number }) {
  return (
    <div className="card p-5">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-12 h-12 shimmer rounded-xl shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 shimmer rounded w-3/4" />
          <div className="h-3 shimmer rounded w-1/3" />
        </div>
      </div>
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <div key={i} className="h-3 shimmer rounded" style={{ width: WIDTHS[i % WIDTHS.length] }} />
        ))}
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 6, cols = 3 }: { count?: number; cols?: number }) {
  const colClass =
    cols === 2 ? "grid sm:grid-cols-2 gap-5" : cols === 4 ? "grid sm:grid-cols-2 lg:grid-cols-4 gap-5" : "grid md:grid-cols-2 lg:grid-cols-3 gap-5";

  return (
    <div className={colClass}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export function SkeletonRow() {
  return (
    <div className="card p-4 flex items-center gap-4">
      <div className="w-10 h-10 shimmer rounded-lg shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-4 shimmer rounded w-1/3" />
        <div className="h-3 shimmer rounded w-1/2" />
      </div>
      <div className="w-16 h-6 shimmer rounded-full" />
    </div>
  );
}

export function PageSpinner({ label }: { label?: string }) {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-2 border-primary/20" />
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary animate-spin" />
          <div className="absolute inset-2 rounded-full border-2 border-transparent border-b-secondary animate-spin" style={{ animationDirection: "reverse", animationDuration: "1.4s" }} />
        </div>
        {label && <p className="text-sm text-muted">{label}</p>}
      </div>
    </div>
  );
}
