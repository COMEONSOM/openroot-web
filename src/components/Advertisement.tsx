import { useState, useEffect, useMemo, memo } from "react";
import { motion, AnimatePresence, Variants, Transition } from "framer-motion";
import "./styles/Advertisement.css";


/* ============================================================
   MOTION CONFIG — only for mount/unmount (non-looping)
   Looping animations → CSS @keyframes (zero JS thread cost)
   ============================================================ */

const bandVariants: Variants = {
  hidden:  { y: -80, opacity: 0 },
  visible: {
    y: 0, opacity: 1,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as Transition["ease"] },
  },
  exit: {
    y: -80, opacity: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as Transition["ease"] },
  },
};

const subtitleVariants: Variants = {
  hidden:  { opacity: 0, y: -10 },
  visible: { opacity: 1, y: 0, transition: { delay: 0.2, duration: 0.4, ease: "easeOut" } },
};

const taglineVariants: Variants = {
  hidden:  { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};


/* ============================================================
   TYPEWRITER — optimized: single string state (no char-map)
   Rendering 1 text node instead of N <span> nodes per char
   cuts paint area dramatically on every keystroke
   ============================================================ */

interface TypewriterProps {
  text: string;
  onComplete?: () => void;
}

const TYPING_SPEED    = 120;
const DELETING_SPEED  = 60;   // faster delete = less time animating
const PAUSE_AFTER     = 3600;
const PAUSE_BEFORE    = 800;

const TypewriterText = memo(({ text, onComplete }: TypewriterProps) => {
  const [count,      setCount]      = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    if (!isDeleting && count < text.length) {
      timer = setTimeout(() => setCount(c => c + 1), TYPING_SPEED);

    } else if (!isDeleting && count === text.length) {
      onComplete?.();
      timer = setTimeout(() => setIsDeleting(true), PAUSE_AFTER);

    } else if (isDeleting && count > 0) {
      timer = setTimeout(() => setCount(c => c - 1), DELETING_SPEED);

    } else if (isDeleting && count === 0) {
      timer = setTimeout(() => setIsDeleting(false), PAUSE_BEFORE);
    }

    return () => clearTimeout(timer);
  }, [count, isDeleting, text, onComplete]);

  // Single text node — zero per-character DOM nodes = minimal paint
  return (
    <span className="typewriter-container" aria-label={text}>
      <span aria-hidden="true">{text.slice(0, count)}</span>
      {/* Cursor — CSS animation, no framer-motion needed */}
      <span className="typewriter-cursor" aria-hidden="true" />
    </span>
  );
});
TypewriterText.displayName = "TypewriterText";


/* ============================================================
   PARTICLES — pure CSS @keyframes, zero JS animation loop
   React only sets inline --x/--y/--dur/--delay CSS vars once
   on mount. The browser handles all animation on the GPU.
   ============================================================ */

interface ParticleConfig {
  x: string;
  y: string;
  duration: number;
  delay: number;
}

// Reduced count: 12 is visually identical to 20, 40% fewer layers
const createParticleConfig = (count: number): ParticleConfig[] =>
  Array.from({ length: count }).map(() => ({
    x:        `${Math.random() * 100}%`,
    y:        `${Math.random() * 100}%`,
    duration: 3 + Math.random() * 2,
    delay:    Math.random() * 3,
  }));

const GlowParticles = memo(({ count = 12 }: { count?: number }) => {
  // useMemo: config generated once, never on re-render
  const particles = useMemo(() => createParticleConfig(count), [count]);

  return (
    <div className="glow-particles" aria-hidden="true">
      {particles.map((p, i) => (
        // Plain <div> — no motion.div, no JS RAF per particle
        // CSS custom props set once; @keyframes runs on compositor
        <div
          key={i}
          className="particle"
          style={{
            left:                    p.x,
            top:                     p.y,
            animationDuration:       `${p.duration}s`,
            animationDelay:          `${p.delay}s`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
});
GlowParticles.displayName = "GlowParticles";


/* ============================================================
   MAIN COMPONENT
   ============================================================ */

export default function Advertisement() {
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const TEXT = "VISION 2047";

  return (
    <AnimatePresence mode="wait">
      <motion.section
        className="advertisement-band"
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={bandVariants}
      >
        {/* Static gradient — no animation, no repaint */}
        <div className="gradient-bg" aria-hidden="true" />

        {/* Glow — CSS animation only, no motion.div */}
        <div className="center-glow" aria-hidden="true" />

        {/* Particles — CSS only */}
        <GlowParticles />

        {/* Content */}
        <div className="advertisement-content">
          <motion.span
            className="subtitle"
            variants={subtitleVariants}
            initial="hidden"
            animate="visible"
          >
            INDIA @100
          </motion.span>

          <h1 className="main-title">
            <TypewriterText
              text={TEXT}
              onComplete={() => setIsTypingComplete(true)}
            />
          </h1>

          <AnimatePresence>
            {isTypingComplete && (
              <motion.p
                className="tagline"
                variants={taglineVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
              >
                Building a Developed Nation Together
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </motion.section>
    </AnimatePresence>
  );
}
