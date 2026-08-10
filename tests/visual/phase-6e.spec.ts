import { expect, test } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import path from 'node:path';

const outDir = path.join('docs', 'visual-qa', 'phase-6e-1920');

test.describe('Phase 6E Marketing Services visual QA', () => {
  test.beforeAll(() => {
    mkdirSync(outDir, { recursive: true });
  });

  test('capture landing page sections', async ({ page }) => {
    await page.goto('/marketing-services', { waitUntil: 'networkidle' });
    await expect(
      page.getByRole('heading', { name: 'خدمات شركات التسويق العقاري' }),
    ).toBeVisible();
    await page.waitForTimeout(400);

    await page.screenshot({
      path: path.join(outDir, '00-full-page.png'),
      fullPage: true,
    });

    await page.screenshot({
      path: path.join(outDir, '01-hero.png'),
      clip: { x: 0, y: 0, width: 1920, height: 780 },
    });

    await page.locator('#marketing-lead-form').scrollIntoViewIfNeeded();
    await page.waitForTimeout(200);
    await page.screenshot({
      path: path.join(outDir, '02-lead-form.png'),
      fullPage: false,
    });

    await page.getByText('أرقام توضيحية للعرض').scrollIntoViewIfNeeded();
    await page.waitForTimeout(150);
    await page.screenshot({
      path: path.join(outDir, '03-stats.png'),
      clip: { x: 200, y: 520, width: 1520, height: 520 },
    });

    await page.locator('#marketing-services').scrollIntoViewIfNeeded();
    await page.waitForTimeout(200);
    await page.screenshot({
      path: path.join(outDir, '04-service-sections-top.png'),
      fullPage: false,
    });

    await page.getByRole('heading', { name: 'خدماتنا للشركات' }).scrollIntoViewIfNeeded();
    await page.waitForTimeout(200);
    await page.screenshot({
      path: path.join(outDir, '05-service-sections-middle.png'),
      fullPage: false,
    });

    await page
      .getByRole('heading', { name: 'شهادات شركاء التسويق العقاري' })
      .scrollIntoViewIfNeeded();
    await page.waitForTimeout(200);
    await page.screenshot({
      path: path.join(outDir, '06-testimonials-or-success.png'),
      fullPage: false,
    });

    await page.getByRole('img', { name: 'نورث ستار' }).scrollIntoViewIfNeeded();
    await page.waitForTimeout(200);
    await page.screenshot({
      path: path.join(outDir, '07-partners.png'),
      fullPage: false,
    });

    await page
      .getByRole('heading', { name: 'ابدأ حملتك التسويقية اليوم' })
      .scrollIntoViewIfNeeded();
    await page.waitForTimeout(200);
    await page.screenshot({
      path: path.join(outDir, '08-final-cta-footer.png'),
      fullPage: true,
    });
  });

  test('lead form success state', async ({ page }) => {
    await page.goto('/marketing-services', { waitUntil: 'networkidle' });
    const form = page.locator('#marketing-lead-form');
    await form.scrollIntoViewIfNeeded();

    await page.locator('#ms-name').fill('أحمد محمود');
    await page.locator('#ms-company').fill('شركة أفق للتسويق');
    await page.locator('#ms-business-type').selectOption('marketing_company');
    await page.locator('#ms-address').fill('القاهرة الجديدة');
    await page.locator('#ms-phone').fill('01001234567');
    await page.locator('#ms-email').fill('demo@example.test');
    await page.getByRole('button', { name: 'سجل' }).click();

    await expect(page.getByText('تم إرسال طلبك بنجاح')).toBeVisible();
  });

  test('mobile landing', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/marketing-services', { waitUntil: 'networkidle' });
    await expect(
      page.getByRole('heading', { name: 'خدمات شركات التسويق العقاري' }),
    ).toBeVisible();
    await page.waitForTimeout(300);

    await page.screenshot({
      path: path.join(outDir, '09-mobile-hero.png'),
      fullPage: true,
    });

    await page.locator('#marketing-lead-form').scrollIntoViewIfNeeded();
    await page.waitForTimeout(200);
    await page.screenshot({
      path: path.join(outDir, '10-mobile-form.png'),
      fullPage: false,
    });

    await page.locator('#marketing-services').scrollIntoViewIfNeeded();
    await page.waitForTimeout(200);
    await page.screenshot({
      path: path.join(outDir, '11-mobile-services.png'),
      fullPage: false,
    });
  });
});
