import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';

import { CartService } from '../../../core/services/cart.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-cart-drawer',
  standalone: true,
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './cart-drawer.component.html',
})
export class CartDrawerComponent {
  private readonly cart = inject(CartService);
  private readonly router = inject(Router);

  protected readonly items = this.cart.items;
  protected readonly total = this.cart.total;
  protected readonly count = this.cart.count;
  protected readonly isOpen = this.cart.isOpen;

  protected close() {
    this.cart.close();
  }

  protected increment(id: string, qty: number) {
    this.cart.updateQty(id, qty + 1);
  }

  protected decrement(id: string, qty: number) {
    if (qty <= 1) {
      this.cart.removeItem(id);
    } else {
      this.cart.updateQty(id, qty - 1);
    }
  }

  protected remove(id: string) {
    this.cart.removeItem(id);
  }

  protected continueShopping() {
    this.close();
  }

  protected goToCheckout() {
    this.close();
    void this.router.navigate(['/checkout']);
  }
}
