import { expect, test, type Page } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import path from 'node:path';
import { MockValuationEngine } from '../../src/features/valuation/mock-engine';
import { formatConfidence } from '../../src/features/valuation/lib/format';

const outDir = path.join('docs', 'visual-qa', 'valuation-1920');

async function loginDemo(page: Page, returnTo = '/valuation') {
  await page.context().clearCookies();
  await page.goto(`/auth/login?returnTo=${encodeURIComponent(returnTo)}`, {
    waitUntil: 'networkidle',
  });
  await page.locator('[data-testid="login-next"]').waitFor({ state: 'visible' });
  await page.waitForTimeout(400);
  await page.locator('#login-identifier').fill('demo@example.test');
  await page.locator('[data-testid="login-next"]').click();
  await page.locator('#login-password').waitFor({ state: 'visible', timeout: 15000 });
  await page.locator('#login-password').fill('demo-password');
  await page.locator('[data-testid="login-submit"]').click();
  await page.waitForURL((url) => url.pathname.startsWith(returnTo.split('?')[0]), {
    timeout: 20000,
  });
}

test.describe('Valuation + Auth visual QA @ 1920x1080', () => {
  test.beforeAll(() => {
    mkdirSync(outDir, { recursive: true });
  });

  test('deterministic mock engine', () => {
    const engine = new MockValuationEngine();
    const request = {
      goal: 'price-inquiry' as const,
      location: { slug: 'new-cairo', name: 'القاهرة الجديدة' },
      propertyType: 'apartment' as const,
      view: 'garden' as const,
      finishing: 'lux' as const,
      area: 145,
      bedrooms: 3,
      bathrooms: 2,
    };
    const a = engine.calculate(request);
    const b = engine.calculate(request);
    expect(a.estimatedPrice).toBe(b.estimatedPrice);
    expect(a.confidenceScore).toBe(b.confidenceScore);
    expect(formatConfidence(48.230000000000004)).toBe('48.2%');
  });

  test('capture auth + valuation flows', async ({ page }) => {
    // 01 public landing
    await page.goto('/valuation', { waitUntil: 'networkidle' });
    await page.waitForTimeout(400);
    await page.screenshot({
      path: path.join(outDir, '01-public-landing.png'),
      fullPage: true,
    });

    // 02 login initial
    await page.goto('/auth/login', { waitUntil: 'networkidle' });
    await page.waitForTimeout(300);
    await page.screenshot({
      path: path.join(outDir, '02-login-initial.png'),
      fullPage: true,
    });

    // 03 login password
    await page.locator('#login-identifier').fill('demo@example.test');
    await page.locator('[data-testid="login-next"]').click();
    await expect(page.getByRole('heading', { name: 'تسجيل الدخول' })).toBeVisible();
    await page.waitForTimeout(200);
    await page.screenshot({
      path: path.join(outDir, '03-login-password.png'),
      fullPage: true,
    });

    // 04 register
    await page.goto('/auth/register', { waitUntil: 'networkidle' });
    await page.waitForTimeout(300);
    await page.screenshot({
      path: path.join(outDir, '04-register.png'),
      fullPage: true,
    });

    // 05 register errors (reserved fictional identifiers)
    await page.locator('#register-name').fill('مستخدم تجريبي');
    await page.locator('#register-email').fill('taken@example.test');
    await page.locator('#register-phone').fill('01111111111');
    await page.locator('#register-password').fill('secret12');
    await page.locator('[data-testid="register-submit"]').click();
    await expect(page.locator('[data-testid="error-email"]')).toBeVisible();
    await page.waitForTimeout(300);
    await page.screenshot({
      path: path.join(outDir, '05-register-errors.png'),
      fullPage: true,
    });

    // Fix register for verify flow
    await page.locator('#register-email').fill('newuser@example.test');
    await page.locator('#register-phone').fill('01012345678');
    await page.locator('[data-testid="register-submit"]').click();
    await expect(
      page.getByRole('heading', { name: 'تأكيد بريدك الإلكتروني' }),
    ).toBeVisible();
    await page.screenshot({
      path: path.join(outDir, '06-verify-email.png'),
      fullPage: true,
    });

    await page.getByRole('button', { name: 'تخطي' }).click();
    await page.waitForURL('**/valuation');
    await expect(page.getByRole('heading', { name: 'تقييم العقار' })).toBeVisible();

    // 07 account menu logged in
    await page.getByRole('button', { name: 'مستخدم تجريبي' }).click();
    await page.waitForTimeout(250);
    await page.screenshot({
      path: path.join(outDir, '07-account-menu-logged-in.png'),
      clip: { x: 1400, y: 0, width: 520, height: 520 },
    });
    await page.keyboard.press('Escape');

    // 08 dashboard
    await page.screenshot({
      path: path.join(outDir, '08-dashboard.png'),
      fullPage: true,
    });

    // Wizard owned flow shots
    await page.getByRole('link', { name: 'أضف تقييم جديد' }).click();
    await page.waitForURL('**/valuation/add');
    await page.waitForTimeout(300);
    await page.screenshot({
      path: path.join(outDir, '09-step-goal.png'),
      fullPage: true,
    });

    await page.getByRole('button', { name: 'تقييم عقار أملكه' }).click();
    await page.getByRole('button', { name: 'التالي' }).click();

    await page.getByPlaceholder('ابحث عن المدينة أو الحي أو المنطقة').fill('القاهرة الجديدة');
    await page.getByRole('button', { name: /القاهرة الجديدة/ }).first().click();
    await page.waitForTimeout(200);
    await page.screenshot({
      path: path.join(outDir, '10-step-location.png'),
      fullPage: true,
    });
    await page.getByRole('button', { name: 'التالي' }).click();

    await page.getByRole('button', { name: 'شقة', exact: true }).click();
    await page.getByRole('button', { name: 'حديقة', exact: true }).click();
    await page.getByRole('button', { name: 'لوكس', exact: true }).click();
    await page.getByLabel('المساحة (بالمتر)').fill('160');
    await page.getByLabel('زيادة عدد الغرف').click();
    await page.getByLabel('زيادة عدد الغرف').click();
    await page.getByLabel('زيادة عدد الحمامات').click();
    await page.waitForTimeout(200);
    await page.screenshot({
      path: path.join(outDir, '11-step-property-details.png'),
      fullPage: true,
    });
    await page.getByRole('button', { name: 'التالي' }).click();

    await page.getByLabel('سعر شراء العقار').fill('4500000');
    await page.getByLabel('تاريخ شراء العقار (الشهر والسنة)').fill('2020-06');
    await page.waitForTimeout(200);
    await page.screenshot({
      path: path.join(outDir, '12-step-purchase.png'),
      fullPage: true,
    });
    await page.getByRole('button', { name: 'التالي' }).click();

    await page.getByLabel(/سعر العقار اليوم/).fill('8200000');
    await page.waitForTimeout(200);
    await page.screenshot({
      path: path.join(outDir, '13-step-current-estimate.png'),
      fullPage: true,
    });

    await page.getByRole('button', { name: 'احسب القيمة التقديرية' }).click();
    await expect(page.getByRole('heading', { name: 'تحليل بيانات العقارات' })).toBeVisible();
    await page.screenshot({
      path: path.join(outDir, '14-analysis.png'),
      fullPage: true,
    });

    await page.waitForURL(/\/valuation\/report\//, { timeout: 15000 });
    await page.waitForTimeout(400);
    await page.screenshot({
      path: path.join(outDir, '15-report.png'),
      fullPage: true,
    });

    await page.goto('/valuation', { waitUntil: 'networkidle' });
    await page.waitForTimeout(300);
    await page.screenshot({
      path: path.join(outDir, '16-full-flow-final.png'),
      fullPage: true,
    });

    // Portfolio tab
    await page.getByRole('tab', { name: 'المحفظة العقارية' }).click();
    await expect(page.getByText('المزيد من التفاصيل').first()).toBeVisible();

    // Logout → public landing
    await page.getByRole('button', { name: 'مستخدم تجريبي' }).click();
    await page.getByRole('menuitem', { name: 'تسجيل الخروج' }).click();
    await page.goto('/valuation', { waitUntil: 'networkidle' });
    await expect(page.getByRole('link', { name: 'تسجيل الدخول' })).toBeVisible();
  });

  test('price inquiry flow reaches report', async ({ page }) => {
    await loginDemo(page, '/valuation/add');
    await page.getByRole('button', { name: 'استعلام عن سعر عقار' }).click();
    await page.getByRole('button', { name: 'التالي' }).click();
    await page.getByPlaceholder('ابحث عن المدينة أو الحي أو المنطقة').fill('الشيخ زايد');
    await page.getByRole('button', { name: /الشيخ زايد/ }).first().click();
    await page.getByRole('button', { name: 'التالي' }).click();
    await page.getByRole('button', { name: 'فيلا', exact: true }).click();
    await page.getByRole('button', { name: 'جولف', exact: true }).click();
    await page.getByRole('button', { name: 'سوبر لوكس', exact: true }).click();
    await page.getByLabel('المساحة (بالمتر)').fill('280');
    await page.getByLabel('زيادة عدد الغرف').click();
    await page.getByLabel('زيادة عدد الحمامات').click();
    await page.getByRole('button', { name: 'احسب القيمة التقديرية' }).click();
    await page.waitForURL(/\/valuation\/report\//, { timeout: 15000 });
    await expect(page.getByRole('heading', { name: 'تقرير التقييم' })).toBeVisible();
    await page.goto('/valuation');
    await expect(page.getByRole('heading', { name: 'تقييم العقار' })).toBeVisible();
  });
});
