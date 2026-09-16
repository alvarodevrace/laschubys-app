import { Component, inject, resource, ChangeDetectionStrategy } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import {
  lucideAlertCircle,
  lucideHeart,
  lucideMail,
  lucideMessageCircle,
  lucideUsers,
} from '@ng-icons/lucide';

import { HlmAlertImports } from '@spartan-ng/helm/alert';
import { HlmBadgeImports } from '@spartan-ng/helm/badge';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmSkeletonImports } from '@spartan-ng/helm/skeleton';
import { HlmSpinner } from '@spartan-ng/helm/spinner';

import { SeoService } from '../../core/services/seo.service';
import { MediaKitService } from './media-kit.service';
import { MediaKitData, MediaKitPdfNetwork } from './media-kit.model';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-media-kit',
  standalone: true,
  imports: [
    HlmAlertImports,
    HlmBadgeImports,
    HlmButtonImports,
    HlmCardImports,
    HlmIconImports,
    HlmSkeletonImports,
    HlmSpinner,
  ],
  providers: [
    provideIcons({
      lucideAlertCircle,
      lucideHeart,
      lucideMail,
      lucideMessageCircle,
      lucideUsers,
    }),
  ],
  template: `
    @if (mediaKitResource.isLoading()) {
      <div class="min-h-[60vh] grid place-items-center bg-surface">
        <div class="grid gap-3 text-center">
          <hlm-spinner class="mx-auto" />
          <p class="text-sm text-muted-foreground">Cargando media kit...</p>
        </div>
      </div>
    }

    @if (mediaKitResource.error(); as error) {
      <div class="min-h-[60vh] grid place-items-center bg-surface px-4">
        <div class="max-w-md w-full">
          <div hlmAlert variant="destructive">
            <ng-icon hlmIcon name="lucideAlertCircle" class="w-4 h-4" />
            <h4 hlmAlertTitle>No pudimos cargar el media kit</h4>
            <p hlmAlertDescription>
              {{ error.message || 'Intenta de nuevo en unos segundos.' }}
            </p>
          </div>
          <div class="flex justify-center mt-4">
            <button hlmBtn type="button" (click)="mediaKitResource.reload()">Reintentar</button>
          </div>
        </div>
      </div>
    }

    @if (mediaKitResource.value(); as data) {
      <main>
        <!-- 01 · Portada -->
        <section class="bg-surface py-12 md:py-20">
          <div class="max-w-6xl mx-auto px-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
              <div>
                <span hlmBadge class="mb-4">Media Kit</span>
                <h1
                  class="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight text-stone-950 mb-4"
                >
                  {{ data.cover?.title || 'Las Chubys · Media Kit' }}
                </h1>
                <p class="text-base md:text-lg text-muted-foreground leading-relaxed mb-6 max-w-lg">
                  {{ data.cover?.subtitle || data.hero.subtitle }}
                </p>
                <div class="flex flex-wrap gap-3">
                  <a href="#metricas" hlmBtn size="lg"> Ver métricas </a>
                  <a [href]="'mailto:' + data.contact.email" hlmBtn variant="outline" size="lg">
                    <ng-icon hlmIcon name="lucideMail" class="w-5 h-5" />
                    Escríbenos
                  </a>
                </div>
              </div>

              <div>
                <div class="grid grid-cols-2 gap-4">
                  <img
                    src="/images/cats/iris.jpeg"
                    alt="Iris"
                    loading="eager"
                    class="w-full aspect-[4/5] object-cover rounded-[32px] shadow-xl"
                  />
                  <img
                    src="/images/cats/rubi.jpeg"
                    alt="Rubi"
                    loading="lazy"
                    class="w-full aspect-[4/5] object-cover rounded-[32px] shadow-xl mt-8"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- 02 · Métricas (por red social, con logo) -->
        <section id="metricas" class="py-12 md:py-16 bg-white">
          <div class="max-w-6xl mx-auto px-4">
            <div class="text-center mb-8 md:mb-10">
              <p class="text-xs font-extrabold uppercase tracking-widest text-primary mb-1">
                Nuestros números
              </p>
              <h2 class="text-2xl md:text-3xl font-extrabold tracking-tight text-stone-950">
                Audiencia en redes
              </h2>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              @for (net of socialNetworks(data); track net.name) {
                <a [href]="net.href || '#'" target="_blank" rel="noreferrer" class="block group">
                  <hlm-card class="h-full p-0 overflow-hidden">
                    <div class="flex items-center justify-between p-4 border-b border-border">
                      <span class="text-sm font-extrabold text-stone-950">{{ net.name }}</span>
                      <span class="flex-shrink-0">
                        @switch (net.name.toLowerCase()) {
                          @case ('instagram') {
                            <svg
                              width="26"
                              height="26"
                              viewBox="0 0 24 24"
                              fill="none"
                              aria-hidden="true"
                            >
                              <rect
                                x="2"
                                y="2"
                                width="20"
                                height="20"
                                rx="5.5"
                                fill="url(#instaGrad)"
                              />
                              <circle
                                cx="12"
                                cy="12"
                                r="4"
                                stroke="#fff"
                                stroke-width="1.8"
                                fill="none"
                              />
                              <circle cx="17.2" cy="6.8" r="1.4" fill="#fff" />
                              <defs>
                                <linearGradient id="instaGrad" x1="0" y1="0" x2="24" y2="24">
                                  <stop stop-color="#feda75" />
                                  <stop offset="0.5" stop-color="#d62976" />
                                  <stop offset="1" stop-color="#962fbf" />
                                </linearGradient>
                              </defs>
                            </svg>
                          }
                          @case ('facebook') {
                            <svg
                              width="26"
                              height="26"
                              viewBox="0 0 24 24"
                              fill="#1877f2"
                              aria-hidden="true"
                            >
                              <path
                                d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.9h2.54V9.85c0-2.52 1.5-3.91 3.78-3.91 1.09 0 2.24.2 2.24.2v2.47H15.2c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.45 2.9h-2.33V22c4.78-.76 8.43-4.92 8.43-9.94Z"
                              />
                            </svg>
                          }
                          @case ('tiktok') {
                            <svg
                              width="26"
                              height="26"
                              viewBox="0 0 24 24"
                              fill="#000"
                              aria-hidden="true"
                            >
                              <path
                                d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1Z"
                              />
                            </svg>
                          }
                          @default {
                            <ng-icon hlmIcon name="lucideHeart" class="w-6 h-6" />
                          }
                        }
                      </span>
                    </div>
                    <div class="grid gap-1 p-4">
                      <p class="text-xs font-medium text-muted-foreground">{{ net.handle }}</p>
                      <p class="text-3xl md:text-4xl font-extrabold text-stone-950">
                        {{ net.followers }}
                      </p>
                      <p class="text-xs font-bold text-primary">Seguidores</p>
                      <div class="grid grid-cols-3 gap-2 mt-3 border-t border-border pt-3">
                        <div class="text-center">
                          <p class="text-sm font-extrabold text-stone-950">{{ net.engagement }}</p>
                          <p class="text-[10px] uppercase tracking-wide text-muted-foreground">
                            Engagement
                          </p>
                        </div>
                        <div class="text-center">
                          <p class="text-sm font-extrabold text-stone-950">
                            {{ net.reachMonthly }}
                          </p>
                          <p class="text-[10px] uppercase tracking-wide text-muted-foreground">
                            Alcance/mes
                          </p>
                        </div>
                        <div class="text-center">
                          <p class="text-sm font-extrabold text-stone-950">
                            {{ net.viewsMonthly }}
                          </p>
                          <p class="text-[10px] uppercase tracking-wide text-muted-foreground">
                            Vistas/mes
                          </p>
                        </div>
                      </div>
                    </div>
                  </hlm-card>
                </a>
              }
            </div>
          </div>
        </section>

        <!-- 03 · Audiencia -->
        <section class="py-12 md:py-16 bg-surface">
          <div class="max-w-6xl mx-auto px-4">
            <div class="text-center mb-8 md:mb-10">
              <p class="text-xs font-extrabold uppercase tracking-widest text-primary mb-1">
                Audiencia
              </p>
              <h2 class="text-2xl md:text-3xl font-extrabold tracking-tight text-stone-950">
                ¿A quién llegamos?
              </h2>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <hlm-card class="h-full">
                <div class="grid gap-1 text-center p-4">
                  <p class="text-4xl font-extrabold text-primary">
                    {{ data.audienceOverview?.countriesCount || '—' }}
                  </p>
                  <p class="text-sm font-bold text-stone-950">
                    {{ data.audienceOverview?.countriesLabel || 'países' }}
                  </p>
                </div>
              </hlm-card>
              <hlm-card class="h-full">
                <div class="grid gap-1 text-center p-4">
                  <p class="text-4xl font-extrabold text-primary">
                    {{ data.audienceOverview?.femalePercent || '—' }}
                  </p>
                  <p class="text-sm font-bold text-stone-950">
                    {{ data.audienceOverview?.femaleLabel || 'mujeres' }}
                  </p>
                </div>
              </hlm-card>
              <hlm-card class="h-full">
                <div class="grid gap-1 text-center p-4">
                  <p class="text-4xl font-extrabold text-primary">
                    {{ data.audienceOverview?.ageRange || '—' }}
                  </p>
                  <p class="text-sm font-bold text-stone-950">
                    {{ data.audienceOverview?.ageLabel || 'años' }}
                  </p>
                </div>
              </hlm-card>
            </div>

            <div class="bg-white rounded-2xl p-6 md:p-8">
              <h3 class="text-lg font-extrabold text-stone-950 mb-4">Principales países</h3>
              <div class="flex flex-wrap gap-2">
                @for (country of audienceCountries(data); track country) {
                  <span hlmBadge variant="secondary">{{ country }}</span>
                }
              </div>
            </div>
          </div>
        </section>

        <!-- 04 · Formatos de colaboración -->
        <section class="py-12 md:py-16 bg-white">
          <div class="max-w-6xl mx-auto px-4">
            <div class="text-center mb-8 md:mb-10">
              <p class="text-xs font-extrabold uppercase tracking-widest text-primary mb-1">
                Colaboración
              </p>
              <h2 class="text-2xl md:text-3xl font-extrabold tracking-tight text-stone-950">
                {{ data.collabFormats?.title || 'Formatos de colaboración' }}
              </h2>
              @if (data.collabFormats?.intro) {
                <p class="text-muted-foreground max-w-2xl mx-auto mt-2 leading-relaxed">
                  {{ data.collabFormats?.intro }}
                </p>
              }
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              @for (item of data.collabFormats?.items ?? []; track item.title) {
                <hlm-card class="h-full">
                  <h3 class="text-lg font-extrabold text-stone-950 mb-2">{{ item.title }}</h3>
                  <p class="text-sm text-muted-foreground leading-relaxed">
                    {{ item.description }}
                  </p>
                </hlm-card>
              }
            </div>
          </div>
        </section>

        <!-- 05 · Casa Chuby -->
        <section class="py-12 md:py-16 bg-surface">
          <div class="max-w-6xl mx-auto px-4">
            <div class="text-center mb-8 md:mb-10">
              <p class="text-xs font-extrabold uppercase tracking-widest text-primary mb-1">
                Contenido
              </p>
              <h2 class="text-2xl md:text-3xl font-extrabold tracking-tight text-stone-950">
                {{ data.houseFormats?.title || 'Formatos de La Casa Chuby' }}
              </h2>
            </div>

            <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              @for (item of data.houseFormats?.items ?? []; track item.title) {
                <div class="bg-white border border-border rounded-2xl p-4 text-center">
                  <p class="text-sm font-extrabold text-stone-950">{{ item.title }}</p>
                </div>
              }
            </div>

            @if (data.houseFormats?.growthNote) {
              <div class="flex justify-center mt-8">
                <span hlmBadge class="gap-1">
                  <ng-icon hlmIcon name="lucideHeart" class="w-4 h-4" />
                  {{ data.houseFormats?.growthNote }}
                </span>
              </div>
            }
          </div>
        </section>

        <!-- 06 · Contacto -->
        <section id="contacto" class="py-16 md:py-24 bg-stone-950">
          <div class="max-w-4xl mx-auto px-4 text-center">
            <h2 class="text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-4">
              Hagamos algo juntos
            </h2>
            <p class="text-muted-foreground mb-8 max-w-xl mx-auto">
              Cuéntanos tu idea, producto o campaña. Armamos una propuesta a la medida de tu marca.
            </p>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              @if (data.contact.website) {
                <a
                  [href]="'https://' + data.contact.website"
                  target="_blank"
                  rel="noreferrer"
                  class="bg-white/5 rounded-2xl p-4 hover:bg-white/10 transition-colors block"
                >
                  <p class="text-xs uppercase tracking-wide text-muted-foreground mb-1">Web</p>
                  <p class="text-sm font-bold text-white break-words">
                    {{ data.contact.website }}
                  </p>
                </a>
              }
              @if (data.contact.phone) {
                <a
                  [href]="'tel:' + data.contact.phone"
                  class="bg-white/5 rounded-2xl p-4 hover:bg-white/10 transition-colors block"
                >
                  <p class="text-xs uppercase tracking-wide text-muted-foreground mb-1">Teléfono</p>
                  <p class="text-sm font-bold text-white break-words">{{ data.contact.phone }}</p>
                </a>
              }
              <a
                [href]="'mailto:' + data.contact.email"
                class="bg-white/5 rounded-2xl p-4 hover:bg-white/10 transition-colors block"
              >
                <p class="text-xs uppercase tracking-wide text-muted-foreground mb-1">Email</p>
                <p class="text-sm font-bold text-white break-words">{{ data.contact.email }}</p>
              </a>
              @if (data.contact.location) {
                <a
                  [href]="data.contact.whatsapp"
                  target="_blank"
                  rel="noreferrer"
                  class="bg-white/5 rounded-2xl p-4 hover:bg-white/10 transition-colors block"
                >
                  <p class="text-xs uppercase tracking-wide text-muted-foreground mb-1">
                    Ubicación
                  </p>
                  <p class="text-sm font-bold text-white break-words">
                    {{ data.contact.location }}
                  </p>
                </a>
              }
            </div>

            <div class="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a [href]="'mailto:' + data.contact.email" hlmBtn size="lg">
                <ng-icon hlmIcon name="lucideMail" class="w-5 h-5" />
                {{ data.contact.email }}
              </a>
              <a
                [href]="data.contact.whatsapp"
                target="_blank"
                rel="noreferrer"
                hlmBtn
                variant="outline"
                size="lg"
              >
                <ng-icon hlmIcon name="lucideMessageCircle" class="w-5 h-5" />
                {{ data.contact.whatsappLabel }}
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
      'Descubre el alcance, audiencia y formatos de colaboración de Las Chubys para marcas.',
      '/images/cats/iris2.jpeg',
      '/media-kit',
    );
  }

  /** Devuelve las métricas de redes desde la sección nueva (fallback a metrics antiguas). */
  protected socialNetworks(data: MediaKitData): MediaKitPdfNetwork[] {
    return data.socialMetrics ?? [];
  }

  /** Devuelve la lista de países desde la sección nueva (fallback vacío). */
  protected audienceCountries(data: MediaKitData): string[] {
    return data.audienceOverview?.countries ?? [];
  }
}
