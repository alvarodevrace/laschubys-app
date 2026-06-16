import { Component, inject, resource, ChangeDetectionStrategy } from '@angular/core';

import { SeoService } from '../../core/services/seo.service';
import { ButtonComponent } from '../../shared/ui/button/button.component';
import { CardComponent } from '../../shared/ui/card/card.component';
import { BadgeComponent } from '../../shared/ui/badge/badge.component';
import { MediaKitService } from './media-kit.service';
import { MediaKitData } from './media-kit.model';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-media-kit',
  standalone: true,
  imports: [ButtonComponent, CardComponent, BadgeComponent],
  template: `
    @if (mediaKitResource.isLoading()) {
      <div class="min-h-[60vh] grid place-items-center bg-[#fff4e8]">
        <div class="grid gap-3 text-center">
          <div
            class="w-10 h-10 border-4 border-orange/30 border-t-orange rounded-full animate-spin mx-auto"
            aria-hidden="true"
          ></div>
          <p class="text-sm text-gray-500">Cargando media kit...</p>
        </div>
      </div>
    }

    @if (mediaKitResource.error(); as error) {
      <div class="min-h-[60vh] grid place-items-center bg-[#fff4e8] px-4">
        <div class="max-w-md text-center grid gap-4">
          <p class="text-gray-900 font-bold">No pudimos cargar el media kit</p>
          <p class="text-sm text-gray-500">
            {{ error.message || 'Intenta de nuevo en unos segundos.' }}
          </p>
          <div class="flex justify-center">
            <app-button type="button" (click)="mediaKitResource.reload()">Reintentar</app-button>
          </div>
        </div>
      </div>
    }

    @if (mediaKitResource.value(); as data) {
      <main>
        <!-- Hero -->
        <section class="bg-[#fff4e8] py-12 md:py-20">
          <div class="max-w-6xl mx-auto px-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
              <div class="order-2 md:order-1">
                <app-badge variant="default" size="md" className="mb-4">{{
                  data.hero.pill
                }}</app-badge>
                <h1
                  class="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight text-[#141313] mb-4"
                >
                  {{ data.hero.title }}
                </h1>
                <p class="text-base md:text-lg text-gray-600 leading-relaxed mb-6 max-w-lg">
                  {{ data.hero.subtitle }}
                </p>
                <div class="flex flex-wrap gap-3">
                  <a [href]="data.hero.ctaDownload.href">
                    <app-button size="lg" type="button">
                      <svg
                        class="w-5 h-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        aria-hidden="true"
                      >
                        <path
                          d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
                        />
                        <polyline points="22,6 12,13 2,6" />
                      </svg>
                      {{ data.hero.ctaDownload.label }}
                    </app-button>
                  </a>
                  <a [href]="data.hero.ctaWrite.href">
                    <app-button variant="secondary" size="lg" type="button">
                      {{ data.hero.ctaWrite.label }}
                    </app-button>
                  </a>
                </div>
              </div>

              <div class="order-1 md:order-2">
                <div
                  class="relative rounded-[32px] overflow-hidden shadow-[0_24px_60px_rgba(255,122,26,0.18)]"
                >
                  <img
                    [src]="data.hero.image"
                    [alt]="data.hero.imageAlt"
                    class="w-full aspect-[4/5] object-cover"
                    loading="eager"
                  />
                  <div
                    class="absolute bottom-0 inset-x-0 h-1/3 bg-gradient-to-t from-black/40 to-transparent"
                    aria-hidden="true"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Stats -->
        <section class="py-12 md:py-16 bg-white">
          <div class="max-w-6xl mx-auto px-4">
            <div class="text-center mb-8 md:mb-10">
              <p class="text-xs font-extrabold uppercase tracking-widest text-orange mb-1">
                Números
              </p>
              <h2 class="text-2xl md:text-3xl font-extrabold tracking-tight text-[#141313]">
                Alcance y engagement
              </h2>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              @for (metric of data.metrics; track metric.network) {
                <a [href]="metric.href" target="_blank" rel="noreferrer" class="block group">
                  <app-card variant="elevated" padding="lg" className="h-full">
                    <div class="grid gap-1">
                      <p class="text-sm font-bold text-orange">{{ metric.network }}</p>
                      <p class="text-3xl md:text-4xl font-extrabold text-[#141313]">
                        {{ metric.value }}
                      </p>
                      <p class="text-sm text-gray-500">{{ metric.label }}</p>
                      @if (metric.engagement) {
                        <p class="text-xs font-medium text-gray-400 mt-1">
                          Engagement {{ metric.engagement }}
                        </p>
                      }
                    </div>
                  </app-card>
                </a>
              }
            </div>
          </div>
        </section>

        <!-- About -->
        <section class="py-12 md:py-16 bg-gray-50">
          <div class="max-w-6xl mx-auto px-4">
            <div class="text-center mb-8 md:mb-10">
              <p class="text-xs font-extrabold uppercase tracking-widest text-orange mb-1">
                Nosotros
              </p>
              <h2 class="text-2xl md:text-3xl font-extrabold tracking-tight text-[#141313]">
                {{ data.about.headline }}
              </h2>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-12">
              <div>
                <p class="text-gray-600 leading-relaxed text-base md:text-lg">
                  {{ data.about.story }}
                </p>
              </div>
              <div class="grid grid-cols-2 gap-4">
                <img
                  src="/images/cats/iris.jpeg"
                  alt="Iris"
                  loading="lazy"
                  class="w-full aspect-[3/4] object-cover rounded-2xl"
                />
                <img
                  src="/images/cats/rubi.jpeg"
                  alt="Rubi"
                  loading="lazy"
                  class="w-full aspect-[3/4] object-cover rounded-2xl mt-6"
                />
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              @for (member of data.about.team; track member.name) {
                <app-card variant="bordered" padding="md" className="h-full">
                  <img
                    [src]="member.image"
                    [alt]="member.name"
                    loading="lazy"
                    class="w-full aspect-square object-cover rounded-xl mb-3"
                  />
                  <p class="text-xs font-extrabold uppercase tracking-wide text-orange mb-0.5">
                    {{ member.role }}
                  </p>
                  <h3 class="text-base font-extrabold text-[#141313] mb-1">{{ member.name }}</h3>
                  <p class="text-sm text-gray-500 leading-relaxed">{{ member.bio }}</p>
                </app-card>
              }
            </div>
          </div>
        </section>

        <!-- Audience -->
        <section class="py-12 md:py-16 bg-white">
          <div class="max-w-6xl mx-auto px-4">
            <div class="text-center mb-8 md:mb-10">
              <p class="text-xs font-extrabold uppercase tracking-widest text-orange mb-1">
                Audiencia
              </p>
              <h2 class="text-2xl md:text-3xl font-extrabold tracking-tight text-[#141313]">
                ¿A quién llegamos?
              </h2>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
              @for (segment of data.audience.segments; track segment.title) {
                <app-card variant="elevated" padding="lg" className="h-full">
                  <div
                    class="w-11 h-11 rounded-xl bg-orange/10 text-orange inline-flex items-center justify-center mb-3"
                  >
                    @switch (segment.icon) {
                      @case ('heart') {
                        <svg
                          class="w-6 h-6"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          aria-hidden="true"
                        >
                          <path
                            d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                          />
                        </svg>
                      }
                      @case ('users') {
                        <svg
                          class="w-6 h-6"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          aria-hidden="true"
                        >
                          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                          <circle cx="9" cy="7" r="4" />
                          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>
                      }
                      @default {
                        <svg
                          class="w-6 h-6"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          aria-hidden="true"
                        >
                          <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                        </svg>
                      }
                    }
                  </div>
                  <h3 class="text-lg font-extrabold text-[#141313] mb-1">{{ segment.title }}</h3>
                  <p class="text-sm text-gray-500 leading-relaxed">{{ segment.description }}</p>
                </app-card>
              }
            </div>

            <div class="bg-[#fff4e8] rounded-2xl p-6 md:p-8">
              <h3 class="text-lg font-extrabold text-[#141313] mb-4">Demografía principal</h3>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                @for (item of data.audience.demographics; track item.label) {
                  <div class="text-center">
                    <p class="text-2xl md:text-3xl font-extrabold text-orange">{{ item.value }}</p>
                    <p class="text-sm font-bold text-[#141313]">{{ item.label }}</p>
                    <p class="text-xs text-gray-500">{{ item.detail }}</p>
                  </div>
                }
              </div>
            </div>
          </div>
        </section>

        <!-- Content -->
        <section class="py-12 md:py-16 bg-gray-50">
          <div class="max-w-6xl mx-auto px-4">
            <div class="text-center mb-8 md:mb-10">
              <p class="text-xs font-extrabold uppercase tracking-widest text-orange mb-1">
                Contenido
              </p>
              <h2 class="text-2xl md:text-3xl font-extrabold tracking-tight text-[#141313]">
                Formatos que funcionan
              </h2>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              @for (item of data.content; track item.title) {
                <article class="group rounded-2xl overflow-hidden bg-white border border-gray-200">
                  <div class="relative aspect-[4/5] overflow-hidden">
                    <img
                      [src]="item.image"
                      [alt]="item.title"
                      loading="lazy"
                      class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div
                      class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"
                      aria-hidden="true"
                    ></div>
                    <div class="absolute bottom-0 left-0 right-0 p-4 text-white">
                      <p class="text-xs font-extrabold uppercase tracking-wide opacity-90">
                        {{ item.metric }}
                      </p>
                      <h3 class="text-lg font-extrabold">{{ item.title }}</h3>
                    </div>
                  </div>
                </article>
              }
            </div>
          </div>
        </section>

        <!-- Services -->
        <section class="py-12 md:py-16 bg-white">
          <div class="max-w-6xl mx-auto px-4">
            <div class="text-center mb-8 md:mb-10">
              <p class="text-xs font-extrabold uppercase tracking-widest text-orange mb-1">
                Servicios
              </p>
              <h2 class="text-2xl md:text-3xl font-extrabold tracking-tight text-[#141313]">
                ¿Qué podemos crear juntos?
              </h2>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              @for (service of data.services; track service.name) {
                <app-card variant="bordered" padding="lg" className="h-full">
                  <h3 class="text-lg font-extrabold text-[#141313] mb-2">{{ service.name }}</h3>
                  <p class="text-sm text-gray-500 leading-relaxed mb-4">
                    {{ service.description }}
                  </p>
                  <ul class="grid gap-2">
                    @for (item of service.deliverables; track item) {
                      <li class="flex items-start gap-2 text-sm text-gray-600">
                        <svg
                          class="w-5 h-5 text-orange flex-shrink-0 mt-0.5"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          aria-hidden="true"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        {{ item }}
                      </li>
                    }
                  </ul>
                </app-card>
              }
            </div>
          </div>
        </section>

        <!-- Final CTA -->
        <section id="contacto" class="py-16 md:py-24 bg-[#141313]">
          <div class="max-w-4xl mx-auto px-4 text-center">
            <h2 class="text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-4">
              Hagamos algo juntos
            </h2>
            <p class="text-gray-300 mb-8 max-w-xl mx-auto">
              Cuéntanos tu idea, producto o campaña. Armamos una propuesta a la medida de tu marca.
            </p>
            <div class="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a [href]="'mailto:' + data.contact.email">
                <app-button size="lg" type="button">
                  <svg
                    class="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    aria-hidden="true"
                  >
                    <path
                      d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
                    />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                  {{ data.contact.email }}
                </app-button>
              </a>
              <a [href]="data.contact.whatsapp" target="_blank" rel="noreferrer">
                <app-button variant="secondary" size="lg" type="button">
                  <svg
                    class="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    aria-hidden="true"
                  >
                    <path
                      d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"
                    />
                  </svg>
                  {{ data.contact.whatsappLabel }}
                </app-button>
              </a>
            </div>
          </div>
        </section>
      </main>
    }
  `,
})
export class MediaKitComponent {
  private readonly seo = inject(SeoService);
  protected readonly mediaKitService = inject(MediaKitService);

  protected readonly mediaKitResource = resource<MediaKitData, unknown>({
    loader: async () => this.mediaKitService.getMediaKit(),
  });

  constructor() {
    this.seo.setPage(
      'Media Kit | Las Chubys',
      'Descubre el alcance, audiencia, servicios y tarifas de Las Chubys para colaboraciones con marcas en Ecuador y LATAM.',
      '/images/cats/iris2.jpeg',
      '/media-kit',
    );
  }
}
