import { CurrencyPipe } from '@angular/common';
import { Component, computed, inject, resource, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';

import { AuthService } from '../../core/auth/auth.service';
import { ContentService } from '../../core/services/content.service';
import { SeoService } from '../../core/services/seo.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [RouterLink, CurrencyPipe],
  template: `
    <section class="py-10 pb-8">
      <div class="max-w-6xl mx-auto px-4">
        <p class="text-xs font-extrabold uppercase tracking-widest text-orange mb-2">
          Panel editorial
        </p>
        <h1
          class="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight text-gray-900 mb-2"
        >
          Hola, {{ firstName() }}.
        </h1>
        <p class="text-gray-500 max-w-2xl">
          Estado de contenido, catálogo y acceso administrativo en la nueva shell Angular.
        </p>
      </div>
    </section>

    <section class="pb-16">
      <div class="max-w-6xl mx-auto px-4">
        @if (dashboardResource.isLoading()) {
          <p class="m-0 text-gray-500">Cargando panel...</p>
        } @else if (dashboardResource.value(); as dashboard) {
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <article class="p-5 rounded-2xl bg-gray-50 border border-gray-200">
              <p class="text-xs font-extrabold uppercase tracking-wide text-gray-500 mb-2">
                Artículos
              </p>
              <p class="text-3xl font-extrabold text-gray-900 mb-1">{{ dashboard.posts.length }}</p>
              <p class="text-xs text-gray-500">posts visibles en blog</p>
            </article>
            <article class="p-5 rounded-2xl bg-gray-50 border border-gray-200">
              <p class="text-xs font-extrabold uppercase tracking-wide text-gray-500 mb-2">
                Productos
              </p>
              <p class="text-3xl font-extrabold text-gray-900 mb-1">
                {{ dashboard.products.length }}
              </p>
              <p class="text-xs text-gray-500">items visibles en tienda</p>
            </article>
            <article class="p-5 rounded-2xl bg-gray-50 border border-gray-200">
              <p class="text-xs font-extrabold uppercase tracking-wide text-gray-500 mb-2">
                Acceso
              </p>
              <p class="text-3xl font-extrabold text-gray-900 mb-1 text-lg">Admin</p>
              <p class="text-xs text-gray-500">{{ auth.user()?.email }}</p>
            </article>
            <article class="p-5 rounded-2xl bg-gray-50 border border-gray-200">
              <p class="text-xs font-extrabold uppercase tracking-wide text-gray-500 mb-2">
                Estado
              </p>
              <p class="text-3xl font-extrabold text-gray-900 mb-1 text-lg text-green-600">
                Activo
              </p>
              <p class="text-xs text-gray-500">sesion sincronizada</p>
            </article>
          </div>

          <section class="mb-8">
            <div class="flex items-center justify-between gap-4 mb-4">
              <p class="text-sm font-extrabold uppercase tracking-wide text-gray-500">Blog</p>
              <a
                class="inline-flex items-center justify-center min-h-12 px-6 rounded-full font-extrabold text-sm tracking-wide border cursor-pointer transition-all duration-200 bg-orange/[0.08] border-orange/[0.16] text-[#e06300] hover:bg-orange/[0.14] hover:border-orange/[0.28]"
                routerLink="/blog"
                >Ver sitio</a
              >
            </div>

            <div class="grid gap-3">
              @if (!dashboard.posts.length) {
                <p class="m-0 text-gray-500">Sin articulos cargados todavia.</p>
              } @else {
                @for (post of dashboard.posts; track post.slug) {
                  <article
                    class="flex items-start justify-between gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-200"
                  >
                    <div>
                      <p class="text-xs font-extrabold uppercase tracking-wide text-orange mb-1">
                        {{ post.category }}
                      </p>
                      <p class="font-bold text-gray-900">{{ post.title }}</p>
                      <p class="text-sm text-gray-500 mt-1">{{ post.excerpt || 'Sin resumen.' }}</p>
                    </div>
                    <div class="flex-shrink-0 flex items-center">
                      <span class="text-xs text-gray-500 whitespace-nowrap">{{
                        post.publishedAt
                      }}</span>
                    </div>
                  </article>
                }
              }
            </div>
          </section>

          <section class="mb-8">
            <div class="flex items-center justify-between gap-4 mb-4">
              <p class="text-sm font-extrabold uppercase tracking-wide text-gray-500">Tienda</p>
              <a
                class="inline-flex items-center justify-center min-h-12 px-6 rounded-full font-extrabold text-sm tracking-wide border cursor-pointer transition-all duration-200 bg-orange/[0.08] border-orange/[0.16] text-[#e06300] hover:bg-orange/[0.14] hover:border-orange/[0.28]"
                routerLink="/tienda"
                >Abrir catalogo</a
              >
            </div>

            <div class="grid gap-3">
              @if (!dashboard.products.length) {
                <p class="m-0 text-gray-500">Sin productos visibles todavia.</p>
              } @else {
                @for (product of dashboard.products; track product.id) {
                  <article
                    class="flex items-start justify-between gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-200"
                  >
                    <div>
                      <p class="text-xs font-extrabold uppercase tracking-wide text-orange mb-1">
                        {{ product.source === 'owned' ? 'Propio' : 'Afiliado' }}
                      </p>
                      <p class="font-bold text-gray-900">{{ product.name }}</p>
                      <p class="text-sm text-gray-500 mt-1">
                        {{ product.copy || product.description }}
                      </p>
                    </div>
                    <div class="flex-shrink-0 flex items-center">
                      <span class="text-xs text-gray-500 whitespace-nowrap text-orange font-bold">
                        {{ product.priceValue | currency: 'USD' : 'symbol' : '1.0-0' }}
                      </span>
                    </div>
                  </article>
                }
              }
            </div>
          </section>
        } @else {
          <p class="m-0 text-gray-500">No se pudo cargar el panel.</p>
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
