import { expect, test, type Page } from '@playwright/test';
import {
  BROWSER_COOKIE_MAX_CHARS,
  SAFE_COOKIE_MAX_CHARS,
  cookieNameValueSize,
  createMemoryDraftCookieJar,
  readChunkedCookie,
  writeChunkedCookie,
} from '../../src/features/add-property/lib/cookie-store';

const ADD_PROPERTY_COOKIE_PREFIX = 'demo_listing';

async function loginDemo(page: Page, returnTo: string) {
  await page.context().clearCookies();
  await page.goto(`/auth/login?returnTo=${encodeURIComponent(returnTo)}`, {
    waitUntil: 'networkidle',
  });
  await page.locator('[data-testid="login-next"]').waitFor({ state: 'visible' });
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

function listingCookieNames(cookies: Array<{ name: string; value: string }>) {
  return cookies.filter((cookie) => cookie.name.startsWith(ADD_PROPERTY_COOKIE_PREFIX));
}

async function assertListingCookiesSafe(page: Page) {
  const cookies = listingCookieNames(await page.context().cookies());
  expect(cookies.find((cookie) => cookie.name === 'demo_listing_drafts')).toBeUndefined();
  for (const cookie of cookies) {
    const stored = cookie.name.length + cookie.value.length;
    const looksEncoded = /%[0-9A-Fa-f]{2}/.test(cookie.value);
    const encoded = looksEncoded
      ? stored
      : cookieNameValueSize(cookie.name, cookie.value);
    expect(
      stored,
      `${cookie.name} stored size ${stored}`,
    ).toBeLessThanOrEqual(BROWSER_COOKIE_MAX_CHARS);
    expect(
      encoded,
      `${cookie.name} encoded size ${encoded}`,
    ).toBeLessThanOrEqual(SAFE_COOKIE_MAX_CHARS);
  }
  return cookies;
}

test.describe('Add Property cookie persistence', () => {
  test.describe.configure({ timeout: 120_000 });

  test('chunked cookie store reconstructs oversized payloads under the safe limit', () => {
    const jar = createMemoryDraftCookieJar();
    const payload = JSON.stringify({
      ar: {
        title: 'شقة واسعة',
        description: 'وصف عربي طويل '.repeat(400),
        address: 'التجمع الخامس',
      },
      en: {
        title: 'Spacious apartment',
        description: 'A very long English listing description. '.repeat(200),
        address: 'Fifth Settlement',
      },
    });
    const asLegacyCookie = cookieNameValueSize(
      'demo_listing_drafts',
      JSON.stringify([
        {
          id: 'LD-TEST',
          description: JSON.parse(payload),
          details: { views: [], amenities: [] },
          media: { images: [] },
        },
      ]),
    );
    expect(asLegacyCookie).toBeGreaterThan(BROWSER_COOKIE_MAX_CHARS);

    writeChunkedCookie(jar, 'demo_listing_LD-TEST_description', payload);
    const restored = readChunkedCookie(jar, 'demo_listing_LD-TEST_description');
    expect(restored).toBe(payload);

    const stored = jar.getAll();
    expect(stored.length).toBeGreaterThan(0);
    for (const cookie of stored) {
      expect(cookieNameValueSize(cookie.name, cookie.value)).toBeLessThanOrEqual(
        SAFE_COOKIE_MAX_CHARS,
      );
    }

    writeChunkedCookie(jar, 'demo_listing_LD-TEST_description', '{"ok":true}');
    expect(readChunkedCookie(jar, 'demo_listing_LD-TEST_description')).toBe('{"ok":true}');
    expect(jar.get('demo_listing_LD-TEST_description__meta')).toBeUndefined();
    expect(jar.get('demo_listing_LD-TEST_description__0')).toBeUndefined();

    const noisy = Array.from(
      { length: 2200 },
      (_, index) => `بند-${index}-${Math.sin(index + 0.37).toString(36)}`,
    ).join('|');
    writeChunkedCookie(jar, 'demo_listing_LD-NOISE_description', noisy);
    expect(readChunkedCookie(jar, 'demo_listing_LD-NOISE_description')).toBe(noisy);
    expect(
      jar.getAll().some((cookie) => cookie.name.startsWith('demo_listing_LD-NOISE_description__')),
    ).toBe(true);
  });

  test('basic then details persist across reload and stay under cookie limits', async ({
    page,
  }) => {
    await loginDemo(page, '/my-properties');
    await page.goto('/add-property', { waitUntil: 'commit' });
    await page.waitForURL(/\/my-properties\/LD-[^/]+\/basic/, { timeout: 20000 });
    const draftId = page.url().match(/my-properties\/(LD-[^/]+)/)?.[1];
    expect(draftId).toBeTruthy();

    await fillBasic(page);
    await expect(page).toHaveURL(new RegExp(`/my-properties/${draftId}/details`));
    await assertListingCookiesSafe(page);

    await page.reload({ waitUntil: 'networkidle' });
    await expect(page).toHaveURL(new RegExp(`/my-properties/${draftId}/details`));
    await page.goto(`/my-properties/${draftId}/basic`, { waitUntil: 'networkidle' });
    await expect(page.getByTestId('property-type-combobox')).toHaveValue('شقة');
    await expect(page.getByPlaceholder('ابحث عن المدينة أو الحي أو المنطقة')).toHaveValue(
      /القاهرة الجديدة/,
    );

    await page.goto(`/my-properties/${draftId}/details`, { waitUntil: 'networkidle' });
    await page.getByLabel(/المساحة/).fill('150');
    await page.getByLabel(/عدد الغرف/).fill('3');
    await page.getByLabel(/عدد الحمامات/).fill('2');
    await page.getByRole('checkbox', { name: 'أمن' }).check();
    await page.getByRole('checkbox', { name: 'مصعد' }).check();
    await page.getByRole('button', { name: 'متابعة' }).click();
    await page.waitForURL(/\/price/);

    await page.reload({ waitUntil: 'networkidle' });
    await expect(page).toHaveURL(new RegExp(`/my-properties/${draftId}/price`));
    await page.goto(`/my-properties/${draftId}/details`, { waitUntil: 'networkidle' });
    await expect(page.getByLabel(/المساحة/)).toHaveValue('150');
    await expect(page.getByLabel(/عدد الغرف/)).toHaveValue('3');
    await expect(page.getByLabel(/عدد الحمامات/)).toHaveValue('2');
    await expect(page.getByRole('checkbox', { name: 'أمن' })).toBeChecked();
    await expect(page.getByRole('checkbox', { name: 'مصعد' })).toBeChecked();
    await assertListingCookiesSafe(page);
  });

  test('large description is chunked, reloads, and resumes from My Properties', async ({
    page,
  }) => {
    await loginDemo(page, '/my-properties');
    await page.goto('/add-property', { waitUntil: 'commit' });
    await page.waitForURL(/\/my-properties\/LD-[^/]+\/basic/, { timeout: 20000 });
    const draftId = page.url().match(/my-properties\/(LD-[^/]+)/)?.[1];
    await fillBasic(page);
    await page.getByLabel(/المساحة/).fill('180');
    await page.getByLabel(/عدد الغرف/).fill('4');
    await page.getByLabel(/عدد الحمامات/).fill('3');
    await page.getByRole('button', { name: 'متابعة' }).click();
    await page.waitForURL(/\/price/);
    await page.getByRole('button', { name: /من المالك \(نقداً\)/ }).click();
    await page.getByLabel(/^السعر$|سعر العقار/).fill('3200000');
    await page.getByRole('button', { name: 'متابعة' }).click();
    await page.waitForURL(/\/description/);

    const longAr = 'شقة مميزة في القاهرة الجديدة مع وصف تفصيلي للعقار. '.repeat(80);
    const longEn = 'Premium apartment in New Cairo with a detailed listing description. '.repeat(
      80,
    );
    await page.getByLabel(/اسم الإعلان/).fill('شقة للبيع في القاهرة الجديدة');
    await page.getByLabel(/وصف العقار/).fill(longAr);
    await page.getByLabel(/عنوان العقار/).fill('التجمع الخامس، القاهرة الجديدة');
    await page.getByRole('tab', { name: 'English' }).click();
    await page.getByLabel(/Listing Name/).fill('Apartment for sale in New Cairo');
    await page.getByLabel(/Listing Description/).fill(longEn);
    await page.getByLabel(/Property Address/).fill('Fifth Settlement, New Cairo');
    await page.getByRole('button', { name: 'متابعة' }).click();
    await page.waitForURL(/\/media/);

    const cookies = await assertListingCookiesSafe(page);
    expect(
      cookies.some((cookie) => cookie.name.includes(`demo_listing_${draftId}_description`)),
    ).toBe(true);

    await page.reload({ waitUntil: 'networkidle' });
    await expect(page).toHaveURL(new RegExp(`/my-properties/${draftId}/media`));
    await page.goto(`/my-properties/${draftId}/description`, { waitUntil: 'networkidle' });
    await expect(page.locator('#listing-desc')).toHaveValue(longAr);

    await page.goto('/my-properties?status=draft', { waitUntil: 'networkidle' });
    await page.getByRole('link', { name: /استكمال/ }).first().click();
    await page.waitForURL(new RegExp(`/my-properties/${draftId}/`));
    expect(page.url()).toMatch(/media/);
  });
});
