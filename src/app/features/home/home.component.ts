import {
  Component,
  ElementRef,
  inject,
  resource,
  signal,
  viewChild,
  ChangeDetectionStrategy,
  DestroyRef,
  afterNextRender,
} from '@angular/core';
import { RouterLink } from '@angular/router';

import { marqueeItems, personas } from '../../core/content/site-content';
import { ContentService } from '../../core/services/content.service';
import { SeoService } from '../../core/services/seo.service';
import { CartService } from '../../core/services/cart.service';
import { BlogPost, ProductPick } from '../../core/models/content.model';
import { ButtonComponent } from '../../shared/ui/button/button.component';
import { CarouselComponent } from '../../shared/ui/carousel/carousel.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, ButtonComponent, CarouselComponent],
  template: `
    <section
      #sliderSection
      class="group relative overflow-hidden bg-[#fff4e8]"
      (mouseenter)="pauseAutoPlay()"
      (mouseleave)="resumeAutoPlay()"
    >
      <div
        class="flex transition-transform duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]"
        [style.transform]="'translateX(-' + currentSlide() * 100 + '%)'"
        (touchstart)="onTouchStart($event)"
        (touchend)="onTouchEnd($event)"
      >
        @for (photo of bannerPhotos; track photo.src + $index) {
          <div class="w-full flex-shrink-0">
            <img [src]="photo.src" [alt]="photo.alt" class="w-full block" />
          </div>
        }
      </div>

      <div
        class="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/20 to-transparent"
        aria-hidden="true"
      ></div>

      <button
        type="button"
        class="hidden md:grid opacity-0 group-hover:opacity-100 absolute left-3 top-1/2 -translate-y-1/2 w-12 h-12 place-items-center rounded-full bg-white/90 text-orange shadow-lg hover:bg-white hover:scale-105 transition-all duration-300"
        (click)="prevSlide()"
        aria-label="Banner anterior"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        type="button"
        class="hidden md:grid opacity-0 group-hover:opacity-100 absolute right-3 top-1/2 -translate-y-1/2 w-12 h-12 place-items-center rounded-full bg-white/90 text-orange shadow-lg hover:bg-white hover:scale-105 transition-all duration-300"
        (click)="nextSlide()"
        aria-label="Banner siguiente"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      <div class="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3">
        @for (photo of bannerPhotos; track photo.src + $index) {
          <button
            type="button"
            class="grid place-items-center w-10 h-10 rounded-full transition-transform duration-200 hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange"
            (click)="goToSlide($index)"
            [attr.aria-label]="'Ver banner ' + ($index + 1)"
            [attr.aria-current]="currentSlide() === $index ? 'true' : null"
          >
            <span
              class="block rounded-full transition-all duration-300"
              [class.w-3]="currentSlide() === $index"
              [class.h-3]="currentSlide() === $index"
              [class.w-2]="currentSlide() !== $index"
              [class.h-2]="currentSlide() !== $index"
              [class.bg-orange]="currentSlide() === $index"
              [class.bg-white/80]="currentSlide() !== $index"
              [class.ring-2]="currentSlide() === $index"
              [class.ring-white]="currentSlide() === $index"
            ></span>
          </button>
        }
      </div>
    </section>

    <section class="py-2.5 overflow-hidden bg-[#fff4e8]">
      <div class="flex gap-10 w-max animate-marquee motion-reduce:animate-none">
        @for (item of promoLoop; track item + $index) {
          <span class="text-xs font-bold text-gray-500 uppercase tracking-wide whitespace-nowrap">{{
            item
          }}</span>
        }
      </div>
    </section>

    <section class="bg-white py-10 md:py-16">
      <div class="max-w-4xl mx-auto px-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
          <a
            routerLink="/tienda"
            [queryParams]="{ audience: 'michis' }"
            class="group flex items-center justify-center gap-3 min-h-[80px] md:min-h-[96px] px-8 rounded-full border-2 border-orange/30 bg-white text-orange shadow-sm hover:bg-orange hover:text-white hover:border-orange hover:shadow-[0_16px_40px_rgba(255,122,26,0.22)] hover:-translate-y-1 transition-all duration-300"
          >
            <svg
              class="w-7 h-7 md:w-8 md:h-8 flex-shrink-0 transition-transform group-hover:scale-110"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-2.5-9c.83 0 1.5-.67 1.5-1.5S10.33 8 9.5 8 8 8.67 8 9.5 8.67 11 9.5 11zm5 0c.83 0 1.5-.67 1.5-1.5S15.33 8 14.5 8 13 8.67 13 9.5s.67 1.5 1.5 1.5zm-7.5 3c.94 2.34 3.27 4 6 4s5.06-1.66 6-4H7z"
              />
            </svg>
            <span class="text-base md:text-lg font-extrabold tracking-wide uppercase"
              >PARA MICHIS</span
            >
          </a>
          <a
            routerLink="/tienda"
            [queryParams]="{ audience: 'michi-lovers' }"
            class="group flex items-center justify-center gap-3 min-h-[80px] md:min-h-[96px] px-8 rounded-full border-2 border-orange/30 bg-white text-orange shadow-sm hover:bg-orange hover:text-white hover:border-orange hover:shadow-[0_16px_40px_rgba(255,122,26,0.22)] hover:-translate-y-1 transition-all duration-300"
          >
            <svg
              class="w-7 h-7 md:w-8 md:h-8 flex-shrink-0 transition-transform group-hover:scale-110"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
              />
            </svg>
            <span class="text-base md:text-lg font-extrabold tracking-wide uppercase"
              >PARA MICHILOVERS</span
            >
          </a>
        </div>
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
          <app-carousel [items]="productsResource.value() ?? []">
            <ng-template let-product>
              <article
                class="relative snap-start flex-shrink-0 w-[85%] sm:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.75rem)] xl:w-[calc(25%-0.75rem)] rounded-2xl bg-white border border-gray-200 overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(0,0,0,0.08)]"
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
                    class="w-full h-full object-cover"
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
            </ng-template>
          </app-carousel>
        } @placeholder {
          <div class="h-96"></div>
        }
      </div>
    </section>

    <section class="py-12 md:py-16 bg-gray-50">
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
          <app-carousel [items]="postsResource.value() ?? []">
            <ng-template let-post>
              <a
                class="group grid gap-2 snap-start flex-shrink-0 w-[85%] sm:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.75rem)] xl:w-[calc(25%-0.75rem)] rounded-2xl overflow-hidden bg-white border border-gray-200 transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(0,0,0,0.08)]"
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
                <p class="text-sm text-gray-600 line-clamp-3 mx-3.5 mb-3.5">{{ post.excerpt }}</p>
              </a>
            </ng-template>
          </app-carousel>
        } @placeholder {
          <div class="h-96"></div>
        }
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
  protected readonly currentSlide = signal(0);
  protected readonly autoPlayPaused = signal(false);
  private readonly sliderVisible = signal(true);
  private readonly sliderSection = viewChild.required<ElementRef<HTMLElement>>('sliderSection');
  private readonly destroyRef = inject(DestroyRef);
  private touchStartX = 0;
  private autoPlayIntervalId: number | null = null;
  protected readonly selectedProduct = signal<ProductPick | null>(null);
  protected readonly postsResource = resource({
    loader: async () => this.content.getPosts(5),
  });
  protected readonly productsResource = resource({
    loader: async () => (await this.content.getProducts()).slice(0, 6),
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

    afterNextRender(() => {
      this.startAutoPlay();

      const section = this.sliderSection().nativeElement;
      section.setAttribute('tabindex', '0');
      section.setAttribute('role', 'region');
      section.setAttribute('aria-roledescription', 'carrusel');
      section.setAttribute('aria-label', 'Banners destacados');

      const observer = new IntersectionObserver(
        ([entry]) => {
          this.sliderVisible.set(entry.isIntersecting);
          entry.isIntersecting ? this.startAutoPlay() : this.stopAutoPlay();
        },
        { threshold: 0.25 },
      );
      observer.observe(section);
      this.destroyRef.onDestroy(() => observer.disconnect());

      const onKeydown = (event: KeyboardEvent) => {
        if (event.key === 'ArrowLeft') {
          event.preventDefault();
          this.prevSlide();
        } else if (event.key === 'ArrowRight') {
          event.preventDefault();
          this.nextSlide();
        }
      };
      section.addEventListener('keydown', onKeydown);
      this.destroyRef.onDestroy(() => section.removeEventListener('keydown', onKeydown));
    });

    this.destroyRef.onDestroy(() => this.stopAutoPlay());
  }

  protected nextSlide() {
    this.currentSlide.update((index) => (index + 1) % this.bannerPhotos.length);
    this.resetAutoPlay();
  }

  protected prevSlide() {
    this.currentSlide.update(
      (index) => (index - 1 + this.bannerPhotos.length) % this.bannerPhotos.length,
    );
    this.resetAutoPlay();
  }

  protected goToSlide(index: number) {
    this.currentSlide.set(index);
    this.resetAutoPlay();
  }

  protected onTouchStart(event: TouchEvent) {
    this.touchStartX = event.changedTouches[0].screenX;
  }

  protected onTouchEnd(event: TouchEvent) {
    const delta = this.touchStartX - event.changedTouches[0].screenX;
    const threshold = 50;
    if (delta > threshold) {
      this.nextSlide();
    } else if (delta < -threshold) {
      this.prevSlide();
    }
  }

  protected pauseAutoPlay() {
    this.autoPlayPaused.set(true);
    this.stopAutoPlay();
  }

  protected resumeAutoPlay() {
    this.autoPlayPaused.set(false);
    if (this.sliderVisible()) {
      this.startAutoPlay();
    }
  }

  private startAutoPlay() {
    if (this.autoPlayPaused() || !this.sliderVisible() || this.autoPlayIntervalId) return;
    this.autoPlayIntervalId = window.setInterval(() => this.nextSlide(), 6000);
  }

  private stopAutoPlay() {
    if (this.autoPlayIntervalId) {
      window.clearInterval(this.autoPlayIntervalId);
      this.autoPlayIntervalId = null;
    }
  }

  private resetAutoPlay() {
    if (this.autoPlayPaused() || !this.sliderVisible()) return;
    this.stopAutoPlay();
    this.startAutoPlay();
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
