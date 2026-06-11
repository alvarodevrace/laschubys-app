import { CurrencyPipe } from '@angular/common';
import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';

import { ProductPick } from '../../core/models/content.model';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-product-card',
  standalone: true,
  imports: [CurrencyPipe],
  template: `
    <article class="product-card">
      <div class="product-card__badge">
        {{ product().source === 'owned' ? 'Las Chubys' : 'Afiliado' }}
      </div>
      <img
        [src]="product().images[0] || '/images/cats/iris4.jpeg'"
        [alt]="product().name"
        loading="lazy"
      />
      <div class="product-card__body">
        <p class="product-card__tag">{{ product().tag }}</p>
        <h3>{{ product().name }}</h3>
        <p class="product-card__copy">{{ product().copy || product().description }}</p>
        <strong>{{ product().priceValue | currency: 'USD' : 'symbol' : '1.0-0' }}</strong>
      </div>
      <div class="product-card__actions">
        <button class="button-secondary" type="button" (click)="preview.emit(product())">
          Ver rápido
        </button>
        <button class="button-primary" type="button" (click)="add.emit(product())">
          {{ product().source === 'owned' ? 'Agregar' : 'Guardar pick' }}
        </button>
      </div>
    </article>
  `,
})
export class ProductCardComponent {
  readonly product = input.required<ProductPick>();
  readonly add = output<ProductPick>();
  readonly preview = output<ProductPick>();
}
