import { BlogComment, BlogPost, DbBlogPost, DbComment, DbProduct, ProductPick } from '../models/content.model';

function classifyProductAudience(row: Pick<DbProduct, 'name' | 'copy' | 'description' | 'tag' | 'audience'>): ProductPick['audience'] {
  if (row.audience === 'michis' || row.audience === 'michi-lovers') {
    return row.audience;
  }

  const haystack = `${row.name} ${row.copy || ''} ${row.description || ''} ${row.tag || ''}`.toLowerCase();
  const keywords = ['taza', 'mug', 'manta', 'decor', 'humano', 'camiseta', 'hoodie', 'poster', 'cafe'];
  return keywords.some((keyword) => haystack.includes(keyword)) ? 'michi-lovers' : 'michis';
}

export function estimateReadTime(paragraphs: string[]) {
  const words = paragraphs.join(' ').trim().split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.ceil(words / 180))} min`;
}

export function formatPostDate(value: string | null | undefined) {
  if (!value) {
    return 'Sin fecha';
  }

  return new Intl.DateTimeFormat('es-EC', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(value));
}

export function formatCommentDate(value: string) {
  return new Intl.DateTimeFormat('es-EC', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
}

export function toBlogPostView(row: DbBlogPost): BlogPost {
  return {
    slug: row.slug,
    category: row.category || 'Blog',
    title: row.title,
    excerpt: row.excerpt || '',
    author: row.author || 'Mamá de Las Chubys',
    readTime: row.read_time || estimateReadTime(row.content || []),
    publishedAt: formatPostDate(row.published_at || row.created_at),
    content: Array.isArray(row.content) ? row.content : [],
    comments: [],
    coverImage: row.cover_image,
  };
}

export function toCommentView(row: DbComment): BlogComment {
  return {
    id: row.id,
    author: row.author_name,
    body: row.body,
    date: formatCommentDate(row.created_at),
  };
}

export function toProductView(row: DbProduct): ProductPick {
  const priceValue = Number(row.price || 0);

  return {
    id: row.id,
    tag: row.tag || (row.source === 'owned' ? 'Las Chubys' : 'Amazon'),
    source: row.source,
    audience: classifyProductAudience(row),
    name: row.name,
    price: `$${priceValue.toFixed(0)}`,
    priceValue,
    copy: row.copy || '',
    description: row.description || '',
    images: Array.isArray(row.images) ? row.images : [],
    affiliateUrl: row.affiliate_url || undefined,
    shippingNote: row.shipping_note || '',
  };
}

export function mapPosts(dbRows: DbBlogPost[]) {
  return dbRows.map(toBlogPostView);
}

export function mapProducts(dbRows: DbProduct[]) {
  return dbRows.map(toProductView);
}
