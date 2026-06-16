import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  template: `
    <div class="min-h-screen bg-gray-50">
      <!-- Header admin -->
      <header class="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div class="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <a routerLink="/" class="text-gray-400 hover:text-orange transition-colors">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="w-5 h-5"
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </a>
            <div class="w-px h-5 bg-gray-200"></div>
            <span class="text-xs font-extrabold uppercase tracking-widest text-orange"
              >Panel admin</span
            >
            <span class="text-gray-300">·</span>
            <span class="text-sm font-semibold text-gray-700">Las Chubys</span>
          </div>
        </div>
        <!-- Tabs -->
        <div class="max-w-7xl mx-auto px-4">
          <nav class="flex gap-1 -mb-px">
            <a
              routerLink="posts"
              routerLinkActive="border-orange text-orange"
              [routerLinkActiveOptions]="{ exact: false }"
              class="px-5 py-3 text-sm font-semibold border-b-2 border-transparent text-gray-500 hover:text-gray-800 transition-colors"
            >
              Blog posts
            </a>
            <a
              routerLink="products"
              routerLinkActive="border-orange text-orange"
              [routerLinkActiveOptions]="{ exact: false }"
              class="px-5 py-3 text-sm font-semibold border-b-2 border-transparent text-gray-500 hover:text-gray-800 transition-colors"
            >
              Productos
            </a>
          </nav>
        </div>
      </header>

      <main class="max-w-7xl mx-auto px-4 py-8">
        <router-outlet />
      </main>
    </div>
  `,
})
export class AdminLayoutComponent {}
