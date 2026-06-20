import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';

import { HlmCardImports } from '@spartan-ng/helm/card';

import { BlogPost } from '../../../core/models/content.model';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-blog-post-card',
  standalone: true,
  imports: [RouterLink, HlmCardImports],
  template: `
    <a
      class="group flex flex-col h-full overflow-hidden"
      hlmCard
      [routerLink]="['/blog', post().slug]"
    >
      <div class="relative aspect-video overflow-hidden bg-muted">
        <img
          [src]="post().coverImage || fallbackImage()"
          [alt]="post().title"
          loading="lazy"
          class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div
          class="absolute inset-0 bg-transparent group-hover:bg-black/5 transition-colors duration-300"
        ></div>
      </div>

      <div hlmCardContent class="flex flex-col flex-1 py-5">
        <p class="text-xs font-extrabold uppercase tracking-widest text-primary mb-2">
          {{ post().category }}
        </p>
        <h3
          class="text-lg font-bold leading-snug text-foreground mb-2 group-hover:text-primary transition-colors duration-200"
        >
          {{ post().title }}
        </h3>
        <p class="text-sm text-muted-foreground leading-relaxed line-clamp-2 mb-4 flex-1">
          {{ post().excerpt }}
        </p>
      </div>

      <div hlmCardFooter class="justify-between">
        <span class="text-xs text-muted-foreground">{{ post().publishedAt }}</span>
        <span class="text-xs font-bold text-primary">{{ post().readTime }}</span>
      </div>
    </a>
  `,
})
export class BlogPostCardComponent {
  readonly post = input.required<BlogPost>();
  readonly fallbackImage = input('/images/cats/iris2.jpeg');
}
