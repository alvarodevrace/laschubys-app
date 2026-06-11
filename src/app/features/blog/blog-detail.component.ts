import { Component, computed, inject, resource, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { SeoService } from '../../core/services/seo.service';
import { ContentService } from '../../core/services/content.service';
import { CommentsComponent } from './components/comments.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-blog-detail',
  standalone: true,
  imports: [RouterLink, CommentsComponent],
  template: `
    @if (postResource.value(); as post) {
      <article>
        <section class="py-10 pb-6" data-reveal>
          <div class="max-w-6xl mx-auto px-4">
            <nav class="flex items-center gap-2 mb-4 text-sm text-gray-500" aria-label="Breadcrumb">
              <a routerLink="/">Inicio</a>
              <span>›</span>
              <a routerLink="/blog">Blog</a>
              <span>›</span>
              <span>{{ post.title }}</span>
            </nav>

            <p class="text-xs font-extrabold uppercase tracking-widest text-orange mb-2">
              {{ post.category }}
            </p>
            <h1
              class="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight text-gray-900 mb-2"
            >
              {{ post.title }}
            </h1>
            <p class="text-gray-500 max-w-2xl">{{ post.excerpt }}</p>

            <div class="flex flex-wrap gap-2 text-sm text-gray-500 mt-4">
              <span>{{ post.publishedAt }}</span>
              <span>·</span>
              <span>{{ post.author }}</span>
              <span>·</span>
              <span>{{ post.readTime }}</span>
            </div>
          </div>
        </section>

        <div class="max-w-6xl mx-auto px-4 mb-8" data-reveal>
          <img
            [src]="post.coverImage || '/images/cats/iris3.jpeg'"
            [alt]="post.title"
            class="w-full rounded-3xl object-cover aspect-video"
          />
        </div>

        <section class="max-w-3xl mx-auto px-4 grid gap-6 py-8" data-reveal>
          @for (paragraph of post.content; track $index) {
            <p class="text-gray-700 leading-relaxed">{{ paragraph }}</p>
          }
        </section>

        <section class="max-w-3xl mx-auto px-4 py-8" data-reveal>
          <div>
            <app-comments [slug]="post.slug" [(comments)]="commentsModel" />
          </div>
        </section>
      </article>
    } @else if (postResource.isLoading()) {
      <section class="max-w-6xl mx-auto px-4 pb-6"><p>Cargando post...</p></section>
    } @else {
      <section class="max-w-6xl mx-auto px-4 pb-6">
        <h1>Post no encontrado</h1>
        <p class="post__excerpt">No encontramos este artículo en la migración actual.</p>
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
