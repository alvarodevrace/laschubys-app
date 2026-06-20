import { CurrencyPipe } from '@angular/common';
import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';

import { HlmBreadcrumbImports } from '@spartan-ng/helm/breadcrumb';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';

import { CartService } from '../../core/services/cart.service';
import { SeoService } from '../../core/services/seo.service';
import { CartItemRowComponent } from './cart-item-row.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-cart',
  standalone: true,
  imports: [
    RouterLink,
    CurrencyPipe,
    CartItemRowComponent,
    HlmBreadcrumbImports,
    HlmButtonImports,
    HlmCardImports,
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
      <h1>Tu selección actual.</h1>
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
      }
    </section>
  `,
})
export class CartComponent {
  private readonly cart = inject(CartService);
  private readonly seo = inject(SeoService);

  protected readonly items = this.cart.items;
  protected readonly total = this.cart.total;
  protected readonly count = this.cart.count;

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
  }
}
