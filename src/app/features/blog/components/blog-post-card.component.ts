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
      class="group flex flex-col h-full rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(0,0,0,0.10)]"
      [routerLink]="['/blog', post().slug]"
    >
      <div class="relative aspect-video overflow-hidden bg-gray-100">
        <img
          [src]="post().coverImage || fallbackImage()"
          [alt]="post().title"
          loading="lazy"
          class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div
          class="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300"
        ></div>
      </div>

      <div class="flex flex-col flex-1 p-5">
        <p class="text-xs font-extrabold uppercase tracking-widest text-orange mb-2">
          {{ post().category }}
        </p>
        <h3
          class="text-lg font-bold leading-snug text-gray-900 mb-2 group-hover:text-orange transition-colors duration-200"
        >
          {{ post().title }}
        </h3>
        <p class="text-sm text-gray-600 leading-relaxed line-clamp-2 mb-4 flex-1">
          {{ post().excerpt }}
        </p>
        <div class="flex items-center justify-between pt-4 border-t border-gray-100">
          <span class="text-xs text-gray-400">{{ post().publishedAt }}</span>
          <span class="text-xs font-bold text-orange">{{ post().readTime }}</span>
        </div>
      </div>
    </a>
  `,
})
export class BlogPostCardComponent {
  readonly post = input.required<BlogPost>();
  readonly fallbackImage = input('/images/cats/iris2.jpeg');
}
