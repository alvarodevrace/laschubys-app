import { Component, inject, resource } from '@angular/core';
import { RouterLink } from '@angular/router';

import { SeoService } from '../../core/services/seo.service';
import { ContentService } from '../../core/services/content.service';

@Component({
  selector: 'app-blog-list',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="page-hero" data-reveal>
      <div class="page-hero__inner">
        <nav class="breadcrumb" aria-label="Breadcrumb">
          <a routerLink="/">Inicio</a>
          <span>›</span>
          <span>Blog</span>
        </nav>
        <h1 class="page-hero__title">Historias reales. Sin filtros.</h1>
        <p class="page-hero__sub">
          Vida cotidiana con Iris y Rubi. Tips, reseñas y momentos que toda amante de gatas
          entiende.
        </p>
      </div>
    </section>

    <section class="cards-section" data-reveal>
      <div class="page-wrap">
        @if (postsResource.isLoading()) {
          <p>Cargando posts...</p>
        } @else if (postsResource.value()?.length) {
          <div class="cards-grid">
            @for (post of postsResource.value() ?? []; track post.slug) {
              <a class="card-blog" [routerLink]="['/blog', post.slug]">
                <div class="card-blog__photo">
                  <img
                    [src]="post.coverImage || fallbackImage($index)"
                    [alt]="post.title"
                    loading="lazy"
                  />
                </div>
                <p class="card-blog__cat">{{ post.category }}</p>
                <h3 class="card-blog__title">{{ post.title }}</h3>
                @if (post.excerpt) {
                  <p
                    style="font-size:0.85rem;color:var(--muted);margin-bottom:0.75rem;font-weight:300;line-height:1.6;"
                  >
                    {{ post.excerpt }}
                  </p>
                }
                <span class="card-blog__read">Leer artículo</span>
              </a>
            }
          </div>
        } @else {
          <div style="text-align:center;padding:4rem 0;">
            <p class="section-eyebrow">Próximamente</p>
            <h2
              style="font-size:clamp(1.5rem,3vw,2.25rem);font-weight:800;letter-spacing:-0.03em;margin-bottom:1rem;"
            >
              Las historias están en camino.
            </h2>
            <p style="color:var(--muted);font-weight:300;">
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
