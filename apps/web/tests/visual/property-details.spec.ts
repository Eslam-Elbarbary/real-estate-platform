import { expect, test } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import path from 'node:path';

const outDir = path.join('docs', 'visual-qa', 'property-details-1920');

/** Full-featured visual QA listing (installments + compound + rich sections). */
const listingPath =
  '/listing/prop-1001/apartment-for-sale-fifth-settlement-1001';

test.describe('Property details visual QA @ 1920x1080', () => {
  test.beforeAll(() => {
    mkdirSync(outDir, { recursive: true });
  });

  test('capture property details sections', async ({ page }) => {
    await page.goto(listingPath, { waitUntil: 'networkidle' });
    await page.waitForTimeout(800);

    await page.screenshot({
      path: path.join(outDir, '01-summary-gallery.png'),
      clip: { x: 0, y: 0, width: 1920, height: 980 },
    });

    const installmentHeading = page.getByRole('heading', {
      name: 'تفاصيل التقسيط',
    });
    await installmentHeading.scrollIntoViewIfNeeded();
    await page.waitForTimeout(250);
    await page.screenshot({
      path: path.join(outDir, '02-details-installments.png'),
      clip: { x: 0, y: 0, width: 1920, height: 980 },
    });

    const amenities = page.locator('#amenities');
    await amenities.scrollIntoViewIfNeeded();
    await page.waitForTimeout(250);
    await page.screenshot({
      path: path.join(outDir, '03-description-amenities.png'),
      clip: { x: 0, y: 0, width: 1920, height: 980 },
    });

    const location = page.locator('#location');
    await location.scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
    await page.screenshot({
      path: path.join(outDir, '04-travel-map.png'),
      clip: { x: 0, y: 0, width: 1920, height: 980 },
    });

    const sellerHeading = page.getByRole('heading', {
      name: 'تواصل مع المعلن',
    });
    await sellerHeading.scrollIntoViewIfNeeded();
    await page.waitForTimeout(250);
    await page.screenshot({
      path: path.join(outDir, '05-seller-compound.png'),
      clip: { x: 0, y: 0, width: 1920, height: 980 },
    });

    const statistics = page.locator('#statistics');
    await statistics.scrollIntoViewIfNeeded();
    await page.waitForTimeout(250);
    await page.screenshot({
      path: path.join(outDir, '06-statistics-rating.png'),
      clip: { x: 0, y: 0, width: 1920, height: 980 },
    });

    const similar = page.getByRole('heading', { name: 'إعلانات ذات صلة' });
    await similar.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await page.screenshot({
      path: path.join(outDir, '07-similar-agents.png'),
      clip: { x: 0, y: 0, width: 1920, height: 1080 },
    });

    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(300);
    await page.screenshot({
      path: path.join(outDir, '08-full-page.png'),
      fullPage: true,
    });

    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.locator('#photos')).toBeVisible();
    await expect(page.locator('#details')).toBeVisible();
    await expect(installmentHeading).toBeVisible();
    await expect(page.getByRole('heading', { name: /تقييم كمبوند/ })).toBeVisible();
    await expect(similar).toBeVisible();

    const similarCards = page
      .locator('section')
      .filter({ has: similar })
      .locator('article');
    await expect(similarCards).toHaveCount(5);
  });

  test('search results cards navigate to matching listings', async ({
    page,
  }) => {
    await page.goto('/properties/sale/apartment', { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);

    const firstCard = page.locator('article').first();
    const titleLink = firstCard.locator('a[href^="/listing/"]').filter({
      hasText: /\S/,
    });
    const cardTitle = (await titleLink.innerText()).trim();
    const href = await titleLink.getAttribute('href');
    expect(href).toMatch(/^\/listing\//);

    await titleLink.click();
    await page.waitForURL(/\/listing\//);
    await page.waitForTimeout(500);

    const detailsTitle = (
      await page.getByRole('heading', { level: 1 }).innerText()
    ).trim();
    expect(detailsTitle).toBe(cardTitle);
  });

  test('property without compound hides compound-only sections', async ({
    page,
  }) => {
    // prop-1004 has compound null in generator cycle (index 3 → compounds[3] = null)
    await page.goto(
      '/listing/prop-1004/apartment-for-sale-fifth-settlement-1004',
      { waitUntil: 'networkidle' },
    );
    await page.waitForTimeout(500);

    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(
      page.getByRole('heading', { name: /تقييم كمبوند/ }),
    ).toHaveCount(0);
    await expect(
      page.getByRole('heading', { name: 'موصى به داخل الكمبوند' }),
    ).toHaveCount(0);
  });
});
