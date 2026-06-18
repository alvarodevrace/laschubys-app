import { Component, computed, inject, resource, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { SeoService } from '../../core/services/seo.service';
import { ContentService } from '../../core/services/content.service';
import { CommentsComponent } from './components/comments.component';
import { ScrollRevealDirective, ParallaxDirective } from '../../shared/animations';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-blog-detail',
  standalone: true,
  imports: [RouterLink, CommentsComponent, ScrollRevealDirective, ParallaxDirective],
  template: `
    @if (postResource.value(); as post) {
      <article>
        <section class="py-10 pb-6" appScrollReveal>
          <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav class="flex items-center gap-2 mb-4 text-sm text-gray-500" aria-label="Breadcrumb">
              <a routerLink="/">Inicio</a>
              <span>›</span>
              <a routerLink="/blog">Blog</a>
              <span>›</span>
              <span class="truncate max-w-[200px] md:max-w-md">{{ post.title }}</span>
            </nav>

            <p class="text-xs font-extrabold uppercase tracking-widest text-orange mb-2">
              {{ post.category }}
            </p>
            <h1
              class="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight text-orange mb-4"
              appScrollReveal
              [y]="20"
            >
              {{ post.title }}
            </h1>
            <p class="text-gray-500 max-w-2xl text-lg leading-relaxed" appScrollReveal [y]="20">
              {{ post.excerpt }}
            </p>

            <div class="flex flex-wrap items-center gap-3 text-sm text-gray-500 mt-6">
              <span class="font-medium text-gray-700">{{ post.author }}</span>
              <span class="text-gray-300">·</span>
              <span>{{ post.publishedAt }}</span>
              <span class="text-gray-300">·</span>
              <span>{{ post.readTime }}</span>
            </div>
          </div>
        </section>

        <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-10" appScrollReveal [y]="60">
          <div class="rounded-3xl overflow-hidden shadow-[0_24px_60px_rgba(0,0,0,0.12)]">
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
                class="text-gray-700 leading-[1.8] text-base md:text-lg mb-6"
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
      <section class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div class="h-8 w-32 bg-gray-200 rounded animate-pulse mb-4"></div>
        <div class="h-12 w-3/4 bg-gray-200 rounded animate-pulse mb-4"></div>
        <div class="h-6 w-1/2 bg-gray-200 rounded animate-pulse mb-8"></div>
        <div class="aspect-video bg-gray-200 rounded-3xl animate-pulse mb-10"></div>
        <div class="max-w-3xl space-y-4">
          @for (s of [1, 2, 3, 4]; track s) {
            <div class="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
          }
        </div>
      </section>
    } @else {
      <section class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <p class="text-xs font-extrabold uppercase tracking-widest text-orange mb-2">404</p>
        <h1 class="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 mb-3">
          Post no encontrado
        </h1>
        <p class="text-gray-500 mb-6">No encontramos este artículo en la migración actual.</p>
        <a
          routerLink="/blog"
          class="inline-flex items-center justify-center min-h-12 px-7 rounded-full font-extrabold text-sm tracking-wide border border-transparent bg-orange text-white cursor-pointer transition-all duration-200 hover:bg-orange-dark hover:-translate-y-px hover:shadow-[0_8px_20px_rgba(255,122,26,0.3)]"
        >
          Volver al blog
        </a>
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
