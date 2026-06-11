import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';

import { serviceHighlights } from '../../core/content/site-content';
import { SeoService } from '../../core/services/seo.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-servicios',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="page-hero" data-reveal>
      <div class="page-hero__inner">
        <nav class="breadcrumb" aria-label="Breadcrumb">
          <a routerLink="/">Inicio</a>
          <span>›</span>
          <span>Servicios</span>
        </nav>
        <h1 class="page-hero__title">Nuestros Servicios</h1>
        <p class="page-hero__sub">
          Elevando el estilo de vida felino a través de experiencias diseñadas por el equipo de Las
          Chubys.
        </p>
      </div>
    </section>

    <section class="services-preview" data-reveal>
      <div class="page-wrap">
        <div class="section-header">
          <div>
            <p class="section-eyebrow">Experiencias</p>
            <h2 class="section-heading">Nuestros Servicios</h2>
          </div>
        </div>

        <div class="services-grid">
          @for (item of serviceHighlights; track item.title; let i = $index) {
            <div class="service-card">
              <div class="service-card__icon">
                @if (i === 0) {
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.9"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                    <path d="M9 7h6"></path>
                    <path d="M9 11h6"></path>
                    <path d="M9 15h4"></path>
                  </svg>
                } @else if (i === 1) {
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.9"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    aria-hidden="true"
                  >
                    <rect x="3" y="5" width="18" height="14" rx="2"></rect>
                    <circle cx="8" cy="10" r="1.5"></circle>
                    <path d="m3 17 5-5 4 4 3-3 6 6"></path>
                  </svg>
                } @else {
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.9"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                    <path d="M9 7h6"></path>
                  </svg>
                }
              </div>
              <h3 class="service-card__title">{{ item.title }}</h3>
              <p class="service-card__desc">{{ item.body }}</p>
              <a routerLink="/contact" class="service-card__link">Consultar →</a>
            </div>
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
