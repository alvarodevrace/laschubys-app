import { test, expect } from '@playwright/test';

test.describe('Checkout', () => {
  test('agrega al carrito, abre drawer y navega a checkout', async ({ page }) => {
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

    // El drawer se abre; navega a checkout
    await expect(page.locator('[data-testid="cart-go-to-checkout"]')).toBeVisible();
    await page.locator('[data-testid="cart-go-to-checkout"]').click();

    // Verifica que el checkout muestra la tabla y el formulario
    await expect(page.locator('h1:has-text("Mi Carrito de Compras")')).toBeVisible();
    await expect(page.locator('[data-testid="checkout-form"]')).toBeVisible();

    // Llena el formulario
    await page.locator('[data-testid="checkout-input-name"]').fill('Test User');
    await page.locator('[data-testid="checkout-input-email"]').fill('test@example.com');
    await page.locator('[data-testid="checkout-input-phone"]').fill('123456789');
    await page.locator('[data-testid="checkout-input-province"]').selectOption('Pichincha');
    await page.locator('[data-testid="checkout-input-address"]').fill('Calle Falsa 123');

    // Acepta términos y verifica que el botón de submit esté habilitado
    await page.locator('input[type="checkbox"]').check();
    const submitBtn = page.locator('[data-testid="checkout-submit-btn"]');
    await expect(submitBtn).toBeEnabled();
  });
});
