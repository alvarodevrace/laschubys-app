import { test, expect } from '@playwright/test';

test.describe('Flujo de carrito', () => {
  test('agrega producto, abre drawer, ajusta cantidad y va al checkout', async ({ page }) => {
    await page.goto('/tienda');

    // Abre detalle del primer producto físico
    const firstCard = page
      .locator('[data-testid="product-card"][data-product-type="physical"]')
      .first();
    await expect(firstCard).toBeVisible();
    await firstCard.click();
    await expect(page).toHaveURL(/\/tienda\/.+/);

    // Agrega al carrito
    await page.locator('button:has-text("Agregar al carrito")').click();

    // El drawer debería abrirse
    await expect(page.locator('[data-testid="cart-go-to-checkout"]')).toBeVisible();
    await expect(page.locator('[data-testid="cart-drawer-close"]')).toBeVisible();

    // Aumenta cantidad
    await page.locator('button[aria-label^="Aumentar cantidad"]').click();
    await expect(page.locator('text=2')).toBeVisible();

    // Ir a pagar
    await page.locator('[data-testid="cart-go-to-checkout"]').click();
    await expect(page).toHaveURL('/checkout');
    await expect(page.locator('h1:has-text("Mi Carrito de Compras")')).toBeVisible();
  });
});
