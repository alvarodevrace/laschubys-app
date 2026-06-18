import { Component, inject, resource, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';

import { SeoService } from '../../core/services/seo.service';
import { ContentService } from '../../core/services/content.service';
import { BlogPostCardComponent } from './components/blog-post-card.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-blog-list',
  standalone: true,
  imports: [RouterLink, BlogPostCardComponent],
  template: `
    <section class="py-10 pb-8" data-reveal>
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav class="flex items-center gap-2 mb-4 text-sm text-gray-500" aria-label="Breadcrumb">
          <a routerLink="/">Inicio</a>
          <span>›</span>
          <span>Blog</span>
        </nav>
        <h1
          class="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight text-orange mb-2"
        >
          Historias reales. Sin filtros.
        </h1>
        <p class="text-gray-500 max-w-2xl">
          Vida cotidiana con Iris y Rubi. Tips, reseñas y momentos que toda amante de gatas
          entiende.
        </p>
      </div>
    </section>

    <section class="pb-20" data-reveal>
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        @if (postsResource.isLoading()) {
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            @for (skeleton of [1, 2, 3, 4, 5, 6]; track skeleton) {
              <article
                class="rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm"
              >
                <div class="aspect-video bg-gray-200 animate-pulse"></div>
                <div class="p-5 space-y-3">
                  <div class="h-3 w-20 bg-gray-200 rounded animate-pulse"></div>
                  <div class="h-5 w-full bg-gray-200 rounded animate-pulse"></div>
                  <div class="h-4 w-3/4 bg-gray-200 rounded animate-pulse"></div>
                  <div class="h-3 w-1/2 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </article>
            }
          </div>
        } @else if (postsResource.value()?.length) {
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            @for (post of postsResource.value() ?? []; track post.slug) {
              <app-blog-post-card [post]="post" />
            }
          </div>
        } @else {
          <div class="text-center py-20">
            <p class="text-xs font-extrabold uppercase tracking-widest text-orange mb-3">
              Próximamente
            </p>
            <h2 class="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900 mb-3">
              Las historias están en camino.
            </h2>
            <p class="text-gray-500 max-w-md mx-auto">
              Iris y Rubi todavía están ordenando el caos editorial. Vuelve pronto.
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

  constructor() {
    this.seo.setPage(
      'Blog | Las Chubys',
      'Historias, tips y caos felino editorial.',
      '/images/cats/iris2.jpeg',
      '/blog',
    );
  }
}
