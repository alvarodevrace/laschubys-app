import { CurrencyPipe } from '@angular/common';
import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CartService } from '../../core/services/cart.service';
import { SeoService } from '../../core/services/seo.service';
import { CartItemRowComponent } from './cart-item-row.component';
import { ButtonComponent } from '../../shared/ui/button/button.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-cart',
  standalone: true,
  imports: [RouterLink, CurrencyPipe, CartItemRowComponent, ButtonComponent],
  template: `
    <section class="max-w-6xl mx-auto px-4 py-10 pb-8">
      <nav class="flex items-center gap-2 mb-4 text-sm text-gray-500" aria-label="Breadcrumb">
        <a routerLink="/">Inicio</a>
        <span>›</span>
        <a routerLink="/tienda">Tienda</a>
        <span>›</span>
        <span>Carrito</span>
      </nav>
      <p class="text-xs font-extrabold uppercase tracking-widest text-orange mb-1">Carrito</p>
      <h1>Tu selección actual.</h1>
      <p class="text-gray-500">
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

          <aside class="grid gap-4 p-5 rounded-3xl bg-gray-50 border border-gray-200 sticky top-4">
            <p class="text-xs font-extrabold uppercase tracking-widest text-orange mb-1">Resumen</p>
            <div class="flex justify-between gap-4 text-gray-500">
              <span>Items</span>
              <strong>{{ count() }}</strong>
            </div>
            <div class="flex justify-between gap-4 text-gray-500">
              <span>Subtotal</span>
              <strong>{{ total() | currency: 'USD' : 'symbol' : '1.0-0' }}</strong>
            </div>
            <div class="flex justify-between gap-4 text-gray-500">
              <span>Envío</span>
              <strong>Por calcular</strong>
            </div>
            <a
              class="inline-flex items-center justify-center min-h-12 px-6 rounded-full font-extrabold text-sm tracking-wide border border-transparent bg-orange text-white cursor-pointer transition-all duration-200 hover:bg-orange-dark hover:-translate-y-px"
              routerLink="/checkout"
              >Ir al checkout</a
            >
            <app-button variant="secondary" type="button" (click)="clear()"
              >Vaciar carrito</app-button
            >
          </aside>
        </div>
      } @else {
        <div class="p-10 rounded-3xl bg-gray-50 border border-gray-200 text-center">
          <h2 class="text-xl font-extrabold text-gray-900 mb-2">Tu carrito está vacío.</h2>
          <p class="text-gray-500 text-sm mb-5">
            Empieza por la tienda y arma tu selección con calma.
          </p>
          <a
            class="inline-flex items-center justify-center min-h-12 px-6 rounded-full font-extrabold text-sm tracking-wide border border-transparent bg-orange text-white cursor-pointer transition-all duration-200 hover:bg-orange-dark hover:-translate-y-px"
            routerLink="/tienda"
            >Ir a tienda</a
          >
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
