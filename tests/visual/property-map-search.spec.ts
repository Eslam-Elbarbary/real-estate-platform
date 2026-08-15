import { expect, test } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import path from 'node:path';

const outDir = path.join('docs', 'visual-qa', 'property-map-search-1920');
const mapUrl =
  '/properties/sale/apartment/cairo/new-cairo/fifth-settlement?view=map';

test.describe('Property map search', () => {
  test.beforeAll(() => {
    mkdirSync(outDir, { recursive: true });
  });

  test.describe.configure({ timeout: 120_000 });

  test('list to map preserves filters and renders explorer', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/properties/sale/apartment/cairo/new-cairo/fifth-settlement', {
      waitUntil: 'networkidle',
    });
    await page.getByTestId('map-search-toggle').click();
    await page.waitForURL(/view=map/);
    await expect(page.getByTestId('property-map-explorer')).toBeVisible();
    await expect(page.getByTestId('property-map')).toBeVisible();
    await page.waitForTimeout(800);
    await page.screenshot({
      path: path.join(outDir, '00-full-map-results.png'),
      fullPage: false,
    });
    await page.getByTestId('property-map').screenshot({
      path: path.join(outDir, '01-initial-map.png'),
    });
  });

  test('clusters, markers, cards, scroll sync, search this area', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto(mapUrl, { waitUntil: 'networkidle' });
    await page.waitForTimeout(900);

    const cluster = page.getByTestId('map-cluster').first();
    if (await cluster.count()) {
      await page.screenshot({ path: path.join(outDir, '02-clusters.png'), fullPage: false });
      await cluster.click({ force: true });
      await page.waitForTimeout(600);
    }

    await expect(page.getByTestId('map-price-marker').first()).toBeVisible({ timeout: 8000 });
    await page.screenshot({ path: path.join(outDir, '03-price-markers.png'), fullPage: false });
    await page.getByTestId('map-results-panel').screenshot({
      path: path.join(outDir, '04-results-panel.png'),
    });

    const firstCard = page.getByTestId('map-results-panel').locator('[data-property-id]').first();
    const firstId = await firstCard.getAttribute('data-property-id');
    await firstCard.hover();
    await page.waitForTimeout(200);
    await page.screenshot({
      path: path.join(outDir, '05-card-active-marker.png'),
      fullPage: false,
    });

    await page.getByTestId('map-price-marker').first().click({ force: true });
    await page.waitForTimeout(400);
    await page.screenshot({
      path: path.join(outDir, '06-marker-active-card.png'),
      fullPage: false,
    });

    const before = await page.evaluate(() => window.__propertyMapLeaflet?.getCenter());
    await page.getByTestId('map-results-panel').evaluate((el) => {
      el.scrollTop = el.scrollHeight * 0.65;
    });
    await page.waitForTimeout(700);
    const after = await page.evaluate(() => window.__propertyMapLeaflet?.getCenter());
    expect(before && after).toBeTruthy();
    if (before && after) {
      expect(Math.abs(before.lat - after.lat) + Math.abs(before.lng - after.lng)).toBeGreaterThan(
        0.00001,
      );
    }
    await page.screenshot({
      path: path.join(outDir, '07-scrolled-results-map-follow.png'),
      fullPage: false,
    });

    await page.evaluate(() => window.__propertyMapLeaflet?.panBy(180, 120));
    await page.waitForTimeout(500);
    await expect(page.getByTestId('search-this-area')).toBeVisible();
    await page.screenshot({
      path: path.join(outDir, '08-search-this-area.png'),
      fullPage: false,
    });
    await page.getByTestId('search-this-area').click();
    await page.waitForTimeout(400);
    await page.screenshot({
      path: path.join(outDir, '09-map-area-results.png'),
      fullPage: false,
    });
    expect(firstId).toBeTruthy();
  });

  test('empty state, sort, filter, back to list', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto(
      '/properties/sale/apartment?view=map&minPrice=999999999',
      { waitUntil: 'networkidle' },
    );
    await page.waitForTimeout(600);
    await expect(page.getByText('عفواً، لا توجد نتائج مطابقة')).toBeVisible();
    await page.screenshot({
      path: path.join(outDir, '10-empty-map-results.png'),
      fullPage: false,
    });

    await page.goto(mapUrl, { waitUntil: 'networkidle' });
    await page.waitForTimeout(700);
    await page.getByLabel('الترتيب حسب').selectOption('price_desc');
    await page.waitForURL(/sort=price_desc/);
    await expect(page.url()).toMatch(/view=map/);
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(outDir, '11-sort-map.png'), fullPage: false });

    await page.getByTestId('filter-transaction').click();
    await page.getByRole('button', { name: 'للإيجار' }).click();
    await page.waitForURL(/\/properties\/rent/);
    await expect(page.url()).toMatch(/view=map/);
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(outDir, '12-filter-map.png'), fullPage: false });

    await page.getByTestId('back-to-list').first().click();
    await page.waitForURL((url) => !url.searchParams.get('view') || url.searchParams.get('view') === 'list');
    await expect(page.getByTestId('map-search-toggle')).toBeVisible();
    await page.screenshot({ path: path.join(outDir, '13-back-to-list.png'), fullPage: false });
  });

  test('mobile and tablet toggles, no overflow', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/properties/sale/apartment', { waitUntil: 'networkidle' });
    const overflowList = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 2,
    );
    expect(overflowList).toBe(false);
    await page.screenshot({ path: path.join(outDir, '14-mobile-list.png'), fullPage: false });

    await page.getByTestId('map-search-toggle').click();
    await page.waitForURL(/view=map/);
    await page.waitForTimeout(700);
    const overflowMap = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 2,
    );
    expect(overflowMap).toBe(false);
    await page.screenshot({ path: path.join(outDir, '15-mobile-map.png'), fullPage: false });

    await page.setViewportSize({ width: 900, height: 1024 });
    await page.goto(mapUrl, { waitUntil: 'networkidle' });
    await page.waitForTimeout(700);
    await expect(page.getByTestId('property-map')).toBeVisible();
    await page.screenshot({ path: path.join(outDir, '16-tablet-map-toggle.png'), fullPage: false });
  });
});
