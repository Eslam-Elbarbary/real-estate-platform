import { expect, test, type Page } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import path from 'node:path';

const outDir = path.join('docs', 'visual-qa', 'mobile-account-menu');

async function loginDemo(page: Page, returnTo = '/') {
  await page.context().clearCookies();
  await page.goto(`/auth/login?returnTo=${encodeURIComponent(returnTo)}`, {
    waitUntil: 'networkidle',
  });
  await page.locator('[data-testid="login-next"]').waitFor({ state: 'visible' });
  await page.locator('#login-identifier').fill('demo@example.test');
  await page.locator('[data-testid="login-next"]').click();
  await page.locator('#login-password').waitFor({ state: 'visible', timeout: 15000 });
  await page.locator('#login-password').fill('demo-password');
  await page.locator('[data-testid="login-submit"]').click();
  const dest = returnTo.split('?')[0] || '/';
  await page.waitForURL(
    (url) =>
      !url.pathname.startsWith('/auth') &&
      (dest === '/' ? url.pathname === '/' : url.pathname.startsWith(dest)),
    { timeout: 20000 },
  );
}

async function assertSiteChromeCovered(page: Page) {
  const hit = await page.evaluate(() => {
    const header = document.querySelector('[data-site-header]');
    if (!header) return 'no-header';
    const box = header.getBoundingClientRect();
    const el = document.elementFromPoint(
      box.left + Math.min(24, box.width / 2),
      box.top + 10,
    );
    if (
      el?.closest(
        '[data-testid="mobile-account-drawer"], [data-testid="mobile-account-backdrop"], [data-testid="mobile-nav-drawer"], [data-testid="mobile-nav-backdrop"]',
      )
    ) {
      return 'overlay';
    }
    if (el?.closest('[data-site-header]')) {
      return 'header';
    }
    return 'other';
  });
  expect(hit).toBe('overlay');
}

async function openAccountDrawer(page: Page) {
  await page.getByTestId('account-menu-trigger').click();
  await expect(page.getByTestId('mobile-account-drawer')).toBeVisible();
  await page.waitForTimeout(280);
}

test.describe('Mobile account menu drawer', () => {
  test.beforeAll(() => {
    mkdirSync(outDir, { recursive: true });
  });

  test('A–M authenticated drawer scroll close links', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await loginDemo(page, '/');
    await page.setViewportSize({ width: 390, height: 844 });

    await openAccountDrawer(page);
    await expect(page.getByTestId('mobile-account-backdrop')).toBeVisible();
    await expect(page.getByTestId('account-menu-panel')).toHaveCount(0);
    await assertSiteChromeCovered(page);
    await page.screenshot({
      path: path.join(outDir, '09-header-stacking-fixed.png'),
    });

    const overflowLocked = await page.evaluate(
      () => document.body.style.overflow === 'hidden',
    );
    expect(overflowLocked).toBeTruthy();

    await page.screenshot({ path: path.join(outDir, '01-390-open-top.png') });

    const scroll = page.getByTestId('mobile-account-scroll');
    await scroll.evaluate((el) => {
      el.scrollTop = el.scrollHeight / 2;
    });
    await page.waitForTimeout(200);
    await page.screenshot({ path: path.join(outDir, '02-390-open-middle.png') });

    await page.getByTestId('mobile-account-logout').scrollIntoViewIfNeeded();
    await expect(page.getByTestId('mobile-account-logout')).toBeVisible();
    await expect(
      page.getByTestId('mobile-account-drawer').getByRole('link', { name: 'مفضلة' }),
    ).toBeAttached();
    await expect(
      page.getByTestId('mobile-account-drawer').getByRole('link', { name: 'حسابي' }),
    ).toBeAttached();
    await page.screenshot({ path: path.join(outDir, '03-390-open-bottom.png') });
    await assertSiteChromeCovered(page);

    const noOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth + 1,
    );
    expect(noOverflow).toBeTruthy();

    await page.keyboard.press('Escape');
    await expect(page.getByTestId('mobile-account-drawer')).toHaveCount(0);
    await expect(page.locator('[data-site-header]')).toBeVisible();

    await openAccountDrawer(page);
    await page
      .getByTestId('mobile-account-backdrop')
      .evaluate((el) => (el as HTMLButtonElement).click());
    await expect(page.getByTestId('mobile-account-drawer')).toHaveCount(0);

    await openAccountDrawer(page);
    await page.getByTestId('mobile-account-drawer').getByRole('link', { name: 'حسابي' }).click();
    await expect(page.getByTestId('mobile-account-drawer')).toHaveCount(0);
    await page.waitForURL(/\/account\/profile/);
  });

  test('F–K destinations + logout', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await loginDemo(page, '/');
    await page.setViewportSize({ width: 390, height: 844 });

    await openAccountDrawer(page);
    await page
      .getByTestId('mobile-account-drawer')
      .getByRole('link', { name: 'تقييم عقاري' })
      .click();
    await page.waitForURL(/\/valuation/);
    await expect(page.getByText('الصفحة غير موجودة')).toHaveCount(0);

    await openAccountDrawer(page);
    await page
      .getByTestId('mobile-account-drawer')
      .getByRole('link', { name: 'عقاراتي' })
      .click();
    await page.waitForURL(/\/my-properties/);

    await openAccountDrawer(page);
    await page.getByTestId('mobile-account-drawer').getByRole('link', { name: 'رصيدي' }).click();
    await page.waitForURL(/\/credits/);

    await openAccountDrawer(page);
    await page
      .getByTestId('mobile-account-drawer')
      .getByRole('link', { name: 'اشحن رصيد' })
      .click();
    await page.waitForURL(/\/packages/);

    await openAccountDrawer(page);
    await page.getByTestId('mobile-account-drawer').getByTestId('account-menu-pro-card').click();
    await page.waitForURL(/\/pro/);

    await openAccountDrawer(page);
    await page.getByTestId('mobile-account-logout').click();
    await expect(page.getByTestId('mobile-account-drawer')).toHaveCount(0);
    await page.waitForTimeout(400);
  });

  test('N exclusive with main nav', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await loginDemo(page, '/');
    await page.setViewportSize({ width: 390, height: 844 });
    await openAccountDrawer(page);
    await page.getByTestId('mobile-nav-trigger').evaluate((el) => (el as HTMLButtonElement).click());
    await expect(page.getByTestId('mobile-nav-drawer')).toBeVisible();
    await expect(page.getByTestId('mobile-account-drawer')).toHaveCount(0);
    await assertSiteChromeCovered(page);
    await page.getByTestId('account-menu-trigger').evaluate((el) => (el as HTMLButtonElement).click());
    await expect(page.getByTestId('mobile-account-drawer')).toBeVisible();
    await expect(page.getByTestId('mobile-nav-drawer')).toHaveCount(0);
  });

  test('responsive 360 430 short 667 logged-out desktop', async ({ page }) => {
    await loginDemo(page, '/');

    await page.setViewportSize({ width: 360, height: 740 });
    await page.goto('/', { waitUntil: 'networkidle' });
    await openAccountDrawer(page);
    await assertSiteChromeCovered(page);
    await page.screenshot({ path: path.join(outDir, '04-360-open.png') });
    await page.getByTestId('mobile-account-close').click();

    await page.setViewportSize({ width: 430, height: 932 });
    await page.goto('/', { waitUntil: 'networkidle' });
    await openAccountDrawer(page);
    await assertSiteChromeCovered(page);
    await page.screenshot({ path: path.join(outDir, '05-430-open.png') });
    await page.getByTestId('mobile-account-close').click();

    await page.setViewportSize({ width: 390, height: 667 });
    await page.goto('/', { waitUntil: 'networkidle' });
    await openAccountDrawer(page);
    await expect(page.getByTestId('mobile-account-logout')).toBeVisible();
    await page
      .getByTestId('mobile-account-drawer')
      .getByRole('link', { name: 'اشحن رصيد' })
      .scrollIntoViewIfNeeded();
    await expect(
      page.getByTestId('mobile-account-drawer').getByRole('link', { name: 'اشحن رصيد' }),
    ).toBeVisible();
    await page.screenshot({ path: path.join(outDir, '06-short-height-667.png') });
    await page.getByTestId('mobile-account-close').click();

    await page.context().clearCookies();
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/', { waitUntil: 'networkidle' });
    await openAccountDrawer(page);
    await expect(page.getByRole('link', { name: 'تسجيل الدخول' })).toBeVisible();
    await page.screenshot({ path: path.join(outDir, '07-logged-out-account-ui.png') });
    await page.getByTestId('mobile-account-close').click();
  });

  test('O desktop account dropdown regression', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await loginDemo(page, '/');
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.getByTestId('account-menu-trigger').click();
    await expect(page.getByTestId('account-menu-panel')).toBeVisible();
    await expect(page.getByTestId('mobile-account-drawer')).toHaveCount(0);
    await expect(
      page.getByTestId('account-menu-panel').getByRole('menuitem', { name: 'حسابي' }),
    ).toBeVisible();
    await page.screenshot({
      path: path.join(outDir, '08-desktop-account-dropdown-regression.png'),
      clip: { x: 0, y: 0, width: 560, height: 780 },
    });
  });
});
