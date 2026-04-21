import { Software } from "../types/software";

const CLOUD = "https://res.cloudinary.com/dydh05l1u/video/upload";  // aryan cloudinary account for hosting software demo videos

// Get-ChildItem *.mp4 | ForEach-Object {ffmpeg -i "$($_.Name)" -vcodec libx264 -crf 23 -preset medium -pix_fmt yuv420p -movflags +faststart -vf "scale=1280:-2" -acodec aac -b:a 128k "compressed_$($_.Name)"} 

export const softwareList: Software[] = [

  {
    name: "Travel Expense Manager",
    shortName: "Travel Manager",
    slug: "travel-expense-manager",
    url: "/travel-expense-manager",
    video: `${CLOUD}/travel-expense-manager-demo_yg1yif.mp4`,
    description: "Track group travel expenses and automatically calculate who owes whom during trips.",
    seoTitle: "Travel Expense Manager | Split Trip Expenses Easily",
    seoDescription: "Manage and split group travel expenses easily. Track spending, calculate balances and simplify trip budgeting with Openroot Travel Expense Manager.",
    category: "Finance Utility"
  },

  {
    name: "Resource Hub & Job Updates",
    shortName: "Resource Hub",
    slug: "resource-hub",
    url: "/resource-hub",
    video: `${CLOUD}/resource-hub-demo_rlkmkr.mp4`,
    description: "A curated collection of important websites, tools and job updates for students and learners.",
    seoTitle: "Resource Hub & Job Updates for Students | Openroot",
    seoDescription: "Find latest job updates, student resources, useful websites and productivity tools in one organized platform by Openroot.",
    category: "Resource Platform"
  },

  {
    name: "NIOR AI",
    shortName: "NIOR AI",
    slug: "nior-ai",
    url: "https://openroot-time-ai-module.web.app/",
    video: `${CLOUD}/nior-ai-demo_higyoa.mp4`,
    description: "AI powered productivity assistant that helps with financial insights, calculations and decision support.",
    seoTitle: "NIOR AI – Financial AI Assistant & Smart Calculator",
    seoDescription: "Use NIOR AI for financial calculations, investment insights and smart decision-making with AI-powered tools by Openroot.",
    category: "AI Tool"
  },

  {
    name: "Openroot Classes",
    shortName: "Classes",
    slug: "openroot-classes",
    url: "/openroot-classes",
    video: `${CLOUD}/openroot-classes-demo_pbjffx.mp4`,
    description: "Online learning platform providing training in prompt engineering, financial literacy and productivity skills.",
    seoTitle: "Openroot Classes – Learn AI, Finance & Productivity Skills",
    seoDescription: "Join Openroot Classes to learn prompt engineering, financial literacy and real-world productivity skills with practical training.",
    category: "Education Platform"
  },

  {
    name: "Coevas Media Downloader",
    shortName: "Coevas",
    slug: "coevas-terminal",
    url: "/coevas-terminal",
    video: `${CLOUD}/coevas-demo_fidh0m.mp4`,
    description: "Download video/audio/posts instantly from multiple platforms including YouTube, Instagram, Facebook, Threads.",
    seoTitle: "Coevas Terminal – Download Videos & Audio Easily",
    seoDescription: "Download videos and audio from multiple platforms using Coevas Terminal, a lightweight desktop tool by Openroot.",
    category: "Media Utility"
  },

  {
    name: "Makaut GradeCalculator",
    shortName: "makaut",
    slug: "makaut-grade-pro",
    url: "/makaut-grade-pro",
    video: `${CLOUD}/makaut-calculator-demo_uwyfuj.mp4`,
    description: "Grade and Percentage Calculator for MAKAUT students to easily calculate their GPA and percentage based on their marks.",
    seoTitle: "MAKAUT GPA to Percentage Calculator | Openroot Tool",
    seoDescription: "Convert GPA to percentage easily with Openroot MAKAUT calculator. Supports SGPA, CGPA, DGPA with accurate results.",
    category: "Education Platform"
  },

  {
  name: "Openroot GDrive Automation",
  shortName: "GDrive Automation",
  slug: "gdrive-web-extension",
  url: "/gdrive-web-extension",
  video: `${CLOUD}/compressed_gdriveautomation_cbsmjs.mp4`,
  description:
    "A guided Chrome extension software page that helps users install and use the GDrive automation tool.",
  seoTitle: "Openroot GDrive Automation | Chrome Extension Guide",
  seoDescription:
    "Learn how to install, pin, and use the Openroot GDrive Automation Chrome extension with a simple guided interface.",
  category: "Automation Utility"
}

];