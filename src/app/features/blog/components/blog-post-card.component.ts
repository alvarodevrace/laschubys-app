import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';

import { BlogPost } from '../../../core/models/content.model';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-blog-post-card',
  standalone: true,
  imports: [RouterLink],
  host: { class: 'block h-full' },
  template: `
    <a
      class="group flex flex-col h-full rounded-[2.5rem] overflow-hidden bg-white border border-border transition-all duration-500 ease-bounce will-change-transform hover:-translate-y-3 hover:scale-[1.02] hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.2)]"
      [routerLink]="['/blog', post().slug]"
    >
      <div class="relative aspect-[4/3] overflow-hidden bg-muted">
        <img
          [src]="post().coverImage || fallbackImage()"
          [alt]="post().title"
          loading="lazy"
          class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      <div class="flex flex-col flex-1 gap-2 px-6 pt-5 pb-6 rounded-[1.75rem] mx-2 mb-2 bg-white">
        <p class="text-xs font-extrabold uppercase tracking-widest text-primary">
          {{ post().category }}
        </p>
        <h3
          class="text-lg font-bold leading-snug text-foreground group-hover:text-primary transition-colors duration-200"
        >
          {{ post().title }}
        </h3>
        <p class="text-sm text-muted-foreground leading-relaxed line-clamp-2 flex-1">
          {{ post().excerpt }}
        </p>
        <div class="flex items-center justify-between pt-2">
          <span class="text-xs text-muted-foreground">{{ post().publishedAt }}</span>
          <span class="text-xs font-bold text-primary">{{ post().readTime }}</span>
        </div>
      </div>
    </a>
  `,
})
export class BlogPostCardComponent {
  readonly post = input.required<BlogPost>();
  readonly fallbackImage = input('/images/cats/iris2.jpeg');
}
