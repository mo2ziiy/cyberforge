"use client";

import Link from "next/link";
import { useState, useEffect, useRef, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Menu, X, Bell, LogOut, LayoutDashboard, User, Zap, ChevronDown, BookOpen, Trophy, Flame, Shield, ChevronRight } from "lucide-react";
import BrandLogo, { BrandMark } from "@/components/ui/BrandLogo";
import ThemeToggle from "@/components/ui/ThemeToggle";
import CommandPalette from "@/components/CommandPalette";
import { NAV_LINKS } from "@/lib/site";

interface UserData {
  name: string;
  role: string;
  points?: number;
  streak?: number;
  avatar?: string | null;
}

interface Notification {
  _id: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: string;
}

const noop = () => () => {};

function Avatar({ user, initials }: { user: UserData; initials: string }) {
  return (
    <div
      className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center text-on-primary font-bold text-xs shrink-0"
      style={{ background: "linear-gradient(135deg, var(--primary), var(--secondary))" }}
    >
      {user.avatar ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
      ) : (
        initials
      )}
    </div>
  );
}
const getIsMac = () => (typeof navigator !== "undefined" ? /mac|iphone|ipad/i.test(navigator.platform || navigator.userAgent) : false);

const isActivePath = (pathname: string, href: string) => pathname === href || pathname.startsWith(href + "/");

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const notifRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const isMac = useSyncExternalStore(noop, getIsMac, () => false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => setUser(data?.user ?? null))
      .catch(() => {});
  }, [pathname]);

  useEffect(() => {
    if (!user) return;
    fetch("/api/notifications")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.notifications) setNotifications(data.notifications);
      })
      .catch(() => {});
  }, [user]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setShowNotifications(false);
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) setShowUserMenu(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
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

  const handleLogout = async () => {
    await fetch("/api/auth/login", { method: "DELETE" });
    setUser(null);
    setShowUserMenu(false);
    window.location.href = "/";
  };

  const markAllRead = async () => {
    await fetch("/api/notifications", { method: "PATCH" });
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;
  const initials = user?.name
    ? user.name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

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
              ? "border-border bg-background/85 backdrop-blur-xl shadow-[var(--shadow-md)]"
              : "border-border/60 bg-background/55 backdrop-blur-md"
          }`}
        >
          <div className="flex items-center justify-between gap-2 h-14 px-3 sm:px-5">
            <BrandLogo size={34} textClassName="text-[17px] hidden sm:inline" />

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

              {user ? (
                <>
                  {/* Notifications */}
                  <div ref={notifRef} className="relative">
                    <button onClick={() => setShowNotifications(!showNotifications)} className="icon-btn relative" aria-label="Notifications">
                      <Bell size={18} />
                      {unreadCount > 0 && (
                        <span className="absolute top-1.5 right-1.5 min-w-4 h-4 px-1 bg-danger text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-background">
                          {unreadCount > 9 ? "9+" : unreadCount}
                        </span>
                      )}
                    </button>

                    <AnimatePresence>
                      {showNotifications && (
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.96 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.96 }}
                          transition={{ duration: 0.16 }}
                          className="absolute right-0 top-full mt-2 w-80 glass-strong rounded-2xl overflow-hidden"
                        >
                          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                            <span className="font-semibold text-sm">Notifications</span>
                            {unreadCount > 0 && (
                              <button onClick={markAllRead} className="text-xs text-primary hover:underline">
                                Mark all read
                              </button>
                            )}
                          </div>
                          <div className="max-h-72 overflow-y-auto">
                            {notifications.length === 0 ? (
                              <div className="flex flex-col items-center gap-2 py-10">
                                <Bell size={22} className="text-subtle" />
                                <p className="text-sm text-muted">You&apos;re all caught up</p>
                              </div>
                            ) : (
                              notifications.slice(0, 8).map((n) => {
                                const Icon = n.type === "achievement" ? Trophy : n.type === "streak" ? Flame : n.type === "points" ? Zap : Bell;
                                const toneCls = n.type === "achievement" ? "tone-amber" : n.type === "streak" ? "tone-orange" : n.type === "points" ? "tone-primary" : "tone-slate";
                                return (
                                  <div key={n._id} className={`px-4 py-3 border-b border-border/60 last:border-0 ${!n.read ? "bg-primary/5" : ""}`}>
                                    <div className="flex items-start gap-3">
                                      <span className={`tone-icon w-7 h-7 rounded-md shrink-0 ${toneCls}`}>
                                        <Icon size={13} />
                                      </span>
                                      <div className="min-w-0">
                                        <p className="text-sm text-foreground leading-snug">{n.message}</p>
                                        <p className="text-[11px] text-subtle mt-0.5">{new Date(n.createdAt).toLocaleDateString()}</p>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* User menu */}
                  <div ref={userMenuRef} className="relative hidden sm:block">
                    <button onClick={() => setShowUserMenu(!showUserMenu)} className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-xl hover:bg-surface-2 transition-colors">
                      <Avatar user={user} initials={initials} />
                      {user.points !== undefined && (
                        <span className="hidden lg:flex items-center gap-1 text-xs text-muted tabular-nums">
                          <Zap size={11} className="text-warning" />
                          {user.points}
                        </span>
                      )}
                      <ChevronDown size={14} className={`text-muted transition-transform duration-300 ${showUserMenu ? "rotate-180" : ""}`} />
                    </button>

                    <AnimatePresence>
                      {showUserMenu && (
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.96 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.96 }}
                          transition={{ duration: 0.16 }}
                          className="absolute right-0 top-full mt-2 w-56 glass-strong rounded-2xl overflow-hidden"
                        >
                          <div className="px-4 py-3 border-b border-border">
                            <p className="font-semibold text-sm text-foreground truncate">{user.name}</p>
                            <p className="text-xs text-muted capitalize flex items-center gap-1">
                              {user.role === "admin" && <Shield size={10} className="text-primary" />}
                              {user.role}
                            </p>
                          </div>
                          <div className="py-1">
                            {[
                              { href: user.role === "admin" ? "/admin" : "/dashboard", label: user.role === "admin" ? "Admin Panel" : "Dashboard", Icon: LayoutDashboard },
                              { href: "/profile", label: "Profile", Icon: User },
                              { href: "/roadmaps", label: "Roadmaps", Icon: BookOpen },
                            ].map((i) => (
                              <Link
                                key={i.href}
                                href={i.href}
                                onClick={() => setShowUserMenu(false)}
                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-muted hover:text-foreground hover:bg-surface-2 transition-colors"
                              >
                                <i.Icon size={15} />
                                {i.label}
                              </Link>
                            ))}
                            <div className="border-t border-border my-1" />
                            <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-2.5 text-sm text-danger hover:bg-danger/10 transition-colors w-full">
                              <LogOut size={15} />
                              Sign out
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </>
              ) : (
                <div className="hidden sm:flex items-center gap-2 ml-1">
                  <Link href="/sign-in" className="btn btn-ghost btn-sm">
                    Sign in
                  </Link>
                  <Link href="/sign-up" className="btn btn-primary btn-sm">
                    Get started
                  </Link>
                </div>
              )}

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

              <nav className="flex-1 px-3 py-3">
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
                {user ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <Avatar user={user} initials={initials} />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{user.name}</p>
                        {user.points !== undefined && (
                          <p className="text-xs text-muted flex items-center gap-1">
                            <Zap size={10} className="text-warning" />
                            {user.points} pts
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Link href={user.role === "admin" ? "/admin" : "/dashboard"} onClick={() => setIsOpen(false)} className="btn btn-outline btn-sm flex-1">
                        <LayoutDashboard size={13} />
                        {user.role === "admin" ? "Admin" : "Dashboard"}
                      </Link>
                      <Link href="/profile" onClick={() => setIsOpen(false)} className="btn btn-ghost btn-sm flex-1">
                        <User size={13} />
                        Profile
                      </Link>
                      <button onClick={handleLogout} className="btn btn-danger btn-sm" aria-label="Sign out">
                        <LogOut size={13} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Link href="/sign-up" onClick={() => setIsOpen(false)} className="btn btn-primary w-full">
                      Get started
                    </Link>
                    <Link href="/sign-in" onClick={() => setIsOpen(false)} className="btn btn-outline w-full">
                      Sign in
                    </Link>
                  </div>
                )}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </>
  );
}
