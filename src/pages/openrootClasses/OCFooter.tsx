"use client";

import { useEffect, useRef } from "react";
import "../openrootClasses/OCStyle/OCFooter.css";

export default function Footer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf: number;
    const particles: {
      x: number;
      y: number;
      vx: number;
      vy: number;
      r: number;
      a: number;
      da: number;
    }[] = [];

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    resize();
    window.addEventListener("resize", resize);

    for (let i = 0; i < 55; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        r: Math.random() * 1.4 + 0.4,
        a: Math.random(),
        da: (Math.random() - 0.5) * 0.004,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.a += p.da;

        if (p.a < 0.05) p.da = Math.abs(p.da);
        if (p.a > 0.65) p.da = -Math.abs(p.da);

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(201, 169, 110, ${p.a})`;
        ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <footer id="oc-footer" className="oc-footer" aria-label="Site footer">
      <canvas ref={canvasRef} className="oc-footer__canvas" aria-hidden="true" />
      <div className="oc-footer__rule" aria-hidden="true" />

      <div className="oc-footer__container">
        <div className="oc-footer__left">
          <span className="oc-footer__eyebrow">Let's connect</span>

          <h2 className="oc-footer__headline">
            Built with<br />
            <em>purpose</em> &amp;<br />
            precision.
          </h2>

          <p className="oc-footer__tagline">
            Software that respects your time. Courses that respect your
            intelligence. Come say hello.
          </p>

          <nav className="oc-footer__links" aria-label="Footer navigation">
            {[
              { label: "LinkedIn", href: "https://in.linkedin.com/in/comeonsom" },
              { label: "GitHub", href: "https://github.com/COMEONSOM" },
              { label: "Instagram", href: "https://instagram.com/comeonsom" },
              { label: "X", href: "https://x.com/comeonsomx" },
            ].map(({ label, href }) => (
              <a
                key={label}
                href={href}
                className="oc-footer__link"
                target={href.startsWith("http") ? "_blank" : undefined}
                rel={href.startsWith("http") ? "noreferrer" : undefined}
              >
                {label}
              </a>
            ))}
          </nav>
        </div>

        <div className="oc-footer__divider" aria-hidden="true">
          <div className="oc-footer__divider-line" />
          <span className="oc-footer__divider-glyph">✦</span>
          <div className="oc-footer__divider-line" />
        </div>

        <div className="oc-footer__right">
          <a
            href="https://in.linkedin.com/in/comeonsom"
            target="_blank"
            rel="noreferrer"
            className="oc-profile-card"
            aria-label="Visit Somnath Banerjee's LinkedIn profile"
          >
            <div className="oc-profile-card__border" aria-hidden="true" />

            <div className="oc-profile-card__avatar-wrap">
              <div className="oc-profile-card__avatar-ring" aria-hidden="true" />
              <div className="oc-profile-card__avatar">
                <span className="oc-profile-card__initials">SB</span>
              </div>
            </div>

            <div className="oc-profile-card__identity">
              <p className="oc-profile-card__name">Somnath Banerjee</p>
              <p className="oc-profile-card__role">Founder &amp; Developer</p>
              <p className="oc-profile-card__company">Openroot Systems · Kolkata, IN</p>
            </div>

            <div className="oc-profile-card__sep" aria-hidden="true" />

            <div className="oc-profile-card__stats">
              {[
                { val: "3+", label: "Yrs exp." },
                { val: "12+", label: "Projects" },
                { val: "2", label: "Verticals" },
              ].map(({ val, label }) => (
                <div key={label} className="oc-profile-card__stat">
                  <span className="oc-profile-card__stat-val">{val}</span>
                  <span className="oc-profile-card__stat-label">{label}</span>
                </div>
              ))}
            </div>

            <div className="oc-profile-card__cta">
              <svg
                className="oc-profile-card__li-icon"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M20.447 20.452H16.89v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a1.981 1.981 0 01-1.98-1.98c0-1.093.887-1.98 1.98-1.98s1.98.887 1.98 1.98a1.981 1.981 0 01-1.98 1.98zm1.692 13.019H3.643V9h3.386v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
              <span>View LinkedIn Profile</span>
              <svg
                className="oc-profile-card__arrow"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M3 8h10M9 4l4 4-4 4" />
              </svg>
            </div>

            <div className="oc-profile-card__status">
              <span className="oc-profile-card__status-dot" aria-hidden="true" />
              Open to collaborations
            </div>
          </a>
        </div>
      </div>

      <div className="oc-footer__bottom">
        <span className="oc-footer__copy">© {new Date().getFullYear()} Openroot Systems</span>
        <span className="oc-footer__bottom-rule" aria-hidden="true" />
        <span className="oc-footer__rights">All rights reserved</span>
      </div>
    </footer>
  );
}