import { CurrencyPipe } from '@angular/common';
import { Component, effect, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';

import { ProductPick } from '../../core/models/content.model';
import { CartService } from '../../core/services/cart.service';
import { SeoService } from '../../core/services/seo.service';
import { ButtonComponent } from '../../shared/ui/button/button.component';
import { CarouselComponent } from '../../shared/ui/carousel/carousel.component';
import { ProductCardComponent } from './product-card.component';
import { ProductGalleryComponent } from './product-gallery.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-product-detail',
  standalone: true,
  imports: [
    RouterLink,
    CurrencyPipe,
    ButtonComponent,
    CarouselComponent,
    ProductCardComponent,
    ProductGalleryComponent,
  ],
  template: `
    <section class="py-10 pb-8" data-reveal>
      <div class="max-w-6xl mx-auto px-4">
        <nav class="flex items-center gap-2 mb-6 text-sm text-gray-500" aria-label="Breadcrumb">
          <a routerLink="/">Inicio</a>
          <span>›</span>
          <a routerLink="/tienda">Tienda</a>
          @if (product()?.categoryName) {
            <span>›</span>
            <a [routerLink]="['/tienda']" [queryParams]="{ categoria: product()!.categoryName }">
              {{ product()!.categoryName }}
            </a>
          }
          <span>›</span>
          <span class="text-gray-900 font-medium truncate max-w-[200px]">{{
            product()?.name ?? 'Producto'
          }}</span>
        </nav>
      </div>
    </section>

    <section class="pb-16" data-reveal>
      <div class="max-w-6xl mx-auto px-4">
        @if (product(); as product) {
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            <app-product-gallery [images]="product.images" />

            <div class="grid content-start gap-5">
              <div class="flex flex-wrap gap-2">
                @if (product.categoryName) {
                  <span
                    class="inline-flex px-2.5 py-1 rounded-full bg-orange/10 text-orange text-xs font-extrabold uppercase tracking-wide"
                  >
                    {{ product.categoryName }}
                  </span>
                }
                <span
                  class="inline-flex px-2.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-wide"
                  [class.bg-green-100]="product.productType === 'physical'"
                  [class.text-green-700]="product.productType === 'physical'"
                  [class.bg-blue-50]="product.productType === 'link'"
                  [class.text-blue-600]="product.productType === 'link'"
                >
                  {{ product.productType === 'physical' ? 'Producto físico' : 'Enlace externo' }}
                </span>
              </div>

              <h1 class="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                {{ product.name }}
              </h1>

              <p class="text-2xl font-extrabold text-orange">
                {{ product.priceValue | currency: 'USD' : 'symbol' : '1.0-0' }}
              </p>

              @if (product.copy || product.description) {
                <p class="text-gray-600 leading-relaxed">
                  {{ product.description || product.copy }}
                </p>
              }

              <div class="mt-6" role="tablist" aria-label="Información del producto">
                <div class="flex gap-6 border-b border-gray-200">
                  <button
                    type="button"
                    role="tab"
                    id="details-tab"
                    aria-controls="details-panel"
                    [attr.aria-selected]="activeTab() === 'details'"
                    class="pb-2 text-sm font-extrabold transition-colors"
                    [class.text-orange]="activeTab() === 'details'"
                    [class.border-b-2]="activeTab() === 'details'"
                    [class.border-orange]="activeTab() === 'details'"
                    [class.text-gray-500]="activeTab() !== 'details'"
                    (click)="activeTab.set('details')"
                  >
                    Detalle del producto
                  </button>
                  <button
                    type="button"
                    role="tab"
                    id="specifications-tab"
                    aria-controls="specifications-panel"
                    [attr.aria-selected]="activeTab() === 'specifications'"
                    class="pb-2 text-sm font-extrabold transition-colors"
                    [class.text-orange]="activeTab() === 'specifications'"
                    [class.border-b-2]="activeTab() === 'specifications'"
                    [class.border-orange]="activeTab() === 'specifications'"
                    [class.text-gray-500]="activeTab() !== 'specifications'"
                    (click)="activeTab.set('specifications')"
                  >
                    Especificaciones
                  </button>
                </div>
                <div
                  id="details-panel"
                  role="tabpanel"
                  aria-labelledby="details-tab"
                  class="py-4 text-gray-600 leading-relaxed whitespace-pre-line"
                  [class.hidden]="activeTab() !== 'details'"
                >
                  {{ product.details || 'Sin detalle adicional.' }}
                </div>
                <div
                  id="specifications-panel"
                  role="tabpanel"
                  aria-labelledby="specifications-tab"
                  class="py-4 text-gray-600 leading-relaxed whitespace-pre-line"
                  [class.hidden]="activeTab() !== 'specifications'"
                >
                  {{ product.specifications || 'Sin especificaciones.' }}
                </div>
              </div>

              <div class="flex flex-wrap gap-3 pt-2">
                @if (product.productType === 'physical') {
                  <app-button
                    variant="primary"
                    type="button"
                    size="lg"
                    [disabled]="addingIds().has(product.id)"
                    (click)="addToCart(product)"
                  >
                    @if (addingIds().has(product.id)) {
                      Agregando...
                    } @else {
                      Agregar al carrito
                    }
                  </app-button>
                } @else {
                  <a
                    class="inline-flex items-center justify-center gap-2 rounded-xl font-bold transition-all duration-200 ease-smooth active:scale-95 bg-orange text-white hover:bg-orange-dark shadow-lg px-8 py-4 text-lg"
                    [href]="product.affiliateUrl"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Ver en tienda
                  </a>
                }
                <app-button variant="secondary" type="button" routerLink="/tienda">
                  Seguir comprando
                </app-button>
              </div>

              @if (product.shippingNote) {
                <p class="text-sm text-gray-500">{{ product.shippingNote }}</p>
              }
            </div>
          </div>

          @if (product.relatedProducts?.length) {
            <div class="mt-16">
              <h2 class="text-2xl md:text-3xl font-extrabold tracking-tight text-orange mb-6">
                Productos relacionados
              </h2>
              <app-carousel [items]="product.relatedProducts ?? []">
                <ng-template let-related>
                  <div
                    class="snap-start flex-shrink-0 w-[85%] sm:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.75rem)] xl:w-[calc(25%-0.75rem)]"
                  >
                    <app-product-card
                      [product]="related"
                      [adding]="addingIds().has(related.id)"
                      (add)="addToCart($event)"
                    />
                  </div>
                </ng-template>
              </app-carousel>
            </div>
          }
        } @else {
          <div class="p-10 md:p-14 rounded-3xl bg-orange/5 border border-orange/10 text-center">
            <svg
              class="w-14 h-14 mx-auto text-orange mb-4"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"
              />
            </svg>
            <h2 class="text-xl md:text-2xl font-extrabold text-orange mb-2">
              Producto no encontrado
            </h2>
            <p class="text-gray-600 text-sm md:text-base mb-6 max-w-md mx-auto">
              El producto que buscas no existe o ya no está disponible.
            </p>
            <app-button variant="primary" type="button" routerLink="/tienda">
              Volver a la tienda
            </app-button>
          </div>
        }
      </div>
    </section>
  `,
})
export class ProductDetailComponent {
  private readonly cart = inject(CartService);
  private readonly seo = inject(SeoService);
  private readonly route = inject(ActivatedRoute);

  protected readonly addingIds = signal<Set<string>>(new Set());
  protected readonly activeTab = signal<'details' | 'specifications'>('details');

  protected readonly product = toSignal(
    this.route.data.pipe(map((data) => data['product'] as ProductPick | null)),
  );

  constructor() {
    effect(() => {
      const product = this.product();
      if (!product) return;

      this.seo.setPage(
        `${product.name} | Las Chubys`,
        product.description || product.copy || 'Producto para michis y michi lovers en Las Chubys.',
        product.images?.[0] || '/brand/logo.png',
        `/tienda/${product.slug}`,
      );

      this.seo.setJsonLd({
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        description: product.description || product.copy,
        image: product.images?.[0],
        offers: {
          '@type': 'Offer',
          price: product.priceValue,
          priceCurrency: 'USD',
          availability:
            product.productType === 'physical'
              ? 'https://schema.org/InStock'
              : 'https://schema.org/OnlineOnly',
        },
      });
    });
  }

  protected async addToCart(product: ProductPick): Promise<void> {
    if (this.addingIds().has(product.id)) {
      return;
    }
    this.addingIds.update((ids) => new Set([...ids, product.id]));
    try {
      await Promise.resolve(this.cart.addItem(product));
    } finally {
      this.addingIds.update((ids) => {
        const next = new Set(ids);
        next.delete(product.id);
        return next;
      });
    }
  }
}
