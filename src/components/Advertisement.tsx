import { useState, useEffect, useMemo, memo } from "react";
import { motion, AnimatePresence, Variants, Transition } from "framer-motion";
import "./styles/Advertisement.css";


/* ============================================================
   MOTION CONFIG
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
   QUANTUM COLLAPSE TEXT
   ─────────────────────────────────────────────────────────────
   Concept: All characters are visible on frame 1 as random
   symbols (scrambling). One by one — in a randomised,
   non-sequential order — each character "collapses" into its
   correct value with a brief glow flash, like quantum
   measurement collapsing a superposition into a definite state.

   Performance wins:
   • Text node always exists  →  LCP registered on frame 1
   • Character count is fixed  →  zero layout shift / no x-axis vibration
   • Only ONE setInterval for scrambling (cleared after all locked)
   • Lock flash is a CSS @keyframes, not a JS animation loop
   ============================================================ */

const CHARSET        = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*+=<>?";
const SCRAMBLE_SPEED = 55;   // ms between scramble frames
const LOCK_INTERVAL  = 150;  // ms between successive character locks
const PAUSE_LOCKED   = 4200; // ms to hold resolved text before next cycle

const randomChar = (): string =>
  CHARSET[Math.floor(Math.random() * CHARSET.length)];

/** Fisher-Yates shuffle */
const shuffled = (arr: number[]): number[] => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

interface QuantumTextProps {
  text: string;
  onComplete?: () => void;
}

const QuantumText = memo(({ text, onComplete }: QuantumTextProps) => {
  const chars = useMemo(() => text.split(""), [text]);

  // What is currently rendered for each character position
  const [display, setDisplay] = useState<string[]>(() =>
    chars.map(c => (c === " " ? " " : randomChar()))
  );

  // Which positions have collapsed to their correct value
  const [locked, setLocked] = useState<boolean[]>(() =>
    chars.map(c => c === " ")
  );

  useEffect(() => {
    const lockedSet = new Set<number>(
      chars.flatMap((c, i) => (c === " " ? [i] : []))
    );
    let scrambleId: ReturnType<typeof setInterval> | null = null;
    let lockTimers: ReturnType<typeof setTimeout>[] = [];
    let resetTimer: ReturnType<typeof setTimeout> | null = null;
    let active = true;

    const clearAll = () => {
      if (scrambleId) clearInterval(scrambleId);
      lockTimers.forEach(clearTimeout);
      if (resetTimer) clearTimeout(resetTimer);
    };

    const runCycle = () => {
      if (!active) return;

      // Reset to scrambling state
      lockedSet.clear();
      chars.forEach((c, i) => { if (c === " ") lockedSet.add(i); });
      setLocked(chars.map(c => c === " "));

      // Scramble all unlocked characters on every tick
      scrambleId = setInterval(() => {
        if (!active) return;
        setDisplay(prev =>
          prev.map((_, i) => (lockedSet.has(i) ? chars[i] : randomChar()))
        );
      }, SCRAMBLE_SPEED);

      // Random lock order for non-space indices
      const nonSpaceIdx = chars
        .map((c, i) => (c !== " " ? i : -1))
        .filter(i => i !== -1);
      const lockOrder = shuffled(nonSpaceIdx);

      // Schedule each character's collapse
      lockTimers = lockOrder.map((charIdx, step) =>
        setTimeout(() => {
          if (!active) return;

          lockedSet.add(charIdx);

          setDisplay(prev => {
            const next = [...prev];
            next[charIdx] = chars[charIdx];
            return next;
          });

          setLocked(prev => {
            const next = [...prev];
            next[charIdx] = true;
            return next;
          });

          // Final character locked — wrap up cycle
          if (step === lockOrder.length - 1) {
            if (scrambleId) clearInterval(scrambleId);
            scrambleId = null;
            onComplete?.();
            resetTimer = setTimeout(() => {
              if (active) runCycle();
            }, PAUSE_LOCKED);
          }
        }, step * LOCK_INTERVAL)
      );
    };

    runCycle();

    return () => {
      active = false;
      clearAll();
    };
  }, [chars, onComplete]);

  return (
    <>
      {/* Scoped keyframe injected once — no stylesheet dependency */}
      <style>{`
        @keyframes qlock {
          0%   { text-shadow: 0 0 18px #fff, 0 0 36px currentColor;
                 filter: brightness(2.6); }
          100% { text-shadow: none;
                 filter: brightness(1); }
        }
        .q-char          { display: inline-block; transition: color 0.08s linear; }
        .q-char.scramble { color: rgba(255,255,255,0.28); }
        .q-char.resolved { animation: qlock 0.45s ease-out forwards; }
      `}</style>

      <span className="quantum-text" aria-label={text}>
        {display.map((char, i) => (
          <span
            key={i}
            className={`q-char ${locked[i] ? "resolved" : "scramble"}`}
            aria-hidden="true"
          >
            {char}
          </span>
        ))}
      </span>
    </>
  );
});
QuantumText.displayName = "QuantumText";


/* ============================================================
   PARTICLES — pure CSS, zero JS animation loop
   ============================================================ */

interface ParticleConfig { x: string; y: string; duration: number; delay: number; }

const createParticleConfig = (count: number): ParticleConfig[] =>
  Array.from({ length: count }).map(() => ({
    x:        `${Math.random() * 100}%`,
    y:        `${Math.random() * 100}%`,
    duration: 3 + Math.random() * 2,
    delay:    Math.random() * 3,
  }));

const GlowParticles = memo(({ count = 12 }: { count?: number }) => {
  const particles = useMemo(() => createParticleConfig(count), [count]);

  return (
    <div className="glow-particles" aria-hidden="true">
      {particles.map((p, i) => (
        <div
          key={i}
          className="particle"
          style={{
            left:              p.x,
            top:               p.y,
            animationDuration: `${p.duration}s`,
            animationDelay:    `${p.delay}s`,
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
  // Tagline visible immediately — not gated behind text animation
  const [isTypingComplete, setIsTypingComplete] = useState(true);
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
        <div className="gradient-bg"  aria-hidden="true" />
        <div className="center-glow"  aria-hidden="true" />
        <GlowParticles />

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
            <QuantumText
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