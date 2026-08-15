import { expect, test, type Page } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import path from 'node:path';

const outDir = path.join('docs', 'visual-qa', 'mobile-navigation');

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
  await page.waitForURL(
    (url) =>
      url.pathname === '/' ||
      url.pathname.startsWith(returnTo.split('?')[0]),
    { timeout: 20000 },
  );
}

async function openDrawer(page: Page) {
  await page.getByTestId('mobile-nav-trigger').click();
  const drawer = page.getByTestId('mobile-nav-drawer');
  await expect(drawer).toBeVisible();
  await page.waitForTimeout(300);
  return drawer;
}

async function capture(page: Page, name: string) {
  await page.waitForTimeout(200);
  await page.screenshot({ path: path.join(outDir, name) });
}

test.describe('Mobile navigation drawer', () => {
  test.beforeAll(() => {
    mkdirSync(outDir, { recursive: true });
  });

  test.describe('phone', () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
    });

  test('A B C D E visual 01-07 accordion + scroll + close', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    await expect(page.getByTestId('mobile-nav-trigger')).toHaveAttribute(
      'aria-label',
      'فتح القائمة',
    );

    await openDrawer(page);
    await expect(page.getByTestId('mobile-nav-backdrop')).toBeVisible();
    await expect(page.getByTestId('mobile-nav-group-sale')).toHaveAttribute(
      'aria-expanded',
      'false',
    );
    await expect(page.getByTestId('mobile-nav-group-rent')).toHaveAttribute(
      'aria-expanded',
      'false',
    );
    await capture(page, '01-390-menu-closed.png');

    await page.getByTestId('mobile-nav-group-sale').click();
    await expect(page.getByTestId('mobile-nav-group-sale')).toHaveAttribute(
      'aria-expanded',
      'true',
    );
    await expect(
      page.getByTestId('mobile-nav-drawer').getByRole('link', { name: 'شقق للبيع', exact: true }),
    ).toBeVisible();
    await capture(page, '02-390-sale-expanded.png');

    await page.getByTestId('mobile-nav-group-rent').click();
    await expect(page.getByTestId('mobile-nav-group-sale')).toHaveAttribute(
      'aria-expanded',
      'false',
    );
    await expect(page.getByTestId('mobile-nav-group-rent')).toHaveAttribute(
      'aria-expanded',
      'true',
    );
    await capture(page, '03-390-rent-expanded.png');

    await page.getByTestId('mobile-nav-group-rent').click();
    await expect(page.getByTestId('mobile-nav-group-rent')).toHaveAttribute(
      'aria-expanded',
      'false',
    );

    await page.getByTestId('mobile-nav-group-compounds').click();
    await expect(
      page.getByTestId('mobile-nav-drawer').getByRole('link', { name: 'كل الكمبوندات' }),
    ).toBeVisible();
    await capture(page, '04-390-compounds-expanded.png');

    await page.getByTestId('mobile-nav-group-know').click();
    const drawer = page.getByTestId('mobile-nav-drawer');
    await expect(drawer.getByRole('link', { name: 'أعرف أكثر' })).toBeVisible();
    await expect(drawer.getByRole('link', { name: 'اسأل أهل المنطقة' })).toBeVisible();
    await expect(drawer.getByRole('link', { name: 'نصائح عقارية' })).toBeVisible();
    await expect(drawer.getByRole('link', { name: 'الوسطاء المميزون' })).toHaveAttribute(
      'href',
      '/advice/agents',
    );
    await expect(drawer.getByRole('link', { name: 'دليل المعارض' })).toHaveAttribute(
      'href',
      '/advice/exhibitions',
    );
    await expect(drawer.getByRole('link', { name: 'أبحاث ودراسات' })).toHaveAttribute(
      'href',
      '/advice/research',
    );
    await capture(page, '05-390-know-expanded.png');

    await page.getByTestId('mobile-nav-group-sale').click();
    await page.getByTestId('mobile-nav-scroll').evaluate((el) => {
      el.scrollTop = el.scrollHeight;
    });
    await expect(page.getByTestId('mobile-nav-add-listing')).toBeVisible();
    await capture(page, '06-390-long-submenu-scrolled.png');
    await capture(page, '07-390-bottom-actions.png');

    const noOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth + 1,
    );
    expect(noOverflow).toBeTruthy();

    await page.keyboard.press('Escape');
    await expect(page.getByTestId('mobile-nav-drawer')).toHaveCount(0);

    await openDrawer(page);
    await page.getByTestId('mobile-nav-backdrop').evaluate((el) => (el as HTMLButtonElement).click());
    await expect(page.getByTestId('mobile-nav-drawer')).toHaveCount(0);
  });

  test('G submenu route closes drawer without 404', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    await openDrawer(page);
    await page.getByTestId('mobile-nav-group-sale').click();
    await page
      .getByTestId('mobile-nav-drawer')
      .getByRole('link', { name: 'شقق للبيع', exact: true })
      .click();
    await expect(page.getByTestId('mobile-nav-drawer')).toHaveCount(0);
    await page.waitForURL(/\/properties\/sale\//);
    await expect(page.getByText('الصفحة غير موجودة')).toHaveCount(0);
  });

  test('H I add property CTA auth routing', async ({ page }) => {
    await page.context().clearCookies();
    await page.goto('/', { waitUntil: 'networkidle' });
    await openDrawer(page);
    await capture(page, '11-logged-out-menu.png');
    await page.getByTestId('mobile-nav-add-listing').click();
    await page.waitForURL(/\/auth\/login/);
    expect(page.url()).toContain('returnTo=');
    expect(decodeURIComponent(page.url())).toContain('/add-property');

    await loginDemo(page, '/');
    await page.setViewportSize({ width: 390, height: 844 });
    await openDrawer(page);
    await capture(page, '12-logged-in-menu.png');
    await expect(
      page.getByTestId('mobile-nav-drawer').getByRole('link', { name: 'حسابي' }),
    ).toHaveCount(0);
    await page.getByTestId('mobile-nav-add-listing').click();
    await page.waitForURL(/\/(add-property|my-properties\/LD-)/, { timeout: 20000 });
    await expect(page.getByText('الصفحة غير موجودة')).toHaveCount(0);
  });
  });

  test('responsive 360 430 tablet captures', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await page.goto('/', { waitUntil: 'networkidle' });
    await openDrawer(page);
    await capture(page, '08-360-menu.png');
    await page.getByTestId('mobile-nav-close').click();

    await page.setViewportSize({ width: 430, height: 932 });
    await page.goto('/', { waitUntil: 'networkidle' });
    await openDrawer(page);
    await capture(page, '09-430-menu.png');
    await page.getByTestId('mobile-nav-close').click();

    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/', { waitUntil: 'networkidle' });
    await openDrawer(page);
    await capture(page, '10-tablet-menu.png');
    await expect(page.getByTestId('mobile-nav-add-listing')).toBeVisible();
  });

  test('N desktop hides mobile trigger', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/', { waitUntil: 'networkidle' });
    await expect(page.getByTestId('mobile-nav-trigger')).toBeHidden();
    await expect(page.getByRole('navigation', { name: 'التنقل الرئيسي' })).toBeVisible();
  });
});
