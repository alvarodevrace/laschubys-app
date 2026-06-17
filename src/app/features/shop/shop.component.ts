import {
  Component,
  computed,
  effect,
  inject,
  resource,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { ProductPick } from '../../core/models/content.model';
import { CartService } from '../../core/services/cart.service';
import { ContentService } from '../../core/services/content.service';
import { SeoService } from '../../core/services/seo.service';
import { ButtonComponent } from '../../shared/ui/button/button.component';
import { CategorySidebarComponent } from './category-sidebar.component';
import { ProductCardComponent } from './product-card.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-shop',
  standalone: true,
  imports: [RouterLink, ButtonComponent, CategorySidebarComponent, ProductCardComponent],
  template: `
    <section class="py-10 pb-8" data-reveal>
      <div class="max-w-6xl mx-auto px-4">
        <nav class="flex items-center gap-2 mb-4 text-sm text-gray-500" aria-label="Breadcrumb">
          <a routerLink="/">Inicio</a>
          <span>›</span>
          <span>Tienda</span>
          @if (activeCategoryName()) {
            <span>›</span>
            <span class="text-gray-900 font-medium">{{ activeCategoryName() }}</span>
          }
        </nav>
        <h1
          class="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight text-orange mb-2"
        >
          {{ pageTitle() }}
        </h1>
        <p class="text-gray-500 max-w-2xl">{{ pageSub() }}</p>
      </div>
    </section>

    <section class="py-4" data-reveal>
      <div class="max-w-6xl mx-auto px-4">
        <div class="flex items-center gap-4 flex-wrap py-4 mb-6 border-b border-gray-200">
          <div class="flex gap-3 flex-wrap">
            @for (filter of audienceFilters(); track filter.value) {
              <button
                type="button"
                class="group inline-flex items-center gap-2 min-h-[44px] px-4 py-2 rounded-full border text-sm font-extrabold tracking-wide transition-all duration-200"
                [class.bg-orange]="audience() === filter.value"
                [class.text-white]="audience() === filter.value"
                [class.border-orange]="audience() === filter.value"
                [class.shadow-[0_12px_28px_rgba(255,122,26,0.22)]]="audience() === filter.value"
                [class.bg-white]="audience() !== filter.value"
                [class.text-gray-700]="audience() !== filter.value"
                [class.border-orange/20]="audience() !== filter.value"
                [class.hover:border-orange/40]="audience() !== filter.value"
                [class.hover:bg-orange/5]="audience() !== filter.value"
                [class.hover:-translate-y-px]="audience() !== filter.value"
                (click)="audience.set(filter.value)"
                [attr.data-testid]="'tienda-filter-' + filter.value"
              >
                <svg
                  class="w-4 h-4 flex-shrink-0"
                  [class.text-white]="audience() === filter.value"
                  [class.text-orange]="audience() !== filter.value"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path [attr.d]="filter.icon"></path>
                </svg>
                <span>{{ filter.label }}</span>
                <span
                  class="inline-flex items-center justify-center min-w-[1.25rem] px-1.5 h-5 rounded-full text-[10px] font-extrabold"
                  [class.bg-white]="audience() === filter.value"
                  [class.text-orange]="audience() === filter.value"
                  [class.bg-gray-100]="audience() !== filter.value"
                  [class.text-gray-500]="audience() !== filter.value"
                >
                  {{ filter.count }}
                </span>
              </button>
            }
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
        @if (anyError()) {
          <div class="p-10 md:p-14 rounded-3xl bg-red-50 border border-red-100 text-center">
            <svg
              class="w-14 h-14 mx-auto text-red-500 mb-4"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"
              />
            </svg>
            <h2 class="text-xl md:text-2xl font-extrabold text-gray-900 mb-2">
              No pudimos cargar la tienda
            </h2>
            <p class="text-gray-600 text-sm md:text-base mb-6 max-w-md mx-auto">
              {{ anyError() }}
            </p>
            <app-button variant="primary" type="button" (click)="reload()"> Reintentar </app-button>
          </div>
        } @else if (isLoading()) {
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            @for (_ of [1, 2, 3, 4]; track $index) {
              <div class="rounded-3xl bg-gray-100 h-80 animate-pulse"></div>
            }
          </div>
        } @else {
          <div class="flex flex-col md:flex-row gap-8 items-start">
            <app-category-sidebar
              [categories]="categoriesResource.value() ?? []"
              [activeSlug]="category()"
              (select)="category.set($event)"
            />

            <main class="flex-1 min-w-0">
              @if (visibleProducts().length) {
                <div class="flex items-center justify-between mb-4">
                  <h2 class="text-lg md:text-xl font-extrabold text-gray-900">
                    {{ visibleProducts().length }} producto{{
                      visibleProducts().length === 1 ? '' : 's'
                    }}
                  </h2>
                  @if (activeCategoryName()) {
                    <button
                      type="button"
                      class="text-sm font-bold text-orange hover:text-orange-dark"
                      (click)="category.set('')"
                    >
                      Ver todas
                    </button>
                  }
                </div>
                <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  @for (product of visibleProducts(); track product.id) {
                    <app-product-card
                      [product]="product"
                      [adding]="addingIds().has(product.id)"
                      (add)="addToCart($event)"
                    />
                  }
                </div>
              } @else {
                <div
                  class="p-10 md:p-14 rounded-3xl bg-orange/5 border border-orange/10 text-center"
                >
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
                    {{ emptyTitle() }}
                  </h2>
                  <p class="text-gray-600 text-sm md:text-base mb-6 max-w-md mx-auto">
                    {{ emptyMessage() }}
                  </p>
                  @if (query().trim() || audience() !== 'all' || category()) {
                    <app-button variant="primary" type="button" (click)="clearFilters()">
                      Limpiar filtros
                    </app-button>
                  }
                </div>
              }
            </main>
          </div>
        }
      </div>
    </section>
  `,
})
export class ShopComponent {
  private readonly content = inject(ContentService);
  private readonly cart = inject(CartService);
  private readonly seo = inject(SeoService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  protected readonly audience = signal<'all' | 'michis' | 'michi-lovers'>('all');
  protected readonly query = signal('');
  protected readonly category = signal('');
  protected readonly addingIds = signal<Set<string>>(new Set());

  protected readonly activeCategoryName = computed(() => {
    const slug = this.category();
    if (!slug) return '';
    return this.categoriesResource.value()?.find((c) => c.slug === slug)?.name ?? slug;
  });

  protected readonly pageTitle = computed(() => {
    const categoryName = this.activeCategoryName();
    const query = this.query().trim();
    if (query) {
      return `Resultados para: "${query}"`;
    }
    if (categoryName) {
      return categoryName;
    }
    return this.audience() === 'michis'
      ? 'Para Michis'
      : this.audience() === 'michi-lovers'
        ? 'Michi Lovers'
        : 'Tienda Completa';
  });

  protected readonly pageSub = computed(() => {
    const categoryName = this.activeCategoryName();
    if (categoryName) {
      return `Explora productos en ${categoryName}.`;
    }
    if (this.audience() === 'michis') {
      return 'Todo lo que tu gato necesita: descanso, juego y bienestar.';
    }
    if (this.audience() === 'michi-lovers') {
      return 'Detalles y regalos para humanos que viven por sus gatos.';
    }
    return 'Explora nuestro catálogo completo curado por Iris y Rubi.';
  });

  protected readonly emptyTitle = computed(() => {
    const query = this.query().trim();
    if (query) {
      return `No hay resultados para "${query}"`;
    }
    if (this.activeCategoryName()) {
      return `No hay productos en ${this.activeCategoryName()}`;
    }
    if (this.audience() === 'michi-lovers') {
      return 'Próximamente para Michi Lovers';
    }
    if (this.audience() === 'michis') {
      return 'Próximamente para Michis';
    }
    return 'No hay productos aún';
  });

  protected readonly emptyMessage = computed(() => {
    const query = this.query().trim();
    if (query) {
      return 'Prueba con otra palabra o limpia la búsqueda.';
    }
    if (this.activeCategoryName()) {
      return 'Prueba con otra categoría o vuelve pronto.';
    }
    if (this.audience() === 'michi-lovers') {
      return 'Estamos curando los mejores picks para humanos amantes de los gatos. Vuelve pronto.';
    }
    if (this.audience() === 'michis') {
      return 'Muy pronto tendremos novedades para tu michi.';
    }
    return 'Vuelve pronto para descubrir productos para michis y michi lovers.';
  });

  protected readonly categoriesResource = resource({
    loader: async () => this.content.getCategories(),
  });

  protected readonly productsResource = resource({
    loader: async () =>
      this.content.getProducts({
        category: this.category() || undefined,
        search: this.query().trim() || undefined,
      }),
  });

  protected readonly visibleProducts = computed(() => {
    const products = this.productsResource.value() ?? [];
    const audience = this.audience();
    const query = this.query().trim().toLowerCase();
    return products.filter((product) => {
      const matchesAudience = audience === 'all' || product.audience === audience;
      const haystack =
        `${product.name} ${product.copy} ${product.description} ${product.tag}`.toLowerCase();
      const matchesQuery = !query || haystack.includes(query);
      return matchesAudience && matchesQuery;
    });
  });

  protected readonly audienceFilters = computed(() => {
    const products = this.productsResource.value() ?? [];
    return [
      {
        value: 'all' as const,
        label: 'Todo',
        icon: 'M3 3h7v7H3V3zm11 0h7v7h-7V3zM3 14h7v7H3v-7zm11 0h7v7h-7v-7z',
        count: products.length,
      },
      {
        value: 'michis' as const,
        label: 'Para Michis',
        icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-2.5-9c.83 0 1.5-.67 1.5-1.5S10.33 8 9.5 8 8 8.67 8 9.5 8.67 11 9.5 11zm5 0c.83 0 1.5-.67 1.5-1.5S15.33 8 14.5 8 13 8.67 13 9.5s.67 1.5 1.5 1.5zm-7.5 3c.94 2.34 3.27 4 6 4s5.06-1.66 6-4H7z',
        count: products.filter((product) => product.audience === 'michis').length,
      },
      {
        value: 'michi-lovers' as const,
        label: 'Michi Lovers',
        icon: 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z',
        count: products.filter((product) => product.audience === 'michi-lovers').length,
      },
    ];
  });

  protected readonly isLoading = computed(
    () => this.categoriesResource.isLoading() || this.productsResource.isLoading(),
  );

  protected readonly anyError = computed(() => {
    const categoriesError = this.categoriesResource.error();
    if (categoriesError) {
      return String(categoriesError);
    }
    const productsError = this.productsResource.error();
    return productsError ? String(productsError) : null;
  });

  constructor() {
    this.seo.setPage(
      'Tienda | Las Chubys',
      'Catálogo completo para michis y michi lovers.',
      '/images/banner1.PNG',
      '/tienda',
    );

    const queryParams = this.route.snapshot.queryParamMap;
    const audienceParam = queryParams.get('audience');
    if (audienceParam === 'michis' || audienceParam === 'michi-lovers') {
      this.audience.set(audienceParam);
    }
    const categoryParam = queryParams.get('categoria');
    if (categoryParam) {
      this.category.set(categoryParam);
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

    effect(() => {
      const category = this.category();
      void this.router.navigate([], {
        relativeTo: this.route,
        queryParams: category ? { categoria: category } : {},
        queryParamsHandling: 'merge',
        replaceUrl: true,
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

  protected clearFilters() {
    this.audience.set('all');
    this.query.set('');
    this.category.set('');
  }

  protected reload() {
    this.categoriesResource.reload();
    this.productsResource.reload();
  }
}
