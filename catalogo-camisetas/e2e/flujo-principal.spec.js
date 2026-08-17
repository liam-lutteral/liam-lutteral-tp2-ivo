import { test, expect } from '@playwright/test';

// El email debe pertenecer a un dominio aceptado por el proyecto Supabase
// (por ejemplo, si hay allowlist de dominios) y no estar rate-limiteado.
// Se puede configurar con E2E_TEST_EMAIL / E2E_TEST_PASSWORD.
const TEST_EMAIL =
  process.env.E2E_TEST_EMAIL || `test-${Date.now()}@${process.env.E2E_EMAIL_DOMAIN || 'gmail.com'}`;
const TEST_PASSWORD = process.env.E2E_TEST_PASSWORD || 'TestPass123!';

test.describe('Flujo principal del catálogo', () => {
  test('registro, creación y eliminación de camiseta', async ({ page }) => {
    test.setTimeout(90_000);

    await page.goto('/');
    await expect(page.locator('h1')).toContainText('Tu colección de camisetas');

    // Selectores precisos: el mismo href aparece en el nav y en el hero/footer.
    await page.click('.hero-actions a[href="/register"]');
    await expect(page).toHaveURL('/register');
    await expect(page.locator('h1')).toContainText('Comenzá tu colección');

    await page.fill('#email', TEST_EMAIL);
    await page.fill('#password', TEST_PASSWORD);
    await page.click('button[type="submit"]');

    // En free tier, el envío del mail de confirmación tiene rate limit por hora.
    const registroMsg = page.locator('#mensaje');
    await expect(registroMsg).toContainText(/Cuenta creada|rate limit/i);
    if ((await registroMsg.textContent()).includes('rate limit')) {
      test.skip(true, 'Supabase free tier rate-limitó el mail de confirmación (esperá ~1h o usá otro dominio/proyecto).');
    }

    await page.click('.footer-link a[href="/login"]');
    await expect(page).toHaveURL('/login');

    await page.fill('#email', TEST_EMAIL);
    await page.fill('#password', TEST_PASSWORD);
    await page.click('button[type="submit"]');

    // Si el proyecto Supabase exige confirmación de email (mailer_autoconfirm
    // desactivado), el login fallará con "Invalid login credentials". En ese
    // caso el CRUD completo no puede ejecutarse sin confirmar el mail: lo
    // skipeamos con un mensaje claro en vez de fallar.
    await page.waitForURL(/\/(dashboard|login)/, { timeout: 30_000 });
    if (new URL(page.url()).pathname === '/login') {
      await expect(page.locator('#mensaje')).toContainText('Invalid login credentials');
      test.skip(true, 'El proyecto Supabase exige confirmación de email. ' +
        'Confirmá el mail de ' + TEST_EMAIL + ' o usá un proyecto con "Confirm email" desactivado ' +
        'para ejecutar el flujo CRUD completo.');
    }

    await page.waitForURL('/dashboard');
    await expect(page.locator('h1')).toContainText('Tus camisetas');

    await page.click('.primary-button[href="/nueva"]');
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
