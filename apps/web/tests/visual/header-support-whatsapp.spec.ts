import { expect, test } from '@playwright/test';

test('header support opens WhatsApp', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('/', { waitUntil: 'networkidle' });

  const link = page.getByRole('link', { name: 'الدعم عبر واتساب' });
  await expect(link).toBeVisible();

  const href = await link.getAttribute('href');
  expect(href).toMatch(/^https:\/\/wa\.me\/201000000000/);
  expect(href).toContain('text=');
  expect(await link.getAttribute('target')).toBe('_blank');
  expect(await link.getAttribute('rel')).toContain('noopener');

  // Logged-in header uses the same HeaderActions support link
  await page.goto('/auth/login?returnTo=%2F', { waitUntil: 'networkidle' });
  await page.locator('#login-identifier').fill('demo@example.test');
  await page.locator('[data-testid="login-next"]').click();
  await page.locator('#login-password').waitFor({ state: 'visible' });
  await page.locator('#login-password').fill('demo-password');
  await page.locator('[data-testid="login-submit"]').click();
  await page.waitForURL((url) => url.pathname === '/', { timeout: 20000 });

  const authLink = page.getByRole('link', { name: 'الدعم عبر واتساب' });
  await expect(authLink).toBeVisible();
  expect(await authLink.getAttribute('href')).toBe(href);
});
