import React, { useState } from "react";
import "../components/styles/GDrive.css";

import logo from "/assets/company-icon.png";
import step1Img from "/assets-gdrive/step-01.png";
import step2Img from "/assets-gdrive/step-02.png";
import step3Img from "/assets-gdrive/step-03.png";
import tutorialThumb from "/assets-gdrive/tutorial-thumb.png";

const EXTENSION_URL =
  "https://chromewebstore.google.com/detail/openroot-gdrive-automatio/pndbnlfhpjinfneglecnpgijhcaffdng";

const HOW_TO_USE_URL = "https://www.youtube.com/watch?v=2tqbwlV0aw0";

type StepKey = 0 | 1 | 2 | 3;

type StepItem = {
  number: string;
  title: string;
  button: string;
  previewImage?: string;
};

const STEPS: StepItem[] = [
  {
    number: "01",
    title: "Go to the Extension Page",
    button: "Go to Extension Page",
    previewImage: step1Img,
  },
  {
    number: "02",
    title: "Open Extensions Panel and Pin It",
    button: "Next",
    previewImage: step2Img,
  },
  {
    number: "03",
    title: "Extension Ready to Use",
    button: "Next",
    previewImage: step3Img,
  },
  {
    number: "04",
    title: "How to Use",
    button: "How to Use",
    previewImage: tutorialThumb,
  },
];

export default function WebExtensionSection(): React.JSX.Element {
  const [activeStep, setActiveStep] = useState<StepKey>(0);

  const current = STEPS[activeStep];
  const isFirst = activeStep === 0;
  const isLast = activeStep === STEPS.length - 1;

  const goNext = () => {
    if (!isLast) setActiveStep((prev) => (prev + 1) as StepKey);
  };

  const goPrev = () => {
    if (!isFirst) setActiveStep((prev) => (prev - 1) as StepKey);
  };

  const handlePrimary = () => {
    if (activeStep === 0) {
      window.open(EXTENSION_URL, "_blank", "noopener,noreferrer");
      setActiveStep(1);
      return;
    }

    if (activeStep === 3) {
      window.open(HOW_TO_USE_URL, "_blank", "noopener,noreferrer");
      return;
    }

    goNext();
  };

  const getNote = () => {
    switch (activeStep) {
      case 0:
        return "Open the extension page and click Add to Chrome.";
      case 1:
        return "Click the puzzle icon, then find the extension and pin it.";
      case 2:
        return "After pinning, the extension will appear in the Chrome toolbar.";
      case 3:
        return "Open the YouTube guide to learn how to use the extension properly.";
      default:
        return "";
    }
  };

  return (
    <section id="web-extension-section" className="we-section">
      <div className="we-container">
        <div className="we-header">
          <div className="we-brand">
            <div>
              <h2 className="we-title">Install Our Chrome Web Extension</h2>
            </div>
          </div>

          <p className="we-subtitle">
            Follow these simple steps to install and use the extension.
          </p>
        </div>

        <div className="we-grid">
          <aside className="we-step-rail">
            {STEPS.map((step, index) => (
              <button
                key={step.number}
                className={`we-step-card ${
                  index === activeStep ? "is-active" : ""
                }`}
                onClick={() => setActiveStep(index as StepKey)}
              >
                <div className="we-step-number">{step.number}</div>
                <div className="we-step-content">
                  <h4>{step.title}</h4>
                </div>
              </button>
            ))}
          </aside>

          <div className="we-action-card">
            <div className="we-action-top">
              <div className="we-action-badge">Step {current.number}</div>
              <div className="we-step-counter">
                {activeStep + 1} / 04
              </div>
            </div>

            <div className="we-preview">
              {current.previewImage && (
                <img
                  src={current.previewImage}
                  alt={current.title}
                  className="we-preview-image"
                />
              )}
            </div>

            <div className="we-toolbar">
              {!isFirst && (
                <button className="we-secondary-button" onClick={goPrev}>
                  ← Previous
                </button>
              )}

              <button className="we-button" onClick={handlePrimary}>
                {current.button}
              </button>
            </div>

            <div className="we-mini-box">{getNote()}</div>
          </div>
        </div>
      </div>
    </section>
  );
}