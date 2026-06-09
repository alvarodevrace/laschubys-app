import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { BlogPost } from '../../../core/models/content.model';

@Component({
  selector: 'app-blog-post-card',
  standalone: true,
  imports: [RouterLink],
  template: `
    <a class="blog-card" [routerLink]="['/blog', post().slug]">
      <div class="blog-card__cover">
        <img [src]="post().coverImage || fallbackImage()" [alt]="post().title" loading="lazy" />
      </div>
      <div class="blog-card__body">
        <p class="blog-card__tag">{{ post().category }}</p>
        <h3>{{ post().title }}</h3>
        <p class="blog-card__excerpt">{{ post().excerpt }}</p>
        <span class="blog-card__meta">{{ post().publishedAt }} · {{ post().readTime }}</span>
      </div>
    </a>
  `,
  styles: [
    `
      .blog-card {
        display: grid;
        gap: 1rem;
        border-radius: 28px;
        overflow: hidden;
        background: var(--gray-50);
        border: 1px solid var(--border);
        box-shadow: 0 18px 44px rgba(0, 0, 0, 0.05);
        transition:
          transform 180ms ease,
          box-shadow 180ms ease;
      }

      .blog-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 24px 52px rgba(0, 0, 0, 0.08);
      }

      .blog-card__cover img {
        width: 100%;
        aspect-ratio: 16 / 10;
        object-fit: cover;
        display: block;
      }

      .blog-card__body {
        padding: 0 1.2rem 1.2rem;
      }

      .blog-card__tag,
      .blog-card__meta {
        margin: 0;
        color: var(--text-muted);
        font-size: 0.84rem;
      }

      h3 {
        margin: 0.45rem 0 0.65rem;
        font-size: 1.2rem;
        line-height: 1.15;
      }

      .blog-card__excerpt {
        margin: 0 0 0.9rem;
        color: var(--text-muted);
        line-height: 1.6;
      }
    `,
  ],
})
export class BlogPostCardComponent {
  readonly post = input.required<BlogPost>();
  readonly fallbackImage = input('/images/cats/iris2.jpeg');
}
