import { Component, inject, resource, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';

import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmSkeletonImports } from '@spartan-ng/helm/skeleton';
import { HlmBreadcrumbImports } from '@spartan-ng/helm/breadcrumb';

import { SeoService } from '../../core/services/seo.service';
import { ContentService } from '../../core/services/content.service';
import { BlogPostCardComponent } from './components/blog-post-card.component';
import {
  ScrollRevealDirective,
  StaggerChildrenDirective,
  TiltCardDirective,
} from '../../shared/animations';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-blog-list',
  standalone: true,
  imports: [
    RouterLink,
    BlogPostCardComponent,
    ScrollRevealDirective,
    StaggerChildrenDirective,
    TiltCardDirective,
    HlmButtonImports,
    HlmCardImports,
    HlmSkeletonImports,
    HlmBreadcrumbImports,
  ],
  template: `
    <section class="py-10 pb-8" appScrollReveal>
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav class="mb-4" hlmBreadcrumb>
          <ol hlmBreadcrumbList>
            <li hlmBreadcrumbItem>
              <a hlmBreadcrumbLink [link]="['/']">Inicio</a>
            </li>
            <li hlmBreadcrumbSeparator></li>
            <li hlmBreadcrumbItem>
              <span hlmBreadcrumbPage>Blog</span>
            </li>
          </ol>
        </nav>
        <h1
          class="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight text-primary mb-2"
          appTextReveal
        >
          Historias reales. Sin filtros.
        </h1>
        <p class="text-muted-foreground max-w-2xl">
          Vida cotidiana con Iris y Rubi. Tips, reseñas y momentos que toda amante de gatas
          entiende.
        </p>
      </div>
    </section>

    <section class="pb-20" appScrollReveal [y]="60" [delay]="0.1">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        @if (postsResource.isLoading()) {
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            @for (skeleton of [1, 2, 3, 4, 5, 6]; track skeleton) {
              <hlm-card class="overflow-hidden">
                <hlm-skeleton class="aspect-video w-full rounded-none" />
                <div hlmCardContent class="space-y-3 py-5">
                  <hlm-skeleton class="h-3 w-20" />
                  <hlm-skeleton class="h-5 w-full" />
                  <hlm-skeleton class="h-4 w-3/4" />
                  <hlm-skeleton class="h-3 w-1/2" />
                </div>
              </hlm-card>
            }
          </div>
        } @else if (postsResource.value()?.length) {
          <div
            class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
            appStaggerChildren
            [staggerDelay]="0.1"
            childSelector="[appTiltCard]"
          >
            @for (post of postsResource.value() ?? []; track post.slug) {
              <div appTiltCard [scale]="1.03" class="h-full">
                <app-blog-post-card [post]="post" />
              </div>
            }
          </div>
        } @else {
          <div class="text-center py-20">
            <p class="text-xs font-extrabold uppercase tracking-widest text-primary mb-3">
              Próximamente
            </p>
            <h2 class="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground mb-3">
              Las historias están en camino.
            </h2>
            <p class="text-muted-foreground max-w-md mx-auto mb-6">
              Iris y Rubi todavía están ordenando el caos editorial. Vuelve pronto.
            </p>
            <a hlmBtn routerLink="/">Volver al inicio</a>
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
