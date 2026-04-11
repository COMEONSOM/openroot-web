// ─────────────────────────────────────────────────────────────────
// src/components/motion/variants.ts
// FRAMER MOTION VARIANTS + EASING CURVES
// CHANGE EASING CONSTANTS HERE TO AFFECT THE ENTIRE ABOUT SECTION
// ─────────────────────────────────────────────────────────────────

// EASING CURVES — CUBIC-BEZIER ARRAYS FOR FRAMER MOTION
// EASE_OUT:  FAST START + SMOOTH DECELERATION — USE FOR DEFAULT INTERACTIONS
// EASE_SOFT: VERY SMOOTH + GENTLE — USE FOR CARDS AND OVERLAYS
export const EASE_OUT:  [number, number, number, number] = [0.22, 1, 0.36, 1];
export const EASE_SOFT: [number, number, number, number] = [0.16, 1, 0.30, 1];

// SHARED VIEWPORT CONFIG
// once:   ONLY ANIMATE ON FIRST VIEW — PREVENTS RE-TRIGGER ON SCROLL UP
// margin: FIRE 60px BEFORE ELEMENT ENTERS VIEWPORT FOR A NATURAL FEEL
export const VP = { once: true, margin: "-60px" } as const;

// FADE IN — PURE OPACITY, NO POSITIONAL MOVEMENT
// USE FOR: SECTION WRAPPERS, BACKGROUND LAYERS
export const fadeIn = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.55, ease: "easeOut" as const } },
};

// FADE UP — OPACITY + 20px VERTICAL SLIDE
// USE FOR: CARDS, HEADINGS, CONTENT BLOCKS
export const fadeUp = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE_OUT } },
};

// SLIDE LEFT — OPACITY + 24px HORIZONTAL SLIDE
// USE FOR: EYEBROW LABELS, LEFT-ALIGNED SUBHEADINGS
export const slideLeft = {
  hidden:  { opacity: 0, x: -24 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.55, ease: EASE_OUT } },
};

// STAGGER PARENT — ORCHESTRATES CHILD ANIMATIONS IN SEQUENCE
// delay:    INITIAL PAUSE BEFORE FIRST CHILD STARTS
// interval: TIME BETWEEN EACH SUBSEQUENT CHILD ANIMATION
export const stagger = (delay = 0.06, interval = 0.1) => ({
  hidden:  {},
  visible: { transition: { staggerChildren: interval, delayChildren: delay } },
});

// CARD REVEAL — OPACITY + VERTICAL SLIDE + SUBTLE SCALE (3%)
// USE FOR: GRID CARDS — PASS INDEX VIA custom PROP FOR PER-CARD DELAY
export const cardReveal = {
  hidden:  { opacity: 0, y: 24, scale: 0.97 },
  visible: (i: number) => ({
    opacity: 1, y: 0, scale: 1,
    transition: { delay: i * 0.09, duration: 0.5, ease: EASE_OUT },
  }),
};