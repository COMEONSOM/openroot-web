import { useEffect, useRef, useState } from "react";
import { useTheme } from "../context/ThemeContext";
import "../components/styles/BackToTop.css";

export default function BackToTop() {
  // Show button after some scroll
  const [visible, setVisible] = useState(false);

  // Track arrow direction
  const [direction, setDirection] = useState<"up" | "down">("up");

  // Theme
  const { mode, resolved } = useTheme();

  // Store previous scroll position
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Show button only after user scrolls some distance
      setVisible(currentScrollY > 300);

      // Ignore tiny movements (prevents flickering)
      if (
        Math.abs(currentScrollY - lastScrollY.current) < 5
      ) {
        return;
      }

      // Detect direction
      if (currentScrollY > lastScrollY.current) {
        // Scrolling Down
        setDirection("down");
      } else {
        // Scrolling Up
        setDirection("up");
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll
      );
    };
  }, []);

  // Button click action
  const handleScrollAction = () => {
    if (direction === "down") {
      // Scroll to bottom
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth",
      });
    } else {
      // Scroll to top
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  return (
    <button
      onClick={handleScrollAction}
      className={`back-to-top ${
        visible ? "show" : ""
      }`}
      aria-label={
        direction === "up"
          ? "Back to top"
          : "Go to bottom"
      }
      title={
        direction === "up"
          ? "Back to top"
          : "Go to bottom"
      }
      data-mode={mode}
      data-resolved={resolved}
    >
      {direction === "up" ? "↑" : "↓"}
    </button>
  );
}