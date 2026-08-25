import { Component, inject, resource, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { provideIcons } from '@ng-icons/core';
import { lucideCat, lucideNewspaper } from '@ng-icons/lucide';

import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmSkeletonImports } from '@spartan-ng/helm/skeleton';

import { SeoService } from '../../core/services/seo.service';
import { ContentService } from '../../core/services/content.service';
import { BlogPostCardComponent } from './components/blog-post-card.component';
import {
  ScrollRevealDirective,
  ParallaxDirective,
  StaggerChildrenDirective,
  TextRevealDirective,
} from '../../shared/animations';
import { SectionShellComponent } from '../../shared/ui/section-shell/section-shell.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-blog-list',
  standalone: true,
  imports: [
    RouterLink,
    BlogPostCardComponent,
    ScrollRevealDirective,
    ParallaxDirective,
    StaggerChildrenDirective,
    TextRevealDirective,
    SectionShellComponent,
    HlmButtonImports,
    HlmIconImports,
    HlmSkeletonImports,
  ],
  providers: [provideIcons({ lucideCat, lucideNewspaper })],
  template: `
    <!-- Header band -->
    <section class="relative bg-surface overflow-hidden" aria-labelledby="blog-title">
      <div class="relative max-w-6xl mx-auto px-4 pt-10 pb-24 md:pt-12 md:pb-28">
        <svg
          class="absolute top-6 right-[5%] w-10 h-10 text-primary/10 rotate-[25deg]"
          appParallax
          [speed]="-0.3"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            d="M11.73 2.225c1.434 0 2.597 1.162 2.597 2.597 0 1.434-1.163 2.597-2.597 2.597-1.435 0-2.598-1.163-2.598-2.597s1.163-2.597 2.598-2.597zm-6.39 4.648c1.163 0 2.106.943 2.106 2.106s-.943 2.106-2.106 2.106-2.106-.943-2.106-2.106.943-2.106 2.106-2.106zm12.78 0c1.163 0 2.106.943 2.106 2.106s-.943 2.106-2.106 2.106-2.106-.943-2.106-2.106.943-2.106 2.106-2.106zM9.875 15.01c1.434 0 2.598 1.163 2.598 2.598 0 1.434-1.164 2.597-2.598 2.597-1.434 0-2.597-1.163-2.597-2.597s1.163-2.598 2.597-2.598zm4.65 0c1.434 0 2.597 1.163 2.597 2.598 0 1.434-1.163 2.597-2.597 2.597-1.435 0-2.598-1.163-2.598-2.597s1.163-2.598 2.598-2.598zM12.2 21.477c1.666 0 3.016 1.35 3.016 3.016s-1.35 3.016-3.016 3.016-3.016-1.35-3.016-3.016 1.35-3.016 3.016-3.016z"
          />
        </svg>

        <div class="text-center" appScrollReveal [y]="24" [duration]="0.6">
          <h1
            id="blog-title"
            class="text-h2 font-extrabold uppercase tracking-widest text-foreground mb-2 flex items-center justify-center gap-1.5"
          >
            <ng-icon hlmIcon name="lucideNewspaper" class="w-5 h-5 md:w-6 md:h-6" />
            <span appTextReveal splitBy="word" [duration]="0.5" [staggerDelay]="0.08"
              >Historias reales. Sin filtros.</span
            >
          </h1>
          <p class="text-base md:text-lg font-bold text-muted-foreground">
            Vida cotidiana con Iris y Rubí — tips, reseñas y momentos que toda amante de gatas
            entiende
          </p>
        </div>
      </div>

      <!-- Wave: header → posts -->
      <svg
        class="absolute bottom-0 w-full h-16 md:h-20 pointer-events-none z-10 text-surface"
        viewBox="0 0 1200 80"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          fill="currentColor"
          d="M0 20 Q75 0 150 20 T300 20 T450 20 T600 20 T750 20 T900 20 T1050 20 T1200 20 L1200 80 L0 80 Z"
        />
      </svg>
    </section>

    <!-- Posts -->
    <app-section-shell variant="warm">
      @if (postsResource.isLoading()) {
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          @for (skeleton of [1, 2, 3, 4, 5, 6]; track skeleton) {
            <div class="rounded-[2.5rem] overflow-hidden bg-white/70">
              <hlm-skeleton class="aspect-[4/3] w-full rounded-none" />
              <div class="space-y-3 p-6">
                <hlm-skeleton class="h-3 w-20" />
                <hlm-skeleton class="h-5 w-full" />
                <hlm-skeleton class="h-4 w-3/4" />
              </div>
            </div>
          }
        </div>
      } @else if (postsResource.error()) {
        <div
          class="text-center rounded-[2.5rem] bg-surface px-6 py-16 max-w-2xl mx-auto"
          appScrollReveal
          [y]="24"
          [duration]="0.6"
        >
          <ng-icon hlmIcon name="lucideCat" class="w-14 h-14 mx-auto text-primary mb-4" />
          <h2 class="text-h3 font-extrabold uppercase tracking-widest text-foreground mb-2">
            No pudimos cargar las historias
          </h2>
          <p class="text-muted-foreground max-w-md mx-auto mb-6">
            Hubo un problema al conectar con el archivo editorial. Inténtalo de nuevo.
          </p>
          <a hlmBtn routerLink="/blog">Volver a la lista</a>
        </div>
      } @else if (postsResource.value()?.length) {
        <div
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
          appStaggerChildren
          [staggerDelay]="0.1"
          childSelector="app-blog-post-card"
        >
          @for (post of postsResource.value() ?? []; track post.slug) {
            <app-blog-post-card [post]="post" />
          }
        </div>
      } @else {
        <div
          class="text-center rounded-[2.5rem] bg-surface px-6 py-16 max-w-2xl mx-auto"
          appScrollReveal
          [y]="24"
          [duration]="0.6"
        >
          <ng-icon hlmIcon name="lucideCat" class="w-14 h-14 mx-auto text-primary mb-4" />
          <h2 class="text-h3 font-extrabold uppercase tracking-widest text-foreground mb-2">
            Las historias están en camino
          </h2>
          <p class="text-muted-foreground max-w-md mx-auto mb-6">
            Iris y Rubí todavía están ordenando el caos editorial. Vuelve pronto.
          </p>
          <a hlmBtn routerLink="/">Volver al inicio</a>
        </div>
      }
    </app-section-shell>
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
