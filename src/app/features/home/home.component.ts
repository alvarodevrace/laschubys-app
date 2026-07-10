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
import { provideIcons } from '@ng-icons/core';
import {
  lucideCat,
  lucideChevronLeft,
  lucideChevronRight,
  lucideCrown,
  lucideHandshake,
  lucideShoppingBag,
  lucideShoppingCart,
  lucideStar,
} from '@ng-icons/lucide';

import { HlmBadgeImports } from '@spartan-ng/helm/badge';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmDialogImports } from '@spartan-ng/helm/dialog';
import { HlmIconImports } from '@spartan-ng/helm/icon';

import { marqueeItems, personas } from '../../core/content/site-content';
import { ContentService } from '../../core/services/content.service';
import { SeoService } from '../../core/services/seo.service';
import { CartService } from '../../core/services/cart.service';
import { ProductPick } from '../../core/models/content.model';
import { CarouselComponent } from '../../shared/ui/carousel/carousel.component';
import { PhotoGalleryComponent } from '../../shared/ui/photo-gallery/photo-gallery.component';
import { SectionShellComponent } from '../../shared/ui/section-shell/section-shell.component';
import {
  MarqueeComponent,
  ScrollRevealDirective,
  StaggerChildrenDirective,
} from '../../shared/animations';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-home',
  standalone: true,
  imports: [
    RouterLink,
    CarouselComponent,
    PhotoGalleryComponent,
    SectionShellComponent,
    MarqueeComponent,
    ScrollRevealDirective,
    StaggerChildrenDirective,
    HlmButtonImports,
    HlmIconImports,
    HlmBadgeImports,
    HlmCardImports,
    HlmDialogImports,
  ],
  providers: [
    provideIcons({
      lucideCat,
      lucideChevronLeft,
      lucideChevronRight,
      lucideCrown,
      lucideHandshake,
      lucideShoppingBag,
      lucideShoppingCart,
      lucideStar,
    }),
  ],
  template: `
    <section
      #sliderSection
      class="group relative overflow-hidden bg-surface"
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
        hlmBtn
        variant="outline"
        size="icon-lg"
        type="button"
        class="hidden md:grid opacity-0 group-hover:opacity-100 absolute left-3 top-1/2 -translate-y-1/2"
        (click)="prevSlide()"
        aria-label="Banner anterior"
      >
        <ng-icon hlmIcon name="lucideChevronLeft" class="w-6 h-6" />
      </button>
      <button
        hlmBtn
        variant="outline"
        size="icon-lg"
        type="button"
        class="hidden md:grid opacity-0 group-hover:opacity-100 absolute right-3 top-1/2 -translate-y-1/2"
        (click)="nextSlide()"
        aria-label="Banner siguiente"
      >
        <ng-icon hlmIcon name="lucideChevronRight" class="w-6 h-6" />
      </button>

      <div class="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3">
        @for (photo of bannerPhotos; track photo.src + $index) {
          <button
            hlmBtn
            variant="ghost"
            size="icon"
            type="button"
            class="grid place-items-center"
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
              [class.bg-primary]="currentSlide() === $index"
              [class.bg-background/80]="currentSlide() !== $index"
              [class.ring-2]="currentSlide() === $index"
              [class.ring-white]="currentSlide() === $index"
              [class.motion-safe:animate-pulse]="currentSlide() === $index"
            ></span>
          </button>
        }
      </div>
    </section>

    <section class="py-2.5 overflow-hidden bg-surface">
      <app-marquee [speed]="'25s'" [pauseOnHover]="true" [fadeEdges]="true">
        @for (item of promoLoop; track item + $index) {
          <span
            class="text-xs font-bold text-muted-foreground uppercase tracking-wide whitespace-nowrap px-5"
            >{{ item }}</span
          >
        }
      </app-marquee>
    </section>

    <section class="bg-[#FFF5F0] pt-20 pb-12 md:pt-24 md:pb-20">
      <div class="max-w-6xl mx-auto px-4">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-7">
          <!-- Comité de Gatos Asociados -->
          <a
            routerLink="/auth/login"
            class="group relative flex flex-col items-center text-center rounded-[2rem] border-2 border-primary/25 bg-[#FFFBF8] px-7 pb-8 pt-10 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-primary/50"
            appScrollReveal
          >
            <span
              class="absolute -top-10 left-1/2 z-10 inline-flex h-20 w-20 -translate-x-1/2 items-center justify-center rounded-full bg-primary text-foreground shadow-md"
            >
              <ng-icon hlmIcon name="lucideCrown" class="w-12 h-12" />
            </span>
            <div class="flex min-h-[5.5rem] items-end justify-center">
              <h2 class="text-base md:text-lg font-black uppercase tracking-wide text-foreground">
                Únete al<br /><span class="text-primary">Comité de Gatos Asociados</span>
              </h2>
            </div>
            <div class="my-5 flex w-full items-center gap-3 px-2">
              <span class="h-[2px] flex-1 bg-primary/25"></span>
              <ng-icon hlmIcon name="lucideCat" class="w-5 h-5 text-foreground" />
              <span class="h-[2px] flex-1 bg-primary/25"></span>
            </div>
            <p class="text-sm md:text-[15px] leading-relaxed text-muted-foreground mb-8">
              Crea tu perfil y entra al imperio. Contenido exclusivo, beneficios y comunidad gatuna.
            </p>
            <span
              class="mt-auto inline-flex w-full items-center justify-center gap-2 rounded-full bg-foreground px-6 py-3.5 text-sm font-black uppercase tracking-wide text-white shadow-md transition-all group-hover:bg-black group-hover:shadow-lg"
            >
              Crear mi cuenta
              <ng-icon hlmIcon name="lucideCat" class="w-5 h-5 text-primary" />
            </span>
          </a>

          <!-- Explora nuestra Tienda -->
          <a
            routerLink="/tienda"
            class="group relative flex flex-col items-center text-center rounded-[2rem] border-2 border-primary/25 bg-[#FFFBF8] px-7 pb-8 pt-10 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-primary/50"
            appScrollReveal
            [delay]="0.1"
          >
            <span
              class="absolute -top-10 left-1/2 z-10 inline-flex h-20 w-20 -translate-x-1/2 items-center justify-center rounded-full bg-primary text-foreground shadow-md"
            >
              <ng-icon hlmIcon name="lucideShoppingBag" class="w-12 h-12" />
            </span>
            <div class="flex min-h-[5.5rem] items-end justify-center">
              <h2 class="text-base md:text-lg font-black uppercase tracking-wide text-foreground">
                Explora nuestra<br /><span class="text-primary">Tienda</span>
              </h2>
            </div>
            <div class="my-5 flex w-full items-center gap-3 px-2">
              <span class="h-[2px] flex-1 bg-primary/25"></span>
              <ng-icon hlmIcon name="lucideShoppingCart" class="w-5 h-5 text-foreground" />
              <span class="h-[2px] flex-1 bg-primary/25"></span>
            </div>
            <p class="text-sm md:text-[15px] leading-relaxed text-muted-foreground mb-8">
              Productos seleccionados para consentir a quienes gobiernan la casa.
            </p>
            <span
              class="mt-auto inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-black uppercase tracking-wide text-white shadow-md transition-all group-hover:bg-primary/90 group-hover:shadow-lg"
            >
              Ver productos
              <ng-icon hlmIcon name="lucideShoppingCart" class="w-5 h-5 text-foreground" />
            </span>
          </a>

          <!-- Conoce nuestros Servicios -->
          <a
            routerLink="/contact"
            class="group relative flex flex-col items-center text-center rounded-[2rem] border-2 border-primary/25 bg-[#FFFBF8] px-7 pb-8 pt-10 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-primary/50"
            appScrollReveal
            [delay]="0.2"
          >
            <span
              class="absolute -top-10 left-1/2 z-10 inline-flex h-20 w-20 -translate-x-1/2 items-center justify-center rounded-full bg-primary text-foreground shadow-md"
            >
              <ng-icon hlmIcon name="lucideHandshake" class="w-12 h-12" />
            </span>
            <div class="flex min-h-[5.5rem] items-end justify-center">
              <h2 class="text-base md:text-lg font-black uppercase tracking-wide text-foreground">
                Conoce nuestros<br /><span class="text-primary">Servicios</span>
              </h2>
            </div>
            <div class="my-5 flex w-full items-center gap-3 px-2">
              <span class="h-[2px] flex-1 bg-primary/25"></span>
              <ng-icon hlmIcon name="lucideStar" class="w-5 h-5 text-foreground" />
              <span class="h-[2px] flex-1 bg-primary/25"></span>
            </div>
            <p class="text-sm md:text-[15px] leading-relaxed text-muted-foreground mb-8">
              Colabora con nosotros, participa en nuestro programa "Haz famoso a tu mascota".
            </p>
            <span
              class="mt-auto inline-flex w-full items-center justify-center gap-2 rounded-full bg-foreground px-6 py-3.5 text-sm font-black uppercase tracking-wide text-white shadow-md transition-all group-hover:bg-black group-hover:shadow-lg"
            >
              Descubrir más
              <ng-icon hlmIcon name="lucideStar" class="w-5 h-5 text-primary" />
            </span>
          </a>
        </div>
      </div>
    </section>

    <app-section-shell variant="warm">
      <div class="flex items-end justify-between gap-4 mb-6">
        <div>
          <p class="text-xs font-extrabold uppercase tracking-widest text-primary mb-1">Tienda</p>
          <h2 class="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground">
            Nuestros productos
          </h2>
        </div>
        <a hlmBtn variant="link" routerLink="/tienda">Ver todo →</a>
      </div>

      @defer (on viewport) {
        <app-carousel [items]="productsResource.value() ?? []">
          <ng-template let-product>
            <div
              class="snap-start flex-shrink-0 w-[85%] sm:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.75rem)] xl:w-[calc(25%-0.75rem)]"
              appScrollReveal
              [delay]="0.05"
            >
              <article
                hlmCard
                class="group relative h-full !p-0 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <span hlmBadge class="absolute top-3 left-3 z-10">
                  {{ product.source === 'owned' ? 'Las Chubys' : 'Afiliado' }}
                </span>
                <div class="relative aspect-square overflow-hidden bg-muted">
                  <img
                    [src]="product.images[0] || '/images/cats/iris4.jpeg'"
                    [alt]="product.name"
                    loading="lazy"
                    class="w-full h-full object-cover"
                  />
                </div>
                <div class="p-3.5 pb-2">
                  <p class="text-sm font-bold leading-snug text-foreground mb-1">
                    {{ product.name }}
                  </p>
                  <p class="text-sm font-extrabold text-primary">{{ product.price }}</p>
                </div>
                <div class="flex gap-2 px-3.5 pb-3.5">
                  <button
                    hlmBtn
                    variant="outline"
                    type="button"
                    class="flex-1"
                    (click)="openPreview(product)"
                  >
                    Ver
                  </button>
                  <a
                    hlmBtn
                    class="flex-1 text-center"
                    [routerLink]="['/tienda']"
                    [queryParams]="{ product: product.id }"
                    >Comprar</a
                  >
                </div>
              </article>
            </div>
          </ng-template>
        </app-carousel>
      } @placeholder {
        <div class="h-96"></div>
      }
    </app-section-shell>

    <app-photo-gallery
      appStaggerChildren
      childSelector=".group"
      [staggerDelay]="0.05"
      [duration]="0.5"
      [y]="24"
    />

    <app-section-shell variant="warm">
      <div class="flex items-end justify-between gap-4 mb-6">
        <div>
          <p class="text-xs font-extrabold uppercase tracking-widest text-primary mb-1">Blog</p>
          <h2 class="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground">
            Historias y consejos
          </h2>
        </div>
        <a hlmBtn variant="link" routerLink="/blog">Ver más →</a>
      </div>

      @defer (on viewport) {
        <app-carousel [items]="postsResource.value() ?? []">
          <ng-template let-post>
            <div
              class="snap-start flex-shrink-0 w-[85%] sm:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.75rem)] xl:w-[calc(25%-0.75rem)]"
              appScrollReveal
              [delay]="0.05"
            >
              <a
                hlmCard
                class="group h-full !gap-2 !p-0 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                [routerLink]="['/blog', post.slug]"
              >
                <div class="aspect-video overflow-hidden bg-muted">
                  <img
                    [src]="post.coverImage || '/images/cats/iris2.jpeg'"
                    [alt]="post.title"
                    loading="lazy"
                    class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <p
                  class="mx-3.5 mt-2.5 text-xs font-extrabold uppercase tracking-wide text-primary"
                >
                  {{ post.category }}
                </p>
                <h3 class="mx-3.5 text-base font-bold leading-snug text-foreground">
                  {{ post.title }}
                </h3>
                <p class="text-sm text-muted-foreground line-clamp-3 mx-3.5 mb-3.5">
                  {{ post.excerpt }}
                </p>
              </a>
            </div>
          </ng-template>
        </app-carousel>
      } @placeholder {
        <div class="h-96"></div>
      }
    </app-section-shell>

    @if (selectedProduct(); as product) {
      <hlm-dialog [state]="'open'" (stateChanged)="onPreviewStateChange($event)">
        <hlm-dialog-content
          *hlmDialogPortal
          class="sm:max-w-3xl p-0 overflow-hidden rounded-3xl border-0 shadow-2xl"
        >
          <article class="w-full grid grid-cols-1 md:grid-cols-2 bg-white">
            <div class="relative aspect-square bg-muted">
              <img
                [src]="product.images[0] || '/images/cats/iris4.jpeg'"
                [alt]="product.name"
                class="w-full h-full object-cover"
              />
              <span
                hlmBadge
                class="absolute top-4 left-4 z-10"
                [variant]="product.source === 'owned' ? 'default' : 'secondary'"
              >
                {{ product.source === 'owned' ? 'Las Chubys' : 'Afiliado' }}
              </span>
            </div>
            <div class="flex flex-col gap-4 p-6 md:p-8">
              <div>
                <p class="text-xs font-extrabold uppercase tracking-widest text-primary mb-2">
                  {{ product.tag }}
                </p>
                <h2 class="text-2xl md:text-3xl font-black leading-tight text-foreground mb-2">
                  {{ product.name }}
                </h2>
                <p class="text-xl font-extrabold text-primary">{{ product.price }}</p>
              </div>
              <p class="text-sm md:text-base leading-relaxed text-muted-foreground">
                {{ product.description || product.copy }}
              </p>
              <div class="flex flex-col sm:flex-row gap-3 mt-auto">
                <button hlmBtn type="button" class="flex-1" (click)="addToCart(product)">
                  Agregar al carrito
                </button>
                <a hlmBtn variant="outline" class="flex-1 text-center" routerLink="/tienda">
                  Ver catálogo
                </a>
              </div>
            </div>
          </article>
        </hlm-dialog-content>
      </hlm-dialog>
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
        'https://www.instagram.com/laschubys/',
        'https://www.tiktok.com/@laschubys.oficial',
        'https://www.facebook.com/people/Las-Chubys/61589964727281/',
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
          if (entry.isIntersecting) {
            this.startAutoPlay();
          } else {
            this.stopAutoPlay();
          }
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

  protected onPreviewStateChange(state: 'open' | 'closed') {
    if (state === 'closed') {
      this.closePreview();
    }
  }
}
