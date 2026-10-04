import { SoftwareContent } from "../types/software";
import "../components/styles/softwarePage.css";


export const softwareContent: Record<string, SoftwareContent> = {

  "newsletter": {

    features: [
      "Centralized resource hub for students, professionals, and job seekers",
      "Quick access to ITI, Diploma, and UG/PG academic portals",
      "Curated productivity tools and AI platforms",
      "Investing resources and financial information websites",
      "Government job recruitment portals and notifications",
      "Organized categories that reduce time spent searching online"
    ],

    purpose: `The primary goal of Openroot NewsLetter is to make essential educational, productivity, financial, and career resources easily accessible through a single platform.

By organizing trusted websites into structured categories, the platform helps users quickly discover useful portals without spending time searching across multiple sources. The initiative reflects Openroot Systems’ mission of supporting digital learning, skill development, and career exploration through practical online tools.`
  },

  "coevas-terminal": {
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

  "makaut-grade-pro": {
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
  },

  "gdrive-web-extension": {
  features: [
    "One-Click Automation with Intelligent File Renaming",
    "Works Directly Inside Google Drive",
    "Simple and intuitive design, Handles multiple files at once",
    "Secure Google Authentication, Does not store or transfer user data",
    "Optimized for performance, runs smoothly without affecting browser speed",
    "Free to use, no hidden costs or subscriptions"
  ],

  purpose: `The purpose of the Openroot GDrive Automation System is to eliminate the repetitive and time-consuming process of manually organizing and renaming files in Google Drive.

Many users, especially students, developers, and content creators, deal with large volumes of media files that are often poorly named and difficult to manage. This leads to inefficiency, confusion, and wasted time.

Our solution addresses this problem by introducing a simple, one-click automation system that intelligently renames and organizes files into a clean, structured format. By doing so, it improves productivity, enhances file accessibility, and ensures a more organized digital workspace.

The tool is designed with a strong focus on usability and minimal user effort, enabling anyone to manage their files efficiently without technical complexity.`}

};