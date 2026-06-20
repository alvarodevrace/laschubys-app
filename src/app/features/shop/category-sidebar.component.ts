import { Component, input, output, signal, ChangeDetectionStrategy } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { lucideChevronDown, lucideListFilter } from '@ng-icons/lucide';

import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmIconImports } from '@spartan-ng/helm/icon';

import { Category } from '../../core/models/content.model';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-category-sidebar',
  standalone: true,
  imports: [HlmButtonImports, HlmIconImports],
  providers: [provideIcons({ lucideChevronDown, lucideListFilter })],
  template: `
    <aside class="w-full md:w-64 flex-shrink-0">
      <button
        type="button"
        hlmBtn
        variant="outline"
        class="md:hidden w-full justify-between"
        (click)="expanded.set(!expanded())"
        [attr.aria-expanded]="expanded()"
        aria-controls="category-list"
      >
        <span class="flex items-center gap-2">
          <ng-icon hlmIcon name="lucideListFilter" class="w-5 h-5" />
          Categorías
        </span>
        <ng-icon
          hlmIcon
          name="lucideChevronDown"
          class="w-5 h-5 transition-transform"
          [class.rotate-180]="expanded()"
        />
      </button>

      <div
        id="category-list"
        class="md:block mt-2 md:mt-0 overflow-hidden transition-all"
        [class.hidden]="!expanded()"
      >
        <ul
          class="grid gap-1.5 p-2 rounded-2xl bg-white border border-border md:border-0 md:bg-transparent md:p-0"
        >
          <li>
            <button
              type="button"
              hlmBtn
              [variant]="activeSlug() === '' ? 'default' : 'ghost'"
              class="w-full justify-start"
              (click)="select.emit('')"
            >
              Todas
            </button>
          </li>
          @for (category of categories(); track category.slug) {
            <li>
              <button
                type="button"
                hlmBtn
                [variant]="activeSlug() === category.slug ? 'default' : 'ghost'"
                class="w-full justify-start"
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
