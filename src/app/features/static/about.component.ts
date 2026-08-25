import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { provideIcons } from '@ng-icons/core';
import {
  lucideBookOpen,
  lucideCamera,
  lucideCat,
  lucideClapperboard,
  lucideFilm,
  lucideHome,
  lucideInstagram,
  lucidePencil,
  lucideSearch,
  lucideSofa,
  lucideSparkles,
  lucideTv,
  lucideUser,
  lucideUsers,
} from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
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
import { SectionShellComponent } from '../../shared/ui/section-shell/section-shell.component';
import { productPalette } from '../../shared/ui/product-visuals';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-about',
  standalone: true,
  imports: [
    RouterLink,
    HlmButtonImports,
    HlmIconImports,
    ScrollRevealDirective,
    ParallaxDirective,
    StaggerChildrenDirective,
    TextRevealDirective,
    SectionShellComponent,
  ],
  providers: [
    provideIcons({
      lucideBookOpen,
      lucideCamera,
      lucideCat,
      lucideClapperboard,
      lucideFilm,
      lucideHome,
      lucideInstagram,
      lucidePencil,
      lucideSearch,
      lucideSofa,
      lucideSparkles,
      lucideTv,
      lucideUser,
      lucideUsers,
    }),
  ],
  template: `
    <!-- Header band -->
    <section class="relative bg-surface overflow-hidden" aria-labelledby="about-title">
      <div class="relative max-w-6xl mx-auto px-4 pt-10 pb-24 md:pt-12 md:pb-28">
        <svg
          class="absolute top-6 right-[5%] w-10 h-10 text-primary/10 rotate-[25deg]"
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

        <div class="text-center" appScrollReveal [y]="24" [duration]="0.6">
          <h1
            id="about-title"
            class="text-h2 font-extrabold uppercase tracking-widest text-foreground mb-2 flex items-center justify-center gap-1.5"
          >
            <ng-icon hlmIcon name="lucideCat" class="w-5 h-5 md:w-6 md:h-6" />
            <span appTextReveal splitBy="word" [duration]="0.5" [staggerDelay]="0.08"
              >Dos gatas. Dos humanas. Un universo.</span
            >
          </h1>
          <p class="text-base md:text-lg font-bold text-muted-foreground">
            Bienvenidos a la Casa Chuby
          </p>
        </div>
      </div>

      <!-- Wave: header → universo -->
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

    <!-- El universo / intro -->
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
        <div class="max-w-2xl mx-auto text-center" appScrollReveal [y]="24" [duration]="0.6">
          <p class="text-base md:text-lg text-foreground leading-relaxed mb-6">
            Las Chubys es un reality show y sitcom parodia protagonizada por gatos. No es una cuenta
            de mascotas: es una franquicia con lore, personajes con arcos propios y un mundo
            coherente donde cada publicación funciona como un nuevo episodio.
          </p>
          <p class="text-base md:text-lg text-foreground leading-relaxed mb-6">
            La casa está habitada por dos hermanas gatas completamente opuestas —Iris y Rubí— y sus
            dos humanas subordinadas, Karen y Karencio, quienes conviven (y sobreviven) al caos
            diario que las gatas convierten en drama épico.
          </p>
          <p class="text-body text-muted-foreground leading-relaxed mb-4">
            {{ casaChuby.description }}
          </p>
          <p class="text-base font-semibold text-foreground/80 italic">"{{ casaChuby.lema }}"</p>
        </div>

        <div class="relative z-10 max-w-3xl mx-auto mt-12 md:mt-16">
          <div class="relative h-[320px] md:h-[420px]">
            <img
              src="/images/cats/iris.jpeg"
              alt="Iris, la Reina de la Casa Chuby"
              loading="eager"
              appParallax
              [speed]="-0.25"
              class="absolute top-0 left-0 w-[68%] h-[85%] object-cover rounded-[2.5rem] shadow-xl"
            />
            <img
              src="/images/cats/rubi.jpeg"
              alt="Rubí, la Defensora del caos"
              loading="eager"
              appParallax
              [speed]="0.2"
              class="absolute bottom-0 right-0 w-[52%] h-[62%] object-cover rounded-[2.5rem] shadow-xl border-[6px] border-surface"
            />
          </div>
        </div>

        <div class="flex flex-wrap items-center justify-center gap-4 mt-12">
          <a routerLink="/contact" hlmBtn>Escríbenos</a>
          <a
            [href]="socialChannels[0].href"
            target="_blank"
            rel="noopener"
            hlmBtn
            variant="outline"
          >
            <ng-icon hlmIcon name="lucideInstagram" class="w-4 h-4" />
            Síguenos en Instagram
          </a>
        </div>
      </div>
    </app-section-shell>

    <!-- Wave: universo → protagonistas -->
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

    <!-- Las Protagonistas -->
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
              class="group relative overflow-hidden rounded-[2.5rem] bg-white transition-all duration-500 ease-bounce hover:-translate-y-3 hover:shadow-xl"
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
                class="flex flex-col items-center text-center gap-2 px-6 pt-5 pb-6 rounded-[1.75rem] mx-2 mb-2"
                [style.background]="catVisual(cat).card"
              >
                <h3 class="text-2xl md:text-3xl font-bold" [style.color]="catVisual(cat).text">
                  {{ cat.fullName }}
                </h3>
                <span class="text-small font-semibold" [style.color]="catVisual(cat).accent">
                  {{ cat.archetype }} — {{ cat.role }}
                </span>
                <p class="text-base text-muted-foreground leading-relaxed">{{ cat.bio }}</p>
                <p class="text-base font-semibold text-foreground/80">{{ cat.personality }}</p>
                <p class="text-sm italic text-muted-foreground/70">{{ cat.rolNarrativo }}</p>
              </div>
            </article>
          }
        </div>
      </div>
    </app-section-shell>

    <!-- Wave: protagonistas → humanas -->
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

    <!-- El staff humano -->
    <app-section-shell variant="white">
      <div class="text-center mb-10" appScrollReveal [y]="24" [duration]="0.6">
        <h2
          class="text-h2 font-extrabold uppercase tracking-widest text-foreground mb-2 flex items-center justify-center gap-1.5"
        >
          <ng-icon hlmIcon name="lucideUsers" class="w-5 h-5 md:w-6 md:h-6" />
          <span appTextReveal splitBy="word" [duration]="0.5" [staggerDelay]="0.08"
            >El staff humano</span
          >
        </h2>
        <p class="text-base md:text-lg font-bold text-muted-foreground mb-3">Karen y Karencio</p>
      </div>
      <div
        class="grid grid-cols-1 md:grid-cols-2 gap-6"
        appStaggerChildren
        childSelector="article"
        [staggerDelay]="0.1"
        [duration]="0.5"
        [y]="30"
      >
        @for (human of humans; track human.name) {
          <article
            class="group relative overflow-hidden rounded-[2.5rem] bg-white border border-border transition-all duration-500 ease-bounce hover:-translate-y-3 hover:shadow-xl"
          >
            <div
              class="flex flex-col items-center text-center gap-2 px-6 pt-8 pb-8 rounded-[1.75rem] m-2 bg-human-bg"
            >
              <ng-icon hlmIcon name="lucideUser" class="w-8 h-8 text-human" />
              <h3 class="text-2xl md:text-3xl font-bold text-human-text">{{ human.name }}</h3>
              <span class="text-small font-semibold text-human">{{ human.role }}</span>
              <p class="text-base text-muted-foreground leading-relaxed">
                {{ human.personality }}
              </p>
              <p class="text-sm italic text-muted-foreground/70">{{ human.rolNarrativo }}</p>
            </div>
          </article>
        }
      </div>
    </app-section-shell>

    <!-- Wave: humanas → series -->
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

    <!-- Series / Formatos -->
    @defer (on viewport) {
      <app-section-shell variant="warm">
        <div class="relative">
          <svg
            class="absolute -top-6 left-[5%] w-10 h-10 text-primary/10 rotate-[25deg]"
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

          <div class="text-center mb-10" appScrollReveal [y]="24" [duration]="0.6">
            <h2
              class="text-h2 font-extrabold uppercase tracking-widest text-foreground mb-2 flex items-center justify-center gap-1.5"
            >
              <ng-icon hlmIcon name="lucideTv" class="w-5 h-5 md:w-6 md:h-6" />
              <span appTextReveal splitBy="word" [duration]="0.5" [staggerDelay]="0.08"
                >Las series</span
              >
            </h2>
            <p class="text-base md:text-lg font-bold text-muted-foreground mb-3">
              Ocho formatos, un solo universo
            </p>
          </div>
          <div
            class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
            appStaggerChildren
            childSelector="article"
            [staggerDelay]="0.06"
            [duration]="0.5"
            [y]="30"
          >
            @for (s of chubySeries; track s.title) {
              <article
                class="group rounded-[2.5rem] p-6 transition-all duration-500 ease-bounce hover:-translate-y-2 hover:shadow-xl cursor-default"
                [class]="s.color"
              >
                <ng-icon hlmIcon [name]="s.icon" class="w-7 h-7 block mb-3" />
                <p class="text-xs font-bold uppercase tracking-wider opacity-70 mb-1">
                  {{ s.subtitle }}
                </p>
                <h3 class="text-base font-bold mb-2 leading-snug">{{ s.title }}</h3>
                <p class="text-xs leading-relaxed opacity-80">{{ s.description }}</p>
              </article>
            }
          </div>
        </div>
      </app-section-shell>
    } @placeholder {
      <div class="h-96 bg-surface" aria-hidden="true"></div>
    }

    <!-- Wave: series → galería -->
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

    <!-- Galería -->
    @defer (on viewport) {
      <app-section-shell variant="white">
        <div class="text-center mb-10" appScrollReveal [y]="24" [duration]="0.6">
          <h2
            class="text-h2 font-extrabold uppercase tracking-widest text-foreground mb-2 flex items-center justify-center gap-1.5"
          >
            <ng-icon hlmIcon name="lucideCamera" class="w-5 h-5 md:w-6 md:h-6" />
            <span appTextReveal splitBy="word" [duration]="0.5" [staggerDelay]="0.08"
              >Momentos</span
            >
          </h2>
          <p class="text-base md:text-lg font-bold text-muted-foreground mb-3">
            La vida en la Casa Chuby
          </p>
        </div>
        <div
          class="columns-2 md:columns-3 gap-4 space-y-4"
          appStaggerChildren
          childSelector="figure"
          [staggerDelay]="0.08"
          [duration]="0.5"
          [y]="30"
        >
          @for (photo of galleryPhotos; track photo) {
            <figure class="break-inside-avoid rounded-2xl overflow-hidden shadow-md">
              <img
                [src]="photo"
                alt="Momento de Las Chubys"
                loading="lazy"
                class="w-full h-auto object-cover hover:scale-105 transition-transform duration-500"
              />
            </figure>
          }
        </div>
      </app-section-shell>
    } @placeholder {
      <div class="h-96 bg-white" aria-hidden="true"></div>
    }

    <!-- Wave: galería → CTA -->
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

    <!-- CTA -->
    @defer (on viewport) {
      <app-section-shell variant="warm">
        <div class="relative">
          <svg
            class="absolute -top-4 right-[12%] w-14 h-14 text-primary/8 -rotate-12"
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

          <div
            class="max-w-2xl mx-auto text-center"
            appScrollReveal
            [y]="35"
            [duration]="0.7"
            [scale]="0.98"
          >
            <h2
              class="text-h2 font-extrabold uppercase tracking-widest text-foreground mb-2 flex items-center justify-center gap-1.5"
            >
              <ng-icon hlmIcon name="lucideSparkles" class="w-5 h-5 md:w-6 md:h-6" />
              <span appTextReveal splitBy="word" [duration]="0.5" [staggerDelay]="0.08"
                >¿Quieres ser parte del Comité?</span
              >
            </h2>
            <p class="text-base md:text-lg font-bold text-muted-foreground mb-3">
              Únete al CGA — Comité de Gatos Asociados
            </p>
            <p class="text-body text-muted-foreground leading-relaxed mb-8">
              Marcas, contenido, fotografía y todo lo que tenga que ver con gatas.
            </p>
            <a routerLink="/contact" hlmBtn class="animate-subtle-pulse">Contáctanos</a>
          </div>
        </div>
      </app-section-shell>
    } @placeholder {
      <div class="h-64 bg-surface" aria-hidden="true"></div>
    }
  `,
  styles: [
    `
      @keyframes subtle-pulse {
        0%,
        100% {
          box-shadow: 0 0 0 0 color-mix(in oklab, var(--color-orange-400) 45%, transparent);
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

  protected readonly characters = characters;
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

  protected readonly productPalette = productPalette;

  protected catVisual(cat: (typeof this.characters)[number]) {
    const idx = cat.name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
    return productPalette[idx % productPalette.length];
  }

  constructor() {
    this.seo.setPage(
      'Nosotras | Las Chubys',
      'Conoce a Iris, Rubí y el universo de la Casa Chuby. El reality y sitcom felino más divertido de Ecuador.',
      '/images/cats/iris.jpeg',
      '/about',
    );
  }
}
