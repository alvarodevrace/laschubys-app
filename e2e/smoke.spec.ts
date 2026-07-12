import { test, expect } from '@playwright/test';

test.describe('smoke production', () => {
  test('homepage loads', async ({ page }) => {
    const res = await page.goto('https://laschubys.com');
    expect(res?.status()).toBe(200);
    await expect(page.locator('body')).toBeVisible();
  });

  test('api health returns ok', async ({ request }) => {
    const res = await request.get('https://api.laschubys.com/api/health');
    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    expect(body.status).toBe('ok');
  });

  test('sitemap.xml is valid', async ({ request }) => {
    const res = await request.get('https://api.laschubys.com/api/content/sitemap.xml');
    expect(res.ok()).toBeTruthy();
    const text = await res.text();
    expect(text).toContain('<?xml');
  });
});
