import { expect, test, type Page } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import path from 'node:path';

const outDir = path.join('docs', 'visual-qa', 'compound-details-1920');
const qaSlug = 'orchid-park';
const normalSlug = 'palm-oasis-1018';

async function expectCompleteCompoundDetails(page: Page) {
  await expect(page.locator('[data-compound-details="true"]')).toBeVisible();
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.getByText('التوصية').first()).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'وحدات الكمبوند' }),
  ).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'تفاصيل الكمبوند' }),
  ).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'الموقع على الخريطة' }),
  ).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'المطور', exact: true }).first(),
  ).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'الأسئلة الشائعة' }),
  ).toBeVisible();
  await expect(page.getByText('دليل الكمبوندات').first()).toBeVisible();
}

async function closeMenus(page: Page) {
  await page.mouse.move(40, 700);
  await page.keyboard.press('Escape');
  await page.waitForTimeout(150);
}

test.describe('Compound details visual QA @ 1920x1080', () => {
  test.beforeAll(() => {
    mkdirSync(outDir, { recursive: true });
  });

  test('capture compound details sections', async ({ page }) => {
    await page.goto(`/compound/${qaSlug}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(800);
    await closeMenus(page);

    await page.screenshot({
      path: path.join(outDir, '01-top.png'),
      clip: { x: 0, y: 0, width: 1920, height: 720 },
    });

    await page.screenshot({
      path: path.join(outDir, '02-gallery-sidebar.png'),
      clip: { x: 0, y: 80, width: 1920, height: 780 },
    });

    const units = page.getByRole('heading', { name: 'وحدات الكمبوند' });
    await units.scrollIntoViewIfNeeded();
    await page.waitForTimeout(250);
    await page.screenshot({
      path: path.join(outDir, '03-units.png'),
      clip: { x: 0, y: 0, width: 1920, height: 900 },
    });

    const description = page.getByRole('heading', { name: 'تفاصيل الكمبوند' });
    await description.scrollIntoViewIfNeeded();
    await page.waitForTimeout(250);
    await page.screenshot({
      path: path.join(outDir, '04-description.png'),
      clip: { x: 0, y: 0, width: 1920, height: 900 },
    });

    const map = page.getByRole('heading', { name: 'الموقع على الخريطة' });
    await map.scrollIntoViewIfNeeded();
    await page.waitForTimeout(250);
    await page.screenshot({
      path: path.join(outDir, '05-map-developer.png'),
      clip: { x: 0, y: 0, width: 1920, height: 980 },
    });

    const faq = page.getByRole('heading', { name: 'الأسئلة الشائعة' });
    await faq.scrollIntoViewIfNeeded();
    await page.waitForTimeout(250);
    await page.screenshot({
      path: path.join(outDir, '06-faq-banner.png'),
      clip: { x: 0, y: 0, width: 1920, height: 980 },
    });

    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(250);
    await page.screenshot({
      path: path.join(outDir, '07-full-page.png'),
      fullPage: true,
    });

    await expect(
      page.getByRole('heading', { level: 1, name: /أوركيد بارك|Orchid Park/ }),
    ).toBeVisible();

    await page.goto(`/compound/${normalSlug}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(600);
    await closeMenus(page);
    await expectCompleteCompoundDetails(page);
    await page.screenshot({
      path: path.join(outDir, '08-normal-compound-full-page.png'),
      fullPage: true,
    });
  });

  test('units tabs navigate to property listings', async ({ page }) => {
    await page.goto(`/compound/${qaSlug}`, { waitUntil: 'networkidle' });
    await closeMenus(page);

    const unitsHeading = page.getByRole('heading', { name: 'وحدات الكمبوند' });
    await unitsHeading.scrollIntoViewIfNeeded();

    await expect(page.getByRole('link', { name: 'للبيع - المطور' })).toBeVisible();
    await page.screenshot({
      path: path.join(outDir, '09-units-developer-sale.png'),
      clip: { x: 0, y: 0, width: 1920, height: 980 },
    });

    const developerRow = page.locator('#units a[href^="/listing/"]').first();
    const developerHref = await developerRow.getAttribute('href');
    expect(developerHref).toMatch(/^\/listing\//);
    await developerRow.click();
    await page.waitForURL(/\/listing\//);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await closeMenus(page);
    await page.screenshot({
      path: path.join(outDir, '12-developer-listing.png'),
      clip: { x: 0, y: 0, width: 1920, height: 980 },
    });

    await page.goto(`/compound/${qaSlug}?units=advertiser-sale`, {
      waitUntil: 'networkidle',
    });
    await unitsHeading.scrollIntoViewIfNeeded();
    await page.waitForTimeout(200);
    await page.screenshot({
      path: path.join(outDir, '10-units-advertiser-sale.png'),
      clip: { x: 0, y: 0, width: 1920, height: 980 },
    });
    const saleRow = page.locator('#units a[href^="/listing/"]').first();
    await saleRow.click();
    await page.waitForURL(/\/listing\//);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await closeMenus(page);
    await page.screenshot({
      path: path.join(outDir, '13-advertiser-sale-listing.png'),
      clip: { x: 0, y: 0, width: 1920, height: 980 },
    });

    await page.goto(`/compound/${qaSlug}?units=advertiser-rent`, {
      waitUntil: 'networkidle',
    });
    await page.getByRole('heading', { name: 'وحدات الكمبوند' }).scrollIntoViewIfNeeded();
    await page.waitForTimeout(200);
    await page.screenshot({
      path: path.join(outDir, '11-units-advertiser-rent.png'),
      clip: { x: 0, y: 0, width: 1920, height: 980 },
    });
    const rentRow = page.locator('#units a[href^="/listing/"]').first();
    await rentRow.click();
    await page.waitForURL(/\/listing\//);
    await expect(page.getByText(/\/شهر|شهر/).first()).toBeVisible();
    await closeMenus(page);
    await page.screenshot({
      path: path.join(outDir, '14-advertiser-rent-listing.png'),
      clip: { x: 0, y: 0, width: 1920, height: 980 },
    });

    await page.goto('/compound/does-not-exist-xyz', {
      waitUntil: 'networkidle',
    });
    await expect(page.locator('[data-compound-details="true"]')).toHaveCount(0);
  });

  test('five directory cards open complete compound details', async ({
    page,
  }) => {
    await page.goto('/compounds', { waitUntil: 'networkidle' });
    const cards = page.locator('article');
    await expect(cards).toHaveCount(12);

    for (let index = 0; index < 5; index += 1) {
      await page.goto('/compounds', { waitUntil: 'networkidle' });
      const card = cards.nth(index);
      const href = await card
        .locator('a[href^="/compound/"]')
        .first()
        .getAttribute('href');
      expect(href).toMatch(/^\/compound\//);
      await page.goto(href!, { waitUntil: 'networkidle' });
      await expectCompleteCompoundDetails(page);
      await expect(page.locator('#units a[href^="/listing/"]').first()).toBeVisible();
    }
  });
});
