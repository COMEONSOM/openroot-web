// ─────────────────────────────────────────────────────────────────
// src/components/data/aboutdata.tsx
// ALL STATIC DATA FOR THE ABOUT SECTION
// .tsx REQUIRED — OFFER_CARDS CONTAIN JSX IN intro / items / note
// EDIT THIS FILE TO UPDATE CONTENT WITHOUT TOUCHING COMPONENT LOGIC
// ─────────────────────────────────────────────────────────────────

import type { OfferCard, Reason } from "../types/types";

// ── WHO WE ARE — PROOF CARDS ─────────────────────────────────────
// RENDERED AS A 2×2 GRID BELOW THE INTRO COPY
// TO ADD A CARD: PUSH A NEW { title, text } OBJECT HERE
export const PROOF_CARDS = [
  {
    title: "MSME Registered",
    text:  "Recognized under the Government of India with a registered UDYAM identity.",
  },
  {
    title: "NCS Employer",
    text:  "Connected with the National Career Service ecosystem for opportunity and growth.",
  },
  {
    title: "Custom Software",
    text:  "Practical digital systems built for MSMEs without unnecessary complexity.",
  },
  {
    title: "Skill Development",
    text:  "Learning resources designed to help students and professionals use tech with confidence.",
  },
] as const;

// ── WHO WE ARE — ORBITAL FLOATING BADGES ─────────────────────────
// DECORATIVE BADGES FLOATING AROUND THE RIGHT VISUAL PANE
// dur: ANIMATION DURATION IN SECONDS — LONGER = SLOWER + MORE DREAMY
// ORDER MAPS 1:1 WITH BADGE_POS_CLASSES IN WhoWeAre.tsx
export const ORBIT_BADGES = [
  { label: "Building Software Beyond Existing Solutions", dur: 11.5 },
  { label: "1 Year Free Maintenance", dur: 8.5 },
  { label: "Affordable Custom Software for SMEs", dur: 9.5 },
  { label: "Training & Upskilling for Students", dur: 10.5 },
] as const;

// ── WHAT WE OFFER — CAROUSEL CARDS ───────────────────────────────
// EACH ENTRY = ONE CAROUSEL SLIDE IN WhatWeOffer.tsx
// accentVar: CSS VARIABLE STRING — DRIVES LEFT STRIPE COLOR VIA CSS MODULE
// highlights: SHORT CHIPS RENDERED AS A FLEX ROW BELOW THE CARD TITLE
// items: BULLET POINTS — CAN CONTAIN INLINE JSX FOR BOLD FORMATTING
export const OFFER_CARDS: OfferCard[] = [
  {
    tag:        "Openroot Classes",
    title:      "Learn Skills That Actually Help",
    accentVar:  "var(--ot-accent-warm, #f59e0b)",
    image:     "/images/offers/openroot-classes.webp",
    highlights: ["Preminum Content","Affordable Pricing","100% Online Live Classes"],
    intro: (
      <>
        <strong className="text-accent">Openroot Classes</strong> is our
        education arm — a{" "}
        <strong className="text-accent">
          financial-literacy and investing-education initiative
        </strong>{" "}
        for{" "}
        <strong className="text-accent">students, beginners, and MSMEs</strong>{" "}
        who want practical skills, not just theory. We believe high-quality,
        in-depth learning shouldn&apos;t break the bank. That&apos;s why our
        programs are{" "}
        <strong className="text-accent">
          affordable, ad-free, and transparent
        </strong>
        , with a deep focus on real-life application instead of textbook-style
        content.
      </>
    ),
    subheading: "Our expert-led programs include:",
    items: [
      <>
        <strong className="text-accent">Prompt Engineering</strong> — Learn how
        to design{" "}
        <strong className="text-accent">AI workflows and automations</strong>{" "}
        that can help in content creation, data handling, business operations,
        and day-to-day productivity.
      </>,
      <>
        <strong className="text-accent">Financial Investing</strong> — Understand{" "}
        <strong className="text-accent">
          wealth-building fundamentals, risk management, and long-term investing
          strategies
        </strong>{" "}
        so you can make confident financial decisions instead of guessing or
        following hype.
      </>,
    ],
    note: (
      <>
        Our goal is simple — to make people{" "}
        <strong className="text-accent">future-ready</strong> by combining
        technology, financial literacy, and practical skill-building in one
        place.
      </>
    ),
  },
  {
    tag:        "Software Solutions",
    title:      "Software Built for Real-World Businesses",
    accentVar:  "var(--ot-accent-cool, #6366f1)",
    image:     "/images/offers/software-solutions.webp",
    highlights: ["Custom Built", "MSME-Focused", "Scalable", "Maintainable"],
    intro: (
      <>
        Under <strong className="text-accent">Software Solutions</strong>, we
        design and build{" "}
        <strong className="text-accent">
          custom digital tools, web apps, and automation systems
        </strong>{" "}
        for micro and small enterprises that need strong online systems at
        practical, sustainable pricing. Our work is focused on enabling
        businesses that often don&apos;t have access to expensive software,
        in-house tech teams, or complex tools — but still need{" "}
        <strong className="text-accent">reliable, long-term digital systems</strong>{" "}
        to grow.
      </>
    ),
    subheading: "We help MSMEs with:",
    items: [
      <>
        <strong className="text-accent">Business automation</strong> to reduce
        repetitive manual tasks and save time.
      </>,
      <>
        <strong className="text-accent">
          Custom applications &amp; portals
        </strong>{" "}
        built specifically for their workflows instead of forcing them to adjust
        to generic tools.
      </>,
      <>
        <strong className="text-accent">
          Practical, scalable architectures
        </strong>{" "}
        designed to grow with the business without unnecessary complexity.
      </>,
    ],
    note: (
      <>
        Every solution is meant to be{" "}
        <strong className="text-accent">
          understandable, maintainable, and truly helpful
        </strong>{" "}
        — not just impressive on paper.
      </>
    ),
  },
];

// ── WHY WE'RE IMPORTANT — REASON CARDS ───────────────────────────
// RENDERED AS A 2×2 GRID (DESKTOP) / 1-COL STACK (MOBILE)
// icon: UNICODE GLYPH INSIDE icon-pill CIRCULAR CONTAINER
// TO ADD A REASON: PUSH A NEW { icon, title, body } OBJECT HERE
export const REASONS: Reason[] = [
  {
    icon:  "✦",
    title: "User-First Always",
    body:  "No ads. No gimmicks. No dark patterns. We focus on building trust by respecting user time, data, and attention.",
  },
  {
    icon:  "◈",
    title: "Transparent & Accessible Pricing",
    body:  "High-value solutions for students and small businesses at prices that make sense for them — not just big companies.",
  },
  {
    icon:  "⬡",
    title: "Small Team, Big Impact",
    body:  "A lean, focused team that loves building tools solving concrete problems instead of chasing trends.",
  },
  {
    icon:  "◎",
    title: "Education & Empowerment",
    body:  "We don't just give tools — we teach people how to use technology, AI, and investing methods to create real change.",
  },
];