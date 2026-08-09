import { expect, test } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import path from 'node:path';

const outDir = path.join('docs', 'visual-qa', 'homepage-1920');

test.describe('Homepage visual QA @ 1920x1080', () => {
  test.beforeAll(() => {
    mkdirSync(outDir, { recursive: true });
  });

  test('capture key homepage sections', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);

    await page.screenshot({
      path: path.join(outDir, '01-header-hero.png'),
      clip: { x: 0, y: 0, width: 1920, height: 900 },
    });

    const compounds = page.getByRole('heading', { name: 'أحدث الكمبوندات' });
    await compounds.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await page.locator('section').filter({ has: compounds }).screenshot({
      path: path.join(outDir, '02-latest-compounds.png'),
    });

    const know = page.getByRole('heading', { name: 'أعرف' });
    await know.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await page.locator('section').filter({ has: know }).screenshot({
      path: path.join(outDir, '03-know.png'),
    });

    const areas = page.getByRole('heading', { name: 'أهم المناطق' });
    await areas.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await page.locator('section').filter({ has: areas }).screenshot({
      path: path.join(outDir, '04-important-areas.png'),
    });

    const app = page.getByRole('heading', {
      name: 'حمّل تطبيق عقارات مصر الآن',
    });
    await app.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await page.locator('section').filter({ has: app }).screenshot({
      path: path.join(outDir, '05-app-promo.png'),
    });

    await page.locator('footer').screenshot({
      path: path.join(outDir, '06-footer.png'),
    });

    await expect(page.getByRole('heading', { name: 'أحدث الكمبوندات' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'أعرف' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'أهم المناطق' })).toBeVisible();
  });
});
