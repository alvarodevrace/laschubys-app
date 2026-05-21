import { DOCUMENT } from '@angular/common';
import { inject, Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

import { environment } from '../config/environment';

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly document = inject(DOCUMENT);
  private readonly meta = inject(Meta);
  private readonly title = inject(Title);

  setPage(title: string, description: string, image = '/brand/logo.png', canonical = '/') {
    const canonicalUrl = new URL(canonical, environment.siteUrl).toString();
    const imageUrl = new URL(image, environment.siteUrl).toString();

    this.title.setTitle(title);
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:url', content: canonicalUrl });
    this.meta.updateTag({ property: 'og:image', content: imageUrl });
    this.meta.updateTag({ name: 'twitter:title', content: title });
    this.meta.updateTag({ name: 'twitter:description', content: description });
    this.meta.updateTag({ name: 'twitter:image', content: imageUrl });

    this.ensureCanonical()?.setAttribute('href', canonicalUrl);
  }

  setJsonLd(data: object | object[]) {
    if (!this.document.head) return;
    const payload = Array.isArray(data) ? data : [data];
    let script = this.document.querySelector<HTMLScriptElement>('script[data-jsonld="laschubys"]');

    if (!script) {
      script = this.document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-jsonld', 'laschubys');
      this.document.head.appendChild(script);
    }

    script.textContent = JSON.stringify(payload);
  }

  private ensureCanonical() {
    let link = this.document.querySelector<HTMLLinkElement>('link[rel="canonical"]');

    if (!link && this.document.head) {
      link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.document.head.appendChild(link);
    }

    return link;
  }
}
