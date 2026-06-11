import { test, expect } from '@playwright/test';

test.describe('Tienda', () => {
  test('filtra productos y abre modal de detalle', async ({ page }) => {
    await page.goto('/tienda');

    // Verifica que los filtros existan
    await expect(page.locator('[data-testid="tienda-filter-all"]')).toBeVisible();
    await expect(page.locator('[data-testid="tienda-filter-michis"]')).toBeVisible();
    await expect(page.locator('[data-testid="tienda-filter-michi-lovers"]')).toBeVisible();

    // Haz click en filtro "Para Michis"
    await page.locator('[data-testid="tienda-filter-michis"]').click();

    // Verifica que productos se filtren (al menos 1 producto visible)
    const filteredProducts = page.locator('[data-testid="tienda-product-card"]');
    await expect(filteredProducts).toHaveCount(1);

    // Haz click en "Ver" de un producto (abre modal)
    await page.locator('[data-testid="tienda-product-ver-btn"]').first().click();

    // Verifica que el modal se abra
    const modalBackdrop = page.locator('[data-testid="tienda-modal-backdrop"]');
    await expect(modalBackdrop).toBeVisible();

    // Cierra el modal
    await page.locator('[data-testid="tienda-modal-close-btn"]').click();
    await expect(modalBackdrop).not.toBeVisible();
  });
});
