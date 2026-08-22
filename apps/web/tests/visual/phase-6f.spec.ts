import { expect, test, type Page } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import path from 'node:path';

const outDir = path.join('docs', 'visual-qa', 'phase-6f-1920');

async function loginDemo(page: Page, returnTo: string) {
  await page.context().clearCookies();
  await page.goto(`/auth/login?returnTo=${encodeURIComponent(returnTo)}`, {
    waitUntil: 'networkidle',
  });
  await page.locator('[data-testid="login-next"]').waitFor({ state: 'visible' });
  await page.waitForTimeout(200);
  await page.locator('#login-identifier').fill('demo@example.test');
  await page.locator('[data-testid="login-next"]').click();
  await page.locator('#login-password').waitFor({ state: 'visible', timeout: 15000 });
  await page.locator('#login-password').fill('demo-password');
  await page.locator('[data-testid="login-submit"]').click();
  await page.waitForURL((url) => url.pathname.startsWith(returnTo.split('?')[0]), {
    timeout: 20000,
  });
}

test.describe('Phase 6F Activity Center visual QA', () => {
  test.beforeAll(() => {
    mkdirSync(outDir, { recursive: true });
  });

  test('requires authentication for all activity routes', async ({ page }) => {
    for (const route of ['/favorites', '/notes', '/notifications', '/alerts']) {
      await page.context().clearCookies();
      await page.goto(route, { waitUntil: 'networkidle' });
      await expect(page).toHaveURL(/\/auth\/login/);
      expect(page.url()).toContain('returnTo');
    }
  });

  test('capture activity pages', async ({ page }) => {
    await loginDemo(page, '/favorites');
    await expect(page.getByRole('heading', { name: 'نشاطاتي' })).toBeVisible();
    await expect(page.getByText('ليس لديك أي عقارات محفوظة')).toBeVisible();
    await page.waitForTimeout(300);
    await page.screenshot({
      path: path.join(outDir, '00-favorites-empty.png'),
      fullPage: true,
    });

    await page.goto('/alerts', { waitUntil: 'networkidle' });
    await expect(page.getByRole('heading', { name: 'تنبيهاتي' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'مناطق البحث' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'المنبه العقاري' })).toBeVisible();
    await page.waitForTimeout(300);
    await page.screenshot({
      path: path.join(outDir, '01-alerts-full.png'),
      fullPage: true,
    });

    await page.getByRole('heading', { name: 'المنبه العقاري' }).scrollIntoViewIfNeeded();
    await page.waitForTimeout(150);
    await page.screenshot({
      path: path.join(outDir, '04-alert-form.png'),
      fullPage: false,
    });

    await page.getByRole('heading', { name: 'مناطق البحث' }).scrollIntoViewIfNeeded();
    await page.waitForTimeout(150);
    await page.screenshot({
      path: path.join(outDir, '05-alert-table.png'),
      fullPage: false,
    });

    await page.getByRole('button', { name: 'اشترك' }).click();
    await expect(page.getByTestId('alert-created-toast')).toBeVisible();
    await page.waitForTimeout(200);
    await page.screenshot({
      path: path.join(outDir, '06-alert-created.png'),
      fullPage: true,
    });

    await page.goto('/notifications', { waitUntil: 'networkidle' });
    await expect(page.getByText('لا توجد اي إشعارات')).toBeVisible();
    await page.waitForTimeout(300);
    await page.screenshot({
      path: path.join(outDir, '02-notifications-empty.png'),
      fullPage: true,
    });

    await page.goto('/notes', { waitUntil: 'networkidle' });
    await expect(page.getByText('ليس لديك أي ملاحظات حتى الآن')).toBeVisible();
    await page.waitForTimeout(300);
    await page.screenshot({
      path: path.join(outDir, '03-notes-empty.png'),
      fullPage: true,
    });

    await page.goto('/favorites', { waitUntil: 'networkidle' });
    await page.getByTestId('account-menu-trigger').click();
    await expect(page.getByRole('menuitem', { name: 'مفضلة' })).toHaveAttribute(
      'href',
      '/favorites',
    );
    await expect(page.getByRole('menuitem', { name: 'ملاحظاتي' })).toHaveAttribute(
      'href',
      '/notes',
    );
    await expect(page.getByRole('menuitem', { name: 'إشعاراتي' })).toHaveAttribute(
      'href',
      '/notifications',
    );
    await expect(page.getByRole('menuitem', { name: 'تنبيهاتي' })).toHaveAttribute(
      'href',
      '/alerts',
    );
    await page.waitForTimeout(200);
    await page.screenshot({
      path: path.join(outDir, '07-account-menu-activity.png'),
      clip: { x: 0, y: 0, width: 560, height: 780 },
    });
  });

  test('mobile activity pages', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await loginDemo(page, '/favorites');
    await page.waitForTimeout(250);
    await page.screenshot({
      path: path.join(outDir, '08-favorites-mobile.png'),
      fullPage: true,
    });

    await page.goto('/alerts', { waitUntil: 'networkidle' });
    await page.waitForTimeout(250);
    await page.screenshot({
      path: path.join(outDir, '09-alerts-mobile.png'),
      fullPage: true,
    });

    await page.goto('/notifications', { waitUntil: 'networkidle' });
    await page.waitForTimeout(250);
    await page.screenshot({
      path: path.join(outDir, '10-notifications-mobile.png'),
      fullPage: true,
    });

    await page.goto('/notes', { waitUntil: 'networkidle' });
    await page.waitForTimeout(250);
    await page.screenshot({
      path: path.join(outDir, '11-notes-mobile.png'),
      fullPage: true,
    });
  });
});
