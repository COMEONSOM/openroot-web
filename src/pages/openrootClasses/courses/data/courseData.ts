// ============================================================
// COURSE DATA AND ROUTE HELPERS
// ============================================================

export interface Course {
  id: number;
  slug: "investing-finance" | "prompt-engineering";
  name: string;
  animationFile: string;
  description: string[];
  duration: string;
  totalFee: number;
  priceLabel: string;
}

export const COURSE_BASE_PATH = "/openroot-classes/courses";

export const COURSE_DATA: readonly Course[] = [
  {
    id: 1,
    slug: "investing-finance",
    name: "Investing & Finance",
    animationFile: "/lotties/finance.json",
    description: [
      "Stock Market From Zero (Demat, Buy/Sell, Basics, Fundamentals)",
      "How to Research Companies & Analyze Stocks",
      "Mutual Funds, Gold & Smart Fixed Deposit Strategies",
      "Portfolio Building & Long-Term Wealth Planning",
      "AI Tools in Finance for Smarter Decisions",
      "Real-World Investing Mindset & Practical Frameworks",
    ],
    duration: "1 Month • 8 Classes • 2 Classes / Week",
    totalFee: 650,
    priceLabel: "Total Fee: ₹650",
  },
  {
    id: 2,
    slug: "prompt-engineering",
    name: "Prompt Engineering",
    animationFile: "/lotties/prompt_course.json",
    description: [
      "Prompt Engineering Basics — How to write clear prompts to control AI output",
      "AI Image Generation using ChatGPT, Gemini, Grok and other tools",
      "Image Editing with AI — background change, object removal, enhancement",
      "Text → Image → Video workflow and AI video generation pipeline",
      "Talking Characters and AI animated videos with audio integration",
      "AI Music and Sound generation for videos and content",
      "YouTube Content Creation — thumbnails, loop videos, animated shorts",
      "Professional Work Skills — Email writing, PPT, Resume, and documents using AI",
      "Building a Digital CV Website using HTML, CSS and JavaScript",
      "Using VS Code and understanding project structure",
      "GitHub basics — version control and publishing your code online",
      "Deploying your website live using GitHub Pages",
      "Introduction to React and modern web app structure",
      "Understanding databases, LocalStorage, and cloud basics (Firebase overview)",
      "Practical projects to build confidence with AI and web tools",
      "Career guidance — freelancing, content creation, tech learning path",
    ],
    duration: "1 Month • 8 Classes • 2 Classes / Week",
    totalFee: 850,
    priceLabel: "Total Fee: ₹850",
  },
];

export type CourseStep = "details" | "enroll" | "payment-success";

export function getCourseByRouteParam(param: string | undefined): Course | null {
  return COURSE_DATA.find((course) => `${course.slug}-details` === param) ?? null;
}

export function buildCoursePath(course: Course, step?: CourseStep): string {
  const base = `${COURSE_BASE_PATH}/${course.slug}-details`;
  return step ? `${base}/${step}` : base;
}
