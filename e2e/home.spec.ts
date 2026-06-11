import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('muestra el título, logo y productos destacados', async ({ page }) => {
    await page.goto('/');

    // Verifica que el título "Las Chubys" esté presente
    const title = page.locator('text=Las Chubys').first();
    await expect(title).toBeVisible();

    // Verifica que el header tenga el logo
    const logo = page.locator('[data-testid="header-logo"]').first();
    await expect(logo).toBeVisible();

    // Verifica que haya productos destacados
    const featuredProducts = page.locator('[data-testid="home-featured-product"]');
    await expect(featuredProducts).toHaveCount(4);

    // Screenshot opcional
    await page.screenshot({ path: 'test-results/homepage.png' });
  });
});
