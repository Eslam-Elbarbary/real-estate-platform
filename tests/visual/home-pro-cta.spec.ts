import { expect, test, type Page } from '@playwright/test';

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

async function activateDemoPro(page: Page) {
  await page.goto('/pro/checkout?plan=general-pro&billing=quarterly', {
    waitUntil: 'networkidle',
  });
  await page.getByTestId('add-payment-method').click();
  await page.getByTestId('use-demo-card').click();
  await expect(page.getByTestId('pro-pay-button')).toBeEnabled();
  await page.getByTestId('pro-pay-button').click();
  await page.waitForURL('**/account/subscription', { timeout: 20000 });
  await expect(page.getByTestId('active-subscription')).toBeVisible();
}

test.describe('Home Pro CTA auth-aware routing', () => {
  test('logged out → register with returnTo=/pro', async ({ page }) => {
    await page.context().clearCookies();
    await page.goto('/', { waitUntil: 'networkidle' });
    const cta = page.getByTestId('home-pro-cta');
    await expect(cta).toBeVisible();
    await expect(cta).toHaveAttribute('href', /\/auth\/register/);
    expect(decodeURIComponent((await cta.getAttribute('href')) ?? '')).toContain(
      'returnTo=/pro',
    );
    await cta.click();
    await page.waitForURL(/\/auth\/register/);
    expect(page.url()).toContain('returnTo');
    expect(decodeURIComponent(page.url())).toContain('/pro');
  });

  test('logged in without subscription → /pro', async ({ page }) => {
    await loginDemo(page, '/');
    const cta = page.getByTestId('home-pro-cta');
    await expect(cta).toHaveAttribute('href', '/pro');
    await expect(cta).toHaveText('اشترك الآن');
    await cta.click();
    await page.waitForURL('**/pro');
    await expect(page).not.toHaveURL(/\/auth\/register/);
    await expect(
      page.getByRole('heading', { name: 'اختر خطتك المثالية' }),
    ).toBeVisible();
  });

  test('logged in with active subscription → /account/subscription', async ({
    page,
  }) => {
    await loginDemo(page, '/pro');
    await activateDemoPro(page);
    await page.goto('/', { waitUntil: 'networkidle' });
    const cta = page.getByTestId('home-pro-cta');
    await expect(cta).toHaveAttribute('href', '/account/subscription');
    await expect(cta).toHaveText('إدارة الاشتراك');
    await cta.click();
    await page.waitForURL('**/account/subscription');
    await expect(page).not.toHaveURL(/\/auth\/register/);
    await expect(page.getByTestId('active-subscription')).toBeVisible();
  });
});
