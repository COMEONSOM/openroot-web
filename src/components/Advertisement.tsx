import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./styles/Advertisement.css";

const LETTER_DELAY = 0.1;
const CURSOR_BLINK_DURATION = 0.8;

// ==============================
// Typewriter Text Component
// ==============================
const TypewriterText = ({ text, onComplete }) => {
  const [displayed, setDisplayed] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const TYPING_SPEED = 120;   // ms per letter
  const DELETING_SPEED = 120;  // ms per letter
  const PAUSE_AFTER_TYPE = 3600;
  const PAUSE_AFTER_DELETE = 800;

  useEffect(() => {
    let timer;

    if (!isDeleting && displayed.length < text.length) {
      // Typing
      timer = setTimeout(() => {
        setDisplayed(text.slice(0, displayed.length + 1));
      }, TYPING_SPEED);
    
    } else if (!isDeleting && displayed.length === text.length) {
      // Fire immediately when typing completes
      onComplete?.();

      // Then pause before deleting
      timer = setTimeout(() => {
        setIsDeleting(true);
      }, PAUSE_AFTER_TYPE);

    } else if (isDeleting && displayed.length > 0) {
      // Deleting
      timer = setTimeout(() => {
        setDisplayed(text.slice(0, displayed.length - 1));
      }, DELETING_SPEED);
    } else if (isDeleting && displayed.length === 0) {
      // Pause after delete, then start typing again
      timer = setTimeout(() => {
        setIsDeleting(false);
      }, PAUSE_AFTER_DELETE);
    }

    return () => clearTimeout(timer);
  }, [displayed, isDeleting, text, onComplete]);

  return (
    <span className="typewriter-container">
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
        animate={{ opacity: [1, 0, 1] }}
        transition={{
          duration: 0.8,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        |
      </motion.span>
    </span>
  );
};

// ==============================
// Glowing Particles Background
// ==============================
const GlowParticles = () => (
  <div className="glow-particles">
    {Array.from({ length: 20 }).map((_, i) => (
      <motion.div
        key={i}
        className="particle"
        initial={{
          x: Math.random() * 100 + "%",
          y: Math.random() * 100 + "%",
          scale: 0,
        }}
        animate={{
          y: [null, "-20%"],
          scale: [0, 1, 0],
          opacity: [0, 0.6, 0],
        }}
        transition={{
          duration: 3 + Math.random() * 2,
          repeat: Infinity,
          delay: Math.random() * 3,
          ease: "easeOut",
        }}
      />
    ))}
  </div>
);

// ==============================
// Main Component
// ==============================
export default function Advertisement() {
  const [visible, setVisible] = useState(true);
  const [isTypingComplete, setIsTypingComplete] = useState(false);

  const TEXT = "VISION 2047";

  if (!visible) return null;

  return (
    <AnimatePresence>
      <motion.section
        className="advertisement-band"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -100, opacity: 0 }}
        transition={{
          duration: 0.8,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        {/* Gradient Background */}
        <div className="gradient-bg" />

        {/* Animated Glow */}
        <motion.div
          className="center-glow"
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
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
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
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
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
