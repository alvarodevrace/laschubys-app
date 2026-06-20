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
}
