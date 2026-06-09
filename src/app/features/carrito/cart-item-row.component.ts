import { CurrencyPipe } from '@angular/common';
import { Component, input, output } from '@angular/core';

import { CartItem } from '../../core/models/cart.model';

@Component({
  selector: 'app-cart-item-row',
  standalone: true,
  imports: [CurrencyPipe],
  template: `
    <article class="cart-item">
      <img [src]="item().image" [alt]="item().name" loading="lazy" />
      <div class="cart-item__body">
        <div>
          <h3>{{ item().name }}</h3>
          <p>
            {{ item().price | currency: 'USD' : 'symbol' : '1.0-0' }} ·
            {{ item().source === 'owned' ? 'Las Chubys' : 'Afiliado' }}
          </p>
        </div>
        <div class="cart-item__footer">
          <div class="qty-stepper">
            <button type="button" (click)="qtyChange.emit(item().qty - 1)">-</button>
            <span>{{ item().qty }}</span>
            <button type="button" (click)="qtyChange.emit(item().qty + 1)">+</button>
          </div>
          <button class="cart-item__remove" type="button" (click)="remove.emit()">Eliminar</button>
        </div>
      </div>
    </article>
  `,
  styles: [
    `
      .cart-item {
        display: grid;
        grid-template-columns: 112px minmax(0, 1fr);
        gap: 1rem;
        padding: 1rem;
        border-radius: 24px;
        background: var(--gray-50);
        border: 1px solid var(--border);
      }

      .cart-item img {
        width: 112px;
        height: 112px;
        object-fit: cover;
        border-radius: 18px;
      }

      .cart-item__body,
      .cart-item__footer {
        display: flex;
        justify-content: space-between;
        gap: 1rem;
      }

      .cart-item__body {
        flex-direction: column;
      }

      h3,
      p {
        margin: 0;
      }

      p {
        color: var(--text-muted);
        margin-top: 0.35rem;
      }

      .qty-stepper {
        display: inline-flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.35rem 0.5rem;
        border-radius: 999px;
        border: 1px solid var(--border);
      }

      .qty-stepper button,
      .cart-item__remove {
        border: 0;
        background: none;
        font: inherit;
        cursor: pointer;
      }
    `,
  ],
})
export class CartItemRowComponent {
  readonly item = input.required<CartItem>();
  readonly qtyChange = output<number>();
  readonly remove = output<void>();
}
