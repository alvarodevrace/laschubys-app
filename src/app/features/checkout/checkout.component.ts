import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { CheckoutForm } from '../../core/models/checkout.model';
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
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-checkout',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CurrencyPipe],
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
          <a class="button-primary" routerLink="/tienda" data-testid="checkout-empty-shop-link"
            >Ir a tienda</a
          >
        </div>
      } @else {
        <div class="checkout-layout">
          <form
            class="checkout-form"
            [formGroup]="checkoutForm"
            (ngSubmit)="submit()"
            data-testid="checkout-form"
          >
            <label>
              <span>Nombre completo</span>
              <input formControlName="name" data-testid="checkout-input-name" />
              @if (checkoutForm.get('name')?.touched && checkoutForm.get('name')?.invalid) {
                <span class="checkout-error">Este campo es requerido</span>
              }
            </label>
            <label>
              <span>Telefono</span>
              <input formControlName="phone" data-testid="checkout-input-phone" />
              @if (checkoutForm.get('phone')?.touched && checkoutForm.get('phone')?.invalid) {
                <span class="checkout-error">Este campo es requerido</span>
              }
            </label>
            <label>
              <span>Correo</span>
              <input formControlName="email" type="email" data-testid="checkout-input-email" />
              @if (checkoutForm.get('email')?.touched && checkoutForm.get('email')?.invalid) {
                <span class="checkout-error">Correo inválido</span>
              }
            </label>
            <label>
              <span>Provincia</span>
              <select formControlName="province" data-testid="checkout-input-province">
                <option value="">Selecciona</option>
                <option>Pichincha</option>
                <option>Guayas</option>
                <option>Azuay</option>
                <option>Manabi</option>
                <option>El Oro</option>
                <option>Otra</option>
              </select>
              @if (checkoutForm.get('province')?.touched && checkoutForm.get('province')?.invalid) {
                <span class="checkout-error">Este campo es requerido</span>
              }
            </label>
            <label>
              <span>Direccion completa</span>
              <textarea
                formControlName="address"
                rows="4"
                data-testid="checkout-input-address"
              ></textarea>
              @if (checkoutForm.get('address')?.touched && checkoutForm.get('address')?.invalid) {
                <span class="checkout-error">Este campo es requerido</span>
              }
            </label>

            @if (error()) {
              <p class="checkout-message checkout-message--error">{{ error() }}</p>
            }

            @if (success()) {
              <p class="checkout-message checkout-message--success">{{ success() }}</p>
            }

            <button
              class="button-primary"
              type="submit"
              [disabled]="checkoutForm.invalid || pending()"
              data-testid="checkout-submit-btn"
            >
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
                    <p>
                      {{ item.qty }}
                      x {{ item.price | currency: 'USD' : 'symbol' : '1.0-0' }}
                    </p>
                  </div>
                  <span>
                    {{ item.qty * item.price | currency: 'USD' : 'symbol' : '1.0-0' }}
                  </span>
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
  private readonly fb = inject(FormBuilder);

  protected readonly items = this.cart.items;
  protected readonly total = this.cart.total;
  protected readonly pending = signal(false);
  protected readonly error = signal('');
  protected readonly success = signal('');

  protected readonly checkoutForm = this.fb.group<CheckoutForm>({
    name: this.fb.control('', { nonNullable: true, validators: Validators.required }),
    phone: this.fb.control('', { nonNullable: true, validators: Validators.required }),
    email: this.fb.control('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    province: this.fb.control('', { nonNullable: true, validators: Validators.required }),
    address: this.fb.control('', { nonNullable: true, validators: Validators.required }),
  });

  constructor() {
    this.seo.setPage(
      'Checkout | Las Chubys',
      'Completa tu compra en Las Chubys.',
      '/images/cats/iris4.jpeg',
      '/checkout',
    );
  }

  protected async submit() {
    if (this.checkoutForm.invalid || !this.items().length) {
      this.checkoutForm.markAllAsTouched();
      return;
    }

    this.pending.set(true);
    this.error.set('');
    this.success.set('');

    const value = this.checkoutForm.value;

    const payload: CheckoutPayload = {
      customer: {
        name: value.name ?? '',
        phone: value.phone ?? '',
        email: value.email ?? '',
        province: value.province ?? '',
        address: value.address ?? '',
      },
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
      this.checkoutForm.reset();
    } catch (error) {
      this.error.set(error instanceof Error ? error.message : 'No se pudo enviar el pedido.');
    } finally {
      this.pending.set(false);
    }
  }
}
