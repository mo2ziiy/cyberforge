import Link from "next/link";
import Image from "next/image";
import logo from "@/assets/cyberforge-logo.png";

interface BrandMarkProps {
  size?: number;
  className?: string;
  /** Fade the mark in (used by the loading screen boot animation). */
  draw?: boolean;
}

/**
 * The CyberForge mark: the gradient shield-and-forge-flame logo.
 * A transparent PNG with its own glow, so it needs no wrapper tile — render it
 * directly at any size. `next/image` handles the GitHub Pages base path.
 */
export function BrandMark({ size = 36, className = "", draw = false }: BrandMarkProps) {
  return (
    <Image
      src={logo}
      alt=""
      width={size}
      height={size}
      priority
      aria-hidden="true"
      className={`block object-contain ${className}`}
      style={{
        width: size,
        height: size,
        ...(draw ? { opacity: 0, animation: "fade-in 0.6s var(--ease-out) 0.15s forwards" } : {}),
      }}
    />
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
        className="relative block shrink-0 transition-[filter] duration-300 group-hover:[filter:drop-shadow(0_0_14px_rgb(var(--glow)/0.55))]"
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
