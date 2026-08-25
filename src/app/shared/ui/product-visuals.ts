import { ProductPick } from '../../core/models/content.model';

/**
 * Paleta visual de cards de producto (patrón del home).
 * SSOT: vault/laschubys/20-Tech/Design-System.md §5.
 */
export interface ProductVisual {
  /** Fondo del círculo decorativo y del bloque interno nombre/precio */
  card: string;
  /** Fondo de la card */
  light: string;
  /** Acento (badges, iconos) */
  accent: string;
  /** Texto sobre los fondos card/light */
  text: string;
}

export const productPalette: readonly ProductVisual[] = [
  {
    card: 'var(--color-orange-50)',
    light: 'var(--background)',
    accent: 'var(--color-orange-600)',
    text: 'var(--color-orange-800)',
  },
  {
    card: 'var(--color-orange-100)',
    light: 'var(--color-orange-50)',
    accent: 'var(--color-orange-700)',
    text: 'var(--color-orange-900)',
  },
  {
    card: 'var(--color-orange-200)',
    light: 'var(--color-orange-100)',
    accent: 'var(--color-orange-600)',
    text: 'var(--color-orange-800)',
  },
  {
    card: 'var(--color-orange-100)',
    light: 'var(--background)',
    accent: 'var(--color-orange-500)',
    text: 'var(--color-orange-700)',
  },
  {
    card: 'var(--color-orange-50)',
    light: 'var(--color-orange-100)',
    accent: 'var(--color-orange-700)',
    text: 'var(--color-orange-900)',
  },
  {
    card: 'var(--color-orange-200)',
    light: 'var(--color-orange-50)',
    accent: 'var(--color-orange-500)',
    text: 'var(--color-orange-800)',
  },
] as const;

/** Color estable por producto (hash del id) — mismo producto, mismo color en home y tienda. */
export function productColor(product: ProductPick): ProductVisual {
  const idx = product.id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return productPalette[idx % productPalette.length];
}
