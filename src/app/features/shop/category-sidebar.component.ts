import { Component, input, output, signal, ChangeDetectionStrategy } from '@angular/core';

import { Category } from '../../core/models/content.model';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-category-sidebar',
  standalone: true,
  imports: [],
  template: `
    <aside class="w-full md:w-64 flex-shrink-0">
      <button
        type="button"
        class="md:hidden w-full flex items-center justify-between px-4 py-3 rounded-2xl bg-white border border-gray-200 font-bold text-gray-900"
        (click)="expanded.set(!expanded())"
        [attr.aria-expanded]="expanded()"
        aria-controls="category-list"
      >
        <span class="flex items-center gap-2">
          <svg
            class="w-5 h-5 text-orange"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <line x1="4" y1="6" x2="20" y2="6" />
            <line x1="4" y1="12" x2="20" y2="12" />
            <line x1="4" y1="18" x2="20" y2="18" />
          </svg>
          Categorías
        </span>
        <svg
          class="w-5 h-5 text-gray-400 transition-transform"
          [class.rotate-180]="expanded()"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      <div
        id="category-list"
        class="md:block mt-2 md:mt-0 overflow-hidden transition-all"
        [class.hidden]="!expanded()"
      >
        <ul
          class="grid gap-1.5 p-2 rounded-2xl bg-white border border-gray-200 md:border-0 md:bg-transparent md:p-0"
        >
          <li>
            <button
              type="button"
              class="w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold transition-colors"
              [class.bg-orange]="activeSlug() === ''"
              [class.text-white]="activeSlug() === ''"
              [class.text-gray-600]="activeSlug() !== ''"
              [class.hover:bg-orange/5]="activeSlug() !== ''"
              (click)="select.emit('')"
            >
              Todas
            </button>
          </li>
          @for (category of categories(); track category.slug) {
            <li>
              <button
                type="button"
                class="w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold transition-colors"
                [class.bg-orange]="activeSlug() === category.slug"
                [class.text-white]="activeSlug() === category.slug"
                [class.text-gray-600]="activeSlug() !== category.slug"
                [class.hover:bg-orange/5]="activeSlug() !== category.slug"
                (click)="select.emit(category.slug)"
              >
                {{ category.name }}
              </button>
            </li>
          }
        </ul>
      </div>
    </aside>
  `,
})
export class CategorySidebarComponent {
  readonly categories = input.required<Category[]>();
  readonly activeSlug = input<string>('');
  readonly select = output<string>();
  protected readonly expanded = signal(false);
}
