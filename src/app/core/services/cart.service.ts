import { computed, inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import { CartItem } from '../models/cart.model';
import { ProductPick } from '../models/content.model';

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly storageKey = 'lch_cart';
  private readonly _items = signal<CartItem[]>(this.loadFromStorage());
  private readonly _isOpen = signal(false);

  readonly items = this._items.asReadonly();
  readonly isOpen = this._isOpen.asReadonly();
  readonly count = computed(() => this._items().reduce((acc, item) => acc + item.qty, 0));
  readonly total = computed(() => this._items().reduce((acc, item) => acc + item.qty * item.price, 0));

  addItem(product: ProductPick) {
    const items = [...this._items()];
    const existing = items.find((item) => item.id === product.id);

    if (existing) {
      existing.qty += 1;
    } else {
      items.push({
        id: product.id,
        name: product.name,
        price: product.priceValue,
        qty: 1,
        image: product.images[0] || '/images/cats/iris4.jpeg',
        source: product.source,
        affiliateUrl: product.affiliateUrl,
      });
    }

    this._items.set(items);
    this.persist();
    this.open();
  }

  updateQty(id: string, qty: number) {
    if (qty <= 0) {
      this.removeItem(id);
      return;
    }

    this._items.update((items) =>
      items.map((item) => (item.id === id ? { ...item, qty } : item))
    );
    this.persist();
  }

  removeItem(id: string) {
    this._items.update((items) => items.filter((item) => item.id !== id));
    this.persist();
  }

  clearCart() {
    this._items.set([]);
    this.persist();
  }

  open() {
    this._isOpen.set(true);
  }

  close() {
    this._isOpen.set(false);
  }

  toggle() {
    this._isOpen.update((open) => !open);
  }

  private loadFromStorage() {
    if (!isPlatformBrowser(this.platformId)) {
      return [];
    }

    try {
      const raw = localStorage.getItem(this.storageKey);
      return raw ? (JSON.parse(raw) as CartItem[]) : [];
    } catch {
      return [];
    }
  }

  private persist() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    localStorage.setItem(this.storageKey, JSON.stringify(this._items()));
  }
}
