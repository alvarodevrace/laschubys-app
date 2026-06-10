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
})
export class CartItemRowComponent {
  readonly item = input.required<CartItem>();
  readonly qtyChange = output<number>();
  readonly remove = output<void>();
}
