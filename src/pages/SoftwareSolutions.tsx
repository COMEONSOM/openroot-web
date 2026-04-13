import React, { useEffect, useRef } from "react";
import "../components/styles/SoftwareSolutions.css";

// ─── ICON HELPERS ────────────────────────────────────────────────────────────
const Icon = ({ d }: { d: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
    className="ss-icon" aria-hidden="true">
    <path d={d} />
  </svg>
);

// ─── DATA ─────────────────────────────────────────────────────────────────────
const PAIN_POINTS = [
  {
    icon: "M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    title: "You searched online, got overwhelmed",
    body: "Hundreds of agencies, zero clarity on pricing, zero idea who to trust. Most quote low — then hit you with a ₹30,000 surprise bill six months later.",
  },
  {
    icon: "M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z",
    title: "You got burned before",
    body: "A freelancer delivered a broken website. Or it looked great day one, then crashed. Nobody picked up the phone. You're still paying for a site that doesn't work.",
  },
  {
    icon: "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4",
    title: "You think tech is not for you",
    body: "You run a great offline business. Manufacturing, retail, services — you're good at what you do. But every time you try to go online, it feels like a different language.",
  },
];

const SERVICES = [
  {
    icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
    label: "Websites",
    tag: "Most Popular",
    desc: "Clean, fast, mobile-first websites built to actually load, rank, and convert — not just look pretty in a screenshot.",
    details: ["Landing pages", "Business portfolios", "Product catalogues", "Blog & content sites"],
  },
  {
    icon: "M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18",
    label: "Web Applications",
    tag: "High Value",
    desc: "Dynamic systems that do real work — booking, inventory, dashboards, portals. Not just pages, but tools your business runs on.",
    details: ["Customer portals", "Booking & scheduling", "Inventory dashboards", "Admin panels"],
  },
  {
    icon: "M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
    label: "Desktop Applications",
    tag: "Windows",
    desc: "Offline-first tools for businesses that need software without depending on internet. Billing, POS, data management — all local and fast.",
    details: ["Billing software", "POS systems", "Data management tools", "Offline-first tools"],
  },
  {
    icon: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15",
    label: "Automation Tools",
    tag: "Save Hours",
    desc: "Stop doing manually what a script can do in seconds. From data exports to report generation to notification pipelines — we automate the boring.",
    details: ["Report generation", "Email/WhatsApp alerts", "Data sync & exports", "Scheduled tasks"],
  },
  {
    icon: "M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z",
    label: "Custom Solutions",
    tag: "Enterprise",
    desc: "Complex problems that don't fit a template. Multi-role platforms, integrations, APIs, payment gateways — we've built them all.",
    details: ["Multi-role platforms", "API integrations", "Payment gateways", "Third-party services"],
  },
];

const PROCESS_STEPS = [
  { n: "01", title: "Book a Free Meet", body: "15 minutes on Google Meet. No sales pitch, no pressure. We just listen to what you need." },
  { n: "02", title: "We Understand Your Business", body: "We ask the right questions — your goals, your customers, your existing tools — so nothing gets missed." },
  { n: "03", title: "We Give You a Clear Plan", body: "A written scope, a fixed price, a realistic timeline. No surprises. You approve before anything is built." },
  { n: "04", title: "We Build & You Review", body: "You see progress in real time. Every milestone gets your sign-off. We don't disappear and return three months later." },
  { n: "05", title: "Launch & Handoff", body: "We launch, we train you to manage it, and we don't vanish. You get our number. You can actually reach us." },
];

const WHY_US = [
  { icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z", title: "No Lock-In Traps", body: "Your domain, your hosting, your code — it belongs to you. We don't hold your business hostage." },
  { icon: "M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z", title: "Honest Pricing", body: "We tell you the full cost upfront. Maintenance is transparent. No ₹500/month surprise that becomes ₹5,000." },
  { icon: "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z", title: "We Actually Pick Up", body: "Real humans, real support. WhatsApp, call, email — we respond. Not a ticket system. Not 72-hour SLA." },
  { icon: "M13 10V3L4 14h7v7l9-11h-7z", title: "Built for Speed", body: "Optimised load times, mobile-first, SEO-ready from day one. A slow site is a dead site — we know that." },
  { icon: "M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 4a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4", title: "Maintained Long-Term", body: "We handle updates, security patches, and tech changes so your site works in 2026 just as well as it did on launch day." },
  { icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z", title: "We Grow With You", body: "Started with a simple site? As your business scales, we scale with you. No need to start over with a new agency." },
];

// ─── COMPONENT ────────────────────────────────────────────────────────────────
const SoftwareSolutions: React.FC = () => {
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add("ss-visible");
          observerRef.current?.unobserve(e.target);
        }
      }),
      { threshold: 0.12 }
    );

    document.querySelectorAll(".ss-reveal").forEach(el =>
      observerRef.current?.observe(el)
    );

    return () => observerRef.current?.disconnect();
  }, []);

  const handleWhatsApp = () => {
    window.open("https://wa.me/91XXXXXXXXXX?text=Hi%20Openroot!%20I%20want%20to%20discuss%20a%20project.", "_blank", "noopener,noreferrer");
  };

  return (
    <main className="ss-page">

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="ss-hero">
        <div className="ss-hero-glow" aria-hidden="true" />
        <div className="ss-hero-grid" aria-hidden="true" />
        <div className="ss-container">
          <div className="ss-eyebrow ss-reveal">Software Solutions · Openroot</div>
          <h1 className="ss-hero-title ss-reveal">
            Your Business Deserves<br />
            <span className="ss-gradient-text">More Than a Broken Website</span>
          </h1>
          <p className="ss-hero-sub ss-reveal">
            We build websites, web apps, desktop tools, and automation systems
            for small businesses and startups — with zero technical jargon,
            fixed pricing, and support that actually responds.
          </p>
          <div className="ss-hero-ctas ss-reveal">
            <button className="ss-btn-primary" onClick={handleWhatsApp}>
              <svg viewBox="0 0 24 24" fill="currentColor" className="ss-wa-icon" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.121 1.532 5.849L.057 23.886a.5.5 0 00.611.61l6.037-1.476A11.95 11.95 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.025-1.383l-.36-.215-3.733.912.946-3.646-.235-.374A9.818 9.818 0 1112 21.818z" />
              </svg>
              Chat on WhatsApp
            </button>
            <a href="#process" className="ss-btn-ghost">See How It Works ↓</a>
          </div>

          {/* TRUST BAR */}
          <div className="ss-trust-bar ss-reveal">
            {["Fixed Pricing", "No Lock-In", "Real Support", "Long-Term Maintenance"].map(t => (
              <span key={t} className="ss-trust-chip">
                <span className="ss-trust-dot" aria-hidden="true" />
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── PAIN POINTS ───────────────────────────────────────────────────── */}
      <section className="ss-section ss-pain">
        <div className="ss-container">
          <div className="ss-section-header ss-reveal">
            <span className="ss-eyebrow">Sound Familiar?</span>
            <h2 className="ss-section-title">
              We Know Exactly<br />
              <span className="ss-gradient-text">What You've Been Through</span>
            </h2>
            <p className="ss-section-sub">
              Most of our clients came to us after a bad experience. We're not judging — we're here to fix it.
            </p>
          </div>
          <div className="ss-pain-grid">
            {PAIN_POINTS.map((p, i) => (
              <article key={i} className="ss-pain-card ss-reveal" style={{ "--delay": `${i * 0.1}s` } as React.CSSProperties}>
                <div className="ss-pain-icon-wrap">
                  <Icon d={p.icon} />
                </div>
                <h3 className="ss-pain-title">{p.title}</h3>
                <p className="ss-pain-body">{p.body}</p>
              </article>
            ))}
          </div>
          <p className="ss-pain-closer ss-reveal">
            If any of this hit home — you're in the right place.
          </p>
        </div>
      </section>

      {/* ── WHAT WE BUILD ─────────────────────────────────────────────────── */}
      <section className="ss-section ss-services">
        <div className="ss-container">
          <div className="ss-section-header ss-reveal">
            <span className="ss-eyebrow">Our Services</span>
            <h2 className="ss-section-title">
              Whatever You Need,<br />
              <span className="ss-gradient-text">We Build It Right</span>
            </h2>
            <p className="ss-section-sub">
              From a simple business card site to a full-scale web application —
              we've done it all, and we know how to scope it so you don't overpay.
            </p>
          </div>
          <div className="ss-services-grid">
            {SERVICES.map((s, i) => (
              <article key={i} className="ss-service-card ss-reveal" style={{ "--delay": `${i * 0.08}s` } as React.CSSProperties}>
                <div className="ss-service-top">
                  <div className="ss-service-icon-wrap">
                    <Icon d={s.icon} />
                  </div>
                  <span className="ss-service-tag">{s.tag}</span>
                </div>
                <h3 className="ss-service-title">{s.label}</h3>
                <p className="ss-service-desc">{s.desc}</p>
                <ul className="ss-service-list">
                  {s.details.map((d, j) => (
                    <li key={j}>{d}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY OPENROOT ──────────────────────────────────────────────────── */}
      <section className="ss-section ss-why">
        <div className="ss-container">
          <div className="ss-section-header ss-reveal">
            <span className="ss-eyebrow">Why Openroot</span>
            <h2 className="ss-section-title">
              We Don't Just Build.<br />
              <span className="ss-gradient-text">We Take Responsibility.</span>
            </h2>
            <p className="ss-section-sub">
              Anyone can build a website. Very few will stand behind it a year later.
              Here's what actually makes us different.
            </p>
          </div>
          <div className="ss-why-grid">
            {WHY_US.map((w, i) => (
              <article key={i} className="ss-why-card ss-reveal" style={{ "--delay": `${i * 0.07}s` } as React.CSSProperties}>
                <div className="ss-why-icon-wrap">
                  <Icon d={w.icon} />
                </div>
                <h3 className="ss-why-title">{w.title}</h3>
                <p className="ss-why-body">{w.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ───────────────────────────────────────────────────────── */}
      <section className="ss-section ss-pricing">
        <div className="ss-container">
          <div className="ss-section-header ss-reveal">
            <span className="ss-eyebrow">Transparent Pricing</span>
            <h2 className="ss-section-title">
              No Hidden Fees.<br />
              <span className="ss-gradient-text">No Nasty Surprises.</span>
            </h2>
            <p className="ss-section-sub">
              We publish what others hide. Before you speak to us, here's exactly what to expect.
            </p>
          </div>

          <div className="ss-pricing-cards ss-reveal">
            {/* BUILD COST */}
            <div className="ss-pricing-card ss-pricing-card--build">
              <div className="ss-pricing-card-label">One-time Build Cost</div>
              <div className="ss-pricing-range">₹2,999 – ₹10,000</div>
              <p className="ss-pricing-note">
                Scope-based, fixed quote. You approve the number before we write a single line of code.
              </p>
              <ul className="ss-pricing-list">
                <li>Simple website: <strong>₹2,999 – ₹5,000</strong></li>
                <li>Business website: <strong>₹5,000 – ₹8,000</strong></li>
                <li>Web application: <strong>₹8,000 – ₹15,000+</strong></li>
                <li>Desktop app / Automation: <strong>Quoted by scope</strong></li>
              </ul>
            </div>

            {/* MAINTENANCE */}
            <div className="ss-pricing-card ss-pricing-card--maint">
              <div className="ss-pricing-card-label">Annual Maintenance</div>
              <div className="ss-pricing-range">₹3,000 – ₹6,000<span className="ss-pricing-per">/yr</span></div>
              <p className="ss-pricing-note">
                After your first free year. Covers security updates, server health, minor content changes, and uptime monitoring.
              </p>
              <ul className="ss-pricing-list">
                <li>Security & software updates <strong>Included</strong></li>
                <li>Minor content changes <strong>Included</strong></li>
                <li>Uptime monitoring <strong>Included</strong></li>
                <li>Complex feature additions <strong>Quoted separately</strong></li>
              </ul>
            </div>
          </div>

          {/* COMPARISON */}
          <div className="ss-compare ss-reveal">
            <h3 className="ss-compare-title">How We Compare</h3>
            <div className="ss-compare-table-wrap">
              <table className="ss-compare-table">
                <thead>
                  <tr>
                    <th>What You Expect</th>
                    <th className="ss-col-them">Most Agencies</th>
                    <th className="ss-col-us">Openroot ✓</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Upfront fixed pricing", "❌ Quote changes", "✅ Always fixed"],
                    ["Own your files & domain", "❌ Locked in", "✅ Yours fully"],
                    ["Reachable after launch", "❌ Radio silence", "✅ WhatsApp / call"],
                    ["Reasonable maintenance", "❌ ₹10k+/year", "✅ ₹3–6k/year"],
                    ["Long-term relationship", "❌ One & done", "✅ We grow with you"],
                  ].map(([feat, them, us], i) => (
                    <tr key={i}>
                      <td>{feat}</td>
                      <td className="ss-col-them">{them}</td>
                      <td className="ss-col-us">{us}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* ── PROCESS ───────────────────────────────────────────────────────── */}
      <section className="ss-section ss-process" id="process">
        <div className="ss-container">
          <div className="ss-section-header ss-reveal">
            <span className="ss-eyebrow">Our Process</span>
            <h2 className="ss-section-title">
              From Idea to Launch —<br />
              <span className="ss-gradient-text">No Technical Stress</span>
            </h2>
            <p className="ss-section-sub">
              You don't need to know anything about technology. We translate your
              business goals into software — that's our job.
            </p>
          </div>
          <ol className="ss-process-list">
            {PROCESS_STEPS.map((s, i) => (
              <li key={i} className="ss-process-step ss-reveal" style={{ "--delay": `${i * 0.1}s` } as React.CSSProperties}>
                <div className="ss-process-number">{s.n}</div>
                <div className="ss-process-content">
                  <h3 className="ss-process-title">{s.title}</h3>
                  <p className="ss-process-body">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── PHILOSOPHY ────────────────────────────────────────────────────── */}
      <section className="ss-section ss-philosophy">
        <div className="ss-container">
          <div className="ss-philosophy-inner ss-reveal">
            <div className="ss-philosophy-quote-mark" aria-hidden="true">"</div>
            <blockquote className="ss-philosophy-quote">
              We grow when you grow.
            </blockquote>
            <p className="ss-philosophy-body">
              We don't optimise for one-time payments. We optimise for clients who
              stay with us because we keep earning their trust — with honest work,
              fair pricing, and software that actually helps their business.
              <br /><br />
              Every business we work with, we treat as a long-term partnership.
              Your win is our case study. Your referral is our best marketing.
              That's the only model we believe in.
            </p>
            <div className="ss-philosophy-sig">— Openroot Team</div>
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <section className="ss-section ss-cta">
        <div className="ss-cta-glow" aria-hidden="true" />
        <div className="ss-container">
          <div className="ss-cta-inner ss-reveal">
            <span className="ss-eyebrow">Let's Talk</span>
            <h2 className="ss-cta-title">
              Your First Step Costs<br />
              <span className="ss-gradient-text">Exactly ₹0</span>
            </h2>
            <p className="ss-cta-sub">
              Book a free 15-minute Google Meet. No obligation, no pressure.
              Walk away with clarity on what you need — even if you don't hire us.
            </p>
            <div className="ss-cta-actions">
              <button className="ss-btn-primary ss-btn-xl" onClick={handleWhatsApp}>
                <svg viewBox="0 0 24 24" fill="currentColor" className="ss-wa-icon" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.121 1.532 5.849L.057 23.886a.5.5 0 00.611.61l6.037-1.476A11.95 11.95 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.025-1.383l-.36-.215-3.733.912.946-3.646-.235-.374A9.818 9.818 0 1112 21.818z" />
                </svg>
                Start on WhatsApp
              </button>
            </div>
            <p className="ss-cta-reassure">
              Free consultation · No credit card · Just a conversation
            </p>
          </div>
        </div>
      </section>

    </main>
  );
};

export default SoftwareSolutions;