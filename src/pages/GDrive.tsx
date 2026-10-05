import React, { useState } from "react";

import "../components/styles/GDrive.css";

import step1Img from "/assets-gdrive/step-01.png";
import step2Img from "/assets-gdrive/step-02.png";
import step3Img from "/assets-gdrive/step-03.png";
import tutorialThumb from "/assets-gdrive/tutorial-thumb.png";

type Accent = "blue" | "mint" | "yellow" | "coral" | "violet" | "ink";

// ─── Links ────────────────────────────────────────────────────────────────────

const EXTENSION_URL =
  "https://chromewebstore.google.com/detail/openroot-gdrive-automatio/pndbnlfhpjinfneglecnpgijhcaffdng";

const HOW_TO_USE_URL = "https://www.youtube.com/watch?v=2tqbwlV0aw0";

// ─── Data ─────────────────────────────────────────────────────────────────────

type Item = {
  marker: string;
  badge: string;
  title: string;
  short: string;
  note: string;
  image: string;
  accent: Accent;
  button?: string;
};

// The first three items are the install steps; the last one is the tutorial.
const ITEMS: Item[] = [
  {
    marker: "01",
    badge: "Step 01",
    title: "Go to the extension page",
    short: "Open the official Chrome Web Store page.",
    note: "After opening the page, click Add to Chrome to begin installation.",
    image: step1Img,
    accent: "blue",
    button: "Go to extension page",
  },
  {
    marker: "02",
    badge: "Step 02",
    title: "Open the Extensions panel and pin it",
    short:
      "Open the Extensions panel from the Chrome toolbar and pin the extension for quick access.",
    note: "Pinned extensions stay visible in the toolbar so you can use them anytime.",
    image: step2Img,
    accent: "mint",
  },
  {
    marker: "03",
    badge: "Step 03",
    title: "Extension ready to use",
    short:
      "After pinning, the extension is available directly from your browser toolbar.",
    note: "You can start using the extension right away.",
    image: step3Img,
    accent: "yellow",
  },
  {
    marker: "▶",
    badge: "How to use",
    title: "How to use",
    short: "Select the preview image to open the tutorial video in a new tab.",
    note: "The preview image works as the tutorial link.",
    image: tutorialThumb,
    accent: "coral",
  },
];

const TUTORIAL_INDEX = ITEMS.length - 1;

// ─── Component ────────────────────────────────────────────────────────────────

export default function WebExtensionSection(): React.JSX.Element {
  const [index, setIndex] = useState(0);

  const item = ITEMS[index];
  const isTutorial = index === TUTORIAL_INDEX;
  const isFirst = index === 0;
  const isLast = index === TUTORIAL_INDEX;
  const progress = ((index + 1) / ITEMS.length) * 100;

  const openExtensionPage = () => {
    window.open(EXTENSION_URL, "_blank", "noopener,noreferrer");
    setIndex(1);
  };

  const goNext = () => setIndex((i) => Math.min(i + 1, TUTORIAL_INDEX));
  const goPrev = () => setIndex((i) => Math.max(i - 1, 0));

  return (
    <section
      id="web-extension-section"
      className="openroot-gdrive"
      aria-labelledby="gdrive-title"
    >
      <div className="openroot-gdrive__container">
        {/* HEAD */}
        <div className="openroot-gdrive__head">
          <div>
            <span className="openroot-gdrive__label">Chrome extension</span>
            <h2 id="gdrive-title" className="openroot-gdrive__h2">
              Install and start using the extension.
            </h2>
          </div>
          <p className="openroot-gdrive__text">
            Follow the guided setup to install the extension, pin it to your
            toolbar and learn how to use it. It takes about a minute.
          </p>
        </div>

        {/* MAIN */}
        <div className="openroot-gdrive__grid">
          {/* RAIL */}
          <aside className="openroot-gdrive__rail" aria-label="Setup steps">
            <div className="openroot-gdrive__progress">
              <div className="openroot-gdrive__progress-top">
                <span>Setup progress</span>
                <span>
                  {index + 1} / {ITEMS.length}
                </span>
              </div>
              <div
                className="openroot-gdrive__bar"
                role="progressbar"
                aria-valuemin={1}
                aria-valuemax={ITEMS.length}
                aria-valuenow={index + 1}
                aria-label="Setup progress"
              >
                <div
                  className={`openroot-gdrive__bar-fill openroot-gdrive__bar-fill--${item.accent}`}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <ol className="openroot-gdrive__steps">
              {ITEMS.map((entry, i) => (
                <li key={entry.marker}>
                  <button
                    type="button"
                    className={`openroot-gdrive__step ${
                      i === index ? "is-active" : ""
                    }`}
                    onClick={() => setIndex(i)}
                    aria-current={i === index ? "step" : undefined}
                  >
                    <span
                      className={`openroot-gdrive__marker openroot-gdrive__marker--${entry.accent}`}
                    >
                      {entry.marker}
                    </span>
                    <span className="openroot-gdrive__step-title">
                      {entry.title}
                    </span>
                  </button>
                </li>
              ))}
            </ol>

            <p className="openroot-gdrive__note">{item.note}</p>
          </aside>

          {/* PANEL */}
          <div className="openroot-gdrive__panel">
            <div
              className={`openroot-gdrive__panel-head openroot-gdrive__panel-head--${item.accent}`}
            >
              <span className="openroot-gdrive__badge">{item.badge}</span>
              <span className="openroot-gdrive__counter">
                {isTutorial ? "Tutorial preview" : `${index + 1} / ${ITEMS.length}`}
              </span>
            </div>

            <div className="openroot-gdrive__panel-body">
              <div className="openroot-gdrive__preview">
                {isTutorial ? (
                  <a
                    href={HOW_TO_USE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="openroot-gdrive__preview-link"
                    aria-label="Open tutorial video in a new tab"
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="openroot-gdrive__img"
                    />
                    <span className="openroot-gdrive__play" aria-hidden="true" />
                  </a>
                ) : (
                  <img
                    src={item.image}
                    alt={item.title}
                    className="openroot-gdrive__img"
                  />
                )}
              </div>

              <h3 className="openroot-gdrive__h3">{item.title}</h3>
              <p className="openroot-gdrive__body">{item.short}</p>

              {item.button && (
                <button
                  type="button"
                  className="openroot-gdrive__button openroot-gdrive__button--blue"
                  onClick={openExtensionPage}
                >
                  {item.button}
                </button>
              )}
            </div>

            <div className="openroot-gdrive__nav">
              <button
                type="button"
                className="openroot-gdrive__button openroot-gdrive__button--line"
                onClick={goPrev}
                disabled={isFirst}
              >
                Previous
              </button>
              <button
                type="button"
                className="openroot-gdrive__button openroot-gdrive__button--ink"
                onClick={goNext}
                disabled={isLast}
              >
                {index === TUTORIAL_INDEX - 1 ? "How to use" : "Next"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}