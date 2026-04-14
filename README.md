# Openroot Systems

> **Smart Systems for Smart People**  
> Training · Software Solutions · Digital Innovation

[![Website](https://img.shields.io/badge/Website-openroot.in-brightgreen?style=flat-square)](https://openroot.in)
[![Stack](https://img.shields.io/badge/Stack-React%20%2B%20TypeScript%20%2B%20Vite-blue?style=flat-square)]()
[![Tests](https://img.shields.io/badge/Testing-Vitest-yellow?style=flat-square)]()
[![Status](https://img.shields.io/badge/Status-Production-success?style=flat-square)]()

---

## What is Openroot Systems?

Openroot Systems is a product-focused software company that builds **clean, scalable, real-world usable systems** for students, startups, and small businesses — not just prototypes.

**Mission:**
> Empower students, startups, and small businesses through modern software, automation, and practical digital education.

**Core Philosophy:**
- Engineering-first mindset
- Performance, scalability, and maintainability
- Design consistency and professional UI standards
- Real-world usability over theory

---

## Live Products

| Product | Category | Description |
|---|---|---|
| [Travel Expense Manager](https://openroot.in/openroot-travel-expense-manager/) | Finance Utility | Track group travel expenses and auto-calculate who owes whom |
| [Resource Hub & Job Updates](https://openroot.in/openroot-helping-hand/) | Resource Platform | Curated tools, websites and job updates for students |
| [NIOR AI](https://openroot-time-ai-module.web.app/) | AI Tool | AI-powered assistant for financial insights and decision support |
| [Openroot Classes](https://openroot-classes-firebase.web.app/) | Education Platform | Training in prompt engineering, financial literacy and productivity |
| [Coevas Media Downloader](https://openroot.in/Coevas-Systems-Openroot/) | Media Utility | Download video/audio from YouTube, Instagram, Facebook, Threads |
| [Makaut GPA Calculator](https://openroot.in/openroot-makaut_grade_and_percentage-calculator/) | Education Platform | GPA and percentage calculator for MAKAUT students |

---

## Technology Stack

### Frontend
- **React 18** with **TypeScript** — component-driven architecture
- **Vite** — fast build tooling and HMR
- **Modular CSS + plain CSS** — scoped and global styles side by side
- **Framer Motion** — page transitions and entrance animations
- **Lottie (JSON animations)** — login, success, error micro-animations

### State & Data
- **Zustand** — lightweight global state management
- **React Context** — theme (dark/light) and back-to-top state
- **Externalized data layer** — `softwareList.ts`, `softwareContent.ts`, `aboutdata.tsx`

### Auth & Backend
- **Firebase Authentication** — Google, GitHub, Facebook OAuth
- Secure routing with protected views and session management

### Media & SEO
- **Cloudinary CDN** — video hosting with proper streaming headers
- **React Helmet Async** — dynamic meta tags, Open Graph, Twitter Cards
- **sitemap.xml + robots.txt** — search engine optimized out of the box

### Testing
- **Vitest** — unit and component testing
- `setupTests.ts` configured for the test environment

### Tooling
- Git + GitHub for version control
- ESLint + strict TypeScript for code quality
- Optimized Vite production build pipeline

---

## Project Structure

```
openroot-web/
├── public/
│   ├── assets/              # Static images (avif, png, svg)
│   ├── favicon.ico
│   ├── robots.txt           # SEO crawler config
│   └── sitemap.xml          # Search engine sitemap
│
└── src/
    ├── animations/          # Lottie JSON files (login, success, error states)
    ├── components/
    │   ├── about/           # WhatWeOffer, WhoWeAre, WhyWeImportant
    │   ├── styles/          # Component-scoped CSS files
    │   ├── ThemeToggle/     # Dark/light mode toggle component
    │   ├── Navbar.tsx
    │   ├── Header.tsx
    │   ├── Footer.tsx
    │   ├── LoginModal.tsx
    │   ├── CertificateModal.tsx
    │   ├── FaqModal.tsx
    │   └── Advertisement.tsx
    ├── context/
    │   ├── ThemeContext.tsx  # Global dark/light theme
    │   └── BackToTop.tsx    # Scroll-to-top context
    ├── data/
    │   ├── softwareList.ts  # All product metadata and Cloudinary video URLs
    │   ├── softwareContent.ts # Detailed content per product (overview, features)
    │   └── aboutdata.tsx    # Company info and about page content
    ├── hooks/
    │   └── useInView.ts     # Intersection Observer for scroll animations
    ├── lib/
    │   └── firebase.ts      # Firebase app initialization and auth config
    ├── motion/
    │   ├── variants.ts      # Shared Framer Motion animation variants
    │   └── useCarousel.ts   # Carousel motion hook
    ├── pages/
    │   ├── SoftwareHub.tsx  # Software listing page
    │   ├── SoftwarePage.tsx # Individual product page with video player
    │   └── SoftwareSolutions.tsx
    ├── types/
    │   ├── software.ts      # Software and SoftwareContent interfaces
    │   └── types.ts         # Shared TypeScript types
    ├── App.tsx
    ├── main.tsx
    └── index.css
```

---

## Getting Started

```bash
# Clone the repository
git clone https://github.com/COMEONSOM/openroot-web.git
cd openroot-web

# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm run test

# Build for production
npm run build
```

Create a `.env` file in the root with your Firebase config:

```env example
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

> Never commit your `.env` file. It is listed in `.gitignore`.

---

## Engineering Standards

- Clean code and refactoring discipline — no dead code shipped
- DRY principles throughout — shared variants, hooks, and data layers
- Modular CSS architecture — scoped styles prevent leakage
- Lottie animations for feedback states — login, success, failure
- Performance-first — AVIF images, Cloudinary CDN, lazy loading
- Accessibility-first — ARIA labels, semantic HTML, keyboard navigation
- SEO-ready — React Helmet, Open Graph, sitemap, robots.txt
- Production-ready UI polish — no rough edges shipped

---

## What Recruiters Should Know

This is **not a demo-only project** — it ships real products used by real users.

Evaluating this codebase demonstrates:

- **UI Engineering** — Lottie animations, Framer Motion, micro-interactions, responsive layouts
- **Architecture thinking** — modular, scalable, maintainable systems with clear separation of concerns
- **Production discipline** — SEO, accessibility, performance, error handling, protected routing
- **Full product ownership** — from design system to deployment pipeline
- **Real-world problem solving** — tools that solve actual user problems

---

## Collaboration & Careers

We welcome:
- Full-stack engineers
- UI / frontend engineers
- Automation specialists
- Product designers
- Interns passionate about real-world engineering

Collaboration is driven by **quality, ownership, and continuous learning.**

---

## Contact

**Organization:** Openroot Systems  
**Website:** [openroot.in](https://openroot.in)  
**Email:** [connect.openroot@gmail.com](mailto:connect.openroot@gmail.com)

---

> Built with passion by the Openroot founding team.