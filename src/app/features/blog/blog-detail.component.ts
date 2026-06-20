import { Component, computed, inject, resource, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmSkeletonImports } from '@spartan-ng/helm/skeleton';
import { HlmBreadcrumbImports } from '@spartan-ng/helm/breadcrumb';

import { SeoService } from '../../core/services/seo.service';
import { ContentService } from '../../core/services/content.service';
import { CommentsComponent } from './components/comments.component';
import { ScrollRevealDirective, ParallaxDirective } from '../../shared/animations';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-blog-detail',
  standalone: true,
  imports: [
    RouterLink,
    CommentsComponent,
    ScrollRevealDirective,
    ParallaxDirective,
    HlmButtonImports,
    HlmSkeletonImports,
    HlmBreadcrumbImports,
  ],
  template: `
    @if (postResource.value(); as post) {
      <article>
        <section class="py-10 pb-6" appScrollReveal>
          <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav class="mb-4" hlmBreadcrumb>
              <ol hlmBreadcrumbList>
                <li hlmBreadcrumbItem>
                  <a hlmBreadcrumbLink [link]="['/']">Inicio</a>
                </li>
                <li hlmBreadcrumbSeparator></li>
                <li hlmBreadcrumbItem>
                  <a hlmBreadcrumbLink [link]="['/blog']">Blog</a>
                </li>
                <li hlmBreadcrumbSeparator></li>
                <li hlmBreadcrumbItem>
                  <span hlmBreadcrumbPage class="truncate max-w-[200px] md:max-w-md">{{
                    post.title
                  }}</span>
                </li>
              </ol>
            </nav>

            <p class="text-xs font-extrabold uppercase tracking-widest text-primary mb-2">
              {{ post.category }}
            </p>
            <h1
              class="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight text-primary mb-4"
              appScrollReveal
              [y]="20"
            >
              {{ post.title }}
            </h1>
            <p
              class="text-muted-foreground max-w-2xl text-lg leading-relaxed"
              appScrollReveal
              [y]="20"
            >
              {{ post.excerpt }}
            </p>

            <div class="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mt-6">
              <span class="font-medium text-muted-foreground">{{ post.author }}</span>
              <span class="text-muted-foreground">·</span>
              <span>{{ post.publishedAt }}</span>
              <span class="text-muted-foreground">·</span>
              <span>{{ post.readTime }}</span>
            </div>
          </div>
        </section>

        <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-10" appScrollReveal [y]="60">
          <div class="rounded-3xl overflow-hidden shadow-xl">
            <img
              [src]="post.coverImage || '/images/cats/iris3.jpeg'"
              [alt]="post.title"
              class="w-full aspect-video object-cover scale-110"
              appParallax
              [speed]="0.15"
            />
          </div>
        </div>

        <section class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8" appScrollReveal [y]="40">
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

        <section class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8" appScrollReveal [y]="60">
          @defer (on viewport) {
            <app-comments [slug]="post.slug" [(comments)]="commentsModel" />
          } @placeholder {
            <div class="h-96" aria-hidden="true"></div>
          }
        </section>
      </article>
    } @else if (postResource.isLoading()) {
      <section class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-4">
        <hlm-skeleton class="h-8 w-32" />
        <hlm-skeleton class="h-12 w-3/4" />
        <hlm-skeleton class="h-6 w-1/2" />
        <hlm-skeleton class="aspect-video rounded-3xl w-full" />
        <div class="max-w-3xl space-y-4">
          @for (s of [1, 2, 3, 4]; track s) {
            <hlm-skeleton class="h-4 w-full" />
          }
        </div>
      </section>
    } @else {
      <section class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <p class="text-xs font-extrabold uppercase tracking-widest text-primary mb-2">404</p>
        <h1 class="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground mb-3">
          Post no encontrado
        </h1>
        <p class="text-muted-foreground mb-6">
          No encontramos este artículo en la migración actual.
        </p>
        <a hlmBtn routerLink="/blog">Volver al blog</a>
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
