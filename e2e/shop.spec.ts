import { test, expect } from '@playwright/test';

test.describe('Tienda', () => {
  test('filtra productos y navega al detalle con SSR', async ({ page }) => {
    await page.goto('/tienda');

    // Verifica que los filtros principales existan
    await expect(page.locator('[data-testid="tienda-filter-all"]')).toBeVisible();
    await expect(page.locator('[data-testid="tienda-filter-michis"]')).toBeVisible();
    await expect(page.locator('[data-testid="tienda-filter-michi-lovers"]')).toBeVisible();

    // Haz click en filtro "Para Michis" y verifica que haya al menos una tarjeta
    await page.locator('[data-testid="tienda-filter-michis"]').click();
    const cards = page.locator('[data-testid="product-card"]');
    await expect(cards.first()).toBeVisible();

    // Abre el primer producto
    const firstCard = cards.first();
    const slug = await firstCard.getAttribute('data-product-slug');
    const name = await firstCard.locator('h3').textContent();
    await firstCard.click();

    // Verifica navegación a la página de detalle
    await expect(page).toHaveURL(`/tienda/${slug}`);

    // Verifica SSR: título y encabezado contienen el nombre real del producto
    await expect(page.locator('h1')).toContainText(name ?? '');
    await expect(page.title()).resolves.toContain(name ?? '');

    // Verifica que existan las tabs de detalle y especificaciones
    await expect(page.locator('#details-tab')).toBeVisible();
    await expect(page.locator('#specifications-tab')).toBeVisible();

    // Cambia a la pestaña de especificaciones
    await page.locator('#specifications-tab').click();
    await expect(page.locator('#specifications-panel')).toBeVisible();
  });
});
