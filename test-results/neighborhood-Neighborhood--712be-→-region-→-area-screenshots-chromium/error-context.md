# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: neighborhood.spec.ts >> Neighborhood / property prices >> directory → region → area + screenshots
- Location: tests\visual\neighborhood.spec.ts:14:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('heading', { name: 'العلمين' })
Expected: visible
Error: strict mode violation: getByRole('heading', { name: 'العلمين' }) resolved to 2 elements:
    1) <h3 class="text-base font-extrabold text-ink-950">العلمين</h3> aka getByRole('heading', { name: 'العلمين', exact: true })
    2) <h3 class="text-base font-extrabold text-ink-950">العلمين الجديدة</h3> aka getByRole('heading', { name: 'العلمين الجديدة' })

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByRole('heading', { name: 'العلمين' })

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e2]:
    - generic [ref=e4]:
      - paragraph [ref=e5]: عروض وخصومات حصرية على وحدات مختارة — تصفح أحدث الفرص العقارية الآن
      - button "إغلاق الشريط الإعلاني" [ref=e6]
    - banner [ref=e10]:
      - generic [ref=e12]:
        - generic [ref=e13]:
          - link "عقارات مصر" [ref=e14] [cursor=pointer]:
            - /url: /
          - navigation "التنقل الرئيسي" [ref=e16]:
            - link "للبيع" [ref=e17] [cursor=pointer]:
              - /url: /properties/sale
            - link "للإيجار" [ref=e21] [cursor=pointer]:
              - /url: /properties/rent
            - link "كمبوندات" [ref=e25] [cursor=pointer]:
              - /url: /compounds
            - link "أعرف" [ref=e30] [cursor=pointer]:
              - /url: /advice
        - generic [ref=e35]:
          - link "أعلن عن عقارك" [ref=e36] [cursor=pointer]:
            - /url: /add-property
          - button "التبديل إلى الإنجليزية (قريبًا)" [ref=e38]:
            - generic [ref=e44]: AR
          - link "الدعم عبر واتساب" [ref=e47] [cursor=pointer]:
            - /url: https://wa.me/201000000000?text=%D9%85%D8%B1%D8%AD%D8%A8%D9%8B%D8%A7%D8%8C%20%D8%A3%D8%AD%D8%AA%D8%A7%D8%AC%20%D8%A5%D9%84%D9%89%20%D9%85%D8%B3%D8%A7%D8%B9%D8%AF%D8%A9%20%D8%A8%D8%AE%D8%B5%D9%88%D8%B5%20%D9%85%D9%86%D8%B5%D8%A9%20%D8%B9%D9%82%D8%A7%D8%B1%D8%A7%D8%AA%20%D9%85%D8%B5%D8%B1.
          - button "تسجيل الدخول" [ref=e51]
    - main [ref=e58]:
      - generic [ref=e59]:
        - heading "دليل أسعار عقارات الساحل الشمالي" [level=1] [ref=e67]
        - generic [ref=e68]:
          - navigation "مسار التنقل" [ref=e69]:
            - list [ref=e70]:
              - listitem [ref=e71]:
                - link "عقارات مصر" [ref=e72] [cursor=pointer]:
                  - /url: /
              - listitem [ref=e73]:
                - link "أسعار العقارات" [ref=e76] [cursor=pointer]:
                  - /url: /neighborhood
              - listitem [ref=e77]:
                - generic [ref=e80]: الساحل الشمالي
          - paragraph [ref=e81]: الأسعار والبيانات المعروضة تجريبية لأغراض العرض.
          - generic [ref=e82]:
            - generic [ref=e83]:
              - article [ref=e84]:
                - link [ref=e85] [cursor=pointer]:
                  - /url: /neighborhood/north-coast/el-alamein
                  - img "العلمين" [ref=e87]
                - generic [ref=e88]:
                  - generic [ref=e89]:
                    - heading "العلمين" [level=3] [ref=e90]
                    - paragraph [ref=e91]: 74,650 جنيه
                    - paragraph [ref=e92]: متوسط سعر المتر
                  - link "التفاصيل" [ref=e93] [cursor=pointer]:
                    - /url: /neighborhood/north-coast/el-alamein
              - article [ref=e94]:
                - link [ref=e95] [cursor=pointer]:
                  - /url: /neighborhood/north-coast/new-alamein
                  - img "العلمين الجديدة" [ref=e97]
                - generic [ref=e98]:
                  - generic [ref=e99]:
                    - heading "العلمين الجديدة" [level=3] [ref=e100]
                    - paragraph [ref=e101]: 56,525 جنيه
                    - paragraph [ref=e102]: متوسط سعر المتر
                  - link "التفاصيل" [ref=e103] [cursor=pointer]:
                    - /url: /neighborhood/north-coast/new-alamein
              - article [ref=e104]:
                - link [ref=e105] [cursor=pointer]:
                  - /url: /neighborhood/north-coast/north-coast-resorts
                  - img "منتجعات الساحل الشمالي" [ref=e107]
                - generic [ref=e108]:
                  - generic [ref=e109]:
                    - heading "منتجعات الساحل الشمالي" [level=3] [ref=e110]
                    - paragraph [ref=e111]: 115,083 جنيه
                    - paragraph [ref=e112]: متوسط سعر المتر
                  - link "التفاصيل" [ref=e113] [cursor=pointer]:
                    - /url: /neighborhood/north-coast/north-coast-resorts
            - generic [ref=e114]:
              - generic [ref=e115]:
                - heading "عقارات في الساحل الشمالي" [level=2] [ref=e116]
                - group "نوع المعاملة" [ref=e119]:
                  - button "للبيع" [pressed] [ref=e120]
                  - button "للإيجار" [ref=e121]
              - list [ref=e122]:
                - listitem [ref=e123]:
                  - link "شقة للبيع في الساحل الشمالي (1,798)" [ref=e124] [cursor=pointer]:
                    - /url: /properties/sale/apartment/north-coast
                - listitem [ref=e125]:
                  - link "فيلا للبيع في الساحل الشمالي (1,761)" [ref=e126] [cursor=pointer]:
                    - /url: /properties/sale/villa/north-coast
                - listitem [ref=e127]:
                  - link "شاليه للبيع في الساحل الشمالي (1,724)" [ref=e128] [cursor=pointer]:
                    - /url: /properties/sale/chalet/north-coast
                - listitem [ref=e129]:
                  - link "تجاري للبيع في الساحل الشمالي (1,687)" [ref=e130] [cursor=pointer]:
                    - /url: /properties/sale/shop/north-coast
    - contentinfo [ref=e131]:
      - generic [ref=e133]:
        - generic [ref=e134]:
          - link "عقارات مصر" [ref=e135] [cursor=pointer]:
            - /url: /
          - paragraph [ref=e137]: منصة عقارية عربية للبحث عن شقق وفيلات ومشاريع للبيع والإيجار في مصر.
          - generic "حسابات التواصل" [ref=e138]:
            - link "فيسبوك" [ref=e139] [cursor=pointer]:
              - /url: https://facebook.com
            - link "إنستغرام" [ref=e142] [cursor=pointer]:
              - /url: https://instagram.com
            - link "لينكدإن" [ref=e145] [cursor=pointer]:
              - /url: https://linkedin.com
            - link "يوتيوب" [ref=e148] [cursor=pointer]:
              - /url: https://youtube.com
        - generic [ref=e151]:
          - navigation "العقارات" [ref=e152]:
            - paragraph [ref=e153]: العقارات
            - list [ref=e154]:
              - listitem [ref=e155]:
                - link "عقارات للبيع" [ref=e156] [cursor=pointer]:
                  - /url: /properties/sale
              - listitem [ref=e157]:
                - link "عقارات للإيجار" [ref=e158] [cursor=pointer]:
                  - /url: /properties/rent
              - listitem [ref=e159]:
                - link "شقق للبيع" [ref=e160] [cursor=pointer]:
                  - /url: /properties/sale/apartment
              - listitem [ref=e161]:
                - link "فيلات للبيع" [ref=e162] [cursor=pointer]:
                  - /url: /properties/sale/villa
              - listitem [ref=e163]:
                - link "أضف عقارك" [ref=e164] [cursor=pointer]:
                  - /url: /add-property
          - navigation "المناطق" [ref=e165]:
            - paragraph [ref=e166]: المناطق
            - list [ref=e167]:
              - listitem [ref=e168]:
                - link "القاهرة الجديدة" [ref=e169] [cursor=pointer]:
                  - /url: /properties/sale/apartment/cairo/new-cairo
              - listitem [ref=e170]:
                - link "التجمع الخامس" [ref=e171] [cursor=pointer]:
                  - /url: /properties/sale/apartment/cairo/new-cairo/fifth-settlement
              - listitem [ref=e172]:
                - link "الشيخ زايد" [ref=e173] [cursor=pointer]:
                  - /url: /properties/sale/villa/giza/sheikh-zayed
              - listitem [ref=e174]:
                - link "الكمبوندات" [ref=e175] [cursor=pointer]:
                  - /url: /compounds
              - listitem [ref=e176]:
                - link "دليل الأسعار" [ref=e177] [cursor=pointer]:
                  - /url: /neighborhood
          - navigation "الخدمات" [ref=e178]:
            - paragraph [ref=e179]: الخدمات
            - list [ref=e180]:
              - listitem [ref=e181]:
                - link "البحث عن عقار" [ref=e182] [cursor=pointer]:
                  - /url: /properties/sale
              - listitem [ref=e183]:
                - link "المفضلة" [ref=e184] [cursor=pointer]:
                  - /url: /favorites
              - listitem [ref=e185]:
                - link "نصائح عقارية" [ref=e186] [cursor=pointer]:
                  - /url: /advice
              - listitem [ref=e187]:
                - link "تسجيل الدخول" [ref=e188] [cursor=pointer]:
                  - /url: /auth/login
        - generic [ref=e189]:
          - generic [ref=e190]:
            - paragraph [ref=e191]: تواصل معنا
            - paragraph [ref=e192]: hello@egypt-homes.example
          - generic [ref=e193]:
            - paragraph [ref=e194]: حمّل التطبيق
            - generic [ref=e195]:
              - link "Google Play" [ref=e196] [cursor=pointer]:
                - /url: "#"
                - img "Google Play" [ref=e197]
              - link "App Store" [ref=e198] [cursor=pointer]:
                - /url: "#"
                - img "App Store" [ref=e199]
      - generic [ref=e201]:
        - paragraph [ref=e202]: © 2026 عقارات مصر. جميع الحقوق محفوظة.
        - list [ref=e203]:
          - listitem [ref=e204]:
            - link "الشروط والأحكام" [ref=e205] [cursor=pointer]:
              - /url: /terms
          - listitem [ref=e206]:
            - link "سياسة الخصوصية" [ref=e207] [cursor=pointer]:
              - /url: /privacy
          - listitem [ref=e208]:
            - link "ملفات تعريف الارتباط" [ref=e209] [cursor=pointer]:
              - /url: /cookies
  - button "Open Next.js Dev Tools" [ref=e215] [cursor=pointer]:
    - generic [ref=e218]:
      - text: Rendering
      - generic [ref=e219]:
        - generic [ref=e220]: .
        - generic [ref=e221]: .
        - generic [ref=e222]: .
  - alert [ref=e223]: دليل أسعار عقارات الساحل الشمالي
```

# Test source

```ts
  1   | import { expect, test } from '@playwright/test';
  2   | import { mkdirSync } from 'node:fs';
  3   | import path from 'node:path';
  4   | 
  5   | const outDir = path.join('docs', 'visual-qa', 'neighborhood-1920');
  6   | 
  7   | test.describe('Neighborhood / property prices', () => {
  8   |   test.beforeAll(() => {
  9   |     mkdirSync(outDir, { recursive: true });
  10  |   });
  11  | 
  12  |   test.describe.configure({ timeout: 90_000 });
  13  | 
  14  |   test('directory → region → area + screenshots', async ({ page }) => {
  15  |     await page.setViewportSize({ width: 1440, height: 900 });
  16  |     await page.goto('/neighborhood', { waitUntil: 'networkidle' });
  17  |     await expect(
  18  |       page.getByRole('heading', { name: 'أسعار العقارات في مصر' }),
  19  |     ).toBeVisible();
  20  |     await expect(page.getByRole('link', { name: 'الساحل الشمالي' }).first()).toBeVisible();
  21  |     await page.waitForTimeout(300);
  22  |     await page.screenshot({
  23  |       path: path.join(outDir, '01-directory-full.png'),
  24  |       fullPage: true,
  25  |     });
  26  |     await page.locator('.grid').first().screenshot({
  27  |       path: path.join(outDir, '02-directory-regions-grid.png'),
  28  |     });
  29  |     await page
  30  |       .getByRole('heading', { name: 'عقارات في مدن مصر' })
  31  |       .scrollIntoViewIfNeeded();
  32  |     await page.waitForTimeout(200);
  33  |     await page.screenshot({
  34  |       path: path.join(outDir, '03-directory-city-links.png'),
  35  |       fullPage: false,
  36  |     });
  37  | 
  38  |     await page.getByRole('link', { name: 'الساحل الشمالي' }).first().click();
  39  |     await page.waitForURL(/\/neighborhood\/north-coast$/);
  40  |     await expect(
  41  |       page.getByRole('heading', { name: /دليل أسعار عقارات الساحل الشمالي/ }),
  42  |     ).toBeVisible();
> 43  |     await expect(page.getByRole('heading', { name: 'العلمين' })).toBeVisible();
      |                                                                  ^ Error: expect(locator).toBeVisible() failed
  44  |     await page.waitForTimeout(250);
  45  |     await page.screenshot({
  46  |       path: path.join(outDir, '04-region-page-full.png'),
  47  |       fullPage: true,
  48  |     });
  49  |     await page.screenshot({
  50  |       path: path.join(outDir, '05-region-hero.png'),
  51  |       fullPage: false,
  52  |     });
  53  |     await page.getByRole('heading', { name: 'العلمين' }).scrollIntoViewIfNeeded();
  54  |     await page.waitForTimeout(150);
  55  |     await page.screenshot({
  56  |       path: path.join(outDir, '06-region-child-cards.png'),
  57  |       fullPage: false,
  58  |     });
  59  | 
  60  |     await page.getByRole('link', { name: 'التفاصيل' }).first().click();
  61  |     await page.waitForURL(/\/neighborhood\/north-coast\/el-alamein/);
  62  |     await expect(
  63  |       page.getByRole('heading', { name: 'أسعار العقارات في العلمين' }),
  64  |     ).toBeVisible();
  65  |     await expect(page.getByText('متوسط سعر المتر').first()).toBeVisible();
  66  |     await expect(page.getByText(/زيادة الأسعار في 12 شهر|انخفاض|استقرار/)).toBeVisible();
  67  |     await expect(page.getByRole('heading', { name: 'تقييم العلمين' })).toBeVisible();
  68  |     await expect(page.getByRole('heading', { name: 'عن العلمين' })).toBeVisible();
  69  |     await expect(
  70  |       page.getByRole('heading', { name: /أكبر المكاتب العقارية في العلمين/ }),
  71  |     ).toBeVisible();
  72  |     await expect(
  73  |       page.getByRole('heading', { name: 'الأسئلة الأكثر شيوعاً' }),
  74  |     ).toBeVisible();
  75  |     await page.getByRole('button', { name: /ما متوسط سعر المتر/ }).click();
  76  |     await expect(page.getByText(/متوسط سعر المتر يختلف/)).toBeVisible();
  77  |     await expect(
  78  |       page.getByRole('link', { name: /شقة للبيع في العلمين/ }),
  79  |     ).toBeVisible();
  80  | 
  81  |     await page.waitForTimeout(250);
  82  |     await page.screenshot({
  83  |       path: path.join(outDir, '07-area-page-full.png'),
  84  |       fullPage: true,
  85  |     });
  86  |     await page
  87  |       .getByRole('heading', { name: 'أسعار العقارات في العلمين' })
  88  |       .scrollIntoViewIfNeeded();
  89  |     await page.screenshot({
  90  |       path: path.join(outDir, '08-area-price-summary.png'),
  91  |       fullPage: false,
  92  |     });
  93  |     await page.getByRole('heading', { name: /إحصائيات العلمين/ }).scrollIntoViewIfNeeded();
  94  |     await page.screenshot({
  95  |       path: path.join(outDir, '09-area-annual-change.png'),
  96  |       fullPage: false,
  97  |     });
  98  |     await page.getByRole('heading', { name: 'تقييم العلمين' }).scrollIntoViewIfNeeded();
  99  |     await page.screenshot({
  100 |       path: path.join(outDir, '10-area-ratings.png'),
  101 |       fullPage: false,
  102 |     });
  103 |     await page.getByRole('heading', { name: 'عن العلمين' }).scrollIntoViewIfNeeded();
  104 |     await page.screenshot({
  105 |       path: path.join(outDir, '11-area-about.png'),
  106 |       fullPage: false,
  107 |     });
  108 |     await page
  109 |       .getByRole('heading', { name: /أكبر المكاتب العقارية/ })
  110 |       .scrollIntoViewIfNeeded();
  111 |     await page.screenshot({
  112 |       path: path.join(outDir, '12-area-brokers.png'),
  113 |       fullPage: false,
  114 |     });
  115 |     await page
  116 |       .getByRole('heading', { name: 'الأسئلة الأكثر شيوعاً' })
  117 |       .scrollIntoViewIfNeeded();
  118 |     await page.screenshot({
  119 |       path: path.join(outDir, '13-area-faq.png'),
  120 |       fullPage: false,
  121 |     });
  122 |     await page
  123 |       .getByRole('heading', { name: 'عقارات في العلمين' })
  124 |       .scrollIntoViewIfNeeded();
  125 |     await page.screenshot({
  126 |       path: path.join(outDir, '14-area-property-links.png'),
  127 |       fullPage: false,
  128 |     });
  129 |   });
  130 | 
  131 |   test('property search integration + homepage entry + not found', async ({
  132 |     page,
  133 |   }) => {
  134 |     await page.setViewportSize({ width: 1440, height: 900 });
  135 |     await page.goto('/neighborhood/north-coast/el-alamein', {
  136 |       waitUntil: 'networkidle',
  137 |     });
  138 |     await page.getByRole('link', { name: /شقة للبيع في العلمين/ }).click();
  139 |     await page.waitForURL(/\/properties\/sale\/apartment\//);
  140 |     expect(page.url()).toContain('north-coast');
  141 | 
  142 |     await page.goto('/', { waitUntil: 'networkidle' });
  143 |     const pricesHeading = page.getByRole('heading', {
```