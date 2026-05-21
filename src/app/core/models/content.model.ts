export interface BlogComment {
  id?: string;
  author: string;
  body: string;
  date: string;
}

export interface BlogPost {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  author: string;
  readTime: string;
  publishedAt: string;
  content: string[];
  comments: BlogComment[];
  coverImage?: string | null;
}

export interface ProductPick {
  id: string;
  tag: string;
  source: 'owned' | 'affiliate';
  audience: 'michis' | 'michi-lovers';
  name: string;
  price: string;
  priceValue: number;
  copy: string;
  description: string;
  images: string[];
  affiliateUrl?: string;
  shippingNote: string;
}

export interface SiteMeta {
  name: string;
  tagline: string;
  subtitle: string;
  email: string;
  location: string;
}

export interface DbBlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string[] | null;
  category: string | null;
  read_time: string | null;
  cover_image: string | null;
  author: string;
  published_at: string | null;
  created_at?: string;
}

export interface DbComment {
  id: string;
  post_slug: string;
  user_id: string;
  author_name: string;
  body: string;
  reported: boolean;
  created_at: string;
}

export interface DbProduct {
  id: string;
  name: string;
  price: number | string;
  source: 'owned' | 'affiliate';
  audience?: 'michis' | 'michi-lovers' | null;
  tag: string | null;
  copy: string | null;
  description: string | null;
  images: string[] | null;
  affiliate_url: string | null;
  shipping_note: string | null;
  active: boolean;
  created_at?: string;
}
