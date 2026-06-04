import { SITE_CONFIG } from "./config/siteConfig";
import MaintenancePage from "./pages/MaintenancePage";
import { Helmet } from "react-helmet-async";
import React, {
  Suspense,
  lazy,
  memo,
  useEffect,
  useState,
} from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { onAuthStateChanged, type User } from "firebase/auth";

import { auth } from "./lib/firebase";
import { ThemeToggle } from "./components/ThemeToggle/ThemeToggle";
import BackToTop from "./context/BackToTop";
import ScrollToTop from "./context/ScrollToTop";

import Header from "./components/Header";
import Navbar from "./components/Navbar";
import AboutCompany from "./components/about/AboutCompany";
import Footer from "./components/Footer";

import "./App.css";
import OpenrootSystems from "./pages/OpenrootSystems";

// ── Lazy pages ────────────────────────────────────────────────
const UserLoginModal = lazy(() => import("./components/LoginModal"));
const AdminLoginModal = lazy(() => import("./components/AdminLogin"));
const SoftwareHub = lazy(() => import("./pages/SoftwareHub"));
const SoftwarePage = lazy(() => import("./pages/SoftwarePage"));
const SoftwareSolutions = lazy(() => import("./pages/SoftwareSolutions"));
const FounderPortfolio = lazy(() => import("./pages/FounderPortfolio"));
const CertificateVerification = lazy(() => import("./components/CertificateVerification"));
const PrivacyPolicy = lazy(() => import("./pages/Legal/privacy-policy"));
const Terms = lazy(() => import("./pages/Legal/terms"));
const License = lazy(() => import("./pages/Legal/SoftwareLicense-coevas"));
const OpenrootGDriveSupport = lazy(() => import("./pages/Legal/openroot-GDrive-support"));
const NewsLetter = lazy(() => import("./pages/NewsLetter"));
const CoeasTerminal = lazy(() => import("./pages/coevas"));
const CoevasTerms = lazy(() => import("./pages/Legal/coevas-legal-terms"));
const Makaut = lazy(() => import("./pages/makaut"));
const TravelExpenseManager = lazy(() => import("./pages/TravelExpenseManager"));
const OCLayout = lazy(() => import("./pages/openrootClasses/OCLayout"));
const GDrive = lazy(() => import("./pages/GDrive"));

// ── SEO constants ──────────────────────────────────────────────
const SITE_URL = "https://openroot.in";
const OG_IMAGE = `${SITE_URL}/assets/OPENROOT-image.avif`;
const SITE_NAME = "Openroot Systems";
const ORG_ID = `${SITE_URL}/#organization`;

// ── Admin session ──────────────────────────────────────────────
const ADMIN_SESSION_KEY = "openrootAdmin";

interface AdminData {
  email: string;
  role: string;
  verified: boolean;
  username: string;
}

function readAdminSession(): AdminData | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(ADMIN_SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AdminData;
    return parsed?.verified ? parsed : null;
  } catch {
    return null;
  }
}

// ── Shared layout shells ──────────────────────────────────────
const HomeShell: React.FC<{ children: React.ReactNode }> = memo(({ children }) => (
  <>
    <Header />
    <Navbar />
    <main id="main-content">
      {children}
    </main>
    <Footer />
    <BackToTop />
  </>
));
HomeShell.displayName = "HomeShell";

const HeaderShell: React.FC<{ children: React.ReactNode }> = memo(({ children }) => (
  <>
    <Header />
    <main id="main-content">
      {children}
    </main>
  </>
));
HeaderShell.displayName = "HeaderShell";

// ── Loading fallback ──────────────────────────────────────────
const PageLoader = memo(() => (
  <div
    style={{
      minHeight: "60vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "14px",
      opacity: 0.4,
    }}
  >
    Initializing…
  </div>
));
PageLoader.displayName = "PageLoader";

// ── Auth guard ────────────────────────────────────────────────
const RequireAuth: React.FC<{ children: React.ReactNode }> = memo(({ children }) => {
  const [user, setUser] = useState<User | null | undefined>(undefined);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (nextUser) => {
      if (nextUser) {
        sessionStorage.setItem("openrootUserUID", nextUser.uid);
      } else {
        sessionStorage.removeItem("openrootUserUID");
      }
      setUser(nextUser);
    });
    return unsubscribe;
  }, []);

  const isAdmin = Boolean(readAdminSession());

  if (user === undefined && !isAdmin) return <PageLoader />;
  if (!user && !isAdmin) return <Navigate to="/userlogin" replace />;
  return <>{children}</>;
});
RequireAuth.displayName = "RequireAuth";

// ── Login routes ───────────────────────────────────────────────
const UserLoginRoute = memo(() => {
  const navigate = useNavigate();
  return (
    <HeaderShell>
      <Suspense fallback={<PageLoader />}>
        <UserLoginModal onClose={() => navigate("/")} />
      </Suspense>
    </HeaderShell>
  );
});
UserLoginRoute.displayName = "UserLoginRoute";

const AdminLoginRoute = memo(() => {
  const navigate = useNavigate();
  return (
    <HeaderShell>
      <Suspense fallback={<PageLoader />}>
        <AdminLoginModal onClose={() => navigate("/")} />
      </Suspense>
    </HeaderShell>
  );
});
AdminLoginRoute.displayName = "AdminLoginRoute";

// ── 404 ───────────────────────────────────────────────────────
const NotFound = memo(() => (
  <main style={{ padding: "100px", textAlign: "center" }}>
    <Helmet>
      <title>404 – Page Not Found | {SITE_NAME}</title>
      <meta name="robots" content="noindex" />
    </Helmet>
    <h1>404</h1>
    <p>Page not found</p>
  </main>
));
NotFound.displayName = "NotFound";

// ── App content ────────────────────────────────────────────────
function AppContent() {
  const location = useLocation();
  const isLoginRoute =
    location.pathname === "/userlogin" ||
    location.pathname === "/adminlogin";

  return (
    <>
      <ScrollToTop />

      {!isLoginRoute && (
        <ThemeToggle position="bottom-right" offset={24} />
      )}

      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Legacy redirects */}
          <Route path="/user-login" element={<Navigate to="/userlogin" replace />} />
          <Route path="/admin-login" element={<Navigate to="/adminlogin" replace />} />

          {/* Auth */}
          <Route path="/userlogin" element={<UserLoginRoute />} />
          <Route path="/adminlogin" element={<AdminLoginRoute />} />

          {/* ── HOME ─────────────────────────────────────────── */}
          <Route
            path="/"
            element={
              <HomeShell>
                <Helmet>
                  <title>{SITE_NAME} | Custom Software, AI Tools & Free Productivity Apps – India</title>
                  <meta
                    name="description"
                    content="Openroot Systems is a Government of India registered MSME (UDYAM-WB-14-0263034). We build custom software, AI tools, browser extensions, and offer prompt engineering & finance courses. Free tools: MAKAUT grade calculator, travel expense manager, government job updates."
                  />
                  <meta
                    name="keywords"
                    content="Openroot Systems, custom software India, AI tools India, prompt engineering course, MSME software, government job updates, MAKAUT grade calculator, finance course India"
                  />
                  <link rel="canonical" href={SITE_URL} />
                  <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large" />
                  <meta property="og:type" content="website" />
                  <meta property="og:url" content={SITE_URL} />
                  <meta property="og:site_name" content={SITE_NAME} />
                  <meta property="og:locale" content="en_IN" />
                  <meta property="og:title" content={`${SITE_NAME} | Custom Software, AI Tools & Free Productivity Apps`} />
                  <meta property="og:description" content="Government of India registered MSME. Custom software, AI assistants, prompt engineering & finance education, and free student tools." />
                  <meta property="og:image" content={OG_IMAGE} />
                  <meta name="twitter:card" content="summary_large_image" />
                  <meta name="twitter:site" content="@comeonsom_" />
                  <meta name="twitter:title" content={`${SITE_NAME} | Custom Software, AI Tools & Free Apps`} />
                  <meta name="twitter:description" content="Govt of India registered MSME. Custom software, AI tools, prompt engineering & finance courses, free MAKAUT calculator, job updates." />
                  <meta name="twitter:image" content={OG_IMAGE} />
                  <script type="application/ld+json">{JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "BreadcrumbList",
                    "itemListElement": [
                      { "@type": "ListItem", "position": 1, "name": "Openroot Systems", "item": SITE_URL }
                    ]
                  })}</script>
                </Helmet>
                <AboutCompany />
              </HomeShell>
            }
          />

          {/* ── CERTIFICATE VERIFICATION ─────────────────────── */}
          <Route
            path="/certificate-verification"
            element={
              <HeaderShell>
                <Helmet>
                  <title>Verify Openroot Certificate – Instant & Tamper-Proof | {SITE_NAME}</title>
                  <meta name="description" content="Verify the authenticity of any Openroot Systems certificate instantly using our official secure verification portal. Tamper-proof and reliable." />
                  <link rel="canonical" href={`${SITE_URL}/certificate-verification`} />
                  <meta name="robots" content="index, follow" />
                  <meta property="og:title" content="Verify Openroot Certificate – Official Verification Tool" />
                  <meta property="og:url" content={`${SITE_URL}/certificate-verification`} />
                  <script type="application/ld+json">{JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "BreadcrumbList",
                    "itemListElement": [
                      { "@type": "ListItem", "position": 1, "name": "Home", "item": SITE_URL },
                      { "@type": "ListItem", "position": 2, "name": "Certificate Verification", "item": `${SITE_URL}/certificate-verification` }
                    ]
                  })}</script>
                </Helmet>
                <CertificateVerification />
              </HeaderShell>
            }
          />

          {/* ── SOFTWARE HUB ─────────────────────────────────── */}
          <Route
            path="/softwares"
            element={
              <HeaderShell>
                <Helmet>
                  <title>All Products & Free Tools – {SITE_NAME} Software Hub</title>
                  <meta name="description" content="Browse all free tools and products by Openroot Systems: NIOR AI, MAKAUT Grade Calculator, Travel Expense Manager, Openroot Classes, GDrive Automation, Job Updates portal and more." />
                  <link rel="canonical" href={`${SITE_URL}/softwares`} />
                  <meta name="robots" content="index, follow" />
                  <meta property="og:title" content="Openroot Systems Software Hub – All Products & Free Tools" />
                  <meta property="og:url" content={`${SITE_URL}/softwares`} />
                  <script type="application/ld+json">{JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "BreadcrumbList",
                    "itemListElement": [
                      { "@type": "ListItem", "position": 1, "name": "Home", "item": SITE_URL },
                      { "@type": "ListItem", "position": 2, "name": "Software Hub", "item": `${SITE_URL}/softwares` }
                    ]
                  })}</script>
                  <script type="application/ld+json">{JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "CollectionPage",
                    "name": "Openroot Systems – All Products & Free Tools",
                    "url": `${SITE_URL}/softwares`,
                    "description": "Complete catalog of software products and free tools by Openroot Systems.",
                    "publisher": { "@id": ORG_ID }
                  })}</script>
                </Helmet>
                <SoftwareHub />
              </HeaderShell>
            }
          />

          {/* ── INDIVIDUAL SOFTWARE PAGES ────────────────────── */}
          <Route
            path="/softwares/:slug"
            element={
              <HeaderShell>
                <SoftwarePage />
              </HeaderShell>
            }
          />

          {/* ── SOFTWARE SOLUTIONS (B2B) ──────────────────────── */}
          <Route
            path="/software-solutions"
            element={
              <>
                <Helmet>
                  <title>Custom Software Development Services – {SITE_NAME}</title>
                  <meta name="description" content="Openroot Systems offers professional custom software development, business automation, government software, MSME solutions and web application development services in India." />
                  <link rel="canonical" href={`${SITE_URL}/software-solutions`} />
                  <meta name="robots" content="index, follow" />
                  <meta property="og:title" content="Custom Software Development Services – Openroot Systems" />
                  <meta property="og:url" content={`${SITE_URL}/software-solutions`} />
                  <script type="application/ld+json">{JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "BreadcrumbList",
                    "itemListElement": [
                      { "@type": "ListItem", "position": 1, "name": "Home", "item": SITE_URL },
                      { "@type": "ListItem", "position": 2, "name": "Software Solutions", "item": `${SITE_URL}/software-solutions` }
                    ]
                  })}</script>
                  <script type="application/ld+json">{JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "Service",
                    "serviceType": "Custom Software Development",
                    "name": "Openroot Systems Software Development Services",
                    "url": `${SITE_URL}/software-solutions`,
                    "provider": { "@id": ORG_ID },
                    "areaServed": { "@type": "Country", "name": "India" },
                    "description": "Custom software development, business automation, government software, MSME solutions and React web app development.",
                    "hasOfferCatalog": {
                      "@type": "OfferCatalog",
                      "name": "Software Development Services",
                      "itemListElement": [
                        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Custom Software Development" } },
                        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Business Automation Solutions" } },
                        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Government Department Software" } },
                        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "MSME Software Solutions" } },
                        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Enterprise Web Applications" } }
                      ]
                    }
                  })}</script>
                </Helmet>
                <SoftwareSolutions />
              </>
            }
          />

          <Route
            path="/founder"
            element={
              <>
                <Helmet>
                  <title>Somnath Banerjee – Founder of Openroot Systems</title>

                  <meta
                    name="description"
                    content="Learn about Somnath Banerjee, founder and lead developer of Openroot Systems – a Government of India registered MSME building AI tools, software solutions and educational platforms."
                  />

                  <link rel="canonical" href={`${SITE_URL}/founder`} />
                  <meta name="robots" content="index, follow" />
                  <script type="application/ld+json">
                    {JSON.stringify({
                      "@context": "https://schema.org",
                      "@type": "ProfilePage",
                      name: "Somnath Banerjee – Founder of Openroot Systems",
                      url: `${SITE_URL}/founder`,
                      mainEntity: {
                        "@type": "Person",
                        name: "Somnath Banerjee",
                        jobTitle: "Founder & Lead Developer",
                        worksFor: { "@id": ORG_ID },
                        url: `${SITE_URL}/founder`,
                        sameAs: [
                          "https://github.com/COMEONSOM",
                          "https://www.linkedin.com/in/comeonsom/",
                          "https://x.com/comeonsom_",
                        ],
                      },
                    })}
                  </script>
                </Helmet>
                <FounderPortfolio />
              </>
            }
          />

          {/* ── LEGAL ────────────────────────────────────────── */}
          <Route
            path="/terms"
            element={
              <>
                <Helmet>
                  <title>Terms & Conditions – {SITE_NAME}</title>
                  <meta name="description" content="Terms and conditions for using Openroot Systems products and services at openroot.in." />
                  <link rel="canonical" href={`${SITE_URL}/terms`} />
                  <meta name="robots" content="index, follow" />
                </Helmet>
                <Terms />
              </>
            }
          />
          <Route path="/CoevasTerms" element={<CoevasTerms />} />
          <Route
            path="/privacy-policy"
            element={
              <>
                <Helmet>
                  <title>Privacy Policy – {SITE_NAME}</title>
                  <meta name="description" content="Privacy policy for Openroot Systems. Learn how we collect, use, and protect your information at openroot.in." />
                  <link rel="canonical" href={`${SITE_URL}/privacy-policy`} />
                  <meta name="robots" content="index, follow" />
                </Helmet>
                <PrivacyPolicy />
              </>
            }
          />
          <Route path="/license" element={<License />} />
          <Route
            path="/support"
            element={
              <>
                <Helmet>
                  <title>Support – Openroot GDrive Extension | {SITE_NAME}</title>
                  <meta name="description" content="Get support for the Openroot GDrive Automation Chrome extension. Installation guides, FAQs and troubleshooting." />
                  <link rel="canonical" href={`${SITE_URL}/support`} />
                </Helmet>
                <OpenrootGDriveSupport />
              </>
            }
          />

          {/* ── ENTITY PAGE ──────────────────────────────────── */}
          <Route path="/openroot-systems" element={<OpenrootSystems />} />

          {/* ── PROTECTED TOOLS ──────────────────────────────── */}
          <Route
            path="/newsletter"
            element={
              <RequireAuth>
                <Helmet>
                  <title>Government Job Updates & Resources Portal – {SITE_NAME}</title>
                  <meta name="description" content="Access curated government job updates, PSU recruitment, state and central government jobs, competitive exam resources and student tools – by Openroot Systems." />
                  <link rel="canonical" href={`${SITE_URL}/newsletter`} />
                  <meta name="robots" content="noindex" />
                </Helmet>
                <NewsLetter />
              </RequireAuth>
            }
          />
          <Route
            path="/coevas-terminal"
            element={
              <RequireAuth>
                <Helmet>
                  <title>Coevas Terminal – Download Videos from YouTube, Instagram & More | {SITE_NAME}</title>
                  <meta name="description" content="Download videos and audio from YouTube, Instagram, Facebook and Threads with Coevas Terminal by Openroot Systems." />
                  <link rel="canonical" href={`${SITE_URL}/coevas-terminal`} />
                  <meta name="robots" content="noindex" />
                </Helmet>
                <CoeasTerminal />
              </RequireAuth>
            }
          />
          <Route
            path="/makaut-grade-pro"
            element={
              <RequireAuth>
                <Helmet>
                  <title>MAKAUT GPA to Percentage Calculator – Free Tool | {SITE_NAME}</title>
                  <meta name="description" content="Free SGPA, CGPA, DGPA and YGPA to percentage calculator for MAKAUT (Maulana Abul Kalam Azad University of Technology) students in West Bengal." />
                  <link rel="canonical" href={`${SITE_URL}/makaut-grade-pro`} />
                  <meta name="robots" content="noindex" />
                </Helmet>
                <Makaut />
              </RequireAuth>
            }
          />
          <Route
            path="/travel-expense-manager"
            element={
              <RequireAuth>
                <Helmet>
                  <title>Travel Expense Manager – Split Group Trip Costs Easily | {SITE_NAME}</title>
                  <meta name="description" content="Free group travel expense splitter by Openroot Systems. Track spending, calculate who owes whom and simplify trip budgeting." />
                  <link rel="canonical" href={`${SITE_URL}/travel-expense-manager`} />
                  <meta name="robots" content="noindex" />
                </Helmet>
                <TravelExpenseManager />
              </RequireAuth>
            }
          />
          <Route
            path="/openroot-classes"
            element={
              <RequireAuth>
                <Helmet>
                  <title>Openroot Classes – Learn Prompt Engineering, Finance & Career Skills</title>
                  <meta name="description" content="Join Openroot Classes to learn prompt engineering, financial literacy and career development with practical, real-world training by Openroot Systems." />
                  <link rel="canonical" href={`${SITE_URL}/openroot-classes`} />
                  <meta name="robots" content="noindex" />
                </Helmet>
                <OCLayout />
              </RequireAuth>
            }
          />
          <Route
            path="/gdrive-web-extension"
            element={
              <RequireAuth>
                <Helmet>
                  <title>Openroot GDrive Automation – Chrome Extension Guide | {SITE_NAME}</title>
                  <meta name="description" content="Learn how to install and use the Openroot GDrive Automation Chrome extension for bulk Google Drive file renaming and productivity automation." />
                  <link rel="canonical" href={`${SITE_URL}/gdrive-web-extension`} />
                  <meta name="robots" content="noindex" />
                </Helmet>
                <GDrive />
              </RequireAuth>
            }
          />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </>
  );
}

export default function App() {
  const isDevelopment =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1";

  if (
    SITE_CONFIG.maintenance &&
    !isDevelopment
  ) {
    return <MaintenancePage />;
  }

  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}