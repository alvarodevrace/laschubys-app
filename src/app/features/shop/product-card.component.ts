import { Component, input, output, inject, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { provideIcons } from '@ng-icons/core';
import { lucideExternalLink, lucideShoppingCart } from '@ng-icons/lucide';

import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmBadgeImports } from '@spartan-ng/helm/badge';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmSpinner } from '@spartan-ng/helm/spinner';

import { ProductPick } from '../../core/models/content.model';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-product-card',
  standalone: true,
  imports: [HlmButtonImports, HlmIconImports, HlmBadgeImports, HlmCardImports, HlmSpinner],
  providers: [provideIcons({ lucideExternalLink, lucideShoppingCart })],
  host: { class: 'block h-full' },
  template: `
    <article
      hlmCard
      class="group relative cursor-pointer"
      (click)="navigateToDetail()"
      [attr.data-product-slug]="product().slug"
      [attr.data-product-type]="product().productType"
      data-testid="product-card"
    >
      <span hlmBadge class="absolute top-3 left-3 z-10">
        {{ product().source === 'owned' ? 'Las Chubys' : 'Afiliado' }}
      </span>
      <div hlmCardContent class="p-3">
        <div class="relative aspect-square overflow-hidden rounded-xl bg-muted">
          <img
            class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            [src]="product().images[0] || '/images/cats/iris4.jpeg'"
            [alt]="product().name"
            loading="lazy"
          />
        </div>
        <div class="flex flex-col gap-1 min-w-0 flex-1 pt-3">
          <p class="text-muted-foreground text-xs font-medium truncate">{{ product().tag }}</p>
          <h3 class="text-sm font-extrabold text-foreground leading-snug line-clamp-2">
            {{ product().name }}
          </h3>
          <p class="text-muted-foreground text-xs line-clamp-2">
            {{ product().copy || product().description }}
          </p>
          <p class="text-base font-extrabold text-primary mt-auto">{{ product().price }}</p>
        </div>
      </div>
      <div hlmCardFooter class="px-3 pb-3 pt-0" (click)="$event.stopPropagation()">
        @if (product().productType === 'physical') {
          <button
            type="button"
            hlmBtn
            size="sm"
            class="w-full"
            [disabled]="adding()"
            (click)="add.emit(product())"
          >
            @if (adding()) {
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
            class="w-full"
            [href]="product().affiliateUrl"
            target="_blank"
            rel="noreferrer"
          >
            <ng-icon hlmIcon name="lucideExternalLink" class="w-3.5 h-3.5" />
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
