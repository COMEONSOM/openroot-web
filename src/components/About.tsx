import React from "react";
import { Link } from "react-router-dom";
import "./styles/About.css";

type Accent = "blue" | "mint" | "yellow" | "coral" | "violet" | "ink";

// ─── Data ─────────────────────────────────────────────────────────────────────

const FOUNDER_LINKEDIN = "https://www.linkedin.com/in/comeonsom";

const FOCUS_AREAS: Array<{ label: string; accent: Accent }> = [
  { label: "Technology", accent: "blue" },
  { label: "AI", accent: "mint" },
  { label: "Financial Literacy", accent: "yellow" },
  { label: "MSME Enablement", accent: "coral" },
];

const IDEA_STEPS: Array<{ n: string; text: string; accent: Accent }> = [
  { n: "01", text: "Build useful systems", accent: "ink" },
  { n: "02", text: "Make learning practical", accent: "yellow" },
  { n: "03", text: "Remove barriers to growth", accent: "mint" },
];

const SOFTWARE_POINTS: Array<{
  n: string;
  title: string;
  text: string;
  accent: Accent;
}> = [
  {
    n: "01",
    title: "Business automation",
    text: "Reduce repetitive manual tasks and save time.",
    accent: "yellow",
  },
  {
    n: "02",
    title: "Custom applications and portals",
    text: "Built around the workflow instead of forcing the business to adapt to generic software.",
    accent: "mint",
  },
  {
    n: "03",
    title: "Practical, scalable architectures",
    text: "Grow with the business without unnecessary complexity.",
    accent: "coral",
  },
];

const MOTIVE_POINTS: Array<{ n: string; text: string; accent: Accent }> = [
  { n: "01", text: "Simple finance tools", accent: "blue" },
  { n: "02", text: "Powerful AI workflows", accent: "mint" },
  { n: "03", text: "In-depth practical classes", accent: "yellow" },
  { n: "04", text: "Digital systems for small businesses", accent: "violet" },
];

// ─── Small pieces ─────────────────────────────────────────────────────────────

function SectionHead({
  id,
  title,
  text,
}: {
  id: string;
  title: string;
  text: string;
}): React.JSX.Element {
  return (
    <div className="openroot-about__head">
      <h2 id={id} className="openroot-about__h2">
        {title}
      </h2>
      <p className="openroot-about__text">{text}</p>
    </div>
  );
}

function Chip({
  accent,
  children,
}: {
  accent: Accent;
  children: React.ReactNode;
}): React.JSX.Element {
  return (
    <li className={`openroot-about__chip openroot-about__chip--${accent}`}>
      {children}
    </li>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function About(): React.JSX.Element {
  return (
    <main className="openroot-about">
      {/* HERO */}
      <section className="openroot-about__hero" aria-labelledby="about-title">
        <div className="openroot-about__container openroot-about__hero-grid">
          <div className="openroot-about__hero-copy">
            <span className="openroot-about__label">About Openroot Systems</span>

            <h1 id="about-title" className="openroot-about__h1">
              Built for people,
              <span>powered by purpose.</span>
            </h1>

            <p className="openroot-about__lead">
              We build <strong>custom software solutions</strong> for MSMEs,
              Government Departments and Businesses. Beyond software,{" "}
              <strong>Openroot Systems</strong> is a platform for{" "}
              <strong>skill development and empowerment</strong>, helping
              students, working professionals and business owners become
              confident in using <strong>technology, AI and finance</strong>.
            </p>

            <ul className="openroot-about__chips" aria-label="Openroot focus areas">
              {FOCUS_AREAS.map((item) => (
                <Chip key={item.label} accent={item.accent}>
                  {item.label}
                </Chip>
              ))}
            </ul>
          </div>

          <div className="openroot-about__hero-side">
            <div className="openroot-about__idea">
              <span className="openroot-about__label openroot-about__label--on-color">
                The Openroot idea
              </span>
              <p>
                Make technology approachable, affordable and genuinely helpful
                for people and small businesses.
              </p>
            </div>

            <div className="openroot-about__steps">
              {IDEA_STEPS.map((step) => (
                <div
                  key={step.n}
                  className={`openroot-about__step openroot-about__step--${step.accent}`}
                >
                  <strong>{step.n}</strong>
                  <span>{step.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SOFTWARE AS A SERVICE */}
      <section
        id="software-solutions"
        className="openroot-about__section"
        aria-labelledby="software-title"
      >
        <div className="openroot-about__container">
          <SectionHead
            id="software-title"
            title="Digital systems built around the business."
            text="We design and build custom digital tools, web apps and automation systems for micro and small enterprises that need strong online systems at practical, sustainable pricing."
          />

          <div className="openroot-about__feature">
            <span className="openroot-about__label openroot-about__label--on-color">
              Why software as a service
            </span>
            <h3 className="openroot-about__h3">
              Practical systems with long-term value.
            </h3>
            <p>
              Our work is aimed at businesses that often do not have access to
              expensive software, in-house tech teams or complex tools, but
              still need{" "}
              <strong>reliable, long-term digital systems</strong> to grow.
            </p>
          </div>

          <div className="openroot-about__cells openroot-about__cells--3">
            {SOFTWARE_POINTS.map((point) => (
              <article key={point.n} className="openroot-about__cell">
                <span
                  className={`openroot-about__marker openroot-about__marker--${point.accent}`}
                >
                  {point.n}
                </span>
                <h4 className="openroot-about__h4">{point.title}</h4>
                <p className="openroot-about__body">{point.text}</p>
              </article>
            ))}
          </div>

          <div className="openroot-about__strip openroot-about__strip--blue">
            <span className="openroot-about__label">The standard</span>
            <p>
              Every solution is meant to be{" "}
              <strong>understandable, maintainable and genuinely helpful</strong>
              , not just impressive on paper.
            </p>
          </div>
        </div>
      </section>

      {/* TRAINING AS A SERVICE */}
      <section
        id="training-as-a-service"
        className="openroot-about__section"
        aria-labelledby="training-title"
      >
        <div className="openroot-about__container">
          <SectionHead
            id="training-title"
            title="Learn skills that actually help."
            text="Openroot Classes is our education platform: a prompt engineering and investing education initiative for students, beginners and MSMEs who want practical skills, not just theory."
          />

          <div className="openroot-about__education">
            <div className="openroot-about__lesson-lead">
              <span className="openroot-about__label openroot-about__label--on-color">
                Openroot Classes
              </span>
              <h3 className="openroot-about__h3">
                Practical knowledge without unnecessary barriers.
              </h3>
              <p>
                We believe high-quality, in-depth learning should not break the
                bank. Our programs are{" "}
                <strong>affordable, ad-free and transparent</strong>, with a
                deep focus on real-life application instead of textbook-style
                content.
              </p>

              <ul className="openroot-about__chips">
                <Chip accent="yellow">Students</Chip>
                <Chip accent="mint">Beginners</Chip>
                <Chip accent="coral">MSMEs</Chip>
              </ul>
            </div>

            <div className="openroot-about__courses">
              <article className="openroot-about__course openroot-about__course--blue">
                <span className="openroot-about__course-n">01</span>
                <div>
                  <h3 className="openroot-about__h3">Prompt Engineering</h3>
                  <p>
                    Learn how to design{" "}
                    <strong>AI workflows and automations</strong> that help with
                    content creation, data handling, business operations and
                    day-to-day productivity.
                  </p>
                </div>
              </article>

              <article className="openroot-about__course openroot-about__course--yellow">
                <span className="openroot-about__course-n">02</span>
                <div>
                  <h3 className="openroot-about__h3">Financial Investing</h3>
                  <p>
                    Understand{" "}
                    <strong>
                      wealth-building fundamentals, risk management and
                      long-term investing strategies
                    </strong>{" "}
                    so you can make confident financial decisions instead of
                    guessing or following hype.
                  </p>
                </div>
              </article>
            </div>
          </div>

          <div className="openroot-about__strip openroot-about__strip--mint">
            <span className="openroot-about__label">The goal</span>
            <p>
              Make people <strong>future-ready</strong> by combining
              technology, financial literacy and practical skill-building in
              one place.
            </p>
          </div>
        </div>
      </section>

      {/* MOTIVE */}
      <section
        id="motive"
        className="openroot-about__section"
        aria-labelledby="motive-title"
      >
        <div className="openroot-about__container">
          <SectionHead
            id="motive-title"
            title="Open new roots of opportunity."
            text="Technology should be approachable, affordable and genuinely helpful for people and small businesses."
          />

          <div className="openroot-about__motive">
            <div className="openroot-about__motive-copy">
              <span className="openroot-about__label openroot-about__label--on-color">
                Our mission
              </span>
              <h3 className="openroot-about__h3">
                Innovation should create independence, not another barrier.
              </h3>
              <p>
                Our goal is simple: make technology approachable, affordable and
                genuinely helpful for people and small businesses.
              </p>
              <p>
                Our mission is to{" "}
                <strong>
                  open new roots of innovation, opportunity and digital
                  independence
                </strong>{" "}
                for people and small businesses.
              </p>
              <p>
                Everyone deserves access to{" "}
                <strong>
                  smart technology, financial knowledge and future-ready skills
                </strong>
                , regardless of income, background or location.
              </p>
            </div>

            <div className="openroot-about__cells openroot-about__cells--list">
              {MOTIVE_POINTS.map((point) => (
                <div key={point.n} className="openroot-about__row">
                  <span
                    className={`openroot-about__marker openroot-about__marker--${point.accent}`}
                  >
                    {point.n}
                  </span>
                  <strong>{point.text}</strong>
                </div>
              ))}
            </div>
          </div>

          <div className="openroot-about__closing">
            <p>
              Whether through a simple finance tool, a powerful AI workflow or
              an in-depth class,{" "}
              <strong>Openroot exists to remove barriers</strong> and make
              growth more achievable.
            </p>
            <p className="openroot-about__closing-secondary">
              Thousands of individuals and businesses already rely on Openroot
              to stay ahead, and we are just getting started.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="openroot-about__cta" aria-labelledby="about-cta">
        <div className="openroot-about__container">
          <div className="openroot-about__cta-panel">
            <div>
              <span className="openroot-about__label">Openroot Systems</span>
              <h2 id="about-cta" className="openroot-about__h2">
                {"Let's grow together."}
              </h2>
              <p className="openroot-about__text">
                Technology, AI, finance and practical learning, brought together
                to make growth more achievable.
              </p>
            </div>

            <div className="openroot-about__cta-actions">
              <a
                className="openroot-about__button openroot-about__button--blue"
                href={FOUNDER_LINKEDIN}
                target="_blank"
                rel="noopener noreferrer"
              >
                Connect with founder
              </a>
              <Link
                className="openroot-about__button openroot-about__button--line"
                to="/software-solutions"
                onClick={() =>
                  window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior })
                }
              >
                Explore solutions
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}