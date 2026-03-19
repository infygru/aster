#!/usr/bin/env node
/**
 * Create Directus 11 collections with all fields embedded in the creation request.
 * Uses fresh JWT per batch to avoid token expiry.
 */

const BASE_URL = 'https://api.asterhomecare.co.uk';
const EMAIL = 'admin@infygru.com';
const PASSWORD = 'Admin@123!';
const STATIC_TOKEN = 'aster-nextjs-prod-token-2024';

async function getToken() {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
  });
  const data = await res.json();
  return data.data.access_token;
}

async function request(path, method = 'GET', body = null, token) {
  const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` };
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  try { return { ok: res.ok, status: res.status, data: JSON.parse(text) }; }
  catch { return { ok: res.ok, status: res.status, data: text }; }
}

// Collection definitions with fields embedded
const COLLECTIONS = [
  {
    collection: 'services',
    meta: {
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
    },
    schema: {},
    fields: [
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
    ],
  },
  {
    collection: 'testimonials',
    meta: {
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
    },
    schema: {},
    fields: [
      { field: 'status', type: 'string', schema: { data_type: 'character varying', default_value: 'draft', is_nullable: false }, meta: { interface: 'select-dropdown', display: 'labels', display_options: { choices: [{ text: 'Published', value: 'published', foreground: '#FFFFFF', background: '#2A9D8F' }, { text: 'Draft', value: 'draft', foreground: '#FFFFFF', background: '#8B9EB7' }] }, options: { choices: [{ text: 'Published', value: 'published' }, { text: 'Draft', value: 'draft' }] }, width: 'half', sort: 2 } },
      { field: 'sort', type: 'integer', schema: { data_type: 'integer', is_nullable: true }, meta: { interface: 'input', hidden: true, sort: 3 } },
      { field: 'quote', type: 'text', schema: { data_type: 'text', is_nullable: false }, meta: { interface: 'input-multiline', required: true, width: 'full', sort: 4 } },
      { field: 'author_name', type: 'string', schema: { data_type: 'character varying', is_nullable: false }, meta: { interface: 'input', required: true, width: 'half', sort: 5 } },
      { field: 'author_relation', type: 'string', schema: { data_type: 'character varying', is_nullable: false }, meta: { interface: 'input', required: true, note: 'e.g. Daughter of client, Care recipient, Son of client', width: 'half', sort: 6 } },
      { field: 'author_location', type: 'string', schema: { data_type: 'character varying', is_nullable: true }, meta: { interface: 'input', note: 'e.g. Slough, Windsor, Berkshire', width: 'half', sort: 7 } },
      { field: 'rating', type: 'integer', schema: { data_type: 'integer', default_value: 5, is_nullable: true }, meta: { interface: 'slider', options: { min: 1, max: 5, step: 1 }, width: 'half', sort: 8 } },
    ],
  },
  {
    collection: 'job_openings',
    meta: {
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
    },
    schema: {},
    fields: [
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
    ],
  },
  {
    collection: 'team',
    meta: {
      icon: 'people',
      note: 'Team members displayed on the About page',
      display_template: '{{name}} — {{role}}',
      hidden: false,
      singleton: false,
      accountability: 'all',
      color: '#2B5188',
      sort: 4,
      collapse: 'open',
    },
    schema: {},
    fields: [
      { field: 'status', type: 'string', schema: { data_type: 'character varying', default_value: 'draft', is_nullable: false }, meta: { interface: 'select-dropdown', display: 'labels', display_options: { choices: [{ text: 'Published', value: 'published', foreground: '#FFFFFF', background: '#2A9D8F' }, { text: 'Draft', value: 'draft', foreground: '#FFFFFF', background: '#8B9EB7' }] }, options: { choices: [{ text: 'Published', value: 'published' }, { text: 'Draft', value: 'draft' }] }, width: 'half', sort: 2 } },
      { field: 'name', type: 'string', schema: { data_type: 'character varying', is_nullable: false }, meta: { interface: 'input', required: true, width: 'half', sort: 3 } },
      { field: 'role', type: 'string', schema: { data_type: 'character varying', is_nullable: false }, meta: { interface: 'input', required: true, width: 'half', sort: 4 } },
      { field: 'bio', type: 'text', schema: { data_type: 'text', is_nullable: true }, meta: { interface: 'input-multiline', width: 'full', sort: 5 } },
      { field: 'photo', type: 'uuid', schema: { data_type: 'uuid', is_nullable: true, foreign_key_table: 'directus_files', foreign_key_column: 'id' }, meta: { interface: 'file-image', special: ['file'], width: 'half', sort: 6 } },
      { field: 'nominated_individual', type: 'boolean', schema: { data_type: 'boolean', default_value: false, is_nullable: false }, meta: { interface: 'boolean', note: 'Mark if this person is the CQC Nominated Individual', width: 'half', sort: 7 } },
    ],
  },
];

async function seedItems(token, collection, items) {
  console.log(`\n🌱 Seeding "${collection}" (${items.length} items)...`);
  for (const item of items) {
    const res = await request(`/items/${collection}`, 'POST', item, token);
    const label = item.title || item.author_name || item.name || item.slug;
    if (!res.ok) {
      const msg = JSON.stringify(res.data);
      if (msg.includes('unique') || msg.includes('duplicate') || msg.includes('already')) {
        console.log(`  ⚠ Duplicate skipped: ${label}`);
      } else {
        console.error(`  ✗ Failed (${label}): ${msg.substring(0, 250)}`);
      }
    } else {
      console.log(`  ✓ ${label}`);
    }
  }
}

async function setupPublicPermissions(token) {
  console.log('\n🌐 Setting public read permissions...');
  // Find $t:public_label policy
  const policiesRes = await request('/policies?limit=50', 'GET', null, token);
  const policies = policiesRes.data?.data || [];
  const publicPolicy = policies.find(p => p.name === '$t:public_label' || p.name === 'Public');
  if (!publicPolicy) {
    console.log('  ⚠ No public policy found, skipping');
    return;
  }
  console.log(`  Using policy: "${publicPolicy.name}" (${publicPolicy.id})`);

  const cols = ['services', 'testimonials', 'job_openings', 'team'];
  for (const col of cols) {
    const res = await request('/permissions', 'POST', {
      policy: publicPolicy.id,
      collection: col,
      action: 'read',
      fields: ['*'],
      permissions: {},
      validation: {},
    }, token);
    if (res.ok) {
      console.log(`  ✓ Public read: "${col}"`);
    } else {
      const msg = JSON.stringify(res.data);
      console.log(`  ⚠ "${col}": ${msg.substring(0, 120)}`);
    }
  }
}

async function main() {
  console.log('🔐 Authenticating...');
  const token = await getToken();
  console.log('✓ Got fresh JWT\n');

  for (const colDef of COLLECTIONS) {
    console.log(`\n📦 Creating "${colDef.collection}" with ${colDef.fields.length} fields...`);
    const res = await request('/collections', 'POST', colDef, token);
    if (!res.ok) {
      const msg = JSON.stringify(res.data);
      if (msg.includes('already')) {
        console.log(`  ⚠ Already exists: ${colDef.collection}`);
      } else {
        console.error(`  ✗ Failed: ${msg.substring(0, 300)}`);
      }
    } else {
      const fields = res.data?.data?.fields || [];
      console.log(`  ✓ Created with ${fields.length} fields (+ id auto-field)`);
    }
  }

  // Re-authenticate to get a fresh token for seeding
  console.log('\n🔐 Re-authenticating for seeding...');
  const token2 = await getToken();

  const seedData = require('./seed-data.json');
  await seedItems(token2, 'services', seedData.services);
  await seedItems(token2, 'testimonials', seedData.testimonials);
  await seedItems(token2, 'job_openings', seedData.job_openings);
  await seedItems(token2, 'team', seedData.team);

  // Re-authenticate for permissions
  console.log('\n🔐 Re-authenticating for permissions...');
  const token3 = await getToken();
  await setupPublicPermissions(token3);

  console.log('\n✅ Setup complete!');
  console.log('\n📝 Update your .env.local:');
  console.log('   NEXT_PUBLIC_DIRECTUS_URL=https://api.asterhomecare.co.uk');
  console.log(`   DIRECTUS_TOKEN=${STATIC_TOKEN}`);
}

main().catch(err => {
  console.error('\n❌ Fatal error:', err.message || err);
  process.exit(1);
});
