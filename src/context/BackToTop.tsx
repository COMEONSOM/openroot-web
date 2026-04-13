import { useEffect, useState } from "react";
import { useTheme } from "../context/ThemeContext"; // 🔥 important
import "../components/styles/BackToTop.css";

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  // 🔥 get theme data
  const { mode, resolved } = useTheme();

  // Show button on scroll
  useEffect(() => {
    const toggleVisibility = () => {
      setVisible(window.scrollY > 300);
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  // Scroll to top
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`back-to-top ${visible ? "show" : ""}`}
      aria-label="Back to top"
      title="Back to top"

      /* 🔥 IMPORTANT for auto-mode visibility fix */
      data-mode={mode}
      data-resolved={resolved}
    >
      ↑
    </button>
  );
}