import { Component, computed, inject, resource, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { provideIcons } from '@ng-icons/core';
import { lucideCat, lucideNewspaper } from '@ng-icons/lucide';

import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmSkeletonImports } from '@spartan-ng/helm/skeleton';

import { SeoService } from '../../core/services/seo.service';
import { ContentService } from '../../core/services/content.service';
import { CommentsComponent } from './components/comments.component';
import {
  ScrollRevealDirective,
  ParallaxDirective,
  TextRevealDirective,
} from '../../shared/animations';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-blog-detail',
  standalone: true,
  imports: [
    RouterLink,
    CommentsComponent,
    ScrollRevealDirective,
    ParallaxDirective,
    TextRevealDirective,
    HlmButtonImports,
    HlmIconImports,
    HlmSkeletonImports,
  ],
  providers: [provideIcons({ lucideCat, lucideNewspaper })],
  template: `
    @if (postResource.value(); as post) {
      <article>
        <!-- Header band -->
        <section class="relative bg-surface overflow-hidden">
          <div class="relative max-w-3xl mx-auto px-4 pt-10 pb-24 md:pt-12 md:pb-28 text-center">
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
            <p
              class="text-xs font-extrabold uppercase tracking-widest text-primary mb-3"
              appScrollReveal
              [y]="20"
            >
              {{ post.category }}
            </p>
            <h1
              class="text-h2 font-extrabold uppercase tracking-widest text-foreground mb-4 flex items-center justify-center gap-1.5"
              appScrollReveal
              [y]="20"
            >
              <ng-icon hlmIcon name="lucideNewspaper" class="w-5 h-5 md:w-6 md:h-6" />
              <span appTextReveal splitBy="word" [duration]="0.5" [staggerDelay]="0.08">
                {{ post.title }}
              </span>
            </h1>
            <p
              class="text-foreground text-base md:text-lg leading-relaxed"
              appScrollReveal
              [y]="20"
            >
              {{ post.excerpt }}
            </p>

            <div
              class="flex flex-wrap items-center justify-center gap-3 text-sm text-muted-foreground mt-6"
            >
              <span class="font-medium">{{ post.author }}</span>
              <span>·</span>
              <span>{{ post.publishedAt }}</span>
              <span>·</span>
              <span>{{ post.readTime }}</span>
            </div>
          </div>

          <!-- Wave: header → contenido -->
          <svg
            class="absolute bottom-0 w-full h-16 md:h-20 pointer-events-none z-10 text-white"
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

        <div class="max-w-6xl mx-auto px-4 mb-10" appScrollReveal [y]="60">
          <div class="rounded-[2.5rem] overflow-hidden shadow-xl">
            <img
              [src]="post.coverImage || '/images/cats/iris3.jpeg'"
              [alt]="post.title"
              class="w-full aspect-video object-cover scale-110"
              appParallax
              [speed]="0.15"
            />
          </div>
        </div>

        <section class="max-w-3xl mx-auto px-4 py-8" appScrollReveal [y]="40">
          <div class="prose prose-lg max-w-none">
            @for (paragraph of post.content; track $index) {
              <p
                class="text-muted-foreground leading-[1.8] text-base md:text-lg mb-6"
                appScrollReveal
                [y]="30"
                [delay]="0.05 * $index"
                [duration]="0.5"
              >
                {{ paragraph }}
              </p>
            }
          </div>
        </section>

        <section class="max-w-3xl mx-auto px-4 py-8" appScrollReveal [y]="60">
          @defer (on viewport) {
            <app-comments [slug]="post.slug" [(comments)]="commentsModel" />
          } @placeholder {
            <div class="h-96" aria-hidden="true"></div>
          }
        </section>
      </article>
    } @else if (postResource.isLoading()) {
      <section class="max-w-6xl mx-auto px-4 py-10 space-y-4">
        <hlm-skeleton class="h-8 w-32" />
        <hlm-skeleton class="h-12 w-3/4" />
        <hlm-skeleton class="h-6 w-1/2" />
        <hlm-skeleton class="aspect-video rounded-[2.5rem] w-full" />
        <div class="max-w-3xl space-y-4">
          @for (s of [1, 2, 3, 4]; track s) {
            <hlm-skeleton class="h-4 w-full" />
          }
        </div>
      </section>
    } @else if (postResource.error()) {
      <section class="max-w-6xl mx-auto px-4 py-16">
        <div
          class="text-center rounded-[2.5rem] bg-surface px-6 py-16 max-w-2xl mx-auto"
          appScrollReveal
          [y]="24"
          [duration]="0.6"
        >
          <ng-icon hlmIcon name="lucideCat" class="w-14 h-14 mx-auto text-primary mb-4" />
          <h1 class="text-h3 font-extrabold uppercase tracking-widest text-foreground mb-2">
            No pudimos cargar este artículo
          </h1>
          <p class="text-muted-foreground mb-6">
            Hubo un problema al conectar con el archivo editorial. Inténtalo de nuevo.
          </p>
          <a hlmBtn routerLink="/blog">Volver al blog</a>
        </div>
      </section>
    } @else {
      <section class="max-w-6xl mx-auto px-4 py-16">
        <div
          class="text-center rounded-[2.5rem] bg-surface px-6 py-16 max-w-2xl mx-auto"
          appScrollReveal
          [y]="24"
          [duration]="0.6"
        >
          <ng-icon hlmIcon name="lucideCat" class="w-14 h-14 mx-auto text-primary mb-4" />
          <h1 class="text-h3 font-extrabold uppercase tracking-widest text-foreground mb-2">
            Post no encontrado
          </h1>
          <p class="text-muted-foreground mb-6">
            No encontramos este artículo en la migración actual.
          </p>
          <a hlmBtn routerLink="/blog">Volver al blog</a>
        </div>
      </section>
    }
  `,
})
export class BlogDetailComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly content = inject(ContentService);
  private readonly seo = inject(SeoService);

  private readonly slug = computed(() => this.route.snapshot.paramMap.get('slug') ?? '');
  protected commentsModel: import('../../core/models/content.model').BlogComment[] = [];

  protected readonly postResource = resource({
    params: () => this.slug(),
    loader: async ({ params }) => {
      const post = await this.content.getPost(params);
      if (post) {
        this.commentsModel = [...post.comments];
        this.seo.setPage(
          `${post.title} | Las Chubys`,
          post.excerpt || 'Historia felina de Las Chubys.',
          post.coverImage || '/images/cats/iris3.jpeg',
          `/blog/${post.slug}`,
        );
        this.seo.setJsonLd({
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: post.title,
          description: post.excerpt,
          image: post.coverImage || '/images/cats/iris3.jpeg',
          author: { '@type': 'Person', name: post.author },
          datePublished: post.publishedAt,
          mainEntityOfPage: `https://laschubys.com/blog/${post.slug}`,
        });
      }
      return post;
    },
  });
}
