import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

/* ============================================================
   DATA  (edit copy here, the layout renders from these arrays)
   ============================================================ */

type Tone = "yellow" | "coral" | "mint" | "blue" | "ink";

type Entry = {
  year: string;
  span: string;
  tone: Tone;
  title: string;
  org: string;
  text: string;
  tag: string;
};

const PROFILE = {
  name: "Somnath Banerjee",
  firstName: "Somnath",
  lastName: "Banerjee",
  location: "Kolkata, West Bengal, India",
  linkedin: "https://www.linkedin.com/in/comeonsom",
  website: "https://openroot.in",
  portrait: "/assets/founder-openroot.avif",
};

const NAV_LINKS: Array<{ id: string; label: string }> = [
  { id: "journey", label: "Journey" },
  { id: "build", label: "Build" },
  { id: "edge", label: "The edge" },
  { id: "contact", label: "Contact" },
];

const DOMAINS: Array<{ tone: Tone; label: string }> = [
  { tone: "yellow", label: "Education & empowerment" },
  { tone: "coral", label: "Industrial management" },
  { tone: "mint", label: "Technology & analytics" },
  { tone: "blue", label: "Finance & strategy" },
];

const EDUCATION: Entry[] = [
  {
    year: "2026",
    span: "Jul to 2028",
    tone: "blue",
    title: "MBA, Finance & Operations",
    org: "University of Calcutta",
    text: "Pursuing postgraduate management education with a focus on finance, operations and business strategy.",
    tag: "In progress",
  },
  {
    year: "2023",
    span: "to 2026",
    tone: "mint",
    title: "B.Tech, Computer Science",
    org: "MAKAUT, West Bengal (formerly WBUT)",
    text: "Completed an engineering degree in computer science, moving the profile from field measurement into software and technology.",
    tag: "Completed",
  },
  {
    year: "2020",
    span: "to 2023",
    tone: "yellow",
    title: "Technical Diploma, Surveying Engineering",
    org: "WBSCT&VE&SD",
    text: "Completed technical training in surveying engineering with a grade of 8.9, building the foundation in precision and fieldwork.",
    tag: "Grade 8.9",
  },
];

const EXPERIENCE: Entry[] = [
  {
    year: "2026",
    span: "Mar to present",
    tone: "mint",
    title: "Founder",
    org: "Openroot Systems · Kolkata",
    text: "Heads the company end to end. Delivers custom build softwares to automate processes, upskilling students and professionals with latest technologies for a better educated and empowered workforce.",
    tag: "Early-Stage Venture",
  },
  {
    year: "2025",
    span: "Mar to Feb 2026",
    tone: "coral",
    title: "Geomatics Division",
    org: "CMPDI, Coal India Limited · Ranchi",
    text: "Worked in the Geomatics Division of a Coal India subsidiary, applying surveying and geomatics expertise in a large industrial environment.",
    tag: "On-site Training",
  },
  {
    year: "2024",
    span: "Aug to Dec",
    tone: "yellow",
    title: "Instructor, Survey Department",
    org: "Govt. ITI · Tehatta-II, West Bengal",
    text: "Provided structured technical instruction and practical guidance to students in the Survey Department, supporting their academic learning and development of industry-relevant skills.",
    tag: "Full-time",
  },
  {
    year: "2022",
    span: "Jul to Aug",
    tone: "coral",
    title: "Intern, Supply Chain Operation",
    org: "Flipkart · Haringhata, West Bengal",
    text: "Managed workflow and manpower deployment. Developed team management skills and a working knowledge of professional ethics.",
    tag: "Internship",
  },
];

const ACHIEVEMENTS: Entry[] = [
  {
    year: "2026",
    span: "Mar",
    tone: "mint",
    title: "Google Analytics Certified",
    org: "Skillshop · Credential ID 176684373 · valid through Mar 2027",
    text: "Holds a current professional certification, establishing analytics as a verified competency.",
    tag: "Certification",
  },
];

const GROUPS: Array<{ title: string; entries: Entry[] }> = [
  { title: "Educational qualification", entries: EDUCATION },
  { title: "Professional experience", entries: EXPERIENCE },
  { title: "Achievements", entries: ACHIEVEMENTS },
];

const SERVICES = [
  { title: "System automation", text: "Improve efficiency with intelligent system automation solutions." },
  { title: "Upskilling with new technologies", text: "Learn beyond traditional syllabuses with innovative teaching that prepares you for tomorrow’s opportunities." },
];

const WORK: Array<{ tone: Tone; title: string; text: string; tag: string }> = [
  {
    tone: "ink",
    title: "Google drive automation system",
    text: "A system for automating file naming inside Google Drive.",
    tag: "Web extension",
  },
  {
    tone: "mint",
    title: "Mehek",
    text: "An offline voice AI assistant that runs as a companion.",
    tag: "AI",
  },
  {
    tone: "yellow",
    title: "Travel expense manager",
    text: "Practical, situation-based React software to manage, distribute and track all travelling expenses, with a patented architecture.",
    tag: "Web appilication",
  },
];

const EDGE: Array<{ tone: Tone; title: string; text: string }> = [
  { tone: "mint", title: "Technology", text: "B.Tech in Computer Science and a company that ships web products." },
  { tone: "mint", title: "Analytics", text: "Google Analytics Certified, so decisions start from data." },
  { tone: "mint", title: "AI", text: "Part of how I build, from voice assistants to smarter products." },
  { tone: "coral", title: "Operations", text: "Workflow and manpower experience, now studied formally." },
  { tone: "blue", title: "Finance", text: "MBA specialisation in Finance & Operations." },
  { tone: "blue", title: "Strategy", text: "Where the other five meet, and where I'm heading." },
];

/* ============================================================
   STYLES  (scoped under .fp)
   ============================================================ */

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,700;12..96,800&family=Inter:wght@400;500;600&display=swap');

  @property --h { syntax: "<number>"; inherits: false; initial-value: 1; }

  .fp {
    all: initial;
    display: block;
    position: relative;
    width: 100%;
    max-width: none;
    min-width: 0;
    min-height: 100vh;
    overflow-x: clip;
    isolation: isolate;
    --yellow: #FFC72C;
    --coral: #FF6B4A;
    --mint: #35D3A1;
    --blue: #4169E1;
    --ink: #0F1218;

    --bg: #F2F4F8;
    --fg: #0F1218;
    --fg-2: rgba(15,18,24,.72);
    --fg-3: rgba(15,18,24,.52);
    --card: #FFFFFF;
    --line: rgba(15,18,24,.12);
    --nav: rgba(242,244,248,.92);
    --max: 1200px;
    --ease: cubic-bezier(.16, 1, .3, 1);
    background: var(--bg);
    color: var(--fg);
    font-family: "Inter", system-ui, sans-serif;
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
  }

  
  .fp *, .fp *::before, .fp *::after {
    box-sizing: border-box;
  }

  .fp :where(p, h1, h2, h3, ul, ol, li, article, button, a) {
    margin: 0;
  }

  .fp :where(p, li) {
    max-width: none;
  }
  .fp a { color: inherit; text-decoration: none; }
  .fp button { font: inherit; color: inherit; background: none; border: 0; cursor: pointer; }
  .fp ul, .fp ol { list-style: none; }
  .fp :focus-visible { outline: 3px solid var(--blue); outline-offset: 3px; }
  .fp h1, .fp h2, .fp h3 { font-family: "Bricolage Grotesque", sans-serif; letter-spacing: -.03em; line-height: 1.02; }

  .fp .wrap {
    width: min(var(--max), calc(100% - 2.5rem));
    max-width: var(--max);
    min-width: 0;
    margin-inline: auto;
  }
  .fp section { padding: clamp(3.5rem, 8vw, 6.5rem) 0; scroll-margin-top: 5.5rem; }

  .fp .c-yellow { background: var(--yellow); color: var(--ink); }
  .fp .c-coral  { background: var(--coral);  color: var(--ink); }
  .fp .c-mint   { background: var(--mint);   color: var(--ink); }
  .fp .c-blue   { background: var(--blue);   color: #fff; }
  .fp .c-ink    { background: var(--ink);    color: #fff; }

  /* NAV */
  .fp .nav { position: sticky; top: 0; z-index: 50; background: var(--nav); backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px); border-bottom: 1px solid var(--line); }
  .fp .nav-row { display: flex; align-items: center; justify-content: space-between; gap: 1rem; padding: .8rem 0; }
  .fp .brand { font-family: "Bricolage Grotesque", sans-serif; font-weight: 800; font-size: 1.4rem; letter-spacing: -.04em; display: flex; align-items: center; gap: .55rem; }
  .fp .brand i { width: 14px; height: 14px; background: var(--blue); display: inline-block; border-radius: 3px; }
  .fp .nav-links { display: flex; gap: 1.6rem; font-size: .92rem; font-weight: 500; color: var(--fg-2); }
  .fp .nav-links a { padding: .3rem 0; border-bottom: 2px solid transparent; }
  .fp .nav-links a:hover { color: var(--fg); border-bottom-color: var(--fg); }
  .fp .nav-links a.active { color: var(--fg); border-bottom-color: var(--fg); }
  .fp .nav-scroll { display: none; }
  .fp .progress { position: absolute; left: 0; right: 0; bottom: -1px; height: 3px; background: var(--blue); transform-origin: left center; transform: scaleX(var(--p, 0)); }

  .fp .btn { display: inline-flex; align-items: center; justify-content: center; min-height: 48px; padding: .75rem 1.4rem; border-radius: 12px; font-weight: 600; font-size: .95rem; border: 2px solid transparent; text-align: center; transition: transform .25s var(--ease), opacity .2s ease; }
  .fp .btn-blue { background: var(--blue); color: #fff; }
  .fp .btn-ink { background: var(--ink); color: #fff; }
  .fp .btn-line { border-color: var(--fg); color: var(--fg); background: transparent; }
  .fp .btn-white { background: #fff; color: var(--ink); }
  .fp .btn:hover { opacity: .9; }
  .fp .btn:active { transform: scale(.97); }
  @media (hover: hover) { .fp .btn:hover { transform: scale(1.03); } }
  .fp .nav .btn { min-height: 40px; padding: .45rem 1.1rem; }

  /* HERO */
  .fp .hero { padding-top: clamp(2.5rem, 6vw, 5rem); }
  .fp .hero-grid { display: grid; grid-template-columns: minmax(0, 1.2fr) minmax(0, .8fr); gap: clamp(2rem, 5vw, 4.5rem); align-items: center; }
  .fp h1 { font-weight: 800; font-size: clamp(3rem, 12.5vw, 7.2rem); line-height: .92; letter-spacing: -.055em; }
  .fp h1 span { display: block; }
  .fp .role { margin-top: 1.4rem; font-family: "Bricolage Grotesque", sans-serif; font-weight: 700; font-size: clamp(1.35rem, 2.6vw, 2rem); letter-spacing: -.03em; }
  .fp .role b { background: var(--blue); color: #fff; padding: .05em .4em; border-radius: 8px; font-weight: 700; white-space: nowrap; }
  .fp .bio { margin-top: 1.1rem; max-width: 36rem; color: var(--fg-2); font-size: clamp(1.02rem, 1.5vw, 1.15rem); }
  .fp .hero-cta { display: flex; flex-wrap: wrap; gap: .7rem; margin-top: 1.8rem; }

  .fp .photo-stack { position: relative; width: min(100%, 430px); justify-self: end; padding: 0 0 1.4rem 1.4rem; }
  .fp .photo-stack::before { content: ""; position: absolute; left: 0; bottom: 0; width: 78%; height: 78%; background: var(--yellow); border-radius: 28px; }
  .fp .photo { position: relative; aspect-ratio: 4 / 5; border-radius: 28px; background: var(--blue); display: grid; place-items: center; overflow: hidden; }
  .fp .photo span { font-family: "Bricolage Grotesque", sans-serif; font-weight: 800; font-size: clamp(5rem, 16vw, 8rem); color: rgba(255,255,255,.9); letter-spacing: -.06em; }
  .fp .photo img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; display: block; }

  .fp .now { margin-top: clamp(2.5rem, 5vw, 4rem); display: grid; grid-template-columns: 1.1fr 1fr; gap: .8rem; }
  .fp .now-card { border-radius: 24px; padding: clamp(1.4rem, 3vw, 2.2rem); display: flex; flex-direction: column; justify-content: space-between; gap: 2rem; min-height: 190px; }
  .fp .now-card small { font-size: .85rem; font-weight: 600; opacity: .8; }
  .fp .now-card h2 { margin-top: .5rem; font-size: clamp(1.7rem, 3.4vw, 2.8rem); }
  .fp .now-card p { margin-top: .5rem; opacity: .85; }

  .fp .legend { margin-top: 1.4rem; display: flex; flex-wrap: wrap; gap: .5rem; align-items: center; font-size: .85rem; color: var(--fg-2); }
  .fp .legend b { font-weight: 600; color: var(--fg); margin-right: .4rem; }
  .fp .pill { display: inline-flex; align-items: center; padding: .35rem .8rem; border-radius: 999px; font-weight: 500; }

  /* SECTION HEAD */
  .fp .head { display: grid; grid-template-columns: minmax(0, 1.3fr) minmax(0, 1fr); gap: 2rem; align-items: end; margin-bottom: clamp(2rem, 5vw, 3.5rem); }
  .fp .head h2 { font-size: clamp(2.2rem, 5.4vw, 4.4rem); font-weight: 800; }
  .fp .head p { color: var(--fg-2); max-width: 32rem; justify-self: end; }

  /* TIMELINE */
  .fp .group + .group { margin-top: clamp(2.8rem, 6vw, 4.5rem); }
  .fp .sub { display: flex; flex-wrap: wrap; align-items: baseline; justify-content: space-between; gap: .4rem 1rem; margin-bottom: 1.1rem; padding-bottom: .9rem; border-bottom: 2px solid var(--fg); font-size: clamp(1.4rem, 2.6vw, 2rem); }
  .fp .sub span { font-family: "Inter", sans-serif; font-size: .85rem; font-weight: 500; letter-spacing: 0; color: var(--fg-3); }
  .fp .tl {
    width: 100%;
    min-width: 0;
    display: grid;
    gap: .8rem;
  }
  .fp .tl-row {
    width: 100%;
    min-width: 0;
    display: grid;
    grid-template-columns: 150px minmax(0, 1fr);
    gap: 1.4rem;
    align-items: stretch;
  }
  .fp .tl-date { padding-top: 1.5rem; }
  .fp .tl-date strong { display: block; font-family: "Bricolage Grotesque", sans-serif; font-size: 1.6rem; letter-spacing: -.03em; line-height: 1; }
  .fp .tl-date span { display: block; margin-top: .35rem; color: var(--fg-3); font-size: .82rem; }
  .fp .tl-card {
    width: 100%;
    min-width: 0;
    border-radius: 22px;
    padding: 1.5rem 1.7rem;
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    gap: 1rem 2rem;
    align-items: start;
  }
  .fp .tl-card h3 { font-size: clamp(1.3rem, 2.2vw, 1.8rem); }
  .fp .tl-card .org { margin-top: .35rem; font-weight: 500; opacity: .85; }
  .fp .tl-card p { margin-top: .7rem; opacity: .85; max-width: 38rem; font-size: .96rem; }
  .fp .tag { display: inline-block; padding: .3rem .7rem; border-radius: 999px; background: var(--ink); color: #fff; font-size: .75rem; font-weight: 600; white-space: nowrap; }
  .fp .c-ink .tag { background: #fff; color: var(--ink); }

  /* BUILD */
  .fp .build {
    width: 100%;
    min-width: 0;
    display: grid;
    grid-template-columns: minmax(0, 1.15fr) minmax(0, .85fr);
    gap: .8rem;
  }

  .fp .build > * {
    min-width: 0;
  }
  .fp .big { border-radius: 28px; padding: clamp(1.8rem, 4vw, 3rem); display: flex; flex-direction: column; justify-content: space-between; gap: 2.5rem; }
  .fp .big h3 { font-size: clamp(2rem, 4.2vw, 3.6rem); }
  .fp .big p { margin-top: 1rem; max-width: 32rem; opacity: .9; font-size: 1.05rem; }
  .fp .svc { display: grid; gap: .8rem; }
  .fp .svc-item { border-radius: 22px; padding: 1.5rem 1.7rem; background: var(--card); border: 1px solid var(--line); }
  .fp .svc-item h3 { font-size: 1.35rem; }
  .fp .svc-item p { margin-top: .4rem; color: var(--fg-2); font-size: .95rem; }
  .fp .svc-item:nth-child(1) { border-top: 6px solid var(--blue); }
  .fp .svc-item:nth-child(2) { border-top: 6px solid var(--mint); }
  .fp .svc-item:nth-child(3) { border-top: 6px solid var(--yellow); }
  .fp .work {
    width: 100%;
    min-width: 0;
    margin-top: .8rem;
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: .8rem;
  }

  .fp .work-card {
    min-width: 0;
  }
  .fp .work-card { border-radius: 22px; padding: 1.6rem; min-height: 230px; display: flex; flex-direction: column; justify-content: space-between; gap: 1.5rem; }
  .fp .work-card h3 { font-size: 1.5rem; }
  .fp .work-card p { margin-top: .5rem; opacity: .85; font-size: .94rem; }
  .fp .work-card .tag-wrap { display: block; }

  /* EDGE */
  .fp .edge { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: .8rem; }
  .fp .edge-tile { border-radius: 22px; padding: 1.5rem; min-height: 190px; display: flex; flex-direction: column; justify-content: space-between; gap: 1.2rem; }
  .fp .edge-tile h3 { font-size: 1.6rem; }
  .fp .edge-tile p { font-size: .94rem; opacity: .88; }
  .fp .edge-base { margin-top: .8rem; border-radius: 22px; padding: 1.3rem 1.7rem; display: flex; flex-wrap: wrap; gap: .4rem 1.5rem; align-items: center; justify-content: space-between; }
  .fp .edge-base b { font-family: "Bricolage Grotesque", sans-serif; font-size: 1.3rem; letter-spacing: -.02em; }

  /* CONTACT */
  .fp .contact { border-radius: 32px; padding: clamp(2rem, 6vw, 4.5rem); display: grid; grid-template-columns: minmax(0, 1.3fr) minmax(0, .7fr); gap: 2.5rem; align-items: end; }
  .fp .contact h2 { font-size: clamp(2.4rem, 6.6vw, 5.6rem); font-weight: 800; letter-spacing: -.05em; line-height: .95; }
  .fp .contact p { margin-top: 1.2rem; max-width: 30rem; opacity: .9; }
  .fp .contact-actions { display: grid; gap: .7rem; }

  .fp footer { padding: 1.8rem 0 2.6rem; border-top: 1px solid var(--line); color: var(--fg-3); font-size: .85rem; }
  .fp .foot { display: flex; justify-content: space-between; flex-wrap: wrap; gap: 1rem; }

  /* RESPONSIVE */
  @media (max-width: 980px) {
    .fp .hero-grid, .fp .build, .fp .contact, .fp .head { grid-template-columns: 1fr; }
    .fp .head p { justify-self: start; }
    .fp .photo-stack { justify-self: start; width: min(100%, 360px); }
    .fp .edge { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .fp .work { grid-template-columns: 1fr; }
    .fp .work-card { min-height: 0; }
  }
  @media (max-width: 760px) {
    .fp .nav-links { display: none; }
    .fp .nav-scroll { display: flex; gap: .4rem; overflow-x: auto; padding: 0 0 .7rem; scrollbar-width: none; }
    .fp .nav-scroll::-webkit-scrollbar { display: none; }
    .fp .nav-scroll a { flex: 0 0 auto; padding: .4rem .9rem; border-radius: 999px; border: 1px solid var(--line); background: var(--card); font-size: .85rem; font-weight: 500; }
    .fp .nav-scroll a.active { background: var(--fg); color: var(--bg); border-color: var(--fg); }
    .fp .now { grid-template-columns: 1fr; }
    .fp .tl-row { grid-template-columns: 1fr; gap: .5rem; }
    .fp .tl-date { padding-top: .6rem; display: flex; align-items: baseline; gap: .8rem; }
    .fp .tl-date span { margin-top: 0; }
    .fp .tl-card { grid-template-columns: 1fr; padding: 1.3rem; }
  }
  @media (max-width: 520px) {
    .fp .wrap { width: calc(100% - 2rem); }
    .fp .edge { grid-template-columns: 1fr; }
    .fp .edge-tile { min-height: 0; }
    .fp .hero-cta .btn { width: 100%; }
    .fp .photo-stack { padding: 0 0 1rem 1rem; }
  }

  /* MOTION: scroll-linked zoom in / zoom out */
  .fp.motion [data-zoom] {
    transform: scale(calc(var(--s, 1) * var(--h, 1)));
    transform-origin: 50% 50%;
    transition: --h .35s var(--ease);
    will-change: transform, opacity;
  }
  .fp.motion .hero-grid > div:first-child,
  .fp.motion .head,
  .fp.motion .sub { transform-origin: 0% 50%; }

  @media (hover: hover) {
    .fp.motion .tl-row:hover, .fp.motion .work-card:hover, .fp.motion .svc-item:hover { --h: 1.015; }
    .fp.motion .edge-tile:hover, .fp.motion .now-card:hover { --h: 1.025; }
  }

  @keyframes fp-zin { from { opacity: 0; transform: scale(.9) translateY(16px); } to { opacity: 1; transform: none; } }
  @keyframes fp-photo { from { opacity: 0; transform: scale(.88); } to { opacity: 1; transform: none; } }
  .fp.motion h1 span, .fp.motion .role, .fp.motion .bio, .fp.motion .hero-cta { animation: fp-zin .95s var(--ease) both; transform-origin: 0% 50%; }
  .fp.motion h1 span:nth-child(2) { animation-delay: .1s; }
  .fp.motion .role { animation-delay: .22s; }
  .fp.motion .bio { animation-delay: .32s; }
  .fp.motion .hero-cta { animation-delay: .42s; }
  .fp.motion .photo { animation: fp-photo 1.2s var(--ease) .15s both; }

  @media (prefers-reduced-motion: reduce) {
    .fp .progress { display: none; }
  }
`;

/* ============================================================
   HOOKS
   ============================================================ */

const clamp = (v: number, a: number, b: number): number => Math.min(b, Math.max(a, v));

function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState<boolean>(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return reduced;
}

/** Scroll-linked zoom: items scale up and fade in toward the viewport centre, and ease out as they leave. */
function useScrollZoom(
  rootRef: React.RefObject<HTMLDivElement | null>,
  barRef: React.RefObject<HTMLDivElement | null>,
  enabled: boolean
): void {
  useEffect(() => {
    const root = rootRef.current;
    if (!root || !enabled) return undefined;

    const items = Array.from(root.querySelectorAll<HTMLElement>("[data-zoom]"));
    const visible = new Set<HTMLElement>();
    let raf = 0;
    let ticking = false;

    const update = () => {
      ticking = false;
      const vh = window.innerHeight;

      visible.forEach((el) => {
        const r = el.getBoundingClientRect();
        const d = (r.top + r.height / 2 - vh / 2) / (vh / 2 + r.height / 2);
        const t = clamp(Math.abs(d), 0, 1);
        const e = t * t; // flat near the middle, eases toward the edges
        el.style.setProperty("--s", (1 - 0.08 * e).toFixed(4));
        el.style.opacity = (1 - 0.7 * e).toFixed(3);
      });

      const bar = barRef.current;
      if (bar) {
        const max = document.documentElement.scrollHeight - vh;
        bar.style.setProperty("--p", max > 0 ? clamp(window.scrollY / max, 0, 1).toFixed(4) : "0");
      }
    };

    const request = () => {
      if (ticking) return;
      ticking = true;
      raf = requestAnimationFrame(update);
    };

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const el = entry.target as HTMLElement;
          if (entry.isIntersecting) visible.add(el);
          else visible.delete(el);
        });
        request();
      },
      { rootMargin: "10% 0px" }
    );

    items.forEach((el) => io.observe(el));
    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", request);
    request();

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("scroll", request);
      window.removeEventListener("resize", request);
      items.forEach((el) => {
        el.style.removeProperty("--s");
        el.style.removeProperty("opacity");
      });
    };
  }, [rootRef, barRef, enabled]);
}

function useActiveSection(
  ids: string[],
  rootRef?: React.RefObject<HTMLElement | null>
): string {
  const [active, setActive] = useState("");
  const key = ids.join("|");

  useEffect(() => {
    const scope = rootRef?.current;
    const targets = key
      .split("|")
      .map((id) => scope?.querySelector<HTMLElement>(`#${id}`) ?? document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );

    targets.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [key, rootRef]);

  return active;
}

/* ============================================================
   SMALL COMPONENTS
   ============================================================ */

const reducedNow = (): boolean => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function scrollToId(id: string, scope?: ParentNode): void {
  if (id === "top") {
    window.scrollTo({ top: 0, behavior: reducedNow() ? "auto" : "smooth" });
    return;
  }

  const el = scope?.querySelector<HTMLElement>(`#${id}`) ?? document.getElementById(id);
  if (!el) return;

  el.scrollIntoView({
    behavior: reducedNow() ? "auto" : "smooth",
    block: "start",
  });
}

function AnchorLink({
  id,
  className,
  children,
  current,
}: {
  id: string;
  className?: string;
  children: React.ReactNode;
  current?: boolean;
}) {
  return (
    <a
      href={`#${id}`}
      className={className}
      aria-current={current ? "true" : undefined}
      onClick={(e) => {
        e.preventDefault();
        scrollToId(id, e.currentTarget.getRootNode() as ParentNode);
      }}
    >
      {children}
    </a>
  );
}

function TimelineRow({ entry }: { entry: Entry }) {
  return (
    <li className="tl-row" data-zoom>
      <div className="tl-date">
        <strong>{entry.year}</strong>
        <span>{entry.span}</span>
      </div>
      <article className={`tl-card c-${entry.tone}`}>
        <div>
          <h3>{entry.title}</h3>
          <div className="org">{entry.org}</div>
          <p>{entry.text}</p>
        </div>
        <span className="tag">{entry.tag}</span>
      </article>
    </li>
  );
}

function SectionHead({ id, title, text }: { id: string; title: string; text: string }) {
  return (
    <div className="head" data-zoom>
      <h2 id={id}>{title}</h2>
      <p>{text}</p>
    </div>
  );
}

/* ============================================================
   PAGE
   ============================================================ */

function FounderPortfolioContent(): React.JSX.Element {
  const reduced = useReducedMotion();
  const motion = !reduced;

  const rootRef = useRef<HTMLDivElement | null>(null);
  const barRef = useRef<HTMLDivElement | null>(null);
  const stripRef = useRef<HTMLElement | null>(null);

  const [imgFailed, setImgFailed] = useState(false);

  useScrollZoom(rootRef, barRef, motion);
  const active = useActiveSection(NAV_LINKS.map((l) => l.id), rootRef);

  // keep the active pill visible in the mobile nav strip
  useEffect(() => {
    const strip = stripRef.current;
    if (!strip || !active) return;
    const link = strip.querySelector<HTMLElement>(`a[href="#${active}"]`);
    if (!link) return;
    strip.scrollTo({
      left: link.offsetLeft - strip.clientWidth / 2 + link.clientWidth / 2,
      behavior: reducedNow() ? "auto" : "smooth",
    });
  }, [active]);

  return (
    <div ref={rootRef} className={`fp ${motion ? "motion" : ""}`}>
      <style>{CSS}</style>

      {/* NAV */}
      <header className="nav">
        <div ref={barRef} className="progress" aria-hidden="true" />
        <div className="wrap">
          <div className="nav-row">
            <AnchorLink id="top" className="brand">
              <i />
              {PROFILE.name}
            </AnchorLink>

            <nav className="nav-links" aria-label="Primary">
              {NAV_LINKS.map((l) => (
                <AnchorLink key={l.id} id={l.id} className={active === l.id ? "active" : ""} current={active === l.id}>
                  {l.label}
                </AnchorLink>
              ))}
            </nav>

            <a
              className="btn btn-blue"
              href={PROFILE.linkedin}
              target="_blank"
              rel="noopener noreferrer"
            >
              Connect
            </a>
          </div>

          <nav ref={stripRef} className="nav-scroll" aria-label="Sections">
            {NAV_LINKS.map((l) => (
              <AnchorLink key={l.id} id={l.id} className={active === l.id ? "active" : ""} current={active === l.id}>
                {l.label}
              </AnchorLink>
            ))}
          </nav>
        </div>
      </header>

      <main id="top">
        {/* HERO */}
        <section className="hero" aria-label="Introduction">
          <div className="wrap">
            <div className="hero-grid">
              <div data-zoom>
                <h1 aria-label={PROFILE.name}>
                  <span>{PROFILE.firstName}</span>
                  <span>{PROFILE.lastName}</span>
                </h1>
                <p className="role">
                  Founder, <b>Openroot Systems</b>
                </p>
                <p className="bio">
                  I believe in building with purpose, turning ideas into things people can truly use. Through Openroot Systems, I’m creating, learning, and exploring better ways of doing things. Alongside this, I’m pursuing an MBA in Finance & Operations at the University of Calcutta. I’m still learning and building, but I believe meaningful work speaks for itself.

                </p>
                <div className="hero-cta">
                  <a
                    className="btn btn-blue"
                    href={PROFILE.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Start a conversation
                  </a>
                  <AnchorLink id="journey" className="btn btn-line">
                    See the journey
                  </AnchorLink>
                </div>
              </div>

              <div className="photo-stack" data-zoom>
                <div className="photo">
                  {imgFailed ? (
                    <span aria-hidden="true">SB</span>
                  ) : (
                    <img
                      src={PROFILE.portrait}
                      alt={`Portrait of ${PROFILE.name}`}
                      loading="eager"
                      onError={() => setImgFailed(true)}
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="now">
              <div className="now-card c-ink" data-zoom>
                <div>
                  <small>From March 2025</small>
                  <h2>Founder, Openroot Systems</h2>
                  <p>Fast Integrated Software Support and a Prompt Engineering Learning Platform, from Kolkata.</p>
                </div>
              </div>
              <div className="now-card c-blue" data-zoom>
                <div>
                  <small>From July 2026</small>
                  <h2>MBA, Finance &amp; Operations</h2>
                  <p>University of Calcutta, Batch (2026-2028).</p>
                </div>
              </div>
            </div>

            <div className="legend" data-zoom aria-label="Working domains">
              <b>Working domains</b>
              {DOMAINS.map((d) => (
                <span key={d.label} className={`pill c-${d.tone}`}>
                  {d.label}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* JOURNEY */}
        <section id="journey" aria-labelledby="journey-h">
          <div className="wrap">
            <SectionHead
              id="journey-h"
              title="From precision to product."
              text="A formal record of education, experience and achievements."
            />

            {GROUPS.map((group) => (
              <div className="group" key={group.title}>
                <h3 className="sub" data-zoom>
                  {group.title}
                  <span>Most recent first</span>
                </h3>
                <ol className="tl">
                  {group.entries.map((entry) => (
                    <TimelineRow key={`${entry.year}-${entry.title}`} entry={entry} />
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </section>

        {/* BUILD */}
        <section id="build" aria-labelledby="build-h">
          <div className="wrap">
            <SectionHead
              id="build-h"
              title="What I build."
              text="Practical technology for businesses that need to be seen and to work properly online."
            />

            <div className="build">
              <div className="big c-blue" data-zoom>
                <div>
                  <h3>Openroot Systems</h3>
                  <p>
                    A Government of India registered MSME I founded in March 2026. It delivers frontend web
                    development, SEO and digital product services.
                  </p>
                </div>
                <div>
                  <a className="btn btn-white" href={PROFILE.website} target="_blank" rel="noreferrer">
                    Visit openroot.in
                  </a>
                </div>
              </div>

              <div className="svc">
                {SERVICES.map((s) => (
                  <div className="svc-item" data-zoom key={s.title}>
                    <h3>{s.title}</h3>
                    <p>{s.text}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="work">
              {WORK.map((w) => (
                <article className={`work-card c-${w.tone}`} data-zoom key={w.title}>
                  <div>
                    <h3>{w.title}</h3>
                    <p>{w.text}</p>
                  </div>
                  <span className="tag-wrap">
                    <span className="tag">{w.tag}</span>
                  </span>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* EDGE */}
        <section id="edge" aria-labelledby="edge-h">
          <div className="wrap">
            <SectionHead
              id="edge-h"
              title="The edge is the combination."
              text="A broader perspective creates a stronger way to understand problems, make decisions, and build what matters."
            />

            <div className="edge">
              {EDGE.map((e) => (
                <div className={`edge-tile c-${e.tone}`} data-zoom key={e.title}>
                  <h3>{e.title}</h3>
                  <p>{e.text}</p>
                </div>
              ))}
            </div>

            <div className="edge-base c-yellow" data-zoom>
              <b>Foundation: a strong character</b>
              <span>Empowering child and women education, and digitalizing small businesses with technology.</span>
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact" aria-labelledby="contact-h">
          <div className="wrap">
            <div className="contact c-blue" data-zoom>
              <div>
                <h2 id="contact-h">{"Let's build something impactful together."}</h2>
                <p>Open to product collaboration and professional opportunities, on-site, hybrid or remote.</p>
              </div>
              <div className="contact-actions">
                <a className="btn btn-white" href={PROFILE.linkedin} target="_blank" rel="noreferrer">
                  Connect on LinkedIn
                </a>
                <a className="btn btn-ink" href={PROFILE.website} target="_blank" rel="noreferrer">
                  Visit Openroot Systems
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <div className="wrap foot">
          <span>© 2026 {PROFILE.name} · Openroot Systems</span>
          <span>{PROFILE.location}</span>
        </div>
      </footer>
    </div>
  );
}

export default function FounderPortfolio(): React.JSX.Element {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const [shadowRoot, setShadowRoot] = useState<ShadowRoot | null>(null);

  useLayoutEffect(() => {
    const host = hostRef.current;
    if (!host) return undefined;

    const root = host.shadowRoot ?? host.attachShadow({ mode: "open" });
    setShadowRoot(root);

    return undefined;
  }, []);

  return (
    <div
      ref={hostRef}
      data-founder-profile-host
      style={{
        display: "block",
        width: "100%",
        maxWidth: "none",
        minWidth: 0,
        margin: 0,
        padding: 0,
      }}
    >
      {shadowRoot ? createPortal(<FounderPortfolioContent />, shadowRoot) : null}
    </div>
  );
}
