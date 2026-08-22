import { expect, test } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import path from 'node:path';

const outDir = path.join('docs', 'visual-qa', 'home-mobile');

test.describe('Homepage mobile hero visual QA', () => {
  test.beforeAll(() => {
    mkdirSync(outDir, { recursive: true });
  });

  test('capture 360 390 430 hero', async ({ page }) => {
    const shots: Array<{ name: string; width: number; height: number }> = [
      { name: '01-hero-360.png', width: 360, height: 800 },
      { name: '02-hero-390.png', width: 390, height: 844 },
      { name: '03-hero-430.png', width: 430, height: 932 },
    ];

    for (const shot of shots) {
      await page.setViewportSize({ width: shot.width, height: shot.height });
      await page.goto('/', { waitUntil: 'networkidle' });
      await page.waitForTimeout(400);

      const noOverflow = await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth + 1,
      );
      expect(noOverflow).toBeTruthy();

      await expect(
        page.getByRole('heading', { name: 'ابدأ البحث عن بيت أحلامك' }),
      ).toBeVisible();
      await expect(page.getByText('+٨٬٠٠٠ إعلان متاح الآن')).toBeVisible();
      await expect(page.getByRole('tab', { name: 'للبيع' })).toBeVisible();
      await expect(page.getByRole('tab', { name: 'للإيجار' })).toBeVisible();
      await expect(page.getByRole('tab', { name: 'كمبوندات' })).toBeVisible();

      await page.screenshot({
        path: path.join(outDir, shot.name),
        clip: { x: 0, y: 0, width: shot.width, height: Math.min(720, shot.height) },
      });
    }
  });
});
