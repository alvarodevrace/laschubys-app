import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';

import { personas, serviceHighlights, socialChannels } from '../../core/content/site-content';
import { SeoService } from '../../core/services/seo.service';
import {
  ScrollRevealDirective,
  ParallaxDirective,
  StaggerChildrenDirective,
  TextRevealDirective,
} from '../../shared/animations';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-about',
  standalone: true,
  imports: [
    RouterLink,
    ScrollRevealDirective,
    ParallaxDirective,
    StaggerChildrenDirective,
    TextRevealDirective,
  ],
  template: `
    <!-- Hero -->
    <section class="relative bg-orange-light overflow-hidden" aria-labelledby="about-title">
      <div
        class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center pt-10 pb-20 md:pt-12 md:pb-28"
      >
        <nav
          class="col-span-full flex items-center gap-2 mb-6 text-sm text-gray-500"
          aria-label="Breadcrumb"
        >
          <a routerLink="/">Inicio</a>
          <span>›</span>
          <span>Nosotras</span>
        </nav>

        <div class="max-w-xl z-10" appScrollReveal [y]="30" [duration]="0.7">
          <p class="inline-block text-xs font-extrabold uppercase tracking-widest text-orange mb-4">
            Bienvenidos a nuestra casa
          </p>
          <h1
            id="about-title"
            class="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] text-dark mb-5"
          >
            <span class="block" appTextReveal [duration]="0.6" [staggerDelay]="0.06"
              >Dos gatas.</span
            >
            <span class="block" appTextReveal [duration]="0.6" [staggerDelay]="0.06"
              >Una mamá.</span
            >
            <span class="block" appTextReveal [duration]="0.6" [staggerDelay]="0.06"
              >Un universo.</span
            >
          </h1>
          <p class="text-base md:text-lg text-gray-600 leading-relaxed mb-8">
            Las Chubys nació de una casa llena de pelos, siestas y zoomies. Hoy somos una comunidad
            de cat moms que celebra el caos elegante de convivir con michis.
          </p>
          <div class="flex flex-wrap items-center gap-4">
            <a
              routerLink="/contact"
              class="inline-flex items-center justify-center min-h-12 px-7 rounded-full font-extrabold text-sm tracking-wide border border-transparent bg-orange text-white cursor-pointer transition-all duration-200 hover:bg-orange-dark hover:-translate-y-px hover:shadow-[0_8px_20px_rgba(255,122,26,0.3)]"
            >
              Escríbenos
            </a>
            <a
              [href]="socialChannels[0].href"
              target="_blank"
              rel="noopener"
              class="inline-flex items-center justify-center min-h-12 px-7 rounded-full font-extrabold text-sm tracking-wide border-2 border-orange/30 bg-white text-orange cursor-pointer transition-all duration-200 hover:bg-orange hover:text-white hover:border-orange hover:-translate-y-px"
            >
              Síguenos en Instagram
            </a>
          </div>
        </div>

        <div class="relative z-10">
          <div class="relative h-[380px] md:h-[480px]">
            <img
              src="/images/cats/iris.jpeg"
              alt="Iris, la gata seria de Las Chubys"
              loading="eager"
              appParallax
              [speed]="-0.25"
              class="absolute top-0 left-0 w-[72%] h-[82%] object-cover rounded-[2rem] shadow-[0_24px_60px_rgba(0,0,0,0.14)]"
            />
            <img
              src="/images/cats/rubi.jpeg"
              alt="Rubi, la gata revoltosa de Las Chubys"
              loading="eager"
              appParallax
              [speed]="0.2"
              class="absolute bottom-0 right-0 w-[58%] h-[58%] object-cover rounded-[2rem] shadow-[0_24px_60px_rgba(0,0,0,0.14)] border-[6px] border-orange-light"
            />
          </div>
        </div>
      </div>

      <svg
        class="absolute bottom-0 left-0 w-full h-[70px] md:h-[100px]"
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path d="M0,64 C288,120 720,0 1440,64 L1440,120 L0,120 Z" fill="#ffffff"></path>
      </svg>
    </section>

    <!-- Protagonistas -->
    <section class="py-16 md:py-24 bg-white" aria-labelledby="cats-title">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <header class="text-center mb-12 md:mb-16" appScrollReveal [y]="30" [duration]="0.6">
          <p class="text-xs font-extrabold uppercase tracking-widest text-orange mb-2">
            Las protagonistas
          </p>
          <h2 id="cats-title" class="text-3xl md:text-4xl font-extrabold tracking-tight text-dark">
            Conoce a Iris y Rubi
          </h2>
        </header>

        <div
          class="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8"
          appStaggerChildren
          childSelector="article"
          [staggerDelay]="0.12"
          [duration]="0.6"
          [y]="40"
        >
          @for (cat of cats; track cat.name) {
            <article
              class="group relative rounded-[2rem] overflow-hidden bg-surface shadow-sm hover:shadow-[0_20px_50px_rgba(255,122,26,0.14)] transition-all duration-300 hover:-translate-y-1"
            >
              <div class="relative aspect-[4/3] overflow-hidden">
                <img
                  [src]="cat.image"
                  [alt]="'Foto de ' + cat.name"
                  loading="lazy"
                  class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div
                  class="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                ></div>
              </div>
              <div class="p-6 md:p-8">
                <p class="text-xs font-extrabold uppercase tracking-widest text-orange mb-1">
                  {{ cat.role }}
                </p>
                <h3 class="text-2xl font-extrabold text-dark mb-2">{{ cat.name }}</h3>
                <p class="text-gray-600 leading-relaxed">{{ cat.accent }}</p>
              </div>
            </article>
          }
        </div>
      </div>
    </section>

    <!-- Historia -->
    <section class="py-16 md:py-24 bg-white" aria-labelledby="story-title">
      <div
        class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center"
      >
        <div
          class="order-2 lg:order-1"
          appScrollReveal
          [x]="-50"
          [duration]="0.7"
          [easing]="'easeOut'"
        >
          <p class="text-xs font-extrabold uppercase tracking-widest text-orange mb-2">
            La historia
          </p>
          <h2
            id="story-title"
            class="text-3xl md:text-4xl font-extrabold tracking-tight text-dark mb-5"
          >
            De dos gatas a una marca
          </h2>
          <div class="space-y-4 text-gray-600 leading-relaxed mb-8">
            <p>
              Todo empezó con dos gatas de carácter único y una humana que no paraba de sacarles
              fotos. Iris ponía el drama. Rubi ponía el caos. Entre ronroneos y madrugadas, nació
              Las Chubys: un espacio para compartir lo bonito, lo divertido y lo útil de vivir con
              michis.
            </p>
            <p>
              Hoy creamos contenido, recomendamos productos y diseñamos experiencias pensadas para
              cat moms como tú: personas que saben que una casa con gatos es más feliz, más peluda y
              mucho menos aburrida.
            </p>
          </div>
          <a
            routerLink="/contact"
            class="inline-flex items-center justify-center min-h-12 px-7 rounded-full font-extrabold text-sm tracking-wide border border-transparent bg-orange text-white cursor-pointer transition-all duration-200 hover:bg-orange-dark hover:-translate-y-px hover:shadow-[0_8px_20px_rgba(255,122,26,0.3)]"
          >
            Cuéntanos tu historia
          </a>
        </div>
        <div
          class="order-1 lg:order-2"
          appScrollReveal
          [x]="50"
          [duration]="0.7"
          [easing]="'easeOut'"
        >
          <img
            src="/images/cats/iris3.jpeg"
            alt="Iris y Rubi en casa"
            loading="lazy"
            class="w-full rounded-[2rem] shadow-[0_24px_60px_rgba(0,0,0,0.12)]"
          />
        </div>
      </div>
    </section>

    <!-- Servicios -->
    @defer (on viewport) {
      <section class="py-16 md:py-24 bg-surface" aria-labelledby="services-title">
        <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <header class="text-center mb-12 md:mb-16" appScrollReveal [y]="30" [duration]="0.6">
            <p class="text-xs font-extrabold uppercase tracking-widest text-orange mb-2">
              Lo que hacemos
            </p>
            <h2
              id="services-title"
              class="text-3xl md:text-4xl font-extrabold tracking-tight text-dark"
            >
              Servicios con aroma a gato
            </h2>
          </header>

          <div
            class="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8"
            appStaggerChildren
            childSelector="article"
            [staggerDelay]="0.1"
            [duration]="0.55"
            [y]="35"
          >
            @for (service of services; track service.title) {
              <article
                class="bg-white rounded-[1.5rem] p-7 md:p-8 shadow-sm hover:shadow-[0_16px_40px_rgba(255,122,26,0.12)] transition-all duration-300 hover:-translate-y-1 text-center"
              >
                <span class="text-4xl mb-4 block">{{ serviceIcons[$index] }}</span>
                <h3 class="text-xl font-extrabold text-dark mb-2">{{ service.title }}</h3>
                <p class="text-gray-600 leading-relaxed text-sm">{{ service.body }}</p>
              </article>
            }
          </div>
        </div>
      </section>
    } @placeholder {
      <div class="h-48 bg-surface" aria-hidden="true"></div>
    }

    <!-- Galería -->
    @defer (on viewport) {
      <section class="py-16 md:py-24 bg-white" aria-labelledby="gallery-title">
        <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <header class="text-center mb-12 md:mb-16" appScrollReveal [y]="30" [duration]="0.6">
            <p class="text-xs font-extrabold uppercase tracking-widest text-orange mb-2">
              Momentos
            </p>
            <h2
              id="gallery-title"
              class="text-3xl md:text-4xl font-extrabold tracking-tight text-dark"
            >
              La vida en cuatro patas
            </h2>
          </header>

          <div
            class="columns-2 md:columns-3 gap-4 space-y-4"
            appStaggerChildren
            childSelector="figure"
            [staggerDelay]="0.08"
            [duration]="0.5"
            [y]="30"
          >
            @for (photo of galleryPhotos; track photo) {
              <figure class="break-inside-avoid rounded-2xl overflow-hidden shadow-sm">
                <img
                  [src]="photo"
                  alt="Momento de Las Chubys"
                  loading="lazy"
                  class="w-full h-auto object-cover hover:scale-105 transition-transform duration-500"
                />
              </figure>
            }
          </div>
        </div>
      </section>
    } @placeholder {
      <div class="h-48 bg-white" aria-hidden="true"></div>
    }

    <!-- CTA -->
    @defer (on viewport) {
      <section class="py-16 md:py-24 bg-surface" aria-labelledby="cta-title">
        <div
          class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
          appScrollReveal
          [y]="35"
          [duration]="0.7"
          [scale]="0.98"
        >
          <h2
            id="cta-title"
            class="text-3xl md:text-4xl font-extrabold tracking-tight text-dark mb-4"
          >
            ¿Quieres colaborar con nosotras?
          </h2>
          <p class="text-gray-600 leading-relaxed mb-8 md:text-lg">
            Marcas, contenido, fotografía y todo lo que tenga que ver con gatas.
          </p>
          <a
            routerLink="/contact"
            class="inline-flex items-center justify-center min-h-12 px-7 rounded-full font-extrabold text-sm tracking-wide border border-transparent bg-orange text-white cursor-pointer transition-all duration-200 hover:bg-orange-dark hover:-translate-y-px hover:shadow-[0_8px_20px_rgba(255,122,26,0.3)] animate-subtle-pulse"
          >
            Contáctanos
          </a>
        </div>
      </section>
    } @placeholder {
      <div class="h-40 bg-surface" aria-hidden="true"></div>
    }
  `,
  styles: [
    `
      @keyframes subtle-pulse {
        0%,
        100% {
          box-shadow: 0 0 0 0 rgba(255, 122, 26, 0.35);
        }
        50% {
          box-shadow: 0 0 0 10px rgba(255, 122, 26, 0);
        }
      }

      .animate-subtle-pulse {
        animation: subtle-pulse 2.5s ease-in-out infinite;
      }

      @media (prefers-reduced-motion: reduce) {
        .animate-subtle-pulse {
          animation: none;
        }
      }
    `,
  ],
})
export class AboutComponent {
  private readonly seo = inject(SeoService);

  protected readonly cats = personas;
  protected readonly services = serviceHighlights;
  protected readonly socialChannels = socialChannels;
  protected readonly serviceIcons = ['🐾', '📸', '✨'];
  protected readonly galleryPhotos = [
    '/images/cats/iris2.jpeg',
    '/images/cats/rubi2.jpeg',
    '/images/cats/iris4.jpeg',
    '/images/cats/rubi3.jpeg',
    '/images/cats/rubi4.jpeg',
  ];

  constructor() {
    this.seo.setPage(
      'Nosotras | Las Chubys',
      'Conoce a Iris, Rubi y el universo de Las Chubys. La biografía más linda de gatas que vas a leer.',
      '/images/cats/iris.jpeg',
      '/about',
    );
  }
}
