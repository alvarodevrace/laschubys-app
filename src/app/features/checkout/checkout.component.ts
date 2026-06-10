import { CurrencyPipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { ApiService } from '../../core/services/api.service';
import { CartService } from '../../core/services/cart.service';
import { SeoService } from '../../core/services/seo.service';

interface CheckoutPayload {
  customer: {
    name: string;
    phone: string;
    email: string;
    province: string;
    address: string;
  };
  items: {
    id: string;
    name: string;
    qty: number;
    price: number;
    source: 'owned' | 'affiliate';
  }[];
  total: number;
}

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [RouterLink, FormsModule, CurrencyPipe],
  template: `
    <section class="page-wrap page-hero">
      <nav class="breadcrumb" aria-label="Breadcrumb">
        <a routerLink="/">Inicio</a>
        <span>›</span>
        <a routerLink="/carrito">Carrito</a>
        <span>›</span>
        <span>Checkout</span>
      </nav>
      <p class="section-eyebrow">Checkout</p>
      <h1>Finalizar pedido.</h1>
      <p class="page-copy">Completa tus datos y deja listo el pedido para confirmacion.</p>
    </section>

    <section class="page-wrap page-section">
      @if (!items().length) {
        <div class="empty-panel">
          <h2>No hay productos para procesar.</h2>
          <p>Vuelve a la tienda y agrega al menos un item al carrito.</p>
          <a class="button-primary" routerLink="/tienda">Ir a tienda</a>
        </div>
      } @else {
        <div class="checkout-layout">
          <form class="checkout-form" (ngSubmit)="submit()">
            <label>
              <span>Nombre completo</span>
              <input [(ngModel)]="form.name" name="name" required />
            </label>
            <label>
              <span>Telefono</span>
              <input [(ngModel)]="form.phone" name="phone" required />
            </label>
            <label>
              <span>Correo</span>
              <input [(ngModel)]="form.email" name="email" type="email" required />
            </label>
            <label>
              <span>Provincia</span>
              <select [(ngModel)]="form.province" name="province" required>
                <option value="">Selecciona</option>
                <option>Pichincha</option>
                <option>Guayas</option>
                <option>Azuay</option>
                <option>Manabi</option>
                <option>El Oro</option>
                <option>Otra</option>
              </select>
            </label>
            <label>
              <span>Direccion completa</span>
              <textarea [(ngModel)]="form.address" name="address" rows="4" required></textarea>
            </label>

            @if (error()) {
              <p class="checkout-message checkout-message--error">{{ error() }}</p>
            }

            @if (success()) {
              <p class="checkout-message checkout-message--success">{{ success() }}</p>
            }

            <button class="button-primary" type="submit" [disabled]="pending() || !isValid()">
              {{ pending() ? 'Procesando...' : 'Confirmar pedido' }}
            </button>
          </form>

          <aside class="checkout-summary">
            <p class="section-eyebrow">Resumen</p>
            <div class="checkout-items">
              @for (item of items(); track item.id) {
                <div class="checkout-item">
                  <div>
                    <strong>{{ item.name }}</strong>
                    <p>{{ item.qty }} x {{ item.price | currency: 'USD' : 'symbol' : '1.0-0' }}</p>
                  </div>
                  <span>{{ item.qty * item.price | currency: 'USD' : 'symbol' : '1.0-0' }}</span>
                </div>
              }
            </div>
            <div class="checkout-total">
              <span>Total</span>
              <strong>{{ total() | currency: 'USD' : 'symbol' : '1.0-0' }}</strong>
            </div>
          </aside>
        </div>
      }
    </section>
  `,
})
export class CheckoutComponent {
  private readonly api = inject(ApiService);
  private readonly cart = inject(CartService);
  private readonly seo = inject(SeoService);

  protected readonly items = this.cart.items;
  protected readonly total = this.cart.total;
  protected readonly pending = signal(false);
  protected readonly error = signal('');
  protected readonly success = signal('');
  protected readonly isValid = computed(
    () =>
      !!this.form.name.trim() &&
      !!this.form.phone.trim() &&
      !!this.form.email.trim() &&
      !!this.form.province.trim() &&
      !!this.form.address.trim(),
  );

  protected readonly form = {
    name: '',
    phone: '',
    email: '',
    province: '',
    address: '',
  };

  constructor() {
    this.seo.setPage(
      'Checkout | Las Chubys',
      'Completa tu compra en Las Chubys.',
      '/images/cats/iris4.jpeg',
      '/checkout',
    );
  }

  protected async submit() {
    if (!this.isValid() || !this.items().length) {
      return;
    }

    this.pending.set(true);
    this.error.set('');
    this.success.set('');

    const payload: CheckoutPayload = {
      customer: { ...this.form },
      items: this.items().map((item) => ({
        id: item.id,
        name: item.name,
        qty: item.qty,
        price: item.price,
        source: item.source,
      })),
      total: this.total(),
    };

    try {
      await this.api.post('/api/checkout', payload);
      this.success.set('Pedido recibido. Revisa WhatsApp o correo para el siguiente paso.');
      this.cart.clearCart();
    } catch (error) {
      this.error.set(error instanceof Error ? error.message : 'No se pudo enviar el pedido.');
    } finally {
      this.pending.set(false);
    }
  }
}
