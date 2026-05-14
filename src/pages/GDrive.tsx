import React, { useState } from "react";

import "../components/styles/GDrive.css";

import step1Img from "/assets-gdrive/step-01.png";
import step2Img from "/assets-gdrive/step-02.png";
import step3Img from "/assets-gdrive/step-03.png";
import tutorialThumb from "/assets-gdrive/tutorial-thumb.png";

/* =============================================================================
   LINKS
============================================================================= */

const EXTENSION_URL =
  "https://chromewebstore.google.com/detail/openroot-gdrive-automatio/pndbnlfhpjinfneglecnpgijhcaffdng";

const HOW_TO_USE_URL =
  "https://www.youtube.com/watch?v=2tqbwlV0aw0";

/* =============================================================================
   TYPES
============================================================================= */

type StepKey = 0 | 1 | 2;

type StepItem = {
  number: string;
  title: string;
  short: string;
  note: string;
  button?: string;
  previewImage?: string;
};

type TutorialItem = {
  title: string;
  short: string;
  note: string;
  previewImage: string;
};

/* =============================================================================
   STEPS
============================================================================= */

const STEPS: StepItem[] = [
  {
    number: "01",
    title: "Go to the Extension Page",
    short: "Open the official Chrome Web Store page.",
    note: "After opening the page, click Add to Chrome to begin installation.",
    button: "Go to Extension Page",
    previewImage: step1Img,
  },
  {
    number: "02",
    title: "Open Extensions Panel and Pin It",
    short:
      "Open the Extensions panel from the Chrome toolbar and pin the extension for quick access.",
    note:
      "Pinned extensions stay visible in the browser toolbar so you can use them anytime.",
    previewImage: step2Img,
  },
  {
    number: "03",
    title: "Extension Ready to Use",
    short:
      "After pinning, the extension becomes available directly from your browser toolbar.",
    note: "You can now start using the extension right away.",
    previewImage: step3Img,
  },
];

/* =============================================================================
   TUTORIAL
============================================================================= */

const TUTORIAL: TutorialItem = {
  title: "How to Use",
  short: "Click the preview image to open the tutorial video in a new tab.",
  note: "The image itself works as the tutorial link.",
  previewImage: tutorialThumb,
};

/* =============================================================================
   COMPONENT
============================================================================= */

export default function WebExtensionSection(): React.JSX.Element {
  const [activeStep, setActiveStep] = useState<StepKey>(0);
  const [isTutorialMode, setIsTutorialMode] = useState(false);

  const currentStep = STEPS[activeStep];

  const isFirst = activeStep === 0;
  const isLast = activeStep === STEPS.length - 1;

  /* =============================================================================
     ACTIONS
  ============================================================================= */

  const openExtensionPage = () => {
    window.open(
      EXTENSION_URL,
      "_blank",
      "noopener,noreferrer"
    );

    setActiveStep(1);
    setIsTutorialMode(false);
  };

  const openTutorial = () => {
    setIsTutorialMode(true);
  };

  const handleStepClick = (index: number) => {
    setActiveStep(index as StepKey);
    setIsTutorialMode(false);
  };

  const goNext = () => {
    if (!isLast) {
      setActiveStep((prev) => (prev + 1) as StepKey);
      setIsTutorialMode(false);
    }
  };

  const goPrev = () => {
    if (!isFirst) {
      setActiveStep((prev) => (prev - 1) as StepKey);
      setIsTutorialMode(false);
    }
  };

  /* =============================================================================
     DYNAMIC CONTENT
  ============================================================================= */

  const currentTitle = isTutorialMode
    ? TUTORIAL.title
    : currentStep.title;

  const currentShort = isTutorialMode
    ? TUTORIAL.short
    : currentStep.short;

  const currentNote = isTutorialMode
    ? TUTORIAL.note
    : currentStep.note;

  const currentPreview = isTutorialMode
    ? TUTORIAL.previewImage
    : currentStep.previewImage;

  const currentBadge = isTutorialMode
    ? "How to Use"
    : `Step ${currentStep.number}`;

  const currentCounter = isTutorialMode
    ? "Tutorial Preview"
    : `${activeStep + 1} / ${STEPS.length}`;

  return (
    <section
      id="web-extension-section"
      className="we-section"
    >
      <div className="we-container">
        {/* =====================================================
            HEADER
        ===================================================== */}

        <div className="we-header">
          <h2 className="we-title">
            Install & Start Using the Extension
          </h2>

          <p className="we-subtitle">
            Follow the guided setup process to install and use the extension properly.
          </p>
        </div>

        {/* =====================================================
            MAIN GRID
        ===================================================== */}

        <div className="we-grid">
          {/* =================================================
              LEFT PANEL
          ================================================= */}

          <aside className="we-step-rail">
            <div className="we-progress-wrap">
              <div className="we-progress-top">
                <span>Setup Progress</span>
                <span>
                  {activeStep + 1} / {STEPS.length}
                </span>
              </div>

              <div className="we-progress-bar">
                <div
                  className="we-progress-fill"
                  style={{
                    width: `${((activeStep + 1) / STEPS.length) * 100}%`,
                  }}
                />
              </div>
            </div>

            <div className="we-step-list">
              {STEPS.map((step, index) => (
                <button
                  key={step.number}
                  className={`we-step-card ${
                    index === activeStep && !isTutorialMode ? "is-active" : ""
                  }`}
                  onClick={() => handleStepClick(index)}
                >
                  <div className="we-step-number">{step.number}</div>

                  <div className="we-step-content">
                    <h4>{step.title}</h4>
                  </div>
                </button>
              ))}
            </div>

            <button
              type="button"
              className={`we-tutorial-card ${isTutorialMode ? "is-active" : ""}`}
              onClick={openTutorial}
            >
              <div className="we-tutorial-copy">
                <h4>How to Use</h4>
                <p>Open the tutorial guide separately.</p>
              </div>
            </button>

            <div className="we-rail-note">
              {currentNote}
            </div>
          </aside>

          {/* =================================================
              RIGHT PANEL
          ================================================= */}

          <div className="we-action-card">
            <div className="we-action-top">
              <div className="we-action-badge">
                {currentBadge}
              </div>

              <div className="we-step-counter">
                {currentCounter}
              </div>
            </div>

            <div className="we-preview">
              {isTutorialMode ? (
                <a
                  href={HOW_TO_USE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="we-preview-link"
                  aria-label="Open tutorial video"
                >
                  <img
                    src={currentPreview}
                    alt={currentTitle}
                    className="we-preview-image"
                  />
                </a>
              ) : (
                <img
                  src={currentPreview}
                  alt={currentTitle}
                  className="we-preview-image"
                />
              )}
            </div>

            <div className="we-content-block">
              <p className="we-main-description">
                {currentShort}
              </p>
            </div>

            <div className="we-toolbar">
              {!isTutorialMode && activeStep === 0 && currentStep.button && (
                <button className="we-button" onClick={openExtensionPage}>
                  {currentStep.button}
                </button>
              )}
            </div>

            {/* Mobile-only navigation.
                CSS should show this only on smaller screens and hide the left rail. */}
            <div className="we-mobile-nav">
              {!isTutorialMode && !isFirst && (
                <button
                  className="we-secondary-button"
                  onClick={goPrev}
                >
                  ← Previous
                </button>
              )}

              {!isTutorialMode && !isLast && (
                <button
                  className="we-button"
                  onClick={goNext}
                >
                  Next →
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}