import { test, expect } from '@playwright/test';

test.describe('Auth', () => {
  test('muestra botón de login con Google', async ({ page }) => {
    await page.goto('/auth/login');

    // Verifica que el botón de Google esté presente
    const googleBtn = page.locator('[data-testid="auth-login-google-btn"]');
    await expect(googleBtn).toBeVisible();
  });

  test('checkout requiere autenticación y redirige a login', async ({ page }) => {
    await page.goto('/checkout');

    // Debería redirigir a /auth/login con redirect param
    await expect(page).toHaveURL(/\/auth\/login\?redirect=\/checkout/);
  });

  test('admin requiere autenticación y redirige a login', async ({ page }) => {
    await page.goto('/admin');

    // Debería redirigir a /auth/login con redirect param
    await expect(page).toHaveURL(/\/auth\/login\?redirect=\/admin/);
  });
});
