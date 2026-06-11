import { test, expect } from '@playwright/test';

test.describe('Checkout', () => {
  test('agrega al carrito, abre drawer y navega a checkout', async ({ page }) => {
    await page.goto('/tienda');

    // Agrega un producto al carrito
    await page.locator('[data-testid="tienda-add-to-cart-btn"]').first().click();

    // Abre el carrito
    await page.locator('[data-testid="header-cart-btn"]').click();

    // Navega a checkout desde el drawer
    await page.locator('[data-testid="cart-view-cart-link"]').click();

    // Verifica que el formulario de checkout esté presente
    await expect(page.locator('[data-testid="checkout-form"]')).toBeVisible();

    // Llena el formulario
    await page.locator('[data-testid="checkout-input-name"]').fill('Test User');
    await page.locator('[data-testid="checkout-input-email"]').fill('test@example.com');
    await page.locator('[data-testid="checkout-input-phone"]').fill('123456789');
    await page.locator('[data-testid="checkout-input-address"]').fill('Calle Falsa 123');

    // Verifica que el botón de submit se habilite
    const submitBtn = page.locator('[data-testid="checkout-submit-btn"]');
    await expect(submitBtn).toBeEnabled();
  });
});
