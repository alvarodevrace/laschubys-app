import { TestBed } from '@angular/core/testing';
import { DOCUMENT } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';

import { SeoService } from './seo.service';

interface FakeElement {
  tagName: string;
  type?: string;
  textContent: string | null;
  attributes: Record<string, string>;
  setAttribute: ReturnType<typeof vi.fn>;
}

function createFakeDocument() {
  const created = new Map<string, FakeElement[]>();

  const head = { appendChild: vi.fn() };

  const createElement = vi.fn((tag: string): FakeElement => {
    const el: FakeElement = {
      tagName: tag,
      textContent: null,
      attributes: {},
      setAttribute: vi.fn((name: string, value: string) => {
        el.attributes[name] = value;
      }),
    };
    const list = created.get(tag) ?? [];
    list.push(el);
    created.set(tag, list);
    return el;
  });

  const querySelector = vi.fn((selector: string) => {
    if (selector.startsWith('script')) return created.get('script')?.[0] ?? null;
    if (selector.startsWith('link')) return created.get('link')?.[0] ?? null;
    return null;
  });

  const querySelectorAll = vi.fn(() => []);

  const getElementsByTagName = vi.fn((tag: string) => {
    if (tag === 'head') return [head];
    return created.get(tag) ?? [];
  });

  return { head, createElement, querySelector, querySelectorAll, getElementsByTagName, created };
}

describe('SeoService', () => {
  let service: SeoService;
  let fakeDoc: ReturnType<typeof createFakeDocument>;

  beforeEach(() => {
    fakeDoc = createFakeDocument();

    TestBed.configureTestingModule({
      providers: [{ provide: DOCUMENT, useValue: fakeDoc }],
    });

    service = TestBed.inject(SeoService);
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  describe('setPage', () => {
    it('sets the title via Title.setTitle', () => {
      const titleSpy = vi.spyOn(Title.prototype, 'setTitle');

      service.setPage('Gatos felices', 'Tienda de gatos');

      expect(titleSpy).toHaveBeenCalledWith('Gatos felices');
    });

    it('writes description, og and twitter meta tags', () => {
      const updateTagSpy = vi.spyOn(Meta.prototype, 'updateTag');

      service.setPage('Gatos felices', 'Tienda de gatos');

      expect(updateTagSpy).toHaveBeenCalledWith({ name: 'description', content: 'Tienda de gatos' });
      expect(updateTagSpy).toHaveBeenCalledWith({ property: 'og:title', content: 'Gatos felices' });
      expect(updateTagSpy).toHaveBeenCalledWith({ property: 'og:description', content: 'Tienda de gatos' });
      expect(updateTagSpy).toHaveBeenCalledWith({
        property: 'og:url',
        content: 'http://localhost:4321/',
      });
      expect(updateTagSpy).toHaveBeenCalledWith({
        property: 'og:image',
        content: 'http://localhost:4321/brand/logo.png',
      });
      expect(updateTagSpy).toHaveBeenCalledWith({ name: 'twitter:title', content: 'Gatos felices' });
      expect(updateTagSpy).toHaveBeenCalledWith({ name: 'twitter:description', content: 'Tienda de gatos' });
      expect(updateTagSpy).toHaveBeenCalledWith({
        name: 'twitter:image',
        content: 'http://localhost:4321/brand/logo.png',
      });
    });

    it('sets the canonical link href against dev siteUrl', () => {
      service.setPage('Título', 'Descripción');

      const link = fakeDoc.created.get('link')?.[0];
      expect(link?.setAttribute).toHaveBeenCalledWith('rel', 'canonical');
      expect(link?.setAttribute).toHaveBeenCalledWith('href', 'http://localhost:4321/');
      expect(fakeDoc.head.appendChild).toHaveBeenCalledWith(link);
    });

    it('reuses the existing canonical link and keeps an absolute canonical URL', () => {
      service.setPage('Primera', 'Primera descripción');

      service.setPage('Segunda', 'Segunda descripción', '/brand/logo.png', '/blog');

      expect(fakeDoc.created.get('link')).toHaveLength(1);
      const link = fakeDoc.created.get('link')?.[0];
      expect(link?.attributes['href']).toBe('http://localhost:4321/blog');
      expect(fakeDoc.head.appendChild).toHaveBeenCalledWith(link);
    });
  });

  describe('setJsonLd', () => {
    it('creates and appends the JSON-LD script on first call', () => {
      service.setJsonLd({ '@type': 'WebSite', name: 'Las Chubys' });

      const script = fakeDoc.created.get('script')?.[0];
      expect(script).toBeDefined();
      expect(script?.type).toBe('application/ld+json');
      expect(script?.attributes['data-jsonld']).toBe('laschubys');
      expect(fakeDoc.head.appendChild).toHaveBeenCalledWith(script);
      expect(script?.textContent).toBe(JSON.stringify([{ '@type': 'WebSite', name: 'Las Chubys' }]));
    });

    it('updates the existing script on the second call instead of duplicating', () => {
      service.setJsonLd({ '@type': 'WebSite', name: 'Las Chubys' });
      service.setJsonLd({ '@type': 'Organization', name: 'Las Chubys' });

      expect(fakeDoc.createElement).toHaveBeenCalledTimes(1);
      expect(fakeDoc.created.get('script')).toHaveLength(1);
      expect(fakeDoc.head.appendChild).toHaveBeenCalledTimes(1);

      const script = fakeDoc.created.get('script')?.[0];
      expect(script?.textContent).toBe(JSON.stringify([{ '@type': 'Organization', name: 'Las Chubys' }]));
    });
  });
});
