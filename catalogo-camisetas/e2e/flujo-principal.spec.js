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
    await expect(page.locator('main h1')).toContainText('Tu colección de camisetas');

    // Selectores precisos: el mismo href aparece en el nav y en el hero/footer.
    await page.click('.hero-actions a[href="/register"]');
    await page.waitForURL('/register');
    await expect(page.locator('main h1')).toContainText('Comenzá tu colección');

    await page.fill('#email', TEST_EMAIL);
    await page.fill('#password', TEST_PASSWORD);
    await page.click('button[type="submit"]');

    // El registro puede fallar por: rate limit, SMTP no configurado, o éxito.
    const registroMsg = page.locator('#mensaje');
    await expect(registroMsg).toContainText(/Cuenta creada|rate limit|confirmation email/i);
    const msgText = await registroMsg.textContent();
    if (msgText.includes('rate limit')) {
      test.skip(true, 'Supabase free tier rate-limitó el mail de confirmación (esperá ~1h o usá otro dominio/proyecto).');
    }
    if (msgText.includes('confirmation email')) {
      test.skip(true, 'Supabase no pudo enviar el mail de confirmación. Configurá SMTP en el dashboard de Supabase (Authentication > SMTP Settings).');
    }

    // Ir a /login — si ya hay sesión activa, el login.js redirige a /dashboard.
    await page.click('.footer-link a[href="/login"]');

    // Esperar a que la página se estabilice (puede redirigir a /dashboard).
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Si terminamos en /login (sin sesión), hacer login manualmente.
    if (page.url().includes('/login')) {
      await page.fill('#email', TEST_EMAIL);
      await page.fill('#password', TEST_PASSWORD);
      await page.click('button[type="submit"]');

      // Puede redirigir a /dashboard o quedarse en /login (credenciales inválidas).
      await page.waitForURL(/\/(dashboard|login)/, { timeout: 30_000 });
      if (new URL(page.url()).pathname === '/login') {
        await expect(page.locator('#mensaje')).toContainText(/Invalid login credentials|confirmation email|Error de autenticación/i);
        test.skip(true, 'El proyecto Supabase exige confirmación de email o las credenciales son inválidas. ' +
          'Confirmá el mail de ' + TEST_EMAIL + ' o usá un proyecto con "Confirm email" desactivado ' +
          'para ejecutar el flujo CRUD completo.');
      }
    }

    // Ya estamos en /dashboard.
    await page.waitForURL('/dashboard');
    await expect(page.locator('main h1')).toContainText('Tus camisetas');

    await page.click('.primary-button[href="/nueva"]');
    await page.waitForURL('/nueva');

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
