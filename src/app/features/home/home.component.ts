import { Component, inject, resource, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { marqueeItems, personas } from '../../core/content/site-content';
import { ContentService } from '../../core/services/content.service';
import { SeoService } from '../../core/services/seo.service';
import { CartService } from '../../core/services/cart.service';
import { ProductPick } from '../../core/models/content.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="banner-slider">
      <div class="banner-container">
        <picture>
          <source media="(max-width: 768px)" srcset="/images/banner1mobil.PNG" />
          <img src="/images/banner1.PNG" alt="Las Chubys" class="banner-img" />
        </picture>
        <div class="banner-overlay">
          <a routerLink="/auth/login" class="button-primary">Crear mi cuenta</a>
          <a routerLink="/tienda" class="button-primary">Ver productos</a>
          <a routerLink="/about" class="button-primary">Descubrir más</a>
        </div>
      </div>
    </section>

    <section class="promo-strip">
      <div class="promo-strip__track">
        @for (item of promoLoop; track item + $index) {
          <span>{{ item }}</span>
        }
      </div>
    </section>

    <section class="shop-section">
      <div class="page-wrap">
        <div class="section-header">
          <div>
            <p class="section-eyebrow">Tienda</p>
            <h2 class="section-heading">Nuestros productos</h2>
          </div>
          <a class="section-link" routerLink="/tienda">Ver todo →</a>
        </div>

        <div class="shop-grid">
          @for (product of productsResource.value() ?? []; track product.id) {
            <article class="shop-card">
              <div class="shop-card__badge">
                {{ product.source === 'owned' ? 'Las Chubys' : 'Afiliado' }}
              </div>
              <div class="shop-card__photo">
                <img
                  [src]="product.images[0] || '/images/cats/iris4.jpeg'"
                  [alt]="product.name"
                  loading="lazy"
                />
              </div>
              <div class="shop-card__info">
                <p class="shop-card__name">{{ product.name }}</p>
                <p class="shop-card__price">{{ product.price }}</p>
              </div>
              <div class="shop-card__actions">
                <button class="button-secondary" type="button" (click)="openPreview(product)">
                  Ver
                </button>
                <a
                  class="button-primary"
                  [routerLink]="['/tienda']"
                  [queryParams]="{ product: product.id }"
                  >Comprar</a
                >
              </div>
            </article>
          }
        </div>
      </div>
    </section>

    <section class="shop-section shop-section--gray">
      <div class="page-wrap">
        <div class="section-header">
          <div>
            <p class="section-eyebrow">Blog</p>
            <h2 class="section-heading">Historias y consejos</h2>
          </div>
          <a class="section-link" routerLink="/blog">Ver más →</a>
        </div>

        <div class="cards-grid">
          @for (post of postsResource.value() ?? []; track post.slug) {
            <a class="card-blog" [routerLink]="['/blog', post.slug]">
              <div class="card-blog__photo">
                <img
                  [src]="post.coverImage || '/images/cats/iris2.jpeg'"
                  [alt]="post.title"
                  loading="lazy"
                />
              </div>
              <p class="card-blog__cat">{{ post.category }}</p>
              <h3 class="card-blog__title">{{ post.title }}</h3>
              <p class="card-blog__excerpt">{{ post.excerpt }}</p>
            </a>
          }
        </div>
      </div>
    </section>

    <section class="shop-section shop-section--gray">
      <div class="page-wrap">
        <div class="dual-banner">
          <a
            [routerLink]="['/tienda']"
            [queryParams]="{ audience: 'michis' }"
            class="dual-banner-item"
          >
            <img src="/images/cats/iris2.jpeg" alt="Para Michis" loading="lazy" />
            <div class="dual-banner-item__content">
              <p class="dual-banner-item__label">Categoría base</p>
              <h3 class="dual-banner-item__title">Para Michis</h3>
              <span class="dual-banner-item__cta">Explorar picks y tienda →</span>
            </div>
          </a>
          <a
            [routerLink]="['/tienda']"
            [queryParams]="{ audience: 'michi-lovers' }"
            class="dual-banner-item"
          >
            <img src="/images/cats/iris2.jpeg" alt="Michi Lovers" loading="lazy" />
            <div class="dual-banner-item__content">
              <p class="dual-banner-item__label">Categoría base</p>
              <h3 class="dual-banner-item__title">Michi Lovers</h3>
              <span class="dual-banner-item__cta">Ver regalos y picks →</span>
            </div>
          </a>
        </div>
      </div>
    </section>

    <section class="shop-section">
      <div class="page-wrap">
        <div class="section-header">
          <div>
            <p class="section-eyebrow">Persona Spotlight</p>
            <h2 class="section-heading">Iris y Rubi al frente</h2>
          </div>
        </div>

        <div class="persona-grid">
          @for (persona of personas; track persona.name) {
            <article class="persona-card">
              <img [src]="persona.image" [alt]="persona.name" loading="lazy" />
              <div>
                <p class="persona-card__role">{{ persona.role }}</p>
                <h3 class="persona-card__name">{{ persona.name }}</h3>
                <p class="persona-card__accent">{{ persona.accent }}</p>
              </div>
            </article>
          }
        </div>
      </div>
    </section>

    @if (selectedProduct(); as product) {
      <div class="modal-shell" (click)="closePreview()">
        <article class="modal-card" (click)="$event.stopPropagation()">
          <img [src]="product.images[0] || '/images/cats/iris4.jpeg'" [alt]="product.name" />
          <div class="modal-card__body">
            <p class="section-eyebrow">{{ product.tag }}</p>
            <h2>{{ product.name }}</h2>
            <p>{{ product.description || product.copy }}</p>
            <div class="modal-card__actions">
              <button class="button-primary" type="button" (click)="addToCart(product)">
                Agregar
              </button>
              <a class="button-secondary" routerLink="/tienda">Ver catálogo</a>
            </div>
          </div>
        </article>
      </div>
    }
  `,
})
export class HomeComponent {
  private readonly content = inject(ContentService);
  private readonly cart = inject(CartService);
  private readonly seo = inject(SeoService);

  protected readonly personas = personas;
  protected readonly promoLoop = [
    ...marqueeItems,
    'Para Michis',
    'Michi Lovers',
    'Tienda Física',
    'Afiliados curados',
  ];
  protected readonly selectedProduct = signal<ProductPick | null>(null);
  protected readonly postsResource = resource({
    loader: async () => this.content.getPosts(3),
  });
  protected readonly productsResource = resource({
    loader: async () => (await this.content.getProducts()).slice(0, 4),
  });

  constructor() {
    this.seo.setPage(
      'Las Chubys',
      'Iris, Rubi y su universo editorial felino.',
      '/brand/logo.png',
      '/',
    );
    this.seo.setJsonLd({
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Las Chubys',
      url: 'https://laschubys.com',
      sameAs: [
        'https://www.instagram.com/laschubys.oficial/',
        'https://www.tiktok.com/@laschubys.oficial',
      ],
    });
  }

  protected addToCart(product: ProductPick) {
    this.cart.addItem(product);
  }

  protected openPreview(product: ProductPick) {
    this.selectedProduct.set(product);
  }

  protected closePreview() {
    this.selectedProduct.set(null);
  }
}
