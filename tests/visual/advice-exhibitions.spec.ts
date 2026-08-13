import { expect, test, type Page } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import path from 'node:path';

const outDir = path.join('docs', 'visual-qa', 'advice-exhibitions-1920');
const blockedAdviceHrefs = ['/advice/research'];
const featuredSlug = 'mustaqbal-al-istithmar';
const featuredTitle = 'مؤتمر مستقبل الاستثمار العقاري';
const eventMonth = '/advice/exhibitions?month=2026-06';
const eventDate = '2026-06-24';
const emptyDate = '2026-08-10';

async function collectHrefs(page: Page): Promise<string[]> {
  return page.locator('a[href]').evaluateAll((nodes) =>
    nodes
      .map((node) => (node as HTMLAnchorElement).getAttribute('href') ?? '')
      .filter(Boolean),
  );
}

async function bodyOverflowsX(page: Page): Promise<boolean> {
  return page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
  );
}

test.describe('Advice Exhibitions Directory', () => {
  test.beforeAll(() => {
    mkdirSync(outDir, { recursive: true });
  });

  test.describe.configure({ timeout: 90_000 });

  test('directory calendar appears for the current month', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/advice/exhibitions', { waitUntil: 'networkidle' });

    await expect(
      page.getByRole('heading', { name: 'دليل المعارض العقارية' }),
    ).toBeVisible();
    await expect(page.getByTestId('exhibitions-calendar')).toBeVisible();
    await expect(page.getByTestId('calendar-month-grid')).toBeVisible();
    await expect(page.getByText('السبت', { exact: true }).first()).toBeVisible();
    await expect(page.getByRole('button', { name: 'بحث' })).toBeVisible();

    await page.waitForTimeout(250);
    await page.screenshot({
      path: path.join(outDir, '01-directory-current-month.png'),
      fullPage: false,
    });
    await page.screenshot({
      path: path.join(outDir, '13-full-directory.png'),
      fullPage: true,
    });
  });

  test('event month shows orange chip and popover flow', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto(eventMonth, { waitUntil: 'networkidle' });

    await expect(page.getByTestId('calendar-month-label')).toBeVisible();
    const chip = page.getByTestId(`calendar-event-chip-${featuredSlug}`);
    await expect(chip).toBeVisible();
    await expect(chip).toHaveText(featuredTitle);

    await page.waitForTimeout(200);
    await page.screenshot({
      path: path.join(outDir, '02-directory-event-month.png'),
      fullPage: true,
    });
    await chip.scrollIntoViewIfNeeded();
    await page.waitForTimeout(150);
    await page.screenshot({
      path: path.join(outDir, '03-calendar-event-chip.png'),
      fullPage: false,
    });

    await chip.click();
    const popover = page.getByTestId('exhibition-preview-popover');
    await expect(popover).toBeVisible();
    await expect(popover.getByText(featuredTitle)).toBeVisible();
    await expect(popover.getByRole('link', { name: 'التفاصيل' })).toBeVisible();
    await page.waitForTimeout(200);
    await page.screenshot({
      path: path.join(outDir, '04-event-popover.png'),
      fullPage: false,
    });

    await page.keyboard.press('Escape');
    await expect(popover).toHaveCount(0);

    await chip.click();
    await popover.getByRole('link', { name: 'التفاصيل' }).click();
    await page.waitForURL(new RegExp(`/advice/exhibitions/${featuredSlug}`));
  });

  test('previous next and today change the month via the URL', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto(eventMonth, { waitUntil: 'networkidle' });
    await expect(page).toHaveURL(/month=2026-06/);

    await page.getByRole('link', { name: 'الشهر التالي' }).click();
    await page.waitForURL(/month=2026-07/);
    await expect(page.getByTestId(`calendar-event-chip-${featuredSlug}`)).toHaveCount(0);
    await page.waitForTimeout(200);
    await page.screenshot({
      path: path.join(outDir, '07-next-month.png'),
      fullPage: false,
    });

    await page.getByRole('link', { name: 'الشهر السابق' }).click();
    await page.waitForURL(/month=2026-06/);
    await expect(page.getByTestId(`calendar-event-chip-${featuredSlug}`)).toBeVisible();
    await page.waitForTimeout(200);
    await page.screenshot({
      path: path.join(outDir, '08-prev-month.png'),
      fullPage: false,
    });

    await page.getByRole('link', { name: 'اليوم', exact: true }).click();
    await page.waitForURL(/\/advice\/exhibitions\/?$/);
    await expect(page.getByTestId('exhibitions-calendar')).toBeVisible();
  });

  test('date search finds an event and reports an empty date', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/advice/exhibitions', { waitUntil: 'networkidle' });

    await page.locator('input[name="date"]').fill(eventDate);
    await page.getByRole('button', { name: 'بحث' }).click();
    await page.waitForURL(new RegExp(`date=${eventDate}`));
    await expect(page.getByTestId(`calendar-event-chip-${featuredSlug}`)).toBeVisible();
    await expect(page.getByTestId('queried-date-cell')).toBeVisible();
    await page.waitForTimeout(200);
    await page.screenshot({
      path: path.join(outDir, '05-date-search-event.png'),
      fullPage: true,
    });

    await page.locator('input[name="date"]').fill(emptyDate);
    await page.getByRole('button', { name: 'بحث' }).click();
    await page.waitForURL(new RegExp(`date=${emptyDate}`));
    await expect(page.getByTestId('date-search-empty')).toHaveText(
      'لا توجد أحداث في هذا التاريخ',
    );
    await page.waitForTimeout(200);
    await page.screenshot({
      path: path.join(outDir, '06-date-search-empty.png'),
      fullPage: true,
    });
  });

  test('empty month still renders the calendar', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/advice/exhibitions?month=2026-03', { waitUntil: 'networkidle' });
    await expect(page.getByTestId('exhibitions-calendar')).toBeVisible();
    await expect(page.getByTestId('month-empty-state')).toHaveText(
      'لا توجد معارض أو فعاليات خلال هذا الشهر',
    );
  });

  test('details page renders title date content poster and related', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto(`/advice/exhibitions/${featuredSlug}`, { waitUntil: 'networkidle' });

    await expect(page.getByRole('heading', { name: featuredTitle, level: 1 })).toBeVisible();
    await expect(page.getByTestId('exhibition-info-block')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'عن المعرض' })).toBeVisible();
    await expect(page.getByTestId('exhibition-poster')).toBeVisible();
    await expect(
      page.getByRole('heading', { name: 'معارض وفعاليات قد تهمك' }),
    ).toBeVisible();

    await page.waitForTimeout(250);
    await page.screenshot({
      path: path.join(outDir, '09-details-top.png'),
      fullPage: false,
    });
    await page.getByRole('heading', { name: 'عن المعرض' }).scrollIntoViewIfNeeded();
    await page.waitForTimeout(150);
    await page.screenshot({
      path: path.join(outDir, '10-details-content.png'),
      fullPage: false,
    });
    await page.getByTestId('exhibition-poster').scrollIntoViewIfNeeded();
    await page.waitForTimeout(150);
    await page.screenshot({
      path: path.join(outDir, '11-details-poster.png'),
      fullPage: false,
    });
    await page.getByRole('heading', { name: 'معارض وفعاليات قد تهمك' }).scrollIntoViewIfNeeded();
    await page.waitForTimeout(150);
    await page.screenshot({
      path: path.join(outDir, '12-details-related.png'),
      fullPage: false,
    });
    await page.screenshot({
      path: path.join(outDir, '14-full-details.png'),
      fullPage: true,
    });

    const related = page.locator('#related-exhibitions-heading').locator('xpath=ancestor::section[1]');
    const relatedLink = related.getByRole('link').first();
    await relatedLink.click();
    await page.waitForURL(/\/advice\/exhibitions\/(?!mustaqbal-al-istithmar).+/);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page).not.toHaveURL(new RegExp(`/advice/exhibitions/${featuredSlug}/?$`));
  });

  test('unknown slug returns 404', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    const response = await page.goto('/advice/exhibitions/not-a-real-event', {
      waitUntil: 'networkidle',
    });
    expect(response?.status()).toBe(404);
  });

  test('know mega-menu exhibitions link works', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.getByRole('button', { name: /أعرف/ }).hover();
    const megaMenu = page.locator('[data-mega-menu-panel="true"]');
    await expect(megaMenu.getByRole('link', { name: /دليل المعارض/ })).toBeVisible();
    await megaMenu.getByRole('link', { name: /دليل المعارض/ }).click();
    await page.waitForURL(/\/advice\/exhibitions\/?$/);
  });

  test('no active links to unfinished advice routes', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/', { waitUntil: 'networkidle' });
    const homeHrefs = await collectHrefs(page);
    await page.getByRole('button', { name: /أعرف/ }).hover();
    await page.waitForTimeout(200);
    const menuHrefs = await collectHrefs(page);
    await page.goto('/advice/exhibitions', { waitUntil: 'networkidle' });
    const directoryHrefs = await collectHrefs(page);
    await page.goto(`/advice/exhibitions/${featuredSlug}`, { waitUntil: 'networkidle' });
    const detailsHrefs = await collectHrefs(page);

    for (const href of [...homeHrefs, ...menuHrefs, ...directoryHrefs, ...detailsHrefs]) {
      const normalized = href.split('?')[0].replace(/\/$/, '') || '/';
      expect(
        blockedAdviceHrefs.includes(normalized),
        `Unexpected unfinished advice href: ${href}`,
      ).toBeFalsy();
    }
  });

  test('mobile calendar popover details and no body overflow', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(eventMonth, { waitUntil: 'networkidle' });
    await page.waitForTimeout(250);
    await page.screenshot({
      path: path.join(outDir, '15-directory-mobile.png'),
      fullPage: true,
    });
    expect(await bodyOverflowsX(page)).toBeFalsy();

    await page.getByTestId(`calendar-event-chip-${featuredSlug}`).click();
    await expect(page.getByTestId('exhibition-preview-popover')).toBeVisible();
    await page.waitForTimeout(200);
    await page.screenshot({
      path: path.join(outDir, '16-popover-mobile.png'),
      fullPage: false,
    });
    expect(await bodyOverflowsX(page)).toBeFalsy();

    await page.goto(`/advice/exhibitions/${featuredSlug}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(250);
    await page.screenshot({
      path: path.join(outDir, '17-details-mobile.png'),
      fullPage: true,
    });
    expect(await bodyOverflowsX(page)).toBeFalsy();
  });
});
