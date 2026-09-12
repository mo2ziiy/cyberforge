import type { Transition, Variants } from "framer-motion";

/** Shared easing + timing so every page moves the same way. */
export const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export const spring: Transition = { type: "spring", stiffness: 380, damping: 32, mass: 0.8 };
export const softSpring: Transition = { type: "spring", stiffness: 220, damping: 26 };

// Entrance animations are kept short and low-travel so pages settle almost
// immediately. Long, staggered card animations meant tap targets were still
// moving/fading right after a navigation — which dropped frames and made the
// first tap on a phone miss (you had to tap twice).
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: EASE } },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.28, ease: EASE } },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.98 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: EASE } },
};

export const slideLeft: Variants = {
  hidden: { opacity: 0, x: -14 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.32, ease: EASE } },
};

export const slideRight: Variants = {
  hidden: { opacity: 0, x: 14 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.32, ease: EASE } },
};

// Total stagger is clamped so a long list (20+ cards) can't keep animating —
// and blocking taps — for a second after the page appears.
export const stagger = (delayChildren = 0, staggerChildren = 0.04): Variants => ({
  hidden: {},
  visible: { transition: { delayChildren: Math.min(delayChildren, 0.08), staggerChildren: Math.min(staggerChildren, 0.025) } },
});

export const viewportOnce = { once: true, margin: "-60px" } as const;
