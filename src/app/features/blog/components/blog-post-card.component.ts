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
})
export class BlogPostCardComponent {
  readonly post = input.required<BlogPost>();
  readonly fallbackImage = input('/images/cats/iris2.jpeg');
}
