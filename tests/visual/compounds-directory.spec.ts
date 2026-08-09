import { expect, test, type Page } from '@playwright/test';
import { mkdirSync, unlinkSync, existsSync } from 'node:fs';
import path from 'node:path';

const outDir = path.join('docs', 'visual-qa', 'compounds-directory-1920');

/** Default directory shots must never capture an open mega menu. */
async function ensureMenusClosed(page: Page) {
  await page.mouse.move(40, 700);
  await page.keyboard.press('Escape');
  await page.waitForTimeout(200);
  await expect(page.locator('[data-mega-menu-panel="true"]')).toHaveCount(0);
}

test.describe('Compounds directory visual QA @ 1920x1080', () => {
  test.beforeAll(() => {
    mkdirSync(outDir, { recursive: true });
    const legacyTop = path.join(outDir, '01-top.png');
    if (existsSync(legacyTop)) {
      unlinkSync(legacyTop);
    }
  });

  test('capture compounds directory sections', async ({ page }) => {
    await page.goto('/compounds', { waitUntil: 'networkidle' });
    await page.waitForTimeout(700);
    await ensureMenusClosed(page);

    await page.screenshot({
      path: path.join(outDir, '01-top-default.png'),
      clip: { x: 0, y: 0, width: 1920, height: 720 },
    });

    const locationsHeading = page.getByText('الأماكن', { exact: true }).first();
    await locationsHeading.scrollIntoViewIfNeeded();
    await ensureMenusClosed(page);
    await page.screenshot({
      path: path.join(outDir, '02-filter-locations.png'),
      clip: { x: 1280, y: 160, width: 640, height: 820 },
    });

    const propertyTypes = page.getByText('أنواع العقارات', { exact: true }).first();
    await propertyTypes.scrollIntoViewIfNeeded();
    await ensureMenusClosed(page);
    await expect(page.getByText(/شقق/).first()).toBeVisible();
    await page.screenshot({
      path: path.join(outDir, '03-filter-property-types.png'),
      clip: { x: 1280, y: 160, width: 640, height: 820 },
    });

    const firstCard = page.locator('article').first();
    await firstCard.scrollIntoViewIfNeeded();
    await ensureMenusClosed(page);
    await page.screenshot({
      path: path.join(outDir, '04-grid.png'),
      clip: { x: 0, y: 220, width: 1920, height: 860 },
    });

    const pagination = page.getByLabel('ترقيم الصفحات');
    if (await pagination.count()) {
      await pagination.scrollIntoViewIfNeeded();
      await page.waitForTimeout(200);
    }
    await ensureMenusClosed(page);
    await page.screenshot({
      path: path.join(outDir, '05-pagination.png'),
      clip: { x: 0, y: 0, width: 1920, height: 980 },
    });

    await page.evaluate(() => window.scrollTo(0, 0));
    await ensureMenusClosed(page);
    await page.screenshot({
      path: path.join(outDir, '06-full-page.png'),
      fullPage: true,
    });

    await expect(
      page.getByRole('heading', { level: 1, name: /دليل الكمبوند/ }),
    ).toBeVisible();
    await expect(page.locator('article')).toHaveCount(12);
  });

  test('compound filters and card navigation work', async ({ page }) => {
    await page.goto('/compounds', { waitUntil: 'networkidle' });
    await ensureMenusClosed(page);
    await page.getByRole('link', { name: /القاهرة الجديدة/ }).first().click();
    await page.waitForURL(/\/compounds\//);
    await page.waitForTimeout(400);

    const card = page.locator('article').first();
    const href = await card.locator('a[href^="/compound/"]').first().getAttribute('href');
    expect(href).toMatch(/^\/compound\//);

    await card.locator('a[href^="/compound/"]').filter({ hasText: /\S/ }).first().click();
    await page.waitForURL(/\/compound\//);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.getByText(/نشر|واتساب|اتصال/).first()).toBeVisible();
  });
});
