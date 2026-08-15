import { expect, test, type Page } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import path from 'node:path';

const outDir = path.join('docs', 'visual-qa', 'advice-agents-1920');
const blockedAdviceHrefs: string[] = [];

async function collectHrefs(page: Page): Promise<string[]> {
  return page.locator('a[href]').evaluateAll((nodes) =>
    nodes
      .map((node) => (node as HTMLAnchorElement).getAttribute('href') ?? '')
      .filter(Boolean),
  );
}

test.describe('Advice Agents Directory', () => {
  test.beforeAll(() => {
    mkdirSync(outDir, { recursive: true });
  });

  test.describe.configure({ timeout: 90_000 });

  test('/advice/agents loads with default company results', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/advice/agents', { waitUntil: 'networkidle' });

    await expect(
      page.getByRole('heading', { name: 'اعثر على أفضل الوسطاء العقاريين' }),
    ).toBeVisible();
    await expect(page.getByRole('heading', { name: /أفضل الشركات العقارية/ })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Prime Gate Realty' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'إظهار رقم الهاتف' }).first()).toBeVisible();

    await page.waitForTimeout(250);
    await page.screenshot({
      path: path.join(outDir, '01-directory-full.png'),
      fullPage: true,
    });
    await page.screenshot({
      path: path.join(outDir, '02-directory-hero.png'),
      fullPage: false,
    });
    await page.screenshot({
      path: path.join(outDir, '03-directory-company-results.png'),
      fullPage: false,
    });
  });

  test('switch company to broker updates results', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/advice/agents', { waitUntil: 'networkidle' });
    await page.getByRole('link', { name: 'وسيط', exact: true }).click();
    await page.waitForURL(/type=broker/);
    await expect(page.getByRole('heading', { name: /أفضل الوسطاء العقاريين في/ })).toBeVisible();
    await expect(page.getByRole('link', { name: 'هدى منصور' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Prime Gate Realty' })).toHaveCount(0);
    await page.waitForTimeout(200);
    await page.screenshot({
      path: path.join(outDir, '04-directory-broker-results.png'),
      fullPage: true,
    });
  });

  test('location filter narrows results', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/advice/agents', { waitUntil: 'networkidle' });
    await page.locator('#agent-location').selectOption('loc-alexandria');
    await page.getByRole('button', { name: 'ابحث', exact: true }).click();
    await page.waitForURL(/location=loc-alexandria/);
    await expect(page.getByRole('link', { name: 'Harbor Line Realty' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Prime Gate Realty' })).toHaveCount(0);
    await page.waitForTimeout(200);
    await page.screenshot({
      path: path.join(outDir, '05-directory-location-filter.png'),
      fullPage: true,
    });
  });

  test('reveal phone then call/whatsapp use demo numbers', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/advice/agents', { waitUntil: 'networkidle' });
    const row = page.getByTestId('agent-row-prime-gate-realty');
    await row.scrollIntoViewIfNeeded();
    await page.waitForTimeout(150);
    await row.screenshot({ path: path.join(outDir, '06-phone-closed.png') });
    await row.getByRole('button', { name: 'إظهار رقم الهاتف' }).click();
    await expect(row.getByText('+201000001101')).toBeVisible();
    await expect(row.getByRole('link', { name: 'اتصال' })).toHaveAttribute(
      'href',
      'tel:+201000001101',
    );
    await expect(row.getByRole('link', { name: 'واتساب' })).toHaveAttribute(
      'href',
      /wa\.me\/201000001101/,
    );
    await page.waitForTimeout(150);
    await row.screenshot({ path: path.join(outDir, '07-phone-revealed.png') });
  });

  test('agent profile uses property repository and listing details', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/advice/agents', { waitUntil: 'networkidle' });
    await page.getByRole('link', { name: 'Prime Gate Realty' }).click();
    await page.waitForURL(/\/advice\/agents\/prime-gate-realty/);
    await expect(
      page.getByRole('heading', { name: 'عقارات Prime Gate Realty', level: 1 }),
    ).toBeVisible();
    await expect(page.locator('article').first()).toBeVisible();
    await page.waitForTimeout(250);
    await page.screenshot({
      path: path.join(outDir, '08-agent-profile-full.png'),
      fullPage: true,
    });
    await page.screenshot({
      path: path.join(outDir, '09-agent-profile-header.png'),
      fullPage: false,
    });
    await page.getByRole('heading', { name: 'عقارات Prime Gate Realty', level: 1 }).scrollIntoViewIfNeeded();
    await page.waitForTimeout(150);
    await page.screenshot({
      path: path.join(outDir, '10-agent-properties-grid.png'),
      fullPage: false,
    });

    const firstCard = page.locator('article a[href^="/listing/"]').first();
    await expect(firstCard).toBeVisible();
    await firstCard.click();
    await page.waitForURL(/\/listing\//);
  });

  test('agent profile pagination', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/advice/agents/prime-gate-realty', { waitUntil: 'networkidle' });
    await expect(page.getByRole('navigation', { name: 'ترقيم الصفحات' })).toBeVisible();
    await page.getByRole('link', { name: '2', exact: true }).click();
    await page.waitForURL(/page=2/);
    await expect(page.getByRole('link', { name: '2', exact: true })).toHaveAttribute(
      'aria-current',
      'page',
    );
    await page.waitForTimeout(200);
    await page.screenshot({
      path: path.join(outDir, '11-agent-profile-page-2.png'),
      fullPage: true,
    });
  });

  test('zero-property profile empty state', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/advice/agents/adam-fouad', { waitUntil: 'networkidle' });
    await expect(
      page.getByText('لا توجد عقارات منشورة لهذا الوسيط حالياً'),
    ).toBeVisible();
    await page.waitForTimeout(200);
    await page.screenshot({
      path: path.join(outDir, '12-agent-empty-properties.png'),
      fullPage: true,
    });
  });

  test('unknown agent returns 404', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    const response = await page.goto('/advice/agents/not-a-real-agent', {
      waitUntil: 'networkidle',
    });
    expect(response?.status()).toBe(404);
  });

  test('know mega-menu agents link works', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.getByRole('button', { name: /أعرف/ }).hover();
    const megaMenu = page.locator('[data-mega-menu-panel="true"]');
    await expect(megaMenu.getByRole('link', { name: /الوسطاء المميزون/ })).toBeVisible();
    await page.waitForTimeout(200);
    await megaMenu.screenshot({ path: path.join(outDir, '13-know-mega-menu.png') });
    await megaMenu.getByRole('link', { name: /الوسطاء المميزون/ }).click();
    await page.waitForURL(/\/advice\/agents\/?$/);
  });

  test('/advice/ask and /advice/index still work', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/advice/ask', { waitUntil: 'networkidle' });
    await expect(page.getByRole('heading', { name: 'اسأل أهل منطقة' }).first()).toBeVisible();
    await page.goto('/advice/index', { waitUntil: 'networkidle' });
    await expect(page.getByRole('heading', { name: 'نصائح عقارية' })).toBeVisible();
  });

  test('no active links to unfinished advice routes', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/', { waitUntil: 'networkidle' });
    const homeHrefs = await collectHrefs(page);
    await page.getByRole('button', { name: /أعرف/ }).hover();
    await page.waitForTimeout(200);
    const menuHrefs = await collectHrefs(page);
    await page.goto('/advice/agents', { waitUntil: 'networkidle' });
    const agentsHrefs = await collectHrefs(page);

    for (const href of [...homeHrefs, ...menuHrefs, ...agentsHrefs]) {
      const normalized = href.split('?')[0].replace(/\/$/, '') || '/';
      expect(
        blockedAdviceHrefs.includes(normalized),
        `Unexpected unfinished advice href: ${href}`,
      ).toBeFalsy();
    }
  });

  test('mobile screenshots', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/advice/agents', { waitUntil: 'networkidle' });
    await page.waitForTimeout(250);
    await page.screenshot({
      path: path.join(outDir, '14-directory-mobile.png'),
      fullPage: true,
    });
    await page.getByTestId('agent-row-prime-gate-realty').screenshot({
      path: path.join(outDir, '15-agent-row-mobile.png'),
    });
    await page.goto('/advice/agents/prime-gate-realty', { waitUntil: 'networkidle' });
    await page.waitForTimeout(250);
    await page.screenshot({
      path: path.join(outDir, '16-agent-profile-mobile.png'),
      fullPage: true,
    });
  });
});
