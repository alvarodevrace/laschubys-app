import { CurrencyPipe } from '@angular/common';
import { Component, computed, effect, inject, resource, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { ProductPick } from '../../core/models/content.model';
import { CartService } from '../../core/services/cart.service';
import { ContentService } from '../../core/services/content.service';
import { SeoService } from '../../core/services/seo.service';

@Component({
  selector: 'app-tienda',
  standalone: true,
  imports: [FormsModule, RouterLink, CurrencyPipe],
  template: `
    <section class="page-hero" data-reveal>
      <div class="page-hero__inner">
        <nav class="breadcrumb" aria-label="Breadcrumb">
          <a routerLink="/">Inicio</a>
          <span>›</span>
          <span>Tienda</span>
        </nav>
        <h1 class="page-hero__title">{{ pageTitle() }}</h1>
        <p class="page-hero__sub">{{ pageSub() }}</p>
      </div>
    </section>

    <section class="shop-section" style="padding-top:1.5rem;padding-bottom:0;">
      <div class="page-wrap">
        <div class="filter-bar">
          <div class="filter-bar__pills">
            <button
              type="button"
              class="filter-pill"
              [class.is-active]="audience() === 'all'"
              (click)="audience.set('all')"
            >
              Todo
            </button>
            <button
              type="button"
              class="filter-pill"
              [class.is-active]="audience() === 'michis'"
              (click)="audience.set('michis')"
            >
              Para Michis
            </button>
            <button
              type="button"
              class="filter-pill"
              [class.is-active]="audience() === 'michi-lovers'"
              (click)="audience.set('michi-lovers')"
            >
              Michi Lovers
            </button>
          </div>
          <label class="filter-search" aria-label="Buscar productos">
            <svg
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
              [ngModel]="query()"
              (ngModelChange)="query.set($event)"
              type="search"
              placeholder="Buscar por nombre o idea..."
            />
          </label>
        </div>
      </div>
    </section>

    <section class="cards-section" data-reveal>
      <div class="page-wrap">
        @if (productsResource.isLoading()) {
          <p>Cargando productos...</p>
        } @else if (visibleProducts().length) {
          <h2 class="section-heading" style="margin-bottom: 2rem;">Productos Las Chubys</h2>
          <div class="shop-grid" style="margin-bottom: 3rem;">
            @for (product of visibleProducts(); track product.id) {
              <article class="shop-card" [attr.data-product-id]="product.id">
                <div class="shop-card__badge">
                  {{ product.source === 'owned' ? 'Las Chubys' : 'Afiliado' }}
                </div>
                <div class="shop-card__photo">
                  <img
                    [src]="product.images[0] || '/images/cats/iris4.jpeg'"
                    [alt]="product.name"
                    loading="lazy"
                  />
                </div>
                <div class="shop-card__info">
                  <p class="shop-card__name">{{ product.name }}</p>
                  <p class="shop-card__price">{{ product.price }}</p>
                </div>
                <div
                  class="shop-card__actions"
                  style="display:flex;gap:0.5rem;padding:0 0.85rem 0.85rem;"
                >
                  <button class="button-secondary" type="button" (click)="openPreview(product)">
                    Ver
                  </button>
                  @if (product.source === 'owned') {
                    <button class="button-primary" type="button" (click)="addToCart(product)">
                      Agregar
                    </button>
                  } @else {
                    <a
                      class="button-primary"
                      [href]="product.affiliateUrl"
                      target="_blank"
                      rel="noreferrer"
                      >Comprar</a
                    >
                  }
                </div>
              </article>
            }
          </div>
        } @else {
          <div class="empty-panel">
            <h2>No encontramos productos con ese filtro.</h2>
            <p>Prueba otra audiencia o limpia la búsqueda.</p>
          </div>
        }
      </div>
    </section>

    @if (selectedProduct(); as product) {
      <div class="modal-shell" (click)="closePreview()">
        <article class="modal-card" (click)="$event.stopPropagation()">
          <img [src]="product.images[0] || '/images/cats/rubi4.jpeg'" [alt]="product.name" />
          <div class="modal-card__body">
            <p class="section-eyebrow">{{ product.tag }}</p>
            <h2>{{ product.name }}</h2>
            <p>{{ product.description || product.copy }}</p>
            <strong>{{ product.priceValue | currency: 'USD' : 'symbol' : '1.0-0' }}</strong>
            <div class="modal-card__actions">
              <button class="button-primary" type="button" (click)="addToCart(product)">
                Agregar al carrito
              </button>
              @if (product.affiliateUrl) {
                <a
                  class="button-secondary"
                  [href]="product.affiliateUrl"
                  target="_blank"
                  rel="noreferrer"
                  >Ir al enlace</a
                >
              }
            </div>
          </div>
        </article>
      </div>
    }
  `,
  styles: [
    `
      .filter-bar {
        display: flex;
        align-items: center;
        gap: 1rem;
        flex-wrap: wrap;
        padding: 1rem 0 1.25rem;
        margin-bottom: 1.5rem;
        border-bottom: 1px solid var(--border);
      }

      .filter-bar__pills {
        display: flex;
        gap: 0.6rem;
        flex-wrap: wrap;
      }

      .filter-pill {
        min-height: 42px;
        padding: 0.55rem 1rem;
        border: 1px solid var(--border);
        border-radius: 999px;
        background: var(--white);
        color: var(--text);
        font-size: 0.76rem;
        font-weight: 800;
        letter-spacing: 0.04em;
        cursor: pointer;
        transition:
          transform 180ms ease,
          border-color 180ms ease,
          background 180ms ease,
          color 180ms ease,
          box-shadow 180ms ease;
      }

      .filter-pill:hover,
      .filter-pill.is-active {
        color: var(--white);
        background: var(--orange);
        border-color: var(--orange);
        box-shadow: 0 16px 28px rgba(255, 122, 26, 0.22);
      }

      .filter-pill:hover {
        transform: translateY(-1px);
      }

      .filter-search {
        margin-left: auto;
        min-width: min(360px, 100%);
        flex: 1 1 280px;
        max-width: 420px;
        min-height: 50px;
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0 1rem;
        border-radius: 18px;
        border: 1px solid var(--border);
        background: var(--white);
        box-shadow: 0 18px 34px rgba(0, 0, 0, 0.05);
      }

      .filter-search svg {
        width: 18px;
        height: 18px;
        color: var(--orange);
        flex: 0 0 auto;
      }

      .filter-search input {
        width: 100%;
        border: 0;
        outline: 0;
        background: transparent;
        color: var(--text);
        font-size: 0.92rem;
      }

      .filter-search input::placeholder {
        color: var(--text-muted);
      }

      .cards-section {
        padding: 0 0 4rem;
      }

      .empty-panel {
        padding: 2rem;
        border-radius: 28px;
        background: var(--gray-50);
        border: 1px solid var(--border);
      }

      .modal-shell {
        position: fixed;
        inset: 0;
        display: grid;
        place-items: center;
        background: rgba(14, 11, 10, 0.52);
        padding: 1rem;
        z-index: 5000;
      }

      .modal-card {
        width: min(920px, 100%);
        display: grid;
        grid-template-columns: minmax(0, 1fr) minmax(320px, 420px);
        gap: 1.5rem;
        padding: 1rem;
        border-radius: 32px;
        background: var(--white);
      }

      .modal-card img {
        width: 100%;
        min-height: 320px;
        object-fit: cover;
        border-radius: 24px;
      }

      .modal-card__body {
        display: grid;
        align-content: start;
        gap: 0.9rem;
      }

      .modal-card__body p,
      .modal-card__body strong,
      .modal-card__body h2 {
        margin: 0;
      }

      .modal-card__actions {
        display: flex;
        gap: 0.75rem;
        flex-wrap: wrap;
      }

      @media (max-width: 960px) {
        .filter-search {
          margin-left: 0;
          max-width: none;
        }

        .modal-card {
          grid-template-columns: 1fr;
        }
      }

      @media (max-width: 640px) {
        .filter-bar {
          gap: 0.85rem;
        }

        .filter-search {
          min-width: 100%;
        }
      }
    `,
  ],
})
export class TiendaComponent {
  private readonly content = inject(ContentService);
  private readonly cart = inject(CartService);
  private readonly seo = inject(SeoService);

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
