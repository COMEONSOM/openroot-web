export interface Software {
  slug: string;
  name: string;
  description: string;
  url: string;
  seoTitle?: string;
  seoDescription?: string;
  video?: string;
}

export interface SoftwareContent {
  overview: string;
  features: string[];
  purpose: string;
}