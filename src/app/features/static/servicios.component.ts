import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { provideIcons } from '@ng-icons/core';
import { lucideClapperboard, lucideFilm, lucideSofa, lucideTv } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmBreadcrumbImports } from '@spartan-ng/helm/breadcrumb';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmIconImports } from '@spartan-ng/helm/icon';

import { chubySeries } from '../../core/content/site-content';
import { SeoService } from '../../core/services/seo.service';
import { ScrollRevealDirective, StaggerChildrenDirective } from '../../shared/animations';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-servicios',
  standalone: true,
  imports: [
    RouterLink,
    HlmButtonImports,
    HlmBreadcrumbImports,
    HlmCardImports,
    HlmIconImports,
    ScrollRevealDirective,
    StaggerChildrenDirective,
  ],
  providers: [
    provideIcons({
      lucideClapperboard,
      lucideFilm,
      lucideSofa,
      lucideTv,
    }),
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
              <span hlmBreadcrumbPage>Series</span>
            </li>
          </ol>
        </nav>
        <h1 class="text-h1 text-primary mb-2">Nuestras Series</h1>
        <p class="text-muted-foreground max-w-2xl">
          Ocho formatos que conforman el universo de Las Chubys. Cada publicación es un nuevo
          episodio.
        </p>
      </div>
    </section>

    <section class="pb-16" data-reveal>
      <div class="max-w-6xl mx-auto px-4">
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

    <section class="py-16 bg-surface">
      <div class="max-w-3xl mx-auto px-4 text-center" appScrollReveal [y]="24" [duration]="0.6">
        <h2 class="text-h2 mb-4">¿Quieres formar parte del universo?</h2>
        <p class="text-muted-foreground leading-relaxed mb-8">
          El público puede unirse al Comité de Gatos Asociados (CGA), una extensión participativa
          del lore hacia los seguidores.
        </p>
        <a routerLink="/contact" hlmBtn>Únete al CGA</a>
      </div>
    </section>
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
