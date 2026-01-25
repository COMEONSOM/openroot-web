import { useState, useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import "./styles/Advertisement.css";

// Ashoka Chakra Component
const AshokaChakra = () => {
  const spokes = 24;
  return (
    <motion.div 
      className="chakra-container"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.8, type: "spring" }}
    >
      <div className="chakra">
        {Array.from({ length: spokes }).map((_, i) => (
          <div
            key={i}
            className="chakra-spoke"
            style={{ transform: `translateX(-50%) rotate(${i * (360 / spokes)}deg)` }}
          />
        ))}
      </div>
    </motion.div>
  );
};

// Tricolor Beams Component
const TricolorBeams = () => (
  <div className="tricolor-beams">
    <motion.div 
      className="beam beam--saffron"
      animate={{ x: [0, 50, 0], opacity: [0.3, 0.6, 0.3] }}
      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
    />
    <motion.div 
      className="beam beam--white"
      animate={{ x: [0, -30, 0], opacity: [0.2, 0.5, 0.2] }}
      transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
    />
    <motion.div 
      className="beam beam--green"
      animate={{ x: [0, -50, 0], opacity: [0.3, 0.6, 0.3] }}
      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 4 }}
    />
  </div>
);

// Main Component
export default function Advertisement() {
  const [visible, setVisible] = useState(true);
  const bandRef = useRef(null);
  
  // Mouse tracking for interactive glow
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 500, damping: 50 });
  const springY = useSpring(mouseY, { stiffness: 500, damping: 50 });

  const handleMouseMove = (e) => {
    const rect = bandRef.current?.getBoundingClientRect();
    if (rect) {
      mouseX.set(e.clientX - rect.left);
      mouseY.set(e.clientY - rect.top);
    }
  };

  if (!visible) return null;

  const TEXT = "WE THE PEOPLE OF INDIA";
  const ITEMS_COUNT = 8;

  return (
    <AnimatePresence>
      <motion.section
        ref={bandRef}
        className="advertisement-band"
        onMouseMove={handleMouseMove}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -100, opacity: 0 }}
        transition={{ 
          duration: 0.8, 
          ease: [0.22, 1, 0.36, 1],
          opacity: { duration: 0.4 }
        }}
      >
        {/* Border Glow Effect */}
        <div className="border-glow" />
        
        {/* Aurora Background */}
        <motion.div 
          className="aurora-layer"
          animate={{ opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        
        {/* Tricolor Light Beams */}
        <TricolorBeams />
        
        {/* Interactive Mouse Glow */}
        <motion.div
          style={{
            position: "absolute",
            width: 250,
            height: 250,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(255,215,0,0.2), transparent 70%)",
            pointerEvents: "none",
            x: springX,
            y: springY,
            translateX: "-50%",
            translateY: "-50%",
          }}
        />
        
        {/* Ashoka Chakra */}
        <AshokaChakra />
        
        {/* Glassmorphic Track */}
        <motion.div 
          className="advertisement-track"
          whileHover={{ scale: 1.01 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          <motion.div
            className="advertisement-marquee"
            animate={{ x: ["0%", "-50%"] }}
            transition={{
              duration: 20,
              ease: "linear",
              repeat: Infinity,
            }}
          >
            {/* First set with dividers */}
            {Array.from({ length: ITEMS_COUNT }).map((_, i) => (
              <motion.span
                key={`a-${i}`}
                className="advertisement-text"
                whileHover={{ 
                  scale: 1.1,
                  filter: "drop-shadow(0 0 20px rgba(255, 215, 0, 0.8))"
                }}
              >
                {TEXT}
                <span className="divider-star" style={{ marginLeft: 30 }}>✦</span>
              </motion.span>
            ))}
            
            {/* Duplicate set for seamless loop */}
            {Array.from({ length: ITEMS_COUNT }).map((_, i) => (
              <motion.span
                key={`b-${i}`}
                className="advertisement-text"
                whileHover={{ 
                  scale: 1.1,
                  filter: "drop-shadow(0 0 20px rgba(255, 215, 0, 0.8))"
                }}
              >
                {TEXT}
                <span className="divider-star" style={{ marginLeft: 30 }}>✦</span>
              </motion.span>
            ))}
          </motion.div>
        </motion.div>
      </motion.section>
    </AnimatePresence>
  );
}
