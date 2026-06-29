// @ts-check
import { test, expect } from '@playwright/test';

const TEST_EMAIL = `test-${Date.now()}@example.com`;
const TEST_PASSWORD = 'TestPass123!';

test.describe('Flujo principal del catálogo', () => {
  test('registro, creación y eliminación de camiseta', async ({ page }) => {
    // 1. Ir al landing page
    await page.goto('/');
    await expect(page.locator('h1')).toContainText('Tu colección de camisetas');

    // 2. Navegar al registro
    await page.click('a[href="/register"]');
    await expect(page).toHaveURL('/register');
    await expect(page.locator('h1')).toContainText('Comenzá tu colección');

    // 3. Completar registro
    await page.fill('#email', TEST_EMAIL);
    await page.fill('#password', TEST_PASSWORD);
    await page.click('button[type="submit"]');

    // 4. Verificar mensaje de éxito
    await expect(page.locator('#mensaje')).toContainText('Cuenta creada');

    // 5. Ir al login
    await page.click('a[href="/login"]');
    await expect(page).toHaveURL('/login');

    // 6. Iniciar sesión
    await page.fill('#email', TEST_EMAIL);
    await page.fill('#password', TEST_PASSWORD);
    await page.click('button[type="submit"]');

    // 7. Verificar redirección al dashboard
    await page.waitForURL('/dashboard');
    await expect(page.locator('h1')).toContainText('Tus camisetas');

    // 8. Ir a crear nueva camiseta
    await page.click('a[href="/nueva"]');
    await expect(page).toHaveURL('/nueva');

    // 9. Completar formulario de nueva camiseta
    await page.fill('#equipo', 'Test FC');
    await page.fill('#temporada', '2024/25');
    await page.selectOption('#tipo', 'Titular');
    await page.fill('#marca', 'Vitest');
    await page.fill('#imagen_url', 'https://example.com/shirt.jpg');
    await page.fill('#descripcion', 'Camiseta de prueba E2E');
    await page.click('button[type="submit"]');

    // 10. Verificar redirección al dashboard y que la camiseta aparece
    await page.waitForURL('/dashboard');
    await expect(page.locator('.product-card')).toHaveCount(1);
    await expect(page.locator('.product-card h2')).toContainText('Test FC');

    // 11. Eliminar la camiseta
    page.on('dialog', (dialog) => dialog.accept());
    await page.click('button[data-delete]');

    // 12. Verificar que ya no hay camisetas
    await expect(page.locator('.product-card')).toHaveCount(0);
  });
});
