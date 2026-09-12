"use client";

import Link from "next/link";
import { useState, useEffect, useRef, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Menu, X, ChevronRight } from "lucide-react";
import BrandLogo, { BrandMark } from "@/components/ui/BrandLogo";
import ThemeToggle from "@/components/ui/ThemeToggle";
import CommandPalette from "@/components/CommandPalette";
import { NAV_LINKS } from "@/lib/site";

const noop = () => () => {};

const getIsMac = () => (typeof navigator !== "undefined" ? /mac|iphone|ipad/i.test(navigator.platform || navigator.userAgent) : false);

const isActivePath = (pathname: string, href: string) => pathname === href || pathname.startsWith(href + "/");

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const linksRef = useRef<HTMLDivElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const isMac = useSyncExternalStore(noop, getIsMac, () => false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((o) => !o);
      }
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  /* Close the drawer on route change and lock body scroll while it is open. */
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  return (
    <>
      <motion.nav
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="sticky top-0 z-50 px-2 sm:px-4 pt-3 pb-2"
      >
        <div
          className={`max-w-[1440px] mx-auto rounded-2xl border transition-all duration-300 ${
            scrolled
              ? "border-border bg-background/90 backdrop-blur-md shadow-[var(--shadow-md)]"
              : "border-border/60 bg-background/70 backdrop-blur-sm"
          }`}
        >
          <div className="flex items-center justify-between gap-2 h-14 px-3 sm:px-5">
            <BrandLogo size={34} textClassName="text-[15px] sm:text-[17px]" />

            {/* Desktop nav */}
            <div ref={linksRef} className="desktop-nav-links hidden xl:flex items-center gap-0.5 relative flex-nowrap min-w-0">
              {NAV_LINKS.map((link) => {
                const on = isActivePath(pathname, link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    data-active={on ? "true" : "false"}
                    aria-current={on ? "page" : undefined}
                    className={`nav-link group relative px-2 2xl:px-2.5 py-2 rounded-lg text-[12px] 2xl:text-[13px] font-medium whitespace-nowrap transition-colors ${
                      on ? "text-primary" : "text-muted hover:text-foreground"
                    }`}
                  >
                    {/* Per-link highlight, animated by CSS only — never a shared layout animation, so it cannot flicker between routes. */}
                    <span aria-hidden className={`nav-active-indicator ${on ? "is-active" : ""}`} />
                    <span className="relative z-10">{link.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* Right */}
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={() => setPaletteOpen(true)}
                className="hidden md:flex items-center gap-2 h-9 pl-3 pr-2 rounded-lg border border-border bg-surface/60 text-muted hover:text-foreground hover:border-border-strong transition-all text-sm w-40 xl:w-32 2xl:w-52"
                aria-label="Open search"
              >
                <Search size={14} className="shrink-0" />
                <span className="flex-1 text-left text-[13px] truncate">Search…</span>
                <kbd className="text-[10px] hidden 2xl:inline-flex">{isMac ? "⌘K" : "Ctrl K"}</kbd>
              </button>
              <button onClick={() => setPaletteOpen(true)} className="icon-btn md:hidden" aria-label="Open search">
                <Search size={18} />
              </button>

              <ThemeToggle />

              {/* Mobile menu toggle */}
              <button onClick={() => setIsOpen(!isOpen)} className="mobile-hamburger xl:hidden icon-btn" aria-label="Menu" aria-expanded={isOpen} aria-controls="mobile-drawer">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={isOpen ? "close" : "open"}
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="inline-flex"
                  >
                    {isOpen ? <X size={20} /> : <Menu size={20} />}
                  </motion.span>
                </AnimatePresence>
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile drawer (slide-in from the right) */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="mobile-drawer-overlay xl:hidden"
              onClick={() => setIsOpen(false)}
              aria-hidden
            />
            <motion.aside
              key="drawer"
              id="mobile-drawer"
              ref={drawerRef}
              role="dialog"
              aria-modal="true"
              aria-label="Navigation menu"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 380, damping: 36 }}
              className="mobile-drawer xl:hidden"
            >
              <div className="flex items-center justify-between px-4 h-16 border-b border-border shrink-0">
                <div className="flex items-center gap-2.5">
                  <BrandMark size={30} />
                  <span className="font-display font-bold text-base">
                    <span className="text-primary">Cyber</span>Forge
                  </span>
                </div>
                <button onClick={() => setIsOpen(false)} className="icon-btn" aria-label="Close menu">
                  <X size={20} />
                </button>
              </div>

              <nav className="flex-1 px-3 py-3 overflow-y-auto">
                <ul className="flex flex-col gap-0.5">
                  {NAV_LINKS.map((link, i) => {
                    const on = isActivePath(pathname, link.href);
                    return (
                      <motion.li key={link.href} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.04 + i * 0.03, duration: 0.25 }}>
                        <Link
                          href={link.href}
                          onClick={() => setIsOpen(false)}
                          aria-current={on ? "page" : undefined}
                          className={`flex items-center justify-between px-3.5 py-3 rounded-xl text-[15px] font-medium transition-colors ${
                            on ? "bg-primary/10 text-primary" : "text-muted hover:text-foreground hover:bg-surface-2"
                          }`}
                        >
                          {link.label}
                          <ChevronRight size={15} className={on ? "text-primary" : "text-subtle"} />
                        </Link>
                      </motion.li>
                    );
                  })}
                </ul>
              </nav>

              <div className="px-4 py-4 border-t border-border shrink-0">
                <button onClick={() => { setIsOpen(false); setPaletteOpen(true); }} className="btn btn-outline w-full">
                  <Search size={15} />
                  Search everything
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </>
  );
}
