import { expect, test, type Page } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import path from 'node:path';

const outDir = path.join('docs', 'visual-qa', 'phase-6c-1920');

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

test.describe('Phase 6C Credits + Packages visual QA', () => {
  test.beforeAll(() => {
    mkdirSync(outDir, { recursive: true });
  });

  test('credits requires auth', async ({ page }) => {
    await page.context().clearCookies();
    await page.goto('/credits', { waitUntil: 'networkidle' });
    await expect(page).toHaveURL(/\/auth\/login/);
    expect(page.url()).toContain('returnTo');
  });

  test('capture credits + packages flows', async ({ page }) => {
    await loginDemo(page, '/credits');
    await expect(page.getByRole('heading', { name: 'رصيدي' })).toBeVisible();
    await expect(page.getByText('0 نقطة')).toBeVisible();
    await page.waitForTimeout(350);
    await page.screenshot({
      path: path.join(outDir, '01-credits-empty.png'),
      fullPage: true,
    });

    await page.goto('/packages', { waitUntil: 'networkidle' });
    await expect(page.getByRole('heading', { name: 'اخترنا من أنت' })).toBeVisible();
    await expect(page.getByRole('link', { name: /مالك عقار/ })).toBeVisible();
    await page.waitForTimeout(300);
    await page.screenshot({
      path: path.join(outDir, '02-packages-role-picker.png'),
      fullPage: true,
    });

    await page.goto('/packages/owner', { waitUntil: 'networkidle' });
    await expect(
      page.getByRole('heading', { name: 'باقات مالك عقار أساسية' }),
    ).toBeVisible();
    await expect(page.getByText('10,100')).toBeVisible();
    await page.waitForTimeout(300);
    await page.screenshot({
      path: path.join(outDir, '03-owner-packages.png'),
      fullPage: true,
    });

    await page.goto('/packages/marketer', { waitUntil: 'networkidle' });
    await expect(
      page.getByRole('heading', { name: 'باقات مسوق عقاري أساسية' }),
    ).toBeVisible();
    await expect(page.getByText('40,000')).toBeVisible();
    await page.waitForTimeout(300);
    await page.screenshot({
      path: path.join(outDir, '04-marketer-packages.png'),
      fullPage: true,
    });

    await page.goto('/packages/marketing-company', { waitUntil: 'networkidle' });
    await expect(
      page.getByRole('heading', { name: 'باقات شركات التسويق أساسية' }),
    ).toBeVisible();
    await expect(page.getByText('60,000')).toBeVisible();
    await expect(page.getByText('80,000')).toBeVisible();
    await page.waitForTimeout(300);
    await page.screenshot({
      path: path.join(outDir, '05-marketing-company-packages.png'),
      fullPage: true,
    });

    await page.goto('/packages/compound-developer', { waitUntil: 'networkidle' });
    await expect(
      page.getByRole('heading', { name: 'باقات مطور كمبوند' }),
    ).toBeVisible();
    await expect(
      page.getByText('تواصل معنا لمعرفة الباقة المناسبة لمشروعك'),
    ).toBeVisible();
    await page.waitForTimeout(300);
    await page.screenshot({
      path: path.join(outDir, '06-compound-developer-packages.png'),
      fullPage: true,
    });

    await page.goto('/packages/owner', { waitUntil: 'networkidle' });
    await page.locator('[data-testid="subscribe-owner-featured-10100"]').click();
    await expect(page.getByTestId('package-confirm-modal')).toBeVisible();
    await expect(
      page.getByRole('heading', { name: 'تأكيد اختيار الباقة' }),
    ).toBeVisible();
    await page.waitForTimeout(250);
    await page.screenshot({
      path: path.join(outDir, '07-package-confirmation-modal.png'),
      fullPage: true,
    });
    await page.getByTestId('package-confirm-continue').click();
    await expect(
      page.getByRole('heading', { name: 'تم اختيار الباقة التجريبية' }),
    ).toBeVisible();
    await page.keyboard.press('Escape');

    // FAQ + Terms modals (Phase 6C.1)
    await page.getByTestId('package-faq-trigger').click();
    await expect(page.getByTestId('package-faq-modal')).toBeVisible();
    await expect(
      page.getByRole('heading', { name: 'الأسئلة الشائعة' }),
    ).toBeVisible();
    await expect(
      page.getByRole('button', {
        name: 'ما المميزات الإضافية التي أحصل عليها مع الباقات؟',
      }),
    ).toHaveAttribute('aria-expanded', 'true');
    await page.waitForTimeout(250);
    await page.screenshot({
      path: path.join(outDir, '10-owner-faq-modal.png'),
      fullPage: true,
    });
    await page.keyboard.press('Escape');
    await expect(page.getByTestId('package-faq-modal')).toHaveCount(0);

    await page.getByTestId('package-terms-trigger').click();
    await expect(page.getByTestId('package-terms-modal')).toBeVisible();
    await expect(
      page.getByRole('heading', { name: 'الأحكام والشروط' }),
    ).toBeVisible();
    await expect(
      page.getByText('هذه الشروط توضيحية لأغراض العرض فقط.'),
    ).toBeVisible();
    await page.waitForTimeout(250);
    await page.screenshot({
      path: path.join(outDir, '11-owner-terms-modal.png'),
      fullPage: true,
    });
    await page.keyboard.press('Escape');

    await page.goto('/packages/marketer', { waitUntil: 'networkidle' });
    await page.getByTestId('package-faq-trigger').click();
    await expect(page.getByTestId('package-faq-modal')).toBeVisible();
    await page.waitForTimeout(200);
    await page.screenshot({
      path: path.join(outDir, '12-marketer-faq-modal.png'),
      fullPage: true,
    });
    await page.keyboard.press('Escape');

    await page.goto('/packages/marketing-company', { waitUntil: 'networkidle' });
    await page.getByTestId('package-terms-trigger').click();
    await expect(page.getByTestId('package-terms-modal')).toBeVisible();
    await page.waitForTimeout(200);
    await page.screenshot({
      path: path.join(outDir, '13-marketing-company-terms-modal.png'),
      fullPage: true,
    });
    await page.keyboard.press('Escape');

    // Header menu routing verification
    await page.getByTestId('account-menu-trigger').click();
    await expect(page.getByRole('menuitem', { name: 'رصيدي' })).toHaveAttribute(
      'href',
      '/credits',
    );
    await expect(
      page.getByRole('menuitem', { name: 'اشحن رصيد' }),
    ).toHaveAttribute('href', '/packages');
  });

  test('mobile role picker + owner packages', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await loginDemo(page, '/packages');
    await expect(page.getByRole('heading', { name: 'اخترنا من أنت' })).toBeVisible();
    await page.waitForTimeout(300);
    await page.screenshot({
      path: path.join(outDir, '08-role-picker-mobile.png'),
      fullPage: true,
    });

    await page.goto('/packages/owner', { waitUntil: 'networkidle' });
    await expect(
      page.getByRole('heading', { name: 'باقات مالك عقار أساسية' }),
    ).toBeVisible();
    await page.waitForTimeout(300);
    await page.screenshot({
      path: path.join(outDir, '09-owner-packages-mobile.png'),
      fullPage: true,
    });

    await page.getByTestId('package-faq-trigger').click();
    await expect(page.getByTestId('package-faq-modal')).toBeVisible();
    await page.waitForTimeout(200);
    await page.screenshot({
      path: path.join(outDir, '14-package-faq-modal-mobile.png'),
      fullPage: true,
    });
    await page.keyboard.press('Escape');

    await page.getByTestId('package-terms-trigger').click();
    await expect(page.getByTestId('package-terms-modal')).toBeVisible();
    await page.waitForTimeout(200);
    await page.screenshot({
      path: path.join(outDir, '15-package-terms-modal-mobile.png'),
      fullPage: true,
    });
  });
});
