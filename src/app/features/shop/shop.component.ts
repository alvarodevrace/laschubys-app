import { CurrencyPipe, NgClass } from '@angular/common';
import {
  Component,
  computed,
  effect,
  inject,
  resource,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { ProductPick } from '../../core/models/content.model';
import { CartService } from '../../core/services/cart.service';
import { ContentService } from '../../core/services/content.service';
import { SeoService } from '../../core/services/seo.service';
import { ButtonComponent } from '../../shared/ui/button/button.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-shop',
  standalone: true,
  imports: [RouterLink, CurrencyPipe, NgClass, ButtonComponent],
  template: `
    <section class="py-10 pb-8" data-reveal>
      <div class="max-w-6xl mx-auto px-4">
        <nav class="flex items-center gap-2 mb-4 text-sm text-gray-500" aria-label="Breadcrumb">
          <a routerLink="/">Inicio</a>
          <span>›</span>
          <span>Tienda</span>
        </nav>
        <h1
          class="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight text-gray-900 mb-2"
        >
          {{ pageTitle() }}
        </h1>
        <p class="text-gray-500 max-w-2xl">{{ pageSub() }}</p>
      </div>
    </section>

    <section class="py-10 pb-12" style="padding-top:1.5rem;padding-bottom:0;">
      <div class="max-w-6xl mx-auto px-4">
        <div class="flex items-center gap-4 flex-wrap py-4 mb-6 border-b border-gray-200">
          <div class="flex gap-2 flex-wrap">
            <button
              type="button"
              class="min-h-[42px] px-4 py-2 rounded-full border border-gray-200 bg-white text-gray-900 text-xs font-extrabold tracking-wide cursor-pointer transition-all duration-200"
              [ngClass]="
                audience() === 'all'
                  ? [
                      'text-white',
                      'bg-orange',
                      'border-orange',
                      'shadow-[0_16px_28px_rgba(255,122,26,0.22)]',
                      'hover:-translate-y-px',
                    ]
                  : []
              "
              (click)="audience.set('all')"
              data-testid="tienda-filter-all"
            >
              Todo
            </button>
            <button
              type="button"
              class="min-h-[42px] px-4 py-2 rounded-full border border-gray-200 bg-white text-gray-900 text-xs font-extrabold tracking-wide cursor-pointer transition-all duration-200"
              [ngClass]="
                audience() === 'michis'
                  ? [
                      'text-white',
                      'bg-orange',
                      'border-orange',
                      'shadow-[0_16px_28px_rgba(255,122,26,0.22)]',
                      'hover:-translate-y-px',
                    ]
                  : []
              "
              (click)="audience.set('michis')"
              data-testid="tienda-filter-michis"
            >
              Para Michis
            </button>
            <button
              type="button"
              class="min-h-[42px] px-4 py-2 rounded-full border border-gray-200 bg-white text-gray-900 text-xs font-extrabold tracking-wide cursor-pointer transition-all duration-200"
              [ngClass]="
                audience() === 'michi-lovers'
                  ? [
                      'text-white',
                      'bg-orange',
                      'border-orange',
                      'shadow-[0_16px_28px_rgba(255,122,26,0.22)]',
                      'hover:-translate-y-px',
                    ]
                  : []
              "
              (click)="audience.set('michi-lovers')"
              data-testid="tienda-filter-michi-lovers"
            >
              Michi Lovers
            </button>
          </div>
          <label
            class="ml-auto flex items-center min-h-[50px] gap-3 px-4 rounded-2xl border border-gray-200 bg-white flex-1 max-w-md shadow-[0_18px_34px_rgba(0,0,0,0.05)]"
            aria-label="Buscar productos"
          >
            <svg
              class="w-[18px] h-[18px] text-orange flex-shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.9"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="6.5"></circle>
              <path d="M16.2 16.2 21 21"></path>
            </svg>
            <input
              class="w-full border-0 outline-none bg-transparent text-sm placeholder:text-gray-400"
              [value]="query()"
              (input)="query.set($any($event).target.value)"
              type="search"
              placeholder="Buscar por nombre o idea..."
              data-testid="tienda-search-input"
            />
          </label>
        </div>
      </div>
    </section>

    <section class="pb-16" data-reveal>
      <div class="max-w-6xl mx-auto px-4">
        @if (productsResource.isLoading()) {
          <p>Cargando productos...</p>
        } @else {
          @defer (on viewport) {
            @if (visibleProducts().length) {
              <h2
                class="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900"
                style="margin-bottom: 2rem;"
              >
                Productos Las Chubys
              </h2>
              <div class="shop-grid" style="margin-bottom: 3rem;">
                @for (product of visibleProducts(); track product.id) {
                  <article
                    class="group rounded-2xl bg-white border border-gray-200 overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(0,0,0,0.08)]"
                    [attr.data-product-id]="product.id"
                  >
                    <div
                      class="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-orange text-white text-xs font-extrabold uppercase tracking-wide z-10"
                    >
                      {{ product.source === 'owned' ? 'Las Chubys' : 'Afiliado' }}
                    </div>
                    <div class="relative aspect-square overflow-hidden bg-gray-100">
                      <img
                        class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        [src]="product.images[0] || '/images/cats/iris4.jpeg'"
                        [alt]="product.name"
                        loading="lazy"
                      />
                    </div>
                    <div class="p-3.5 pb-2">
                      <p class="text-sm font-bold leading-snug text-gray-900 mb-1">
                        {{ product.name }}
                      </p>
                      <p class="text-sm font-extrabold text-orange">{{ product.price }}</p>
                    </div>
                    <div class="flex gap-2 px-3.5 pb-3.5">
                      <app-button
                        variant="secondary"
                        type="button"
                        (click)="openPreview(product)"
                        data-testid="tienda-preview-btn"
                      >
                        Ver
                      </app-button>
                      @if (product.source === 'owned') {
                        <app-button
                          variant="primary"
                          type="button"
                          (click)="addToCart(product)"
                          data-testid="tienda-add-to-cart-btn"
                        >
                          Agregar
                        </app-button>
                      } @else {
                        <a
                          class="inline-flex items-center justify-center min-h-12 px-6 rounded-full font-extrabold text-sm tracking-wide border border-transparent bg-orange text-white cursor-pointer transition-all duration-200 hover:bg-orange-dark hover:-translate-y-px"
                          [href]="product.affiliateUrl"
                          target="_blank"
                          rel="noreferrer"
                          data-testid="tienda-affiliate-link"
                          >Comprar</a
                        >
                      }
                    </div>
                  </article>
                }
              </div>
            } @else {
              <div class="p-10 rounded-3xl bg-gray-50 border border-gray-200 text-center">
                <h2 class="text-xl font-extrabold text-gray-900 mb-2">
                  No encontramos productos con ese filtro.
                </h2>
                <p class="text-gray-500 text-sm mb-5">
                  Prueba otra audiencia o limpia la búsqueda.
                </p>
              </div>
            }
          } @placeholder {
            <div class="h-96"></div>
          }
        }
      </div>
    </section>

    @if (selectedProduct(); as product) {
      <div
        class="fixed inset-0 grid place-items-center p-4 z-[5000] bg-black/50"
        role="button"
        tabindex="0"
        aria-label="Cerrar vista previa"
        (click)="closePreview()"
        (keydown.escape)="closePreview()"
        data-testid="tienda-modal-backdrop"
      >
        <article
          class="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-[32px] bg-white"
          role="presentation"
          tabindex="-1"
          (click)="$event.stopPropagation()"
          (keydown)="$event.stopPropagation()"
        >
          <img
            class="w-full min-h-80 object-cover rounded-3xl"
            [src]="product.images[0] || '/images/cats/rubi4.jpeg'"
            [alt]="product.name"
          />
          <div class="grid content-start gap-3">
            <p class="text-xs font-extrabold uppercase tracking-widest text-orange mb-1">
              {{ product.tag }}
            </p>
            <h2>{{ product.name }}</h2>
            <p>{{ product.description || product.copy }}</p>
            <strong>{{ product.priceValue | currency: 'USD' : 'symbol' : '1.0-0' }}</strong>
            <div class="flex gap-3 flex-wrap">
              <app-button
                variant="primary"
                type="button"
                (click)="addToCart(product)"
                data-testid="tienda-modal-add-cart"
              >
                Agregar al carrito
              </app-button>
              @if (product.affiliateUrl) {
                <a
                  class="inline-flex items-center justify-center min-h-12 px-6 rounded-full font-extrabold text-sm tracking-wide border cursor-pointer transition-all duration-200 bg-orange-50/10 border-orange/15 text-orange-dark hover:bg-orange-50/20 hover:border-orange/25"
                  [href]="product.affiliateUrl"
                  target="_blank"
                  rel="noreferrer"
                  data-testid="tienda-modal-affiliate"
                  >Ir al enlace</a
                >
              }
            </div>
          </div>
        </article>
      </div>
    }
  `,
})
export class ShopComponent {
  private readonly content = inject(ContentService);
  private readonly cart = inject(CartService);
  private readonly seo = inject(SeoService);
  private readonly route = inject(ActivatedRoute);

  protected readonly audience = signal<'all' | 'michis' | 'michi-lovers'>('all');
  protected readonly query = signal('');
  protected readonly selectedProduct = signal<ProductPick | null>(null);
  protected readonly pageTitle = computed(() => {
    const query = this.query().trim();
    if (query) {
      return `Resultados para: "${query}"`;
    }

    return this.audience() === 'michis'
      ? 'Para Michis'
      : this.audience() === 'michi-lovers'
        ? 'Michi Lovers'
        : 'Tienda Completa';
  });
  protected readonly pageSub = computed(() => {
    if (this.audience() === 'michis') {
      return 'Todo lo que tu gato necesita: descanso, juego y bienestar.';
    }

    if (this.audience() === 'michi-lovers') {
      return 'Detalles y regalos para humanos que viven por sus gatos.';
    }

    return 'Explora nuestro catálogo completo curado por Iris y Rubi.';
  });

  protected readonly productsResource = resource({
    loader: async () => this.content.getProducts(),
  });

  protected readonly visibleProducts = computed(() => {
    const query = this.query().trim().toLowerCase();
    return (this.productsResource.value() ?? []).filter((product) => {
      const matchesAudience = this.audience() === 'all' || product.audience === this.audience();
      const haystack =
        `${product.name} ${product.copy} ${product.description} ${product.tag}`.toLowerCase();
      const matchesQuery = !query || haystack.includes(query);
      return matchesAudience && matchesQuery;
    });
  });

  constructor() {
    this.seo.setPage(
      'Tienda | Las Chubys',
      'Catálogo completo para michis y michi lovers.',
      '/images/banner1.PNG',
      '/tienda',
    );

    const audienceParam = this.route.snapshot.queryParamMap.get('audience');
    if (audienceParam === 'michis' || audienceParam === 'michi-lovers') {
      this.audience.set(audienceParam);
    }

    effect(() => {
      const products = this.productsResource.value();
      if (!products?.length) return;
      this.seo.setJsonLd({
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: 'Tienda Las Chubys',
        url: 'https://laschubys.com/tienda',
        numberOfItems: products.length,
        itemListElement: products.map((p, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          item: {
            '@type': 'Product',
            name: p.name,
            description: p.description || p.copy,
            image: p.images[0],
            offers: { '@type': 'Offer', price: p.priceValue, priceCurrency: 'USD' },
          },
        })),
      });
    });
  }

  protected addToCart(product: ProductPick) {
    this.cart.addItem(product);
  }

  protected openPreview(product: ProductPick) {
    this.selectedProduct.set(product);
  }

  protected closePreview() {
    this.selectedProduct.set(null);
  }
}
