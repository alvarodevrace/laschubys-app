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
  lucideChartNoAxesCombined,
  lucideChevronLeft,
  lucideChevronRight,
  lucideEye,
  lucideHeart,
  lucideHome,
  lucideShare2,
  lucideShoppingCart,
  lucideSmartphone,
  lucideStore,
  lucideTrendingUp,
  lucideUsers,
} from '@ng-icons/lucide';

import { HlmBadgeImports } from '@spartan-ng/helm/badge';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmDialogImports } from '@spartan-ng/helm/dialog';
import { HlmIconImports } from '@spartan-ng/helm/icon';

import { characters, casaChuby } from '../../core/content/site-content';
import { ContentService } from '../../core/services/content.service';
import { SeoService } from '../../core/services/seo.service';
import { CartService } from '../../core/services/cart.service';
import { ToastService } from '../../shared/ui/toast/toast.service';
import { ProductPick } from '../../core/models/content.model';
import { CarouselComponent } from '../../shared/ui/carousel/carousel.component';
import { SectionShellComponent } from '../../shared/ui/section-shell/section-shell.component';
import {
  ScrollRevealDirective,
  StaggerChildrenDirective,
  ParallaxDirective,
  TextRevealDirective,
} from '../../shared/animations';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-home',
  standalone: true,
  imports: [
    RouterLink,
    CarouselComponent,
    SectionShellComponent,
    ScrollRevealDirective,
    StaggerChildrenDirective,
    ParallaxDirective,
    TextRevealDirective,
    HlmButtonImports,
    HlmIconImports,
    HlmBadgeImports,
    HlmCardImports,
    HlmDialogImports,
  ],
  providers: [
    provideIcons({
      lucideCat,
      lucideChartNoAxesCombined,
      lucideChevronLeft,
      lucideChevronRight,
      lucideEye,
      lucideHeart,
      lucideHome,
      lucideShare2,
      lucideShoppingCart,
      lucideSmartphone,
      lucideStore,
      lucideTrendingUp,
      lucideUsers,
    }),
  ],
  template: `
    <!-- Banner slider -->
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
            <a [routerLink]="photo.link" class="block w-full">
              <img [src]="photo.src" [alt]="photo.alt" class="w-full block" />
            </a>
          </div>
        }
      </div>

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

      <div class="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3 z-20">
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
              [class.bg-primary/50]="currentSlide() !== $index"
              [class.ring-2]="currentSlide() === $index"
              [class.ring-white]="currentSlide() === $index"
              [class.motion-safe:animate-pulse]="currentSlide() === $index"
            ></span>
          </button>
        }
      </div>

      <svg
        class="absolute bottom-0 w-full h-16 md:h-20 pointer-events-none z-10 text-white"
        viewBox="0 0 1200 80"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          fill="currentColor"
          d="M0 20 Q75 0 150 20 T300 20 T450 20 T600 20 T750 20 T900 20 T1050 20 T1200 20 L1200 80 L0 80 Z"
        />
      </svg>
    </section>

    <!-- Productos — primera sección -->
    <app-section-shell variant="white">
      <div class="relative">
        <svg
          class="absolute -top-6 right-[5%] w-10 h-10 text-primary/10 rotate-[25deg]"
          appParallax
          [speed]="-0.3"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            d="M11.73 2.225c1.434 0 2.597 1.162 2.597 2.597 0 1.434-1.163 2.597-2.597 2.597-1.435 0-2.598-1.163-2.598-2.597s1.163-2.597 2.598-2.597zm-6.39 4.648c1.163 0 2.106.943 2.106 2.106s-.943 2.106-2.106 2.106-2.106-.943-2.106-2.106.943-2.106 2.106-2.106zm12.78 0c1.163 0 2.106.943 2.106 2.106s-.943 2.106-2.106 2.106-2.106-.943-2.106-2.106.943-2.106 2.106-2.106zM9.875 15.01c1.434 0 2.598 1.163 2.598 2.598 0 1.434-1.164 2.597-2.598 2.597-1.434 0-2.597-1.163-2.597-2.597s1.163-2.598 2.597-2.598zm4.65 0c1.434 0 2.597 1.163 2.597 2.598 0 1.434-1.163 2.597-2.597 2.597-1.435 0-2.598-1.163-2.598-2.597s1.163-2.598 2.598-2.598zM12.2 21.477c1.666 0 3.016 1.35 3.016 3.016s-1.35 3.016-3.016 3.016-3.016-1.35-3.016-3.016 1.35-3.016 3.016-3.016z"
          />
        </svg>

        <div class="text-center mb-10" appScrollReveal [y]="16" [duration]="0.5">
          <h2
            class="text-h2 font-extrabold uppercase tracking-widest text-foreground mb-1 flex items-center justify-center gap-1.5"
          >
            <ng-icon hlmIcon name="lucideStore" class="w-5 h-5 md:w-6 md:h-6" />
            <span appTextReveal splitBy="word" [duration]="0.5" [staggerDelay]="0.08"
              >Mercado Chuby</span
            >
          </h2>
          <p class="text-base md:text-lg font-bold text-muted-foreground mb-3">
            Nuestros productos
          </p>
          <a
            hlmBtn
            variant="link"
            class="text-muted-foreground hover:text-primary"
            routerLink="/tienda"
            >Ver todo →</a
          >
        </div>
      </div>

      @defer (on viewport) {
        <app-carousel [items]="productsResource.value() ?? []">
          <ng-template let-product>
            <a
              [routerLink]="['/tienda', product.slug]"
              class="group block h-full rounded-[2.5rem] overflow-hidden transition-all duration-500 ease-bounce will-change-transform hover:-translate-y-3 hover:scale-[1.02] hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.2)]"
              [style.background]="productColor(product).light"
            >
              <div class="relative flex flex-col h-full">
                <span
                  class="absolute rounded-full transition-all ease-bounce duration-[500ms] will-change-transform top-[40%] left-1/2 -translate-x-1/2 w-[300%] pb-[300%] group-hover:sm:w-[150%] group-hover:sm:top-[-25%]"
                  [style.background]="productColor(product).card"
                ></span>
                <div class="flex items-center justify-between gap-2 px-3 pt-3 relative z-10">
                  @if (product.source === 'owned') {
                    <span
                      class="text-[11px] font-bold uppercase tracking-wider rounded-full px-2.5 py-1"
                      [style.background]="productColor(product).accent + '20'"
                      [style.color]="productColor(product).accent"
                    >
                      Las Chubys
                    </span>
                  }
                  <span
                    class="text-[11px] font-bold uppercase tracking-wider rounded-full px-2.5 py-1 bg-white/70"
                    [style.color]="productColor(product).accent"
                  >
                    {{ product.tag }}
                  </span>
                </div>
                <div class="px-5 pt-5 pb-3 relative z-10 flex items-center justify-center flex-1">
                  <img
                    [src]="product.images[0] || '/images/cats/iris4.jpeg'"
                    [alt]="product.name"
                    loading="lazy"
                    class="w-full max-h-[160px] object-contain drop-shadow-sm group-hover:scale-110 group-hover:rotate-[3deg] transition-all duration-500 ease-bounce"
                  />
                </div>
                <div
                  class="relative z-10 flex flex-col items-center text-center gap-0.5 px-6 pt-5 pb-6 rounded-[1.75rem] mx-2 mb-2"
                  [style.background]="productColor(product).card"
                >
                  <p
                    class="text-sm font-bold leading-tight"
                    [style.color]="productColor(product).text"
                  >
                    {{ product.name }}
                  </p>
                  <p class="text-lg font-extrabold text-foreground">
                    {{ product.price }}
                  </p>
                </div>
              </div>
            </a>
          </ng-template>
        </app-carousel>
      } @placeholder {
        <div class="h-96"></div>
      }
    </app-section-shell>

    <!-- Wave: productos → protagonistas -->
    <div class="relative h-16 md:h-20 overflow-hidden bg-white -mb-1" aria-hidden="true">
      <svg
        class="absolute bottom-0 w-full h-full text-surface"
        viewBox="0 0 1200 80"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill="currentColor"
          d="M0 20 Q75 0 150 20 T300 20 T450 20 T600 20 T750 20 T900 20 T1050 20 T1200 20 L1200 80 L0 80 Z"
        />
      </svg>
    </div>

    <!-- Protagonistas -->
    <app-section-shell variant="warm">
      <div class="relative">
        <svg
          class="absolute -top-10 right-[10%] w-12 h-12 text-primary/10 rotate-[15deg]"
          appParallax
          [speed]="0.3"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            d="M11.73 2.225c1.434 0 2.597 1.162 2.597 2.597 0 1.434-1.163 2.597-2.597 2.597-1.435 0-2.598-1.163-2.598-2.597s1.163-2.597 2.598-2.597zm-6.39 4.648c1.163 0 2.106.943 2.106 2.106s-.943 2.106-2.106 2.106-2.106-.943-2.106-2.106.943-2.106 2.106-2.106zm12.78 0c1.163 0 2.106.943 2.106 2.106s-.943 2.106-2.106 2.106-2.106-.943-2.106-2.106.943-2.106 2.106-2.106zM9.875 15.01c1.434 0 2.598 1.163 2.598 2.598 0 1.434-1.164 2.597-2.598 2.597-1.434 0-2.597-1.163-2.597-2.597s1.163-2.598 2.597-2.598zm4.65 0c1.434 0 2.597 1.163 2.597 2.598 0 1.434-1.163 2.597-2.597 2.597-1.435 0-2.598-1.163-2.598-2.597s1.163-2.598 2.598-2.598zM12.2 21.477c1.666 0 3.016 1.35 3.016 3.016s-1.35 3.016-3.016 3.016-3.016-1.35-3.016-3.016 1.35-3.016 3.016-3.016z"
          />
        </svg>
        <svg
          class="absolute -bottom-6 left-[8%] w-10 h-10 text-primary/15 rotate-[-20deg]"
          appParallax
          [speed]="-0.2"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            d="M11.73 2.225c1.434 0 2.597 1.162 2.597 2.597 0 1.434-1.163 2.597-2.597 2.597-1.435 0-2.598-1.163-2.598-2.597s1.163-2.597 2.598-2.597zm-6.39 4.648c1.163 0 2.106.943 2.106 2.106s-.943 2.106-2.106 2.106-2.106-.943-2.106-2.106.943-2.106 2.106-2.106zm12.78 0c1.163 0 2.106.943 2.106 2.106s-.943 2.106-2.106 2.106-2.106-.943-2.106-2.106.943-2.106 2.106-2.106zM9.875 15.01c1.434 0 2.598 1.163 2.598 2.598 0 1.434-1.164 2.597-2.598 2.597-1.434 0-2.597-1.163-2.597-2.597s1.163-2.598 2.597-2.598zm4.65 0c1.434 0 2.597 1.163 2.597 2.598 0 1.434-1.163 2.597-2.597 2.597-1.435 0-2.598-1.163-2.598-2.597s1.163-2.598 2.598-2.598zM12.2 21.477c1.666 0 3.016 1.35 3.016 3.016s-1.35 3.016-3.016 3.016-3.016-1.35-3.016-3.016 1.35-3.016 3.016-3.016z"
          />
        </svg>

        <div class="text-center mb-10" appScrollReveal [y]="24" [duration]="0.6">
          <h2
            class="text-h2 font-extrabold uppercase tracking-widest text-foreground mb-2 flex items-center justify-center gap-1.5"
          >
            <ng-icon hlmIcon name="lucideCat" class="w-5 h-5 md:w-6 md:h-6" />
            <span appTextReveal splitBy="word" [duration]="0.5" [staggerDelay]="0.08"
              >Las protagonistas</span
            >
          </h2>
          <p class="text-base md:text-lg font-bold text-muted-foreground mb-3">Iris y Rubí</p>
        </div>
        <div
          class="grid grid-cols-1 md:grid-cols-2 gap-6"
          appStaggerChildren
          childSelector="article"
          [staggerDelay]="0.1"
          [duration]="0.5"
          [y]="30"
        >
          @for (cat of characters; track cat.name) {
            <article
              class="group relative overflow-hidden rounded-[2.5rem] bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div class="relative aspect-[4/3] overflow-hidden">
                <img
                  [src]="cat.image"
                  [alt]="cat.fullName"
                  loading="lazy"
                  class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div
                class="flex flex-col items-center text-center gap-1 px-6 pt-5 pb-6 rounded-[1.75rem] mx-2 mb-2 bg-white"
              >
                <h3 class="text-2xl md:text-3xl font-bold" [style.color]="catColor(cat).text">
                  {{ cat.fullName }}
                </h3>
                <span class="text-small font-semibold" [style.color]="catColor(cat).accent">{{
                  cat.role
                }}</span>
                <p class="text-body text-muted-foreground leading-relaxed">
                  {{ shortBio(cat.name) }}
                </p>
              </div>
            </article>
          }
        </div>
      </div>
    </app-section-shell>

    <!-- Wave: protagonistas → media kit -->
    <div class="relative h-16 md:h-20 overflow-hidden bg-surface -mb-1" aria-hidden="true">
      <svg
        class="absolute bottom-0 w-full h-full text-white"
        viewBox="0 0 1200 80"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill="currentColor"
          d="M0 20 Q75 0 150 20 T300 20 T450 20 T600 20 T750 20 T900 20 T1050 20 T1200 20 L1200 80 L0 80 Z"
        />
      </svg>
    </div>

    <!-- Media kit / estadísticas -->
    <app-section-shell variant="white">
      <div class="text-center mb-10" appScrollReveal [y]="24" [duration]="0.6">
        <h2
          class="text-h2 font-extrabold uppercase tracking-widest text-foreground mb-2 flex items-center justify-center gap-1.5"
        >
          <ng-icon hlmIcon name="lucideChartNoAxesCombined" class="w-5 h-5 md:w-6 md:h-6" />
          <span appTextReveal splitBy="word" [duration]="0.5" [staggerDelay]="0.08"
            >Las Chubys en cifras</span
          >
        </h2>
        <p class="text-base md:text-lg font-bold text-muted-foreground">Nuestro alcance en redes</p>
      </div>
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-8 text-center">
        @for (stat of socialStats; track stat.label) {
          <div class="flex flex-col items-center gap-2">
            <ng-icon hlmIcon [name]="stat.icon" size="xl" class="text-primary" />
            <p class="text-4xl md:text-5xl font-bold font-poppins text-foreground leading-tight">
              {{ stat.value }}
            </p>
            <p class="text-base md:text-lg font-semibold text-muted-foreground leading-snug">
              {{ stat.label }}
            </p>
          </div>
        }
      </div>
    </app-section-shell>

    <!-- La Casa Chuby -->
    <app-section-shell variant="white">
      <div class="relative">
        <svg
          class="absolute top-0 left-[5%] w-14 h-14 text-primary/8 -rotate-12"
          appParallax
          [speed]="0.4"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            d="M11.73 2.225c1.434 0 2.597 1.162 2.597 2.597 0 1.434-1.163 2.597-2.597 2.597-1.435 0-2.598-1.163-2.598-2.597s1.163-2.597 2.598-2.597zm-6.39 4.648c1.163 0 2.106.943 2.106 2.106s-.943 2.106-2.106 2.106-2.106-.943-2.106-2.106.943-2.106 2.106-2.106zm12.78 0c1.163 0 2.106.943 2.106 2.106s-.943 2.106-2.106 2.106-2.106-.943-2.106-2.106.943-2.106 2.106-2.106zM9.875 15.01c1.434 0 2.598 1.163 2.598 2.598 0 1.434-1.164 2.597-2.598 2.597-1.434 0-2.597-1.163-2.597-2.597s1.163-2.598 2.597-2.598zm4.65 0c1.434 0 2.597 1.163 2.597 2.598 0 1.434-1.163 2.597-2.597 2.597-1.435 0-2.598-1.163-2.598-2.597s1.163-2.598 2.598-2.598zM12.2 21.477c1.666 0 3.016 1.35 3.016 3.016s-1.35 3.016-3.016 3.016-3.016-1.35-3.016-3.016 1.35-3.016 3.016-3.016z"
          />
        </svg>

        <div class="text-center mb-10" appScrollReveal [y]="24" [duration]="0.6">
          <h2
            class="text-h2 font-extrabold uppercase tracking-widest text-foreground mb-2 flex items-center justify-center gap-1.5"
          >
            <ng-icon hlmIcon name="lucideHome" class="w-5 h-5 md:w-6 md:h-6" />
            <span appTextReveal splitBy="word" [duration]="0.5" [staggerDelay]="0.08"
              >El universo</span
            >
          </h2>
          <p class="text-base md:text-lg font-bold text-muted-foreground mb-3">
            {{ casaChuby.title }}
          </p>
        </div>
        <div
          class="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center"
          appScrollReveal
          [y]="24"
          [duration]="0.6"
        >
          <div>
            <p class="text-muted-foreground leading-relaxed mb-4">
              El hogar donde ocurre todo: el set de grabación permanente del reality felino más
              divertido.
            </p>
            <p class="text-base font-semibold text-foreground/80 italic">"{{ casaChuby.lema }}"</p>
            <a
              routerLink="/about"
              hlmBtn
              variant="secondary"
              class="mt-6 active:translate-y-[2px] active:shadow-none transition-all"
              >Conoce nuestra historia</a
            >
          </div>
          <div class="grid grid-cols-2 gap-3" appScrollReveal [y]="30" [duration]="0.6">
            <img
              src="/images/cats/iris2.jpeg"
              alt="Iris"
              loading="lazy"
              class="rounded-2xl shadow-md w-full h-48 object-cover hover:scale-[1.02] transition-transform duration-500"
            />
            <img
              src="/images/cats/rubi2.jpeg"
              alt="Rubí"
              loading="lazy"
              class="rounded-2xl shadow-md w-full h-48 object-cover mt-6 hover:scale-[1.02] transition-transform duration-500"
            />
            <img
              src="/images/cats/iris4.jpeg"
              alt="Iris"
              loading="lazy"
              class="rounded-2xl shadow-md w-full h-40 object-cover -mt-3 hover:scale-[1.02] transition-transform duration-500"
            />
            <img
              src="/images/cats/rubi3.jpeg"
              alt="Rubí"
              loading="lazy"
              class="rounded-2xl shadow-md w-full h-40 object-cover mt-3 hover:scale-[1.02] transition-transform duration-500"
            />
          </div>
        </div>
      </div>
    </app-section-shell>

    <!-- Product preview dialog -->
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
                <p
                  class="text-xs font-extrabold uppercase tracking-widest text-muted-foreground mb-2"
                >
                  {{ product.tag }}
                </p>
                <h2 class="text-2xl md:text-3xl font-black leading-tight text-foreground mb-2">
                  {{ product.name }}
                </h2>
                <p class="text-xl font-extrabold text-foreground">{{ product.price }}</p>
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
  private readonly toast = inject(ToastService);

  protected readonly characters = characters;
  protected readonly casaChuby = casaChuby;

  protected readonly productPalette = [
    {
      card: 'var(--color-orange-50)',
      light: '#ffffff',
      accent: 'var(--color-orange-600)',
      text: 'var(--color-orange-800)',
    },
    {
      card: 'var(--color-orange-100)',
      light: 'var(--color-orange-50)',
      accent: 'var(--color-orange-700)',
      text: 'var(--color-orange-900)',
    },
    {
      card: 'var(--color-orange-200)',
      light: 'var(--color-orange-100)',
      accent: 'var(--color-orange-600)',
      text: 'var(--color-orange-800)',
    },
    {
      card: 'var(--color-orange-100)',
      light: '#ffffff',
      accent: 'var(--color-orange-500)',
      text: 'var(--color-orange-700)',
    },
    {
      card: 'var(--color-orange-50)',
      light: 'var(--color-orange-100)',
      accent: 'var(--color-orange-700)',
      text: 'var(--color-orange-900)',
    },
    {
      card: 'var(--color-orange-200)',
      light: 'var(--color-orange-50)',
      accent: 'var(--color-orange-500)',
      text: 'var(--color-orange-800)',
    },
  ] as const;

  protected productColor(product: ProductPick): (typeof this.productPalette)[number] {
    const idx = product.id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
    return this.productPalette[idx % this.productPalette.length];
  }

  protected readonly catPalette: Record<string, { bg: string; accent: string; text: string }> = {
    Iris: {
      bg: 'var(--color-iris-bg)',
      accent: 'var(--color-iris)',
      text: 'var(--color-iris-text)',
    },
    Rubí: {
      bg: 'var(--color-rubi-bg)',
      accent: 'var(--color-rubi)',
      text: 'var(--color-rubi-text)',
    },
  };

  protected catColor(cat: (typeof this.characters)[number]): (typeof this.catPalette)['Iris'] {
    return this.catPalette[cat.name] ?? this.catPalette['Iris'];
  }

  protected readonly socialStats: readonly {
    icon: string;
    value: string;
    label: string;
  }[] = [
    { icon: 'lucideUsers', value: '+50K', label: 'Seguidores combinados' },
    { icon: 'lucideEye', value: '+2.2M', label: 'Visualizaciones en julio' },
    { icon: 'lucideSmartphone', value: '892K', label: 'Personas alcanzadas (solo Instagram)' },
    { icon: 'lucideShare2', value: '+65K', label: 'Compartidos orgánicos en julio' },
    { icon: 'lucideHeart', value: '+258K', label: 'Interacciones en julio' },
    { icon: 'lucideTrendingUp', value: '100%', label: 'Contenido orgánico — sin pauta pagada' },
  ];

  protected readonly bannerPhotos: readonly { src: string; alt: string; link: string }[] = [
    { src: '/images/banner-1.png', alt: 'Las Chubys banner 1', link: '/about' },
    { src: '/images/banner-2.png', alt: 'Las Chubys banner 2', link: '/tienda' },
    { src: '/images/banner-3.png', alt: 'Las Chubys banner 3', link: '/blog' },
    { src: '/images/banner-4.png', alt: 'Las Chubys banner 4', link: '/contact' },
  ];
  protected readonly currentSlide = signal(0);
  protected readonly autoPlayPaused = signal(false);
  private readonly sliderVisible = signal(true);
  private readonly sliderSection = viewChild.required<ElementRef<HTMLElement>>('sliderSection');
  private readonly destroyRef = inject(DestroyRef);
  private touchStartX = 0;
  private autoPlayIntervalId: number | null = null;
  protected readonly selectedProduct = signal<ProductPick | null>(null);
  protected readonly productsResource = resource({
    loader: async () => (await this.content.getProducts()).slice(0, 6),
  });

  constructor() {
    this.seo.setPage(
      'Las Chubys',
      'Iris, Rubí y su universo editorial felino. Reality y parodias felinas desde la Casa Chuby.',
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

  protected shortBio(name: string): string {
    const map: Record<string, string> = {
      Iris: 'Elegante, manipuladora y dramática. La reina de la casa.',
      Rubí: 'Impulsiva, curiosa y divertida. La dueña del caos.',
    };
    return map[name] ?? '';
  }

  protected shortSeries(title: string): string {
    const map: Record<string, string> = {
      'Comité de Gatos Asociados (CGA)':
        'Iris y Rubí deliberan sobre asuntos domésticos con solemnidad absurda.',
      'Noticias Chubys': 'Parodia de noticiero que reporta los eventos de la casa.',
      'Expedientes Chubys': 'True crime sobre incidentes domésticos triviales.',
      'Diario de Karen y Karencio': 'Karen y Karencio documentan su día a día.',
      'Talleres Chubys': 'Aprende siesta, maullido estratégico y dominación del hogar.',
      'Parodias Chubys': 'Parodias de cultura pop adaptadas al universo felino.',
      'Michi Terapia': 'Consultorio emocional para traumas domésticos.',
      'Método MIAU': 'Self-help felino: ronroneo, siesta e indiferencia.',
    };
    return map[title] ?? '';
  }

  protected addToCart(product: ProductPick) {
    this.cart.addItem(product);
    this.toast.show(`${product.name} agregado al carrito`, 'success');
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
