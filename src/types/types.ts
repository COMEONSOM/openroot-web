// ─────────────────────────────────────────────────────────────────
// src/components/types/types.ts
// SHARED TYPESCRIPT INTERFACES AND UTILITY TYPES
// IMPORTED BY: WhoWeAre, WhatWeOffer, WhyWeImportant, data.tsx
// ─────────────────────────────────────────────────────────────────

import type { CSSProperties, ReactNode } from "react";

// CSS CUSTOM PROPERTIES BRIDGE
// ALLOWS --ot-* INLINE STYLE PROPS LIKE style={{ "--_accent": "..." } as WithVars}
export type WithVars = CSSProperties & Record<`--${string}`, string | number>;

// OFFER CARD DATA SHAPE — USED IN WhatWeOffer.tsx AND data.tsx
export interface OfferCard {
  tag:        string;       // BADGE LABEL e.g. "Openroot Classes"
  title:      string;       // CARD HEADLINE
  highlights: string[];     // QUICK-SCAN CHIPS ROW RENDERED BELOW TITLE
  intro:      ReactNode;    // INTRO PARAGRAPH — JSX SUPPORTED
  subheading: string;       // SUBHEADING TEXT ABOVE BULLET LIST
  items:      ReactNode[];  // BULLET LIST ITEMS — JSX SUPPORTED
  note:       ReactNode;    // BOTTOM CALLOUT NOTE — JSX SUPPORTED
  accentVar:  string;       // CSS VARIABLE STRING e.g. "var(--ot-accent-warm)"
  image?:     string;       // OPTIONAL HERO IMAGE PATH — RESERVED FOR FUTURE USE
}

// REASON CARD DATA SHAPE — USED IN WhyWeImportant.tsx AND data.tsx
export interface Reason {
  icon:  string;  // UNICODE GLYPH RENDERED INSIDE icon-pill CIRCLE
  title: string;  // CARD HEADLINE
  body:  string;  // DESCRIPTION TEXT
}