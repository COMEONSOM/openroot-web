import React from "react";
import "../components/styles/GDrive.css";

const EXTENSION_URL =
  "https://chrome.google.com/webstore/devconsole/25594eb9-458a-4de6-8040-46417ad2bce5/pndbnlfhpjinfneglecnpgijhcaffdng/edit/status";

const steps = [
  {
    number: "01",
    title: "Open the Extension Page",
    description:
      "Click the button below to open the Chrome extension page in a new tab.",
  },
  {
    number: "02",
    title: "Add to Chrome",
    description:
      "On the extension page, click the Add to Chrome button to begin installation.",
  },
  {
    number: "03",
    title: "Pin the Extension",
    description:
      "After installation, click the puzzle icon in the browser toolbar and pin the extension for quick access.",
  },
  {
    number: "04",
    title: "Start Using It",
    description:
      "Once pinned, the extension will be ready whenever you need it.",
  },
];

export default function WebExtensionSection(): React.JSX.Element {
  return (
    <section className="we-section" aria-labelledby="we-heading">
      <div className="we-container">
        <div className="we-header">
          <span className="we-eyebrow">Released Software</span>
          <h2 id="we-heading" className="we-title">
            Install Our Chrome Web Extension
          </h2>
          <p className="we-subtitle">
            Follow these simple steps to install and pin the extension in your
            browser.
          </p>
        </div>

        <div className="we-grid">
          <div className="we-steps">
            {steps.map((step) => (
              <div key={step.number} className="we-step-card">
                <div className="we-step-number">{step.number}</div>
                <div className="we-step-content">
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="we-action-card">
            <div className="we-action-badge">Chrome Extension</div>
            <h3>Open the Extension Dashboard</h3>
            <p>
              Click below to navigate to the extension page and continue the
              installation process.
            </p>

            <a
              href={EXTENSION_URL}
              target="_blank"
              rel="noreferrer"
              className="we-button"
            >
              Go to Extension Page
            </a>

            <div className="we-note">
              Tip: after installation, use the puzzle icon in Chrome to pin the
              extension.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}