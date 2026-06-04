import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "@studio-freight/lenis";
import * as THREE from "three";

gsap.registerPlugin(ScrollTrigger);

type TimelineItem = {
  date: string;
  title: string;
  desc: string;
};

type SkillItem = {
  icon: string;
  title: string;
  desc: string;
};

type VisibleHookResult<T extends HTMLElement> = readonly [React.RefObject<T | null>, boolean];

type PreloaderProps = {
  progress: number;
  exiting: boolean;
};

type NavProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

type TLCardProps = {
  item: TimelineItem;
  index: number;
};

type SkillCardProps = {
  s: SkillItem;
  i: number;
};

const TIMELINE: TimelineItem[] = [
  {
    date: "Foundation",
    title: "Diploma in Survey Engineering",
    desc: "Achieved 84th percentile as Department Topper after completing 12th Science. Built the foundation for technical excellence.",
  },
  {
    date: "During Diploma",
    title: "Campus Ambassador at Bhumi",
    desc: "Led child-education and empowerment campaigns, developing leadership and social impact skills.",
  },
  {
    date: "During Diploma",
    title: "Internship at Flipkart",
    desc: "Completed Supply Chain Management internship, optimising logistics workflows at scale across warehousing operations.",
  },
  {
    date: "Post Diploma",
    title: "Instructor at ITI College",
    desc: "Worked as Survey Department Instructor under Government PPP Model, sharing knowledge with future professionals.",
  },
  {
    date: "Graduation",
    title: "B.Tech in Computer Science",
    desc: "Specialised in software development and AI systems. Deep experience in data structures, web technologies, and database management.",
  },
  {
    date: "Work Life",
    title: "CMPDI — Coal India Subsidiary",
    desc: "Geomatics Division, CMPDI HQ Ranchi. Applied precision survey expertise in a national-scale infrastructure context.",
  },
  {
    date: "5+ Years",
    title: "Equity Market Expertise",
    desc: "Built practical experience in equity markets and mutual funds, developing deep financial market insights and investment strategy.",
  },
];

const SKILLS: SkillItem[] = [
  {
    icon: "🚀",
    title: "Tech Leadership",
    desc: "Building and scaling tech startups with a focus on innovation, user experience, and sustainable growth strategies.",
  },
  {
    icon: "⚡",
    title: "Financial Strategy",
    desc: "5+ years of equity market experience, providing insights into investment strategies, portfolio construction, and market analysis.",
  },
  {
    icon: "🎓",
    title: "Education & Mentoring",
    desc: "Passionate about financial literacy and entrepreneurial education to empower the next generation of builders.",
  },
  {
    icon: "💻",
    title: "Software Development",
    desc: "Modern software development with expertise in AI systems, web technologies, and scalable cloud architectures.",
  },
  {
    icon: "🗺️",
    title: "Geomatics & Survey",
    desc: "Professional training in survey engineering and geomatics from CMPDI, combining technical precision with innovation.",
  },
  {
    icon: "🌱",
    title: "Sustainability Focus",
    desc: "Committed to building solutions that are not only profitable but also environmentally and socially responsible.",
  },
];

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Syne:wght@400;500;600;700;800&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  .lenis.lenis-smooth { scroll-behavior: auto !important; }
  ::-webkit-scrollbar { width: 3px; }
  ::-webkit-scrollbar-track { background: #0a0a0f; }
  ::-webkit-scrollbar-thumb { background: linear-gradient(#6366f1, #a855f7); border-radius: 3px; }

  @keyframes marqueeAnim { from { transform: translateX(0); } to { transform: translateX(-50%); } }
  @keyframes pulseScroll { 0%,100% { opacity:1; transform:scaleY(1); } 50% { opacity:0.15; transform:scaleY(0.45); } }
  @keyframes preExit { from { transform:translateY(0); } to { transform:translateY(-100%); } }
  @keyframes floatOrb1 { 0%,100%{transform:translate(0,0);} 33%{transform:translate(45px,-28px);} 66%{transform:translate(-22px,18px);} }
  @keyframes floatOrb2 { 0%,100%{transform:translate(0,0);} 33%{transform:translate(-35px,22px);} 66%{transform:translate(28px,-16px);} }
  @keyframes shimmer { 0%{background-position:200% center;} 100%{background-position:-200% center;} }

  .sb { font-family: 'Space Grotesk', sans-serif; }
  .sy { font-family: 'Syne', sans-serif; }

  .about-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: clamp(2rem, 5vw, 5rem);
    align-items: flex-start;
    max-width: 1400px;
    margin: 0 auto;
  }
  .skills-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.5rem;
    max-width: 1400px;
    margin: 0 auto;
  }
  .stat-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
    margin-top: 3rem;
    padding-top: 3rem;
    border-top: 1px solid rgba(255,255,255,0.07);
  }
  .hero-cta {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
  }
  .desktop-links { display: flex; gap: 3rem; list-style: none; }
  .ham-btn { display: none; }

  .tl-item {
    position: relative;
    width: 50%;
    padding: 2rem 0;
  }
  .tl-left { padding-right: 4rem; text-align: right; left: 0; }
  .tl-right { padding-left: 4rem; text-align: left; left: 50%; }
  .dot-left { right: -9px; left: auto !important; }
  .dot-right { left: -9px; }
  .tl-center-line { left: 50%; }

  .footer-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 1.5rem;
  }

  @media (max-width: 1023px) {
    .desktop-links { display: none; }
    .ham-btn { display: flex; }
  }
  @media (max-width: 768px) {
    .about-grid { grid-template-columns: 1fr; }
    .skills-grid { grid-template-columns: 1fr; }
    .hero-cta { flex-direction: column; align-items: center; }
    .tl-item { width: 100% !important; left: 0 !important; padding: 1.5rem 1rem 1.5rem 52px !important; text-align: left !important; }
    .dot-left, .dot-right { left: 7px !important; right: auto !important; }
    .tl-center-line { left: 17px !important; }
    .stat-grid { grid-template-columns: 1fr 1fr; }
  }
  @media (max-width: 480px) {
    .stat-grid { grid-template-columns: 1fr; }
    .footer-row { flex-direction: column; text-align: center; }
  }
  @media (max-width: 1023px) {
    body { cursor: auto !important; }
    canvas[data-cursor] { display: none; }
  }
`;

function useVisible<T extends HTMLElement = HTMLDivElement>(threshold = 0.12): VisibleHookResult<T> {
  const ref = useRef<T>(null);
  const [vis, setVis] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVis(true);
          obs.unobserve(el);
        }
      },
      { threshold }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return [ref, vis] as const;
}

function ParticleCanvas() {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    const mobile = window.innerWidth < 768;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();

    const count = mobile ? 55 : 140;
    const pts = Array.from({ length: count }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.38,
      vy: (Math.random() - 0.5) * 0.38,
      r: Math.random() * 1.6 + 0.4,
      op: Math.random() * 0.55 + 0.15,
      c: Math.random() > 0.55 ? "99,102,241" : "139,92,246",
    }));

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
    };

    window.addEventListener("mousemove", onMove, { passive: true });

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      pts.forEach((p, i) => {
        if (!mobile) {
          const dx = mx - p.x;
          const dy = my - p.y;
          const d = Math.hypot(dx, dy);
          if (d < 130) {
            p.vx += dx * 0.000028;
            p.vy += dy * 0.000028;
          }
        }

        p.vx *= 0.99;
        p.vy *= 0.99;
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.c},${p.op})`;
        ctx.fill();

        if (!mobile) {
          for (let j = i + 1; j < pts.length; j += 1) {
            const q = pts[j];
            const d = Math.hypot(p.x - q.x, p.y - q.y);
            if (d < 95) {
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(q.x, q.y);
              ctx.strokeStyle = `rgba(99,102,241,${0.11 * (1 - d / 95)})`;
              ctx.lineWidth = 0.4;
              ctx.stroke();
            }
          }
        }
      });

      raf = requestAnimationFrame(draw);
    };

    draw();
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={ref} data-cursor style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }} />;
}

function CustomCursor() {
  const ring = useRef<HTMLDivElement | null>(null);
  const dot = useRef<HTMLDivElement | null>(null);
  const raw = useRef({ x: 0, y: 0 });
  const smooth = useRef({ x: 0, y: 0 });
  const hov = useRef(false);

  useEffect(() => {
    if (window.innerWidth < 1024) return;

    document.body.style.cursor = "none";

    const onMove = (e: MouseEvent) => {
      raw.current = { x: e.clientX, y: e.clientY };
    };

    const on = () => {
      hov.current = true;
    };

    const off = () => {
      hov.current = false;
    };

    window.addEventListener("mousemove", onMove, { passive: true });

    const addListeners = () => {
      document.querySelectorAll<HTMLElement>("a,button,[data-h]").forEach((el) => {
        el.addEventListener("mouseenter", on);
        el.addEventListener("mouseleave", off);
      });
    };

    addListeners();

    let raf = 0;
    const tick = () => {
      smooth.current.x += (raw.current.x - smooth.current.x) * 0.13;
      smooth.current.y += (raw.current.y - smooth.current.y) * 0.13;

      if (ring.current) {
        const size = hov.current ? 58 : 20;
        ring.current.style.transform = `translate(${raw.current.x - size / 2}px,${raw.current.y - size / 2}px)`;
        ring.current.style.width = `${size}px`;
        ring.current.style.height = `${size}px`;
        ring.current.style.background = hov.current ? "rgba(99,102,241,0.12)" : "transparent";
      }
      if (dot.current) {
        dot.current.style.transform = `translate(${smooth.current.x - 3}px,${smooth.current.y - 3}px)`;
      }

      raf = requestAnimationFrame(tick);
    };

    tick();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      document.body.style.cursor = "";
    };
  }, []);

  return (
    <>
      <div
        ref={ring}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          border: "1.5px solid #6366f1",
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: 9999,
          transition: "width 0.28s, height 0.28s, background 0.28s",
          mixBlendMode: "difference",
        }}
      />
      <div
        ref={dot}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 6,
          height: 6,
          background: "#a855f7",
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: 10000,
        }}
      />
    </>
  );
}

function Preloader({ progress, exiting }: PreloaderProps) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "#0a0a0f",
        zIndex: 10001,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        animation: exiting ? "preExit 1s cubic-bezier(0.76,0,0.24,1) forwards" : "none",
      }}
    >
      <div
        className="sy"
        style={{
          fontSize: "clamp(4.5rem,14vw,9rem)",
          fontWeight: 800,
          letterSpacing: "-0.04em",
          background: "linear-gradient(270deg,#6366f1,#8b5cf6,#a855f7,#6366f1)",
          backgroundSize: "400% auto",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          animation: "shimmer 3s linear infinite",
        }}
      >
        SB
      </div>
      <div
        style={{
          width: "min(260px,70vw)",
          height: "1.5px",
          background: "rgba(255,255,255,0.06)",
          marginTop: "2.5rem",
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${progress}%`,
            background: "linear-gradient(90deg,#6366f1,#a855f7)",
            borderRadius: 2,
            transition: "width 0.1s linear",
          }}
        />
      </div>
      <div
        className="sb"
        style={{ marginTop: "1.2rem", fontSize: "0.95rem", color: "rgba(255,255,255,0.3)", fontVariantNumeric: "tabular-nums", letterSpacing: "0.08em" }}
      >
        {Math.floor(progress)}%
      </div>
    </div>
  );
}

function Nav({ open, setOpen }: NavProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 55);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const go = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setOpen(false);
  };

  const links = ["about", "journey", "skills", "contact"];

  return (
    <>
      <nav
        className="sb"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          zIndex: 100,
          padding: `${scrolled ? "0.85rem" : "1.4rem"} clamp(1.5rem,4vw,3rem)`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: scrolled ? "rgba(10,10,15,0.93)" : "transparent",
          backdropFilter: scrolled ? "blur(22px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(255,255,255,0.04)" : "none",
          transition: "all 0.4s ease",
        }}
      >
        <a href="#hero" className="sy" data-h style={{ fontSize: "1.55rem", fontWeight: 800, color: "white", textDecoration: "none", letterSpacing: "-0.03em" }}>
          SB.
        </a>
        <ul className="desktop-links">
          {links.map((l) => (
            <li key={l}>
              <button
                onClick={() => go(l)}
                data-h
                style={{
                  background: "none",
                  border: "none",
                  color: "rgba(255,255,255,0.55)",
                  fontSize: "0.78rem",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  padding: "0.4rem 0",
                  transition: "color 0.3s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "white";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "rgba(255,255,255,0.55)";
                }}
              >
                {l}
              </button>
            </li>
          ))}
        </ul>
        <button
          className="ham-btn"
          onClick={() => setOpen((v) => !v)}
          data-h
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            flexDirection: "column",
            gap: 5,
            padding: 8,
          }}
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              style={{
                display: "block",
                width: 22,
                height: 2,
                background: "white",
                borderRadius: 1,
                transition: "all 0.3s ease",
                transform: open
                  ? i === 0
                    ? "rotate(45deg) translate(5px,5px)"
                    : i === 1
                      ? "scaleX(0)"
                      : "rotate(-45deg) translate(5px,-5px)"
                  : "none",
                opacity: open && i === 1 ? 0 : 1,
              }}
            />
          ))}
        </button>
      </nav>

      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(10,10,15,0.97)",
          backdropFilter: "blur(24px)",
          zIndex: 99,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: open ? 1 : 0,
          visibility: open ? "visible" : "hidden",
          transition: "opacity 0.4s ease, visibility 0.4s ease",
          pointerEvents: open ? "auto" : "none",
        }}
      >
        <ul style={{ listStyle: "none", textAlign: "center", display: "flex", flexDirection: "column", gap: "2.5rem" }}>
          {links.map((l, i) => (
            <li key={l}>
              <button
                onClick={() => go(l)}
                data-h
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "'Syne', sans-serif",
                  fontSize: "clamp(2.2rem,8vw,3.5rem)",
                  fontWeight: 700,
                  color: "white",
                  textTransform: "uppercase",
                  opacity: open ? 1 : 0,
                  transform: open ? "translateY(0)" : "translateY(28px)",
                  transition: `opacity 0.45s ease ${i * 0.08}s, transform 0.45s cubic-bezier(0.175,0.885,0.32,1.275) ${i * 0.08}s`,
                }}
              >
                {l}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

function Hero() {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const t = window.setTimeout(() => setInView(true), 1350);
    return () => window.clearTimeout(t);
  }, []);

  const grad: React.CSSProperties = {
    background: "linear-gradient(135deg,#6366f1,#8b5cf6,#a855f7)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  };

  const reveal = (delay: number): React.CSSProperties => ({
    opacity: inView ? 1 : 0,
    transform: inView ? "translateY(0)" : "translateY(18px)",
    transition: `opacity 0.85s ease ${delay}s, transform 0.85s ease ${delay}s`,
  });

  return (
    <section id="hero" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", padding: "0 5vw", overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          width: "clamp(400px,60vw,750px)",
          height: "clamp(400px,60vw,750px)",
          borderRadius: "50%",
          background: "radial-gradient(circle,rgba(99,102,241,0.18) 0%,transparent 68%)",
          top: "-30%",
          left: "-15%",
          pointerEvents: "none",
          animation: "floatOrb1 9s ease-in-out infinite",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: "clamp(300px,45vw,580px)",
          height: "clamp(300px,45vw,580px)",
          borderRadius: "50%",
          background: "radial-gradient(circle,rgba(168,85,247,0.13) 0%,transparent 68%)",
          bottom: "-20%",
          right: "-10%",
          pointerEvents: "none",
          animation: "floatOrb2 12s ease-in-out infinite",
        }}
      />

      <div className="sb" style={{ textAlign: "center", maxWidth: 1100, position: "relative", zIndex: 1 }}>
        <p style={{ fontSize: "clamp(0.58rem,1.5vw,0.82rem)", letterSpacing: "0.4em", textTransform: "uppercase", color: "rgba(255,255,255,0.32)", marginBottom: "2rem", ...reveal(0.2) }}>
          Founder &nbsp;•&nbsp; Educator &nbsp;•&nbsp; Innovator
        </p>

        <h1 className="sy" style={{ fontSize: "clamp(3.5rem,10.5vw,9rem)", fontWeight: 800, lineHeight: 0.86, marginBottom: "2.2rem", letterSpacing: "-0.035em" }}>
          {["Somnath", "Banerjee"].map((word, idx) => (
            <span key={word} style={{ display: "block", overflow: "hidden" }}>
              <span
                style={{
                  display: "inline-block",
                  ...(idx === 1 ? grad : { color: "white" }),
                  transform: inView ? "translateY(0)" : "translateY(110%)",
                  transition: `transform 1.05s cubic-bezier(0.16,1,0.3,1) ${0.38 + idx * 0.14}s`,
                }}
              >
                {word}
              </span>
            </span>
          ))}
        </h1>

        <p style={{ fontSize: "clamp(0.88rem,2vw,1.12rem)", color: "rgba(255,255,255,0.42)", maxWidth: 560, margin: "0 auto 3rem", lineHeight: 1.95, ...reveal(0.82) }}>
          Tech-startup founder and market strategist revolutionizing micro-industries through cutting-edge technology and inclusive financial education.
        </p>

        <div className="hero-cta" style={reveal(1.05)}>
          <a
            href="https://wa.me/7866049865"
            data-h
            style={{
              padding: "1.05rem 2.8rem",
              background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
              color: "white",
              borderRadius: 50,
              textDecoration: "none",
              fontSize: "0.78rem",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              fontFamily: "inherit",
              boxShadow: "0 6px 26px rgba(99,102,241,0.38)",
              transition: "transform 0.3s, box-shadow 0.3s",
              display: "inline-block",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.boxShadow = "0 14px 36px rgba(99,102,241,0.52)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "";
              e.currentTarget.style.boxShadow = "0 6px 26px rgba(99,102,241,0.38)";
            }}
          >
            Connect Now
          </a>
          <button
            onClick={() => document.getElementById("journey")?.scrollIntoView({ behavior: "smooth" })}
            data-h
            style={{
              padding: "1.05rem 2.8rem",
              background: "transparent",
              border: "1px solid rgba(255,255,255,0.18)",
              color: "rgba(255,255,255,0.88)",
              borderRadius: 50,
              fontSize: "0.78rem",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              fontFamily: "inherit",
              cursor: "pointer",
              transition: "all 0.3s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "rgba(99,102,241,0.7)";
              e.currentTarget.style.background = "rgba(99,102,241,0.09)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.18)";
              e.currentTarget.style.background = "transparent";
            }}
          >
            Explore Journey
          </button>
        </div>
      </div>
    </section>
  );
}

function MarqueeStrip() {
  const items = ["OPENROOT SYSTEMS", "·", "TECH INNOVATION", "·", "FINANCIAL LITERACY", "·", "SUSTAINABILITY", "·"];
  return (
    <div style={{ overflow: "hidden", padding: "2.5rem 0", borderTop: "1px solid rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.04)", position: "relative", zIndex: 1 }}>
      <div style={{ display: "flex", animation: "marqueeAnim 30s linear infinite", width: "max-content" }}>
        {[0, 1].map((n) => (
          <div key={n} style={{ display: "flex", gap: "4rem", paddingRight: "4rem", alignItems: "center" }}>
            {items.map((item, i) => (
              <span
                key={i}
                className="sy"
                style={{ fontSize: "clamp(0.9rem,3vw,2.1rem)", fontWeight: 700, color: "rgba(255,255,255,0.06)", whiteSpace: "nowrap", transition: "color 0.35s", cursor: "default" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#8b5cf6";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "rgba(255,255,255,0.06)";
                }}
              >
                {item}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function About() {
  const [ref, vis] = useVisible<HTMLDivElement>();
  const grad: React.CSSProperties = {
    background: "linear-gradient(135deg,#6366f1,#a855f7)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  };
  const stats = [
    { n: "5+", l: "Years Experience" },
    { n: "2", l: "Ventures Founded" },
    { n: "84%", l: "Percentile Score" },
  ];

  return (
    <section id="about" style={{ padding: "15vh 5vw 10vh", position: "relative", zIndex: 1 }}>
      <div className="about-grid" ref={ref}>
        <div style={{ opacity: vis ? 1 : 0, transform: vis ? "none" : "translateX(-45px)", transition: "opacity 0.95s ease, transform 0.95s cubic-bezier(0.23,1,0.32,1)" }}>
          <div style={{ position: "relative", borderRadius: 24, overflow: "hidden", aspectRatio: "4/5", background: "linear-gradient(145deg,rgba(99,102,241,0.12),rgba(139,92,246,0.07),rgba(168,85,247,0.04))", border: "1px solid rgba(99,102,241,0.18)" }}>
            <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(99,102,241,0.055) 1px,transparent 1px),linear-gradient(90deg,rgba(99,102,241,0.055) 1px,transparent 1px)", backgroundSize: "44px 44px" }} />
            <div className="sy" style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1.4rem" }}>
              <div
                style={{
                  position: "relative",
                  borderRadius: 24,
                  overflow: "hidden",
                  aspectRatio: "4/5",
                  border: "1px solid rgba(99,102,241,0.18)",
                  boxShadow: "0 30px 80px rgba(0,0,0,0.35)",
                }}
              >
                <img
                  src="/assets/founder-openroot.avif"
                  alt="Somnath Banerjee"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                />

                {/* Dark Overlay */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(to top, rgba(10,10,15,0.92) 0%, rgba(10,10,15,0.45) 35%, transparent 70%)",
                  }}
                />

                {/* Name Section */}
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    bottom: "2rem",
                    textAlign: "center",
                    padding: "0 1.5rem",
                    zIndex: 2,
                  }}
                >
                  <div
                    className="sy"
                    style={{
                      fontSize: "clamp(1.2rem,2vw,1.8rem)",
                      fontWeight: 700,
                      color: "#fff",
                    }}
                  >
                    Somnath Banerjee
                  </div>

                  <div
                    className="sb"
                    style={{
                      fontSize: "0.75rem",
                      color: "#8b5cf6",
                      letterSpacing: "0.22em",
                      textTransform: "uppercase",
                      marginTop: "0.5rem",
                    }}
                  >
                    Founder · Openroot Systems
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "0.5rem",
                      justifyContent: "center",
                      marginTop: "1rem",
                    }}
                  >
                  </div>
                </div>
              </div>
            </div>
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom,transparent 60%,rgba(10,10,15,0.4))", pointerEvents: "none" }} />
          </div>
        </div>

        <div className="sb" style={{ opacity: vis ? 1 : 0, transform: vis ? "none" : "translateX(45px)", transition: "opacity 0.95s ease 0.18s, transform 0.95s cubic-bezier(0.23,1,0.32,1) 0.18s" }}>
          <span style={{ fontSize: "0.7rem", letterSpacing: "0.32em", textTransform: "uppercase", color: "#6366f1", display: "block", marginBottom: "1rem" }}>About Me</span>
          <h2 className="sy" style={{ fontSize: "clamp(1.9rem,4vw,3.4rem)", fontWeight: 700, lineHeight: 1.1, marginBottom: "2rem" }}>
            Building the Future,<br />
            One Innovation<br />
            <span style={grad}>at a Time</span>
          </h2>
          {[
            "I am a tech-startup founder and educator committed to revolutionizing micro-industries through cutting-edge technology. My vision is to enhance productivity, sustainability, and scalability while empowering the next generation through inclusive financial literacy and entrepreneurial education.",
            "With a background in Survey Engineering, Computer Science, and over 5 years of equity market experience, I bring a unique blend of technical expertise and financial acumen to everything I build.",
          ].map((text, i) => (
            <p key={i} style={{ fontSize: "clamp(0.88rem,1.5vw,1.03rem)", color: "rgba(255,255,255,0.52)", lineHeight: 1.95, marginBottom: "1.5rem" }}>
              {text}
            </p>
          ))}
          <div className="stat-grid">
            {stats.map(({ n, l }) => (
              <div key={l} style={{ textAlign: "center" }}>
                <div className="sy" style={{ fontSize: "clamp(2rem,4vw,2.6rem)", fontWeight: 800, ...grad }}>
                  {n}
                </div>
                <div style={{ fontSize: "0.66rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(255,255,255,0.32)", marginTop: "0.5rem" }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function TLCard({ item, index }: TLCardProps) {
  const [ref, vis] = useVisible<HTMLDivElement>();
  const isLeft = index % 2 === 0;

  return (
    <div
      ref={ref}
      className={`tl-item ${isLeft ? "tl-left" : "tl-right"}`}
      style={{
        opacity: vis ? 1 : 0,
        transform: vis ? "none" : "translateY(38px)",
        transition: `opacity 0.7s ease ${index * 0.07}s, transform 0.7s cubic-bezier(0.23,1,0.32,1) ${index * 0.07}s`,
      }}
    >
      <div
        className={isLeft ? "dot-left" : "dot-right"}
        style={{
          position: "absolute",
          width: 15,
          height: 15,
          background: "#0a0a0f",
          border: "2.5px solid #6366f1",
          borderRadius: "50%",
          top: "2.9rem",
          boxShadow: "0 0 12px rgba(99,102,241,0.8), 0 0 24px rgba(99,102,241,0.3)",
        }}
      />
      <div
        className="sb"
        style={{
          background: "rgba(255,255,255,0.018)",
          border: "1px solid rgba(255,255,255,0.055)",
          borderRadius: 20,
          padding: "1.8rem 2rem",
          backdropFilter: "blur(12px)",
          transition: "transform 0.32s ease, border-color 0.32s ease, box-shadow 0.32s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-7px)";
          e.currentTarget.style.borderColor = "rgba(99,102,241,0.42)";
          e.currentTarget.style.boxShadow = "0 24px 48px rgba(0,0,0,0.28), inset 0 0 0 1px rgba(99,102,241,0.08)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "";
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.055)";
          e.currentTarget.style.boxShadow = "";
        }}
      >
        <div style={{ fontSize: "0.66rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "#7c7cf8", marginBottom: "0.65rem" }}>{item.date}</div>
        <h3 className="sy" style={{ fontSize: "clamp(1rem,2vw,1.28rem)", fontWeight: 600, marginBottom: "0.85rem", lineHeight: 1.3 }}>
          {item.title}
        </h3>
        <p style={{ color: "rgba(255,255,255,0.46)", lineHeight: 1.85, fontSize: "0.88rem" }}>{item.desc}</p>
      </div>
    </div>
  );
}

function JourneySection() {
  const [hRef, hVis] = useVisible<HTMLDivElement>();
  return (
    <section id="journey" style={{ padding: "10vh 5vw", position: "relative", zIndex: 1 }}>
      <div style={{ textAlign: "center", marginBottom: "5rem" }} ref={hRef}>
        <span className="sb" style={{ fontSize: "0.7rem", letterSpacing: "0.32em", textTransform: "uppercase", color: "#6366f1", display: "block", marginBottom: "1rem", opacity: hVis ? 1 : 0, transition: "opacity 0.8s" }}>
          My Path
        </span>
        <h2 className="sy" style={{ fontSize: "clamp(2rem,5vw,4rem)", fontWeight: 700, opacity: hVis ? 1 : 0, transform: hVis ? "none" : "translateY(20px)", transition: "opacity 0.8s 0.1s, transform 0.8s 0.1s" }}>
          Journey So Far
        </h2>
      </div>
      <div style={{ position: "relative", maxWidth: 1200, margin: "0 auto" }}>
        <div className="tl-center-line" style={{ position: "absolute", top: 0, bottom: 0, width: 2, background: "linear-gradient(to bottom,#6366f1,#a855f7,rgba(168,85,247,0.1))", transform: "translateX(-50%)" }} />
        {TIMELINE.map((item, i) => (
          <TLCard key={i} item={item} index={i} />
        ))}
      </div>
    </section>
  );
}

function VisionSection() {
  const [ref, vis] = useVisible<HTMLDivElement>();
  const grad: React.CSSProperties = {
    background: "linear-gradient(135deg,#6366f1,#a855f7)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  };

  return (
    <section style={{ padding: "16vh 5vw", position: "relative", zIndex: 1, textAlign: "center", overflow: "hidden" }}>
      <div
        className="sy"
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-50%)",
          fontSize: "clamp(5rem,22vw,15rem)",
          fontWeight: 800,
          color: "rgba(255,255,255,0.013)",
          whiteSpace: "nowrap",
          pointerEvents: "none",
          letterSpacing: "-0.05em",
          userSelect: "none",
        }}
      >
        VISION
      </div>
      <div ref={ref} style={{ maxWidth: 920, margin: "0 auto", position: "relative", zIndex: 2, opacity: vis ? 1 : 0, transform: vis ? "none" : "translateY(40px)", transition: "opacity 1s ease, transform 1s cubic-bezier(0.23,1,0.32,1)" }}>
        <span className="sb" style={{ fontSize: "0.7rem", letterSpacing: "0.32em", textTransform: "uppercase", color: "#6366f1", display: "block", marginBottom: "2.2rem" }}>
          My Mission
        </span>
        <div style={{ width: 50, height: 2, background: "linear-gradient(90deg,#6366f1,#a855f7)", margin: "0 auto 2.5rem", borderRadius: 2 }} />
        <blockquote className="sy" style={{ fontSize: "clamp(1rem,2.8vw,1.88rem)", fontWeight: 500, lineHeight: 1.78, color: "rgba(255,255,255,0.72)", margin: 0, padding: 0 }}>
          "To <span style={grad}>revolutionize micro-industries</span> by leveraging cutting-edge technology that enhances productivity, sustainability, and scalability — while <span style={grad}>empowering the next generation</span> through inclusive financial literacy, entrepreneurial education, and equitable access to growth opportunities."
        </blockquote>
      </div>
    </section>
  );
}

function SkillCard({ s, i }: SkillCardProps) {
  const [ref, vis] = useVisible<HTMLDivElement>();
  const [hov, setHov] = useState(false);

  return (
    <div
      ref={ref}
      data-h
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? "rgba(99,102,241,0.07)" : "rgba(255,255,255,0.016)",
        border: `1px solid ${hov ? "rgba(99,102,241,0.45)" : "rgba(255,255,255,0.055)"}`,
        borderRadius: 24,
        padding: "2.5rem 2rem",
        position: "relative",
        overflow: "hidden",
        opacity: vis ? 1 : 0,
        transform: vis ? hov ? "translateY(-11px)" : "translateY(0)" : "translateY(44px) scale(0.97)",
        transition: `opacity 0.7s ease ${i * 0.07}s, transform 0.48s cubic-bezier(0.23,1,0.32,1), background 0.38s, border-color 0.38s, box-shadow 0.38s`,
        boxShadow: hov ? "0 24px 50px rgba(0,0,0,0.22), inset 0 0 0 1px rgba(99,102,241,0.1)" : "none",
        cursor: "default",
      }}
    >
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg,#6366f1,#a855f7)", borderRadius: "24px 24px 0 0", opacity: hov ? 1 : 0, transition: "opacity 0.38s" }} />
      <div style={{ fontSize: "2.2rem", marginBottom: "1.5rem" }}>{s.icon}</div>
      <h3 className="sy" style={{ fontSize: "1.22rem", fontWeight: 600, marginBottom: "0.9rem" }}>
        {s.title}
      </h3>
      <p className="sb" style={{ color: "rgba(255,255,255,0.5)", lineHeight: 1.88, fontSize: "0.9rem" }}>{s.desc}</p>
    </div>
  );
}

function SkillsSection() {
  const [hRef, hVis] = useVisible<HTMLDivElement>();
  return (
    <section id="skills" style={{ padding: "10vh 5vw", position: "relative", zIndex: 1 }}>
      <div style={{ textAlign: "center", marginBottom: "5rem" }} ref={hRef}>
        <span className="sb" style={{ fontSize: "0.7rem", letterSpacing: "0.32em", textTransform: "uppercase", color: "#6366f1", display: "block", marginBottom: "1rem", opacity: hVis ? 1 : 0, transition: "opacity 0.8s" }}>
          Expertise
        </span>
        <h2 className="sy" style={{ fontSize: "clamp(2rem,5vw,4rem)", fontWeight: 700, opacity: hVis ? 1 : 0, transform: hVis ? "none" : "translateY(20px)", transition: "opacity 0.8s 0.1s, transform 0.8s 0.1s" }}>
          Skills & Capabilities
        </h2>
      </div>
      <div className="skills-grid">
        {SKILLS.map((s, i) => (
          <SkillCard key={i} s={s} i={i} />
        ))}
      </div>
    </section>
  );
}

function ContactSection() {
  const [ref, vis] = useVisible<HTMLDivElement>();
  const grad: React.CSSProperties = {
    background: "linear-gradient(135deg,#6366f1,#a855f7)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  };
  const socials = [
    { href: "https://openroot.in", label: "🌐", title: "Website" },
    { href: "https://openroot.in/softwares/openroot-classes", label: "📚", title: "Classes" },
    { href: "https://wa.me/7866049865", label: "💬", title: "WhatsApp" },
  ];

  return (
    <section id="contact" style={{ padding: "15vh 5vw", position: "relative", zIndex: 1, textAlign: "center" }}>
      <div style={{ position: "absolute", width: "60vw", height: "60vw", maxWidth: 700, maxHeight: 700, borderRadius: "50%", background: "radial-gradient(circle,rgba(99,102,241,0.09) 0%,transparent 65%)", top: "50%", left: "50%", transform: "translate(-50%,-50%)", pointerEvents: "none" }} />
      <div ref={ref} style={{ maxWidth: 800, margin: "0 auto", position: "relative", zIndex: 2, opacity: vis ? 1 : 0, transform: vis ? "none" : "translateY(40px)", transition: "opacity 0.95s, transform 0.95s cubic-bezier(0.23,1,0.32,1)" }}>
        <span className="sb" style={{ fontSize: "0.7rem", letterSpacing: "0.32em", textTransform: "uppercase", color: "#6366f1", display: "block", marginBottom: "1.5rem" }}>
          Get In Touch
        </span>
        <h2 className="sy" style={{ fontSize: "clamp(2.4rem,7.5vw,5.2rem)", fontWeight: 800, lineHeight: 1.04, marginBottom: "2rem" }}>
          Let's Build Something<br />Impactful <span style={grad}>Together</span>
        </h2>
        <p className="sb" style={{ fontSize: "clamp(0.88rem,2vw,1.1rem)", color: "rgba(255,255,255,0.42)", marginBottom: "3rem" }}>
          Ready to collaborate?{" "}
          <a
            href="https://wa.me/7866049865"
            data-h
            style={{ color: "#8b5cf6", textDecoration: "none", borderBottom: "1px solid rgba(139,92,246,0.38)", paddingBottom: 2, transition: "border-color 0.3s, color 0.3s" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#a855f7";
              e.currentTarget.style.borderColor = "rgba(168,85,247,0.7)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "#8b5cf6";
              e.currentTarget.style.borderColor = "rgba(139,92,246,0.38)";
            }}
          >
            Connect on WhatsApp
          </a>
        </p>
        <div style={{ display: "flex", justifyContent: "center", gap: "1.5rem", flexWrap: "wrap" }}>
          {socials.map(({ href, label, title }) => (
            <a
              key={title}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              title={title}
              data-h
              style={{
                width: 58,
                height: 58,
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textDecoration: "none",
                fontSize: "1.35rem",
                transition: "all 0.32s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "linear-gradient(135deg,#6366f1,#8b5cf6)";
                e.currentTarget.style.borderColor = "transparent";
                e.currentTarget.style.transform = "translateY(-7px) scale(1.05)";
                e.currentTarget.style.boxShadow = "0 14px 32px rgba(99,102,241,0.42)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                e.currentTarget.style.transform = "";
                e.currentTarget.style.boxShadow = "";
              }}
            >
              {label}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer style={{ padding: "2.5rem clamp(1.5rem,5vw,3rem)", borderTop: "1px solid rgba(255,255,255,0.04)", position: "relative", zIndex: 1 }}>
      <div className="footer-row sb">
        <p style={{ color: "rgba(255,255,255,0.26)", fontSize: "0.8rem", lineHeight: 1.6 }}>
          © 2026 Somnath Banerjee — Openroot Systems. All rights reserved.
        </p>
        <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
          {[
            ["OPENROOT", "https://openroot.in"],
            ["OPENROOT CLASSES", "https://openroot.in/softwares/openroot-classes"],
          ].map(([t, h]) => (
            <a
              key={t}
              href={h}
              target="_blank"
              rel="noreferrer"
              data-h
              style={{ color: "rgba(255,255,255,0.26)", textDecoration: "none", fontSize: "0.74rem", letterSpacing: "0.1em", transition: "color 0.3s" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#6366f1";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "rgba(255,255,255,0.26)";
              }}
            >
              {t}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}

export default function Portfolio(): React.JSX.Element {
  const [progress, setProgress] = useState(0);
  const [exiting, setExiting] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [backToTop, setBackToTop] = useState(false);
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const iv = window.setInterval(() => {
      setProgress((p) => {
        const next = Math.min(100, p + Math.random() * 13);
        if (next >= 100) {
          window.clearInterval(iv);
          window.setTimeout(() => {
            setExiting(true);
            window.setTimeout(() => setLoaded(true), 920);
          }, 280);
          return 100;
        }
        return next;
      });
    }, 55);

    return () => window.clearInterval(iv);
  }, []);

  useEffect(() => {
    const fn = () => setBackToTop(window.scrollY > 500);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    if (window.innerWidth >= 1024) {
      const lenis = new Lenis({
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });
      lenisRef.current = lenis;

      const raf = (time: number) => {
        lenis.raf(time);
        requestAnimationFrame(raf);
      };
      requestAnimationFrame(raf);

      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);

      return () => {
        lenis.destroy();
        lenisRef.current = null;
      };
    }

    return undefined;
  }, []);

  useEffect(() => {
    if (loaded) {
      gsap.to(".hero-title .line span", { y: 0, duration: 1.2, stagger: 0.1, ease: "power4.out", delay: 0.2 });

      gsap.utils.toArray<HTMLElement>(".reveal").forEach((elem) => {
        gsap.fromTo(elem, { opacity: 0, y: 50 }, {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: elem, start: "top 85%", toggleActions: "play none none reverse" },
        });
      });

      gsap.utils.toArray<HTMLElement>(".timeline-item").forEach((item) => {
        gsap.fromTo(item, { opacity: 0, y: 50 }, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: item, start: "top 85%", toggleActions: "play none none reverse" },
        });
      });

      gsap.fromTo(".skill-card", { opacity: 0, y: 60, scale: 0.95 }, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: { trigger: ".skills-grid", start: "top 80%" },
      });

      gsap.utils.toArray<HTMLElement>(".stat-number").forEach((counter) => {
        const target = Number.parseInt(counter.dataset.count ?? "0", 10);
        if (!Number.isNaN(target)) {
          gsap.fromTo(counter, { innerHTML: 0 }, {
            innerHTML: target,
            duration: 2,
            ease: "power2.out",
            snap: { innerHTML: 1 },
            scrollTrigger: { trigger: counter, start: "top 80%" },
            onUpdate: () => {
              counter.textContent = `${Math.floor(Number(counter.innerHTML))}${counter.dataset.suffix ?? ""}`;
            },
          });
        }
      });

      gsap.to(".glow-orb-1", { y: -200, scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 1 } });
      gsap.to(".glow-orb-2", { y: 200, scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 1 } });

      ScrollTrigger.create({
        start: "top -500px",
        onEnter: () => setBackToTop(true),
        onLeaveBack: () => setBackToTop(false),
      });
    }
  }, [loaded]);

  useEffect(() => {
    if (!loaded || window.innerWidth < 1024) return undefined;

    const buttons = Array.from(document.querySelectorAll<HTMLElement>(".magnetic-btn"));
    const handlers = buttons.map((btn) => {
      const onMove = (e: MouseEvent) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        const child = btn.querySelector<HTMLElement>("span");
        if (child) {
          gsap.to(child, { x: x * 0.3, y: y * 0.3, duration: 0.3, ease: "power2.out" });
        }
      };

      const onLeave = () => {
        const child = btn.querySelector<HTMLElement>("span");
        if (child) {
          gsap.to(child, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.3)" });
        }
      };

      btn.addEventListener("mousemove", onMove);
      btn.addEventListener("mouseleave", onLeave);
      return { btn, onMove, onLeave };
    });

    return () => {
      handlers.forEach(({ btn, onMove, onLeave }) => {
        btn.removeEventListener("mousemove", onMove);
        btn.removeEventListener("mouseleave", onLeave);
      });
    };
  }, [loaded]);

  return (
    <div style={{ background: "#0a0a0f", color: "white", overflowX: "hidden", minHeight: "100vh" }}>
      <style>{CSS}</style>
      {!loaded && <Preloader progress={progress} exiting={exiting} />}
      <ParticleCanvas />
      <CustomCursor />
      <Nav open={menuOpen} setOpen={setMenuOpen} />
      <main>
        <Hero />
        <MarqueeStrip />
        <About />
        <JourneySection />
        <VisionSection />
        <SkillsSection />
        <ContactSection />
        <Footer />
      </main>

      <button
        data-h
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        style={{
          position: "fixed",
          bottom: "2rem",
          right: "2rem",
          width: 48,
          height: 48,
          background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
          color: "white",
          border: "none",
          borderRadius: "50%",
          fontSize: "1.2rem",
          cursor: "pointer",
          zIndex: 99,
          opacity: backToTop ? 1 : 0,
          visibility: backToTop ? "visible" : "hidden",
          transform: backToTop ? "translateY(0) scale(1)" : "translateY(20px) scale(0.9)",
          transition: "all 0.35s ease",
          boxShadow: "0 6px 22px rgba(99,102,241,0.48)",
        }}
      >
        ↑
      </button>
    </div>
  );
}
