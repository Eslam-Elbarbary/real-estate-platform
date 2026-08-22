import { expect, test } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import path from 'node:path';

const outDir = path.join('docs', 'visual-qa', 'search-results-1920');

test.describe('Search results visual QA @ 1920x1080', () => {
  test.beforeAll(() => {
    mkdirSync(outDir, { recursive: true });
  });

  test('capture search results states', async ({ page }) => {
    await page.goto('/properties/sale/apartment', { waitUntil: 'networkidle' });
    await page.waitForTimeout(600);

    await page.screenshot({
      path: path.join(outDir, '01-page-top.png'),
      clip: { x: 0, y: 0, width: 1920, height: 980 },
    });

    await page.screenshot({
      path: path.join(outDir, '00-full-page.png'),
      fullPage: true,
    });

    await page.getByTestId('filter-transaction').click();
    await page.waitForTimeout(250);
    await page.screenshot({
      path: path.join(outDir, '02-transaction-dropdown.png'),
      clip: { x: 0, y: 0, width: 1920, height: 700 },
    });
    await page.keyboard.press('Escape');

    await page.getByTestId('filter-property-type').click();
    await page.waitForTimeout(250);
    await page.screenshot({
      path: path.join(outDir, '03-property-type-dropdown.png'),
      clip: { x: 0, y: 0, width: 1920, height: 820 },
    });
    await page.keyboard.press('Escape');

    await page.getByTestId('filter-price').click();
    await page.waitForTimeout(250);
    await page.screenshot({
      path: path.join(outDir, '04-price-dropdown.png'),
      clip: { x: 0, y: 0, width: 1920, height: 900 },
    });
    await page.keyboard.press('Escape');

    await page.getByTestId('filter-area').click();
    await page.waitForTimeout(250);
    await page.screenshot({
      path: path.join(outDir, '05-area-dropdown.png'),
      clip: { x: 0, y: 0, width: 1920, height: 860 },
    });
    await page.keyboard.press('Escape');

    await page.getByTestId('filter-advanced').click();
    await page.waitForTimeout(400);
    await page.screenshot({
      path: path.join(outDir, '06-advanced-drawer.png'),
      clip: { x: 0, y: 0, width: 1920, height: 1080 },
    });
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);

    const heading = page.getByRole('heading', { name: 'شقق للبيع', exact: true });
    await heading.scrollIntoViewIfNeeded();
    await page.waitForTimeout(200);
    await page.screenshot({
      path: path.join(outDir, '07-property-grid.png'),
      clip: { x: 0, y: 280, width: 1920, height: 800 },
    });

    const seoHeading = page.getByRole('heading', {
      name: 'دليل شقق للبيع في مصر',
    });
    await seoHeading.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await page.screenshot({
      path: path.join(outDir, '08-pagination-seo.png'),
      clip: { x: 0, y: 0, width: 1920, height: 1080 },
    });

    await expect(heading).toBeVisible();
    await expect(seoHeading).toBeVisible();
  });
});
