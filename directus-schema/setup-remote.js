#!/usr/bin/env node
/**
 * Setup Directus 11 remote instance with collections, fields, and seed data.
 * Usage: node directus-schema/setup-remote.js
 */

const BASE_URL = 'https://api.asterhomecare.co.uk';
const EMAIL = 'admin@infygru.com';
const PASSWORD = 'Admin@123!';
const STATIC_TOKEN_KEY = 'aster-nextjs-token';

async function request(path, method = 'GET', body = null, token = null) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  try {
    return { ok: res.ok, status: res.status, data: JSON.parse(text) };
  } catch {
    return { ok: res.ok, status: res.status, data: text };
  }
}

async function login() {
  console.log('🔐 Logging in...');
  const res = await request('/auth/login', 'POST', { email: EMAIL, password: PASSWORD });
  if (!res.ok) throw new Error('Login failed: ' + JSON.stringify(res.data));
  return res.data.data.access_token;
}

async function createCollection(token, collection, meta, fields) {
  console.log(`\n📦 Creating collection: ${collection}`);
  const res = await request('/collections', 'POST', { collection, meta, fields }, token);
  if (!res.ok && !JSON.stringify(res.data).includes('already')) {
    console.error(`  ✗ Failed: ${JSON.stringify(res.data).substring(0, 200)}`);
  } else {
    console.log(`  ✓ Collection "${collection}" ready`);
  }
  return res;
}

async function createField(token, collection, fieldDef) {
  const res = await request(`/fields/${collection}`, 'POST', fieldDef, token);
  if (!res.ok && !JSON.stringify(res.data).includes('already')) {
    console.error(`  ✗ Field "${fieldDef.field}" failed: ${JSON.stringify(res.data).substring(0, 200)}`);
  } else {
    console.log(`  ✓ Field "${fieldDef.field}" ready`);
  }
}

async function seedItems(token, collection, items) {
  console.log(`\n🌱 Seeding ${items.length} item(s) into "${collection}"...`);
  for (const item of items) {
    const res = await request(`/items/${collection}`, 'POST', item, token);
    if (!res.ok) {
      const msg = JSON.stringify(res.data);
      if (msg.includes('unique') || msg.includes('duplicate') || msg.includes('already')) {
        console.log(`  ⚠ Skipped (already exists): ${item.title || item.author_name || item.name || item.slug}`);
      } else {
        console.error(`  ✗ Failed: ${msg.substring(0, 200)}`);
      }
    } else {
      console.log(`  ✓ Created: ${item.title || item.author_name || item.name || item.slug}`);
    }
  }
}

async function createStaticToken(token, userId) {
  console.log('\n🔑 Creating static token for Next.js...');
  // List existing tokens
  const existing = await request(`/users/me`, 'GET', null, token);
  const uid = existing.data?.data?.id || userId;

  const res = await request('/users/me/access-token', 'POST', {
    name: STATIC_TOKEN_KEY,
  }, token);

  if (res.ok && res.data?.data?.token) {
    return res.data.data.token;
  }

  // Fallback: set static token on the user account
  const staticToken = 'aster-nextjs-' + Math.random().toString(36).slice(2, 18);
  await request(`/users/${uid}`, 'PATCH', { token: staticToken }, token);
  return staticToken;
}

async function setupPublicReadPermissions(token) {
  console.log('\n🌐 Setting up public read permissions...');
  const collections = ['services', 'testimonials', 'job_openings', 'team'];

  // Get the public role
  const rolesRes = await request('/roles?filter[name][_eq]=Public', 'GET', null, token);
  const publicRole = rolesRes.data?.data?.[0];
  if (!publicRole) {
    console.log('  ⚠ No public role found, skipping permissions');
    return;
  }

  for (const col of collections) {
    const res = await request('/permissions', 'POST', {
      role: publicRole.id,
      collection: col,
      action: 'read',
      fields: ['*'],
      permissions: {},
      validation: {},
    }, token);
    if (res.ok) {
      console.log(`  ✓ Public read on "${col}"`);
    } else {
      const msg = JSON.stringify(res.data);
      if (msg.includes('unique') || msg.includes('already')) {
        console.log(`  ⚠ Permission already exists for "${col}"`);
      } else {
        console.log(`  ⚠ Skipped "${col}": ${msg.substring(0, 100)}`);
      }
    }
  }
}

async function main() {
  const token = await login();
  console.log('✓ Authenticated\n');

  // ── SERVICES ─────────────────────────────────────────────────────────────
  await createCollection(token, 'services', {
    icon: 'medical_services',
    note: 'Home care service offerings displayed on the website',
    display_template: '{{title}}',
    hidden: false,
    singleton: false,
    sort_field: 'sort',
    archive_field: 'status',
    archive_value: 'archived',
    unarchive_value: 'draft',
    accountability: 'all',
    color: '#2A9D8F',
    sort: 1,
    collapse: 'open',
  }, []);

  const serviceFields = [
    { field: 'status', type: 'string', schema: { data_type: 'character varying', default_value: 'draft', is_nullable: false }, meta: { interface: 'select-dropdown', display: 'labels', display_options: { choices: [{ text: 'Published', value: 'published', foreground: '#FFFFFF', background: '#2A9D8F' }, { text: 'Draft', value: 'draft', foreground: '#FFFFFF', background: '#8B9EB7' }, { text: 'Archived', value: 'archived', foreground: '#FFFFFF', background: '#6B7280' }] }, options: { choices: [{ text: 'Published', value: 'published' }, { text: 'Draft', value: 'draft' }, { text: 'Archived', value: 'archived' }] }, width: 'half', sort: 2 } },
    { field: 'sort', type: 'integer', schema: { data_type: 'integer', is_nullable: true }, meta: { interface: 'input', hidden: true, sort: 3 } },
    { field: 'title', type: 'string', schema: { data_type: 'character varying', is_nullable: false }, meta: { interface: 'input', required: true, width: 'full', sort: 4 } },
    { field: 'slug', type: 'string', schema: { data_type: 'character varying', is_nullable: false, is_unique: true }, meta: { interface: 'input', required: true, note: 'URL-friendly identifier — e.g. personal-care', width: 'half', sort: 5 } },
    { field: 'icon', type: 'string', schema: { data_type: 'character varying', default_value: 'heart', is_nullable: true }, meta: { interface: 'select-dropdown', options: { choices: [{ text: 'Heart', value: 'heart' }, { text: 'Users', value: 'users' }, { text: 'Pill', value: 'pill' }, { text: 'Home', value: 'home' }, { text: 'Clock', value: 'clock' }, { text: 'Star', value: 'star' }] }, width: 'half', sort: 6 } },
    { field: 'color', type: 'string', schema: { data_type: 'character varying', default_value: 'teal', is_nullable: true }, meta: { interface: 'select-dropdown', options: { choices: [{ text: 'Blue (Trust)', value: 'blue' }, { text: 'Teal (Healing)', value: 'teal' }, { text: 'Gold (Premium)', value: 'gold' }] }, width: 'half', sort: 7 } },
    { field: 'description', type: 'text', schema: { data_type: 'text', is_nullable: true }, meta: { interface: 'input-multiline', required: true, note: 'Short description shown on service cards (1–2 sentences)', width: 'full', sort: 8 } },
    { field: 'features', type: 'json', schema: { data_type: 'jsonb', is_nullable: true }, meta: { interface: 'tags', note: 'Bullet-point features shown on service cards', special: ['cast-json'], width: 'full', sort: 9 } },
    { field: 'long_description', type: 'text', schema: { data_type: 'text', is_nullable: true }, meta: { interface: 'input-rich-text-html', note: 'Full rich-text description for individual service pages', width: 'full', sort: 10 } },
    { field: 'image', type: 'uuid', schema: { data_type: 'uuid', is_nullable: true, foreign_key_table: 'directus_files', foreign_key_column: 'id' }, meta: { interface: 'file-image', special: ['file'], width: 'full', sort: 11 } },
  ];
  for (const f of serviceFields) await createField(token, 'services', f);

  // ── TESTIMONIALS ──────────────────────────────────────────────────────────
  await createCollection(token, 'testimonials', {
    icon: 'format_quote',
    note: 'Client and family testimonials for the website',
    display_template: '{{author_name}} — {{author_relation}}',
    hidden: false,
    singleton: false,
    sort_field: 'sort',
    archive_field: 'status',
    archive_value: 'archived',
    unarchive_value: 'draft',
    accountability: 'all',
    color: '#E9C46A',
    sort: 2,
    collapse: 'open',
  }, []);

  const testimonialFields = [
    { field: 'status', type: 'string', schema: { data_type: 'character varying', default_value: 'draft', is_nullable: false }, meta: { interface: 'select-dropdown', display: 'labels', display_options: { choices: [{ text: 'Published', value: 'published', foreground: '#FFFFFF', background: '#2A9D8F' }, { text: 'Draft', value: 'draft', foreground: '#FFFFFF', background: '#8B9EB7' }] }, options: { choices: [{ text: 'Published', value: 'published' }, { text: 'Draft', value: 'draft' }] }, width: 'half', sort: 2 } },
    { field: 'sort', type: 'integer', schema: { data_type: 'integer', is_nullable: true }, meta: { interface: 'input', hidden: true, sort: 3 } },
    { field: 'quote', type: 'text', schema: { data_type: 'text', is_nullable: false }, meta: { interface: 'input-multiline', required: true, width: 'full', sort: 4 } },
    { field: 'author_name', type: 'string', schema: { data_type: 'character varying', is_nullable: false }, meta: { interface: 'input', required: true, width: 'half', sort: 5 } },
    { field: 'author_relation', type: 'string', schema: { data_type: 'character varying', is_nullable: false }, meta: { interface: 'input', required: true, note: 'e.g. Daughter of client, Care recipient, Son of client', width: 'half', sort: 6 } },
    { field: 'author_location', type: 'string', schema: { data_type: 'character varying', is_nullable: true }, meta: { interface: 'input', note: 'e.g. Slough, Windsor, Berkshire', width: 'half', sort: 7 } },
    { field: 'rating', type: 'integer', schema: { data_type: 'integer', default_value: 5, is_nullable: true }, meta: { interface: 'slider', options: { min: 1, max: 5, step: 1 }, width: 'half', sort: 8 } },
  ];
  for (const f of testimonialFields) await createField(token, 'testimonials', f);

  // ── JOB OPENINGS ──────────────────────────────────────────────────────────
  await createCollection(token, 'job_openings', {
    icon: 'work',
    note: 'Current job vacancies listed on the Careers page',
    display_template: '{{title}} ({{type}})',
    hidden: false,
    singleton: false,
    sort_field: 'sort',
    archive_field: 'status',
    archive_value: 'archived',
    unarchive_value: 'draft',
    accountability: 'all',
    color: '#1E3A5F',
    sort: 3,
    collapse: 'open',
  }, []);

  const jobFields = [
    { field: 'status', type: 'string', schema: { data_type: 'character varying', default_value: 'draft', is_nullable: false }, meta: { interface: 'select-dropdown', display: 'labels', display_options: { choices: [{ text: 'Published', value: 'published', foreground: '#FFFFFF', background: '#2A9D8F' }, { text: 'Draft', value: 'draft', foreground: '#FFFFFF', background: '#8B9EB7' }, { text: 'Archived', value: 'archived', foreground: '#FFFFFF', background: '#6B7280' }] }, options: { choices: [{ text: 'Published', value: 'published' }, { text: 'Draft', value: 'draft' }, { text: 'Archived', value: 'archived' }] }, width: 'half', sort: 2 } },
    { field: 'sort', type: 'integer', schema: { data_type: 'integer', is_nullable: true }, meta: { interface: 'input', hidden: true, sort: 3 } },
    { field: 'title', type: 'string', schema: { data_type: 'character varying', is_nullable: false }, meta: { interface: 'input', required: true, width: 'half', sort: 4 } },
    { field: 'slug', type: 'string', schema: { data_type: 'character varying', is_nullable: false, is_unique: true }, meta: { interface: 'input', required: true, width: 'half', sort: 5 } },
    { field: 'department', type: 'string', schema: { data_type: 'character varying', is_nullable: true }, meta: { interface: 'input', width: 'half', sort: 6 } },
    { field: 'location', type: 'string', schema: { data_type: 'character varying', default_value: 'Slough, Berkshire', is_nullable: true }, meta: { interface: 'input', width: 'half', sort: 7 } },
    { field: 'type', type: 'string', schema: { data_type: 'character varying', is_nullable: true }, meta: { interface: 'select-dropdown', options: { choices: [{ text: 'Full-time', value: 'full-time' }, { text: 'Part-time', value: 'part-time' }, { text: 'Flexible', value: 'flexible' }] }, width: 'half', sort: 8 } },
    { field: 'salary_range', type: 'string', schema: { data_type: 'character varying', is_nullable: true }, meta: { interface: 'input', note: 'e.g. £11.50–£13.00/hr', width: 'half', sort: 9 } },
    { field: 'description', type: 'text', schema: { data_type: 'text', is_nullable: true }, meta: { interface: 'input-rich-text-html', required: true, width: 'full', sort: 10 } },
    { field: 'requirements', type: 'json', schema: { data_type: 'jsonb', is_nullable: true }, meta: { interface: 'tags', note: 'List of requirements / qualifications', special: ['cast-json'], width: 'full', sort: 11 } },
    { field: 'date_posted', type: 'date', schema: { data_type: 'date', is_nullable: true }, meta: { interface: 'datetime', width: 'half', sort: 12 } },
    { field: 'closing_date', type: 'date', schema: { data_type: 'date', is_nullable: true }, meta: { interface: 'datetime', width: 'half', sort: 13 } },
  ];
  for (const f of jobFields) await createField(token, 'job_openings', f);

  // ── TEAM ─────────────────────────────────────────────────────────────────
  await createCollection(token, 'team', {
    icon: 'people',
    note: 'Team members displayed on the About page',
    display_template: '{{name}} — {{role}}',
    hidden: false,
    singleton: false,
    accountability: 'all',
    color: '#2B5188',
    sort: 4,
    collapse: 'open',
  }, []);

  const teamFields = [
    { field: 'status', type: 'string', schema: { data_type: 'character varying', default_value: 'draft', is_nullable: false }, meta: { interface: 'select-dropdown', display: 'labels', display_options: { choices: [{ text: 'Published', value: 'published', foreground: '#FFFFFF', background: '#2A9D8F' }, { text: 'Draft', value: 'draft', foreground: '#FFFFFF', background: '#8B9EB7' }] }, options: { choices: [{ text: 'Published', value: 'published' }, { text: 'Draft', value: 'draft' }] }, width: 'half', sort: 2 } },
    { field: 'name', type: 'string', schema: { data_type: 'character varying', is_nullable: false }, meta: { interface: 'input', required: true, width: 'half', sort: 3 } },
    { field: 'role', type: 'string', schema: { data_type: 'character varying', is_nullable: false }, meta: { interface: 'input', required: true, width: 'half', sort: 4 } },
    { field: 'bio', type: 'text', schema: { data_type: 'text', is_nullable: true }, meta: { interface: 'input-multiline', width: 'full', sort: 5 } },
    { field: 'photo', type: 'uuid', schema: { data_type: 'uuid', is_nullable: true, foreign_key_table: 'directus_files', foreign_key_column: 'id' }, meta: { interface: 'file-image', special: ['file'], width: 'half', sort: 6 } },
    { field: 'nominated_individual', type: 'boolean', schema: { data_type: 'boolean', default_value: false, is_nullable: false }, meta: { interface: 'boolean', note: 'Mark if this person is the CQC Nominated Individual', width: 'half', sort: 7 } },
  ];
  for (const f of teamFields) await createField(token, 'team', f);

  // ── SEED DATA ─────────────────────────────────────────────────────────────
  const seedData = require('./seed-data.json');

  await seedItems(token, 'services', seedData.services);
  await seedItems(token, 'testimonials', seedData.testimonials);
  await seedItems(token, 'job_openings', seedData.job_openings);
  await seedItems(token, 'team', seedData.team);

  // ── PUBLIC READ PERMISSIONS ───────────────────────────────────────────────
  await setupPublicReadPermissions(token);

  // ── STATIC TOKEN ─────────────────────────────────────────────────────────
  console.log('\n🔑 Setting static token on admin account...');
  const staticToken = 'aster-nextjs-prod-token-2024';
  const meRes = await request('/users/me', 'GET', null, token);
  const userId = meRes.data?.data?.id;
  if (userId) {
    const patchRes = await request(`/users/${userId}`, 'PATCH', { token: staticToken }, token);
    if (patchRes.ok) {
      console.log(`  ✓ Static token set: ${staticToken}`);
    } else {
      console.log(`  ⚠ Could not set token: ${JSON.stringify(patchRes.data).substring(0, 100)}`);
    }
  }

  console.log('\n✅ Setup complete!');
  console.log('\nUpdate your .env.local with:');
  console.log('  NEXT_PUBLIC_DIRECTUS_URL=https://api.asterhomecare.co.uk');
  console.log(`  DIRECTUS_TOKEN=${staticToken}`);
}

main().catch(err => {
  console.error('\n❌ Error:', err.message || err);
  process.exit(1);
});
