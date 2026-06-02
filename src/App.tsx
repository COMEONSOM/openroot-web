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

// ── Lazy pages ────────────────────────────────────────────────
const UserLoginModal = lazy(() => import("./components/LoginModal"));
const AdminLoginModal = lazy(() => import("./components/AdminLogin"));
const SoftwareHub = lazy(() => import("./pages/SoftwareHub"));
const SoftwarePage = lazy(() => import("./pages/SoftwarePage"));
const SoftwareSolutions = lazy(() => import("./pages/SoftwareSolutions"));
const CertificateModal = lazy(() => import("./components/CertificateModal"));
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
const OG_IMAGE = `${SITE_URL}/assets/company-icon.png`;
const SITE_NAME = "Openroot Systems";

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
// FIX (Accessibility): Added <main> landmark element wrapping page content.
// Report flagged: "Document does not have a main landmark."
// Screen reader users rely on <main> to skip to page content.
// HomeShell wraps children in <main> since it renders the primary content.
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

// HeaderShell also gets <main> for pages that use it (software hub, cert, etc.)
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
    Loading…
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

  if (user === undefined && !isAdmin) {
    return <PageLoader />;
  }

  if (!user && !isAdmin) {
    return <Navigate to="/userlogin" replace />;
  }

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

          {/* Home */}
          <Route
            path="/"
            element={
              <HomeShell>
                <Helmet>
                  <title>{SITE_NAME} – Custom Software, AI Tools & Web Solutions</title>
                  <meta
                    name="description"
                    content="Openroot Systems builds robust Automation Software, React-based Websites, Web Extensions, and Windows Applications. We also provide free, high-utility tools for students and professionals."
                  />
                  <meta
                    name="keywords"
                    content="Openroot Systems, custom software development, React websites, Windows applications, web extensions, automation software, free tools for students India, NIOR AI, MAKAUT grade calculator, productivity software"
                  />
                  <link rel="canonical" href={SITE_URL} />
                  <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large" />
                  <meta property="og:type" content="website" />
                  <meta property="og:url" content={SITE_URL} />
                  <meta property="og:site_name" content={SITE_NAME} />
                  <meta property="og:locale" content="en_IN" />
                  <meta property="og:title" content={`${SITE_NAME} – Software Development & Automation`} />
                  <meta
                    property="og:description"
                    content="From Automation Software and React Websites to powerful free utilities like AI assistants and expense trackers. We build tech that saves you time."
                  />
                  <meta property="og:image" content={OG_IMAGE} />
                  <meta name="twitter:card" content="summary_large_image" />
                  <meta name="twitter:title" content={`${SITE_NAME} – Automation, Web Apps & Free Tools`} />
                  <meta
                    name="twitter:description"
                    content="Building real-world solutions: React sites, Windows apps, browser extensions, and a suite of free productivity tools for India."
                  />
                  <meta name="twitter:image" content={OG_IMAGE} />
                </Helmet>
                <AboutCompany />
              </HomeShell>
            }
          />

          {/* Certificate */}
          <Route
            path="/certificate-verification"
            element={
              <HeaderShell>
                <Helmet>
                  <title>Verify Your Openroot Certificate – Instant & Tamper-Proof</title>
                  <meta
                    name="description"
                    content="Received an Openroot certificate? Verify it instantly using our official secure verification tool."
                  />
                  <link rel="canonical" href={`${SITE_URL}/certificate-verification`} />
                </Helmet>
                <CertificateModal isOpen={true} onClose={() => {}} />
              </HeaderShell>
            }
          />

          {/* Software hub */}
          <Route
            path="/software"
            element={
              <HeaderShell>
                <Helmet>
                  <title>All Free Tools in One Place – {SITE_NAME} Software Hub</title>
                  <meta
                    name="description"
                    content="Browse every free tool built by Openroot Systems."
                  />
                  <link rel="canonical" href={`${SITE_URL}/software`} />
                </Helmet>
                <SoftwareHub />
              </HeaderShell>
            }
          />

          <Route
            path="/software/:slug"
            element={
              <HeaderShell>
                <SoftwarePage />
              </HeaderShell>
            }
          />

          <Route path="/software-solutions" element={<SoftwareSolutions />} />

          {/* Founder */}
          <Route
            path="/founder"
            element={
              <iframe
                src="/founder.html"
                title="Founder – Openroot Systems"
                sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox"
                referrerPolicy="no-referrer"
                style={{ width: "100%", height: "100vh", border: "none" }}
              />
            }
          />

          {/* Legal */}
          <Route path="/terms" element={<Terms />} />
          <Route path="/CoevasTerms" element={<CoevasTerms />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/license" element={<License />} />
          <Route path="/support" element={<OpenrootGDriveSupport />} />

          {/* Protected tools */}
          <Route path="/newsletter" element={<RequireAuth><NewsLetter /></RequireAuth>} />
          <Route path="/coevas-terminal" element={<RequireAuth><CoeasTerminal /></RequireAuth>} />
          <Route path="/makaut-grade-pro" element={<RequireAuth><Makaut /></RequireAuth>} />
          <Route path="/travel-expense-manager" element={<RequireAuth><TravelExpenseManager /></RequireAuth>} />
          <Route path="/openroot-classes" element={<RequireAuth><OCLayout /></RequireAuth>} />
          <Route path="/gdrive-web-extension" element={<RequireAuth><GDrive /></RequireAuth>} />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}