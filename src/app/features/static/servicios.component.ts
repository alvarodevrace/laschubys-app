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
    <section class="py-10 pb-8" data-reveal>
      <div class="max-w-6xl mx-auto px-4">
        <nav class="flex items-center gap-2 mb-4 text-sm text-gray-500" aria-label="Breadcrumb">
          <a routerLink="/">Inicio</a>
          <span>›</span>
          <span>Servicios</span>
        </nav>
        <h1
          class="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight text-gray-900 mb-2"
        >
          Nuestros Servicios
        </h1>
        <p class="text-gray-500 max-w-2xl">
          Elevando el estilo de vida felino a través de experiencias diseñadas por el equipo de Las
          Chubys.
        </p>
      </div>
    </section>

    <section class="services-preview" data-reveal>
      <div class="max-w-6xl mx-auto px-4">
        <div class="flex items-end justify-between gap-4 mb-6">
          <div>
            <p class="text-xs font-extrabold uppercase tracking-widest text-orange mb-1">
              Experiencias
            </p>
            <h2 class="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900">
              Nuestros Servicios
            </h2>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          @for (item of serviceHighlights; track item.title; let i = $index) {
            <div
              class="bg-white border border-gray-200 p-8 rounded-lg transition-all duration-300 hover:-translate-y-1 hover:border-orange hover:shadow-[0_10px_30px_rgba(0,0,0,0.08)]"
            >
              <div
                class="w-12 h-12 rounded-xl flex items-center justify-center text-xl mb-5 bg-orange/[0.12] text-[#ff7a1a]"
              >
                @if (i === 0) {
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.9"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    aria-hidden="true"
                    class="w-5 h-5"
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
                    class="w-5 h-5"
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
                    class="w-5 h-5"
                  >
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                    <path d="M9 7h6"></path>
                  </svg>
                }
              </div>
              <h3 class="text-lg font-extrabold mb-3 text-gray-900">{{ item.title }}</h3>
              <p class="text-sm text-gray-500 leading-relaxed mb-6">{{ item.body }}</p>
              <a routerLink="/contact" class="text-xs font-bold uppercase tracking-wide text-orange"
                >Consultar →</a
              >
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
