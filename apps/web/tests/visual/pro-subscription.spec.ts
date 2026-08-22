import { expect, test, type Page } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import path from 'node:path';

const outDir = path.join('docs', 'visual-qa', 'pro-subscription-1920');

async function loginDemo(page: Page, returnTo: string) {
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

test.describe('Pro subscription visual QA + E2E', () => {
  test.beforeAll(() => {
    mkdirSync(outDir, { recursive: true });
  });

  test('logged-out checkout redirects to login with returnTo', async ({ page }) => {
    await page.context().clearCookies();
    await page.goto('/pro/checkout?plan=general-pro&billing=quarterly', {
      waitUntil: 'networkidle',
    });
    await expect(page).toHaveURL(/\/auth\/login/);
    expect(page.url()).toContain('returnTo');
    expect(decodeURIComponent(page.url())).toContain('/pro/checkout');
  });

  test('plan selection + checkout + activate + cancel', async ({ page }) => {
    await loginDemo(page, '/pro');
    await expect(
      page.getByRole('heading', { name: 'اختر خطتك المثالية' }),
    ).toBeVisible();
    await expect(page.getByTestId('pro-plan-general-pro')).toBeVisible();
    await expect(page.getByTestId('pro-plan-owner-pro')).toBeVisible();
    await expect(page.getByText('299 جنيه')).toBeVisible();
    await expect(page.getByText('750 جنيه')).toBeVisible();
    await page.waitForTimeout(300);
    await page.screenshot({
      path: path.join(outDir, '01-plan-selection.png'),
      fullPage: true,
    });

    await page.getByTestId('pro-plan-general-pro').screenshot({
      path: path.join(outDir, '02-quarterly-plan.png'),
    });
    await page.getByTestId('pro-plan-owner-pro').screenshot({
      path: path.join(outDir, '03-owner-pro-plan.png'),
    });

    await page.getByTestId('pro-subscribe-general-pro').click();
    await page.waitForURL(/\/pro\/checkout/);
    await expect(
      page.getByRole('heading', { name: 'تفاصيل الدفع' }),
    ).toBeVisible();
    await expect(page.getByRole('heading', { name: 'ملخص الطلب' })).toBeVisible();
    await expect(page.getByTestId('pro-pay-button')).toBeDisabled();
    await page.waitForTimeout(300);
    await page.screenshot({
      path: path.join(outDir, '04-checkout-empty-payment.png'),
      fullPage: true,
    });

    await expect(page.getByTestId('billing-quarterly')).toHaveAttribute(
      'aria-checked',
      'true',
    );
    await page.waitForTimeout(200);
    await page.screenshot({
      path: path.join(outDir, '05-checkout-quarterly.png'),
      fullPage: true,
    });

    await page.getByTestId('billing-yearly').click();
    await page.waitForURL(/billing=yearly/);
    await expect(page.getByTestId('billing-yearly')).toContainText('599');
    await expect(page.getByTestId('billing-yearly')).toContainText('1,200');
    await expect(page.getByText('إجمالي المستحق').locator('..')).toContainText('599');
    await page.waitForTimeout(250);
    await page.screenshot({
      path: path.join(outDir, '06-checkout-yearly.png'),
      fullPage: true,
    });

    await page.getByTestId('billing-quarterly').click();
    await page.waitForURL(/billing=quarterly/);

    await page.getByTestId('add-payment-method').click();
    await expect(page.getByTestId('demo-payment-modal')).toBeVisible();
    await page.getByTestId('use-demo-card').click();
    await expect(page.getByTestId('selected-payment-method')).toBeVisible();
    await expect(page.getByTestId('pro-pay-button')).toBeEnabled();
    await page.waitForTimeout(250);
    await page.screenshot({
      path: path.join(outDir, '07-payment-method-selected.png'),
      fullPage: true,
    });

    await page.getByTestId('pro-pay-button').click();
    await page.waitForURL('**/account/subscription', { timeout: 20000 });
    await expect(page.getByTestId('active-subscription')).toBeVisible();
    await expect(page.getByText('نشط')).toBeVisible();
    await page.waitForTimeout(300);
    await page.screenshot({
      path: path.join(outDir, '08-active-subscription.png'),
      fullPage: true,
    });

    await page.getByTestId('account-menu-trigger').click();
    await expect(page.getByTestId('account-menu-pro-card')).toBeVisible();
    await expect(page.getByTestId('account-menu-pro-card')).toHaveAttribute(
      'href',
      '/pro',
    );
    await page.waitForTimeout(200);
    await page.screenshot({
      path: path.join(outDir, '09-account-menu-pro-card.png'),
      clip: { x: 0, y: 0, width: 560, height: 780 },
    });
    await page.keyboard.press('Escape');

    await page.getByTestId('cancel-subscription').click();
    await expect(page.getByTestId('cancel-subscription-modal')).toBeVisible();
    await page.getByTestId('confirm-cancel-subscription').click();
    await expect(page.getByText('ملغى')).toBeVisible();
  });

  test('mobile plan + checkout', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await loginDemo(page, '/pro');
    await expect(
      page.getByRole('heading', { name: 'اختر خطتك المثالية' }),
    ).toBeVisible();
    await page.waitForTimeout(300);
    await page.screenshot({
      path: path.join(outDir, '10-plan-selection-mobile.png'),
      fullPage: true,
    });

    await page.getByTestId('pro-subscribe-general-pro').click();
    await page.waitForURL(/\/pro\/checkout/);
    await expect(page.getByTestId('pro-pay-button')).toBeDisabled();
    await page.waitForTimeout(300);
    await page.screenshot({
      path: path.join(outDir, '11-checkout-mobile.png'),
      fullPage: true,
    });
  });

  test('account subscription empty CTA goes to /pro', async ({ page }) => {
    await loginDemo(page, '/account/subscription');
    await expect(
      page.getByRole('heading', { name: 'خطة الاشتراك' }),
    ).toBeVisible();
    const cta = page.getByRole('link', { name: 'اشترك الآن' });
    await expect(cta).toHaveAttribute('href', '/pro');
  });
});
