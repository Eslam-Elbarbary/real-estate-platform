import { writeFileSync, mkdirSync, readdirSync, readFileSync, statSync } from 'fs';
import { dirname, join, extname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(__dirname, '../..');
const srcDir = join(repoRoot, 'apps/api/src');

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

const healthTest = `
pm.test("Status ok or degraded", function () {
  pm.expect(pm.response.code).to.eql(200);
  const json = pm.response.json();
  pm.expect(json.status).to.be.oneOf(["ok", "degraded"]);
});
`.trim();

const FIELD_VARS = {
  planId: '{{planId}}',
  propertyTypeId: '{{propertyTypeId}}',
  transactionTypeId: '{{transactionTypeId}}',
  areaId: '{{areaId}}',
  districtId: '{{districtId}}',
  compoundId: '{{compoundId}}',
  developerId: '{{developerId}}',
  countryId: '{{countryId}}',
  cityId: '{{cityId}}',
  propertyId: '{{propertyId}}',
  userId: '{{userId}}',
  imageId: '{{imageId}}',
  subscriptionId: '{{subscriptionId}}',
  notificationId: '{{notificationId}}',
  alertId: '{{alertId}}',
  noteId: '{{noteId}}',
  leadId: '{{leadId}}',
  mediaAssetId: '{{mediaAssetId}}',
};

const FOLDER_ORDER = [
  'Health',
  'Auth',
  'Users',
  'Properties',
  'Catalogs',
  'Locations',
  'Compounds',
  'Developers',
  'Plans',
  'Subscriptions',
  'Payments',
  'Leads',
  'Favorites',
  'Notes',
  'Notifications',
  'Alerts',
  'Media',
  'Admin',
];

const NESTED_ORDER = {
  Properties: [
    'Draft Creation',
    'Basic Info',
    'Location',
    'Details',
    'Features',
    'Media',
    'Submit',
    'Public Search',
  ],
  Admin: ['Dashboard', 'Properties', 'Users', 'Plans', 'Developers', 'Compounds'],
};

function walkFiles(dir, acc = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      walkFiles(full, acc);
    } else {
      acc.push(full);
    }
  }
  return acc;
}

function joinRoute(prefix, sub) {
  const a = (prefix || '').replace(/^\/+|\/+$/g, '');
  const b = (sub || '').replace(/^\/+|\/+$/g, '');
  if (!a && !b) return '/';
  if (!a) return `/${b}`;
  if (!b) return `/${a}`;
  return `/${a}/${b}`;
}

function parseDecoratorArg(src, name) {
  const re = new RegExp(`@${name}\\((?:'([^']*)'|"([^"]*)")?\\)`);
  const m = src.match(re);
  if (!m) return undefined;
  return m[1] ?? m[2] ?? '';
}

function extractBalanced(src, openIdx) {
  let depth = 0;
  for (let i = openIdx; i < src.length; i += 1) {
    if (src[i] === '{') depth += 1;
    if (src[i] === '}') {
      depth -= 1;
      if (depth === 0) return src.slice(openIdx, i + 1);
    }
  }
  return src.slice(openIdx);
}

function parseExampleValue(raw) {
  const v = raw.trim().replace(/,$/, '');
  if (v === 'true') return true;
  if (v === 'false') return false;
  if (v === 'null') return null;
  if (/^-?\d+(\.\d+)?$/.test(v)) return Number(v);
  if ((v.startsWith("'") && v.endsWith("'")) || (v.startsWith('"') && v.endsWith('"'))) {
    return v.slice(1, -1);
  }
  if (v.startsWith('[')) {
    try {
      return JSON.parse(v.replace(/'/g, '"'));
    } catch {
      return [];
    }
  }
  if (v.startsWith('{')) {
    try {
      return Function(`"use strict"; return (${v})`)();
    } catch {
      return {};
    }
  }
  if (v.includes('.')) return v.split('.').pop();
  return v;
}

function parseApiPropertyExample(decoratorSrc) {
  const idx = decoratorSrc.search(/example\s*:/);
  if (idx < 0) return undefined;
  const after = decoratorSrc.slice(idx).replace(/^example\s*:\s*/, '');
  if (after.startsWith('{') || after.startsWith('[')) {
    const endChar = after[0] === '{' ? '}' : ']';
    let depth = 0;
    for (let i = 0; i < after.length; i += 1) {
      if (after[i] === after[0]) depth += 1;
      if (after[i] === endChar) {
        depth -= 1;
        if (depth === 0) return parseExampleValue(after.slice(0, i + 1));
      }
    }
  }
  const m = after.match(/^([^,\n}]+)/);
  return m ? parseExampleValue(m[1]) : undefined;
}

function parseDtoClasses(content) {
  const classes = {};
  const classRe = /export class (\w+)\s*\{/g;
  let match;
  while ((match = classRe.exec(content))) {
    const name = match[1];
    const bodyStart = match.index + match[0].length - 1;
    const body = extractBalanced(content, bodyStart).slice(1, -1);
    const fields = [];
    const fieldRe =
      /((?:@[A-Za-z][\s\S]*?\n\s*)+)([A-Za-z_][\w]*)\s*[?!]?\s*:\s*([^;]+);/g;
    let fm;
    while ((fm = fieldRe.exec(body))) {
      const decorators = fm[1];
      const fieldName = fm[2];
      const typeSrc = fm[3].trim();
      const apiDec = decorators.match(/@(?:ApiProperty|ApiPropertyOptional)\(([\s\S]*?)\)(?=\s*@|\s*$)/);
      const example = apiDec ? parseApiPropertyExample(apiDec[1] || '') : undefined;
      const optional = /@IsOptional\(/.test(decorators) || /ApiPropertyOptional/.test(decorators);
      fields.push({ name: fieldName, typeSrc, example, optional });
    }
    classes[name] = fields;
  }
  return classes;
}

function loadDtoCatalog() {
  const files = walkFiles(srcDir).filter(
    (f) => f.endsWith('.dto.ts') || f.endsWith('.mapper.ts'),
  );
  const catalog = {};
  for (const file of files) {
    Object.assign(catalog, parseDtoClasses(readFileSync(file, 'utf8')));
  }
  return catalog;
}

function valueForField(field, dtoCatalog, depth = 0) {
  if (FIELD_VARS[field.name]) return FIELD_VARS[field.name];
  if (field.example !== undefined) {
    if (typeof field.example === 'string' && /^(clx|cm)/i.test(field.example)) {
      return FIELD_VARS[field.name] || `{{${field.name}}}`;
    }
    if (Array.isArray(field.example) && field.example.every((v) => typeof v === 'string' && /id/i.test(v))) {
      return [];
    }
    return field.example;
  }

  const typeSrc = field.typeSrc.replace(/\s+/g, ' ');
  const nestedName = typeSrc.match(/([A-Z][A-Za-z0-9]*)(?:\[\])?/)?.[1];
  if (nestedName && dtoCatalog[nestedName] && depth < 3) {
    if (typeSrc.includes('[]')) {
      return [buildBodyFromDto(nestedName, dtoCatalog, depth + 1)];
    }
    return buildBodyFromDto(nestedName, dtoCatalog, depth + 1);
  }
  if (typeSrc.includes('[]')) return [];
  if (/boolean/.test(typeSrc)) return true;
  if (/number/.test(typeSrc)) return 0;
  if (/Record<|object/i.test(typeSrc)) return {};
  return '';
}

function buildBodyFromDto(dtoName, dtoCatalog, depth = 0) {
  const fields = dtoCatalog[dtoName];
  if (!fields) return {};
  const body = {};
  for (const field of fields) {
    body[field.name] = valueForField(field, dtoCatalog, depth);
  }
  return body;
}

function buildQueryFromDto(dtoName, dtoCatalog) {
  const fields = dtoCatalog[dtoName];
  if (!fields) return [];
  return fields.map((field) => {
    const isPaging = field.name === 'page' || field.name === 'limit';
    let value = valueForField(field, dtoCatalog);
    if (field.name === 'page') value = 1;
    if (field.name === 'limit') value = 20;
    if (typeof value === 'object') value = JSON.stringify(value);
    return {
      key: field.name,
      value: String(value ?? ''),
      disabled: !isPaging && field.optional,
      description: field.optional ? 'Optional filter' : '',
    };
  });
}

function mapPathParam(paramName, fullPath) {
  if (paramName === 'imageId') return '{{imageId}}';
  if (paramName === 'propertyId') return '{{propertyId}}';
  if (paramName === 'countryId') return '{{countryId}}';
  if (paramName === 'cityId') return '{{cityId}}';
  if (paramName === 'areaId') return '{{areaId}}';
  if (paramName === 'slug') {
    if (fullPath.startsWith('/compounds')) return '{{compoundSlug}}';
    if (fullPath.startsWith('/developers')) return '{{developerSlug}}';
    return '{{propertySlug}}';
  }
  if (paramName !== 'id') return `{{${paramName}}}`;

  if (fullPath.startsWith('/admin/users')) return '{{userId}}';
  if (fullPath.startsWith('/admin/plans')) return '{{planId}}';
  if (fullPath.startsWith('/admin/developers')) return '{{developerId}}';
  if (fullPath.startsWith('/admin/compounds')) return '{{compoundId}}';
  if (fullPath.startsWith('/admin/properties')) return '{{propertyId}}';
  if (fullPath.startsWith('/subscriptions/')) return '{{subscriptionId}}';
  if (fullPath.startsWith('/leads/')) return '{{leadId}}';
  if (fullPath.startsWith('/notes/')) return '{{noteId}}';
  if (fullPath.startsWith('/alerts/')) return '{{alertId}}';
  if (fullPath.startsWith('/notifications/')) return '{{notificationId}}';
  if (fullPath.startsWith('/media/')) return '{{mediaAssetId}}';
  if (fullPath.includes('/properties')) return '{{propertyId}}';
  return '{{id}}';
}

function applyPathParams(path) {
  return path.replace(/:([A-Za-z_][\w]*)/g, (_, name) => mapPathParam(name, path));
}

function folderFor(method, path) {
  if (path.startsWith('/health')) return ['Health'];
  if (path.startsWith('/auth')) return ['Auth'];
  if (path.startsWith('/users')) return ['Users'];
  if (path.startsWith('/catalogs')) return ['Catalogs'];
  if (path === '/features') return ['Catalogs'];
  if (path.startsWith('/locations')) return ['Locations'];
  if (path.startsWith('/admin/dashboard')) return ['Admin', 'Dashboard'];
  if (path.startsWith('/admin/properties')) return ['Admin', 'Properties'];
  if (path.startsWith('/admin/users')) return ['Admin', 'Users'];
  if (path.startsWith('/admin/plans')) return ['Admin', 'Plans'];
  if (path.startsWith('/admin/developers')) return ['Admin', 'Developers'];
  if (path.startsWith('/admin/compounds')) return ['Admin', 'Compounds'];
  if (path.startsWith('/admin')) return ['Admin'];
  if (path.startsWith('/compounds')) return ['Compounds'];
  if (path.startsWith('/developers')) return ['Developers'];
  if (path.startsWith('/plans')) return ['Plans'];
  if (path.startsWith('/subscriptions')) return ['Payments'];
  if (path.includes('/subscription')) return ['Subscriptions'];
  if (path.includes('/leads')) return ['Leads'];
  if (path.startsWith('/favorites')) return ['Favorites'];
  if (path.includes('/notes')) return ['Notes'];
  if (path.startsWith('/notifications')) return ['Notifications'];
  if (path.startsWith('/alerts')) return ['Alerts'];
  if (path.startsWith('/media')) return ['Media'];
  if (path.includes('/media')) return ['Properties', 'Media'];
  if (path.endsWith('/basic')) return ['Properties', 'Basic Info'];
  if (path.endsWith('/location')) return ['Properties', 'Location'];
  if (path.endsWith('/details')) return ['Properties', 'Details'];
  if (path.includes('/features')) return ['Properties', 'Features'];
  if (path.endsWith('/completion') || path.endsWith('/submit')) return ['Properties', 'Submit'];
  if (method === 'GET' && (path === '/properties' || path === '/properties/:slug')) {
    return ['Properties', 'Public Search'];
  }
  if (path.startsWith('/properties')) return ['Properties', 'Draft Creation'];
  return ['Other'];
}

function saveIdScript(varName, extra = '') {
  return `
${successTest}
pm.test("${varName} saved", function () {
  const data = pm.response.json().data;
  if (data?.id) pm.environment.set("${varName}", data.id);
  ${extra}
});
`.trim();
}

function saveFirstArrayScript(varName) {
  return `
${successTest}
pm.test("${varName} saved from first item", function () {
  const data = pm.response.json().data;
  if (Array.isArray(data) && data[0]?.id) pm.environment.set("${varName}", data[0].id);
});
`.trim();
}

function testsFor(method, path) {
  if (path === '/health') return healthTest;
  if (method === 'POST' && path === '/auth/register') return registerTest;
  if (method === 'POST' && (path === '/auth/login' || path === '/auth/refresh')) return loginTest;
  if (method === 'POST' && path === '/properties/drafts') {
    return saveIdScript(
      'propertyId',
      'if (data?.slug) pm.environment.set("propertySlug", data.slug);',
    );
  }
  if (method === 'GET' && path === '/properties/me/:id') {
    return `
${successTest}
if (pm.response.json().data?.slug) pm.environment.set("propertySlug", pm.response.json().data.slug);
`.trim();
  }
  if (method === 'POST' && path === '/properties/me/:id/media') return saveIdScript('imageId');
  if (method === 'POST' && path === '/properties/me/:id/subscription') {
    return saveIdScript('subscriptionId');
  }
  if (method === 'POST' && path === '/subscriptions/:id/pay') return saveIdScript('paymentId');
  if (method === 'POST' && path === '/properties/:id/leads') return saveIdScript('leadId');
  if (method === 'POST' && path === '/properties/:id/notes') return saveIdScript('noteId');
  if (method === 'POST' && path === '/alerts') return saveIdScript('alertId');
  if (method === 'POST' && path === '/media/upload') return saveIdScript('mediaAssetId');
  if (method === 'GET' && path === '/plans') return saveFirstArrayScript('planId');
  if (method === 'GET' && path === '/catalogs/property-types') {
    return saveFirstArrayScript('propertyTypeId');
  }
  if (method === 'GET' && path === '/catalogs/transaction-types') {
    return saveFirstArrayScript('transactionTypeId');
  }
  if (method === 'GET' && path === '/locations/countries') return saveFirstArrayScript('countryId');
  return successTest;
}

function parseControllers(dtoCatalog) {
  const files = walkFiles(srcDir).filter((f) => f.endsWith('.controller.ts'));
  const endpoints = [];

  for (const file of files) {
    const content = readFileSync(file, 'utf8');
    const classIdx = content.search(/export class \w+/);
    if (classIdx < 0) continue;
    const header = content.slice(0, classIdx);
    const prefix = parseDecoratorArg(header, 'Controller') ?? '';
    const classPublic = /@Public\(/.test(header);
    const classAdmin = /@Roles\(/.test(header) || /@Controller\('admin/.test(header);

    const methodRe = /@(Get|Post|Put|Patch|Delete)\((?:'([^']*)'|"([^"]*)")?\)/g;
    const matches = [...content.matchAll(methodRe)];
    for (let i = 0; i < matches.length; i += 1) {
      const m = matches[i];
      const start = m.index;
      const end = i + 1 < matches.length ? matches[i + 1].index : content.length;
      const preambleStart = i === 0 ? classIdx : matches[i - 1].index;
      const preamble = content.slice(preambleStart, start);
      const block = content.slice(start, end);
      const method = m[1].toUpperCase();
      const sub = m[2] ?? m[3] ?? '';
      const path = joinRoute(prefix, sub);
      const isPublic = classPublic || /@Public\(/.test(preamble);
      const isAdmin =
        classAdmin || /@Roles\(/.test(preamble) || /@Roles\(/.test(block) || path.startsWith('/admin');
      const multipart = /multipart\/form-data/.test(block) || /FileInterceptor\(/.test(block);
      const fileField = block.match(/FileInterceptor\(\s*'([^']+)'/)?.[1] || 'file';
      const bodyDto = block.match(/@Body\(\)\s+\w+:\s*(\w+)/)?.[1];
      const queryDto = block.match(/@Query\(\)\s+\w+:\s*(\w+)/)?.[1];
      const summary =
        block.match(/@ApiOperation\(\s*\{\s*summary:\s*'([^']+)'/)?.[1] ||
        `${method} ${path}`;

      endpoints.push({
        file,
        method,
        path,
        summary,
        isPublic,
        isAdmin,
        multipart,
        fileField,
        bodyDto,
        queryDto,
        body: bodyDto ? buildBodyFromDto(bodyDto, dtoCatalog) : undefined,
        query: queryDto ? buildQueryFromDto(queryDto, dtoCatalog) : [],
      });
    }
  }

  return endpoints;
}

function toPostmanUrl(endpoint) {
  const variablePath = applyPathParams(endpoint.path);
  const isHealth = endpoint.path === '/health';
  const hostVar = isHealth ? '{{serverUrl}}' : '{{baseUrl}}';
  const enabledQuery = (endpoint.query || []).filter((q) => !q.disabled);
  const queryString =
    enabledQuery.length > 0
      ? `?${enabledQuery.map((q) => `${q.key}=${encodeURIComponent(q.value)}`).join('&')}`
      : '';
  const raw = `${hostVar}${variablePath}${queryString}`;
  const pathSegments = variablePath.split('/').filter(Boolean);

  return {
    raw,
    host: [hostVar],
    path: pathSegments,
    ...(endpoint.query?.length ? { query: endpoint.query } : {}),
  };
}

function toPostmanItem(endpoint) {
  const item = {
    name: endpoint.summary,
    request: {
      method: endpoint.method,
      header: [],
      url: toPostmanUrl(endpoint),
      description: `${endpoint.method} ${endpoint.path}`,
    },
  };

  if (endpoint.isPublic) {
    item.request.auth = { type: 'noauth' };
  } else if (endpoint.isAdmin) {
    item.request.auth = {
      type: 'bearer',
      bearer: [{ key: 'token', value: '{{adminAccessToken}}', type: 'string' }],
    };
  } else {
    item.request.auth = {
      type: 'bearer',
      bearer: [{ key: 'token', value: '{{accessToken}}', type: 'string' }],
    };
  }

  if (endpoint.multipart) {
    const formdata = [
      {
        key: endpoint.fileField,
        type: 'file',
        src: [],
        description: 'Select a local file (images, max 5MB)',
      },
    ];
    if (endpoint.body && typeof endpoint.body === 'object') {
      for (const [key, value] of Object.entries(endpoint.body)) {
        if (key === endpoint.fileField) continue;
        formdata.push({ key, type: 'text', value: String(value ?? '') });
      }
    }
    item.request.body = { mode: 'formdata', formdata };
  } else if (endpoint.body && Object.keys(endpoint.body).length > 0) {
    item.request.header.push({ key: 'Content-Type', value: 'application/json' });
    item.request.body = {
      mode: 'raw',
      raw: JSON.stringify(endpoint.body, null, 2),
    };
  } else if (['POST', 'PATCH', 'PUT'].includes(endpoint.method) && endpoint.bodyDto) {
    item.request.header.push({ key: 'Content-Type', value: 'application/json' });
    item.request.body = { mode: 'raw', raw: '{}' };
  }

  const test = testsFor(endpoint.method, endpoint.path);
  item.event = [{ listen: 'test', script: { type: 'text/javascript', exec: test.split('\n') } }];
  return item;
}

function addToTree(tree, folders, item) {
  let node = tree;
  for (const name of folders) {
    if (!node.children[name]) {
      node.children[name] = { name, items: [], children: {} };
    }
    node = node.children[name];
  }
  node.items.push(item);
}

function serializeTree(node, order) {
  const names = Object.keys(node.children);
  names.sort((a, b) => {
    const ia = order.indexOf(a);
    const ib = order.indexOf(b);
    if (ia === -1 && ib === -1) return a.localeCompare(b);
    if (ia === -1) return 1;
    if (ib === -1) return -1;
    return ia - ib;
  });
  return names.map((name) => {
    const child = node.children[name];
    const nestedOrder = NESTED_ORDER[name] || [];
    const nested = serializeTree(child, nestedOrder);
    return { name, item: [...nested, ...child.items] };
  });
}

function collectRequestPaths(items, acc = []) {
  for (const item of items) {
    if (item.item) collectRequestPaths(item.item, acc);
    else if (item.request) {
      acc.push(`${item.request.method} ${item.request.description.split(' ').slice(1).join(' ')}`);
    }
  }
  return acc;
}

const dtoCatalog = loadDtoCatalog();
const endpoints = parseControllers(dtoCatalog);

if (endpoints.length === 0) {
  throw new Error('No controller endpoints found — check apps/api/src path');
}

const tree = { name: 'root', items: [], children: {} };
endpoints.forEach((endpoint, index) => {
  endpoint._index = index;
});
const ranked = [...endpoints].sort((a, b) => {
  const fa = folderFor(a.method, a.path);
  const fb = folderFor(b.method, b.path);
  const ia = FOLDER_ORDER.indexOf(fa[0]);
  const ib = FOLDER_ORDER.indexOf(fb[0]);
  if (ia !== ib) return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib);
  const nested = NESTED_ORDER[fa[0]] || [];
  const nia = nested.indexOf(fa[1] || '');
  const nib = nested.indexOf(fb[1] || '');
  if ((fa[1] || '') !== (fb[1] || '')) {
    if (nia !== nib) return (nia < 0 ? 99 : nia) - (nib < 0 ? 99 : nib);
    return (fa[1] || '').localeCompare(fb[1] || '');
  }
  return a._index - b._index;
});
for (const endpoint of ranked) {
  addToTree(tree, folderFor(endpoint.method, endpoint.path), toPostmanItem(endpoint));
}

const collection = {
  info: {
    name: 'Real Estate Platform API',
    description:
      'Auto-generated from NestJS controllers in apps/api/src. Import the environment file, set tokens after login, and use variables instead of hardcoded IDs. Health is served at {{serverUrl}}/health (excluded from the API prefix). All other routes use {{baseUrl}}.',
    schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json',
  },
  auth: {
    type: 'bearer',
    bearer: [{ key: 'token', value: '{{accessToken}}', type: 'string' }],
  },
  variable: [
    { key: 'baseUrl', value: 'http://localhost:4000/api/v1' },
    { key: 'serverUrl', value: 'http://localhost:4000' },
  ],
  item: serializeTree(tree, FOLDER_ORDER),
};

const environment = {
  id: 'real-estate-platform-env',
  name: 'Real Estate Platform - Local',
  values: [
    { key: 'serverUrl', value: 'http://localhost:4000', enabled: true },
    { key: 'baseUrl', value: 'http://localhost:4000/api/v1', enabled: true },
    { key: 'accessToken', value: '', enabled: true },
    { key: 'refreshToken', value: '', enabled: true },
    { key: 'adminAccessToken', value: '', enabled: true },
    { key: 'verificationToken', value: '', enabled: true },
    { key: 'passwordResetToken', value: '', enabled: true },
    { key: 'userId', value: '', enabled: true },
    { key: 'propertyId', value: '', enabled: true },
    { key: 'imageId', value: '', enabled: true },
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
    { key: 'districtId', value: '', enabled: true },
    { key: 'propertyTypeId', value: '', enabled: true },
    { key: 'transactionTypeId', value: '', enabled: true },
  ],
  _postman_variable_scope: 'environment',
};

mkdirSync(__dirname, { recursive: true });
const collectionPath = join(__dirname, 'real-estate-platform.postman_collection.json');
const envPath = join(__dirname, 'real-estate-platform.postman_environment.json');
writeFileSync(collectionPath, JSON.stringify(collection, null, 2));
writeFileSync(envPath, JSON.stringify(environment, null, 2));

const generatedKeys = collectRequestPaths(collection.item);
const sourceKeys = endpoints.map((e) => `${e.method} ${e.path}`);
const missing = sourceKeys.filter((k) => !generatedKeys.includes(k));
const extra = generatedKeys.filter((k) => !sourceKeys.includes(k));
const mediaRequired = [
  'POST /properties/me/:id/media',
  'GET /properties/me/:id/media',
  'PATCH /properties/me/:id/media/reorder',
  'PATCH /properties/me/:id/media/:imageId/primary',
  'DELETE /properties/me/:id/media/:imageId',
];
const missingMedia = mediaRequired.filter((k) => !sourceKeys.includes(k));
const multipartCount = endpoints.filter((e) => e.multipart).length;
const publicCount = endpoints.filter((e) => e.isPublic).length;

if (missing.length || extra.length || missingMedia.length) {
  console.error({ missing, extra, missingMedia });
  throw new Error('Generated collection does not match controller inventory');
}

const hardcodedIds = JSON.stringify(collection).match(/cm[a-z0-9]{20,}/gi) || [];
if (hardcodedIds.length) {
  throw new Error(`Hardcoded IDs found: ${hardcodedIds.join(', ')}`);
}

console.log(`Generated Postman collection: ${endpoints.length} endpoints from ${walkFiles(srcDir).filter((f) => f.endsWith('.controller.ts')).length} controllers`);
console.log(`Public: ${publicCount}  Authenticated: ${endpoints.length - publicCount}  Multipart: ${multipartCount}`);
console.log(`Wrote ${collectionPath}`);
console.log(`Wrote ${envPath}`);
