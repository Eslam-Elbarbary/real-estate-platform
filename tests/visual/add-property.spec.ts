import { expect, test, type Page } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import path from 'node:path';

const outDir = path.join('docs', 'visual-qa', 'add-property-1920');

async function loginDemo(page: Page, returnTo: string) {
  await page.context().clearCookies();
  await page.goto(`/auth/login?returnTo=${encodeURIComponent(returnTo)}`, {
    waitUntil: 'networkidle',
  });
  await page.locator('[data-testid="login-next"]').waitFor({ state: 'visible' });
  await page.waitForTimeout(200);
  await page.locator('#login-identifier').fill('demo@example.test');
  await page.locator('[data-testid="login-next"]').click();
  await page.locator('#login-password').waitFor({ state: 'visible', timeout: 15000 });
  await page.locator('#login-password').fill('demo-password');
  await page.locator('[data-testid="login-submit"]').click();
  await page.waitForURL((url) => url.pathname.startsWith(returnTo.split('?')[0]), {
    timeout: 20000,
  });
}

async function fillBasic(page: Page) {
  await expect(page.getByRole('heading', { name: 'المعلومات الأساسية' })).toBeVisible();
  await page.getByRole('radio', { name: 'للبيع' }).click();
  await page.getByTestId('property-type-combobox').click();
  await page.getByRole('option', { name: 'شقة' }).click();
  await page.getByPlaceholder('ابحث عن المدينة أو الحي أو المنطقة').fill('القاهرة الجديدة');
  await page.getByRole('button', { name: /القاهرة الجديدة/ }).first().click();
  await page.getByRole('button', { name: 'متابعة' }).click();
  await page.waitForURL(/\/details/);
}

async function fillDetails(page: Page) {
  await expect(page.getByRole('heading', { name: /تفاصيل العقار/ })).toBeVisible();
  await page.getByLabel(/المساحة/).fill('150');
  await page.getByLabel(/عدد الغرف/).fill('3');
  await page.getByLabel(/عدد الحمامات/).fill('2');
  await page.getByRole('button', { name: 'لوكس', exact: true }).click();
  await page.getByRole('button', { name: 'متابعة' }).click();
  await page.waitForURL(/\/price/);
}

async function fillOwnerCash(page: Page) {
  await page.getByRole('button', { name: /من المالك \(نقداً\)/ }).click();
  await page.getByLabel(/^السعر$|سعر العقار/).fill('2500000');
  await page.getByRole('button', { name: 'متابعة' }).click();
  await page.waitForURL(/\/description/);
}

async function fillDescription(page: Page) {
  await page.getByLabel(/اسم الإعلان/).fill('شقة للبيع في القاهرة الجديدة');
  await page.getByLabel(/وصف العقار/).fill(
    'شقة مساحة 150 متر، 3 غرف و2 حمام، تشطيب لوكس في موقع مميز.',
  );
  await page.getByLabel(/عنوان العقار/).fill('التجمع الخامس، القاهرة الجديدة');
  await page.getByRole('button', { name: 'متابعة' }).click();
  await page.waitForURL(/\/media/);
}

test.describe('Add Property flow', () => {
  test.beforeAll(() => {
    mkdirSync(outDir, { recursive: true });
  });

  test.describe.configure({ timeout: 120_000 });

  test('logged-out add-property redirects to login', async ({ page }) => {
    await page.context().clearCookies();
    await page.goto('/add-property', { waitUntil: 'networkidle' });
    await expect(page).toHaveURL(/\/auth\/login/);
    expect(page.url()).toContain('returnTo');
    expect(decodeURIComponent(page.url())).toContain('/add-property');
  });

  test('sale owner-cash flow to my-properties + screenshots', async ({ page }) => {
    await loginDemo(page, '/my-properties');
    await page.getByRole('link', { name: 'أعلن عن عقارك' }).first().click();
    await page.waitForURL(/\/my-properties\/LD-/);

    await expect(page.getByRole('heading', { name: 'المعلومات الأساسية' })).toBeVisible();
    await page.getByRole('radio', { name: 'للبيع' }).click();
    await page.getByTestId('property-type-combobox').click();
    await page.waitForTimeout(200);
    await page.screenshot({
      path: path.join(outDir, '02-property-type-open.png'),
      fullPage: true,
    });
    await page.getByRole('option', { name: 'شقة' }).click();
    await page.getByPlaceholder('ابحث عن المدينة أو الحي أو المنطقة').fill('القاهرة الجديدة');
    await page.getByRole('button', { name: /القاهرة الجديدة/ }).first().click();
    await page.waitForTimeout(250);
    await page.screenshot({
      path: path.join(outDir, '01-basic-information.png'),
      fullPage: true,
    });
    await page.getByRole('button', { name: 'متابعة' }).click();
    await page.waitForURL(/\/details/);

    await fillDetails(page);
    await page.waitForTimeout(200);
    await page.screenshot({
      path: path.join(outDir, '03-details.png'),
      fullPage: true,
    });

    // Developer empty
    await page.getByRole('button', { name: /من المطور/ }).click();
    await page.waitForTimeout(200);
    await page.screenshot({
      path: path.join(outDir, '04-price-developer.png'),
      fullPage: true,
    });

    await page.getByRole('button', { name: /من المالك \(نقداً\)/ }).click();
    await page.waitForTimeout(200);
    await page.screenshot({
      path: path.join(outDir, '05-price-owner-cash.png'),
      fullPage: true,
    });

    await page.getByRole('button', { name: /متبقي أقساط/ }).click();
    await page.waitForTimeout(200);
    await page.screenshot({
      path: path.join(outDir, '06-price-owner-installments.png'),
      fullPage: true,
    });

    await page.getByLabel(/سعر العقد/).fill('3000000');
    await page.getByLabel(/الزيادة المطلوبة/).fill('50000');
    await page.getByLabel(/وديعة الصيانة/).fill('10000');
    await page.getByLabel(/إجمالي المبلغ المدفوع/).fill('500000');
    await page.getByRole('button', { name: 'شهور', exact: true }).click();
    await page.locator('#remaining').fill('24');
    await page.waitForTimeout(200);
    await page.screenshot({
      path: path.join(outDir, '07-price-installments-filled.png'),
      fullPage: true,
    });

    // Switch to cash to continue simply
    await page.getByRole('button', { name: /من المالك \(نقداً\)/ }).click();
    await page.getByLabel(/^السعر$|سعر العقار/).fill('2500000');
    await page.getByRole('button', { name: 'متابعة' }).click();
    await page.waitForURL(/\/description/);

    await page.waitForTimeout(200);
    await page.screenshot({
      path: path.join(outDir, '08-description-ar.png'),
      fullPage: true,
    });
    await page.getByRole('tab', { name: 'English' }).click();
    await page.waitForTimeout(200);
    await page.screenshot({
      path: path.join(outDir, '09-description-en.png'),
      fullPage: true,
    });
    await page.getByRole('tab', { name: 'عربي' }).click();
    await fillDescription(page);

    await page.waitForTimeout(200);
    await page.screenshot({
      path: path.join(outDir, '10-media.png'),
      fullPage: true,
    });

    // Prefer demo image button if media form provides it
    if (await page.getByTestId('demo-add-image').count()) {
      await page.getByTestId('demo-add-image').click();
    } else {
      await page.locator('input[type="file"]').setInputFiles({
        name: 'photo.png',
        mimeType: 'image/png',
        buffer: Buffer.from(
          'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
          'base64',
        ),
      });
    }
    await page.waitForTimeout(300);
    await page.screenshot({
      path: path.join(outDir, '11-media-with-image.png'),
      fullPage: true,
    });
    await page.getByRole('button', { name: 'متابعة' }).click();
    await page.waitForURL(/\/publish/);

    await expect(page.getByRole('heading', { name: 'نشر الإعلان' })).toBeVisible();
    await expect(page.getByText('750')).toBeVisible();
    await page.waitForTimeout(250);
    await page.screenshot({
      path: path.join(outDir, '12-publish-preview.png'),
      fullPage: true,
    });
    const desktopSize = page.viewportSize();
    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(200);
    await page.screenshot({
      path: path.join(outDir, '22-publish-mobile.png'),
      fullPage: true,
    });
    await page.setViewportSize(desktopSize ?? { width: 1280, height: 720 });
    await page.waitForTimeout(150);

    await page.getByRole('link', { name: 'ادفع الآن' }).click();
    await page.waitForURL(/\/checkout/);
    await expect(page.getByRole('heading', { name: 'بيانات الدفع' })).toBeVisible();
    await page.waitForTimeout(200);
    await page.screenshot({
      path: path.join(outDir, '13-checkout-empty.png'),
      fullPage: true,
    });

    await page.getByTestId('add-payment-method').click();
    await page.getByTestId('use-demo-card').click();
    await expect(page.getByTestId('listing-pay-button')).toBeEnabled();
    await page.waitForTimeout(200);
    await page.screenshot({
      path: path.join(outDir, '14-checkout-payment-selected.png'),
      fullPage: true,
    });

    await page.getByTestId('listing-pay-button').click();
    await page.waitForURL(/\/my-properties/, { timeout: 20000 });
    await expect(
      page.getByRole('heading', { name: 'شقة للبيع في القاهرة الجديدة' }),
    ).toBeVisible();
    await expect(page.getByText('قيد المراجعة').first()).toBeVisible();
    await page.waitForTimeout(300);
    await page.screenshot({
      path: path.join(outDir, '16-my-properties-after-publish.png'),
      fullPage: true,
    });
  });

  test('draft resume + step guard + mobile shots', async ({ page }) => {
    await loginDemo(page, '/my-properties');
    await page.goto('/add-property', { waitUntil: 'commit' });
    await page.waitForURL(/\/my-properties\/LD-/, { timeout: 20000 });
    const draftUrl = page.url();
    const draftId = draftUrl.match(/my-properties\/(LD-[^/]+)/)?.[1];
    expect(draftId).toBeTruthy();

    await fillBasic(page);
    await fillDetails(page);
    await fillOwnerCash(page);
    // leave at description without completing
    await page.goto(`/my-properties?status=draft`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(300);
    await page.screenshot({
      path: path.join(outDir, '15-my-properties-draft.png'),
      fullPage: true,
    });
    await page.getByRole('link', { name: /استكمال/ }).first().click();
    await page.waitForURL(new RegExp(`/my-properties/${draftId}/`));
    expect(page.url()).toMatch(/description|price|details|basic/);

    // Step guard
    await page.goto(`/my-properties/${draftId}/publish`, {
      waitUntil: 'networkidle',
    });
    await expect(page).not.toHaveURL(/\/publish$/);

    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`/my-properties/${draftId}/basic`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(250);
    await page.screenshot({
      path: path.join(outDir, '17-basic-mobile.png'),
      fullPage: true,
    });
    await page.goto(`/my-properties/${draftId}/details`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(200);
    await page.screenshot({
      path: path.join(outDir, '18-details-mobile.png'),
      fullPage: true,
    });
    await page.goto(`/my-properties/${draftId}/price`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(200);
    await page.screenshot({
      path: path.join(outDir, '19-price-mobile.png'),
      fullPage: true,
    });
    await page.goto(`/my-properties/${draftId}/description`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(200);
    await page.screenshot({
      path: path.join(outDir, '20-description-mobile.png'),
      fullPage: true,
    });
    await page.goto(`/my-properties/${draftId}/media`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(200);
    await page.screenshot({
      path: path.join(outDir, '21-media-mobile.png'),
      fullPage: true,
    });
  });

  test('developer pricing calculations', async ({ page }) => {
    await loginDemo(page, '/my-properties');
    await page.goto('/add-property', { waitUntil: 'commit' });
    await page.waitForURL(/\/my-properties\/LD-/);
    await fillBasic(page);
    await fillDetails(page);
    await page.getByRole('button', { name: /من المطور/ }).click();
    await page.getByLabel(/^السعر$/).fill('2000000');
    await page.getByLabel(/سعر التقسيط الكلي/).fill('10000');
    await page.getByLabel(/المقدم/).fill('1010');
    await page.getByRole('button', { name: 'سنوات', exact: true }).click();
    await page.locator('#duration').fill('8');
    // remaining 8990 / 96 months ≈ 94
    await expect(page.getByText(/القسط الشهري/)).toBeVisible();
    const monthlyText = await page.getByText(/القسط الشهري/).textContent();
    expect(monthlyText).toMatch(/94/);
    await page.getByRole('button', { name: '%', exact: true }).click();
    await page.getByLabel(/المقدم/).fill('10');
    await expect(page.getByText(/نسبة المقدم/)).toBeVisible();
  });

  test('owner installments continue succeeds', async ({ page }) => {
    await loginDemo(page, '/my-properties');
    await page.goto('/add-property', { waitUntil: 'commit' });
    await page.waitForURL(/\/my-properties\/LD-/);
    await fillBasic(page);
    await fillDetails(page);
    await page.getByRole('button', { name: /متبقي أقساط/ }).click();
    await page.getByLabel(/سعر العقد/).fill('3000000');
    await page.getByLabel(/الزيادة المطلوبة/).fill('50000');
    await page.getByLabel(/وديعة الصيانة/).fill('10000');
    await page.getByLabel(/إجمالي المبلغ المدفوع/).fill('500000');
    await page.getByRole('button', { name: 'شهور', exact: true }).click();
    await page.locator('#remaining').fill('24');
    await page.getByRole('button', { name: 'متابعة' }).click();
    await page.waitForURL(/\/description/);
    await expect(page.getByRole('heading', { name: 'وصف العقار' })).toBeVisible();
  });
});
