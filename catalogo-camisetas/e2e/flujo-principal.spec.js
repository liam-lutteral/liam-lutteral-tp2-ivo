import { test, expect } from '@playwright/test';

const TEST_EMAIL = `test-${Date.now()}@example.com`;
const TEST_PASSWORD = 'TestPass123!';

test.describe('Flujo principal del catálogo', () => {
  test('registro, creación y eliminación de camiseta', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toContainText('Tu colección de camisetas');

    await page.click('a[href="/register"]');
    await expect(page).toHaveURL('/register');
    await expect(page.locator('h1')).toContainText('Comenzá tu colección');

    await page.fill('#email', TEST_EMAIL);
    await page.fill('#password', TEST_PASSWORD);
    await page.click('button[type="submit"]');

    await expect(page.locator('#mensaje')).toContainText('Cuenta creada');

    await page.click('a[href="/login"]');
    await expect(page).toHaveURL('/login');

    await page.fill('#email', TEST_EMAIL);
    await page.fill('#password', TEST_PASSWORD);
    await page.click('button[type="submit"]');

    await page.waitForURL('/dashboard');
    await expect(page.locator('h1')).toContainText('Tus camisetas');

    await page.click('a[href="/nueva"]');
    await expect(page).toHaveURL('/nueva');

    await page.fill('#equipo', 'Test FC');
    await page.fill('#temporada', '2024/25');
    await page.selectOption('#tipo', 'Titular');
    await page.fill('#marca', 'Vitest');
    await page.fill('#imagen_url', 'https://example.com/shirt.jpg');
    await page.fill('#descripcion', 'Camiseta de prueba E2E');
    await page.click('button[type="submit"]');

    await page.waitForURL('/dashboard');
    await expect(page.locator('.product-card')).toHaveCount(1);
    await expect(page.locator('.product-card h2')).toContainText('Test FC');

    page.on('dialog', (dialog) => dialog.accept());
    await page.click('button[data-delete]');

    await expect(page.locator('.product-card')).toHaveCount(0);
  });
});
