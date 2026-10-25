// ============================================================
// BANNER DATA — SLIM VERSION
// This file now only describes the BANNER IMAGES and where each
// banner goes. The page content (title, facts, sections, CTA…)
// no longer lives here: every banner has its own dedicated page
// in /bannerPages, so each page can look completely different.
//
// Each banner = 2 images (mobile + laptop) + a slug.
// Clicking a banner opens  /openroot-classes/<slug>
// ============================================================



import banner1Mobile from "../../../assets-oc/banner1_mobile.avif";
import banner1Laptop from "../../../assets-oc/banner1_laptop.avif";
import banner2Mobile from "../../../assets-oc/banner2_mobile.avif";
import banner2Laptop from "../../../assets-oc/banner2_laptop.avif";

export const BANNER_BASE_PATH = "/openroot-classes";

export interface BannerEntry {
  number: number;
  /** URL part: /openroot-classes/<slug>. Must match a key in BannerPageRouter. */
  slug: string;
  /** Alt text for the banner image (screen readers + SEO). */
  alt: string;
  mobileImage: string;
  laptopImage: string;
}

export const BANNER_ENTRIES: BannerEntry[] = [
  // ----------------------------------------------------------
  // BANNER 1 -> bannerPages/PromptEngineeringPage.tsx
  // ----------------------------------------------------------
  {
    number: 1,
    slug: "prompt-engineering",
    alt: "Become a certified prompt engineer. Learn practical prompt engineering from zero.",
    mobileImage: banner1Mobile,
    laptopImage: banner1Laptop,
  },

  // ----------------------------------------------------------
  // BANNER 2 -> bannerPages/TheRightChoicePage.tsx
  // ----------------------------------------------------------
  {
    number: 2,
    slug: "the-right-choice",
    alt: "Why openroot.in is the right choice for you. Simple, practical, result-oriented learning.",
    mobileImage: banner2Mobile,
    laptopImage: banner2Laptop,
  },
];