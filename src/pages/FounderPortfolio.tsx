import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUp, BookOpen, Globe, Menu, MessageCircle, X } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "@studio-freight/lenis";
// npm install framer-motion gsap three @studio-freight/lenis lucide-react
import * as THREE from "three";

gsap.registerPlugin(ScrollTrigger);

type Stat = {
  label: string;
  value: number;
  suffix?: string;
};

type TimelineItem = {
  period: string;
  title: string;
  description: string;
  images?: { src: string; alt: string }[];
};

type Skill = {
  icon: string;
  title: string;
  description: string;
};

const NAV_LINKS = [
  { label: "About", href: "#about" },
  { label: "Journey", href: "#journey" },
  { label: "Skills", href: "#skills" },
  { label: "Contact", href: "#contact" },
];

const STATS: Stat[] = [
  { label: "Years Experience", value: 5, suffix: "+" },
  { label: "Ventures Founded", value: 2, suffix: "+" },
  { label: "Percentile Score", value: 84, suffix: "%" },
];

const TIMELINE: TimelineItem[] = [
  {
    period: "Foundation",
    title: "Diploma in Survey Engineering",
    description:
      "Achieved 84% percentile as Department Topper after completing 12th Science. Built the foundation for technical excellence.",
  },
  {
    period: "During Diploma",
    title: "Campus Ambassador at Bhumi",
    description:
      "Led child-education and empowerment campaigns, developing leadership and social impact skills.",
    images: [{ src: "/assets/cabhumi.avif", alt: "Bhumi Campaign" }],
  },
  {
    period: "During Diploma",
    title: "Internship at Flipkart",
    description:
      "Completed Supply Chain Management internship, optimizing logistics workflows at scale.",
    images: [
      { src: "/assets/flipkart-me.avif", alt: "Flipkart Internship" },
      { src: "/assets/flipkart-inside.avif", alt: "Flipkart Office" },
    ],
  },
  {
    period: "Post Diploma",
    title: "Instructor at ITI College",
    description:
      "Worked as Survey Department Instructor under Government PPP Model, sharing knowledge with future professionals.",
  },
  {
    period: "Graduation",
    title: "B.Tech in Computer Science",
    description:
      "Specialized in software development, and AI systems. Experience in programming, data structures, web technologies, and database management.",
  },
  {
    period: "Work Life",
    title: "CMPDI (A Coal India Subsidiary)",
    description: "Geomatics Division, CMPDI HQ Ranchi.",
    images: [
      { src: "/assets/founder-cmpdi.avif", alt: "CMPDI" },
      { src: "/assets/cmpdi-stc.avif", alt: "CMPDI STC" },
    ],
  },
  {
    period: "5+ Years",
    title: "Equity Market Expertise",
    description:
      "Built practical experience in equity markets and mutual funds, developing deep financial market insights.",
  },
];

const SKILLS: Skill[] = [
  {
    icon: "🚀",
    title: "Tech Leadership",
    description:
      "Building and scaling tech startups with a focus on innovation, user experience, and sustainable growth strategies.",
  },
  {
    icon: "⚡",
    title: "Financial Strategy",
    description:
      "5+ years of equity market experience, providing insights into investment strategies and market analysis.",
  },
  {
    icon: "🎓",
    title: "Education & Mentoring",
    description:
      "Passionate about financial literacy and entrepreneurial education to empower the next generation.",
  },
  {
    icon: "💻",
    title: "Software Development",
    description:
      "Modern software development with expertise in AI systems, web technologies, and scalable architectures.",
  },
  {
    icon: "🗺️",
    title: "Geomatics & Survey",
    description:
      "Professional training in survey engineering and geomatics from CMPDI, combining technical precision with innovation.",
  },
  {
    icon: "🌱",
    title: "Sustainability Focus",
    description:
      "Committed to building solutions that are not only profitable but also environmentally and socially responsible.",
  },
];

function useIsDesktop() {
  const [desktop, setDesktop] = useState(() => (typeof window !== "undefined" ? window.innerWidth >= 1024 : true));
  useEffect(() => {
    const onResize = () => setDesktop(window.innerWidth >= 1024);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return desktop;
}

function AnimatedCounter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement | null>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) {
      setCount(value);
      return;
    }

    let raf = 0;
    const start = performance.now();
    const duration = 1500;

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(value * eased));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, reducedMotion]);

  return (
    <span ref={ref} className="tabular-nums">
      {count}
      {suffix}
    </span>
  );
}

function SectionHeader({ label, title, center = false }: { label: string; title: string; center?: boolean }) {
  return (
    <div className={center ? "mx-auto mb-10 max-w-3xl text-center" : "mb-10"}>
      <motion.span
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        className="mb-3 block text-xs font-semibold uppercase tracking-[0.35em] text-indigo-400"
      >
        {label}
      </motion.span>
      <motion.h2
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        className="text-3xl font-bold leading-tight text-white md:text-5xl"
      >
        {title}
      </motion.h2>
    </div>
  );
}

function SocialLink({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition duration-300 hover:-translate-y-1 hover:border-transparent hover:bg-gradient-to-r hover:from-indigo-500 hover:via-violet-500 hover:to-fuchsia-500"
    >
      {children}
    </a>
  );
}

export default function FounderPortfolio() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showTop, setShowTop] = useState(false);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [cursorHover, setCursorHover] = useState(false);
  const [hoveredButton, setHoveredButton] = useState<HTMLElement | null>(null);
  const [lenisReady, setLenisReady] = useState<any>(null);
  const desktop = useIsDesktop();
  const reduceMotion = useReducedMotion();
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const particleCleanupRef = useRef<null | (() => void)>(null);

  const marqueeItems = useMemo(
    () => ["OPENROOT SYSTEMS", "TECH INNOVATION", "FINANCIAL LITERACY", "SUSTAINABILITY"],
    []
  );

  const scrollToHash = (href: string) => {
    const target = document.querySelector(href) as HTMLElement | null;
    if (!target) return;

    setMenuOpen(false);
    if (desktop && lenisReady?.scrollTo) {
      lenisReady.scrollTo(target, { offset: -50 });
    } else {
      target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    }
  };

  useEffect(() => {
    let pct = 0;
    const timer = window.setInterval(() => {
      pct += Math.random() * 10;
      if (pct >= 100) pct = 100;
      setProgress(Math.floor(pct));
      if (pct === 100) {
        window.clearInterval(timer);
        window.setTimeout(() => setLoading(false), 500);
      }
    }, 45);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 500);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!desktop) return;

    const onMove = (e: MouseEvent) => {
      setMouse({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [desktop]);

  useEffect(() => {
    if (!desktop || !canvasRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true, powerPreference: "high-performance" });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    canvasRef.current.innerHTML = "";
    canvasRef.current.appendChild(renderer.domElement);

    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 2500;
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i += 1) {
      posArray[i] = (Math.random() - 0.5) * 10;
    }

    particlesGeometry.setAttribute("position", new THREE.BufferAttribute(posArray, 3));

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.005,
      color: 0x6366f1,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);
    camera.position.z = 3;

    const animate = () => {
      particlesMesh.rotation.x += 0.0003;
      particlesMesh.rotation.y += 0.0005;
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };

    animate();

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    window.addEventListener("resize", onResize);

    const cleanup = () => {
      window.removeEventListener("resize", onResize);
      particlesGeometry.dispose();
      particlesMaterial.dispose();
      renderer.dispose();
      canvasRef.current?.removeChild(renderer.domElement);
    };

    particleCleanupRef.current = cleanup;
    return cleanup;
  }, [desktop]);

  useEffect(() => {
    if (!desktop) return;

    import("@studio-freight/lenis").then(({ default: LenisClass }) => {
      const lenis = new LenisClass({
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: "vertical",
        smooth: true,
      });
      setLenisReady(lenis);

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
      };
    });
  }, [desktop]);

  useEffect(() => {
    if (loading) return;

    gsap.to(".hero-title .line span", {
      y: 0,
      duration: 1.2,
      stagger: 0.1,
      ease: "power4.out",
      delay: 0.15,
    });

    gsap.utils.toArray<HTMLElement>(".reveal").forEach((elem) => {
      gsap.fromTo(
        elem,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: elem, start: "top 85%", toggleActions: "play none none reverse" },
        }
      );
    });

    gsap.utils.toArray<HTMLElement>(".timeline-item").forEach((item) => {
      gsap.fromTo(
        item,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: item, start: "top 85%", toggleActions: "play none none reverse" },
        }
      );
    });

    gsap.fromTo(
      ".skill-card",
      { opacity: 0, y: 60, scale: 0.95 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: { trigger: ".skills-grid", start: "top 80%" },
      }
    );

    gsap.utils.toArray<HTMLElement>(".stat-number").forEach((counter) => {
      const target = Number(counter.dataset.count || 0);
      if (!Number.isNaN(target)) {
        gsap.fromTo(
          counter,
          { innerHTML: 0 },
          {
            innerHTML: target,
            duration: 2,
            ease: "power2.out",
            snap: { innerHTML: 1 },
            scrollTrigger: { trigger: counter, start: "top 80%" },
            onUpdate: function onUpdate() {
              const current = Math.floor(Number(counter.innerHTML || 0));
              counter.textContent = `${current}${counter.dataset.suffix || ""}`;
            },
          }
        );
      }
    });

    if (desktop) {
      gsap.to(".glow-orb-1", {
        y: -200,
        scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 1 },
      });
      gsap.to(".glow-orb-2", {
        y: 200,
        scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 1 },
      });
    }

    ScrollTrigger.create({
      start: "top -500px",
      onEnter: () => setShowTop(true),
      onLeaveBack: () => setShowTop(false),
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      gsap.killTweensOf(".hero-title .line span");
    };
  }, [loading, desktop]);

  useEffect(() => {
    if (!desktop) return;

    const buttons = Array.from(document.querySelectorAll<HTMLElement>(".magnetic-btn"));
    const onEnterMap = new Map<HTMLElement, () => void>();
    const onMoveMap = new Map<HTMLElement, (e: MouseEvent) => void>();
    const onLeaveMap = new Map<HTMLElement, () => void>();

    buttons.forEach((btn) => {
      const onEnter = () => {
        btn.dataset.rect = JSON.stringify(btn.getBoundingClientRect().toJSON ? btn.getBoundingClientRect().toJSON() : btn.getBoundingClientRect());
      };

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

      onEnterMap.set(btn, onEnter);
      onMoveMap.set(btn, onMove);
      onLeaveMap.set(btn, onLeave);
      btn.addEventListener("mouseenter", onEnter);
      btn.addEventListener("mousemove", onMove);
      btn.addEventListener("mouseleave", onLeave);
    });

    return () => {
      buttons.forEach((btn) => {
        const onEnter = onEnterMap.get(btn);
        const onMove = onMoveMap.get(btn);
        const onLeave = onLeaveMap.get(btn);
        if (onEnter) btn.removeEventListener("mouseenter", onEnter);
        if (onMove) btn.removeEventListener("mousemove", onMove);
        if (onLeave) btn.removeEventListener("mouseleave", onLeave);
      });
    };
  }, [desktop, loading]);

  useEffect(() => {
    return () => {
      particleCleanupRef.current?.();
      if (lenisReady?.destroy) lenisReady.destroy();
    };
  }, [lenisReady]);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#0a0a0f] font-[Space_Grotesk,sans-serif] text-white antialiased selection:bg-indigo-500/30 selection:text-white">
      <div className="pointer-events-none fixed inset-0 z-[1] bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.18),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(168,85,247,0.14),_transparent_35%)]" />
      <div className="pointer-events-none fixed inset-0 z-[1] bg-[url('data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E')] opacity-[0.03]" />

      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: "-100%" }}
            transition={{ duration: 0.9, ease: "easeInOut" }}
            className="fixed inset-0 z-[80] flex items-center justify-center bg-[#0a0a0f]"
          >
            <div className="flex flex-col items-center gap-4 px-6 text-center">
              <div className="bg-gradient-to-r from-indigo-400 via-violet-400 to-fuchsia-400 bg-clip-text text-6xl font-black tracking-tight text-transparent md:text-8xl">
                SB
              </div>
              <div className="h-1 w-[min(300px,80vw)] overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 transition-[width] duration-75 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-sm tracking-[0.35em] text-zinc-400">{progress}%</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {desktop && (
        <>
          <div
            className="pointer-events-none fixed z-[60] hidden h-5 w-5 rounded-full border-2 border-indigo-400/90 mix-blend-difference lg:block"
            style={{ transform: `translate3d(${mouse.x - 10}px, ${mouse.y - 10}px, 0)` }}
          />
          <div
            className={`pointer-events-none fixed z-[60] hidden h-20 w-20 rounded-full bg-indigo-500/10 ring-1 ring-violet-400/30 lg:block ${cursorHover ? "scale-110" : "scale-100"}`}
            style={{ transform: `translate3d(${mouse.x - 40}px, ${mouse.y - 40}px, 0)` }}
          />
        </>
      )}

      <div ref={canvasRef} id="canvas-container" className="pointer-events-none fixed inset-0 z-[0]" />

      <header className="fixed left-0 top-0 z-[50] w-full border-b border-white/5 bg-[#0a0a0f]/75 backdrop-blur-xl lg:bg-transparent lg:backdrop-blur-0">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-6 lg:px-10 lg:py-6">
          <a href="#hero" onClick={(e) => { e.preventDefault(); scrollToHash("#hero"); }} className="relative z-[51] text-xl font-bold tracking-wide text-white transition-transform duration-300 hover:scale-105">
            SB.
          </a>

          <nav className="hidden items-center gap-10 lg:flex">
            {NAV_LINKS.map((item) => (
              <button
                key={item.label}
                onClick={() => scrollToHash(item.href)}
                onMouseEnter={() => setCursorHover(true)}
                onMouseLeave={() => setCursorHover(false)}
                className="text-sm uppercase tracking-[0.18em] text-white/85 transition hover:text-white"
              >
                {item.label}
              </button>
            ))}
          </nav>

          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="relative z-[51] inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white lg:hidden"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[45] flex items-center justify-center bg-[#0a0a0f]/98 px-6 backdrop-blur-2xl lg:hidden"
          >
            <ul className="flex w-full max-w-md flex-col items-center gap-8 text-center">
              {NAV_LINKS.map((item, index) => (
                <motion.li
                  key={item.label}
                  initial={{ opacity: 0, y: 22 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 * index }}
                >
                  <button onClick={() => scrollToHash(item.href)} className="text-4xl font-bold uppercase tracking-wide text-white">
                    {item.label}
                  </button>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="relative z-[2]">
        <section id="hero" className="hero relative flex min-h-screen items-center justify-center px-4 pt-28 md:px-6 lg:px-10">
          <div className="glow-orb glow-orb-1 absolute left-[-8rem] top-[-8rem] h-[22rem] w-[22rem] rounded-full bg-indigo-500/15 blur-[120px]" />
          <div className="glow-orb glow-orb-2 absolute bottom-[-7rem] right-[-8rem] h-[18rem] w-[18rem] rounded-full bg-violet-500/10 blur-[120px]" />

          <div className="hero-content mx-auto w-full max-w-6xl text-center">
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="hero-subtitle mb-6 text-[0.7rem] uppercase tracking-[0.35em] text-zinc-400 md:text-xs"
            >
              Founder • Educator • Innovator
            </motion.p>

            <h1 className="hero-title mx-auto max-w-5xl text-5xl font-black leading-[0.92] tracking-tight md:text-7xl lg:text-8xl">
              <span className="line block overflow-hidden">
                <span className="inline-block translate-y-full">Somnath</span>
              </span>
              <span className="line mt-2 block overflow-hidden bg-gradient-to-r from-indigo-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                <span className="inline-block translate-y-full">Banerjee</span>
              </span>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="hero-description mx-auto mt-8 max-w-2xl px-1 text-base leading-8 text-zinc-400 md:text-xl"
            >
              Tech-startup founder and market strategist revolutionizing micro-industries through cutting-edge technology and inclusive financial education.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.32 }}
              className="hero-cta mt-10 flex flex-col items-center justify-center gap-4 px-1 sm:flex-row"
            >
              <a
                href="https://wa.me/7866049865"
                target="_blank"
                rel="noreferrer"
                className="magnetic-btn magnetic-btn-fill inline-flex items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 px-8 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-white shadow-lg shadow-violet-500/20 transition-transform duration-300 hover:-translate-y-0.5"
                onMouseEnter={() => setCursorHover(true)}
                onMouseLeave={() => setCursorHover(false)}
              >
                <span>Connect Now</span>
              </a>
              <button
                onClick={() => scrollToHash("#journey")}
                className="magnetic-btn magnetic-btn-outline inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-8 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:border-indigo-400/60 hover:bg-white/10"
                onMouseEnter={() => setCursorHover(true)}
                onMouseLeave={() => setCursorHover(false)}
              >
                <span>Explore Journey</span>
              </button>
            </motion.div>

            <div className="scroll-indicator mt-16 hidden items-center justify-center gap-4 lg:flex lg:flex-col">
              <span className="scroll-text text-[0.7rem] uppercase tracking-[0.28em] text-zinc-500 [writing-mode:vertical-rl]">Scroll</span>
              <span className="scroll-line h-16 w-px bg-gradient-to-b from-indigo-400 to-transparent" />
            </div>
          </div>
        </section>

        <div className="marquee overflow-hidden border-y border-white/5 py-6 md:py-8">
          <div className="marquee-track flex w-[200%] animate-[marquee_20s_linear_infinite]">
            <div className="marquee-content flex flex-shrink-0 gap-8 whitespace-nowrap px-4 md:gap-12 md:px-6 lg:px-10">
              {[...marqueeItems, "•", ...marqueeItems, "•"].map((item, index) => (
                <span key={`${item}-${index}`} className="marquee-item text-2xl font-extrabold tracking-tight text-white/10 md:text-4xl">
                  {item}
                </span>
              ))}
            </div>
            <div className="marquee-content flex flex-shrink-0 gap-8 whitespace-nowrap px-4 md:gap-12 md:px-6 lg:px-10">
              {[...marqueeItems, "•", ...marqueeItems, "•"].map((item, index) => (
                <span key={`dup-${item}-${index}`} className="marquee-item text-2xl font-extrabold tracking-tight text-white/10 md:text-4xl">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>

        <section id="about" className="about px-4 py-20 md:px-6 md:py-28 lg:px-10">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2 lg:items-start lg:gap-16">
            <motion.div
              className="about-image-wrapper reveal group relative mx-auto w-full max-w-xl overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/5 shadow-2xl shadow-black/30"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
            >
              <img
                src="/assets/founder-openroot.avif"
                alt="Somnath Banerjee"
                className="about-image aspect-[4/5] w-full object-cover grayscale transition duration-700 group-hover:scale-105 group-hover:grayscale-0"
              />
              <div className="about-image-overlay pointer-events-none absolute inset-0 bg-gradient-to-br from-indigo-500/20 via-transparent to-transparent" />
            </motion.div>

            <div className="about-content">
              <SectionHeader label="About Me" title="Building the Future, One Innovation at a Time" />

              <div className="space-y-6 text-base leading-8 text-zinc-400 md:text-lg">
                <motion.p className="reveal" initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.4 }}>
                  I am a tech-startup founder and educator committed to revolutionizing micro-industries through cutting-edge technology. My vision is to enhance productivity, sustainability, and scalability while empowering the next generation through inclusive financial literacy and entrepreneurial education.
                </motion.p>
                <motion.p className="reveal" initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.4 }}>
                  With a background in Survey Engineering, Computer Science, and over 5 years of equity market experience, I bring a unique blend of technical expertise and financial acumen to everything I build.
                </motion.p>
              </div>

              <div className="about-stats mt-10 grid gap-4 border-t border-white/10 pt-10 sm:grid-cols-3">
                {STATS.map((stat) => (
                  <motion.div
                    key={stat.label}
                    className="stat-item rounded-[1.5rem] border border-white/10 bg-white/5 px-5 py-6 text-center backdrop-blur"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                  >
                    <div className="stat-number bg-gradient-to-r from-indigo-400 via-violet-400 to-fuchsia-400 bg-clip-text text-3xl font-extrabold text-transparent md:text-4xl" data-count={stat.value} data-suffix={stat.suffix || ""}>
                      <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                    </div>
                    <p className="stat-label mt-2 text-xs uppercase tracking-[0.18em] text-zinc-400">{stat.label}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="journey" className="journey px-4 py-20 md:px-6 md:py-28 lg:px-10">
          <SectionHeader label="My Path" title="Journey So Far" center />

          <div className="timeline mx-auto max-w-7xl">
            <div className="relative before:absolute before:inset-y-0 before:left-4 before:w-px before:bg-gradient-to-b before:from-indigo-500 before:via-violet-500 before:to-transparent md:before:left-1/2 md:before:-ml-px">
              {TIMELINE.map((item, index) => {
                const leftSide = index % 2 === 0;
                return (
                  <motion.article
                    key={`${item.title}-${index}`}
                    className={`timeline-item relative mb-8 pl-14 md:mb-0 md:w-1/2 md:pb-12 md:pl-0 ${leftSide ? "md:pr-12 md:text-right" : "md:ml-auto md:pl-12"}`}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                  >
                    <span className={`timeline-dot absolute left-0 top-7 h-5 w-5 rounded-full border-4 border-[#0a0a0f] bg-indigo-400 md:left-auto md:translate-x-1/2 ${leftSide ? "md:-right-2" : "md:-left-2"}`} />

                    <div className="timeline-content rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-6 shadow-lg shadow-black/20 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-indigo-400/30">
                      <p className="timeline-date mb-2 text-xs uppercase tracking-[0.28em] text-indigo-400">{item.period}</p>
                      <h3 className="timeline-title text-xl font-bold text-white md:text-2xl">{item.title}</h3>
                      <p className="timeline-description mt-4 text-sm leading-7 text-zinc-400 md:text-base">{item.description}</p>

                      {item.images?.length ? (
                        <div className={`timeline-images mt-5 flex flex-wrap gap-3 ${leftSide ? "md:justify-end" : ""}`}>
                          {item.images.map((img) => (
                            <img
                              key={img.src}
                              src={img.src}
                              alt={img.alt}
                              className="h-20 w-32 rounded-xl object-cover grayscale transition duration-300 hover:scale-105 hover:grayscale-0"
                            />
                          ))}
                        </div>
                      ) : null}
                    </div>
                  </motion.article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="vision relative flex min-h-[70vh] items-center justify-center overflow-hidden px-4 py-24 text-center md:px-6 md:py-32 lg:px-10">
          <div className="vision-bg-text absolute inset-0 flex items-center justify-center text-[clamp(4rem,15vw,12rem)] font-black tracking-[0.25em] text-white/5 select-none">
            VISION
          </div>
          <div className="vision-content relative z-[2] mx-auto max-w-5xl px-2">
            <span className="section-label mb-5 block text-xs font-semibold uppercase tracking-[0.35em] text-indigo-400">
              My Mission
            </span>
            <p className="vision-quote text-2xl font-semibold leading-[1.65] text-white md:text-4xl">
              “To <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent">revolutionize micro-industries</span> by leveraging cutting-edge technology that enhances productivity, sustainability, and scalability—while <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent">empowering the next generation</span> through inclusive financial literacy, entrepreneurial education, and equitable access to growth opportunities.”
            </p>
          </div>
        </section>

        <section id="skills" className="skills px-4 py-20 md:px-6 md:py-28 lg:px-10">
          <SectionHeader label="Expertise" title="Skills & Capabilities" center />

          <div className="skills-grid mx-auto grid max-w-7xl gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {SKILLS.map((skill, index) => (
              <motion.div
                key={skill.title}
                className="skill-card group relative overflow-hidden rounded-[1.6rem] border border-white/10 bg-white/[0.03] p-7 shadow-lg shadow-black/20 transition duration-300 hover:-translate-y-2 hover:border-indigo-400/30"
                initial={{ opacity: 0, y: 30, scale: 0.97 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/0 via-violet-500/0 to-fuchsia-500/0 transition duration-500 group-hover:from-indigo-500/10 group-hover:via-violet-500/10 group-hover:to-fuchsia-500/10" />
                <div className="relative">
                  <div className="skill-icon mb-5 text-4xl">{skill.icon}</div>
                  <h3 className="skill-title text-xl font-bold text-white">{skill.title}</h3>
                  <p className="skill-description mt-4 text-sm leading-7 text-zinc-400 md:text-base">{skill.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        <section id="contact" className="contact px-4 py-20 md:px-6 md:py-28 lg:px-10">
          <div className="contact-content mx-auto max-w-4xl text-center">
            <span className="section-label mb-4 block text-xs font-semibold uppercase tracking-[0.35em] text-indigo-400">
              Get In Touch
            </span>
            <h2 className="contact-title text-4xl font-black leading-tight md:text-6xl">
              Let&apos;s Build Something <br />
              Impactful <br />
              <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                Together
              </span>
            </h2>
            <p className="contact-email mt-8 text-lg text-zinc-400 md:text-2xl">
              Ready to collaborate?{' '}
              <a
                href="https://wa.me/7866049865"
                target="_blank"
                rel="noreferrer"
                className="relative font-semibold text-indigo-400 underline decoration-indigo-400/30 underline-offset-4 transition hover:text-indigo-300"
              >
                Connect on WhatsApp
              </a>
            </p>

            <div className="social-links mt-12 flex flex-wrap items-center justify-center gap-4">
              <SocialLink href="https://openroot.in" label="Website">
                <Globe className="h-5 w-5" />
              </SocialLink>
              <SocialLink href="https://openroot.in/software/openroot-classes" label="Classes">
                <BookOpen className="h-5 w-5" />
              </SocialLink>
              <SocialLink href="https://wa.me/7866049865" label="WhatsApp">
                <MessageCircle className="h-5 w-5" />
              </SocialLink>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer relative z-[2] flex flex-col gap-5 border-t border-white/5 px-4 py-8 text-center md:flex-row md:items-center md:justify-between md:px-6 md:text-left lg:px-10">
        <p className="footer-text text-sm text-zinc-500">© 2026 Somnath Banerjee - Openroot Systems. All rights reserved.</p>
        <div className="footer-links flex flex-wrap justify-center gap-5 text-sm text-zinc-400">
          <a className="footer-link transition hover:text-indigo-400" href="https://openroot.in" target="_blank" rel="noreferrer">
            OPENROOT
          </a>
          <a
            className="footer-link transition hover:text-indigo-400"
            href="https://openroot.in/software/openroot-classes"
            target="_blank"
            rel="noreferrer"
          >
            OPENROOT CLASSES
          </a>
        </div>
      </footer>

      <button
        onClick={() => window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" })}
        className={`back-to-top fixed bottom-5 right-5 z-[40] inline-flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 text-white shadow-lg shadow-black/30 transition duration-300 hover:-translate-y-1 hover:scale-105 md:bottom-6 md:right-6 ${showTop ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"}`}
        aria-label="Back to top"
      >
        <ArrowUp className="h-5 w-5" />
      </button>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
