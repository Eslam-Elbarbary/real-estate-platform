import { expect, test, type Page } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import path from 'node:path';

const outDir = path.join('docs', 'visual-qa', 'account-1920');

async function loginDemo(page: Page, returnTo = '/account/profile') {
  await page.context().clearCookies();
  await page.goto(`/auth/login?returnTo=${encodeURIComponent(returnTo)}`, {
    waitUntil: 'networkidle',
  });
  await page.locator('[data-testid="login-next"]').waitFor({ state: 'visible' });
  await page.waitForTimeout(300);
  await page.locator('#login-identifier').fill('demo@example.test');
  await page.locator('[data-testid="login-next"]').click();
  await page.locator('#login-password').waitFor({ state: 'visible', timeout: 15000 });
  await page.locator('#login-password').fill('demo-password');
  await page.locator('[data-testid="login-submit"]').click();
  await page.waitForURL((url) => url.pathname.startsWith(returnTo.split('?')[0]), {
    timeout: 20000,
  });
}

test.describe('Account Center visual QA @ 1920x1080', () => {
  test.beforeAll(() => {
    mkdirSync(outDir, { recursive: true });
  });

  test('unauthenticated account redirects to login', async ({ page }) => {
    await page.context().clearCookies();
    await page.goto('/account/profile', { waitUntil: 'networkidle' });
    await expect(page).toHaveURL(/\/auth\/login/);
    expect(page.url()).toContain('returnTo=');
  });

  test('capture account center + menu', async ({ page }) => {
    await loginDemo(page, '/account/profile');
    await expect(page.getByRole('heading', { name: 'حسابي' })).toBeVisible();
    await expect(
      page.getByRole('heading', { name: 'بيانات الحساب' }),
    ).toBeVisible();
    await page.waitForTimeout(400);
    await page.screenshot({
      path: path.join(outDir, '01-profile.png'),
      fullPage: true,
    });

    await page.goto('/account/security', { waitUntil: 'networkidle' });
    await expect(
      page.getByRole('heading', { name: 'الخصوصية والأمان' }),
    ).toBeVisible();
    await page.waitForTimeout(300);
    await page.screenshot({
      path: path.join(outDir, '02-security.png'),
      fullPage: true,
    });

    await page.goto('/account/payment-methods', { waitUntil: 'networkidle' });
    await expect(
      page.getByRole('heading', { name: 'البطاقات المحفوظة' }),
    ).toBeVisible();
    await page.waitForTimeout(300);
    await page.screenshot({
      path: path.join(outDir, '03-payment-methods-empty.png'),
      fullPage: true,
    });

    await page.goto('/account/wallet', { waitUntil: 'networkidle' });
    await expect(page.getByRole('heading', { name: 'المحفظة' })).toBeVisible();
    await expect(page.getByText('لا يوجد معاملات')).toBeVisible();
    await page.waitForTimeout(300);
    await page.screenshot({
      path: path.join(outDir, '04-wallet-empty.png'),
      fullPage: true,
    });

    await page.goto('/account/subscription', { waitUntil: 'networkidle' });
    await expect(
      page.getByRole('heading', { name: 'خطة الاشتراك' }),
    ).toBeVisible();
    await page.waitForTimeout(300);
    await page.screenshot({
      path: path.join(outDir, '05-subscription-empty.png'),
      fullPage: true,
    });

    await page.goto('/account/contacts', { waitUntil: 'networkidle' });
    await expect(
      page.getByRole('heading', { name: 'إدارة جهات اتصالك' }),
    ).toBeVisible();
    await expect(page.getByText('أرقام الإعلانات')).toBeVisible();
    await page.waitForTimeout(300);
    await page.screenshot({
      path: path.join(outDir, '06-contacts.png'),
      fullPage: true,
    });

    await page.locator('[data-testid="add-phone-open"]').click();
    await expect(
      page.getByRole('heading', { name: 'إضافة رقم هاتف' }),
    ).toBeVisible();
    await page.waitForTimeout(250);
    await page.screenshot({
      path: path.join(outDir, '07-add-phone-modal.png'),
      fullPage: true,
    });
    await page.keyboard.press('Escape');

    await page.getByTestId('account-menu-trigger').click();
    await expect(page.getByTestId('account-menu-panel')).toBeVisible();
    await expect(page.getByRole('menuitem', { name: 'حسابي' })).toBeVisible();
    await expect(page.getByRole('menuitem', { name: 'رصيدي' })).toBeVisible();
    await page.waitForTimeout(250);
    // Dropdown anchors to inline-end (left side in RTL).
    await page.screenshot({
      path: path.join(outDir, '08-header-account-menu.png'),
      clip: { x: 0, y: 0, width: 560, height: 780 },
    });
    await page.keyboard.press('Escape');

    // Phase 6A regression smoke
    await page.goto('/valuation', { waitUntil: 'networkidle' });
    await expect(page.getByRole('heading', { name: 'تقييم العقار' })).toBeVisible();
    await page.goto('/account');
    await page.waitForURL('**/account/profile');
  });

  test('mobile account profile + menu', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await loginDemo(page, '/account/profile');
    await expect(page.getByRole('heading', { name: 'حسابي' })).toBeVisible();
    await page.waitForTimeout(350);
    await page.screenshot({
      path: path.join(outDir, '09-mobile-profile.png'),
      fullPage: true,
    });

    await page.getByTestId('account-menu-trigger').click();
    await expect(page.getByTestId('mobile-account-drawer')).toBeVisible();
    await expect(page.getByTestId('mobile-account-drawer').getByRole('link', { name: 'حسابي' })).toBeVisible();
    await expect(page.getByTestId('mobile-account-drawer').getByRole('link', { name: 'عقاراتي' })).toBeVisible();
    await page.getByTestId('mobile-account-drawer').getByRole('link', { name: 'عقاراتي' }).scrollIntoViewIfNeeded();
    await page.waitForTimeout(250);
    await page.screenshot({
      path: path.join(outDir, '10-mobile-account-menu.png'),
      fullPage: true,
    });
  });

  test('contacts add phone + whatsapp toggle demo', async ({ page }) => {
    await loginDemo(page, '/account/contacts');
    await page.locator('[data-testid="add-phone-open"]').click();
    await page.locator('[data-testid="add-phone-input"]').fill('01012345678');
    await page.locator('[data-testid="add-phone-save"]').click();
    await expect(page.getByText('+201012345678')).toBeVisible();

    const toggle = page.getByRole('switch').first();
    const before = await toggle.getAttribute('aria-checked');
    await toggle.click();
    await expect(toggle).toHaveAttribute(
      'aria-checked',
      before === 'true' ? 'false' : 'true',
    );
  });
});
