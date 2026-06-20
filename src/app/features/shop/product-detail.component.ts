import { CurrencyPipe } from '@angular/common';
import { Component, effect, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { provideIcons } from '@ng-icons/core';
import { lucideAlertCircle } from '@ng-icons/lucide';

import { HlmBreadcrumbImports } from '@spartan-ng/helm/breadcrumb';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmBadgeImports } from '@spartan-ng/helm/badge';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmTabsImports } from '@spartan-ng/helm/tabs';

import { ProductPick } from '../../core/models/content.model';
import { CartService } from '../../core/services/cart.service';
import { SeoService } from '../../core/services/seo.service';
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
    HlmBreadcrumbImports,
    HlmButtonImports,
    HlmIconImports,
    HlmBadgeImports,
    HlmTabsImports,
    CarouselComponent,
    ProductCardComponent,
    ProductGalleryComponent,
  ],
  providers: [provideIcons({ lucideAlertCircle })],
  template: `
    <section class="py-10 pb-8" data-reveal>
      <div class="max-w-6xl mx-auto px-4">
        <nav class="mb-6" hlmBreadcrumb aria-label="Breadcrumb">
          <ol hlmBreadcrumbList>
            <li hlmBreadcrumbItem>
              <a hlmBreadcrumbLink [link]="['/']">Inicio</a>
            </li>
            <li hlmBreadcrumbSeparator></li>
            <li hlmBreadcrumbItem>
              <a hlmBreadcrumbLink [link]="['/tienda']">Tienda</a>
            </li>
            @if (product()?.categoryName) {
              <li hlmBreadcrumbSeparator></li>
              <li hlmBreadcrumbItem>
                <a
                  hlmBreadcrumbLink
                  [link]="['/tienda']"
                  [queryParams]="{ categoria: product()!.categoryName }"
                >
                  {{ product()!.categoryName }}
                </a>
              </li>
            }
            <li hlmBreadcrumbSeparator></li>
            <li hlmBreadcrumbItem>
              <span hlmBreadcrumbPage class="truncate max-w-[200px] md:max-w-md">{{
                product()?.name ?? 'Producto'
              }}</span>
            </li>
          </ol>
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
                  <span hlmBadge>
                    {{ product.categoryName }}
                  </span>
                }
                <span
                  hlmBadge
                  [variant]="product.productType === 'physical' ? 'default' : 'outline'"
                  class="uppercase"
                >
                  {{ product.productType === 'physical' ? 'Producto físico' : 'Enlace externo' }}
                </span>
              </div>

              <h1 class="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
                {{ product.name }}
              </h1>

              <p class="text-2xl font-extrabold text-primary">
                {{ product.priceValue | currency: 'USD' : 'symbol' : '1.0-0' }}
              </p>

              @if (product.copy || product.description) {
                <p class="text-muted-foreground leading-relaxed">
                  {{ product.description || product.copy }}
                </p>
              }

              <div
                class="mt-6"
                hlmTabs="product-info"
                [tab]="activeTab()"
                (tabActivated)="activeTab.set($event)"
                aria-label="Información del producto"
              >
                <div hlmTabsList variant="line" class="w-full justify-start">
                  <button type="button" hlmTabsTrigger="details">Detalle del producto</button>
                  <button type="button" hlmTabsTrigger="specifications">Especificaciones</button>
                </div>
                <div
                  hlmTabsContent="details"
                  class="py-4 text-muted-foreground leading-relaxed whitespace-pre-line"
                >
                  {{ product.details || 'Sin detalle adicional.' }}
                </div>
                <div
                  hlmTabsContent="specifications"
                  class="py-4 text-muted-foreground leading-relaxed whitespace-pre-line"
                >
                  {{ product.specifications || 'Sin especificaciones.' }}
                </div>
              </div>

              <div class="flex flex-wrap gap-3 pt-2">
                @if (product.productType === 'physical') {
                  <button
                    type="button"
                    hlmBtn
                    size="lg"
                    [disabled]="addingIds().has(product.id)"
                    (click)="addToCart(product)"
                  >
                    @if (addingIds().has(product.id)) {
                      Agregando...
                    } @else {
                      Agregar al carrito
                    }
                  </button>
                } @else {
                  <a
                    hlmBtn
                    size="lg"
                    [href]="product.affiliateUrl"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Ver en tienda
                  </a>
                }
                <button type="button" hlmBtn variant="outline" routerLink="/tienda">
                  Seguir comprando
                </button>
              </div>

              @if (product.shippingNote) {
                <p class="text-sm text-muted-foreground">{{ product.shippingNote }}</p>
              }
            </div>
          </div>

          @if (product.relatedProducts?.length) {
            <div class="mt-16">
              <h2 class="text-2xl md:text-3xl font-extrabold tracking-tight text-primary mb-6">
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
          <div hlmCard class="text-center">
            <ng-icon hlmIcon name="lucideAlertCircle" class="w-14 h-14 mx-auto text-primary mb-4" />
            <h2 class="text-xl md:text-2xl font-extrabold text-primary mb-2">
              Producto no encontrado
            </h2>
            <p class="text-muted-foreground text-sm md:text-base mb-6 max-w-md mx-auto">
              El producto que buscas no existe o ya no está disponible.
            </p>
            <button type="button" hlmBtn routerLink="/tienda">Volver a la tienda</button>
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
  protected readonly activeTab = signal<string>('details');

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
