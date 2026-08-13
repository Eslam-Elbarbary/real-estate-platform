import { expect, test, type Page } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import path from 'node:path';

const outDir = path.join('docs', 'visual-qa', 'advice-more-1920');
const blockedAdviceHrefs = [
  '/advice/research',
];

async function collectHrefs(page: Page): Promise<string[]> {
  return page.locator('a[href]').evaluateAll((nodes) =>
    nodes
      .map((node) => (node as HTMLAnchorElement).getAttribute('href') ?? '')
      .filter(Boolean),
  );
}

test.describe('Know More + Real Estate Advice', () => {
  test.beforeAll(() => {
    mkdirSync(outDir, { recursive: true });
  });

  test.describe.configure({ timeout: 90_000 });

  test('/advice renders six services', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/advice', { waitUntil: 'networkidle' });

    await expect(
      page.getByRole('heading', { name: 'علشان تختار عقارك صح' }),
    ).toBeVisible();
    await expect(page.getByRole('heading', { name: 'خدماتنا' })).toBeVisible();
    await expect(page.getByTestId('know-service-search')).toBeVisible();
    await expect(page.getByTestId('know-service-valuation')).toBeVisible();
    await expect(page.getByTestId('know-service-add-property')).toBeVisible();
    await expect(page.getByTestId('know-service-compounds')).toBeVisible();
    await expect(page.getByTestId('know-service-neighborhood')).toBeVisible();
    await expect(page.getByTestId('know-service-articles')).toBeVisible();

    await page.waitForTimeout(250);
    await page.screenshot({
      path: path.join(outDir, '01-know-more-full.png'),
      fullPage: true,
    });
    await page.screenshot({
      path: path.join(outDir, '02-know-more-hero.png'),
      fullPage: false,
    });
    await page.locator('#know-more-services-heading').scrollIntoViewIfNeeded();
    await page.waitForTimeout(150);
    await page.screenshot({
      path: path.join(outDir, '03-know-more-services.png'),
      fullPage: false,
    });
  });

  test('search service enters existing search', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/advice', { waitUntil: 'networkidle' });
    await page.getByTestId('know-service-search').getByRole('link').click();
    await page.waitForURL(/\/properties\/sale/);
  });

  test('valuation service goes to /valuation', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/advice', { waitUntil: 'networkidle' });
    await page.getByTestId('know-service-valuation').getByRole('link').click();
    await page.waitForURL(/\/valuation\/?$/);
  });

  test('add property service goes to /add-property', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/advice', { waitUntil: 'networkidle' });
    await page.getByTestId('know-service-add-property').getByRole('link').click();
    await page.waitForURL(/\/(add-property|auth\/login)/);
  });

  test('compounds service goes to /compounds', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/advice', { waitUntil: 'networkidle' });
    await page.getByTestId('know-service-compounds').getByRole('link').click();
    await page.waitForURL(/\/compounds\/?$/);
  });

  test('neighborhood service goes to /neighborhood', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/advice', { waitUntil: 'networkidle' });
    await page.getByTestId('know-service-neighborhood').getByRole('link').click();
    await page.waitForURL(/\/neighborhood\/?$/);
  });

  test('advice tips service goes to /advice/index', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/advice', { waitUntil: 'networkidle' });
    await page.getByTestId('know-service-articles').getByRole('link').click();
    await page.waitForURL(/\/advice\/index\/?$/);
    await expect(page.getByRole('heading', { name: 'نصائح عقارية' })).toBeVisible();
    await expect(
      page.getByRole('heading', { name: 'كيف تختار المنطقة المناسبة قبل شراء شقتك' }),
    ).toBeVisible();

    await page.waitForTimeout(250);
    await page.screenshot({
      path: path.join(outDir, '04-advice-index-full.png'),
      fullPage: true,
    });
    await page.screenshot({
      path: path.join(outDir, '05-advice-index-featured.png'),
      fullPage: false,
    });
    await page.getByRole('heading', { name: 'نصائح عقارية' }).scrollIntoViewIfNeeded();
    await page.locator('article').nth(3).scrollIntoViewIfNeeded();
    await page.waitForTimeout(150);
    await page.screenshot({
      path: path.join(outDir, '06-advice-index-feed.png'),
      fullPage: false,
    });
    await page.getByRole('heading', { name: 'التصنيفات' }).scrollIntoViewIfNeeded();
    await page.waitForTimeout(150);
    await page.screenshot({
      path: path.join(outDir, '07-advice-index-sidebar.png'),
      fullPage: false,
    });
  });

  test('article listing category filter and pagination', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/advice/index', { waitUntil: 'networkidle' });
    await page.getByRole('link', { name: 'التمويل العقاري', exact: true }).click();
    await page.waitForURL(/category=finance/);
    await expect(
      page.getByRole('heading', { name: 'دليل مبسط للتمويل العقاري في مصر' }),
    ).toBeVisible();
    await page.waitForTimeout(200);
    await page.screenshot({
      path: path.join(outDir, '08-advice-index-category.png'),
      fullPage: true,
    });

    await page.goto('/advice/index?page=2', { waitUntil: 'networkidle' });
    await expect(page.getByRole('navigation', { name: 'ترقيم الصفحات' })).toBeVisible();
    await expect(page.getByRole('link', { name: '2', exact: true })).toHaveAttribute(
      'aria-current',
      'page',
    );
    await page.waitForTimeout(200);
    await page.screenshot({
      path: path.join(outDir, '09-advice-index-page-2.png'),
      fullPage: true,
    });
  });

  test('article card opens article detail', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/advice/index', { waitUntil: 'networkidle' });
    await page
      .getByRole('link', { name: 'كيف تختار المنطقة المناسبة قبل شراء شقتك' })
      .first()
      .click();
    await page.waitForURL(/\/advice\/index\/choose-neighborhood-before-buying/);
    await expect(
      page.getByRole('heading', { name: 'كيف تختار المنطقة المناسبة قبل شراء شقتك' }),
    ).toBeVisible();
    await expect(page.getByRole('heading', { name: 'ابدأ بأسلوب حياتك لا بصورة الإعلان' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'مقالات ذات صلة' })).toBeVisible();

    await page.waitForTimeout(250);
    await page.screenshot({
      path: path.join(outDir, '10-article-detail-full.png'),
      fullPage: true,
    });
    await page.screenshot({
      path: path.join(outDir, '11-article-detail-top.png'),
      fullPage: false,
    });
    await page.getByRole('heading', { name: 'مقالات ذات صلة' }).scrollIntoViewIfNeeded();
    await page.waitForTimeout(150);
    await page.screenshot({
      path: path.join(outDir, '12-related-articles.png'),
      fullPage: false,
    });
  });

  test('unknown article slug returns not found', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    const response = await page.goto('/advice/index/not-a-real-article', {
      waitUntil: 'networkidle',
    });
    expect(response?.status()).toBe(404);
  });

  test('/advice/ask still works', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/advice/ask', { waitUntil: 'networkidle' });
    await expect(page.getByRole('heading', { name: 'اسأل أهل منطقة' }).first()).toBeVisible();
    await expect(
      page.getByRole('heading', { name: 'الأسئلة الأكثر نقاشاً' }),
    ).toBeVisible();
  });

  test('homepage and mega menu know destinations', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.getByRole('button', { name: /أعرف/ }).hover();
    const megaMenu = page.locator('[data-mega-menu-panel="true"]');
    await expect(megaMenu.getByRole('link', { name: /أعرف أكثر/ })).toBeVisible();
    await expect(megaMenu.getByRole('link', { name: /نصائح عقارية/ })).toBeVisible();
    await page.waitForTimeout(200);
    await megaMenu.screenshot({
      path: path.join(outDir, '13-know-mega-menu.png'),
    });

    await megaMenu.getByRole('link', { name: /أعرف أكثر/ }).click();
    await page.waitForURL(/\/advice\/?$/);

    await page.goto('/', { waitUntil: 'networkidle' });
    const guides = page.getByRole('heading', { name: 'أدلة الشراء والإيجار', exact: true });
    await guides.scrollIntoViewIfNeeded();
    await page.waitForTimeout(200);
    await page.locator('section').filter({ has: guides }).screenshot({
      path: path.join(outDir, '14-home-know-links.png'),
    });
    await guides.locator('xpath=ancestor::article[1]').getByRole('link').click();
    await page.waitForURL(/\/advice\/index\/?$/);
  });

  test('active navigation does not link to unfinished advice routes', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/', { waitUntil: 'networkidle' });
    const homeHrefs = await collectHrefs(page);
    await page.getByRole('button', { name: /أعرف/ }).hover();
    await page.waitForTimeout(200);
    const menuHrefs = await collectHrefs(page);
    await page.goto('/advice', { waitUntil: 'networkidle' });
    const adviceHrefs = await collectHrefs(page);
    await page.goto('/advice/index', { waitUntil: 'networkidle' });
    const indexHrefs = await collectHrefs(page);

    for (const href of [...homeHrefs, ...menuHrefs, ...adviceHrefs, ...indexHrefs]) {
      const normalized = href.split('?')[0].replace(/\/$/, '') || '/';
      expect(
        blockedAdviceHrefs.includes(normalized),
        `Unexpected unfinished advice href: ${href}`,
      ).toBeFalsy();
    }
  });

  test('mobile screenshots', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/advice', { waitUntil: 'networkidle' });
    await page.waitForTimeout(250);
    await page.screenshot({
      path: path.join(outDir, '15-know-more-mobile.png'),
      fullPage: true,
    });
    await page.goto('/advice/index', { waitUntil: 'networkidle' });
    await page.waitForTimeout(250);
    await page.screenshot({
      path: path.join(outDir, '16-advice-index-mobile.png'),
      fullPage: true,
    });
    await page.goto('/advice/index/choose-neighborhood-before-buying', {
      waitUntil: 'networkidle',
    });
    await page.waitForTimeout(250);
    await page.screenshot({
      path: path.join(outDir, '17-article-mobile.png'),
      fullPage: true,
    });
  });
});
