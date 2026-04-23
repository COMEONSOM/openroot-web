import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  memo,
} from "react";
import "../components/styles/makaut.css";

// ─── Constants ────────────────────────────────────────────────────────────────

const GPA_MIN = 0;
const GPA_MAX = 10;
const REGULAR_START_SEM = 1;
const LATERAL_START_SEM = 3;
const MAX_SEM = 8;
const MAX_INPUT_LENGTH = 12; // guard against absurdly long strings

// ─── SEO Content ──────────────────────────────────────────────────────────────
// These strings strengthen discoverability for MAKAUT / WBUT / Openroot queries
// without changing any calculation logic.

const SEO_KEYWORDS = [
  "MAKAUT",
  "Maulana Abul Kalam Azad University of Technology",
  "WBUT",
  "MAKAUT GPA calculator",
  "MAKAUT percentage calculator",
  "SGPA to percentage",
  "CGPA to percentage",
  "DGPA calculation",
  "YGPA calculation",
  "percentage to grade",
  "SGPA to CGPA",
  "MAKAUT grade calculation",
].join(", ");

const SEO_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "MAKAUT GPA & Percentage Calculator",
  applicationCategory: "EducationalApplication",
  operatingSystem: "Web",
  description:
    "Openroot's MAKAUT GPA and percentage calculator for SGPA, YGPA, DGPA, CGPA, percentage conversion, and semester-wise grade calculation.",
  keywords: SEO_KEYWORDS,
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "INR",
  },
  publisher: {
    "@type": "Organization",
    name: "Openroot Systems",
  },
};

const FAQ_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is this MAKAUT calculator used for?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "It helps MAKAUT students calculate SGPA, YGPA, DGPA, CGPA, percentage, and semester-wise results using the same formulas shown in the tool.",
      },
    },
    {
      "@type": "Question",
      name: "Is this useful for WBUT and MAKAUT students?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. The page is written for Maulana Abul Kalam Azad University of Technology, formerly known as WBUT, and includes related keyword phrases such as MAKAUT grade calculation and percentage calculation.",
      },
    },
    {
      "@type": "Question",
      name: "Does this page change the original formulas?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. The calculations remain unchanged. Only the content, labels, and SEO signals are improved.",
      },
    },
  ],
};

// ─── Domain Types ─────────────────────────────────────────────────────────────

type ToolId = "sgpaTool" | "ygpaTool" | "dgpaTool" | "cgpaTool";
type StudentType = "regular" | "lateral";
type CourseType = "1" | "2" | "3" | "3l" | "4";
type ResultStatus = "success" | "error" | "";

interface ResultState {
  text: string;
  status: ResultStatus;
}

interface TillSemData {
  semester: number;
  cgpa: string;
  percentage: string;
}

interface SemesterEntry {
  cp: string;
  c: string;
}

// ─── Pure Utility Functions ───────────────────────────────────────────────────
// All calculation logic is kept as pure functions — no React coupling.
// This makes them trivial to unit-test and easy to move to a shared library.

/** Mirrors the original formula exactly: percentage = (gpa - 0.75) * 10 */
function toPercentage(gpa: number): string {
  return ((gpa - 0.75) * 10).toFixed(2);
}

/**
 * Parse a string to a finite float.
 * Returns NaN (not undefined / 0) so callers can distinguish "empty" from "zero".
 */
function safeParseFloat(value: string): number {
  const trimmed = value.trim();
  if (trimmed === "") return NaN;
  const parsed = parseFloat(trimmed);
  return Number.isFinite(parsed) ? parsed : NaN;
}

/**
 * Strip everything that is not a digit or a single decimal point.
 * Prevents script injection and limits string length.
 */
function sanitizeNumericInput(raw: string): string {
  // Allow digits + at most one leading minus for potential negative display,
  // then strip to digits + dot only (GPA is always non-negative).
  return raw
    .replace(/[^0-9.]/g, "")
    .replace(/(\..*)\./g, "$1") // keep only the first decimal point
    .slice(0, MAX_INPUT_LENGTH);
}

// ─── Pure Calculation Functions ───────────────────────────────────────────────

function calcSGPA(sgpa: string): ResultState {
  const value = safeParseFloat(sgpa);
  if (Number.isNaN(value) || value <= GPA_MIN || value > GPA_MAX) {
    return {
      text: `Please enter a valid SGPA (${GPA_MIN}–${GPA_MAX}).`,
      status: "error",
    };
  }
  return { text: `Percentage: ${toPercentage(value)}%`, status: "success" };
}

function calcYGPA(
  oddCP: string,
  oddC: string,
  evenCP: string,
  evenC: string,
): ResultState {
  const vals = [oddCP, oddC, evenCP, evenC].map(safeParseFloat);

  if (vals.some((v) => Number.isNaN(v) || v < 0)) {
    return {
      text: "Fill all fields with valid non-negative numbers.",
      status: "error",
    };
  }

  const [oCP, oC, eCP, eC] = vals as [number, number, number, number];
  const totalC = oC + eC;

  if (totalC === 0) {
    return { text: "Total credits cannot be zero.", status: "error" };
  }

  const ygpa = (oCP + eCP) / totalC;
  return {
    text: `YGPA: ${ygpa.toFixed(2)}, Percentage: ${toPercentage(ygpa)}%`,
    status: "success",
  };
}

function calcDGPA(
  courseType: CourseType,
  yg1: string,
  yg2: string,
  yg3: string,
  yg4: string,
): ResultState {
  const { showYg1, showYg2, showYg3, showYg4 } = getDGPAVisibility(courseType);

  // Validate only the fields that are visible/required for this course type
  const requiredFields: Array<{ label: string; value: string; show: boolean }> = [
    { label: "YGPA 1", value: yg1, show: showYg1 },
    { label: "YGPA 2", value: yg2, show: showYg2 },
    { label: "YGPA 3", value: yg3, show: showYg3 },
    { label: "YGPA 4", value: yg4, show: showYg4 },
  ];

  for (const field of requiredFields) {
    if (!field.show) continue;
    const val = safeParseFloat(field.value);
    if (Number.isNaN(val) || val <= GPA_MIN || val > GPA_MAX) {
      return {
        text: `${field.label} must be a valid GPA (${GPA_MIN}–${GPA_MAX}).`,
        status: "error",
      };
    }
  }

  // Safe to parse now — visible fields are guaranteed valid
  const y = [yg1, yg2, yg3, yg4].map((v) => {
    const n = safeParseFloat(v);
    return Number.isNaN(n) ? 0 : n;
  }) as [number, number, number, number];

  let dgpa: number;
  switch (courseType) {
    case "1":
      dgpa = y[0];
      break;
    case "2":
      dgpa = (y[0] + y[1]) / 2;
      break;
    case "3":
      dgpa = (y[0] + y[1] + y[2]) / 3;
      break;
    case "3l":
      dgpa = (y[1] + 1.5 * y[2] + 1.5 * y[3]) / 4;
      break;
    case "4":
      dgpa = (y[0] + y[1] + 1.5 * y[2] + 1.5 * y[3]) / 5;
      break;
    default:
      return { text: "Invalid degree type selected.", status: "error" };
  }

  return {
    text: `DGPA: ${dgpa.toFixed(2)}, Percentage: ${toPercentage(dgpa)}%`,
    status: "success",
  };
}

function calcCGPA(cpStr: string, cStr: string): ResultState {
  const cp = safeParseFloat(cpStr);
  const c = safeParseFloat(cStr);

  if (Number.isNaN(cp) || Number.isNaN(c) || cp <= 0 || c <= 0) {
    return {
      text: "Enter valid positive Credit Index and Credits.",
      status: "error",
    };
  }

  const cgpa = cp / c;
  return {
    text: `CGPA: ${cgpa.toFixed(2)}, Percentage: ${toPercentage(cgpa)}%`,
    status: "success",
  };
}

function calcTillSem(
  studentType: StudentType,
  selectedSemStr: string,
  semesterValues: Record<string, SemesterEntry>,
): { data: TillSemData | null; error: string } {
  if (!selectedSemStr) {
    return { data: null, error: "Please select a semester." };
  }

  const startSem = studentType === "lateral" ? LATERAL_START_SEM : REGULAR_START_SEM;
  const selected = Number(selectedSemStr);

  // Guard against non-integer or out-of-range semester values.
  if (!Number.isInteger(selected) || selected < startSem || selected > MAX_SEM) {
    return { data: null, error: "Invalid semester selected." };
  }

  let totalCreditIndex = 0;
  let totalCredits = 0;

  for (let sem = startSem; sem <= selected; sem++) {
    const entry = semesterValues[String(sem)] ?? { cp: "", c: "" };
    const cp = safeParseFloat(entry.cp);
    const c = safeParseFloat(entry.c);

    if (Number.isNaN(cp) || Number.isNaN(c) || cp < 0 || c <= 0) {
      return {
        data: null,
        error: `Invalid values in Semester ${sem}. Credit Index must be ≥ 0 and Credits > 0.`,
      };
    }

    totalCreditIndex += cp;
    totalCredits += c;
  }

  if (totalCredits === 0) {
    return { data: null, error: "Total credits cannot be zero." };
  }

  const rawCgpa = totalCreditIndex / totalCredits;
  return {
    data: {
      semester: selected,
      cgpa: rawCgpa.toFixed(2),
      percentage: toPercentage(rawCgpa),
    },
    error: "",
  };
}

// ─── Derived State Helper ─────────────────────────────────────────────────────

interface DGPAFieldVisibility {
  showYg1: boolean;
  showYg2: boolean;
  showYg3: boolean;
  showYg4: boolean;
}

function getDGPAVisibility(courseType: CourseType): DGPAFieldVisibility {
  return {
    showYg1: courseType !== "3l",
    showYg2: courseType !== "1",
    showYg3: courseType === "3" || courseType === "3l" || courseType === "4",
    showYg4: courseType === "3l" || courseType === "4",
  };
}

// ─── Custom Hook: useTillSemester ─────────────────────────────────────────────
// Extracted so the parent component doesn't carry this complexity inline.

interface TillSemesterHook {
  studentType: StudentType;
  setStudentType: (v: StudentType) => void;
  selectedSemester: string;
  handleSelectSem: (v: string) => void;
  semesterOptions: string[];
  semesterValues: Record<string, SemesterEntry>;
  updateSemEntry: (sem: number, field: keyof SemesterEntry, value: string) => void;
  tillSemData: TillSemData | null;
  tillSemError: string;
  calculate: () => void;
}

function useTillSemester(): TillSemesterHook {
  const [studentType, setStudentTypeRaw] = useState<StudentType>("regular");
  const [selectedSemester, setSelectedSem] = useState<string>("");
  const [semesterValues, setSemesterValues] = useState<Record<string, SemesterEntry>>(
    {},
  );
  const [tillSemData, setTillSemData] = useState<TillSemData | null>(null);
  const [tillSemError, setTillSemError] = useState<string>("");

  const semesterOptions = useMemo<string[]>(() => {
    const start = studentType === "lateral" ? LATERAL_START_SEM : REGULAR_START_SEM;
    return Array.from({ length: MAX_SEM - start + 1 }, (_, i) => String(start + i));
  }, [studentType]);

  // Full reset when student type changes.
  const setStudentType = useCallback((v: StudentType) => {
    setStudentTypeRaw(v);
    setSelectedSem("");
    setSemesterValues({});
    setTillSemData(null);
    setTillSemError("");
  }, []);

  // Rebuild semesterValues when the target semester changes.
  // Preserves already-entered values so the user doesn't lose work.
  useEffect(() => {
    if (!selectedSemester) {
      setSemesterValues({});
      setTillSemData(null);
      setTillSemError("");
      return;
    }
    const startSem = studentType === "lateral" ? LATERAL_START_SEM : REGULAR_START_SEM;
    const selected = Number(selectedSemester);
    setSemesterValues((prev) => {
      const next: Record<string, SemesterEntry> = {
        ...prev,
      };
      for (let sem = startSem; sem <= selected; sem++) {
        next[String(sem)] = prev[String(sem)] ?? { cp: "", c: "" };
      }
      return next;
    });
    setTillSemData(null);
    setTillSemError("");
    // `semesterValues` intentionally omitted — only re-run on selection/type change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSemester, studentType]);

  const handleSelectSem = useCallback((value: string) => {
    setSelectedSem(value);
    setTillSemData(null);
    setTillSemError("");
  }, []);

  const updateSemEntry = useCallback(
    (sem: number, field: keyof SemesterEntry, value: string) => {
      const sanitized = sanitizeNumericInput(value);
      setSemesterValues((prev) => ({
        ...prev,
        [String(sem)]: { ...(prev[String(sem)] ?? { cp: "", c: "" }), [field]: sanitized },
      }));
    },
    [],
  );

  const calculate = useCallback(() => {
    const { data, error } = calcTillSem(studentType, selectedSemester, semesterValues);
    setTillSemData(data);
    setTillSemError(error);
  }, [studentType, selectedSemester, semesterValues]);

  return {
    studentType,
    setStudentType,
    selectedSemester,
    handleSelectSem,
    semesterOptions,
    semesterValues,
    updateSemEntry,
    tillSemData,
    tillSemError,
    calculate,
  };
}

// ─── Shared Style Tokens ──────────────────────────────────────────────────────
// Centralised so a single change propagates everywhere.

const FIELD_STYLE: React.CSSProperties = { width: "100%", height: 48, borderRadius: 14 };
const CARD_STYLE: React.CSSProperties = { borderRadius: 22 };
const SECTION_STYLE: React.CSSProperties = {
  maxWidth: 1400,
  margin: "2.5rem auto",
  padding: "0 1.5rem",
};
const TWO_COL_GRID: React.CSSProperties = {
  display: "grid",
  gap: "0.9rem",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
};

// ─── Reusable Sub-components ──────────────────────────────────────────────────
// memo() prevents re-renders when parent state unrelated to props changes.

const ResultDisplay = memo(({ result }: { result: ResultState }) => {
  if (!result.text) return null;
  const cls = result.status === "success" ? "text-emerald-700" : "text-rose-600";
  return <div className={`tool-result ${cls}`}>{result.text}</div>;
});
ResultDisplay.displayName = "ResultDisplay";

const BackButton = memo(({ onClick }: { onClick: () => void }) => (
  <button className="back-to-menu" onClick={onClick} type="button">
    ← Back
  </button>
));
BackButton.displayName = "BackButton";

interface ToolHeaderProps {
  onBack: () => void;
  title: string;
  subtitle: React.ReactNode;
}

const ToolHeader = memo(({ onBack, title, subtitle }: ToolHeaderProps) => (
  <header className="tool-header">
    <BackButton onClick={onBack} />
    <h2>{title}</h2>
    <p className="tool-subtitle">{subtitle}</p>
  </header>
));
ToolHeader.displayName = "ToolHeader";

const HiddenSeoContent = memo(() => (
  <div
    aria-hidden="true"
    style={{
      position: "absolute",
      width: 1,
      height: 1,
      padding: 0,
      margin: -1,
      overflow: "hidden",
      clip: "rect(0, 0, 0, 0)",
      whiteSpace: "nowrap",
      border: 0,
    }}
  >
    <p>
      MAKAUT GPA calculator, MAKAUT percentage calculator, SGPA to percentage,
      CGPA to percentage, DGPA calculation, YGPA calculation, percentage to grade,
      SGPA to CGPA, Maulana Abul Kalam Azad University of Technology, WBUT.
    </p>
    <p>
      This Openroot page is designed for MAKAUT grade calculation, semester-wise CGPA,
      and related student search intent.
    </p>
  </div>
));
HiddenSeoContent.displayName = "HiddenSeoContent";

// ─── Main Component ───────────────────────────────────────────────────────────

const Makaut: React.FC = () => {
  // ── View state ──
  const [showDashboard, setShowDashboard] = useState(true);
  const [activeTool, setActiveTool] = useState<ToolId | null>(null);
  const [showCalcModal, setShowCalcModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // ── SGPA ──
  const [sgpa, setSgpa] = useState("");
  const [sgpaResult, setSgpaResult] = useState<ResultState>({ text: "", status: "" });

  // ── YGPA ──
  const [ygpaOddCP, setYgpaOddCP] = useState("");
  const [ygpaOddC, setYgpaOddC] = useState("");
  const [ygpaEvenCP, setYgpaEvenCP] = useState("");
  const [ygpaEvenC, setYgpaEvenC] = useState("");
  const [ygpaResult, setYgpaResult] = useState<ResultState>({ text: "", status: "" });

  // ── DGPA ──
  const [courseType, setCourseType] = useState<CourseType>("1");
  const [yg1, setYg1] = useState("");
  const [yg2, setYg2] = useState("");
  const [yg3, setYg3] = useState("");
  const [yg4, setYg4] = useState("");
  const [dgpaResult, setDgpaResult] = useState<ResultState>({ text: "", status: "" });

  // ── CGPA ──
  const [cgpaCP, setCgpaCP] = useState("");
  const [cgpaC, setCgpaC] = useState("");
  const [cgpaResult, setCgpaResult] = useState<ResultState>({ text: "", status: "" });

  // ── Till Semester (isolated custom hook) ──
  const tillSem = useTillSemester();

  // ── Refs ──
  const mobileMenuRef = useRef<HTMLDivElement | null>(null);
  const hamburgerRef = useRef<HTMLButtonElement | null>(null);

  // ─── DGPA field visibility (memoised) ──────────────────────────────────────
  const { showYg1, showYg2, showYg3, showYg4 } = useMemo(
    () => getDGPAVisibility(courseType),
    [courseType],
  );

  // ─── Clear hidden DGPA fields when course type changes ─────────────────────
  useEffect(() => {
    if (courseType === "1") {
      setYg2("");
      setYg3("");
      setYg4("");
    } else if (courseType === "2") {
      setYg3("");
      setYg4("");
    } else if (courseType === "3") {
      setYg4("");
    } else if (courseType === "3l") {
      setYg1("");
    }
    // "4" → all fields visible; nothing to clear.
  }, [courseType]);

  // ─── Mobile-menu dismiss ────────────────────────────────────────────────────
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        mobileMenuOpen &&
        mobileMenuRef.current &&
        hamburgerRef.current &&
        !mobileMenuRef.current.contains(target) &&
        !hamburgerRef.current.contains(target)
      ) {
        setMobileMenuOpen(false);
      }
    };
    const dismiss = () => setMobileMenuOpen(false);

    document.addEventListener("click", handleClickOutside);
    window.addEventListener("resize", dismiss);
    window.addEventListener("scroll", dismiss);
    window.addEventListener("touchmove", dismiss);

    return () => {
      document.removeEventListener("click", handleClickOutside);
      window.removeEventListener("resize", dismiss);
      window.removeEventListener("scroll", dismiss);
      window.removeEventListener("touchmove", dismiss);
    };
  }, [mobileMenuOpen]);

  // ─── Navigation ─────────────────────────────────────────────────────────────

  const openTool = useCallback((toolId: ToolId) => {
    setShowDashboard(false);
    setActiveTool(toolId);
    setMobileMenuOpen(false);
  }, []);

  const backToMenu = useCallback(() => {
    setShowDashboard(true);
    setActiveTool(null);
    setSgpaResult({ text: "", status: "" });
    setYgpaResult({ text: "", status: "" });
    setDgpaResult({ text: "", status: "" });
    setCgpaResult({ text: "", status: "" });
  }, []);

  const showCalculations = useCallback(() => {
    setShowCalcModal(true);
    setMobileMenuOpen(false);
  }, []);

  const hideCalculations = useCallback(() => setShowCalcModal(false), []);

  // ─── Calculation handlers (stable references via useCallback) ───────────────

  const handleConvertSGPA = useCallback(() => {
    setSgpaResult(calcSGPA(sgpa));
  }, [sgpa]);

  const handleCalculateYGPA = useCallback(() => {
    setYgpaResult(calcYGPA(ygpaOddCP, ygpaOddC, ygpaEvenCP, ygpaEvenC));
  }, [ygpaOddCP, ygpaOddC, ygpaEvenCP, ygpaEvenC]);

  const handleCalculateDGPA = useCallback(() => {
    setDgpaResult(calcDGPA(courseType, yg1, yg2, yg3, yg4));
  }, [courseType, yg1, yg2, yg3, yg4]);

  const handleCalculateCGPA = useCallback(() => {
    setCgpaResult(calcCGPA(cgpaCP, cgpaC));
  }, [cgpaCP, cgpaC]);

  // ─── Tool selector cards (stable — defined outside render loop) ─────────────
  const TOOL_CARDS: { id: ToolId; img: string; alt: string }[] = useMemo(
    () => [
      { id: "sgpaTool", img: "./assets-makaut/sgpa.avif", alt: "SGPA calculator icon" },
      { id: "ygpaTool", img: "./assets-makaut/ygpa.avif", alt: "YGPA calculator icon" },
      { id: "dgpaTool", img: "./assets-makaut/dgpa.avif", alt: "DGPA calculator icon" },
      { id: "cgpaTool", img: "./assets-makaut/cgpa.avif", alt: "CGPA calculator icon" },
    ],
    [],
  );

  // ─── Derived loop params for semester inputs ────────────────────────────────
  const tillSemStartSem =
    tillSem.studentType === "lateral" ? LATERAL_START_SEM : REGULAR_START_SEM;
  const tillSemCount = tillSem.selectedSemester
    ? Number(tillSem.selectedSemester) - tillSemStartSem + 1
    : 0;

  // ──────────────────────────────────────────────────────────────────────────────
  // RENDER
  // ──────────────────────────────────────────────────────────────────────────────
  return (
    <div className="app-wrapper" style={{ minHeight: "100vh" }}>
      <script type="application/ld+json">
        {JSON.stringify(SEO_JSON_LD)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(FAQ_JSON_LD)}
      </script>

      {/* ════════════════════ HEADER ════════════════════ */}
      <header className="site-header" role="banner">
        <div className="brand-block">
          <img
            src="./assets-makaut/openroot-white-nobg.png"
            alt="Openroot logo"
            className="brand-logo"
            height={36}
          />
          <img
            src="./assets-makaut/Maulana_Abul_Kalam_Azad_University_of_Technology_Logo.svg"
            alt="MAKAUT university logo"
            className="university-logo"
            height={48}
            width="auto"
          />
        </div>

        <div  className="logo-text" >
          <h1>
            SGPA, YGPA, DGPA, CGPA, percentage conversion, and semester-wise grade calculation
            for MAKAUT students.
          </h1>
        </div>

        <button
          ref={hamburgerRef}
          className="hamburger"
          type="button"
          aria-label="Open menu"
          aria-expanded={mobileMenuOpen}
          onClick={() => setMobileMenuOpen((v) => !v)}
        >
          ☰
        </button>

        <button className="btn btn-primary calc-btn" type="button" onClick={showCalculations}>
          Show Calculations
        </button>

        <div ref={mobileMenuRef} className={`mobile-menu${mobileMenuOpen ? " show" : ""}`}>
          <button className="btn btn-primary w-100" type="button" onClick={showCalculations}>
            Show Calculations
          </button>
        </div>
      </header>
      <HiddenSeoContent />

      {/* ════════════════════ FORMULA MODAL ════════════════════ */}
      {showCalcModal && (
        <div className="modal show" aria-modal="true" role="dialog">
          <button className="btn btn-ghost back-btn" type="button" onClick={hideCalculations}>
            ⬅ Back
          </button>
          <div className="modal-content">
            <h2>MAKAUT Calculation Formula Sheet</h2>
            <img
              src="./assets-makaut/calculation.png"
              alt="MAKAUT grading formula rules"
            />
          </div>
        </div>
      )}

      {/* ════════════════════ DASHBOARD ════════════════════ */}
      {showDashboard && (
        <section className="dashboard-layout" style={SECTION_STYLE}>
          {/* Left — tool selector cards */}
          <div className="dashboard-left">
            {TOOL_CARDS.map((card) => (
              <button
                key={card.id}
                className="select-card"
                type="button"
                onClick={() => openTool(card.id)}
                aria-label={`Open ${card.alt}`}
              >
                <img src={card.img} alt={card.alt} />
              </button>
            ))}
          </div>

          {/* Right — till-semester calculator */}
          <div className="dashboard-right">
            <div className="till-sem-card">
              <h2>Percentage Till Specific Semester</h2>
              <p className="subtitle">
                Calculated strictly as per official MAKAUT CGPA rules.
                <br />
                Credit Index = Sum of Credit Points.
              </p>

              {/* Student type */}
              <div className="form-group">
                <label htmlFor="studentType">Student Type</label>
                <select
                  id="studentType"
                  value={tillSem.studentType}
                  style={FIELD_STYLE}
                  onChange={(e) => tillSem.setStudentType(e.target.value as StudentType)}
                >
                  <option value="regular">Regular Student</option>
                  <option value="lateral">Lateral Entry Student</option>
                </select>
              </div>

              {/* Semester selector */}
              <div className="form-group">
                <label htmlFor="selectedSemester">Select Semester</label>
                <select
                  id="selectedSemester"
                  value={tillSem.selectedSemester}
                  style={FIELD_STYLE}
                  onChange={(e) => tillSem.handleSelectSem(e.target.value)}
                >
                  <option value="">-- Select --</option>
                  {tillSem.semesterOptions.map((sem) => (
                    <option key={sem} value={sem}>
                      {sem} Semester
                    </option>
                  ))}
                </select>
              </div>

              {/* Per-semester credit inputs */}
              <div className="semester-grid">
                {Array.from({ length: tillSemCount }, (_, i) => {
                  const sem = tillSemStartSem + i;
                  const current = tillSem.semesterValues[String(sem)] ?? {
                    cp: "",
                    c: "",
                  };
                  return (
                    <React.Fragment key={sem}>
                      <div className="form-group">
                        <label htmlFor={`cp${sem}`}>Sem {sem} Credit Index</label>
                        <input
                          id={`cp${sem}`}
                          type="number"
                          placeholder="e.g. 180"
                          min="0"
                          value={current.cp}
                          style={FIELD_STYLE}
                          onChange={(e) => tillSem.updateSemEntry(sem, "cp", e.target.value)}
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor={`c${sem}`}>Sem {sem} Total Credits</label>
                        <input
                          id={`c${sem}`}
                          type="number"
                          placeholder="e.g. 22"
                          min="0"
                          value={current.c}
                          style={FIELD_STYLE}
                          onChange={(e) => tillSem.updateSemEntry(sem, "c", e.target.value)}
                        />
                      </div>
                    </React.Fragment>
                  );
                })}
              </div>

              <button className="btn full-btn" type="button" onClick={tillSem.calculate}>
                Calculate
              </button>

              {!!tillSem.tillSemError && <div className="result-box error">{tillSem.tillSemError}</div>}

              {!!tillSem.tillSemData && (
                <div className="result-box success">
                  CGPA Till Sem {tillSem.tillSemData.semester}: <b>{tillSem.tillSemData.cgpa}</b>
                  <br />
                  Percentage Till Sem {tillSem.tillSemData.semester}: <b>{tillSem.tillSemData.percentage}%</b>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ════════════════════ TOOL VIEWS ════════════════════ */}
      {!showDashboard && activeTool && (
        <main className="tools-grid">
          {/* ── SGPA ─────────────────────────────────────── */}
          {activeTool === "sgpaTool" && (
            <section className="tool-card" style={CARD_STYLE}>
              <ToolHeader
                onBack={backToMenu}
                title="SGPA → Percentage"
                subtitle="Convert your semester GPA into percentage."
              />
              <div className="tool-body">
                <div className="form-group">
                  <label htmlFor="sgpa">Enter SGPA</label>
                  <input
                    id="sgpa"
                    type="number"
                    placeholder="e.g. 8.20"
                    step="0.01"
                    min={GPA_MIN}
                    max={GPA_MAX}
                    value={sgpa}
                    style={FIELD_STYLE}
                    onChange={(e) => setSgpa(sanitizeNumericInput(e.target.value))}
                    onKeyDown={(e) => e.key === "Enter" && handleConvertSGPA()}
                  />
                </div>
                <button className="btn full-btn" type="button" onClick={handleConvertSGPA}>
                  Convert SGPA
                </button>
              </div>
              <ResultDisplay result={sgpaResult} />
            </section>
          )}

          {/* ── YGPA ─────────────────────────────────────── */}
          {activeTool === "ygpaTool" && (
            <section className="tool-card" style={CARD_STYLE}>
              <ToolHeader
                onBack={backToMenu}
                title="YGPA + Percentage"
                subtitle={<>Enter odd &amp; even semester credit details.</>}
              />
              <div className="tool-body" style={TWO_COL_GRID}>
                <div className="form-group">
                  <label htmlFor="ygpaOddCP">Odd Sem Credit Index</label>
                  <input
                    id="ygpaOddCP"
                    type="number"
                    min="0"
                    value={ygpaOddCP}
                    style={FIELD_STYLE}
                    onChange={(e) => setYgpaOddCP(sanitizeNumericInput(e.target.value))}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="ygpaOddC">Odd Sem Total Credits</label>
                  <input
                    id="ygpaOddC"
                    type="number"
                    min="0"
                    value={ygpaOddC}
                    style={FIELD_STYLE}
                    onChange={(e) => setYgpaOddC(sanitizeNumericInput(e.target.value))}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="ygpaEvenCP">Even Sem Credit Index</label>
                  <input
                    id="ygpaEvenCP"
                    type="number"
                    min="0"
                    value={ygpaEvenCP}
                    style={FIELD_STYLE}
                    onChange={(e) => setYgpaEvenCP(sanitizeNumericInput(e.target.value))}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="ygpaEvenC">Even Sem Total Credits</label>
                  <input
                    id="ygpaEvenC"
                    type="number"
                    min="0"
                    value={ygpaEvenC}
                    style={FIELD_STYLE}
                    onChange={(e) => setYgpaEvenC(sanitizeNumericInput(e.target.value))}
                  />
                </div>
              </div>
              <button className="btn full-btn" type="button" onClick={handleCalculateYGPA}>
                Calculate YGPA
              </button>
              <ResultDisplay result={ygpaResult} />
            </section>
          )}

          {/* ── DGPA ─────────────────────────────────────── */}
          {activeTool === "dgpaTool" && (
            <section className="tool-card" style={CARD_STYLE}>
              <ToolHeader
                onBack={backToMenu}
                title="DGPA + Percentage"
                subtitle="Select course type and yearly GPA."
              />
              <div className="tool-body" style={TWO_COL_GRID}>
                {/* Course type — full-width row */}
                <div className="form-group" style={{ gridColumn: "1 / -1" }}>
                  <label htmlFor="courseType">Course Type</label>
                  <select
                    id="courseType"
                    value={courseType}
                    style={FIELD_STYLE}
                    onChange={(e) => setCourseType(e.target.value as CourseType)}
                  >
                    <option value="1">1-Year Course</option>
                    <option value="2">2-Year Course</option>
                    <option value="3">3-Year Course</option>
                    <option value="3l">3-Year Lateral</option>
                    <option value="4">4-Year Course</option>
                  </select>
                </div>

                {showYg1 && (
                  <div className="form-group">
                    <label>YGPA 1</label>
                    <input
                      type="number"
                      min={GPA_MIN}
                      max={GPA_MAX}
                      value={yg1}
                      style={FIELD_STYLE}
                      onChange={(e) => setYg1(sanitizeNumericInput(e.target.value))}
                    />
                  </div>
                )}
                {showYg2 && (
                  <div className="form-group">
                    <label>YGPA 2</label>
                    <input
                      type="number"
                      min={GPA_MIN}
                      max={GPA_MAX}
                      value={yg2}
                      style={FIELD_STYLE}
                      onChange={(e) => setYg2(sanitizeNumericInput(e.target.value))}
                    />
                  </div>
                )}
                {showYg3 && (
                  <div className="form-group">
                    <label>YGPA 3</label>
                    <input
                      type="number"
                      min={GPA_MIN}
                      max={GPA_MAX}
                      value={yg3}
                      style={FIELD_STYLE}
                      onChange={(e) => setYg3(sanitizeNumericInput(e.target.value))}
                    />
                  </div>
                )}
                {showYg4 && (
                  <div className="form-group">
                    <label>YGPA 4</label>
                    <input
                      type="number"
                      min={GPA_MIN}
                      max={GPA_MAX}
                      value={yg4}
                      style={FIELD_STYLE}
                      onChange={(e) => setYg4(sanitizeNumericInput(e.target.value))}
                    />
                  </div>
                )}
              </div>
              <button className="btn full-btn" type="button" onClick={handleCalculateDGPA}>
                Calculate DGPA
              </button>
              <ResultDisplay result={dgpaResult} />
            </section>
          )}

          {/* ── CGPA ─────────────────────────────────────── */}
          {activeTool === "cgpaTool" && (
            <section className="tool-card" style={CARD_STYLE}>
              <ToolHeader
                onBack={backToMenu}
                title="CGPA + Percentage"
                subtitle="Total credit based calculation."
              />
              <div className="tool-body" style={TWO_COL_GRID}>
                <div className="form-group">
                  <label htmlFor="cgpaCP">Total Credit Index</label>
                  <input
                    id="cgpaCP"
                    type="number"
                    min="0"
                    value={cgpaCP}
                    style={FIELD_STYLE}
                    onChange={(e) => setCgpaCP(sanitizeNumericInput(e.target.value))}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="cgpaC">Total Credits of All Semesters</label>
                  <input
                    id="cgpaC"
                    type="number"
                    min="0"
                    value={cgpaC}
                    style={FIELD_STYLE}
                    onChange={(e) => setCgpaC(sanitizeNumericInput(e.target.value))}
                  />
                </div>
              </div>
              <button className="btn full-btn" type="button" onClick={handleCalculateCGPA}>
                Calculate CGPA
              </button>
              <ResultDisplay result={cgpaResult} />
            </section>
          )}
        </main>
      )}

      {/* ════════════════════ FOOTER ════════════════════ */}
      <footer className="site-footer">
        <p>© 2026 Openroot Systems. All rights reserved.</p>
        <p>Made with ❤️ for MAKAUT students.</p>
      </footer>
    </div>
  );
};

export default Makaut;
