import { CurrencyPipe } from '@angular/common';
import { Component, input, output } from '@angular/core';

import { ProductPick } from '../../core/models/content.model';

@Component({
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
  styles: [
    `
      .product-card {
        position: relative;
        display: grid;
        gap: 1rem;
        padding: 1rem;
        border-radius: 28px;
        background: var(--gray-50);
        border: 1px solid var(--border);
        box-shadow: 0 18px 44px rgba(0, 0, 0, 0.05);
      }

      .product-card img {
        width: 100%;
        aspect-ratio: 1 / 1;
        object-fit: cover;
        border-radius: 22px;
        display: block;
      }

      .product-card__badge {
        position: absolute;
        top: 1.2rem;
        left: 1.2rem;
        padding: 0.35rem 0.7rem;
        border-radius: 999px;
        background: rgba(255, 122, 26, 0.92);
        color: var(--white);
        font-size: 0.76rem;
        font-weight: 800;
      }

      .product-card__body h3,
      .product-card__body p,
      .product-card__body strong {
        margin: 0;
      }

      .product-card__body {
        display: grid;
        gap: 0.55rem;
      }

      .product-card__tag,
      .product-card__copy {
        color: var(--text-muted);
      }

      .product-card__actions {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 0.75rem;
      }
    `,
  ],
})
export class ProductCardComponent {
  readonly product = input.required<ProductPick>();
  readonly add = output<ProductPick>();
  readonly preview = output<ProductPick>();
}
