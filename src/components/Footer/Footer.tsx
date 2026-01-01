// ============================================================
// FOOTER CONTAINER
// ============================================================

import { useEffect, useRef } from "react";
import gsap from "gsap";

import DynamicIsland from "./DynamicIsland";
import License from "./License";

import "./styles-footer/Footer.css";

export default function Footer() {
  const footerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!footerRef.current) return;

    gsap.fromTo(
      footerRef.current,
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power2.out" }
    );
  }, []);

  return (
    <footer ref={footerRef} className="footer-container">
      <DynamicIsland />
      <License />
    </footer>
  );
}
