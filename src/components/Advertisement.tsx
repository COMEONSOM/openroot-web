import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./styles/Advertisement.css";

export default function Advertisement() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  const TEXT = "✨ HAPPY NEW YEAR 2026 ✨";

  return (
    <AnimatePresence>
      <motion.section
        className="advertisement-band"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -20, opacity: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <div className="advertisement-track">
          <motion.div
            className="advertisement-marquee"
            animate={{ x: ["0%", "-50%"] }}
            transition={{
              duration: 14,
              ease: "linear",
              repeat: Infinity,
            }}
          >
            {/* First set */}
            {Array.from({ length: 6 }).map((_, i) => (
              <span key={`a-${i}`} className="advertisement-text advertisement-glow">
                {TEXT}
              </span>
            ))}

            {/* Duplicate set (prevents gap) */}
            {Array.from({ length: 6 }).map((_, i) => (
              <span key={`b-${i}`} className="advertisement-text advertisement-glow">
                {TEXT}
              </span>
            ))}
          </motion.div>
        </div>
      </motion.section>
    </AnimatePresence>
  );
}
