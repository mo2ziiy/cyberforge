/** Global ambient background: aurora blobs + fine grid + noise, all token driven. */
export default function PageBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden>
      <div className="absolute inset-0 bg-grid opacity-40 mask-fade-y" />

      <div
        className="absolute -top-48 -right-40 w-[46rem] h-[46rem] rounded-full blur-[140px] animate-float-slow"
        style={{ background: "radial-gradient(closest-side, rgb(var(--glow) / 0.16), transparent)" }}
      />
      <div
        className="absolute -bottom-56 -left-40 w-[40rem] h-[40rem] rounded-full blur-[130px] animate-float"
        style={{ background: "radial-gradient(closest-side, color-mix(in srgb, var(--secondary) 22%, transparent), transparent)", animationDelay: "-3s" }}
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30rem] h-[30rem] rounded-full blur-[110px]"
        style={{ background: "radial-gradient(closest-side, color-mix(in srgb, var(--accent) 12%, transparent), transparent)" }}
      />

      <div className="absolute inset-0 bg-noise opacity-[0.35] mix-blend-overlay" />
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at center, transparent 55%, var(--bg) 100%)" }} />
    </div>
  );
}
