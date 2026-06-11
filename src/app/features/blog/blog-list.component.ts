import { Component, inject, resource, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';

import { SeoService } from '../../core/services/seo.service';
import { ContentService } from '../../core/services/content.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-blog-list',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="py-10 pb-8" data-reveal>
      <div class="max-w-6xl mx-auto px-4">
        <nav class="flex items-center gap-2 mb-4 text-sm text-gray-500" aria-label="Breadcrumb">
          <a routerLink="/">Inicio</a>
          <span>›</span>
          <span>Blog</span>
        </nav>
        <h1
          class="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight text-gray-900 mb-2"
        >
          Historias reales. Sin filtros.
        </h1>
        <p class="text-gray-500 max-w-2xl">
          Vida cotidiana con Iris y Rubi. Tips, reseñas y momentos que toda amante de gatas
          entiende.
        </p>
      </div>
    </section>

    <section class="cards-section" data-reveal>
      <div class="max-w-6xl mx-auto px-4">
        @if (postsResource.isLoading()) {
          <p>Cargando posts...</p>
        } @else if (postsResource.value()?.length) {
          <div class="cards-grid">
            @for (post of postsResource.value() ?? []; track post.slug) {
              <a
                class="group grid gap-2 rounded-2xl overflow-hidden bg-white border border-gray-200 transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(0,0,0,0.08)]"
                [routerLink]="['/blog', post.slug]"
              >
                <div class="aspect-video overflow-hidden bg-gray-100">
                  <img
                    [src]="post.coverImage || fallbackImage($index)"
                    [alt]="post.title"
                    loading="lazy"
                    class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <p class="mx-3.5 mt-2.5 text-xs font-extrabold uppercase tracking-wide text-orange">
                  {{ post.category }}
                </p>
                <h3 class="mx-3.5 text-base font-bold leading-snug text-gray-900">
                  {{ post.title }}
                </h3>
                @if (post.excerpt) {
                  <p class="text-sm text-gray-500 mb-3 font-light leading-relaxed">
                    {{ post.excerpt }}
                  </p>
                }
                <span class="mx-3.5 mb-3.5 text-sm font-bold text-orange">Leer artículo</span>
              </a>
            }
          </div>
        } @else {
          <div style="text-align:center;padding:4rem 0;">
            <p class="text-xs font-extrabold uppercase tracking-widest text-orange mb-1">
              Próximamente
            </p>
            <h2
              style="font-size:clamp(1.5rem,3vw,2.25rem);font-weight:800;letter-spacing:-0.03em;margin-bottom:1rem;"
            >
              Las historias están en camino.
            </h2>
            <p class="text-gray-500 font-light">
              Iris y Rubi todavía están ordenando el caos editorial.
            </p>
          </div>
        }
      </div>
    </section>
  `,
})
export class BlogListComponent {
  private readonly content = inject(ContentService);
  private readonly seo = inject(SeoService);

  protected readonly postsResource = resource({
    loader: async () => this.content.getPosts(),
  });

  protected fallbackImage(index: number) {
    const photos = [
      '/images/cats/iris.jpeg',
      '/images/cats/rubi.jpeg',
      '/images/cats/iris2.jpeg',
      '/images/cats/rubi2.jpeg',
      '/images/cats/iris3.jpeg',
      '/images/cats/rubi3.jpeg',
    ];
    return photos[index % photos.length];
  }

  constructor() {
    this.seo.setPage(
      'Blog | Las Chubys',
      'Historias, tips y caos felino editorial.',
      '/images/cats/iris2.jpeg',
      '/blog',
    );
  }
}
