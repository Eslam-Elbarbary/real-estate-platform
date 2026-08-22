import { expect, test } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import path from 'node:path';

const outDir = path.join('docs', 'visual-qa', 'market-index-1920');

test.describe('Market Index', () => {
  test.beforeAll(() => {
    mkdirSync(outDir, { recursive: true });
  });

  test.describe.configure({ timeout: 120_000 });

  test('main page newest entry, archive, pagination, screenshots', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    const response = await page.goto('/market-index', { waitUntil: 'networkidle' });
    expect(response?.status()).toBe(200);

    await expect(
      page.getByRole('heading', { level: 1, name: 'المؤشر العقاري' }),
    ).toBeVisible();
    await expect(
      page.getByRole('heading', { name: /مؤشر عقارات مصر — يونيو 2026/ }),
    ).toBeVisible();
    await expect(page.getByRole('heading', { name: 'ما هو المؤشر العقاري؟' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'الأرشيف' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'يونيو 2026' }).first()).toBeVisible();

    await page.waitForTimeout(300);
    await page.screenshot({
      path: path.join(outDir, '00-full-page.png'),
      fullPage: true,
    });
    await page.screenshot({
      path: path.join(outDir, '01-main-top.png'),
      fullPage: false,
    });

    const firstCard = page.getByTestId('market-index-card-2026-6');
    await firstCard.scrollIntoViewIfNeeded();
    await page.waitForTimeout(150);
    await firstCard.screenshot({
      path: path.join(outDir, '02-main-first-entry.png'),
    });

    await page.getByRole('heading', { name: 'الأرشيف' }).scrollIntoViewIfNeeded();
    await page.waitForTimeout(150);
    await page.screenshot({
      path: path.join(outDir, '03-main-sidebar.png'),
      fullPage: false,
    });

    const secondCard = page.getByTestId('market-index-card-2026-5');
    await secondCard.scrollIntoViewIfNeeded();
    await page.waitForTimeout(150);
    await secondCard.screenshot({
      path: path.join(outDir, '04-main-second-entry.png'),
    });

    await page.getByTestId('market-index-pagination').scrollIntoViewIfNeeded();
    await page.waitForTimeout(150);
    await page.screenshot({
      path: path.join(outDir, '05-main-pagination.png'),
      fullPage: false,
    });

    await page.getByRole('link', { name: '2', exact: true }).click();
    await page.waitForURL(/page=2/);
    await expect(page.getByTestId('market-index-card-2025-10')).toBeVisible();
  });

  test('archive month link opens matching detail', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/market-index', { waitUntil: 'networkidle' });
    await page.getByRole('link', { name: 'مايو 2026', exact: true }).click();
    await page.waitForURL(/\/market-index\/2026\/5$/);
    await expect(
      page.getByRole('heading', { level: 1, name: /مؤشر عقارات مصر — مايو 2026/ }),
    ).toBeVisible();
    await expect(page.getByText('5,207', { exact: true })).toBeVisible();
  });

  test('month detail chart, content, prev/next, screenshots', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/market-index/2026/5', { waitUntil: 'networkidle' });

    await expect(
      page.getByRole('heading', { level: 1, name: /مؤشر عقارات مصر — مايو 2026/ }),
    ).toBeVisible();
    await expect(page.getByTestId('market-index-chart')).toBeVisible();
    await expect(page.getByText('5,207', { exact: true })).toBeVisible();

    await page.waitForTimeout(250);
    await page.screenshot({
      path: path.join(outDir, '06-month-detail-top.png'),
      fullPage: false,
    });
    await page.getByTestId('market-index-chart').screenshot({
      path: path.join(outDir, '07-month-detail-chart.png'),
    });
    await page
      .locator('article p')
      .first()
      .scrollIntoViewIfNeeded();
    await page.waitForTimeout(150);
    await page.screenshot({
      path: path.join(outDir, '08-month-detail-content.png'),
      fullPage: false,
    });

    const nav = page.getByTestId('market-index-month-nav');
    await nav.scrollIntoViewIfNeeded();
    await page.waitForTimeout(150);
    await nav.screenshot({
      path: path.join(outDir, '09-month-navigation.png'),
    });

    await page.getByRole('link', { name: /الشهر السابق/ }).click();
    await page.waitForURL(/\/market-index\/2026\/4$/);

    await page.goto('/market-index/2026/5', { waitUntil: 'networkidle' });
    await page.getByRole('link', { name: /الشهر التالي/ }).click();
    await page.waitForURL(/\/market-index\/2026\/6$/);
  });

  test('unknown year/month is 404', async ({ page }) => {
    const response = await page.goto('/market-index/1999/1', {
      waitUntil: 'domcontentloaded',
    });
    expect(response?.status()).toBe(404);
  });

  test('pagination preserves year filter', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/market-index?year=2025', { waitUntil: 'networkidle' });
    await expect(page.getByTestId('market-index-card-2025-12')).toBeVisible();
    await page.getByTestId('market-index-pagination').getByRole('link', { name: '2' }).click();
    await page.waitForURL(/year=2025.*page=2/);
    await expect(page.getByTestId('market-index-card-2025-4')).toBeVisible();
  });

  test('Know mega menu links to /market-index', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.getByRole('button', { name: 'أعرف' }).hover();
    const indexLink = page.getByRole('link', { name: /المؤشر العقاري/ }).first();
    await expect(indexLink).toBeVisible();
    await expect(indexLink).toHaveAttribute('href', '/market-index');
    await page.screenshot({
      path: path.join(outDir, '10-know-menu-link.png'),
      fullPage: false,
    });
  });

  test('Know More card links to /market-index', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/advice', { waitUntil: 'networkidle' });
    const card = page.getByTestId('know-service-market-index');
    await expect(card).toBeVisible();
    await card.scrollIntoViewIfNeeded();
    await page.waitForTimeout(150);
    await page.screenshot({
      path: path.join(outDir, '11-know-more-link.png'),
      fullPage: false,
    });
    await card.getByRole('link').click();
    await page.waitForURL(/\/market-index\/?$/);
  });

  test('homepage Know section links to /market-index', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.getByRole('heading', { name: 'المؤشر العقاري' }).scrollIntoViewIfNeeded();
    await page
      .getByRole('article')
      .filter({ has: page.getByRole('heading', { name: 'المؤشر العقاري' }) })
      .getByRole('link')
      .click();
    await page.waitForURL(/\/market-index\/?$/);
  });

  test('mobile main and detail no overflow', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/market-index', { waitUntil: 'networkidle' });
    const overflowMain = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 2,
    );
    expect(overflowMain).toBe(false);
    await page.waitForTimeout(200);
    await page.screenshot({
      path: path.join(outDir, '12-mobile-main.png'),
      fullPage: false,
    });
    await page.getByTestId('market-index-card-2026-6').screenshot({
      path: path.join(outDir, '13-mobile-entry.png'),
    });

    await page.goto('/market-index/2026/5', { waitUntil: 'networkidle' });
    const overflowDetail = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 2,
    );
    expect(overflowDetail).toBe(false);
    await page.screenshot({
      path: path.join(outDir, '14-mobile-detail.png'),
      fullPage: false,
    });
  });
});
