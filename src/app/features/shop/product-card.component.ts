import { Component, input, output, inject, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';

import { ProductPick } from '../../core/models/content.model';
import { ButtonComponent } from '../../shared/ui/button/button.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-product-card',
  standalone: true,
  imports: [ButtonComponent],
  host: { class: 'block h-full' },
  template: `
    <article
      class="group relative flex flex-col gap-3 p-3 h-full rounded-2xl bg-white border border-gray-200 shadow-[0_8px_24px_rgba(0,0,0,0.04)] cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)]"
      (click)="navigateToDetail()"
      [attr.data-product-slug]="product().slug"
      [attr.data-product-type]="product().productType"
      data-testid="product-card"
    >
      <div
        class="absolute top-3 left-3 px-2 py-0.5 rounded-full text-white text-[10px] font-extrabold uppercase tracking-wide bg-orange z-10"
      >
        {{ product().source === 'owned' ? 'Las Chubys' : 'Afiliado' }}
      </div>
      <div class="relative aspect-square overflow-hidden rounded-xl bg-gray-100">
        <img
          class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          [src]="product().images[0] || '/images/cats/iris4.jpeg'"
          [alt]="product().name"
          loading="lazy"
        />
      </div>
      <div class="flex flex-col gap-1 min-w-0 flex-1">
        <p class="text-gray-400 text-xs font-medium truncate">{{ product().tag }}</p>
        <h3 class="text-sm font-extrabold text-gray-900 leading-snug line-clamp-2">
          {{ product().name }}
        </h3>
        <p class="text-gray-500 text-xs line-clamp-2">
          {{ product().copy || product().description }}
        </p>
        <p class="text-base font-extrabold text-orange mt-auto">{{ product().price }}</p>
      </div>
      <div class="mt-auto pt-1" (click)="$event.stopPropagation()">
        @if (product().productType === 'physical') {
          <app-button
            variant="primary"
            type="button"
            size="sm"
            className="w-full min-h-[36px] px-3 py-1.5 text-xs rounded-full"
            [disabled]="adding()"
            (click)="add.emit(product())"
          >
            @if (adding()) {
              <svg
                class="w-3.5 h-3.5 animate-spin"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Agregando...
            } @else {
              <svg
                class="w-3.5 h-3.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <path d="M6 6h15l-1.5 9h-12z"></path>
                <circle cx="9" cy="20" r="1"></circle>
                <circle cx="18" cy="20" r="1"></circle>
                <path d="M6 6L5 3H2"></path>
              </svg>
              Agregar
            }
          </app-button>
        } @else {
          <a
            class="inline-flex items-center justify-center gap-1.5 w-full min-h-[36px] px-3 py-1.5 rounded-full text-xs font-extrabold border border-orange text-orange bg-white hover:bg-orange hover:text-white transition-all duration-200 active:scale-95"
            [href]="product().affiliateUrl"
            target="_blank"
            rel="noreferrer"
          >
            <svg
              class="w-3.5 h-3.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
              <polyline points="15 3 21 3 21 9"></polyline>
              <line x1="10" y1="14" x2="21" y2="3"></line>
            </svg>
            Ver tienda
          </a>
        }
      </div>
    </article>
  `,
})
export class ProductCardComponent {
  private readonly router = inject(Router);

  readonly product = input.required<ProductPick>();
  readonly adding = input<boolean>(false);
  readonly add = output<ProductPick>();

  protected navigateToDetail() {
    void this.router.navigate(['/tienda', this.product().slug]);
  }
}
