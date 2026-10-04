import React, { Suspense, lazy, useEffect, useState } from "react";
import "../components/styles/SoftwareSolutions.css";

const Lottie = lazy(() => import("lottie-react"));

// ─── Contact ──────────────────────────────────────────────────────────────────
const WHATSAPP_URL =
  "https://wa.me/917866049865?text=Hi%20There!%20I%20want%20to%20discuss%20a%20project.";

// ─── Data ─────────────────────────────────────────────────────────────────────
const FACTS = [
  { label: "Pricing", value: "Fixed quote before work starts" },
  { label: "Support", value: "Direct, on WhatsApp, call or email" },
  { label: "After launch", value: "Updates and maintenance included in year one" },
];

const PAIN_POINTS = [
  {
    title: "You searched online and got overwhelmed",
    body: "There are hundreds of agencies and very little clarity on pricing or who to trust. Many quote low, then add charges months later.",
  },
  {
    title: "You were burned before",
    body: "A freelancer delivered a site that broke, or it worked for a week and then crashed, and nobody answered the phone. You are still paying for something that does not work.",
  },
  {
    title: "Technology feels like a different language",
    body: "You run a good offline business in manufacturing, retail or services. Going online should not mean learning a new vocabulary.",
  },
];

const SERVICES = [
  {
    label: "Websites",
    desc: "Clean, fast, mobile-first websites that load quickly, rank in search and turn visitors into enquiries.",
    details: ["Landing pages", "Business portfolios", "Product catalogues", "Blog and content sites"],
  },
  {
    label: "Web applications",
    desc: "Systems that do real work: booking, inventory, dashboards and portals. Tools your business can run on.",
    details: ["Customer portals", "Booking and scheduling", "Inventory dashboards", "Admin panels"],
  },
  {
    label: "Desktop applications",
    desc: "Offline-first software for businesses that cannot depend on the internet. Everything runs locally and fast.",
    details: ["Billing software", "POS systems", "Data management tools", "Offline-first tools"],
  },
  {
    label: "Automation tools",
    desc: "Replace repetitive manual work with scripts that finish in seconds instead of hours.",
    details: ["Report generation", "Email and WhatsApp alerts", "Data sync and exports", "Scheduled tasks"],
  },
  {
    label: "Custom solutions",
    desc: "For problems that do not fit a template: multi-role platforms, integrations, APIs and payment gateways.",
    details: ["Multi-role platforms", "API integrations", "Payment gateways", "Third-party services"],
  },
];

const WHY_US = [
  {
    title: "You own everything",
    body: "Your domain, your hosting and your code belong to you. Nothing is held back if you decide to move on.",
  },
  {
    title: "Pricing you can plan around",
    body: "The full cost is stated upfront and maintenance is itemised. No small monthly charge that quietly grows.",
  },
  {
    title: "Direct support",
    body: "You reach the people who built your product on WhatsApp, call or email. There is no ticket queue.",
  },
  {
    title: "Fast by default",
    body: "Optimised load times, mobile-first layouts and SEO groundwork from the first release.",
  },
  {
    title: "Maintained long term",
    body: "We handle updates, security patches and technology changes, so the product keeps working as it did on launch day.",
  },
  {
    title: "Room to grow",
    body: "If a simple site grows into something bigger, we extend it. You do not have to start again with a new agency.",
  },
];

const BUILD_PRICES: Array<[string, string]> = [
  ["Simple website", "₹2,999 – ₹5,000"],
  ["Business website", "₹5,000 – ₹8,000"],
  ["Web application", "₹8,000 – ₹15,000+"],
  ["Desktop app or automation", "Quoted by scope"],
];

const MAINTENANCE_ITEMS: Array<[string, string]> = [
  ["Security and software updates", "Included"],
  ["Minor content changes", "Included"],
  ["Uptime monitoring", "Included"],
  ["Complex feature additions", "Quoted separately"],
];

const COMPARISON: Array<[string, string, string]> = [
  ["Fixed pricing upfront", "Not usually", "Yes"],
  ["You own your files and domain", "Not usually", "Yes"],
  ["Reachable after launch", "Not usually", "Yes"],
  ["Reasonable maintenance cost", "Not usually", "Yes"],
  ["Long-term working relationship", "Not usually", "Yes"],
];

const PROCESS_STEPS = [
  {
    n: "01",
    title: "Book a free call",
    body: "A 15-minute Google Meet. We listen to what you need, with no sales pitch.",
  },
  {
    n: "02",
    title: "We learn your business",
    body: "We ask about your goals, your customers and the tools you already use, so nothing is missed.",
  },
  {
    n: "03",
    title: "You get a clear plan",
    body: "A written scope, a fixed price and a realistic timeline. You approve it before anything is built.",
  },
  {
    n: "04",
    title: "We build, you review",
    body: "You see progress as it happens and approve each milestone. We stay in touch throughout.",
  },
  {
    n: "05",
    title: "Launch and handover",
    body: "We launch, show you how to manage it, and stay reachable afterwards. You get a direct number to call.",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState<boolean>(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return reduced;
}

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="ss-wa-icon" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.121 1.532 5.849L.057 23.886a.5.5 0 00.611.61l6.037-1.476A11.95 11.95 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.025-1.383l-.36-.215-3.733.912.946-3.646-.235-.374A9.818 9.818 0 1112 21.818z" />
  </svg>
);

/** Loads a Lottie JSON file from /public and reports loading failures. */
function useLottieData(url: string): { data: object | null; failed: boolean } {
  const [data, setData] = useState<object | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    fetch(url, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`Animation not found: ${url}`);
        return res.json();
      })
      .then((json: object) => setData(json))
      .catch((err: unknown) => {
        if ((err as { name?: string })?.name !== "AbortError") {
          setFailed(true);
        }
      });

    return () => controller.abort();
  }, [url]);

  return { data, failed };
}

/** Framed animation cell. Same size and zoom wherever it is used. */
function LottieFrame({
  data,
  reduced,
}: {
  data: object | null;
  reduced: boolean;
}) {
  // Use the animation's own width / height so small screens never crop it.
  const size = data as { w?: number; h?: number } | null;
  const ratio = size?.w && size?.h ? `${size.w} / ${size.h}` : "1 / 1";

  return (
    <div
      className="ss-visual"
      style={{ "--ss-ratio": ratio } as React.CSSProperties}
      aria-hidden="true"
    >
      {data ? (
        <Suspense fallback={null}>
          <Lottie
            animationData={data}
            loop={!reduced}
            autoplay={!reduced}
            className="ss-lottie"
            rendererSettings={{ preserveAspectRatio: "xMidYMid slice" }}
          />
        </Suspense>
      ) : null}
    </div>
  );
}

function SectionHead({
  id,
  title,
  text,
}: {
  id: string;
  title: string;
  text?: string;
}) {
  return (
    <div className="ss-head">
      <h2 id={id} className="ss-h2">
        {title}
      </h2>
      {text && <p className="ss-text">{text}</p>}
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────
const SoftwareSolutions: React.FC = () => {
  const reduced = usePrefersReducedMotion();

  const hero = useLottieData("/lotties/software.json");
  const mission = useLottieData("/lotties/mission.json");

  return (
    <main className="ss-page">
      <div className="ss-shell">
        {/* ── HERO ───────────────────────────────────────────────────────── */}
        <section className="ss-hero" aria-labelledby="ss-title">
          <div className={`ss-hero-grid ${hero.failed ? "ss-hero-grid--single" : ""}`}>
            <div className="ss-hero-copy">
              <span className="ss-label">Software solutions by Openroot Systems</span>

              <h1 id="ss-title" className="ss-h1">
                Your business deserves more than a broken website.
              </h1>

              <p className="ss-lead">
                We build websites, web apps, desktop tools and automation for
                small businesses and startups. Plain language, fixed pricing,
                and support that answers.
              </p>

              <div className="ss-actions">
                <a
                  className="ss-btn ss-btn--primary"
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <WhatsAppIcon />
                  Chat on WhatsApp
                </a>
                <a className="ss-btn ss-btn--ghost" href="#process">
                  See how it works
                </a>
              </div>
            </div>

            {!hero.failed && <LottieFrame data={hero.data} reduced={reduced} />}
          </div>

          <div className="ss-facts">
            {FACTS.map((fact) => (
              <div key={fact.label} className="ss-fact">
                <span className="ss-label">{fact.label}</span>
                <span className="ss-fact-value">{fact.value}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── PROBLEMS ───────────────────────────────────────────────────── */}
        <section className="ss-section" aria-labelledby="ss-pain">
          <SectionHead
            id="ss-pain"
            title="What usually goes wrong"
            text="Most of our clients came to us after a bad experience with an earlier vendor. These are the three we hear most."
          />

          <div className="ss-grid ss-grid--3">
            {PAIN_POINTS.map((p) => (
              <article key={p.title} className="ss-cell">
                <h3 className="ss-h3">{p.title}</h3>
                <p className="ss-body">{p.body}</p>
              </article>
            ))}
          </div>
        </section>

        {/* ── SERVICES ───────────────────────────────────────────────────── */}
        <section className="ss-section" aria-labelledby="ss-services">
          <SectionHead
            id="ss-services"
            title="What we build"
            text="From a simple business site to a full web application. We scope each project so you pay for what you need."
          />

          <div className="ss-grid ss-grid--services">
            {SERVICES.map((s) => (
              <article key={s.label} className="ss-cell ss-cell--service">
                <h3 className="ss-h3">{s.label}</h3>
                <p className="ss-body">{s.desc}</p>
                <ul className="ss-lines">
                  {s.details.map((d) => (
                    <li key={d}>{d}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        {/* ── WHY OPENROOT ───────────────────────────────────────────────── */}
        <section className="ss-section" aria-labelledby="ss-why">
          <SectionHead
            id="ss-why"
            title="How we work"
            text="Anyone can build a website. What matters is whether it still works, and whether someone answers, a year later."
          />

          <div className="ss-grid ss-grid--3">
            {WHY_US.map((w) => (
              <article key={w.title} className="ss-cell">
                <h3 className="ss-h3">{w.title}</h3>
                <p className="ss-body">{w.body}</p>
              </article>
            ))}
          </div>
        </section>

        {/* ── PRICING ────────────────────────────────────────────────────── */}
        <section className="ss-section" aria-labelledby="ss-pricing">
          <SectionHead
            id="ss-pricing"
            title="Pricing"
            text="These are the ranges we work in. Every project gets a fixed written quote before any work begins."
          />

          <div className="ss-grid ss-grid--2">
            <article className="ss-cell ss-cell--price">
              <span className="ss-label">One-time build cost</span>
              <p className="ss-price">₹2,999 – ₹10,000</p>
              <p className="ss-body">
                Scope-based and fixed. You approve the number before we start.
              </p>
              <ul className="ss-rows">
                {BUILD_PRICES.map(([name, value]) => (
                  <li key={name}>
                    <span>{name}</span>
                    <strong>{value}</strong>
                  </li>
                ))}
              </ul>
            </article>

            <article className="ss-cell ss-cell--price">
              <span className="ss-label">Annual maintenance</span>
              <p className="ss-price">
                ₹3,000 – ₹6,000<span className="ss-price-unit"> / year</span>
              </p>
              <p className="ss-body">
                Starts after the first free year. Covers security updates,
                server health, minor content changes and uptime monitoring.
              </p>
              <ul className="ss-rows">
                {MAINTENANCE_ITEMS.map(([name, value]) => (
                  <li key={name}>
                    <span>{name}</span>
                    <strong>{value}</strong>
                  </li>
                ))}
              </ul>
            </article>
          </div>

          <div className="ss-compare">
            <h3 className="ss-h3">How we compare</h3>
            <div className="ss-table-wrap">
              <table className="ss-table">
                <thead>
                  <tr>
                    <th scope="col">What you would expect</th>
                    <th scope="col">Typical agency</th>
                    <th scope="col">Openroot</th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARISON.map(([feature, them, us]) => (
                    <tr key={feature}>
                      <td>{feature}</td>
                      <td className="ss-table-muted">{them}</td>
                      <td className="ss-table-strong">{us}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ── PROCESS ────────────────────────────────────────────────────── */}
        <section className="ss-section" id="process" aria-labelledby="ss-process">
          <SectionHead
            id="ss-process"
            title="From first call to launch"
            text="You do not need to know anything about technology. Turning your business goals into software is our job."
          />

          <div className={`ss-process-grid ${mission.failed ? "ss-process-grid--single" : ""}`}>
            <ol className="ss-steps">
              {PROCESS_STEPS.map((s) => (
                <li key={s.n} className="ss-step">
                  <span className="ss-step-n">{s.n}</span>
                  <div className="ss-step-body">
                    <h3 className="ss-h3">{s.title}</h3>
                    <p className="ss-body">{s.body}</p>
                  </div>
                </li>
              ))}
            </ol>

            {!mission.failed && (
              <div className="ss-process-visual">
                <LottieFrame data={mission.data} reduced={reduced} />
              </div>
            )}
          </div>
        </section>

        {/* ── APPROACH ───────────────────────────────────────────────────── */}
        <section className="ss-section" aria-labelledby="ss-approach">
          <div className="ss-split">
            <h2 id="ss-approach" className="ss-h2">
              We grow when you grow.
            </h2>

            <div className="ss-prose">
              <p>
                We do not aim for one-time payments. We aim for clients who stay
                because the work is honest, the pricing is fair and the software
                actually helps their business.
              </p>
              <p>
                Every client is a long-term relationship. Your results are our
                case study, and your referral is our best marketing.
              </p>
            </div>
          </div>
        </section>

        {/* ── CTA ────────────────────────────────────────────────────────── */}
        <section className="ss-cta" aria-labelledby="ss-cta-title">
          <div>
            <h2 id="ss-cta-title" className="ss-h2">
              Your first step costs ₹0.
            </h2>
            <p className="ss-text">
              Book a free 15-minute Google Meet. You leave with a clear idea of
              what you need, whether or not you hire us.
            </p>
          </div>

          <div className="ss-cta-actions">
            <a
              className="ss-btn ss-btn--primary"
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              <WhatsAppIcon />
              Start on WhatsApp
            </a>
          </div>
        </section>
      </div>
    </main>
  );
};

export default SoftwareSolutions;