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
import { provideIcons } from '@ng-icons/core';
import {
  lucideAlertCircle,
  lucideLayoutGrid,
  lucideSearch,
  lucideCat,
  lucideHeart,
} from '@ng-icons/lucide';

import { ProductPick } from '../../core/models/content.model';
import { CartService } from '../../core/services/cart.service';
import { ContentService } from '../../core/services/content.service';
import { SeoService } from '../../core/services/seo.service';
import { HlmAlertImports } from '@spartan-ng/helm/alert';
import { HlmBreadcrumbImports } from '@spartan-ng/helm/breadcrumb';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group';
import { HlmBadgeImports } from '@spartan-ng/helm/badge';
import { HlmSkeletonImports } from '@spartan-ng/helm/skeleton';
import { StaggerChildrenDirective, TiltCardDirective } from '../../shared/animations';
import { CategorySidebarComponent } from './category-sidebar.component';
import { ProductCardComponent } from './product-card.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-shop',
  standalone: true,
  imports: [
    RouterLink,
    HlmAlertImports,
    HlmBreadcrumbImports,
    HlmButtonImports,
    HlmIconImports,
    HlmInputGroupImports,
    HlmBadgeImports,
    HlmSkeletonImports,
    CategorySidebarComponent,
    ProductCardComponent,
    StaggerChildrenDirective,
    TiltCardDirective,
  ],
  providers: [
    provideIcons({ lucideAlertCircle, lucideLayoutGrid, lucideSearch, lucideCat, lucideHeart }),
  ],
  template: `
    <section class="py-10 pb-8" data-reveal>
      <div class="max-w-6xl mx-auto px-4">
        <nav class="mb-4" hlmBreadcrumb aria-label="Breadcrumb">
          <ol hlmBreadcrumbList>
            <li hlmBreadcrumbItem>
              <a hlmBreadcrumbLink [link]="['/']">Inicio</a>
            </li>
            <li hlmBreadcrumbSeparator></li>
            <li hlmBreadcrumbItem>
              <span hlmBreadcrumbPage>Tienda</span>
            </li>
            @if (activeCategoryName()) {
              <li hlmBreadcrumbSeparator></li>
              <li hlmBreadcrumbItem>
                <span hlmBreadcrumbPage>{{ activeCategoryName() }}</span>
              </li>
            }
          </ol>
        </nav>
        <h1
          class="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight text-primary mb-2"
        >
          {{ pageTitle() }}
        </h1>
        <p class="text-muted-foreground max-w-2xl">{{ pageSub() }}</p>
      </div>
    </section>

    <section class="py-4" data-reveal>
      <div class="max-w-6xl mx-auto px-4">
        <div class="flex items-center gap-4 flex-wrap py-4 mb-6 border-b border-border">
          <div class="flex gap-3 flex-wrap">
            @for (filter of audienceFilters(); track filter.value) {
              <button
                type="button"
                hlmBtn
                [variant]="audience() === filter.value ? 'default' : 'outline'"
                (click)="audience.set(filter.value)"
                [attr.data-testid]="'tienda-filter-' + filter.value"
              >
                <ng-icon hlmIcon [name]="filter.icon" class="w-4 h-4 flex-shrink-0" />
                <span>{{ filter.label }}</span>
                <span hlmBadge>{{ filter.count }}</span>
              </button>
            }
          </div>
          <div
            hlmInputGroup
            class="ml-auto flex-1 max-w-md bg-input/30 border-input/30 h-9 rounded-lg shadow-none"
          >
            <input
              hlmInputGroupInput
              [value]="query()"
              (input)="query.set($any($event).target.value)"
              type="search"
              placeholder="Buscar por nombre o idea..."
              data-testid="tienda-search-input"
            />
            <hlm-input-group-addon>
              <ng-icon name="lucideSearch" class="shrink-0 opacity-50" />
            </hlm-input-group-addon>
          </div>
        </div>
      </div>
    </section>

    <section class="pb-16" data-reveal>
      <div class="max-w-6xl mx-auto px-4">
        @if (anyError()) {
          <div hlmAlert variant="destructive" class="max-w-xl mx-auto">
            <ng-icon hlmIcon name="lucideAlertCircle" class="w-5 h-5" />
            <h4 hlmAlertTitle>No pudimos cargar la tienda</h4>
            <p hlmAlertDescription>{{ anyError() }}</p>
            <div hlmAlertAction>
              <button type="button" hlmBtn (click)="reload()">Reintentar</button>
            </div>
          </div>
        } @else if (isLoading()) {
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            @for (_ of [1, 2, 3, 4]; track $index) {
              <div hlmSkeleton class="rounded-3xl h-80"></div>
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
                  <h2 class="text-lg md:text-xl font-extrabold text-foreground">
                    {{ visibleProducts().length }} producto{{
                      visibleProducts().length === 1 ? '' : 's'
                    }}
                  </h2>
                  @if (activeCategoryName()) {
                    <button type="button" hlmBtn variant="link" (click)="category.set('')">
                      Ver todas
                    </button>
                  }
                </div>
                <div
                  class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
                  appStaggerChildren
                  childSelector="app-product-card"
                  [staggerDelay]="0.08"
                >
                  @for (product of visibleProducts(); track product.id) {
                    <app-product-card
                      appTiltCard
                      [product]="product"
                      [adding]="addingIds().has(product.id)"
                      (add)="addToCart($event)"
                    />
                  }
                </div>
              } @else {
                <div hlmAlert class="max-w-xl mx-auto">
                  <ng-icon hlmIcon name="lucideAlertCircle" class="w-5 h-5" />
                  <h4 hlmAlertTitle>{{ emptyTitle() }}</h4>
                  <p hlmAlertDescription>{{ emptyMessage() }}</p>
                  @if (query().trim() || audience() !== 'all' || category()) {
                    <div hlmAlertAction>
                      <button type="button" hlmBtn (click)="clearFilters()">Limpiar filtros</button>
                    </div>
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
        icon: 'lucideLayoutGrid',
        count: products.length,
      },
      {
        value: 'michis' as const,
        label: 'Para Michis',
        icon: 'lucideCat',
        count: products.filter((product) => product.audience === 'michis').length,
      },
      {
        value: 'michi-lovers' as const,
        label: 'Michi Lovers',
        icon: 'lucideHeart',
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
