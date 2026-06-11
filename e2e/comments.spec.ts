import { test, expect } from '@playwright/test';

const mockPost = {
  slug: 'test-post',
  category: 'Tips',
  title: 'Post de prueba para comentarios',
  excerpt: 'Este es un post de prueba',
  author: 'Iris',
  readTime: '3 min',
  publishedAt: '2024-01-01',
  content: ['Párrafo 1 del post.', 'Párrafo 2 del post.'],
  comments: [
    { id: 'c1', author: 'Usuario1', body: '¡Qué lindo post!', date: '2024-01-02' },
    { id: 'c2', author: 'Usuario2', body: 'Iris y Rubi son las mejores.', date: '2024-01-03' },
  ],
  coverImage: null,
};

async function mockPostApi(page: import('@playwright/test').Page) {
  await page.route('/api/content/posts/test-post', async (route) => {
    await route.fulfill({ status: 200, json: mockPost });
  });
}

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

test.describe('Comentarios', () => {
  test('muestra comentarios existentes en un post', async ({ page }) => {
    await mockPostApi(page);
    await page.goto('/blog/test-post');

    await expect(page.locator('text=Comentarios')).toBeVisible();
    await expect(page.locator('text=¡Qué lindo post!')).toBeVisible();
    await expect(page.locator('text=Iris y Rubi son las mejores.')).toBeVisible();
  });

  test('sin autenticación muestra mensaje para iniciar sesión', async ({ page }) => {
    await mockPostApi(page);
    await page.goto('/blog/test-post');

    await expect(page.locator('text=Necesitas sesión para comentar.')).toBeVisible();
    await expect(page.locator('[data-testid="comment-textarea"]')).not.toBeVisible();
  });

  test('con autenticación permite publicar un comentario', async ({ page }) => {
    await mockPostApi(page);
    await mockAuth(page);

    // Intercepta el POST a /api/comments
    await page.route('/api/comments', async (route) => {
      const request = route.request();
      const postData = request.postDataJSON();
      await route.fulfill({
        status: 201,
        json: {
          ok: true,
          comment: {
            id: 'c3',
            author: 'Test User',
            body: postData.body,
            date: new Date().toISOString(),
          },
        },
      });
    });

    await page.goto('/blog/test-post');

    await expect(page.locator('[data-testid="comment-textarea"]')).toBeVisible();
    await expect(page.locator('[data-testid="comment-submit-btn"]')).toBeVisible();

    await page.locator('[data-testid="comment-textarea"]').fill('Nuevo comentario de prueba');

    const submitBtn = page.locator('[data-testid="comment-submit-btn"]');
    await expect(submitBtn).toBeEnabled();
    await submitBtn.click();

    await expect(page.locator('text=Comentario publicado.')).toBeVisible();
    await expect(page.locator('text=Nuevo comentario de prueba')).toBeVisible();
  });
});
