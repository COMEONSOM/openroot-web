// ============================================================
// BANNER DATA — ONE ENTRY PER BANNER (AND PER BANNER PAGE)
// - Edit this file to change banners, page content and images.
// - The page layout and styling never change (OCBannerDetail).
// ============================================================

import banner1Mobile from "../../../assets-oc/banner_openroot_classes_1_mobile.avif";
import banner1Laptop from "../../../assets-oc/banner_openroot_classes_1_laptop.avif";

// ============================================================
// SETTINGS
// ============================================================

/** Base URL of the Openroot Classes page. Banner pages live under it. */
export const BANNER_BASE_PATH = "/openroot-classes";

/** WhatsApp number with country code, digits only. */
export const WHATSAPP_NUMBER = "917866049865";

export const whatsappLink = (message: string): string =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

// ============================================================
// TYPES
// ============================================================

export interface DetailHighlight {
  label: string;
  value: string;
}

export interface DetailSection {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
  image?: string; // optional image shown beside the text
  imageAlt?: string;
}

export interface BannerPageContent {
  badge?: string; // small label above the title
  title: string;
  tagline: string;
  heroImage?: string; // optional image on the right of the hero
  heroImageAlt?: string;
  notice?: string; // optional highlighted note
  highlights: DetailHighlight[]; // quick facts grid
  sections: DetailSection[];
  cta: { label: string; href: string };
}

export interface BannerEntry {
  number: number; // banner 1, 2, 3 ...
  slug: string; // used in the URL: /openroot-classes/<slug>
  alt: string; // describes the banner image
  mobileImage: string; // mobile + tablet banner
  laptopImage: string; // laptop + larger banner
  page: BannerPageContent;
}

// ============================================================
// PLACEHOLDER PAGE (for banners whose content is not written yet)
// ============================================================

const draftPage = (number: number): BannerPageContent => ({
  badge: "Openroot Classes",
  title: `Banner ${number} page`,
  tagline: "Details for this banner will be added soon.",
  highlights: [{ label: "Status", value: "Coming soon" }],
  sections: [
    {
      heading: "About",
      paragraphs: ["Replace this content in bannerData.ts."],
    },
  ],
  cta: {
    label: "Contact on WhatsApp",
    href: whatsappLink(`Hi, I want to know more about banner ${number}.`),
  },
});

// ============================================================
// BANNERS
// ============================================================

export const BANNER_ENTRIES: BannerEntry[] = [
  // ----------------------------------------------------------
  // BANNER 1
  // ----------------------------------------------------------
  {
    number: 1,
    slug: "prompt-engineering",
    alt: "Become a Certified Prompt Engineer",
    mobileImage: banner1Mobile,
    laptopImage: banner1Laptop,
    page: {
      badge: "Professional Certificate Program",
      title: "Become a Certified Prompt Engineer",
      tagline:
        "Learn practical prompt engineering skills from zero. For beginners, students, creators, and non-tech learners. No coding background required.",
      highlights: [
        { label: "Duration", value: "2 hour class" },
        { label: "Fees", value: "₹200" },
        { label: "Language", value: "English, Hindi, Bengali" },
        { label: "Certificate", value: "Provided" },
        { label: "Level", value: "Beginner friendly" },
        { label: "Requirement", value: "No coding needed" },
      ],
      sections: [
        {
          heading: "What you will learn",
          bullets: [
            "Prompt engineering fundamentals",
            "Content generation: image, audio and video",
            "Coding basics",
            "Instagram reels editing using prompts",
            "AI tools and workflow",
          ],
        },
        {
          heading: "The workflow you will follow",
          paragraphs: [
            "Ideas, then prompts, then create, then refine, then publish.",
          ],
        },
        {
          heading: "Who this is for",
          bullets: ["Beginners", "Students", "Creators", "Non-tech learners"],
        },
      ],
      cta: {
        label: "Contact on WhatsApp",
        href: whatsappLink(
          "Hi, I want to know more about the Prompt Engineering program."
        ),
      },
    },
  },
];

// ============================================================
// LOOKUP
// ============================================================

export const getBannerBySlug = (
  slug: string | undefined
): BannerEntry | undefined =>
  slug ? BANNER_ENTRIES.find((entry) => entry.slug === slug) : undefined;