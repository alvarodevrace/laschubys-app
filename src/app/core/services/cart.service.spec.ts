import { TestBed } from '@angular/core/testing';
import { PLATFORM_ID } from '@angular/core';

import type { CartItem } from '../models/cart.model';
import type { ProductPick } from '../models/content.model';
import { CartService } from './cart.service';

const STORAGE_KEY = 'lch_cart';

function makeProduct(id = 'p1'): ProductPick {
  return {
    id,
    tag: 'juguete',
    source: 'owned',
    audience: 'michis',
    name: `Producto ${id}`,
    price: '9.99',
    priceValue: 9.99,
    copy: 'copy',
    description: 'description',
    details: 'details',
    specifications: 'specs',
    images: ['/img/a.jpg'],
    shippingNote: 'envío',
    slug: `producto-${id}`,
    productType: 'physical',
  };
}

function createFakeStorage() {
  const store = new Map<string, string>();
  return {
    getItem: vi.fn((key: string) => store.get(key) ?? null),
    setItem: vi.fn((key: string, value: string) => {
      store.set(key, value);
    }),
    removeItem: vi.fn((key: string) => {
      store.delete(key);
    }),
    clear: vi.fn(() => store.clear()),
  };
}

describe('CartService', () => {
  describe('browser', () => {
    let service: CartService;
    let fakeStorage: ReturnType<typeof createFakeStorage>;

    beforeEach(() => {
      fakeStorage = createFakeStorage();
      vi.stubGlobal('localStorage', fakeStorage);

      TestBed.configureTestingModule({
        providers: [{ provide: PLATFORM_ID, useValue: 'browser' }],
      });
    });

    afterEach(() => {
      vi.unstubAllGlobals();
      TestBed.resetTestingModule();
    });

    it('adds a new item', () => {
      service = TestBed.inject(CartService);
      service.addItem(makeProduct('p1'));

      expect(service.items()).toEqual([expect.objectContaining({ id: 'p1', qty: 1 })]);
    });

    it('increments qty when adding an existing item', () => {
      service = TestBed.inject(CartService);
      service.addItem(makeProduct('p1'));
      service.addItem(makeProduct('p1'));

      expect(service.items()[0]?.qty).toBe(2);
      expect(service.items().length).toBe(1);
    });

    it('updates qty', () => {
      service = TestBed.inject(CartService);
      service.addItem(makeProduct('p1'));
      service.updateQty('p1', 3);

      expect(service.items()[0]?.qty).toBe(3);
    });

    it('removes the item when qty is zero or negative', () => {
      service = TestBed.inject(CartService);
      service.addItem(makeProduct('p1'));
      service.updateQty('p1', 0);

      expect(service.items().length).toBe(0);
    });

    it('removes an item', () => {
      service = TestBed.inject(CartService);
      service.addItem(makeProduct('p1'));
      service.addItem(makeProduct('p2'));
      service.removeItem('p1');

      expect(service.items().map((item) => item.id)).toEqual(['p2']);
    });

    it('clears the cart', () => {
      service = TestBed.inject(CartService);
      service.addItem(makeProduct('p1'));
      service.clearCart();

      expect(service.items()).toEqual([]);
    });

    it('recomputes count and total on mutation', () => {
      service = TestBed.inject(CartService);
      expect(service.count()).toBe(0);
      expect(service.total()).toBe(0);

      service.addItem(makeProduct('p1'));
      expect(service.count()).toBe(1);
      expect(service.total()).toBe(9.99);

      service.addItem(makeProduct('p1'));
      expect(service.count()).toBe(2);
      expect(service.total()).toBe(19.98);

      service.updateQty('p1', 3);
      expect(service.count()).toBe(3);
      expect(service.total()).toBe(29.97);
    });

    it('tracks drawer state with open/close/toggle', () => {
      service = TestBed.inject(CartService);
      expect(service.isOpen()).toBe(false);

      service.open();
      expect(service.isOpen()).toBe(true);

      service.close();
      expect(service.isOpen()).toBe(false);

      service.toggle();
      expect(service.isOpen()).toBe(true);
    });

    it('opens the drawer when an item is added', () => {
      service = TestBed.inject(CartService);
      service.addItem(makeProduct('p1'));

      expect(service.isOpen()).toBe(true);
    });

    it('loads persisted state on construction', () => {
      const persisted: CartItem[] = [{ id: 'p9', name: 'Gato', price: 5, qty: 2, image: '/i.jpg', source: 'owned' }];
      fakeStorage.setItem(STORAGE_KEY, JSON.stringify(persisted));

      service = TestBed.inject(CartService);

      expect(service.items()).toEqual(persisted);
      expect(fakeStorage.getItem).toHaveBeenCalledWith(STORAGE_KEY);
    });

    it('persists on mutation', () => {
      service = TestBed.inject(CartService);
      service.addItem(makeProduct('p1'));

      expect(fakeStorage.setItem).toHaveBeenCalledWith(STORAGE_KEY, expect.any(String));
      const raw = fakeStorage.setItem.mock.calls.at(-1)?.[1] as string;
      const stored = JSON.parse(raw) as CartItem[];
      expect(stored).toEqual([expect.objectContaining({ id: 'p1', qty: 1 })]);
    });
  });

  describe('server', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [{ provide: PLATFORM_ID, useValue: 'server' }],
      });
    });

    afterEach(() => {
      TestBed.resetTestingModule();
    });

    it('returns an empty cart without touching storage', () => {
      const service = TestBed.inject(CartService);

      expect(service.items()).toEqual([]);
      expect(service.count()).toBe(0);
      expect(service.total()).toBe(0);

      service.addItem(makeProduct('p1'));
      expect(service.items().length).toBe(1);
    });
  });
});
