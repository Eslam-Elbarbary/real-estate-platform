import { writeFileSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const successTest = `
pm.test("Status is successful", function () {
  pm.expect(pm.response.code).to.be.oneOf([200, 201]);
});
pm.test("Success response wrapper", function () {
  const json = pm.response.json();
  pm.expect(json.success).to.eql(true);
});
`.trim();

const loginTest = `
${successTest}
pm.test("Access token saved", function () {
  const json = pm.response.json();
  pm.expect(json.data.accessToken).to.be.a("string");
  pm.environment.set("accessToken", json.data.accessToken);
  pm.environment.set("refreshToken", json.data.refreshToken);
  if (json.data.user?.id) pm.environment.set("userId", json.data.user.id);
});
`.trim();

const registerTest = `
${successTest}
pm.test("User registered", function () {
  const json = pm.response.json();
  pm.expect(json.data.user.id).to.be.a("string");
  pm.environment.set("userId", json.data.user.id);
  if (json.data.verificationToken) {
    pm.environment.set("verificationToken", json.data.verificationToken);
  }
});
`.trim();

function req(name, method, path, opts = {}) {
  const urlPath = path.startsWith('http') ? path : `{{baseUrl}}${path.startsWith('/') ? path : '/' + path}`;
  const item = {
    name,
    request: {
      method,
      header: opts.auth === false ? [] : [],
      url: typeof urlPath === 'string' && urlPath.includes('{{baseUrl}}')
        ? urlPath.replace('{{baseUrl}}', '{{baseUrl}}').replace(/\/+/g, (m, i) => (i === 0 ? m : '/'))
        : urlPath,
    },
  };

  if (opts.auth !== false) {
    item.request.auth = {
      type: 'bearer',
      bearer: [{ key: 'token', value: '{{accessToken}}', type: 'string' }],
    };
  }

  if (opts.admin) {
    item.request.auth = {
      type: 'bearer',
      bearer: [{ key: 'token', value: '{{adminAccessToken}}', type: 'string' }],
    };
  }

  if (opts.body) {
    item.request.header.push({ key: 'Content-Type', value: 'application/json' });
    item.request.body = { mode: 'raw', raw: JSON.stringify(opts.body, null, 2) };
  }

  if (opts.test) {
    item.event = [{ listen: 'test', script: { type: 'text/javascript', exec: opts.test.split('\n') } }];
  }

  return item;
}

function folder(name, items) {
  return { name, item: items };
}

const collection = {
  info: {
    name: 'Real Estate Platform API',
    description:
      'Complete MVP API collection for the Aqarmap real-estate platform backend. Import the environment file and run folders sequentially.',
    schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json',
  },
  auth: {
    type: 'bearer',
    bearer: [{ key: 'token', value: '{{accessToken}}', type: 'string' }],
  },
  item: [
    folder('01 - Health', [
      req('Health Check', 'GET', '/health', {
        auth: false,
        test: `pm.test("Status ok or degraded", function () {
  pm.expect(pm.response.code).to.eql(200);
  const json = pm.response.json();
  pm.expect(json.status).to.be.oneOf(["ok", "degraded"]);
});`,
      }),
    ]),
    folder('02 - Auth', [
      req('Register', 'POST', '/auth/register', {
        auth: false,
        body: {
          firstName: 'Test',
          lastName: 'User',
          email: 'test.user@example.com',
          password: 'Password1!',
          phone: '+201000000000',
        },
        test: registerTest,
      }),
      req('Verify Email', 'POST', '/auth/verify-email', {
        auth: false,
        body: { token: '{{verificationToken}}' },
        test: successTest,
      }),
      req('Login', 'POST', '/auth/login', {
        auth: false,
        body: { email: 'test.user@example.com', password: 'Password1!' },
        test: loginTest,
      }),
      req('Refresh Token', 'POST', '/auth/refresh', {
        auth: false,
        body: { refreshToken: '{{refreshToken}}' },
        test: loginTest,
      }),
      req('Me', 'GET', '/auth/me', { test: successTest }),
      req('Logout', 'POST', '/auth/logout', {
        auth: false,
        body: { refreshToken: '{{refreshToken}}' },
        test: successTest,
      }),
      req('Forgot Password', 'POST', '/auth/forgot-password', {
        auth: false,
        body: { email: 'test.user@example.com' },
        test: successTest,
      }),
      req('Reset Password', 'POST', '/auth/reset-password', {
        auth: false,
        body: { token: '{{passwordResetToken}}', password: 'NewPassword1!' },
        test: successTest,
      }),
    ]),
    folder('03 - Users', [
      req('Get Profile', 'GET', '/users/me', { test: successTest }),
      req('Update Profile', 'PATCH', '/users/me', {
        body: { firstName: 'Updated', lastName: 'User', phone: '+201000000001' },
        test: successTest,
      }),
      req('Change Password', 'POST', '/users/me/change-password', {
        body: { currentPassword: 'Password1!', newPassword: 'NewPassword1!' },
        test: successTest,
      }),
    ]),
    folder('04 - Locations', [
      req('List Countries', 'GET', '/locations/countries', { auth: false, test: successTest }),
      req('List Cities', 'GET', '/locations/countries/{{countryId}}/cities', {
        auth: false,
        test: successTest,
      }),
      req('List Areas', 'GET', '/locations/cities/{{cityId}}/areas', {
        auth: false,
        test: successTest,
      }),
      req('List Districts', 'GET', '/locations/areas/{{areaId}}/districts', {
        auth: false,
        test: successTest,
      }),
      req('Location Tree', 'GET', '/locations/tree', { auth: false, test: successTest }),
    ]),
    folder('05 - Properties', [
      req('Create Draft', 'POST', '/properties/drafts', {
        body: {},
        test: `${successTest}
pm.test("Property id saved", function () {
  pm.environment.set("propertyId", pm.response.json().data.id);
});`,
      }),
      req('List My Properties', 'GET', '/properties/me', { test: successTest }),
      req('Get Property', 'GET', '/properties/me/{{propertyId}}', { test: successTest }),
      req('Update Property', 'PATCH', '/properties/me/{{propertyId}}', {
        body: { price: 1500000, description: 'Updated description' },
        test: successTest,
      }),
      req('Update Basic', 'PATCH', '/properties/me/{{propertyId}}/basic', {
        body: {
          title: 'Test Villa',
          propertyTypeId: '{{propertyTypeId}}',
          transactionTypeId: '{{transactionTypeId}}',
        },
        test: successTest,
      }),
      req('Update Location', 'PATCH', '/properties/me/{{propertyId}}/location', {
        body: { areaId: '{{areaId}}' },
        test: successTest,
      }),
      req('Update Details', 'PATCH', '/properties/me/{{propertyId}}/details', {
        body: { bedrooms: 3, bathrooms: 2, areaSqm: 120 },
        test: successTest,
      }),
      req('Set Features', 'PUT', '/properties/me/{{propertyId}}/features', {
        body: { featureIds: [] },
        test: successTest,
      }),
      req('Get Completion', 'GET', '/properties/me/{{propertyId}}/completion', { test: successTest }),
      req('Resubmit (Rejected only)', 'POST', '/properties/me/{{propertyId}}/submit', { test: successTest }),
      req('Delete Draft', 'DELETE', '/properties/me/{{propertyId}}', { test: successTest }),
    ]),
    folder('06 - Property Media', [
      req('List Media', 'GET', '/properties/me/{{propertyId}}/media', { test: successTest }),
    ]),
    folder('07 - Media Library', [
      req('List Media Assets', 'GET', '/media?page=1&limit=20', { test: successTest }),
    ]),
    folder('08 - Plans', [
      req('List Active Plans', 'GET', '/plans', {
        auth: false,
        test: `${successTest}
pm.test("Plans array", function () {
  pm.expect(pm.response.json().data).to.be.an("array");
  if (pm.response.json().data.length > 0) {
    pm.environment.set("planId", pm.response.json().data[0].id);
  }
});`,
      }),
    ]),
    folder('09 - Subscriptions', [
      req('Create Subscription', 'POST', '/properties/me/{{propertyId}}/subscription', {
        body: { planId: '{{planId}}' },
        test: `${successTest}
pm.test("Subscription id saved", function () {
  pm.environment.set("subscriptionId", pm.response.json().data.id);
});`,
      }),
      req('Get Subscription', 'GET', '/properties/me/{{propertyId}}/subscription', { test: successTest }),
    ]),
    folder('10 - Payments', [
      req('Pay Subscription', 'POST', '/subscriptions/{{subscriptionId}}/pay', {
        test: `${successTest}
pm.test("Payment id saved", function () {
  const data = pm.response.json().data;
  if (data.id) pm.environment.set("paymentId", data.id);
});`,
      }),
      req('Payment History', 'GET', '/subscriptions/{{subscriptionId}}/payments', { test: successTest }),
    ]),
    folder('11 - Leads', [
      req('Create Lead', 'POST', '/properties/{{propertyId}}/leads', {
        body: { type: 'WHATSAPP', message: 'Interested in this property' },
        test: `${successTest}
pm.test("Lead id saved", function () {
  pm.environment.set("leadId", pm.response.json().data.id);
});`,
      }),
      req('My Leads (Buyer)', 'GET', '/leads/me', { test: successTest }),
      req('Seller Leads', 'GET', '/properties/me/leads', { test: successTest }),
      req('Update Lead Status', 'PATCH', '/leads/{{leadId}}/status', {
        body: { status: 'CONTACTED' },
        test: successTest,
      }),
    ]),
    folder('12 - Favorites', [
      req('List Favorites', 'GET', '/favorites', { test: successTest }),
      req('Check Favorite', 'GET', '/favorites/{{propertyId}}/check', { test: successTest }),
      req('Add Favorite', 'POST', '/favorites/{{propertyId}}', { test: successTest }),
      req('Remove Favorite', 'DELETE', '/favorites/{{propertyId}}', { test: successTest }),
    ]),
    folder('13 - Notes', [
      req('List Notes', 'GET', '/notes', { test: successTest }),
      req('Create Note', 'POST', '/properties/{{propertyId}}/notes', {
        body: { content: 'Private note about this listing' },
        test: `${successTest}
pm.test("Note id saved", function () {
  pm.environment.set("noteId", pm.response.json().data.id);
});`,
      }),
      req('Update Note', 'PATCH', '/notes/{{noteId}}', {
        body: { content: 'Updated note content' },
        test: successTest,
      }),
      req('Delete Note', 'DELETE', '/notes/{{noteId}}', { test: successTest }),
    ]),
    folder('14 - Alerts', [
      req('List Alerts', 'GET', '/alerts', { test: successTest }),
      req('Create Alert', 'POST', '/alerts', {
        body: {
          name: 'Cairo apartments',
          filters: { priceMin: 1000000, priceMax: 3000000 },
        },
        test: `${successTest}
pm.test("Alert id saved", function () {
  pm.environment.set("alertId", pm.response.json().data.id);
});`,
      }),
      req('Update Alert', 'PATCH', '/alerts/{{alertId}}', {
        body: { name: 'Updated alert name' },
        test: successTest,
      }),
      req('Delete Alert', 'DELETE', '/alerts/{{alertId}}', { test: successTest }),
    ]),
    folder('15 - Notifications', [
      req('List Notifications', 'GET', '/notifications', { test: successTest }),
      req('Mark Read', 'PATCH', '/notifications/{{notificationId}}/read', { test: successTest }),
      req('Mark All Read', 'PATCH', '/notifications/read-all', { test: successTest }),
    ]),
    folder('16 - Compounds', [
      req('List Compounds', 'GET', '/compounds?page=1&limit=20', { auth: false, test: successTest }),
      req('Compound Detail', 'GET', '/compounds/{{compoundSlug}}', { auth: false, test: successTest }),
    ]),
    folder('17 - Developers', [
      req('List Developers', 'GET', '/developers?page=1&limit=20', { auth: false, test: successTest }),
      req('Developer Detail', 'GET', '/developers/{{developerSlug}}', { auth: false, test: successTest }),
    ]),
    folder('18 - Public Properties', [
      req('Search Published', 'GET', '/properties?page=1&limit=20', { auth: false, test: successTest }),
      req('Property by Slug', 'GET', '/properties/{{propertySlug}}', { auth: false, test: successTest }),
    ]),
    folder('19 - Features', [
      req('List Features', 'GET', '/features', { auth: false, test: successTest }),
    ]),
    folder('20 - Catalogs', [
      req('Catalog Property Types', 'GET', '/catalogs/property-types', { auth: false, test: successTest }),
      req('Catalog Transaction Types', 'GET', '/catalogs/transaction-types', { auth: false, test: successTest }),
      req('Catalog Features', 'GET', '/catalogs/features', { auth: false, test: successTest }),
    ]),
    folder('21 - Admin', [
      req('Dashboard', 'GET', '/admin/dashboard', { admin: true, test: successTest }),
      req('List Properties', 'GET', '/admin/properties?page=1&limit=20', { admin: true, test: successTest }),
      req('Property Details', 'GET', '/admin/properties/{{propertyId}}', { admin: true, test: successTest }),
      req('Approve Property', 'POST', '/admin/properties/{{propertyId}}/approve', { admin: true, test: successTest }),
      req('Reject Property', 'POST', '/admin/properties/{{propertyId}}/reject', {
        admin: true,
        body: { reason: 'Incomplete photos' },
        test: successTest,
      }),
      req('Archive Property', 'POST', '/admin/properties/{{propertyId}}/archive', { admin: true, test: successTest }),
      req('List Users', 'GET', '/admin/users?page=1&limit=20', { admin: true, test: successTest }),
      req('Get User', 'GET', '/admin/users/{{userId}}', { admin: true, test: successTest }),
      req('Update User Status', 'PATCH', '/admin/users/{{userId}}/status', {
        admin: true,
        body: { isActive: true },
        test: successTest,
      }),
      req('List Plans', 'GET', '/admin/plans?page=1&limit=20', { admin: true, test: successTest }),
      req('Create Plan', 'POST', '/admin/plans', {
        admin: true,
        body: {
          code: 'POSTMAN_TEST',
          name: 'Postman Test Plan',
          price: 0,
          durationDays: 30,
          features: { listingLimit: 1 },
        },
        test: successTest,
      }),
      req('Get Plan', 'GET', '/admin/plans/{{planId}}', { admin: true, test: successTest }),
      req('Update Plan', 'PATCH', '/admin/plans/{{planId}}', {
        admin: true,
        body: { status: 'ACTIVE' },
        test: successTest,
      }),
      req('List Developers', 'GET', '/admin/developers?page=1&limit=20', { admin: true, test: successTest }),
      req('List Compounds', 'GET', '/admin/compounds?page=1&limit=20', { admin: true, test: successTest }),
    ]),
  ],
};

const environment = {
  id: 'real-estate-platform-env',
  name: 'Real Estate Platform - Local',
  values: [
    { key: 'baseUrl', value: 'http://localhost:4000/api/v1', enabled: true },
    { key: 'accessToken', value: '', enabled: true },
    { key: 'refreshToken', value: '', enabled: true },
    { key: 'adminAccessToken', value: '', enabled: true },
    { key: 'verificationToken', value: '', enabled: true },
    { key: 'passwordResetToken', value: '', enabled: true },
    { key: 'userId', value: '', enabled: true },
    { key: 'propertyId', value: '', enabled: true },
    { key: 'propertySlug', value: '', enabled: true },
    { key: 'subscriptionId', value: '', enabled: true },
    { key: 'paymentId', value: '', enabled: true },
    { key: 'planId', value: '', enabled: true },
    { key: 'compoundId', value: '', enabled: true },
    { key: 'compoundSlug', value: '', enabled: true },
    { key: 'developerId', value: '', enabled: true },
    { key: 'developerSlug', value: '', enabled: true },
    { key: 'leadId', value: '', enabled: true },
    { key: 'notificationId', value: '', enabled: true },
    { key: 'alertId', value: '', enabled: true },
    { key: 'noteId', value: '', enabled: true },
    { key: 'mediaAssetId', value: '', enabled: true },
    { key: 'countryId', value: '', enabled: true },
    { key: 'cityId', value: '', enabled: true },
    { key: 'areaId', value: '', enabled: true },
    { key: 'propertyTypeId', value: '', enabled: true },
    { key: 'transactionTypeId', value: '', enabled: true },
  ],
  _postman_variable_scope: 'environment',
};

mkdirSync(__dirname, { recursive: true });
writeFileSync(
  join(__dirname, 'real-estate-platform.postman_collection.json'),
  JSON.stringify(collection, null, 2),
);
writeFileSync(
  join(__dirname, 'real-estate-platform.postman_environment.json'),
  JSON.stringify(environment, null, 2),
);
console.log('Generated Postman collection and environment.');
