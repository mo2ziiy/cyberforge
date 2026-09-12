/**
 * Global ambient background: aurora blobs + fine grid + noise, all token driven.
 *
 * Deliberately static and lightly blurred. This layer is `fixed` and painted on
 * every page, so animating huge (40rem+) blurred blobs here forced the GPU to
 * re-composite a full-screen layer every frame — the main source of scroll lag.
 * The blobs now hold still and use smaller blur radii, which keeps the look but
 * removes the continuous cost.
 */
export default function PageBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden>
      <div className="absolute inset-0 bg-grid opacity-40 mask-fade-y" />

      <div
        className="absolute -top-48 -right-40 w-[42rem] h-[42rem] rounded-full blur-[90px]"
        style={{ background: "radial-gradient(closest-side, rgb(var(--glow) / 0.14), transparent)" }}
      />
      <div
        className="absolute -bottom-56 -left-40 w-[38rem] h-[38rem] rounded-full blur-[90px]"
        style={{ background: "radial-gradient(closest-side, color-mix(in srgb, var(--secondary) 20%, transparent), transparent)" }}
      />

      <div className="absolute inset-0 bg-noise opacity-[0.35] mix-blend-overlay" />
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at center, transparent 55%, var(--bg) 100%)" }} />
    </div>
  );
}
