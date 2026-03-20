import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence, Variants, Transition } from "framer-motion";
import "./styles/Advertisement.css";

/* -----------------------------
   Shared motion config
----------------------------- */

const bandVariants: Variants = {
  hidden: { y: -80, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as Transition["ease"] },
  },
  exit: {
    y: -80,
    opacity: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as Transition["ease"] },
  },
};

const subtitleVariants: Variants = {
  hidden: { opacity: 0, y: -10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { delay: 0.2, duration: 0.4, ease: "easeOut" },
  },
};

const taglineVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

const cursorBlink: Transition = {
  duration: 0.8,
  repeat: Infinity,
  ease: "linear",
};

/* -----------------------------
   Typewriter Text Component
----------------------------- */

interface TypewriterProps {
  text: string;
  onComplete?: () => void;
}

const TypewriterText = ({ text, onComplete }: TypewriterProps) => {
  const [displayed, setDisplayed] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const TYPING_SPEED = 120;
  const DELETING_SPEED = 120;
  const PAUSE_AFTER_TYPE = 3600;
  const PAUSE_AFTER_DELETE = 800;

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    if (!isDeleting && displayed.length < text.length) {
      timer = setTimeout(() => {
        setDisplayed(text.slice(0, displayed.length + 1));
      }, TYPING_SPEED);
    } else if (!isDeleting && displayed.length === text.length) {
      onComplete?.();
      timer = setTimeout(() => {
        setIsDeleting(true);
      }, PAUSE_AFTER_TYPE);
    } else if (isDeleting && displayed.length > 0) {
      timer = setTimeout(() => {
        setDisplayed(text.slice(0, displayed.length - 1));
      }, DELETING_SPEED);
    } else if (isDeleting && displayed.length === 0) {
      timer = setTimeout(() => {
        setIsDeleting(false);
      }, PAUSE_AFTER_DELETE);
    }

    return () => clearTimeout(timer);
  }, [displayed, isDeleting, text, onComplete]);

  return (
    <span className="typewriter-container" aria-label={text}>
      <span>
        {displayed.split("").map((char, i) => (
          <span key={i} className="typewriter-char">
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </span>

      {/* Blinking Cursor */}
      <motion.span
        className="typewriter-cursor"
        aria-hidden="true"
        animate={{ opacity: [1, 0, 1] }}
        transition={cursorBlink}
      >
        |
      </motion.span>
    </span>
  );
};

/* -----------------------------
   Glowing Particles Background
----------------------------- */

interface ParticleConfig {
  x: string;
  y: string;
  duration: number;
  delay: number;
}

const createParticleConfig = (count: number): ParticleConfig[] =>
  Array.from({ length: count }).map(() => ({
    x: `${Math.random() * 100}%`,
    y: `${Math.random() * 100}%`,
    duration: 3 + Math.random() * 2,
    delay: Math.random() * 3,
  }));

const GlowParticles = ({ count = 20 }: { count?: number }) => {
  const particles = useMemo(() => createParticleConfig(count), [count]);

  return (
    <div className="glow-particles" aria-hidden="true">
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="particle"
          initial={{ x: p.x, y: p.y, scale: 0, opacity: 0 }}
          animate={{
            y: ["0%", "-20%"],
            scale: [0, 1, 0],
            opacity: [0, 0.6, 0],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
};

/* -----------------------------
   Main Component
----------------------------- */

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
        {/* Gradient Background */}
        <div className="gradient-bg" aria-hidden="true" />

        {/* Animated Glow */}
        <motion.div
          className="center-glow"
          aria-hidden="true"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Particles */}
        <GlowParticles />

        {/* Main Content */}
        <div className="advertisement-content">
          {/* Subtitle */}
          <motion.span
            className="subtitle"
            variants={subtitleVariants}
            initial="hidden"
            animate="visible"
          >
            INDIA @100
          </motion.span>

          {/* Main Typewriter Text */}
          <h1 className="main-title">
            <TypewriterText
              text={TEXT}
              onComplete={() => setIsTypingComplete(true)}
            />
          </h1>

          {/* Tagline - appears after typing completes */}
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
