import { CurrencyPipe } from '@angular/common';
import { Component, computed, inject, resource, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmCard, HlmCardContent, HlmCardHeader, HlmCardTitle } from '@spartan-ng/helm/card';
import { HlmBadge } from '@spartan-ng/helm/badge';

import { AuthService } from '../../core/auth/auth.service';
import { ContentService } from '../../core/services/content.service';
import { SeoService } from '../../core/services/seo.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    RouterLink,
    CurrencyPipe,
    HlmButton,
    HlmCard,
    HlmCardContent,
    HlmCardHeader,
    HlmCardTitle,
    HlmBadge,
  ],
  template: `
    <section class="py-10 pb-8">
      <div class="max-w-6xl mx-auto px-4">
        <p class="text-xs font-extrabold uppercase tracking-widest text-primary mb-2">
          Panel editorial
        </p>
        <h1
          class="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight text-foreground mb-2"
        >
          Hola, {{ firstName() }}.
        </h1>
        <p class="text-muted-foreground max-w-2xl">
          Estado de contenido, catálogo y acceso administrativo en la nueva shell Angular.
        </p>
      </div>
    </section>

    <section class="pb-16">
      <div class="max-w-6xl mx-auto px-4">
        @if (dashboardResource.isLoading()) {
          <p class="m-0 text-muted-foreground">Cargando panel...</p>
        } @else if (dashboardResource.value(); as dashboard) {
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <article hlmCard>
              <div hlmCardHeader>
                <p class="text-xs font-extrabold uppercase tracking-wide text-muted-foreground">
                  Artículos
                </p>
              </div>
              <div hlmCardContent>
                <p class="text-3xl font-extrabold text-foreground mb-1">
                  {{ dashboard.posts.length }}
                </p>
                <p class="text-xs text-muted-foreground">posts visibles en blog</p>
              </div>
            </article>
            <article hlmCard>
              <div hlmCardHeader>
                <p class="text-xs font-extrabold uppercase tracking-wide text-muted-foreground">
                  Productos
                </p>
              </div>
              <div hlmCardContent>
                <p class="text-3xl font-extrabold text-foreground mb-1">
                  {{ dashboard.products.length }}
                </p>
                <p class="text-xs text-muted-foreground">items visibles en tienda</p>
              </div>
            </article>
            <article hlmCard>
              <div hlmCardHeader>
                <p class="text-xs font-extrabold uppercase tracking-wide text-muted-foreground">
                  Acceso
                </p>
              </div>
              <div hlmCardContent>
                <p class="text-3xl font-extrabold text-foreground mb-1 text-lg">Admin</p>
                <p class="text-xs text-muted-foreground">{{ auth.user()?.email }}</p>
              </div>
            </article>
            <article hlmCard>
              <div hlmCardHeader>
                <p class="text-xs font-extrabold uppercase tracking-wide text-muted-foreground">
                  Estado
                </p>
              </div>
              <div hlmCardContent>
                <p class="text-3xl font-extrabold text-foreground mb-1 text-lg text-green-600">
                  Activo
                </p>
                <p class="text-xs text-muted-foreground">sesion sincronizada</p>
              </div>
            </article>
          </div>

          <section class="mb-8">
            <div class="flex items-center justify-between gap-4 mb-4">
              <p class="text-sm font-extrabold uppercase tracking-wide text-muted-foreground">
                Blog
              </p>
              <a hlmBtn variant="outline" routerLink="/blog">Ver sitio</a>
            </div>

            <div class="grid gap-3">
              @if (!dashboard.posts.length) {
                <p class="m-0 text-muted-foreground">Sin articulos cargados todavia.</p>
              } @else {
                @for (post of dashboard.posts; track post.slug) {
                  <article hlmCard>
                    <div hlmCardContent class="flex items-start justify-between gap-4 p-4">
                      <div>
                        <p
                          hlmCardTitle
                          class="text-xs font-extrabold uppercase tracking-wide text-primary mb-1"
                        >
                          {{ post.category }}
                        </p>
                        <p class="font-bold text-foreground">{{ post.title }}</p>
                        <p class="text-sm text-muted-foreground mt-1">
                          {{ post.excerpt || 'Sin resumen.' }}
                        </p>
                      </div>
                      <div class="flex-shrink-0 flex items-center">
                        <span hlmBadge variant="secondary">{{ post.publishedAt }}</span>
                      </div>
                    </div>
                  </article>
                }
              }
            </div>
          </section>

          <section class="mb-8">
            <div class="flex items-center justify-between gap-4 mb-4">
              <p class="text-sm font-extrabold uppercase tracking-wide text-muted-foreground">
                Tienda
              </p>
              <a hlmBtn variant="outline" routerLink="/tienda">Abrir catalogo</a>
            </div>

            <div class="grid gap-3">
              @if (!dashboard.products.length) {
                <p class="m-0 text-muted-foreground">Sin productos visibles todavia.</p>
              } @else {
                @for (product of dashboard.products; track product.id) {
                  <article hlmCard>
                    <div hlmCardContent class="flex items-start justify-between gap-4 p-4">
                      <div>
                        <p
                          hlmCardTitle
                          class="text-xs font-extrabold uppercase tracking-wide text-primary mb-1"
                        >
                          {{ product.source === 'owned' ? 'Propio' : 'Afiliado' }}
                        </p>
                        <p class="font-bold text-foreground">{{ product.name }}</p>
                        <p class="text-sm text-muted-foreground mt-1">
                          {{ product.copy || product.description }}
                        </p>
                      </div>
                      <div class="flex-shrink-0 flex items-center">
                        <span hlmBadge variant="default">
                          {{ product.priceValue | currency: 'USD' : 'symbol' : '1.0-0' }}
                        </span>
                      </div>
                    </div>
                  </article>
                }
              }
            </div>
          </section>
        } @else {
          <p class="m-0 text-muted-foreground">No se pudo cargar el panel.</p>
        }
      </div>
    </section>
  `,
})
export class AdminDashboardComponent {
  protected readonly auth = inject(AuthService);
  private readonly content = inject(ContentService);
  private readonly seo = inject(SeoService);

  protected readonly firstName = computed(() => this.auth.user()?.name.split(' ')[0] || 'Brenda');
  protected readonly dashboardResource = resource({
    loader: async () => {
      const [posts, products] = await Promise.all([
        this.content.getPosts(8),
        this.content.getProducts(),
      ]);

      return { posts, products: products.slice(0, 8) };
    },
  });

  constructor() {
    this.seo.setPage(
      'Panel | Las Chubys',
      'Panel editorial de Las Chubys.',
      '/brand/logo.png',
      '/admin',
    );
  }
}
