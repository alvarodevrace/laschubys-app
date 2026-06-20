import { Component, ChangeDetectionStrategy, computed, inject } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { provideIcons } from '@ng-icons/core';
import { lucideArrowLeft } from '@ng-icons/lucide';

import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmTabs, HlmTabsList, HlmTabsTrigger } from '@spartan-ng/helm/tabs';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-admin-layout',
  standalone: true,
  imports: [
    RouterLink,
    RouterOutlet,
    HlmButtonImports,
    HlmIconImports,
    HlmTabs,
    HlmTabsList,
    HlmTabsTrigger,
  ],
  providers: [provideIcons({ lucideArrowLeft })],
  template: `
    <div class="min-h-screen bg-surface">
      <!-- Header admin -->
      <header class="bg-white border-b border-border sticky top-0 z-50">
        <div class="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <a routerLink="/" hlmBtn variant="ghost" size="icon-sm">
              <ng-icon hlmIcon name="lucideArrowLeft" class="w-5 h-5" />
            </a>
            <div class="w-px h-5 bg-border"></div>
            <span class="text-xs font-extrabold uppercase tracking-widest text-primary"
              >Panel admin</span
            >
            <span class="text-muted-foreground">·</span>
            <span class="text-sm font-semibold text-muted-foreground">Las Chubys</span>
          </div>
        </div>

        <!-- Tabs -->
        <div class="max-w-7xl mx-auto px-4">
          <div hlmTabs [tab]="activeTab()" class="w-full">
            <div hlmTabsList variant="line" class="w-full justify-start">
              <button hlmTabsTrigger="posts" (click)="navigate('/admin/posts')">Blog posts</button>
              <button hlmTabsTrigger="products" (click)="navigate('/admin/products')">
                Productos
              </button>
            </div>
          </div>
        </div>
      </header>

      <main class="max-w-7xl mx-auto px-4 py-8">
        <router-outlet />
      </main>
    </div>
  `,
})
export class AdminLayoutComponent {
  private readonly router = inject(Router);
  protected readonly activeTab = computed<'posts' | 'products'>(() => {
    const url = this.router.url;
    if (url.startsWith('/admin/products')) return 'products';
    return 'posts';
  });

  protected navigate(path: string) {
    void this.router.navigate([path]);
  }
}
