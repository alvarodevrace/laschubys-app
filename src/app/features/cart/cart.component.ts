import { CurrencyPipe } from '@angular/common';
import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CartService } from '../../core/services/cart.service';
import { SeoService } from '../../core/services/seo.service';
import { CartItemRowComponent } from './cart-item-row.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-cart',
  standalone: true,
  imports: [RouterLink, CurrencyPipe, CartItemRowComponent],
  template: `
    <section class="page-wrap page-hero">
      <nav class="breadcrumb" aria-label="Breadcrumb">
        <a routerLink="/">Inicio</a>
        <span>›</span>
        <a routerLink="/tienda">Tienda</a>
        <span>›</span>
        <span>Carrito</span>
      </nav>
      <p class="section-eyebrow">Carrito</p>
      <h1>Tu selección actual.</h1>
      <p class="page-copy">Ajusta cantidades, revisa total y sigue a checkout cuando esté listo.</p>
    </section>

    <section class="page-wrap page-section">
      @if (items().length) {
        <div class="cart-layout">
          <div class="cart-list">
            @for (item of items(); track item.id) {
              <app-cart-item-row
                [item]="item"
                (qtyChange)="updateQty(item.id, $event)"
                (remove)="remove(item.id)"
              />
            }
          </div>

          <aside class="cart-summary">
            <p class="section-eyebrow">Resumen</p>
            <div class="cart-summary__row">
              <span>Items</span>
              <strong>{{ count() }}</strong>
            </div>
            <div class="cart-summary__row">
              <span>Subtotal</span>
              <strong>{{ total() | currency: 'USD' : 'symbol' : '1.0-0' }}</strong>
            </div>
            <div class="cart-summary__row">
              <span>Envío</span>
              <strong>Por calcular</strong>
            </div>
            <a class="button-primary" routerLink="/checkout">Ir al checkout</a>
            <button class="button-secondary" type="button" (click)="clear()">Vaciar carrito</button>
          </aside>
        </div>
      } @else {
        <div class="empty-panel">
          <h2>Tu carrito está vacío.</h2>
          <p>Empieza por la tienda y arma tu selección con calma.</p>
          <a class="button-primary" routerLink="/tienda">Ir a tienda</a>
        </div>
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
