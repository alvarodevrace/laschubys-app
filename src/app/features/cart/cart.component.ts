import { CurrencyPipe } from '@angular/common';
import { Component, inject, resource, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';

import { HlmBreadcrumbImports } from '@spartan-ng/helm/breadcrumb';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmBadgeImports } from '@spartan-ng/helm/badge';

import { ProductPick } from '../../core/models/content.model';
import { CartService } from '../../core/services/cart.service';
import { ContentService } from '../../core/services/content.service';
import { SeoService } from '../../core/services/seo.service';
import { ToastService } from '../../shared/ui/toast/toast.service';
import { StaggerChildrenDirective } from '../../shared/animations';
import { ProductCardComponent } from '../shop/product-card.component';
import { CartItemRowComponent } from './cart-item-row.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-cart',
  standalone: true,
  imports: [
    RouterLink,
    CurrencyPipe,
    CartItemRowComponent,
    ProductCardComponent,
    StaggerChildrenDirective,
    HlmBreadcrumbImports,
    HlmButtonImports,
    HlmCardImports,
    HlmBadgeImports,
  ],
  template: `
    <section class="max-w-6xl mx-auto px-4 py-10 pb-8">
      <nav class="mb-4" hlmBreadcrumb aria-label="Breadcrumb">
        <ol hlmBreadcrumbList>
          <li hlmBreadcrumbItem>
            <a hlmBreadcrumbLink [link]="['/']">Inicio</a>
          </li>
          <li hlmBreadcrumbSeparator></li>
          <li hlmBreadcrumbItem>
            <a hlmBreadcrumbLink [link]="['/tienda']">Tienda</a>
          </li>
          <li hlmBreadcrumbSeparator></li>
          <li hlmBreadcrumbItem>
            <span hlmBreadcrumbPage>Carrito</span>
          </li>
        </ol>
      </nav>
      <p class="text-xs font-extrabold uppercase tracking-widest text-primary mb-1">Carrito</p>
      <h1 class="text-h1 text-primary mb-2">Tu selección actual.</h1>
      <p class="text-muted-foreground">
        Ajusta cantidades, revisa total y sigue a checkout cuando esté listo.
      </p>
    </section>

    <section class="max-w-6xl mx-auto px-4">
      @if (items().length) {
        <div class="grid grid-cols-1 lg:grid-cols-[1.6fr_0.8fr] gap-5 items-start">
          <div class="grid gap-4">
            @for (item of items(); track item.id) {
              <app-cart-item-row
                [item]="item"
                (qtyChange)="updateQty(item.id, $event)"
                (remove)="remove(item.id)"
              />
            }
          </div>

          <aside hlmCard class="sticky top-4">
            <div hlmCardHeader>
              <p class="text-xs font-extrabold uppercase tracking-widest text-primary">Resumen</p>
            </div>
            <div hlmCardContent class="grid gap-3">
              <div class="flex justify-between gap-4 text-muted-foreground">
                <span>Items</span>
                <strong>{{ count() }}</strong>
              </div>
              <div class="flex justify-between gap-4 text-muted-foreground">
                <span>Subtotal</span>
                <strong>{{ total() | currency: 'USD' : 'symbol' : '1.0-0' }}</strong>
              </div>
              <div class="flex justify-between gap-4 text-muted-foreground">
                <span>Envío</span>
                <strong>Por calcular</strong>
              </div>
            </div>
            <div hlmCardFooter class="grid gap-3">
              <a hlmBtn routerLink="/checkout" size="lg" class="w-full">Ir al checkout</a>
              <button hlmBtn variant="outline" type="button" class="w-full" (click)="clear()">
                Vaciar carrito
              </button>
            </div>
          </aside>
        </div>
      } @else {
        <section hlmCard class="text-center">
          <div hlmCardHeader>
            <h2 hlmCardTitle>Tu carrito está vacío.</h2>
          </div>
          <div hlmCardContent>
            <p class="text-muted-foreground text-sm">
              Empieza por la tienda y arma tu selección con calma.
            </p>
          </div>
          <div hlmCardFooter class="justify-center">
            <a hlmBtn routerLink="/tienda" size="lg">Ir a tienda</a>
          </div>
        </section>

        @if (suggestedProducts.value()?.length) {
          <section class="mt-10">
            <h2 class="text-h3 text-primary mb-4 text-center">También te puede gustar</h2>
            <div
              class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
              appStaggerChildren
              childSelector="app-product-card"
              [staggerDelay]="0.03"
              [duration]="0.4"
              [y]="16"
            >
              @for (product of suggestedProducts.value()!.slice(0, 4); track product.id) {
                <app-product-card
                  [product]="product"
                  [adding]="false"
                  [added]="false"
                  (add)="addSuggested($event)"
                />
              }
            </div>
          </section>
        }
      }
    </section>
  `,
})
export class CartComponent {
  private readonly cart = inject(CartService);
  private readonly content = inject(ContentService);
  private readonly seo = inject(SeoService);
  private readonly toast = inject(ToastService);

  protected readonly items = this.cart.items;
  protected readonly total = this.cart.total;
  protected readonly count = this.cart.count;
  protected readonly suggestedProducts = resource({
    loader: async () => (await this.content.getProducts()).slice(0, 4),
  });

  constructor() {
    this.seo.setPage(
      'Carrito | Las Chubys',
      'Tu selección actual de productos felinos.',
      '/images/cats/rubi4.jpeg',
      '/carrito',
    );
  }

  protected updateQty(id: string, qty: number) {
    this.cart.updateQty(id, qty);
  }

  protected remove(id: string) {
    this.cart.removeItem(id);
  }

  protected clear() {
    this.cart.clearCart();
    this.toast.show('Carrito vaciado', 'info');
  }

  protected addSuggested(product: ProductPick) {
    this.cart.addItem(product);
    this.toast.show(`${product.name} agregado al carrito`, 'success');
  }
}
