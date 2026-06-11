import { test, expect } from '@playwright/test';

async function mockAuth(page: import('@playwright/test').Page) {
  await page.route('/api/auth/me', async (route) => {
    await route.fulfill({
      status: 200,
      json: {
        user: {
          id: 'test-user',
          name: 'Test User',
          email: 'test@example.com',
          role: 'user',
        },
      },
    });
  });
}

test.describe('Checkout', () => {
  test('agrega al carrito, abre drawer y navega a checkout', async ({ page }) => {
    await page.goto('/tienda');

    // Agrega un producto al carrito
    await page.locator('[data-testid="tienda-add-to-cart-btn"]').first().click();

    // Abre el carrito
    await page.locator('[data-testid="header-cart-btn"]').click();

    // Navega a carrito desde el drawer
    await page.locator('[data-testid="cart-view-cart-link"]').click();

    // Verifica que estamos en el carrito y hay link a checkout
    await expect(page.locator('[data-testid="cart-checkout-link"]')).toBeVisible();

    // Navega a checkout
    await page.locator('[data-testid="cart-checkout-link"]').click();

    // Sin auth debería redirigir a login
    await expect(page).toHaveURL(/\/auth\/login/);
  });

  test('muestra el formulario de checkout con usuario autenticado', async ({ page }) => {
    await mockAuth(page);
    await page.goto('/checkout');

    await expect(page.locator('[data-testid="checkout-form"]')).toBeVisible();
    await expect(page.locator('[data-testid="checkout-input-name"]')).toBeVisible();
    await expect(page.locator('[data-testid="checkout-input-email"]')).toBeVisible();
    await expect(page.locator('[data-testid="checkout-input-phone"]')).toBeVisible();
    await expect(page.locator('[data-testid="checkout-input-province"]')).toBeVisible();
    await expect(page.locator('[data-testid="checkout-input-address"]')).toBeVisible();
    await expect(page.locator('[data-testid="checkout-submit-btn"]')).toBeVisible();
  });

  test('valida campos requeridos y email en checkout', async ({ page }) => {
    await mockAuth(page);
    await page.goto('/checkout');

    const submitBtn = page.locator('[data-testid="checkout-submit-btn"]');
    await expect(submitBtn).toBeDisabled();

    // Rellena campos inválidos
    await page.locator('[data-testid="checkout-input-name"]').fill('A');
    await page.locator('[data-testid="checkout-input-email"]').fill('no-es-email');
    await page.locator('[data-testid="checkout-input-phone"]').fill('');
    await page.locator('[data-testid="checkout-input-province"]').selectOption('');
    await page.locator('[data-testid="checkout-input-address"]').fill('');

    // El botón debería seguir deshabilitado porque faltan campos
    await expect(submitBtn).toBeDisabled();

    // Rellena email válido
    await page.locator('[data-testid="checkout-input-email"]').fill('test@example.com');
    await page.locator('[data-testid="checkout-input-phone"]').fill('123456789');
    await page.locator('[data-testid="checkout-input-province"]').selectOption('Pichincha');
    await page.locator('[data-testid="checkout-input-address"]').fill('Calle Falsa 123');

    // Ahora debería estar habilitado
    await expect(submitBtn).toBeEnabled();
  });

  test('envía checkout correctamente con usuario autenticado', async ({ page }) => {
    await mockAuth(page);

    // Intercepta el POST a /api/checkout
    await page.route('/api/checkout', async (route) => {
      await route.fulfill({ status: 201, json: { orderId: 'order-123' } });
    });

    // Navega a tienda y agrega producto al carrito via localStorage para evitar SSR issues
    await page.goto('/tienda');
    await page.locator('[data-testid="tienda-add-to-cart-btn"]').first().click();

    // Va directo a checkout con auth mocked
    await page.goto('/checkout');

    await page.locator('[data-testid="checkout-input-name"]').fill('Test User');
    await page.locator('[data-testid="checkout-input-email"]').fill('test@example.com');
    await page.locator('[data-testid="checkout-input-phone"]').fill('123456789');
    await page.locator('[data-testid="checkout-input-province"]').selectOption('Pichincha');
    await page.locator('[data-testid="checkout-input-address"]').fill('Calle Falsa 123');

    const submitBtn = page.locator('[data-testid="checkout-submit-btn"]');
    await expect(submitBtn).toBeEnabled();
    await submitBtn.click();

    await expect(page.locator('text=Pedido recibido')).toBeVisible();
  });
});
