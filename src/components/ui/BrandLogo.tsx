import Link from "next/link";

interface BrandMarkProps {
  size?: number;
  className?: string;
  /** Animate the stroke drawing in (used by the loading screen). */
  draw?: boolean;
}

/** The CyberForge mark: a shield forged around a flame. Pure SVG, theme aware. */
export function BrandMark({ size = 36, className = "", draw = false }: BrandMarkProps) {
  const id = draw ? "cf-grad-draw" : "cf-grad";
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={id} x1="12" y1="8" x2="52" y2="58" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="var(--primary)" />
          <stop offset="100%" stopColor="var(--secondary)" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="16" fill="var(--bg)" />
      <path
        d="M32 8 L52 16 L52 32 C52 44 42 54 32 58 C22 54 12 44 12 32 L12 16 Z"
        fill={`url(#${id})`}
        opacity="0.14"
      />
      <path
        d="M32 10 L50 17.5 L50 32 C50 43 41 52 32 56 C23 52 14 43 14 32 L14 17.5 Z"
        stroke={`url(#${id})`}
        strokeWidth="1.8"
        fill="none"
        strokeLinejoin="round"
        style={
          draw
            ? { strokeDasharray: 160, strokeDashoffset: 160, animation: "draw 1.2s var(--ease-out) forwards" }
            : undefined
        }
      />
      <path
        d="M32 22 C32 22 38 27 38 33 C38 36.3 35.3 39 32 39 C28.7 39 26 36.3 26 33 C26 30 28 27.5 28 27.5 C28 27.5 28.5 31 30.5 31 C30.5 31 29 28 32 22Z"
        fill={`url(#${id})`}
        style={draw ? { opacity: 0, animation: "fade-in 0.5s var(--ease-out) 0.8s forwards" } : undefined}
      />
      <path
        d="M32 26 C32 26 35 29.5 35 32.5 C35 34.4 33.7 36 32 36 C30.3 36 29 34.4 29 32.5 C29 31 30 29.5 30 29.5 C30 29.5 30.3 31.5 31.5 31.5 C31.5 31.5 30.5 29 32 26Z"
        fill="var(--bg)"
        opacity="0.6"
        style={draw ? { opacity: 0, animation: "fade-in 0.5s var(--ease-out) 1s forwards" } : undefined}
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
        className="relative rounded-2xl overflow-hidden shrink-0 border border-border shadow-md transition-shadow duration-300 group-hover:shadow-[0_0_28px_-6px_rgb(var(--glow)/0.6)]"
        style={{ width: size, height: size }}
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
