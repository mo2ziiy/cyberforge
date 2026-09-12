import Link from "next/link";

interface BrandMarkProps {
  size?: number;
  className?: string;
  /** Animate the stroke drawing in (used by the loading screen). */
  draw?: boolean;
}

/**
 * The CyberForge mark: a bold gradient shield with a forge flame cut out of it.
 * A solid silhouette (rather than a thin outline) so it stays crisp and legible
 * at small navbar/footer sizes. Pure SVG, theme aware, self-rounded.
 */
const SHIELD = "M32 8.5 L51.5 16 L51.5 31 C51.5 43 42.8 52.8 32 56.8 C21.2 52.8 12.5 43 12.5 31 L12.5 16 Z";
const FLAME =
  "M32 22 C32 22 39.2 27.6 39.2 33.6 C39.2 37.8 35.9 41 32 41 C28.1 41 25 37.9 25 34 C25 30.4 27.4 27.9 27.4 27.9 C27.4 27.9 28 31.7 30.1 31.7 C30.1 31.7 28.2 28 32 22 Z";

export function BrandMark({ size = 36, className = "", draw = false }: BrandMarkProps) {
  const id = draw ? "cf-grad-draw" : "cf-grad";
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`block ${className}`}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={id} x1="10" y1="8" x2="54" y2="58" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="var(--primary)" />
          <stop offset="100%" stopColor="var(--secondary)" />
        </linearGradient>
      </defs>
      {/* Tile + hairline border, drawn inside the SVG so the mark is fully
          self-contained and never fights a wrapper's own rounding/clip. */}
      <rect x="0.75" y="0.75" width="62.5" height="62.5" rx="17.5" fill="var(--surface)" stroke="var(--border)" strokeWidth="1.5" />
      {/* Solid shield silhouette */}
      <path
        d={SHIELD}
        fill={`url(#${id})`}
        fillOpacity="0.9"
        style={draw ? { opacity: 0, animation: "fade-in 0.5s var(--ease-out) 0.2s forwards" } : undefined}
      />
      {/* Crisp gradient rim (also the draw-in stroke on the loading screen) */}
      <path
        d={SHIELD}
        fill="none"
        stroke={`url(#${id})`}
        strokeWidth="2"
        strokeLinejoin="round"
        style={draw ? { strokeDasharray: 172, strokeDashoffset: 172, animation: "draw 1.1s var(--ease-out) forwards" } : undefined}
      />
      {/* Forge flame, knocked out of the shield in the tile colour */}
      <path
        d={FLAME}
        fill="var(--surface)"
        style={draw ? { opacity: 0, animation: "fade-in 0.5s var(--ease-out) 0.9s forwards" } : undefined}
      />
    </svg>
  );
}

interface BrandLogoProps {
  size?: number;
  withText?: boolean;
  textClassName?: string;
  href?: string | null;
  subtitle?: string;
}

export default function BrandLogo({ size = 36, withText = true, textClassName = "text-lg", href = "/", subtitle }: BrandLogoProps) {
  const inner = (
    <>
      <span
        className="relative block shrink-0 shadow-md transition-shadow duration-300 group-hover:shadow-[0_0_28px_-6px_rgb(var(--glow)/0.6)]"
        style={{ width: size, height: size, borderRadius: size * 0.28 }}
      >
        <BrandMark size={size} />
      </span>
      {withText && (
        <span className="flex flex-col leading-none">
          <span className={`font-display font-bold tracking-tight ${textClassName}`}>
            <span className="text-primary">Cyber</span>
            <span className="text-foreground">Forge</span>
          </span>
          {subtitle && <span className="text-[10px] text-subtle tracking-[0.18em] uppercase mt-1">{subtitle}</span>}
        </span>
      )}
    </>
  );

  if (href === null) return <span className="inline-flex items-center gap-2.5 group">{inner}</span>;
  return (
    <Link href={href} className="inline-flex items-center gap-2.5 group" aria-label="CyberForge home">
      {inner}
    </Link>
  );
}
