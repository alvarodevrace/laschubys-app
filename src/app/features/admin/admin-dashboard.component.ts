import { CurrencyPipe } from '@angular/common';
import { Component, computed, inject, resource } from '@angular/core';
import { RouterLink } from '@angular/router';

import { AuthService } from '../../core/auth/auth.service';
import { ContentService } from '../../core/services/content.service';
import { SeoService } from '../../core/services/seo.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [RouterLink, CurrencyPipe],
  template: `
    <section class="page-hero">
      <div class="page-hero__inner">
        <p class="page-hero__eyebrow">Panel editorial</p>
        <h1 class="page-hero__title">Hola, {{ firstName() }}.</h1>
        <p class="page-hero__sub">Estado de contenido, catálogo y acceso administrativo en la nueva shell Angular.</p>
      </div>
    </section>

    <section class="cards-section">
      <div class="page-wrap">
        @if (dashboardResource.isLoading()) {
          <p class="admin-loading">Cargando panel...</p>
        } @else if (dashboardResource.value(); as dashboard) {
          <div class="admin-stats">
            <article class="admin-stat">
              <p class="admin-stat__label">Artículos</p>
              <p class="admin-stat__value">{{ dashboard.posts.length }}</p>
              <p class="admin-stat__sub">posts visibles en blog</p>
            </article>
            <article class="admin-stat">
              <p class="admin-stat__label">Productos</p>
              <p class="admin-stat__value">{{ dashboard.products.length }}</p>
              <p class="admin-stat__sub">items visibles en tienda</p>
            </article>
            <article class="admin-stat">
              <p class="admin-stat__label">Acceso</p>
              <p class="admin-stat__value admin-stat__value--small">Admin</p>
              <p class="admin-stat__sub">{{ auth.user()?.email }}</p>
            </article>
            <article class="admin-stat">
              <p class="admin-stat__label">Estado</p>
              <p class="admin-stat__value admin-stat__value--small admin-stat__value--ok">Activo</p>
              <p class="admin-stat__sub">sesion sincronizada</p>
            </article>
          </div>

          <section class="admin-section">
            <div class="admin-section__header">
              <p class="admin-section__title">Blog</p>
              <a class="button-secondary" routerLink="/blog">Ver sitio</a>
            </div>

            <div class="admin-list">
              @if (!dashboard.posts.length) {
                <p class="admin-empty">Sin articulos cargados todavia.</p>
              } @else {
                @for (post of dashboard.posts; track post.slug) {
                  <article class="admin-item">
                    <div>
                      <p class="admin-item__tag">{{ post.category }}</p>
                      <p class="admin-item__title">{{ post.title }}</p>
                      <p class="admin-item__sub">{{ post.excerpt || 'Sin resumen.' }}</p>
                    </div>
                    <div class="admin-item__meta">
                      <span class="admin-item__status">{{ post.publishedAt }}</span>
                    </div>
                  </article>
                }
              }
            </div>
          </section>

          <section class="admin-section">
            <div class="admin-section__header">
              <p class="admin-section__title">Tienda</p>
              <a class="button-secondary" routerLink="/tienda">Abrir catalogo</a>
            </div>

            <div class="admin-list">
              @if (!dashboard.products.length) {
                <p class="admin-empty">Sin productos visibles todavia.</p>
              } @else {
                @for (product of dashboard.products; track product.id) {
                  <article class="admin-item">
                    <div>
                      <p class="admin-item__tag">{{ product.source === 'owned' ? 'Propio' : 'Afiliado' }}</p>
                      <p class="admin-item__title">{{ product.name }}</p>
                      <p class="admin-item__sub">{{ product.copy || product.description }}</p>
                    </div>
                    <div class="admin-item__meta">
                      <span class="admin-item__status admin-item__status--published">
                        {{ product.priceValue | currency:'USD':'symbol':'1.0-0' }}
                      </span>
                    </div>
                  </article>
                }
              }
            </div>
          </section>
        } @else {
          <p class="admin-loading">No se pudo cargar el panel.</p>
        }
      </div>
    </section>
  `,
  styles: [`
    .admin-loading,
    .admin-empty {
      margin: 0;
      color: var(--text-muted);
    }

    .admin-stat__value--small {
      font-size: 1.1rem;
    }

    .admin-stat__value--ok {
      color: #2e8a50;
    }

    .admin-item__meta {
      flex-shrink: 0;
      display: flex;
      align-items: center;
    }
  `],
})
export class AdminDashboardComponent {
  protected readonly auth = inject(AuthService);
  private readonly content = inject(ContentService);
  private readonly seo = inject(SeoService);

  protected readonly firstName = computed(() => this.auth.user()?.name.split(' ')[0] || 'Mamá');
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
    this.seo.setPage('Panel | Las Chubys', 'Panel editorial de Las Chubys.', '/brand/logo.png', '/admin');
  }
}
