import { Component, inject, resource, signal, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';

import { marqueeItems, personas } from '../../core/content/site-content';
import { ContentService } from '../../core/services/content.service';
import { SeoService } from '../../core/services/seo.service';
import { CartService } from '../../core/services/cart.service';
import { ProductPick } from '../../core/models/content.model';
import { ButtonComponent } from '../../shared/ui/button/button.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, ButtonComponent],
  template: `
    <section class="relative">
      <div class="relative overflow-hidden">
        <picture>
          <source media="(max-width: 768px)" srcset="/images/banner1mobil.PNG" />
          <img src="/images/banner1.PNG" alt="Las Chubys" class="w-full block" />
        </picture>
      </div>
    </section>

    <section class="bg-[#fff4e8] py-6 md:py-8">
      <div class="max-w-6xl mx-auto px-4">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          @for (photo of bannerPhotos; track photo.src + $index) {
            <div class="rounded-2xl overflow-hidden aspect-video md:aspect-[4/3]">
              <img
                [src]="photo.src"
                [alt]="photo.alt"
                loading="lazy"
                class="w-full h-full object-cover"
              />
            </div>
          }
        </div>
      </div>
    </section>

    <section class="py-2.5 overflow-hidden bg-[#fff4e8]">
      <div class="flex gap-10 w-max animate-marquee">
        @for (item of promoLoop; track item + $index) {
          <span class="text-xs font-bold text-gray-500 uppercase tracking-wide whitespace-nowrap">{{
            item
          }}</span>
        }
      </div>
    </section>

    <section class="py-10 pb-12">
      <div class="max-w-6xl mx-auto px-4">
        <div class="flex items-end justify-between gap-4 mb-6">
          <div>
            <p class="text-xs font-extrabold uppercase tracking-widest text-orange mb-1">Tienda</p>
            <h2 class="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900">
              Nuestros productos
            </h2>
          </div>
          <a
            class="text-orange font-bold text-sm hover:text-orange-dark transition-colors duration-200"
            routerLink="/tienda"
            >Ver todo →</a
          >
        </div>

        @defer (on viewport) {
          <div class="shop-grid">
            @for (product of productsResource.value() ?? []; track product.id) {
              <article
                class="rounded-2xl bg-white border border-gray-200 overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(0,0,0,0.08)]"
              >
                <div
                  class="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-orange text-white text-xs font-extrabold uppercase tracking-wide z-10"
                >
                  {{ product.source === 'owned' ? 'Las Chubys' : 'Afiliado' }}
                </div>
                <div class="relative aspect-square overflow-hidden bg-gray-100">
                  <img
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
                    size="md"
                    type="button"
                    (click)="openPreview(product)"
                  >
                    Ver
                  </app-button>
                  <a
                    class="inline-flex items-center justify-center min-h-12 px-6 rounded-full font-extrabold text-sm tracking-wide border border-transparent bg-orange text-white cursor-pointer transition-all duration-200 hover:bg-orange-dark hover:-translate-y-px hover:shadow-[0_8px_20px_rgba(255,122,26,0.3)]"
                    [routerLink]="['/tienda']"
                    [queryParams]="{ product: product.id }"
                    >Comprar</a
                  >
                </div>
              </article>
            }
          </div>
        } @placeholder {
          <div class="h-96"></div>
        }
      </div>
    </section>

    <section class="shop-section shop-section--gray">
      <div class="max-w-6xl mx-auto px-4">
        <div class="flex items-end justify-between gap-4 mb-6">
          <div>
            <p class="text-xs font-extrabold uppercase tracking-widest text-orange mb-1">Blog</p>
            <h2 class="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900">
              Historias y consejos
            </h2>
          </div>
          <a
            class="text-orange font-bold text-sm hover:text-orange-dark transition-colors duration-200"
            routerLink="/blog"
            >Ver más →</a
          >
        </div>

        @defer (on viewport) {
          <div class="cards-grid">
            @for (post of postsResource.value() ?? []; track post.slug) {
              <a
                class="group grid gap-2 rounded-2xl overflow-hidden bg-white border border-gray-200 transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(0,0,0,0.08)]"
                [routerLink]="['/blog', post.slug]"
              >
                <div class="aspect-video overflow-hidden bg-gray-100">
                  <img
                    [src]="post.coverImage || '/images/cats/iris2.jpeg'"
                    [alt]="post.title"
                    loading="lazy"
                    class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <p class="mx-3.5 mt-2.5 text-xs font-extrabold uppercase tracking-wide text-orange">
                  {{ post.category }}
                </p>
                <h3 class="mx-3.5 text-base font-bold leading-snug text-gray-900">
                  {{ post.title }}
                </h3>
                <p class="card-blog__excerpt">{{ post.excerpt }}</p>
              </a>
            }
          </div>
        } @placeholder {
          <div class="h-96"></div>
        }
      </div>
    </section>

    <section class="shop-section shop-section--gray">
      <div class="max-w-6xl mx-auto px-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
          <a
            [routerLink]="['/tienda']"
            [queryParams]="{ audience: 'michis' }"
            class="relative rounded-2xl overflow-hidden aspect-video"
          >
            <img
              src="/images/cats/iris2.jpeg"
              alt="Para Michis"
              loading="lazy"
              class="w-full h-full object-cover"
            />
            <div
              class="absolute inset-0 flex flex-col justify-end p-6 text-white bg-gradient-to-t from-black/55 via-black/10 to-transparent"
            >
              <p class="text-xs font-extrabold uppercase tracking-widest opacity-90 mb-1">
                Categoría base
              </p>
              <h3 class="text-xl md:text-2xl font-extrabold leading-tight mb-2">Para Michis</h3>
              <span class="text-sm font-bold opacity-90">Explorar picks y tienda →</span>
            </div>
          </a>
          <a
            [routerLink]="['/tienda']"
            [queryParams]="{ audience: 'michi-lovers' }"
            class="relative rounded-2xl overflow-hidden aspect-video"
          >
            <img
              src="/images/cats/iris2.jpeg"
              alt="Michi Lovers"
              loading="lazy"
              class="w-full h-full object-cover"
            />
            <div
              class="absolute inset-0 flex flex-col justify-end p-6 text-white bg-gradient-to-t from-black/55 via-black/10 to-transparent"
            >
              <p class="text-xs font-extrabold uppercase tracking-widest opacity-90 mb-1">
                Categoría base
              </p>
              <h3 class="text-xl md:text-2xl font-extrabold leading-tight mb-2">Michi Lovers</h3>
              <span class="text-sm font-bold opacity-90">Ver regalos y picks →</span>
            </div>
          </a>
        </div>
      </div>
    </section>

    <section class="py-10 pb-12">
      <div class="max-w-6xl mx-auto px-4">
        <div class="flex items-end justify-between gap-4 mb-6">
          <div>
            <p class="text-xs font-extrabold uppercase tracking-widest text-orange mb-1">
              Persona Spotlight
            </p>
            <h2 class="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900">
              Iris y Rubi al frente
            </h2>
          </div>
        </div>

        @defer (on viewport) {
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            @for (persona of personas; track persona.name) {
              <article
                class="grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-5 items-center p-5 rounded-2xl bg-white border border-gray-200"
              >
                <img
                  [src]="persona.image"
                  [alt]="persona.name"
                  loading="lazy"
                  class="w-full h-36 object-cover rounded-2xl"
                />
                <div>
                  <p class="text-xs font-extrabold uppercase tracking-wide text-orange mb-1">
                    {{ persona.role }}
                  </p>
                  <h3 class="text-lg font-extrabold text-gray-900 mb-1">{{ persona.name }}</h3>
                  <p class="text-sm text-gray-500 leading-relaxed">{{ persona.accent }}</p>
                </div>
              </article>
            }
          </div>
        } @placeholder {
          <div class="h-96"></div>
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
      >
        <article
          class="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-[32px] bg-white"
          role="presentation"
          tabindex="-1"
          (click)="$event.stopPropagation()"
          (keydown)="$event.stopPropagation()"
        >
          <img [src]="product.images[0] || '/images/cats/iris4.jpeg'" [alt]="product.name" />
          <div class="grid content-start gap-3">
            <p class="text-xs font-extrabold uppercase tracking-widest text-orange mb-1">
              {{ product.tag }}
            </p>
            <h2>{{ product.name }}</h2>
            <p>{{ product.description || product.copy }}</p>
            <div class="flex gap-3 flex-wrap">
              <app-button type="button" size="md" (click)="addToCart(product)">
                Agregar
              </app-button>
              <a
                class="inline-flex items-center justify-center min-h-12 px-6 rounded-full font-extrabold text-sm tracking-wide border cursor-pointer transition-all duration-200 bg-orange/[0.08] border-orange/[0.16] text-[#e06300] hover:bg-orange/[0.14] hover:border-orange/[0.28]"
                routerLink="/tienda"
                >Ver catálogo</a
              >
            </div>
          </div>
        </article>
      </div>
    }
  `,
})
export class HomeComponent {
  private readonly content = inject(ContentService);
  private readonly cart = inject(CartService);
  private readonly seo = inject(SeoService);

  protected readonly personas = personas;
  protected readonly promoLoop = [
    ...marqueeItems,
    'Para Michis',
    'Michi Lovers',
    'Tienda Física',
    'Afiliados curados',
  ];
  protected readonly bannerPhotos: readonly { src: string; alt: string }[] = [
    { src: '/images/banner1.PNG', alt: 'Las Chubys banner 1' },
    { src: '/images/banner1.PNG', alt: 'Las Chubys banner 2' },
    { src: '/images/banner1.PNG', alt: 'Las Chubys banner 3' },
  ];
  protected readonly selectedProduct = signal<ProductPick | null>(null);
  protected readonly postsResource = resource({
    loader: async () => this.content.getPosts(3),
  });
  protected readonly productsResource = resource({
    loader: async () => (await this.content.getProducts()).slice(0, 4),
  });

  constructor() {
    this.seo.setPage(
      'Las Chubys',
      'Iris, Rubi y su universo editorial felino.',
      '/brand/logo.png',
      '/',
    );
    this.seo.setJsonLd({
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Las Chubys',
      url: 'https://laschubys.com',
      sameAs: [
        'https://www.instagram.com/laschubys.oficial/',
        'https://www.tiktok.com/@laschubys.oficial',
      ],
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
