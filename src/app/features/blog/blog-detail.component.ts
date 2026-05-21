import { Component, computed, inject, resource } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { SeoService } from '../../core/services/seo.service';
import { ContentService } from '../../core/services/content.service';
import { CommentsComponent } from './components/comments.component';

@Component({
  selector: 'app-blog-detail',
  standalone: true,
  imports: [RouterLink, CommentsComponent],
  template: `
    @if (postResource.value(); as post) {
      <article>
        <section class="page-hero post-article-hero" data-reveal>
          <div class="page-hero__inner">
            <nav class="breadcrumb" aria-label="Breadcrumb">
              <a routerLink="/">Inicio</a>
              <span>›</span>
              <a routerLink="/blog">Blog</a>
              <span>›</span>
              <span>{{ post.title }}</span>
            </nav>

            <p class="page-hero__eyebrow">{{ post.category }}</p>
            <h1 class="page-hero__title">{{ post.title }}</h1>
            <p class="page-hero__sub">{{ post.excerpt }}</p>

            <div class="post-meta">
              <span>{{ post.publishedAt }}</span>
              <span>·</span>
              <span>{{ post.author }}</span>
              <span>·</span>
              <span>{{ post.readTime }}</span>
            </div>
          </div>
        </section>

        <div class="post-cover" data-reveal>
          <img [src]="post.coverImage || '/images/cats/iris3.jpeg'" [alt]="post.title" />
        </div>

        <section class="post-body" data-reveal>
          @for (paragraph of post.content; track $index) {
            <p>{{ paragraph }}</p>
          }
        </section>

        <section class="post-comments" data-reveal>
          <div class="post-comments__inner">
            <app-comments [slug]="post.slug" [(comments)]="commentsModel" />
          </div>
        </section>
      </article>
    } @else if (postResource.isLoading()) {
      <section class="page-wrap post-article-hero"><p>Cargando post...</p></section>
    } @else {
      <section class="page-wrap post-article-hero">
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
          `/blog/${post.slug}`
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
