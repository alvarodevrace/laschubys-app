import { CurrencyPipe } from '@angular/common';
import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';

import { CartItem } from '../../core/models/cart.model';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-cart-item-row',
  standalone: true,
  imports: [CurrencyPipe],
  template: `
    <article
      class="grid grid-cols-[112px_1fr] gap-4 p-4 rounded-3xl bg-gray-50 border border-gray-200"
    >
      <img
        class="w-28 h-28 object-cover rounded-2xl"
        [src]="item().image"
        [alt]="item().name"
        loading="lazy"
      />
      <div class="flex flex-col justify-between gap-4">
        <div>
          <h3>{{ item().name }}</h3>
          <p>
            {{ item().price | currency: 'USD' : 'symbol' : '1.0-0' }} ·
            {{ item().source === 'owned' ? 'Las Chubys' : 'Afiliado' }}
          </p>
        </div>
        <div class="flex justify-between gap-4">
          <div class="inline-flex items-center gap-3 px-2 py-1 rounded-full border border-gray-200">
            <button
              class="border-0 bg-transparent cursor-pointer text-gray-700"
              type="button"
              (click)="qtyChange.emit(item().qty - 1)"
              data-testid="cart-decrement-btn"
            >
              -
            </button>
            <span>{{ item().qty }}</span>
            <button
              class="border-0 bg-transparent cursor-pointer text-gray-700"
              type="button"
              (click)="qtyChange.emit(item().qty + 1)"
              data-testid="cart-increment-btn"
            >
              +
            </button>
          </div>
          <button
            class="border-0 bg-transparent cursor-pointer text-gray-700"
            type="button"
            (click)="remove.emit()"
            data-testid="cart-remove-btn"
          >
            Eliminar
          </button>
        </div>
      </div>
    </article>
  `,
})
export class CartItemRowComponent {
  readonly item = input.required<CartItem>();
  readonly qtyChange = output<number>();
  readonly remove = output<void>();
}
