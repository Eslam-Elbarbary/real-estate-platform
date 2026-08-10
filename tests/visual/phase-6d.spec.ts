import { expect, test, type Page } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import path from 'node:path';

const outDir = path.join('docs', 'visual-qa', 'phase-6d-1920');

async function loginDemo(page: Page, returnTo = '/my-properties') {
  await page.context().clearCookies();
  await page.goto(`/auth/login?returnTo=${encodeURIComponent(returnTo)}`, {
    waitUntil: 'networkidle',
  });
  await page.locator('[data-testid="login-next"]').waitFor({ state: 'visible' });
  await page.waitForTimeout(250);
  await page.locator('#login-identifier').fill('demo@example.test');
  await page.locator('[data-testid="login-next"]').click();
  await page.locator('#login-password').waitFor({ state: 'visible', timeout: 15000 });
  await page.locator('#login-password').fill('demo-password');
  await page.locator('[data-testid="login-submit"]').click();
  await page.waitForURL((url) => url.pathname.startsWith(returnTo.split('?')[0]), {
    timeout: 20000,
  });
}

test.describe('Phase 6D My Properties visual QA', () => {
  test.beforeAll(() => {
    mkdirSync(outDir, { recursive: true });
  });

  test('requires authentication', async ({ page }) => {
    await page.context().clearCookies();
    await page.goto('/my-properties', { waitUntil: 'networkidle' });
    await expect(page).toHaveURL(/\/auth\/login/);
    expect(page.url()).toContain('returnTo');
  });

  test('capture dashboard states', async ({ page }) => {
    await loginDemo(page, '/my-properties');
    await expect(page.getByRole('heading', { name: 'عقاراتي' })).toBeVisible();
    await page.waitForTimeout(400);

    await page.screenshot({
      path: path.join(outDir, '00-full-page.png'),
      fullPage: true,
    });

    await page.screenshot({
      path: path.join(outDir, '01-dashboard-top.png'),
      clip: { x: 0, y: 0, width: 1920, height: 900 },
    });

    await page.getByRole('heading', { name: 'مستوى التفاعل' }).scrollIntoViewIfNeeded();
    await page.waitForTimeout(200);
    await page.screenshot({
      path: path.join(outDir, '02-engagement-metrics.png'),
      clip: { x: 300, y: 420, width: 1320, height: 520 },
    });

    await expect(page.getByText('شقة للبيع في التجمع الخامس')).toBeVisible();
    await page.screenshot({
      path: path.join(outDir, '03-published-listings.png'),
      fullPage: true,
    });

    await page.goto('/my-properties?status=pending', { waitUntil: 'networkidle' });
    await expect(page.getByText('شقة للبيع في الرحاب')).toBeVisible();
    await page.waitForTimeout(250);
    await page.screenshot({
      path: path.join(outDir, '04-pending-listings.png'),
      fullPage: true,
    });

    await page.goto('/my-properties?status=rejected', { waitUntil: 'networkidle' });
    await expect(page.getByText('الصور غير واضحة')).toBeVisible();
    await page.waitForTimeout(250);
    await page.screenshot({
      path: path.join(outDir, '05-rejected-listings.png'),
      fullPage: true,
    });

    await page.goto('/my-properties?status=expired', { waitUntil: 'networkidle' });
    await expect(page.getByRole('button', { name: 'إعادة نشر' }).first()).toBeVisible();
    await page.waitForTimeout(250);
    await page.screenshot({
      path: path.join(outDir, '06-expired-listings.png'),
      fullPage: true,
    });

    await page.goto('/my-properties?status=draft', { waitUntil: 'networkidle' });
    await expect(page.getByText('مسودة: شقة في 6 أكتوبر')).toBeVisible();
    await page.waitForTimeout(250);
    await page.screenshot({
      path: path.join(outDir, '07-drafts.png'),
      fullPage: true,
    });

    await page.goto('/my-properties?status=deleted', { waitUntil: 'networkidle' });
    await expect(page.getByRole('button', { name: 'استعادة' }).first()).toBeVisible();
    await page.waitForTimeout(250);
    await page.screenshot({
      path: path.join(outDir, '08-deleted-listings.png'),
      fullPage: true,
    });

    await page.goto('/my-properties?q=الشيخ+زايد', { waitUntil: 'networkidle' });
    await expect(page.getByText('فيلا مستقلة للبيع في الشيخ زايد')).toBeVisible();
    await page.waitForTimeout(250);
    await page.screenshot({
      path: path.join(outDir, '09-search-results.png'),
      fullPage: true,
    });

    await page.goto('/my-properties?q=لا-يوجد-تطابق-xyz', { waitUntil: 'networkidle' });
    await expect(
      page.getByText('لا يوجد لديك عقارات تطابق البحث'),
    ).toBeVisible();
    await page.waitForTimeout(250);
    await page.screenshot({
      path: path.join(outDir, '10-empty-state.png'),
      fullPage: true,
    });

    await page.goto('/my-properties', { waitUntil: 'networkidle' });
    await page.getByTestId('account-menu-trigger').click();
    await expect(page.getByRole('menuitem', { name: 'عقاراتي' })).toHaveAttribute(
      'href',
      '/my-properties',
    );
    await page.waitForTimeout(200);
    await page.screenshot({
      path: path.join(outDir, '11-account-menu-my-properties.png'),
      clip: { x: 0, y: 0, width: 560, height: 780 },
    });
  });

  test('mobile dashboard', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await loginDemo(page, '/my-properties');
    await expect(page.getByRole('heading', { name: 'عقاراتي' })).toBeVisible();
    await page.waitForTimeout(300);
    await page.screenshot({
      path: path.join(outDir, '12-dashboard-mobile.png'),
      fullPage: true,
    });

    await page.getByRole('navigation', { name: 'حالة الإعلانات' }).scrollIntoViewIfNeeded();
    await page.waitForTimeout(200);
    await page.screenshot({
      path: path.join(outDir, '13-tabs-mobile.png'),
      fullPage: true,
    });

    await page.getByTestId('listing-ML-10001').scrollIntoViewIfNeeded();
    await page.waitForTimeout(200);
    await page.screenshot({
      path: path.join(outDir, '14-listing-mobile.png'),
      fullPage: true,
    });
  });
});
