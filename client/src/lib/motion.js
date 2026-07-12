// Motion tokens. Every Framer Motion duration/ease in the app comes from
// here — no ad-hoc timing values in components.

export const DUR = { fast: 0.15, base: 0.22, slow: 0.32 };
export const EASE = [0.32, 0.72, 0, 1];

// One page-level entrance. Applied to the page container only —
// never to individual cards/rows.
export const pageEnter = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -4 },
  transition: { duration: DUR.base, ease: EASE },
};

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: DUR.base, ease: EASE },
};
