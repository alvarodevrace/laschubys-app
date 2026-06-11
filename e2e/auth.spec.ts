import { test, expect } from '@playwright/test';

test.describe('Auth', () => {
  test('muestra botón de login con Google', async ({ page }) => {
    await page.goto('/auth/login');

    // Verifica que el botón de Google esté presente
    const googleBtn = page.locator('[data-testid="auth-login-google-btn"]');
    await expect(googleBtn).toBeVisible();
  });
});
