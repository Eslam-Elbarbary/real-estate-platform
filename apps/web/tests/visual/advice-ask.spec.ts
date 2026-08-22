import { expect, test, type Page } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import path from 'node:path';

const outDir = path.join('docs', 'visual-qa', 'advice-ask-1920');
const blockedAdviceHrefs: string[] = [];

async function loginDemo(page: Page, returnTo: string) {
  await page.context().clearCookies();
  await page.goto(`/auth/login?returnTo=${encodeURIComponent(returnTo)}`, {
    waitUntil: 'networkidle',
  });
  await page.locator('[data-testid="login-next"]').waitFor({ state: 'visible' });
  await page.waitForTimeout(400);
  await page.locator('#login-identifier').fill('demo@example.test');
  await page.locator('[data-testid="login-next"]').click();
  await page.locator('#login-password').waitFor({ state: 'visible', timeout: 15000 });
  await page.locator('#login-password').fill('demo-password');
  await page.locator('[data-testid="login-submit"]').click();
  await page.waitForURL((url) => !url.pathname.startsWith('/auth/'), {
    timeout: 20000,
  });
}

async function collectHrefs(page: Page): Promise<string[]> {
  return page.locator('a[href]').evaluateAll((nodes) =>
    nodes
      .map((node) => (node as HTMLAnchorElement).getAttribute('href') ?? '')
      .filter(Boolean),
  );
}

test.describe('Advice Ask Area', () => {
  test.beforeAll(() => {
    mkdirSync(outDir, { recursive: true });
  });

  test.describe.configure({ timeout: 90_000 });

  test('directory renders popular questions, filters, pagination', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/advice/ask', { waitUntil: 'networkidle' });

    await expect(page.getByRole('heading', { name: 'اسأل أهل منطقة' }).first()).toBeVisible();
    await expect(
      page.getByRole('heading', { name: 'الأسئلة الأكثر نقاشاً' }),
    ).toBeVisible();
    await expect(page.getByRole('link', { name: 'الأكثر نقاشاً' })).toBeVisible();
    await expect(page.locator('#advice-filter-location')).toBeVisible();
    await expect(page.locator('#advice-filter-category')).toBeVisible();
    await expect(page.locator('#ask-location')).toBeVisible();
    await expect(page.locator('#ask-category')).toBeVisible();
    await expect(page.getByRole('navigation', { name: 'ترقيم الصفحات' })).toBeVisible();
    await expect(
      page.getByRole('link', { name: /هل التجمع الخامس مناسب للسكن العائلي/ }),
    ).toBeVisible();

    await page.waitForTimeout(300);
    await page.screenshot({
      path: path.join(outDir, '01-directory-full.png'),
      fullPage: true,
    });
    await page.screenshot({
      path: path.join(outDir, '02-directory-top.png'),
      fullPage: false,
    });
    await page.screenshot({
      path: path.join(outDir, '03-filters-popular.png'),
      fullPage: false,
    });
    await page.locator('#ask-form').screenshot({
      path: path.join(outDir, '06-ask-form.png'),
    });
  });

  test('filters update URL and result sets', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/advice/ask', { waitUntil: 'networkidle' });

    await page.getByRole('link', { name: 'بدون إجابة' }).click();
    await page.waitForURL(/view=unanswered/);
    await expect(page.getByRole('link', { name: 'بدون إجابة' })).toHaveAttribute(
      'aria-current',
      'page',
    );
    await expect(
      page.getByRole('link', { name: /هل التجمع الخامس مناسب للسكن العائلي/ }),
    ).toHaveCount(0);
    await expect(
      page.getByRole('link', { name: /هل وحدة ساحلية للاستخدام العائلي/ }),
    ).toBeVisible();
    await page.waitForTimeout(200);
    await page.screenshot({
      path: path.join(outDir, '04-unanswered.png'),
      fullPage: true,
    });

    await page.getByRole('link', { name: 'جميع الأسئلة' }).click();
    await page.waitForURL(/view=all/);
    await expect(page.getByRole('navigation', { name: 'ترقيم الصفحات' })).toBeVisible();
    await page.waitForTimeout(200);
    await page.screenshot({
      path: path.join(outDir, '05-all-questions.png'),
      fullPage: true,
    });
  });

  test('question details show answers and answer form', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/advice/ask', { waitUntil: 'networkidle' });
    await page
      .getByRole('link', { name: /هل التجمع الخامس مناسب للسكن العائلي/ })
      .first()
      .click();
    await page.waitForURL(/\/advice\/ask\/q-01\//);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.getByRole('heading', { level: 1 })).toContainText('التجمع الخامس');
    await expect(page.getByText(/السكن العائلي مريح/)).toBeVisible();
    await expect(page.locator('#answer-form')).toBeVisible();
    await expect(page.getByRole('button', { name: 'أضف إجابتك' })).toBeVisible();

    await page.waitForTimeout(250);
    await page.screenshot({
      path: path.join(outDir, '07-question-detail-full.png'),
      fullPage: true,
    });
    await page.screenshot({
      path: path.join(outDir, '08-question-header.png'),
      fullPage: false,
    });
    await page.getByRole('heading', { name: /إجابة/ }).first().scrollIntoViewIfNeeded();
    await page.waitForTimeout(150);
    await page.screenshot({
      path: path.join(outDir, '09-answers.png'),
      fullPage: false,
    });
    await page.locator('#answer-form').scrollIntoViewIfNeeded();
    await page.locator('#answer-form').screenshot({
      path: path.join(outDir, '10-answer-form.png'),
    });
  });

  test('logged-out ask question redirects to login with returnTo', async ({ page }) => {
    await page.context().clearCookies();
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/advice/ask', { waitUntil: 'networkidle' });
    await page.locator('#ask-location').selectOption({ label: 'القاهرة الجديدة - التجمع الخامس' });
    await page.locator('#ask-category').selectOption({ label: 'السكن والمعيشة' });
    await page.locator('#ask-question').fill('هل المنطقة مناسبة للسكن العائلي على المدى الطويل؟');
    await page.getByRole('button', { name: 'أضف سؤالاً' }).click();
    await page.waitForURL(/\/auth\/login/);
    expect(page.url()).toContain('returnTo=');
    expect(decodeURIComponent(page.url())).toContain('/advice/ask');
    expect(decodeURIComponent(page.url())).toContain('#ask-form');
  });

  test('authenticated user can create a question', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await loginDemo(page, '/advice/ask#ask-form');
    await page.goto('/advice/ask', { waitUntil: 'networkidle' });
    await page.locator('#ask-location').selectOption({ label: 'الشيخ زايد' });
    await page.locator('#ask-category').selectOption({ label: 'شراء العقارات' });
    await page
      .locator('#ask-question')
      .fill('ما أهم عوامل اختيار شقة للسكن الدائم في الشيخ زايد؟');
    await page.getByRole('button', { name: 'أضف سؤالاً' }).click();
    await page.waitForURL(/\/advice\/ask\/.+\/.+\?created=1/);
    await expect(page.getByText('تم إضافة سؤالك بنجاح')).toBeVisible();
    await expect(
      page.getByRole('heading', {
        name: 'ما أهم عوامل اختيار شقة للسكن الدائم في الشيخ زايد؟',
      }),
    ).toBeVisible();
    await page.waitForTimeout(200);
    await page.screenshot({
      path: path.join(outDir, '11-user-question-created.png'),
      fullPage: true,
    });
  });

  test('authenticated user can add an answer', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await loginDemo(page, '/advice/ask/q-03/ايجار-شقة-في-المعادي');
    await page.goto('/advice/ask/q-03/ايجار-شقة-في-المعادي', {
      waitUntil: 'networkidle',
    });
    await page.locator('#advice-answer').fill('ابدأ بالمعاينة المسائية وقارن تكلفة الصيانة مع الإيجار.');
    await page.getByRole('button', { name: 'أضف إجابتك' }).click();
    await page.waitForURL(/answered=1/);
    await expect(page.getByText('تمت إضافة إجابتك')).toBeVisible();
    await expect(
      page.getByText('ابدأ بالمعاينة المسائية وقارن تكلفة الصيانة مع الإيجار.'),
    ).toBeVisible();
    await page.waitForTimeout(200);
    await page.screenshot({
      path: path.join(outDir, '12-user-answer-added.png'),
      fullPage: true,
    });
  });

  test('related property teaser opens listing details', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/advice/ask/q-01/هل-التجمع-الخامس-مناسب-للسكن-العائلي', {
      waitUntil: 'networkidle',
    });
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    const teaser = page
      .getByRole('heading', { name: 'عقارات قد تكون مهتماً بها' })
      .locator('xpath=ancestor::section[1]')
      .getByRole('link')
      .first();
    await expect(teaser).toBeVisible();
    await teaser.click();
    await page.waitForURL(/\/listing\//);
  });

  test('homepage know card and mega menu go to ask area', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/', { waitUntil: 'networkidle' });
    const heading = page.getByRole('heading', { name: 'خبراء المناطق', exact: true });
    await heading.scrollIntoViewIfNeeded();
    await page.waitForTimeout(200);
    await heading.locator('xpath=ancestor::article[1]').screenshot({
      path: path.join(outDir, '13-home-know-entry.png'),
    });
    await heading.locator('xpath=ancestor::article[1]').getByRole('link').click();
    await page.waitForURL(/\/advice\/ask\/?$/);

    await page.goto('/', { waitUntil: 'networkidle' });
    await page.getByRole('button', { name: /أعرف/ }).hover();
    await expect(page.getByRole('link', { name: /اسأل أهل المنطقة/ })).toBeVisible();
    await page.waitForTimeout(200);
    await page.locator('[data-mega-menu-panel="true"]').screenshot({
      path: path.join(outDir, '14-mega-menu-entry.png'),
    });
    await page.getByRole('link', { name: /اسأل أهل المنطقة/ }).click();
    await page.waitForURL(/\/advice\/ask\/?$/);
  });

  test('active navigation does not link to unfinished advice routes', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/', { waitUntil: 'networkidle' });
    const homeHrefs = await collectHrefs(page);
    await page.getByRole('button', { name: /أعرف/ }).hover();
    await page.waitForTimeout(200);
    const menuHrefs = await collectHrefs(page);
    await page.goto('/advice/ask', { waitUntil: 'networkidle' });
    const askHrefs = await collectHrefs(page);

    for (const href of [...homeHrefs, ...menuHrefs, ...askHrefs]) {
      const normalized = href.split('?')[0].replace(/\/$/, '') || '/';
      expect(
        blockedAdviceHrefs.includes(normalized),
        `Unexpected unfinished advice href: ${href}`,
      ).toBeFalsy();
    }
  });

  test('unknown question returns not found', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    const response = await page.goto('/advice/ask/missing-id/not-a-real-question', {
      waitUntil: 'networkidle',
    });
    expect(response?.status()).toBe(404);
  });

  test('mobile screenshots', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/advice/ask', { waitUntil: 'networkidle' });
    await page.waitForTimeout(250);
    await page.screenshot({
      path: path.join(outDir, '15-directory-mobile.png'),
      fullPage: true,
    });
    await page.locator('#ask-form').screenshot({
      path: path.join(outDir, '17-ask-form-mobile.png'),
    });
    await page.goto('/advice/ask/q-01/هل-التجمع-الخامس-مناسب-للسكن-العائلي', {
      waitUntil: 'networkidle',
    });
    await page.waitForTimeout(250);
    await page.screenshot({
      path: path.join(outDir, '16-question-mobile.png'),
      fullPage: true,
    });
  });
});
