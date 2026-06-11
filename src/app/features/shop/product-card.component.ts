import { CurrencyPipe } from '@angular/common';
import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';

import { ProductPick } from '../../core/models/content.model';
import { ButtonComponent } from '../../shared/ui/button/button.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-product-card',
  standalone: true,
  imports: [CurrencyPipe, ButtonComponent],
  template: `
    <article
      class="relative grid gap-4 p-4 rounded-3xl bg-gray-50 border border-gray-200 shadow-[0_18px_44px_rgba(0,0,0,0.05)]"
    >
      <div
        class="absolute top-4 left-4 px-3 py-1 rounded-full text-white text-xs font-extrabold bg-[rgba(255,122,26,0.92)]"
      >
        {{ product().source === 'owned' ? 'Las Chubys' : 'Afiliado' }}
      </div>
      <img
        class="w-full aspect-square object-cover rounded-2xl block"
        [src]="product().images[0] || '/images/cats/iris4.jpeg'"
        [alt]="product().name"
        loading="lazy"
      />
      <div class="grid gap-1.5">
        <p class="text-gray-500 text-sm m-0">{{ product().tag }}</p>
        <h3 class="m-0">{{ product().name }}</h3>
        <p class="text-gray-500 text-sm m-0">{{ product().copy || product().description }}</p>
        <strong class="m-0">{{
          product().priceValue | currency: 'USD' : 'symbol' : '1.0-0'
        }}</strong>
      </div>
      <div class="grid grid-cols-2 gap-3">
        <app-button variant="secondary" type="button" (click)="preview.emit(product())">
          Ver rápido
        </app-button>
        <app-button variant="primary" type="button" (click)="add.emit(product())">
          {{ product().source === 'owned' ? 'Agregar' : 'Guardar pick' }}
        </app-button>
      </div>
    </article>
  `,
})
export class ProductCardComponent {
  readonly product = input.required<ProductPick>();
  readonly add = output<ProductPick>();
  readonly preview = output<ProductPick>();
}
