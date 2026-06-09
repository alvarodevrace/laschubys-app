import { CurrencyPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-cart-drawer',
  standalone: true,
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './cart-drawer.component.html',
  styleUrl: './cart-drawer.component.scss',
})
export class CartDrawerComponent {
  private readonly cart = inject(CartService);

  protected readonly items = this.cart.items;
  protected readonly total = this.cart.total;
  protected readonly isOpen = this.cart.isOpen;

  protected close() {
    this.cart.close();
  }

  protected clear() {
    this.cart.clearCart();
  }

  protected remove(id: string) {
    this.cart.removeItem(id);
  }
}
