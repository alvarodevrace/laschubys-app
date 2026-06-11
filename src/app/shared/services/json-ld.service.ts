import { Injectable, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

export interface ProductSchema {
  name: string;
  description: string;
  image: string;
  price: number;
  currency: string;
  availability: 'InStock' | 'OutOfStock';
  url: string;
}

export interface BlogPostSchema {
  headline: string;
  description: string;
  image: string;
  datePublished: string;
  author: string;
  url: string;
}

@Injectable({ providedIn: 'root' })
export class JsonLdService {
  private readonly doc = inject(DOCUMENT);

  private injectScript(json: unknown): void {
    const id = 'json-ld-schema';
    let script = this.doc.getElementById(id) as HTMLScriptElement | null;
    if (!script) {
      script = this.doc.createElement('script');
      script.id = id;
      script.type = 'application/ld+json';
      this.doc.head.appendChild(script);
    }
    script.textContent = JSON.stringify(json);
  }

  setProduct(schema: ProductSchema): void {
    this.injectScript({
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: schema.name,
      description: schema.description,
      image: schema.image,
      offers: {
        '@type': 'Offer',
        price: schema.price,
        priceCurrency: schema.currency,
        availability: `https://schema.org/${schema.availability}`,
        url: schema.url,
      },
    });
  }

  setBlogPost(schema: BlogPostSchema): void {
    this.injectScript({
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: schema.headline,
      description: schema.description,
      image: schema.image,
      datePublished: schema.datePublished,
      author: {
        '@type': 'Organization',
        name: schema.author,
      },
      url: schema.url,
    });
  }

  setOrganization(): void {
    this.injectScript({
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Las Chubys',
      url: 'https://laschubys.com',
      logo: 'https://laschubys.com/brand/logochuby.png',
      sameAs: [],
    });
  }

  clear(): void {
    const script = this.doc.getElementById('json-ld-schema');
    if (script) script.remove();
  }
}
