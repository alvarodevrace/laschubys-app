import { Component, inject, resource, ChangeDetectionStrategy } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import {
  lucideAlertCircle,
  lucideBriefcase,
  lucideCheck,
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
import { MediaKitData } from './media-kit.model';

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
      lucideBriefcase,
      lucideCheck,
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
        <!-- Hero -->
        <section class="bg-surface py-12 md:py-20">
          <div class="max-w-6xl mx-auto px-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
              <div class="order-2 md:order-1">
                <span hlmBadge class="mb-4">{{ data.hero.pill }}</span>
                <h1
                  class="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight text-stone-950 mb-4"
                >
                  {{ data.hero.title }}
                </h1>
                <p class="text-base md:text-lg text-muted-foreground leading-relaxed mb-6 max-w-lg">
                  {{ data.hero.subtitle }}
                </p>
                <div class="flex flex-wrap gap-3">
                  <a [href]="data.hero.ctaDownload.href" hlmBtn size="lg">
                    <ng-icon hlmIcon name="lucideMail" class="w-5 h-5" />
                    {{ data.hero.ctaDownload.label }}
                  </a>
                  <a [href]="data.hero.ctaWrite.href" hlmBtn variant="outline" size="lg">
                    {{ data.hero.ctaWrite.label }}
                  </a>
                </div>
              </div>

              <div class="order-1 md:order-2">
                <div class="relative rounded-[32px] overflow-hidden shadow-xl">
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
              <p class="text-xs font-extrabold uppercase tracking-widest text-primary mb-1">
                Números
              </p>
              <h2 class="text-2xl md:text-3xl font-extrabold tracking-tight text-stone-950">
                Alcance y engagement
              </h2>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              @for (metric of data.metrics; track metric.network) {
                <a [href]="metric.href" target="_blank" rel="noreferrer" class="block group">
                  <hlm-card class="h-full">
                    <div class="grid gap-1">
                      <p class="text-sm font-bold text-primary">{{ metric.network }}</p>
                      <p class="text-3xl md:text-4xl font-extrabold text-stone-950">
                        {{ metric.value }}
                      </p>
                      <p class="text-sm text-muted-foreground">{{ metric.label }}</p>
                      @if (metric.engagement) {
                        <p class="text-xs font-medium text-muted-foreground mt-1">
                          Engagement {{ metric.engagement }}
                        </p>
                      }
                    </div>
                  </hlm-card>
                </a>
              }
            </div>
          </div>
        </section>

        <!-- About -->
        <section class="py-12 md:py-16 bg-surface">
          <div class="max-w-6xl mx-auto px-4">
            <div class="text-center mb-8 md:mb-10">
              <p class="text-xs font-extrabold uppercase tracking-widest text-primary mb-1">
                Nosotros
              </p>
              <h2 class="text-2xl md:text-3xl font-extrabold tracking-tight text-stone-950">
                {{ data.about.headline }}
              </h2>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-12">
              <div>
                <p class="text-muted-foreground leading-relaxed text-base md:text-lg">
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
                <hlm-card class="h-full">
                  <img
                    [src]="member.image"
                    [alt]="member.name"
                    loading="lazy"
                    class="w-full aspect-square object-cover rounded-xl mb-3"
                  />
                  <p class="text-xs font-extrabold uppercase tracking-wide text-primary mb-0.5">
                    {{ member.role }}
                  </p>
                  <h3 class="text-base font-extrabold text-stone-950 mb-1">{{ member.name }}</h3>
                  <p class="text-sm text-muted-foreground leading-relaxed">{{ member.bio }}</p>
                </hlm-card>
              }
            </div>
          </div>
        </section>

        <!-- Audience -->
        <section class="py-12 md:py-16 bg-white">
          <div class="max-w-6xl mx-auto px-4">
            <div class="text-center mb-8 md:mb-10">
              <p class="text-xs font-extrabold uppercase tracking-widest text-primary mb-1">
                Audiencia
              </p>
              <h2 class="text-2xl md:text-3xl font-extrabold tracking-tight text-stone-950">
                ¿A quién llegamos?
              </h2>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
              @for (segment of data.audience.segments; track segment.title) {
                <hlm-card class="h-full">
                  <div
                    class="w-11 h-11 rounded-xl bg-primary/10 text-primary inline-flex items-center justify-center mb-3"
                  >
                    @switch (segment.icon) {
                      @case ('heart') {
                        <ng-icon hlmIcon name="lucideHeart" class="w-6 h-6" />
                      }
                      @case ('users') {
                        <ng-icon hlmIcon name="lucideUsers" class="w-6 h-6" />
                      }
                      @default {
                        <ng-icon hlmIcon name="lucideBriefcase" class="w-6 h-6" />
                      }
                    }
                  </div>
                  <h3 class="text-lg font-extrabold text-stone-950 mb-1">{{ segment.title }}</h3>
                  <p class="text-sm text-muted-foreground leading-relaxed">
                    {{ segment.description }}
                  </p>
                </hlm-card>
              }
            </div>

            <div class="bg-surface rounded-2xl p-6 md:p-8">
              <h3 class="text-lg font-extrabold text-stone-950 mb-4">Demografía principal</h3>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                @for (item of data.audience.demographics; track item.label) {
                  <div class="text-center">
                    <p class="text-2xl md:text-3xl font-extrabold text-primary">{{ item.value }}</p>
                    <p class="text-sm font-bold text-stone-950">{{ item.label }}</p>
                    <p class="text-xs text-muted-foreground">{{ item.detail }}</p>
                  </div>
                }
              </div>
            </div>
          </div>
        </section>

        <!-- Content -->
        <section class="py-12 md:py-16 bg-surface">
          <div class="max-w-6xl mx-auto px-4">
            <div class="text-center mb-8 md:mb-10">
              <p class="text-xs font-extrabold uppercase tracking-widest text-primary mb-1">
                Contenido
              </p>
              <h2 class="text-2xl md:text-3xl font-extrabold tracking-tight text-stone-950">
                Formatos que funcionan
              </h2>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              @for (item of data.content; track item.title) {
                <article class="group rounded-2xl overflow-hidden bg-white border border-border">
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
              <p class="text-xs font-extrabold uppercase tracking-widest text-primary mb-1">
                Servicios
              </p>
              <h2 class="text-2xl md:text-3xl font-extrabold tracking-tight text-stone-950">
                ¿Qué podemos crear juntos?
              </h2>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              @for (service of data.services; track service.name) {
                <hlm-card class="h-full">
                  <h3 class="text-lg font-extrabold text-stone-950 mb-2">{{ service.name }}</h3>
                  <p class="text-sm text-muted-foreground leading-relaxed mb-4">
                    {{ service.description }}
                  </p>
                  <ul class="grid gap-2">
                    @for (item of service.deliverables; track item) {
                      <li class="flex items-start gap-2 text-sm text-muted-foreground">
                        <ng-icon
                          hlmIcon
                          name="lucideCheck"
                          class="w-5 h-5 text-primary flex-shrink-0 mt-0.5"
                        />
                        {{ item }}
                      </li>
                    }
                  </ul>
                </hlm-card>
              }
            </div>
          </div>
        </section>

        <!-- Final CTA -->
        <section id="contacto" class="py-16 md:py-24 bg-stone-950">
          <div class="max-w-4xl mx-auto px-4 text-center">
            <h2 class="text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-4">
              Hagamos algo juntos
            </h2>
            <p class="text-muted-foreground mb-8 max-w-xl mx-auto">
              Cuéntanos tu idea, producto o campaña. Armamos una propuesta a la medida de tu marca.
            </p>
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
      'Descubre el alcance, audiencia, servicios y tarifas de Las Chubys para colaboraciones con marcas en Ecuador y LATAM.',
      '/images/cats/iris2.jpeg',
      '/media-kit',
    );
  }
}
