import { Component, computed, input, output, inject, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { provideIcons } from '@ng-icons/core';
import { lucideExternalLink, lucideShoppingCart } from '@ng-icons/lucide';

import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmSpinner } from '@spartan-ng/helm/spinner';

import { ProductPick } from '../../core/models/content.model';
import { productColor } from '../../shared/ui/product-visuals';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-product-card',
  standalone: true,
  imports: [HlmButtonImports, HlmIconImports, HlmSpinner],
  providers: [provideIcons({ lucideExternalLink, lucideShoppingCart })],
  host: { class: 'block h-full' },
  template: `
    <article
      class="group h-full rounded-[2.5rem] overflow-hidden cursor-pointer transition-all duration-500 ease-bounce will-change-transform hover:-translate-y-3 hover:scale-[1.02] hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.2)]"
      [style.background]="color().light"
      (click)="navigateToDetail()"
      [attr.data-product-slug]="product().slug"
      [attr.data-product-type]="product().productType"
      data-testid="product-card"
    >
      <div class="relative flex flex-col h-full">
        <span
          class="absolute rounded-full transition-all ease-bounce duration-[500ms] will-change-transform top-[40%] left-1/2 -translate-x-1/2 w-[300%] pb-[300%] group-hover:sm:w-[150%] group-hover:sm:top-[-25%]"
          [style.background]="color().card"
        ></span>
        <div class="flex items-center justify-between gap-2 px-3 pt-3 relative z-10">
          <span
            class="text-[11px] font-bold uppercase tracking-wider rounded-full px-2.5 py-1"
            [style.background]="'color-mix(in oklab, ' + color().accent + ' 20%, transparent)'"
            [style.color]="color().accent"
          >
            {{ product().source === 'owned' ? 'Las Chubys' : 'Afiliado' }}
          </span>
          <span
            class="text-[11px] font-bold uppercase tracking-wider rounded-full px-2.5 py-1 bg-white/70 truncate max-w-[55%]"
            [style.color]="color().accent"
          >
            {{ product().tag }}
          </span>
        </div>
        <div class="px-5 pt-5 pb-3 relative z-10 flex items-center justify-center flex-1">
          <img
            [src]="product().images[0] || '/images/cats/iris4.jpeg'"
            [alt]="product().name"
            loading="lazy"
            class="w-full max-h-[160px] object-contain drop-shadow-sm group-hover:scale-110 group-hover:rotate-[3deg] transition-all duration-500 ease-bounce"
          />
        </div>
        <div
          class="relative z-10 flex flex-col items-center text-center gap-0.5 px-6 pt-5 pb-6 rounded-[1.75rem] mx-2 mb-2"
          [style.background]="color().card"
        >
          <p class="text-sm font-bold leading-tight line-clamp-2" [style.color]="color().text">
            {{ product().name }}
          </p>
          <p class="text-lg font-extrabold text-foreground">
            {{ product().price }}
          </p>
        </div>
        <div class="relative z-10 px-3 pb-3" (click)="$event.stopPropagation()">
          @if (product().productType === 'physical') {
            <button
              type="button"
              hlmBtn
              size="sm"
              class="w-full"
              [disabled]="adding()"
              (click)="add.emit(product())"
            >
              @if (added()) {
                <span class="inline-flex items-center gap-1.5 text-emerald-600 font-bold">
                  <span class="text-lg leading-none">✓</span>
                  Agregado
                </span>
              } @else if (adding()) {
                <hlm-spinner class="w-3.5 h-3.5" />
                Agregando...
              } @else {
                <ng-icon hlmIcon name="lucideShoppingCart" class="w-3.5 h-3.5" />
                Agregar
              }
            </button>
          } @else {
            <a
              hlmBtn
              variant="outline"
              size="sm"
              class="w-full bg-white/70"
              [href]="product().affiliateUrl"
              target="_blank"
              rel="noreferrer"
            >
              <ng-icon hlmIcon name="lucideExternalLink" class="w-3.5 h-3.5" />
              Ver tienda
            </a>
          }
        </div>
      </div>
    </article>
  `,
})
export class ProductCardComponent {
  private readonly router = inject(Router);

  readonly product = input.required<ProductPick>();
  readonly adding = input<boolean>(false);
  readonly added = input<boolean>(false);
  readonly add = output<ProductPick>();

  protected readonly color = computed(() => productColor(this.product()));

  protected navigateToDetail() {
    void this.router.navigate(['/tienda', this.product().slug]);
  }
}
