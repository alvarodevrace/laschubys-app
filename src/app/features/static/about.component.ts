import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { provideIcons } from '@ng-icons/core';
import {
  lucideCamera,
  lucideCrown,
  lucideFlame,
  lucideHome,
  lucideTv,
  lucideUser,
  lucideUsers,
} from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmBreadcrumbImports } from '@spartan-ng/helm/breadcrumb';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmIconImports } from '@spartan-ng/helm/icon';

import {
  characters,
  humans,
  chubySeries,
  casaChuby,
  socialChannels,
} from '../../core/content/site-content';
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
    HlmButtonImports,
    HlmBreadcrumbImports,
    HlmCardImports,
    HlmIconImports,
    ScrollRevealDirective,
    ParallaxDirective,
    StaggerChildrenDirective,
    TextRevealDirective,
  ],
  providers: [
    provideIcons({
      lucideCamera,
      lucideCrown,
      lucideFlame,
      lucideHome,
      lucideTv,
      lucideUser,
      lucideUsers,
    }),
  ],
  template: `
    <!-- Hero -->
    <section class="relative bg-surface overflow-hidden" aria-labelledby="about-title">
      <div
        class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center pt-10 pb-20 md:pt-12 md:pb-28"
      >
        <nav class="col-span-full mb-4" hlmBreadcrumb aria-label="Breadcrumb">
          <ol hlmBreadcrumbList>
            <li hlmBreadcrumbItem>
              <a hlmBreadcrumbLink [link]="['/']">Inicio</a>
            </li>
            <li hlmBreadcrumbSeparator></li>
            <li hlmBreadcrumbItem>
              <span hlmBreadcrumbPage>Nosotras</span>
            </li>
          </ol>
        </nav>

        <div class="max-w-xl z-10" appScrollReveal [y]="30" [duration]="0.7">
          <p
            class="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-widest text-primary mb-4"
          >
            <ng-icon hlmIcon name="lucideHome" class="w-4 h-4" />
            <span>Bienvenidos a la Casa Chuby</span>
          </p>
          <h1
            id="about-title"
            class="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] text-dark mb-5"
          >
            <span class="block" appTextReveal [duration]="0.6" [staggerDelay]="0.06"
              >Dos gatas.</span
            >
            <span class="block" appTextReveal [duration]="0.6" [staggerDelay]="0.06"
              >Dos humanas.</span
            >
            <span class="block" appTextReveal [duration]="0.6" [staggerDelay]="0.06"
              >Un universo.</span
            >
          </h1>
          <p class="text-base md:text-lg text-muted-foreground leading-relaxed mb-8">
            Las Chubys es un reality show y sitcom parodia protagonizada por gatos. No es una cuenta
            de mascotas: es una franquicia con lore, personajes con arcos propios y un mundo
            coherente donde cada publicación funciona como un nuevo episodio.
          </p>
          <p class="text-base md:text-lg text-muted-foreground leading-relaxed mb-8">
            La casa está habitada por dos hermanas gatas completamente opuestas —Iris y Rubí— y sus
            dos humanas subordinadas, Karen y Karencio, quienes conviven (y sobreviven) al caos
            diario que las gatas convierten en drama épico.
          </p>
          <div class="flex flex-wrap items-center gap-4">
            <a routerLink="/contact" hlmBtn>Escríbenos</a>
            <a
              [href]="socialChannels[0].href"
              target="_blank"
              rel="noopener"
              hlmBtn
              variant="outline"
            >
              Síguenos en Instagram
            </a>
          </div>
        </div>

        <div class="relative z-10">
          <div class="relative h-[380px] md:h-[480px]">
            <img
              src="/images/cats/iris.jpeg"
              alt="Iris, la Reina de la Casa Chuby"
              loading="eager"
              appParallax
              [speed]="-0.25"
              class="absolute top-0 left-0 w-[72%] h-[82%] object-cover rounded-[2rem] shadow-xl"
            />
            <img
              src="/images/cats/rubi.jpeg"
              alt="Rubí, la Defensora del caos"
              loading="eager"
              appParallax
              [speed]="0.2"
              class="absolute bottom-0 right-0 w-[58%] h-[58%] object-cover rounded-[2rem] shadow-xl border-[6px] border-surface"
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

    <!-- La Casa Chuby -->
    <section class="py-16 md:py-24 bg-white" aria-labelledby="casa-title">
      <div
        class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
        appScrollReveal
        [y]="30"
        [duration]="0.6"
      >
        <p
          class="text-xs font-extrabold uppercase tracking-widest text-primary mb-2 flex items-center justify-center gap-1.5"
        >
          <ng-icon hlmIcon name="lucideHome" class="w-4 h-4" />
          <span>El universo</span>
        </p>
        <h2 id="casa-title" class="text-h1 mb-6">{{ casaChuby.title }}</h2>
        <p class="text-muted-foreground leading-relaxed text-lg max-w-2xl mx-auto mb-4">
          {{ casaChuby.description }}
        </p>
        <p class="text-base font-semibold text-foreground/60 italic">"{{ casaChuby.lema }}"</p>
      </div>
    </section>

    <!-- Iris -->
    <section class="py-16 md:py-24 bg-surface" aria-labelledby="iris-title">
      <div
        class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center"
      >
        <div appScrollReveal [x]="-40" [duration]="0.7">
          <img
            src="/images/cats/iris3.jpeg"
            alt="Iris Lourdes"
            loading="lazy"
            class="w-full rounded-[2rem] shadow-xl"
          />
        </div>
        <div appScrollReveal [x]="40" [duration]="0.7">
          <ng-icon hlmIcon name="lucideCrown" class="w-8 h-8 mb-3 text-primary" />
          <p class="text-xs font-extrabold uppercase tracking-widest text-primary mb-1">
            {{ irisData.archetype }} — {{ irisData.role }}
          </p>
          <h2 id="iris-title" class="text-h1 mb-4">{{ irisData.fullName }}</h2>
          <div class="space-y-4 text-muted-foreground leading-relaxed">
            <p>{{ irisData.bio }}</p>
            <p class="font-semibold text-foreground/80">{{ irisData.personality }}</p>
            <p class="text-sm italic">{{ irisData.rolNarrativo }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Rubí -->
    <section class="py-16 md:py-24 bg-white" aria-labelledby="rubi-title">
      <div
        class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center"
      >
        <div class="order-2 lg:order-1" appScrollReveal [x]="-40" [duration]="0.7">
          <ng-icon hlmIcon name="lucideFlame" class="w-8 h-8 mb-3 text-primary" />
          <p class="text-xs font-extrabold uppercase tracking-widest text-primary mb-1">
            {{ rubiData.archetype }} — {{ rubiData.role }}
          </p>
          <h2 id="rubi-title" class="text-h1 mb-4">{{ rubiData.fullName }}</h2>
          <div class="space-y-4 text-muted-foreground leading-relaxed">
            <p>{{ rubiData.bio }}</p>
            <p class="font-semibold text-foreground/80">{{ rubiData.personality }}</p>
            <p class="text-sm italic">{{ rubiData.rolNarrativo }}</p>
          </div>
        </div>
        <div class="order-1 lg:order-2" appScrollReveal [x]="40" [duration]="0.7">
          <img
            src="/images/cats/rubi4.jpeg"
            alt="Rubí Lucrecia"
            loading="lazy"
            class="w-full rounded-[2rem] shadow-xl"
          />
        </div>
      </div>
    </section>

    <!-- Humanas -->
    <section class="py-16 md:py-24 bg-surface" aria-labelledby="humans-title">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <header class="text-center mb-12" appScrollReveal [y]="24" [duration]="0.6">
          <p
            class="text-xs font-extrabold uppercase tracking-widest text-primary mb-2 flex items-center justify-center gap-1.5"
          >
            <ng-icon hlmIcon name="lucideUsers" class="w-4 h-4" />
            <span>El staff humano</span>
          </p>
          <h2 id="humans-title" class="text-h1 mb-3">Karen y Karencio</h2>
          <p class="text-muted-foreground max-w-xl mx-auto">
            Las subordinadas humanas que conviven (y sobreviven) al caos de la Casa Chuby.
          </p>
        </header>

        <div
          class="grid grid-cols-1 md:grid-cols-2 gap-6"
          appStaggerChildren
          childSelector="article"
          [staggerDelay]="0.1"
          [duration]="0.5"
          [y]="24"
        >
          @for (human of humans; track human.name) {
            <article hlmCard class="border-t-[3px] border-orange-500">
              <div hlmCardHeader>
                <ng-icon hlmIcon name="lucideUser" class="w-7 h-7 text-muted-foreground/60" />
                <h3 hlmCardTitle>{{ human.name }}</h3>
                <p hlmCardDescription>{{ human.role }}</p>
              </div>
              <div hlmCardContent>
                <p class="text-body text-muted-foreground leading-relaxed mb-3">
                  {{ human.personality }}
                </p>
                <p class="text-body italic text-muted-foreground/70">{{ human.rolNarrativo }}</p>
              </div>
            </article>
          }
        </div>
      </div>
    </section>

    <!-- Series / Formatos -->
    @defer (on viewport) {
      <section class="py-16 md:py-24 bg-white" aria-labelledby="series-title">
        <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <header class="text-center mb-12" appScrollReveal [y]="24" [duration]="0.6">
            <p
              class="text-xs font-extrabold uppercase tracking-widest text-primary mb-2 flex items-center justify-center gap-1.5"
            >
              <ng-icon hlmIcon name="lucideTv" class="w-4 h-4" />
              <span>Las series</span>
            </p>
            <h2 id="series-title" class="text-h1 mb-3">Formatos del universo Chuby</h2>
            <p class="text-muted-foreground max-w-xl mx-auto">
              Cada contenido de Las Chubys pertenece a una de estas series recurrentes. Ocho
              formatos, un solo universo.
            </p>
          </header>

          <div
            class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
            appStaggerChildren
            childSelector="article"
            [staggerDelay]="0.06"
            [duration]="0.5"
            [y]="24"
          >
            @for (s of chubySeries; track s.title) {
              <article
                class="group rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg cursor-default"
                [class]="s.color"
              >
                <ng-icon hlmIcon [name]="s.icon" class="w-7 h-7 block mb-3 text-foreground/70" />
                <p class="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                  {{ s.subtitle }}
                </p>
                <h3 class="text-base font-bold text-foreground mb-2 leading-snug">{{ s.title }}</h3>
                <p class="text-xs text-muted-foreground leading-relaxed">{{ s.description }}</p>
              </article>
            }
          </div>
        </div>
      </section>
    } @placeholder {
      <div class="h-48 bg-white" aria-hidden="true"></div>
    }

    <!-- Galería -->
    @defer (on viewport) {
      <section class="py-16 md:py-24 bg-surface" aria-labelledby="gallery-title">
        <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <header class="text-center mb-12" appScrollReveal [y]="30" [duration]="0.6">
            <p
              class="text-xs font-extrabold uppercase tracking-widest text-primary mb-2 flex items-center justify-center gap-1.5"
            >
              <ng-icon hlmIcon name="lucideCamera" class="w-4 h-4" />
              <span>Momentos</span>
            </p>
            <h2 id="gallery-title" class="text-h1 mb-3">La vida en la Casa Chuby</h2>
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
      <div class="h-48 bg-surface" aria-hidden="true"></div>
    }

    <!-- CTA -->
    @defer (on viewport) {
      <section class="py-16 md:py-24 bg-white" aria-labelledby="cta-title">
        <div
          class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
          appScrollReveal
          [y]="35"
          [duration]="0.7"
          [scale]="0.98"
        >
          <h2 id="cta-title" class="text-h1 mb-4">¿Quieres ser parte del Comité?</h2>
          <p class="text-muted-foreground leading-relaxed mb-8 md:text-lg">
            Únete al CGA (Comité de Gatos Asociados). Marcas, contenido, fotografía y todo lo que
            tenga que ver con gatas.
          </p>
          <a routerLink="/contact" hlmBtn class="animate-subtle-pulse">Contáctanos</a>
        </div>
      </section>
    } @placeholder {
      <div class="h-40 bg-white" aria-hidden="true"></div>
    }
  `,
  styles: [
    `
      @keyframes subtle-pulse {
        0%,
        100% {
          box-shadow: 0 0 0 0 rgba(251, 191, 36, 0.45);
        }
        50% {
          box-shadow: 0 0 0 10px rgba(251, 191, 36, 0);
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

  protected readonly irisData = characters[0];
  protected readonly rubiData = characters[1];
  protected readonly humans = humans;
  protected readonly chubySeries = chubySeries;
  protected readonly casaChuby = casaChuby;
  protected readonly socialChannels = socialChannels;
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
      'Conoce a Iris, Rubí y el universo de la Casa Chuby. El reality y sitcom felino más divertido de Ecuador.',
      '/images/cats/iris.jpeg',
      '/about',
    );
  }
}
