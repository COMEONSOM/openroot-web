import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type TransitionEvent,
} from "react";
import GoToMainContent from "./GoToMainContent/GoToMainContent";
import "./IntroSplash.css";

export const DEFAULT_INTRO_ANIMATION_URL = "/intro/openroot-intro.html";

export interface IntroSplashProps {
  onEnterMainContent: () => void;
  animationUrl?: string;
}

export default function IntroSplash({
  onEnterMainContent,
  animationUrl = DEFAULT_INTRO_ANIMATION_URL,
}: IntroSplashProps) {
  const [isExiting, setIsExiting] = useState(false);
  const actionButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    actionButtonRef.current?.focus();
  }, []);

  const requestEntry = useCallback(() => {
    setIsExiting(true);
  }, []);

  const keepFocusInIntro = useCallback((event: KeyboardEvent<HTMLElement>) => {
    if (event.key !== "Tab") return;

    event.preventDefault();
    actionButtonRef.current?.focus();
  }, []);

  const handleExitTransitionEnd = useCallback(
    (event: TransitionEvent<HTMLElement>) => {
      if (
        isExiting &&
        event.target === event.currentTarget &&
        event.propertyName === "opacity"
      ) {
        onEnterMainContent();
      }
    },
    [isExiting, onEnterMainContent]
  );

  return (
    <section
      className={`intro-splash${isExiting ? " intro-splash--exiting" : ""}`}
      role="dialog"
      aria-label="Openroot Systems introduction"
      aria-modal="true"
      onKeyDown={keepFocusInIntro}
      onTransitionEnd={handleExitTransitionEnd}
    >
      <iframe
        className="intro-splash__frame"
        src={animationUrl}
        title="Openroot Systems introductory animation"
        sandbox="allow-scripts"
        tabIndex={-1}
      />
      <GoToMainContent
        ref={actionButtonRef}
        onClick={requestEntry}
        disabled={isExiting}
      />
    </section>
  );
}
