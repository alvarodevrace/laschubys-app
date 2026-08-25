import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { provideIcons } from '@ng-icons/core';
import {
  lucideBookOpen,
  lucideClapperboard,
  lucideFilm,
  lucidePencil,
  lucideSearch,
  lucideSofa,
  lucideSparkles,
  lucideTv,
} from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmIconImports } from '@spartan-ng/helm/icon';

import { chubySeries } from '../../core/content/site-content';
import { SeoService } from '../../core/services/seo.service';
import {
  ScrollRevealDirective,
  ParallaxDirective,
  StaggerChildrenDirective,
  TextRevealDirective,
} from '../../shared/animations';
import { SectionShellComponent } from '../../shared/ui/section-shell/section-shell.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-servicios',
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
      lucideClapperboard,
      lucideFilm,
      lucidePencil,
      lucideSearch,
      lucideSofa,
      lucideSparkles,
      lucideTv,
    }),
  ],
  template: `
    <!-- Header band -->
    <section class="relative bg-surface overflow-hidden" aria-labelledby="servicios-title">
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
            id="servicios-title"
            class="text-h2 font-extrabold uppercase tracking-widest text-foreground mb-2 flex items-center justify-center gap-1.5"
          >
            <ng-icon hlmIcon name="lucideTv" class="w-5 h-5 md:w-6 md:h-6" />
            <span appTextReveal splitBy="word" [duration]="0.5" [staggerDelay]="0.08"
              >Nuestras series</span
            >
          </h1>
          <p class="text-base md:text-lg font-bold text-muted-foreground">
            Ocho formatos, un solo universo — cada publicación es un nuevo episodio
          </p>
        </div>
      </div>

      <!-- Wave: header → series -->
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

    <!-- Series -->
    <app-section-shell variant="white">
      <div class="text-center mb-10" appScrollReveal [y]="24" [duration]="0.6">
        <h2
          class="text-h2 font-extrabold uppercase tracking-widest text-foreground mb-2 flex items-center justify-center gap-1.5"
        >
          <ng-icon hlmIcon name="lucideTv" class="w-5 h-5 md:w-6 md:h-6" />
          <span appTextReveal splitBy="word" [duration]="0.5" [staggerDelay]="0.08"
            >Nuestras series</span
          >
        </h2>
        <p class="text-base md:text-lg font-bold text-muted-foreground mb-3">
          Ocho formatos, un solo universo — cada publicación es un nuevo episodio
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
    </app-section-shell>

    <!-- Wave: series → CTA -->
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
              >¿Quieres formar parte del universo?</span
            >
          </h2>
          <p class="text-base md:text-lg font-bold text-muted-foreground mb-3">
            Únete al CGA — Comité de Gatos Asociados
          </p>
          <p class="text-body text-muted-foreground leading-relaxed mb-8">
            Una extensión participativa del lore hacia los seguidores.
          </p>
          <a routerLink="/contact" hlmBtn>Únete al CGA</a>
        </div>
      </div>
    </app-section-shell>
  `,
})
export class ServiciosComponent {
  private readonly seo = inject(SeoService);
  protected readonly chubySeries = chubySeries;

  constructor() {
    this.seo.setPage(
      'Series | Las Chubys',
      'Descubre las 8 series del universo Las Chubys: CGA, Noticias Chubys, Expedientes Chubys y más.',
      '/images/cats/iris3.jpeg',
      '/servicios',
    );
  }
}
