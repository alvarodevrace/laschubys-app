import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';

import { BlogPost } from '../../../core/models/content.model';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-blog-post-card',
  standalone: true,
  imports: [RouterLink],
  template: `
    <a
      class="group grid gap-2 rounded-2xl overflow-hidden bg-white border border-gray-200 transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(0,0,0,0.08)]"
      [routerLink]="['/blog', post().slug]"
    >
      <div class="aspect-video overflow-hidden bg-gray-100">
        <img
          [src]="post().coverImage || fallbackImage()"
          [alt]="post().title"
          loading="lazy"
          class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div class="blog-card__body">
        <p class="mx-3.5 mt-2 text-xs font-extrabold uppercase tracking-wide text-orange">
          {{ post().category }}
        </p>
        <h3>{{ post().title }}</h3>
        <p class="mx-3.5 mb-2 text-xs text-gray-500 leading-relaxed">{{ post().excerpt }}</p>
        <span class="blog-card__meta">{{ post().publishedAt }} · {{ post().readTime }}</span>
      </div>
    </a>
  `,
})
export class BlogPostCardComponent {
  readonly post = input.required<BlogPost>();
  readonly fallbackImage = input('/images/cats/iris2.jpeg');
}
