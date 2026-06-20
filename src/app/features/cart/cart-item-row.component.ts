import { CurrencyPipe } from '@angular/common';
import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { lucideMinus, lucidePlus } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmIconImports } from '@spartan-ng/helm/icon';

import { CartItem } from '../../core/models/cart.model';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-cart-item-row',
  standalone: true,
  providers: [provideIcons({ lucideMinus, lucidePlus })],
  imports: [CurrencyPipe, HlmButtonImports, HlmIconImports],
  template: `
    <article
      class="grid grid-cols-[112px_1fr] gap-4 p-4 rounded-3xl bg-surface border border-border"
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
          <div class="inline-flex items-center gap-2">
            <button
              hlmBtn
              variant="outline"
              size="icon-sm"
              type="button"
              (click)="qtyChange.emit(item().qty - 1)"
              data-testid="cart-decrement-btn"
              aria-label="Disminuir cantidad"
            >
              <ng-icon hlmIcon name="lucideMinus" class="w-4 h-4" />
            </button>
            <span class="min-w-[1.5rem] text-center font-extrabold">{{ item().qty }}</span>
            <button
              hlmBtn
              variant="outline"
              size="icon-sm"
              type="button"
              (click)="qtyChange.emit(item().qty + 1)"
              data-testid="cart-increment-btn"
              aria-label="Aumentar cantidad"
            >
              <ng-icon hlmIcon name="lucidePlus" class="w-4 h-4" />
            </button>
          </div>
          <button
            hlmBtn
            variant="ghost"
            size="sm"
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
