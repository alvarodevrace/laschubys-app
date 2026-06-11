import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { CheckoutForm } from '../../core/models/checkout.model';
import { ApiService } from '../../core/services/api.service';
import { CartService } from '../../core/services/cart.service';
import { SeoService } from '../../core/services/seo.service';
import { ButtonComponent } from '../../shared/ui/button/button.component';

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
  imports: [RouterLink, ReactiveFormsModule, CurrencyPipe, ButtonComponent],
  template: `
    <section class="max-w-6xl mx-auto px-4 py-10 pb-8">
      <nav class="flex items-center gap-2 mb-4 text-sm text-gray-500" aria-label="Breadcrumb">
        <a routerLink="/">Inicio</a>
        <span>›</span>
        <a routerLink="/carrito">Carrito</a>
        <span>›</span>
        <span>Checkout</span>
      </nav>
      <p class="text-xs font-extrabold uppercase tracking-widest text-orange mb-1">Checkout</p>
      <h1>Finalizar pedido.</h1>
      <p class="text-gray-500">Completa tus datos y deja listo el pedido para confirmacion.</p>
    </section>

    <section class="max-w-6xl mx-auto px-4">
      @if (!items().length) {
        <div class="p-10 rounded-3xl bg-gray-50 border border-gray-200 text-center">
          <h2 class="text-xl font-extrabold text-gray-900 mb-2">No hay productos para procesar.</h2>
          <p class="text-gray-500 text-sm mb-5">
            Vuelve a la tienda y agrega al menos un item al carrito.
          </p>
          <a
            class="inline-flex items-center justify-center min-h-12 px-6 rounded-full font-extrabold text-sm tracking-wide border border-transparent bg-orange text-white cursor-pointer transition-all duration-200 hover:bg-orange-dark hover:-translate-y-px"
            routerLink="/tienda"
            data-testid="checkout-empty-shop-link"
            >Ir a tienda</a
          >
        </div>
      } @else {
        <div class="grid grid-cols-1 lg:grid-cols-[1.35fr_0.8fr] gap-5 items-start">
          <form
            class="grid gap-4 p-5 rounded-3xl bg-gray-50 border border-gray-200"
            [formGroup]="checkoutForm"
            (ngSubmit)="submit()"
            data-testid="checkout-form"
          >
            <label class="grid gap-1.5">
              <span class="text-gray-500 text-sm">Nombre completo</span>
              <input
                class="min-h-12 px-4 rounded-2xl border border-gray-200 bg-white"
                formControlName="name"
                data-testid="checkout-input-name"
              />
              @if (checkoutForm.get('name')?.touched && checkoutForm.get('name')?.invalid) {
                <span class="checkout-error">Este campo es requerido</span>
              }
            </label>
            <label class="grid gap-1.5">
              <span class="text-gray-500 text-sm">Telefono</span>
              <input
                class="min-h-12 px-4 rounded-2xl border border-gray-200 bg-white"
                formControlName="phone"
                data-testid="checkout-input-phone"
              />
              @if (checkoutForm.get('phone')?.touched && checkoutForm.get('phone')?.invalid) {
                <span class="checkout-error">Este campo es requerido</span>
              }
            </label>
            <label class="grid gap-1.5">
              <span class="text-gray-500 text-sm">Correo</span>
              <input
                class="min-h-12 px-4 rounded-2xl border border-gray-200 bg-white"
                formControlName="email"
                type="email"
                data-testid="checkout-input-email"
              />
              @if (checkoutForm.get('email')?.touched && checkoutForm.get('email')?.invalid) {
                <span class="checkout-error">Correo inválido</span>
              }
            </label>
            <label class="grid gap-1.5">
              <span class="text-gray-500 text-sm">Provincia</span>
              <select
                class="min-h-12 px-4 rounded-2xl border border-gray-200 bg-white"
                formControlName="province"
                data-testid="checkout-input-province"
              >
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
            <label class="grid gap-1.5">
              <span class="text-gray-500 text-sm">Direccion completa</span>
              <textarea
                class="min-h-12 px-4 rounded-2xl border border-gray-200 bg-white min-h-[120px] resize-y"
                formControlName="address"
                rows="4"
                data-testid="checkout-input-address"
              ></textarea>
              @if (checkoutForm.get('address')?.touched && checkoutForm.get('address')?.invalid) {
                <span class="checkout-error">Este campo es requerido</span>
              }
            </label>

            @if (error()) {
              <p class="text-red-700">{{ error() }}</p>
            }

            @if (success()) {
              <p class="text-green-700">{{ success() }}</p>
            }

            <app-button
              variant="primary"
              type="submit"
              [disabled]="checkoutForm.invalid || pending()"
              data-testid="checkout-submit-btn"
            >
              {{ pending() ? 'Procesando...' : 'Confirmar pedido' }}
            </app-button>
          </form>

          <aside class="grid gap-4 p-5 rounded-3xl bg-gray-50 border border-gray-200">
            <p class="text-xs font-extrabold uppercase tracking-widest text-orange mb-1">Resumen</p>
            <div class="grid gap-3.5">
              @for (item of items(); track item.id) {
                <div class="flex justify-between gap-4 items-start">
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
            <div class="flex justify-between gap-4 pt-4 border-t border-gray-200 text-gray-900">
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
