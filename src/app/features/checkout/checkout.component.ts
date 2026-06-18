import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { CheckoutForm } from '../../core/models/checkout.model';
import { ApiService } from '../../core/services/api.service';
import { CartService } from '../../core/services/cart.service';
import { SeoService } from '../../core/services/seo.service';
import { ButtonComponent } from '../../shared/ui/button/button.component';
import { ScrollRevealDirective } from '../../shared/animations';

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
  imports: [RouterLink, ReactiveFormsModule, CurrencyPipe, ButtonComponent, ScrollRevealDirective],
  template: `
    <section class="py-10 pb-8" appScrollReveal>
      <div class="max-w-6xl mx-auto px-4">
        <nav class="flex items-center gap-2 mb-4 text-sm text-gray-500" aria-label="Breadcrumb">
          <a routerLink="/">Inicio</a>
          <span>›</span>
          <a routerLink="/tienda">Tienda</a>
          <span>›</span>
          <span class="text-gray-900 font-medium">Carrito</span>
        </nav>
        <h1
          class="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight text-orange mb-2"
        >
          Mi Carrito de Compras
        </h1>
        <p class="text-gray-500 max-w-2xl">
          Revisa tus productos y completa tus datos para finalizar el pedido.
        </p>
      </div>
    </section>

    <section class="max-w-6xl mx-auto px-4 pb-16">
      @if (!items().length) {
        <div class="p-10 rounded-3xl bg-gray-50 border border-gray-200 text-center" appScrollReveal>
          <h2 class="text-xl font-extrabold text-gray-900 mb-2">No hay productos para procesar.</h2>
          <p class="text-gray-500 text-sm mb-5">
            Vuelve a la tienda y agrega al menos un item al carrito.
          </p>
          <a
            class="inline-flex items-center justify-center min-h-12 px-6 rounded-full font-extrabold text-sm tracking-wide bg-orange text-white hover:bg-orange-dark transition-colors"
            routerLink="/tienda"
            data-testid="checkout-empty-shop-link"
            >Ir a tienda</a
          >
        </div>
      } @else {
        <div class="grid grid-cols-1 lg:grid-cols-[1.4fr_0.8fr] gap-6 items-start">
          <!-- Product table -->
          <div
            class="p-5 rounded-3xl bg-white border border-gray-200 overflow-x-auto"
            appScrollReveal
          >
            <table class="w-full min-w-[600px] text-sm">
              <thead>
                <tr class="border-b border-gray-200 text-left text-gray-500">
                  <th class="pb-3 font-extrabold">Producto</th>
                  <th class="pb-3 font-extrabold">Envío</th>
                  <th class="pb-3 font-extrabold">Precio</th>
                  <th class="pb-3 font-extrabold">Cantidad</th>
                  <th class="pb-3 font-extrabold text-right">Total</th>
                  <th class="pb-3"></th>
                </tr>
              </thead>
              <tbody>
                @for (item of items(); track item.id) {
                  <tr class="border-b border-gray-100 last:border-0">
                    <td class="py-4">
                      <div class="flex items-center gap-3">
                        <img
                          [src]="item.image"
                          [alt]="item.name"
                          class="w-16 h-16 object-cover rounded-xl"
                        />
                        <div>
                          <p class="font-extrabold text-gray-900">{{ item.name }}</p>
                          <p class="text-xs text-gray-500">
                            {{ item.source === 'owned' ? 'Las Chubys' : 'Afiliado' }}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td class="py-4 text-gray-500">a calcular</td>
                    <td class="py-4 font-bold">
                      {{ item.price | currency: 'USD' : 'symbol' : '1.0-0' }}
                    </td>
                    <td class="py-4">
                      <div class="flex items-center gap-2">
                        <button
                          type="button"
                          class="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:border-orange hover:text-orange"
                          (click)="updateQty(item.id, item.qty - 1)"
                        >
                          -
                        </button>
                        <span class="min-w-[1.5rem] text-center font-extrabold">{{
                          item.qty
                        }}</span>
                        <button
                          type="button"
                          class="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:border-orange hover:text-orange"
                          (click)="updateQty(item.id, item.qty + 1)"
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td class="py-4 text-right font-extrabold">
                      {{ item.qty * item.price | currency: 'USD' : 'symbol' : '1.0-0' }}
                    </td>
                    <td class="py-4 text-right">
                      <button
                        type="button"
                        class="p-1 text-gray-400 hover:text-red-500"
                        (click)="removeItem(item.id)"
                        aria-label="Eliminar"
                      >
                        <svg
                          class="w-4 h-4"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        >
                          <line x1="18" y1="6" x2="6" y2="18"></line>
                          <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                      </button>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>

          <!-- Summary + form -->
          <div class="grid gap-5">
            <aside
              class="p-5 rounded-3xl bg-gray-50 border border-gray-200"
              appScrollReveal
              [delay]="0.1"
            >
              <p class="text-xs font-extrabold uppercase tracking-widest text-orange mb-3">
                Resumen
              </p>
              <div class="grid gap-3 text-sm">
                <div class="flex justify-between">
                  <span class="text-gray-600">Subtotal</span>
                  <span class="font-bold">{{
                    total() | currency: 'USD' : 'symbol' : '1.0-0'
                  }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Impuestos</span>
                  <span class="font-bold">$0</span>
                </div>
                <div class="flex justify-between pt-3 border-t border-gray-200 text-base">
                  <span class="font-extrabold text-gray-900">TOTAL</span>
                  <strong class="font-extrabold text-orange">{{
                    total() | currency: 'USD' : 'symbol' : '1.0-0'
                  }}</strong>
                </div>
              </div>
            </aside>

            <form
              class="grid gap-4 p-5 rounded-3xl bg-white border border-gray-200"
              appScrollReveal
              [delay]="0.2"
              [formGroup]="checkoutForm"
              (ngSubmit)="submit()"
              data-testid="checkout-form"
            >
              <p class="text-xs font-extrabold uppercase tracking-widest text-orange">
                Datos de entrega
              </p>
              <label class="grid gap-1.5">
                <span class="text-gray-500 text-sm">Nombre completo *</span>
                <input
                  class="min-h-11 px-4 rounded-2xl border border-gray-200 bg-white"
                  formControlName="name"
                  data-testid="checkout-input-name"
                />
              </label>
              <label class="grid gap-1.5">
                <span class="text-gray-500 text-sm">Teléfono *</span>
                <input
                  class="min-h-11 px-4 rounded-2xl border border-gray-200 bg-white"
                  formControlName="phone"
                  data-testid="checkout-input-phone"
                />
              </label>
              <label class="grid gap-1.5">
                <span class="text-gray-500 text-sm">Correo *</span>
                <input
                  class="min-h-11 px-4 rounded-2xl border border-gray-200 bg-white"
                  formControlName="email"
                  type="email"
                  data-testid="checkout-input-email"
                />
              </label>
              <label class="grid gap-1.5">
                <span class="text-gray-500 text-sm">Provincia *</span>
                <select
                  class="min-h-11 px-4 rounded-2xl border border-gray-200 bg-white"
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
              </label>
              <label class="grid gap-1.5">
                <span class="text-gray-500 text-sm">Dirección completa *</span>
                <textarea
                  class="min-h-[100px] px-4 py-3 rounded-2xl border border-gray-200 bg-white resize-y"
                  formControlName="address"
                  rows="3"
                  data-testid="checkout-input-address"
                ></textarea>
              </label>

              @if (error()) {
                <p class="text-red-600 text-sm">{{ error() }}</p>
              }
              @if (success()) {
                <p class="text-green-600 text-sm">{{ success() }}</p>
              }

              <label class="flex items-start gap-2 text-sm text-gray-600">
                <input type="checkbox" class="mt-1" required />
                <span>Acepto los términos y condiciones</span>
              </label>

              <app-button
                variant="primary"
                type="submit"
                [disabled]="checkoutForm.invalid || pending()"
                data-testid="checkout-submit-btn"
              >
                {{ pending() ? 'Procesando...' : 'Finalizar compra' }}
              </app-button>
            </form>
          </div>
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

  protected updateQty(id: string, qty: number) {
    this.cart.updateQty(id, qty);
  }

  protected removeItem(id: string) {
    this.cart.removeItem(id);
  }

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
