import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { provideIcons } from '@ng-icons/core';
import { lucideBookOpen, lucideImage } from '@ng-icons/lucide';

import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmBreadcrumbImports } from '@spartan-ng/helm/breadcrumb';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmIconImports } from '@spartan-ng/helm/icon';

import { serviceHighlights } from '../../core/content/site-content';
import { SeoService } from '../../core/services/seo.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-servicios',
  standalone: true,
  imports: [RouterLink, HlmButtonImports, HlmBreadcrumbImports, HlmCardImports, HlmIconImports],
  providers: [provideIcons({ lucideBookOpen, lucideImage })],
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
              <span hlmBreadcrumbPage>Servicios</span>
            </li>
          </ol>
        </nav>
        <h1
          class="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight text-primary mb-2"
        >
          Nuestros Servicios
        </h1>
        <p class="text-muted-foreground max-w-2xl">
          Elevando el estilo de vida felino a través de experiencias diseñadas por el equipo de Las
          Chubys.
        </p>
      </div>
    </section>

    <section class="services-preview" data-reveal>
      <div class="max-w-6xl mx-auto px-4">
        <div class="flex items-end justify-between gap-4 mb-6">
          <div>
            <p class="text-xs font-extrabold uppercase tracking-widest text-primary mb-1">
              Experiencias
            </p>
            <h2 class="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground">
              Nuestros Servicios
            </h2>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          @for (item of serviceHighlights; track item.title; let i = $index) {
            <hlm-card class="text-center">
              <div
                class="w-12 h-12 rounded-xl flex items-center justify-center text-xl mb-5 bg-primary/[0.12] text-primary"
              >
                @if (i === 0) {
                  <ng-icon hlmIcon name="lucideBookOpen" class="w-5 h-5" />
                } @else if (i === 1) {
                  <ng-icon hlmIcon name="lucideImage" class="w-5 h-5" />
                } @else {
                  <ng-icon hlmIcon name="lucideBookOpen" class="w-5 h-5" />
                }
              </div>
              <h3 class="text-lg font-extrabold mb-3 text-foreground">{{ item.title }}</h3>
              <p class="text-sm text-muted-foreground leading-relaxed mb-6">{{ item.body }}</p>
              <a routerLink="/contact" hlmBtn variant="link">Consultar →</a>
            </hlm-card>
          }
        </div>
      </div>
    </section>
  `,
})
export class ServiciosComponent {
  private readonly seo = inject(SeoService);
  protected readonly serviceHighlights = serviceHighlights;

  constructor() {
    this.seo.setPage(
      'Servicios | Las Chubys',
      'Servicios y colaboraciones editoriales del universo Las Chubys.',
      '/images/cats/iris3.jpeg',
      '/servicios',
    );
  }
}
