import { expect, test } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import path from 'node:path';

const outDir = path.join('docs', 'visual-qa', 'advice-research-1920');

test.describe('Advice Research', () => {
  test.beforeAll(() => {
    mkdirSync(outDir, { recursive: true });
  });

  test.describe.configure({ timeout: 120_000 });

  test('landing 200, services, videos, partners, screenshots', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    const response = await page.goto('/advice/research', { waitUntil: 'networkidle' });
    expect(response?.status()).toBe(200);

    await expect(
      page.getByRole('heading', { name: 'بوابة الأبحاث والدراسات العقارية' }),
    ).toBeVisible();
    await expect(page.getByTestId('research-service-trends-report')).toBeVisible();
    await expect(page.getByTestId('research-service-custom-study')).toBeVisible();

    await page.waitForTimeout(250);
    await page.screenshot({ path: path.join(outDir, '00-full-page.png'), fullPage: true });
    await page.screenshot({ path: path.join(outDir, '01-hero.png'), fullPage: false });

    await page.locator('#research-services').scrollIntoViewIfNeeded();
    await page.waitForTimeout(150);
    await page.locator('#research-services').screenshot({
      path: path.join(outDir, '02-service-cards.png'),
    });

    await page.getByRole('heading', { name: 'دراسات حالة' }).scrollIntoViewIfNeeded();
    await page.waitForTimeout(150);
    await page.screenshot({ path: path.join(outDir, '03-video-section.png'), fullPage: false });

    await page.getByRole('heading', { name: 'شركاؤنا وعملاؤنا' }).scrollIntoViewIfNeeded();
    await page.waitForTimeout(150);
    await page.screenshot({ path: path.join(outDir, '04-partners.png'), fullPage: false });

    await page.getByRole('heading', { name: 'هل لديك استفسار أو طلب مختلف؟' }).scrollIntoViewIfNeeded();
    await page.waitForTimeout(150);
    await page.screenshot({ path: path.join(outDir, '05-contact-cta.png'), fullPage: false });
  });

  test('service buttons use native request types', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/advice/research', { waitUntil: 'networkidle' });

    await page.getByTestId('research-service-trends-report').getByRole('link').click();
    await page.waitForURL(/type=trends-report/);
    await expect(page.getByRole('heading', { name: 'طلب تقرير اتجاهات السوق' })).toBeVisible();
    await page.screenshot({ path: path.join(outDir, '06-trends-form.png'), fullPage: false });

    await page.goto('/advice/research/request?type=market-impact-report', {
      waitUntil: 'networkidle',
    });
    await expect(page.getByRole('heading', { name: 'طلب تقرير تحليلي للسوق' })).toBeVisible();
    await page.screenshot({ path: path.join(outDir, '07-market-impact-form.png'), fullPage: false });

    await page.goto('/advice/research/request?type=price-data', { waitUntil: 'networkidle' });
    await expect(page.getByRole('heading', { name: 'طلب بيانات وأسعار عقارية' })).toBeVisible();
    await page.screenshot({ path: path.join(outDir, '08-price-data-form.png'), fullPage: false });

    await page.goto('/advice/research/request?type=custom-study', { waitUntil: 'networkidle' });
    await expect(page.getByRole('heading', { name: 'طلب دراسة عقارية مخصصة' })).toBeVisible();
    await page.screenshot({ path: path.join(outDir, '09-custom-study-form.png'), fullPage: true });

    await page.goto('/advice/research/request?type=contact', { waitUntil: 'networkidle' });
    await expect(page.getByRole('heading', { name: 'تواصل مع فريق الأبحاث' })).toBeVisible();
    await page.screenshot({ path: path.join(outDir, '10-contact-form.png'), fullPage: false });
  });

  test('unknown type is 404', async ({ page }) => {
    const response = await page.goto('/advice/research/request?type=unknown', {
      waitUntil: 'domcontentloaded',
    });
    expect(response?.status()).toBe(404);
  });

  test('custom study validation and success', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/advice/research/request?type=custom-study', {
      waitUntil: 'networkidle',
    });
    await page.getByRole('button', { name: 'إرسال الطلب' }).click();
    await expect(page.getByText('يرجى إدخال الاسم')).toBeVisible();
    await page.screenshot({ path: path.join(outDir, '11-form-errors.png'), fullPage: false });

    await page.locator('#res-name').fill('سارة أحمد');
    await page.locator('#res-company').fill('شركة أفق التجريبية');
    await page.locator('#res-email').fill('sara@example.com');
    await page.locator('#res-phone').fill('01000000000');
    await page.locator('#res-job').fill('مدير تطوير');
    await page.locator('#res-project').fill('مشروع واحة النخيل');
    await page.locator('#res-target').fill('القاهرة الجديدة');
    await page.getByLabel('سكني', { exact: true }).check();
    await page.getByLabel('دراسة سوق', { exact: true }).check();
    await page.locator('#res-need').fill(
      'نحتاج دراسة سوق أولية توضح حجم الطلب والمعروض في المنطقة المستهدفة قبل الإطلاق.',
    );
    await page.getByLabel('مرن', { exact: true }).check();
    await page.getByRole('button', { name: 'إرسال الطلب' }).click();
    await expect(page.getByTestId('research-request-success')).toBeVisible();
    await expect(page.getByText('REQ-RES-1001')).toBeVisible();
    await page.screenshot({ path: path.join(outDir, '12-success-state.png'), fullPage: false });

    await page.getByTestId('research-request-success').getByRole('link', { name: 'العودة إلى الأبحاث والدراسات' }).click();
    await page.waitForURL(/\/advice\/research\/?$/);
  });

  test('Know mega menu links to research', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.getByRole('button', { name: 'أعرف' }).hover();
    const link = page.getByRole('link', { name: /أبحاث ودراسات/ }).first();
    await expect(link).toHaveAttribute('href', '/advice/research');
    await page.locator('[data-mega-menu-panel="true"]').screenshot({
      path: path.join(outDir, '13-know-menu.png'),
    });
  });

  test('mobile landing and form no overflow', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/advice/research', { waitUntil: 'networkidle' });
    const overflowLanding = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 2,
    );
    expect(overflowLanding).toBe(false);
    await page.screenshot({ path: path.join(outDir, '14-mobile-landing.png'), fullPage: false });

    await page.goto('/advice/research/request?type=trends-report', {
      waitUntil: 'networkidle',
    });
    const overflowForm = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 2,
    );
    expect(overflowForm).toBe(false);
    await page.screenshot({ path: path.join(outDir, '15-mobile-form.png'), fullPage: false });
  });
});
