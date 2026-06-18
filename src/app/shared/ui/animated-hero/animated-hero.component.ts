import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  numberAttribute,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';

import { ButtonComponent } from '../button/button.component';
import { ParallaxDirective, ScrollRevealDirective, TextRevealDirective } from '../../animations';

/**
 * Hero section with parallax background, text reveal and animated CTA.
 *
 * - SSR-safe: directives only run in the browser.
 * - Respects `prefers-reduced-motion` through the animation directives and
 *   Tailwind `motion-safe:` variants.
 */
@Component({
  selector: 'app-animated-hero',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonComponent, ParallaxDirective, ScrollRevealDirective, TextRevealDirective],
  template: `
    <section
      class="relative flex min-h-[70vh] h-[85vh] max-h-[900px] items-center justify-center overflow-hidden"
    >
      <div
        class="absolute inset-0 bg-cover bg-center bg-no-repeat"
        [style.background-image]="'url(' + backgroundImage() + ')'"
        appParallax
        [speed]="parallaxSpeed()"
        aria-hidden="true"
      ></div>

      <div
        class="absolute inset-0 bg-gradient-to-t from-dark/80 via-dark/50 to-dark/30"
        aria-hidden="true"
      ></div>

      <div
        class="relative z-10 mx-auto flex max-w-4xl flex-col items-center px-4 text-center text-white"
      >
        <h1
          class="mb-4 text-4xl font-extrabold leading-tight md:text-6xl lg:text-7xl"
          appTextReveal
        >
          {{ title() }}
        </h1>

        @if (subtitle()) {
          <p class="mb-8 max-w-2xl text-lg opacity-90 md:text-xl" appScrollReveal [delay]="0.2">
            {{ subtitle() }}
          </p>
        }

        @if (ctaText()) {
          <div appScrollReveal [delay]="0.4">
            <app-button
              [variant]="'primary'"
              [size]="'lg'"
              [className]="'motion-safe:hover:-translate-y-1 motion-safe:transition-transform'"
              (click)="onCtaClick()"
            >
              {{ ctaText() }}
            </app-button>
          </div>
        }
      </div>
    </section>
  `,
})
export class AnimatedHeroComponent {
  readonly backgroundImage = input<string>('');
  readonly title = input<string>('');
  readonly subtitle = input<string | undefined>(undefined);
  readonly ctaText = input<string | undefined>(undefined);
  readonly ctaLink = input<string | undefined>(undefined);
  readonly parallaxSpeed = input(-0.3, { transform: numberAttribute });

  private readonly router = inject(Router);
  private readonly platformId = inject(PLATFORM_ID);

  protected onCtaClick(): void {
    const link = this.ctaLink();
    if (!link) {
      return;
    }

    if (link.startsWith('http')) {
      if (isPlatformBrowser(this.platformId)) {
        window.open(link, '_blank', 'noopener,noreferrer');
      }
      return;
    }

    void this.router.navigate([link]);
  }
}
