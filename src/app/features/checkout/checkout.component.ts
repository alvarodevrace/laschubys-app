import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { provideIcons } from '@ng-icons/core';
import { lucideAlertCircle, lucideCheckCircle, lucideX } from '@ng-icons/lucide';

import { HlmBreadcrumbImports } from '@spartan-ng/helm/breadcrumb';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmCheckbox } from '@spartan-ng/helm/checkbox';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmInput } from '@spartan-ng/helm/input';
import { HlmLabel } from '@spartan-ng/helm/label';
import { HlmSelectImports } from '@spartan-ng/helm/select';
import { HlmSeparator } from '@spartan-ng/helm/separator';
import { HlmTableImports } from '@spartan-ng/helm/table';
import { HlmTextarea } from '@spartan-ng/helm/textarea';
import { HlmAlertImports } from '@spartan-ng/helm/alert';

import { CheckoutForm } from '../../core/models/checkout.model';
import { ApiService } from '../../core/services/api.service';
import { CartService } from '../../core/services/cart.service';
import { SeoService } from '../../core/services/seo.service';
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
  imports: [
    RouterLink,
    ReactiveFormsModule,
    CurrencyPipe,
    HlmBreadcrumbImports,
    HlmButtonImports,
    HlmCardImports,
    HlmCheckbox,
    HlmIconImports,
    HlmInput,
    HlmLabel,
    HlmSelectImports,
    HlmSeparator,
    HlmTableImports,
    HlmTextarea,
    HlmAlertImports,
    ScrollRevealDirective,
  ],
  providers: [provideIcons({ lucideAlertCircle, lucideCheckCircle, lucideX })],
  template: `
    <section class="py-10 pb-8" appScrollReveal>
      <div class="max-w-6xl mx-auto px-4">
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
        <h1
          class="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight text-primary mb-2"
        >
          Mi Carrito de Compras
        </h1>
        <p class="text-muted-foreground max-w-2xl">
          Revisa tus productos y completa tus datos para finalizar el pedido.
        </p>
      </div>
    </section>

    <section class="max-w-6xl mx-auto px-4 pb-16">
      @if (!items().length) {
        <section hlmCard class="text-center" appScrollReveal>
          <div hlmCardHeader>
            <h2 hlmCardTitle>No hay productos para procesar.</h2>
          </div>
          <div hlmCardContent>
            <p class="text-muted-foreground text-sm">
              Vuelve a la tienda y agrega al menos un item al carrito.
            </p>
          </div>
          <div hlmCardFooter class="justify-center">
            <a hlmBtn routerLink="/tienda" size="lg" data-testid="checkout-empty-shop-link"
              >Ir a tienda</a
            >
          </div>
        </section>
      } @else {
        <div class="grid grid-cols-1 lg:grid-cols-[1.4fr_0.8fr] gap-6 items-start">
          <!-- Product table -->
          <section hlmCard appScrollReveal>
            <div hlmCardContent class="overflow-x-auto">
              <table hlmTable class="min-w-[600px]">
                <thead hlmTableHeader>
                  <tr hlmTableRow>
                    <th hlmTableHead>Producto</th>
                    <th hlmTableHead>Envío</th>
                    <th hlmTableHead>Precio</th>
                    <th hlmTableHead>Cantidad</th>
                    <th hlmTableHead class="text-right">Total</th>
                    <th hlmTableHead></th>
                  </tr>
                </thead>
                <tbody hlmTableBody>
                  @for (item of items(); track item.id) {
                    <tr hlmTableRow>
                      <td hlmTableCell>
                        <div class="flex items-center gap-3">
                          <img
                            [src]="item.image"
                            [alt]="item.name"
                            class="w-16 h-16 object-cover rounded-xl"
                          />
                          <div>
                            <p class="font-extrabold text-foreground">{{ item.name }}</p>
                            <p class="text-xs text-muted-foreground">
                              {{ item.source === 'owned' ? 'Las Chubys' : 'Afiliado' }}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td hlmTableCell class="text-muted-foreground">a calcular</td>
                      <td hlmTableCell class="font-bold">
                        {{ item.price | currency: 'USD' : 'symbol' : '1.0-0' }}
                      </td>
                      <td hlmTableCell>
                        <div class="flex items-center gap-2">
                          <button
                            hlmBtn
                            variant="outline"
                            size="icon-sm"
                            type="button"
                            (click)="updateQty(item.id, item.qty - 1)"
                            aria-label="Disminuir cantidad"
                          >
                            -
                          </button>
                          <span class="min-w-[1.5rem] text-center font-extrabold">{{
                            item.qty
                          }}</span>
                          <button
                            hlmBtn
                            variant="outline"
                            size="icon-sm"
                            type="button"
                            (click)="updateQty(item.id, item.qty + 1)"
                            aria-label="Aumentar cantidad"
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td hlmTableCell class="text-right font-extrabold">
                        {{ item.qty * item.price | currency: 'USD' : 'symbol' : '1.0-0' }}
                      </td>
                      <td hlmTableCell class="text-right">
                        <button
                          hlmBtn
                          variant="ghost"
                          size="icon-sm"
                          type="button"
                          (click)="removeItem(item.id)"
                          aria-label="Eliminar"
                        >
                          <ng-icon hlmIcon name="lucideX" class="w-4 h-4"></ng-icon>
                        </button>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </section>

          <!-- Summary + form -->
          <div class="grid gap-5">
            <aside hlmCard appScrollReveal [delay]="0.1">
              <div hlmCardHeader>
                <p class="text-xs font-extrabold uppercase tracking-widest text-primary">Resumen</p>
              </div>
              <div hlmCardContent class="grid gap-3 text-sm">
                <div class="flex justify-between">
                  <span class="text-muted-foreground">Subtotal</span>
                  <span class="font-bold">{{
                    total() | currency: 'USD' : 'symbol' : '1.0-0'
                  }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-muted-foreground">Impuestos</span>
                  <span class="font-bold">$0</span>
                </div>
                <div hlmSeparator></div>
                <div class="flex justify-between text-base">
                  <span class="font-extrabold text-foreground">TOTAL</span>
                  <strong class="font-extrabold text-primary">{{
                    total() | currency: 'USD' : 'symbol' : '1.0-0'
                  }}</strong>
                </div>
              </div>
            </aside>

            <form
              hlmCard
              [formGroup]="checkoutForm"
              (ngSubmit)="submit()"
              data-testid="checkout-form"
              appScrollReveal
              [delay]="0.2"
            >
              <div hlmCardHeader>
                <p class="text-xs font-extrabold uppercase tracking-widest text-primary">
                  Datos de entrega
                </p>
              </div>

              <div hlmCardContent class="grid gap-4">
                <label class="grid gap-1.5">
                  <span hlmLabel>Nombre completo *</span>
                  <input hlmInput formControlName="name" data-testid="checkout-input-name" />
                </label>

                <label class="grid gap-1.5">
                  <span hlmLabel>Teléfono *</span>
                  <input
                    hlmInput
                    formControlName="phone"
                    type="tel"
                    data-testid="checkout-input-phone"
                  />
                </label>

                <label class="grid gap-1.5">
                  <span hlmLabel>Correo *</span>
                  <input
                    hlmInput
                    formControlName="email"
                    type="email"
                    data-testid="checkout-input-email"
                  />
                </label>

                <label class="grid gap-1.5">
                  <span hlmLabel>Provincia *</span>
                  <hlm-select formControlName="province" data-testid="checkout-input-province">
                    <hlm-select-trigger>
                      <hlm-select-value placeholder="Selecciona"></hlm-select-value>
                    </hlm-select-trigger>
                    <hlm-select-content>
                      <hlm-select-item value="">Selecciona</hlm-select-item>
                      <hlm-select-item value="Pichincha">Pichincha</hlm-select-item>
                      <hlm-select-item value="Guayas">Guayas</hlm-select-item>
                      <hlm-select-item value="Azuay">Azuay</hlm-select-item>
                      <hlm-select-item value="Manabi">Manabi</hlm-select-item>
                      <hlm-select-item value="El Oro">El Oro</hlm-select-item>
                      <hlm-select-item value="Otra">Otra</hlm-select-item>
                    </hlm-select-content>
                  </hlm-select>
                </label>

                <label class="grid gap-1.5">
                  <span hlmLabel>Dirección completa *</span>
                  <textarea
                    hlmTextarea
                    formControlName="address"
                    rows="3"
                    class="min-h-[100px]"
                    data-testid="checkout-input-address"
                  ></textarea>
                </label>

                @if (error()) {
                  <div hlmAlert variant="destructive">
                    <ng-icon hlmIcon name="lucideAlertCircle" class="w-4 h-4" />
                    <h4 hlmAlertTitle>Error</h4>
                    <p hlmAlertDescription>{{ error() }}</p>
                  </div>
                }
                @if (success()) {
                  <div hlmAlert>
                    <ng-icon hlmIcon name="lucideCheckCircle" class="w-4 h-4" />
                    <h4 hlmAlertTitle>Pedido enviado</h4>
                    <p hlmAlertDescription>{{ success() }}</p>
                  </div>
                }

                <label class="flex items-start gap-2 text-sm text-muted-foreground">
                  <hlm-checkbox
                    [checked]="termsAccepted()"
                    (checkedChange)="termsAccepted.set($event)"
                  />
                  <span>Acepto los términos y condiciones</span>
                </label>
              </div>

              <div hlmCardFooter>
                <button
                  hlmBtn
                  type="submit"
                  size="lg"
                  class="w-full"
                  [disabled]="checkoutForm.invalid || pending() || !termsAccepted()"
                  data-testid="checkout-submit-btn"
                >
                  {{ pending() ? 'Procesando...' : 'Finalizar compra' }}
                </button>
              </div>
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
  protected readonly termsAccepted = signal(false);

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
    if (this.checkoutForm.invalid || !this.items().length || !this.termsAccepted()) {
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
      this.termsAccepted.set(false);
    } catch (error) {
      this.error.set(error instanceof Error ? error.message : 'No se pudo enviar el pedido.');
    } finally {
      this.pending.set(false);
    }
  }
}
