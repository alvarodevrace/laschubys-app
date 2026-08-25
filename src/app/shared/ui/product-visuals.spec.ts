import type { ProductPick } from '../../core/models/content.model';
import { productColor, productPalette, type ProductVisual } from './product-visuals';

function makeProduct(id: string): ProductPick {
  return {
    id,
    tag: 'juguete',
    source: 'owned',
    audience: 'michis',
    name: 'Producto',
    price: '9.99',
    priceValue: 9.99,
    copy: 'copy',
    description: 'description',
    details: 'details',
    specifications: 'specs',
    images: ['/img/a.jpg'],
    shippingNote: 'envío',
    slug: 'producto',
    productType: 'physical',
  };
}

describe('productColor', () => {
  const ids = ['p1', 'p2', 'p3', 'iris-4', 'juguete-pelota', 'cats-2026'];

  it.each(ids)('returns the same palette object for %s on every call', (id) => {
    const first = productColor(makeProduct(id));
    const second = productColor(makeProduct(id));

    expect(second).toBe(first);
  });

  it.each(ids)('returns a member of the palette for %s', (id) => {
    const visual = productColor(makeProduct(id));

    expect(productPalette).toContain(visual);
  });

  it.each(['', 'zzz'])('handles edge id %j without throwing', (id) => {
    let visual: ProductVisual | undefined;

    expect(() => {
      visual = productColor(makeProduct(id));
    }).not.toThrow();

    expect(visual).toBeDefined();
    expect(productPalette).toContain(visual);
  });
});
