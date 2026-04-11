import { SoftwareContent } from "../types/software";
import "../components/styles/softwarePage.css";


export const softwareContent: Record<string, SoftwareContent> = {

  "helping-hand": {
    overview: `Openroot Helping Hand — Resource Hub & Job Updates is a centralized digital platform designed to simplify access to essential online resources for students, professionals, and job seekers. Many learners struggle to find reliable educational portals, government services, and productivity tools scattered across the internet. This platform solves that problem by organizing important websites into structured categories so users can access them quickly from one place.

The platform is especially useful for students pursuing ITI, Diploma, and undergraduate or postgraduate education. Instead of navigating dozens of unrelated websites, learners can directly access academic portals, scholarship platforms, examination systems, and skill-development resources through a clean and organized interface.

Openroot Helping Hand also includes curated productivity tools, AI platforms, investing resources, and government job portals. By bringing these resources together into a structured interface, the platform reduces information overload and helps users discover valuable digital tools more efficiently.`,

    features: [
      "Centralized resource hub for students, professionals, and job seekers",
      "Quick access to ITI, Diploma, and UG/PG academic portals",
      "Curated productivity tools and AI platforms",
      "Investing resources and financial information websites",
      "Government job recruitment portals and notifications",
      "Organized categories that reduce time spent searching online"
    ],

    purpose: `The primary goal of Openroot Helping Hand is to make essential educational, productivity, financial, and career resources easily accessible through a single platform.

By organizing trusted websites into structured categories, the platform helps users quickly discover useful portals without spending time searching across multiple sources. The initiative reflects Openroot Systems’ mission of supporting digital learning, skill development, and career exploration through practical online tools.`
  },

  "coevas-terminal": {
    overview: `Coevas Terminal is a desktop application developed by Openroot Systems and distributed as a Windows executable built using the Electron framework. The software provides a clean and efficient interface that enables users to perform media downloading operations through a dedicated desktop environment.

  Unlike browser-based tools, Coevas Terminal runs as a standalone application, combining modern web technologies with native desktop capabilities to ensure smooth performance, stability, and ease of use.

  The application is powered by an internal processing system known as Coevas Panel. While Coevas Terminal serves as the user-facing software, Coevas Panel handles the underlying operations such as media extraction, multi-source handling, and processing workflows.

  All official versions of the application are distributed through GitHub Releases, ensuring that users always download authentic and up-to-date builds directly from the official source.`,

    features: [
      "Electron-based Windows desktop application",
      "Lightweight and optimized executable",
      "Powered by Coevas Panel processing system",
      "Supports media downloading across multiple platforms",
      "Structured version control via GitHub Releases",
      "Access to previous builds for compatibility",
      "Secure and transparent software distribution"
    ],

    purpose: `Coevas Terminal is designed to provide a reliable and efficient desktop environment for media downloading.

  By using a structured release system through GitHub, users can access authentic builds while developers maintain proper version control, release history, and update consistency.

  The integration of the Coevas Panel processing system ensures stable performance and efficient handling of complex downloading workflows across different platforms.`
  },

  "openroot-classes": {
    overview: `Openroot Classes is the education and skill-development initiative of Openroot Systems. The organization is a registered MSME under the Government of India and is also listed as an employer on the National Career Service (NCS) portal.

The initiative focuses on practical learning designed for students, beginners, and professionals who want to develop real-world skills rather than purely theoretical knowledge. Openroot Classes provides structured programs that combine modern technology education with financial literacy and practical skill development.`,

    features: [
      "Prompt Engineering training for AI workflows",
      "Financial investing and financial literacy education",
      "Practical skill development for real-world applications",
      "Affordable courses designed for students and beginners",
      "Ad-free learning environment",
      "Focus on future-ready digital skills"
    ],

    purpose: `Openroot Classes aims to help individuals become future-ready by combining technology learning with financial literacy and practical skill development.

The programs are designed to help learners understand AI tools, improve productivity, and build long-term financial awareness so they can make better career and investment decisions.`
  },

  "nior-ai": {
    overview: `NIOR AI is a specialized AI-powered financial assistant developed by Openroot Systems to simplify complex financial calculations and decision-making processes. Instead of functioning as a general-purpose AI system, NIOR AI focuses specifically on financial analysis and structured calculations.

The platform contains multiple financial engines designed to solve real-world problems such as gold pricing calculations, stock investment averaging, investment projections, and loan EMI analysis. Users interact with the system through a conversational interface that guides them step-by-step through the calculation process.`,

    features: [
      "Midas Engine for gold jewellery price calculations",
      "InvestIQ Engine for stock average price analysis",
      "MoneyGrow Engine for investment growth projections",
      "Debt Decoder Engine for EMI and loan analysis",
      "Conversational AI interface for guided calculations",
      "Lightweight AI optimized for financial tasks"
    ],

    purpose: `NIOR AI focuses on solving practical financial problems through specialized analytical engines rather than generic artificial intelligence models.

By combining financial calculators with an AI-guided workflow, the system helps users understand investments, pricing, loans, and financial planning in a clear and structured way.`
  },

  "openroot-makaut_grade_and_percentage-calculator": {
    overview: `Openroot MAKAUT GPA & Percentage Calculator is a specialized academic tool designed for students of Maulana Abul Kalam Azad University of Technology (MAKAUT). The platform helps students quickly convert their academic GPA scores into percentage values using formulas that follow the official university grading system.

Instead of manually applying complex credit-based calculations, students can simply enter their GPA values and instantly receive accurate results. The tool provides multiple calculators in a unified dashboard, allowing students to convert SGPA, YGPA, DGPA, and CGPA into percentage without confusion or calculation errors.

The platform also includes a unique feature that allows students to calculate their percentage up to a specific semester. This is especially useful for internship applications, scholarship forms, and placement processes where students often need to report their current academic percentage based on completed semesters.`,

    features: [
      "SGPA to Percentage conversion based on MAKAUT grading rules",
      "YGPA calculator using odd and even semester credit details",
      "DGPA calculator for multi-year courses with course type selection",
      "CGPA calculator using total credit index and total credits",
      "Percentage calculation up to a selected semester",
      "Support for both regular and lateral entry students",
      "Unified dashboard with multiple academic calculators",
      "Fast and accurate calculations following official MAKAUT formulas"
    ],

    purpose: `The primary purpose of the MAKAUT GPA & Percentage Calculator is to simplify academic result interpretation for MAKAUT students. Converting GPA values into percentage often requires multiple formulas and credit-based calculations that can be confusing when done manually.

Through this tool, Openroot Systems aims to provide students with a reliable academic utility that reduces calculation errors and makes academic performance evaluation faster, easier, and more transparent.`
  },

  "travel-expense-manager": {
    overview: `Openroot Travel Expense Manager is a smart group-expense management tool designed for travelers who want an easier way to track and split expenses during group trips.

When multiple people travel together, managing shared expenses such as food, transportation, accommodation, or tickets can quickly become confusing. This tool simplifies the process by allowing users to record expenses, assign contributors, and automatically calculate balances between participants.

The system provides a clear financial overview of the entire trip and helps groups manage their travel budget without complicated manual calculations.`,

    features: [
      "Group travel expense tracking system",
      "Support for multiple participants",
      "Flexible cost distribution methods",
      "Automatic balance calculations",
      "Multi-language interface",
      "PDF export for trip expense summaries"
    ],

    purpose: `The Travel Expense Manager simplifies group travel budgeting by automating expense tracking and balance calculations between participants.

Instead of manually determining who owes whom, the platform generates clear summaries that help travelers manage shared finances transparently and efficiently.`
  }

};