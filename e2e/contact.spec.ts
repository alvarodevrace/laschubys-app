import { test, expect } from '@playwright/test';

test.describe('Contacto', () => {
  test('muestra el formulario de contacto', async ({ page }) => {
    await page.goto('/contact');

    await expect(page.locator('[data-testid="contact-name-input"]')).toBeVisible();
    await expect(page.locator('[data-testid="contact-email-input"]')).toBeVisible();
    await expect(page.locator('[data-testid="contact-message-input"]')).toBeVisible();
    await expect(page.locator('[data-testid="contact-submit-btn"]')).toBeVisible();
  });

  test('envía el formulario y muestra mensaje de éxito', async ({ page }) => {
    await page.goto('/contact');

    // Intercepta el POST a /api/contact para evitar llamar al backend real
    await page.route('/api/contact', async (route) => {
      await route.fulfill({ status: 201, json: { success: true } });
    });

    await page.locator('[data-testid="contact-name-input"]').fill('Test User');
    await page.locator('[data-testid="contact-email-input"]').fill('test@example.com');
    await page
      .locator('[data-testid="contact-message-input"]')
      .fill('Este es un mensaje de prueba para el formulario de contacto.');

    const submitBtn = page.locator('[data-testid="contact-submit-btn"]');
    await expect(submitBtn).toBeEnabled();
    await submitBtn.click();

    await expect(page.locator('text=Mensaje enviado. Te responderemos pronto.')).toBeVisible();
  });

  test('deshabilita el botón cuando el formulario es inválido', async ({ page }) => {
    await page.goto('/contact');

    const submitBtn = page.locator('[data-testid="contact-submit-btn"]');
    await expect(submitBtn).toBeDisabled();

    // Rellena solo nombre (faltan email y mensaje)
    await page.locator('[data-testid="contact-name-input"]').fill('Test');
    await expect(submitBtn).toBeDisabled();

    // Rellena email inválido
    await page.locator('[data-testid="contact-email-input"]').fill('no-es-email');
    await expect(submitBtn).toBeDisabled();

    // Rellena email válido y mensaje corto
    await page.locator('[data-testid="contact-email-input"]').fill('test@example.com');
    await page.locator('[data-testid="contact-message-input"]').fill('corto');
    await expect(submitBtn).toBeDisabled();
  });
});
