import { expect, test } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import path from 'node:path';

const outDir = path.join('docs', 'visual-qa', 'neighborhood-1920');

test.describe('Neighborhood / property prices', () => {
  test.beforeAll(() => {
    mkdirSync(outDir, { recursive: true });
  });

  test.describe.configure({ timeout: 90_000 });

  test('directory → region → area + screenshots', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/neighborhood', { waitUntil: 'networkidle' });
    await expect(
      page.getByRole('heading', { name: 'أسعار العقارات في مصر' }),
    ).toBeVisible();
    await expect(page.getByRole('link', { name: 'الساحل الشمالي' }).first()).toBeVisible();
    await page.waitForTimeout(300);
    await page.screenshot({
      path: path.join(outDir, '01-directory-full.png'),
      fullPage: true,
    });
    await page.locator('.grid').first().screenshot({
      path: path.join(outDir, '02-directory-regions-grid.png'),
    });
    await page
      .getByRole('heading', { name: 'عقارات في مدن مصر' })
      .scrollIntoViewIfNeeded();
    await page.waitForTimeout(200);
    await page.screenshot({
      path: path.join(outDir, '03-directory-city-links.png'),
      fullPage: false,
    });

    await page.getByRole('link', { name: 'الساحل الشمالي' }).first().click();
    await page.waitForURL(/\/neighborhood\/north-coast$/);
    await expect(
      page.getByRole('heading', { name: /دليل أسعار عقارات الساحل الشمالي/ }),
    ).toBeVisible();
    const alameinCardHeading = page.getByRole('heading', {
      name: 'العلمين',
      exact: true,
    });
    await expect(alameinCardHeading).toBeVisible();
    await page.waitForTimeout(250);
    await page.screenshot({
      path: path.join(outDir, '04-region-page-full.png'),
      fullPage: true,
    });
    await page.screenshot({
      path: path.join(outDir, '05-region-hero.png'),
      fullPage: false,
    });
    await alameinCardHeading.scrollIntoViewIfNeeded();
    await page.waitForTimeout(150);
    await page.screenshot({
      path: path.join(outDir, '06-region-child-cards.png'),
      fullPage: false,
    });

    await page
      .getByRole('article')
      .filter({ has: alameinCardHeading })
      .getByRole('link', { name: 'التفاصيل' })
      .click();
    await page.waitForURL(/\/neighborhood\/north-coast\/el-alamein/);
    await expect(
      page.getByRole('heading', { name: 'أسعار العقارات في العلمين' }),
    ).toBeVisible();
    await expect(page.getByText('متوسط سعر المتر').first()).toBeVisible();
    await expect(page.getByText(/زيادة الأسعار في 12 شهر|انخفاض|استقرار/)).toBeVisible();
    await expect(page.getByRole('heading', { name: 'تقييم العلمين' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'عن العلمين' })).toBeVisible();
    await expect(
      page.getByRole('heading', { name: /أكبر المكاتب العقارية في العلمين/ }),
    ).toBeVisible();
    await expect(
      page.getByRole('heading', { name: 'الأسئلة الأكثر شيوعاً' }),
    ).toBeVisible();
    const faqButton = page.getByRole('button', { name: /ما متوسط سعر المتر/ });
    if ((await faqButton.getAttribute('aria-expanded')) !== 'true') {
      await faqButton.click();
    }
    await expect(page.getByText(/متوسط سعر المتر يختلف/)).toBeVisible();
    await expect(
      page.getByRole('link', { name: /شقة للبيع في العلمين/ }),
    ).toBeVisible();

    await page.waitForTimeout(250);
    await page.screenshot({
      path: path.join(outDir, '07-area-page-full.png'),
      fullPage: true,
    });
    await page
      .getByRole('heading', { name: 'أسعار العقارات في العلمين' })
      .scrollIntoViewIfNeeded();
    await page.screenshot({
      path: path.join(outDir, '08-area-price-summary.png'),
      fullPage: false,
    });
    await page.getByRole('heading', { name: /إحصائيات العلمين/ }).scrollIntoViewIfNeeded();
    await page.screenshot({
      path: path.join(outDir, '09-area-annual-change.png'),
      fullPage: false,
    });
    await page.getByRole('heading', { name: 'تقييم العلمين' }).scrollIntoViewIfNeeded();
    await page.screenshot({
      path: path.join(outDir, '10-area-ratings.png'),
      fullPage: false,
    });
    await page.getByRole('heading', { name: 'عن العلمين' }).scrollIntoViewIfNeeded();
    await page.screenshot({
      path: path.join(outDir, '11-area-about.png'),
      fullPage: false,
    });
    await page
      .getByRole('heading', { name: /أكبر المكاتب العقارية/ })
      .scrollIntoViewIfNeeded();
    await page.screenshot({
      path: path.join(outDir, '12-area-brokers.png'),
      fullPage: false,
    });
    await page
      .getByRole('heading', { name: 'الأسئلة الأكثر شيوعاً' })
      .scrollIntoViewIfNeeded();
    await page.screenshot({
      path: path.join(outDir, '13-area-faq.png'),
      fullPage: false,
    });
    await page
      .getByRole('heading', { name: 'عقارات في العلمين', exact: true })
      .scrollIntoViewIfNeeded();
    await page.screenshot({
      path: path.join(outDir, '14-area-property-links.png'),
      fullPage: false,
    });
  });

  test('property search integration + homepage entry + not found', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/neighborhood/north-coast/el-alamein', {
      waitUntil: 'networkidle',
    });
    await page.getByRole('link', { name: /شقة للبيع في العلمين/ }).click();
    await page.waitForURL(/\/properties\/sale\/apartment\//);
    expect(page.url()).toContain('north-coast');

    await page.goto('/', { waitUntil: 'networkidle' });
    const pricesHeading = page.getByRole('heading', {
      name: 'أسعار العقارات',
      exact: true,
    });
    await pricesHeading.scrollIntoViewIfNeeded();
    await page.waitForTimeout(200);
    await page.screenshot({
      path: path.join(outDir, '15-home-entry-card.png'),
      fullPage: false,
    });
    await pricesHeading
      .locator('xpath=ancestor::article[1]')
      .getByRole('link')
      .click();
    await page.waitForURL(/\/neighborhood\/?$/);

    const response = await page.goto('/neighborhood/non-existing-location', {
      waitUntil: 'networkidle',
    });
    expect(response?.status()).toBe(404);
  });

  test('mobile screenshots', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/neighborhood', { waitUntil: 'networkidle' });
    await page.waitForTimeout(250);
    await page.screenshot({
      path: path.join(outDir, '16-directory-mobile.png'),
      fullPage: true,
    });
    await page.goto('/neighborhood/north-coast', { waitUntil: 'networkidle' });
    await page.waitForTimeout(250);
    await page.screenshot({
      path: path.join(outDir, '17-region-mobile.png'),
      fullPage: true,
    });
    await page.goto('/neighborhood/north-coast/el-alamein', {
      waitUntil: 'networkidle',
    });
    await page.waitForTimeout(250);
    await page.screenshot({
      path: path.join(outDir, '18-area-mobile.png'),
      fullPage: true,
    });
  });
});
