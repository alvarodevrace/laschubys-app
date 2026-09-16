export interface MediaKitHeroCta {
  label: string;
  href: string;
}

export interface MediaKitHero {
  title: string;
  subtitle: string;
  pill: string;
  image: string;
  imageAlt: string;
  ctaDownload: MediaKitHeroCta;
  ctaWrite: MediaKitHeroCta;
}

export interface MediaKitMetric {
  network: string;
  handle: string;
  value: string;
  label: string;
  engagement?: string;
  href?: string;
}

export interface MediaKitTeamMember {
  name: string;
  role: string;
  image: string;
  bio: string;
}

export interface MediaKitAbout {
  headline: string;
  story: string;
  team: MediaKitTeamMember[];
}

export interface MediaKitAudienceSegment {
  title: string;
  description: string;
  icon: string;
}

export interface MediaKitDemographic {
  label: string;
  value: string;
  detail: string;
}

export interface MediaKitAudience {
  segments: MediaKitAudienceSegment[];
  demographics: MediaKitDemographic[];
}

export interface MediaKitContentItem {
  title: string;
  image: string;
  metric: string;
}

export interface MediaKitServiceItem {
  name: string;
  description: string;
  deliverables: string[];
}

export interface MediaKitRate {
  name: string;
  priceUsd: number;
  price: string;
  description: string;
  features: string[];
  recommended?: boolean;
}

export interface MediaKitContact {
  email: string;
  whatsapp: string;
  whatsappLabel: string;
  website?: string;
  phone?: string;
  location?: string;
}

// ---------------------------------------------------------------------------
// Contrato del rediseño media kit (versión PDF, datos dinámicos desde la base)
// ---------------------------------------------------------------------------

export interface MediaKitPdfCover {
  title: string;
  subtitle: string;
  photos: Array<{ name: string; image: string }>;
}

export interface MediaKitPdfNetwork {
  name: string;
  handle: string;
  followers: string;
  engagement: string;
  reachMonthly: string;
  viewsMonthly: string;
  href?: string;
}

export interface MediaKitPdfAudience {
  countriesCount: string;
  countriesLabel: string;
  femalePercent: string;
  femaleLabel: string;
  ageRange: string;
  ageLabel: string;
  countries: string[];
}

export interface MediaKitPdfCollabItem {
  title: string;
  description: string;
}

export interface MediaKitPdfCollabFormats {
  title: string;
  intro: string;
  items: MediaKitPdfCollabItem[];
}

export interface MediaKitPdfHouseFormats {
  title: string;
  growthNote: string;
  items: Array<{ title: string }>;
}

export interface MediaKitData {
  hero: MediaKitHero;
  metrics: MediaKitMetric[];
  about: MediaKitAbout;
  audience: MediaKitAudience;
  content: MediaKitContentItem[];
  services: MediaKitServiceItem[];
  rates?: MediaKitRate[];
  contact: MediaKitContact;
  /** Secciones nuevas (diseño PDF media kit) — dinámicas desde la base. */
  cover?: MediaKitPdfCover;
  socialMetrics?: MediaKitPdfNetwork[];
  audienceOverview?: MediaKitPdfAudience;
  collabFormats?: MediaKitPdfCollabFormats;
  houseFormats?: MediaKitPdfHouseFormats;
}
