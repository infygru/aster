#!/usr/bin/env node
/**
 * Add fields and seed data to existing Directus 11 collections.
 * Uses static token (set in previous step).
 */

const BASE_URL = 'https://api.asterhomecare.co.uk';
const TOKEN = 'aster-nextjs-prod-token-2024';

async function request(path, method = 'GET', body = null) {
  const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${TOKEN}` };
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

async function createField(collection, fieldDef) {
  // Check if field exists
  const existing = await request(`/fields/${collection}/${fieldDef.field}`);
  if (existing.ok) {
    console.log(`  - Field "${fieldDef.field}" already exists, skipping`);
    return;
  }
  const res = await request(`/fields/${collection}`, 'POST', fieldDef);
  if (!res.ok) {
    console.error(`  ✗ Field "${fieldDef.field}" failed: ${JSON.stringify(res.data).substring(0, 200)}`);
  } else {
    console.log(`  ✓ Field "${fieldDef.field}" created`);
  }
}

async function seedItems(collection, items) {
  console.log(`\n🌱 Seeding ${items.length} item(s) into "${collection}"...`);
  for (const item of items) {
    const res = await request(`/items/${collection}`, 'POST', item);
    if (!res.ok) {
      const msg = JSON.stringify(res.data);
      if (msg.includes('unique') || msg.includes('duplicate') || msg.includes('already')) {
        console.log(`  ⚠ Skipped (duplicate): ${item.title || item.author_name || item.name}`);
      } else {
        console.error(`  ✗ Failed: ${msg.substring(0, 300)}`);
      }
    } else {
      console.log(`  ✓ Created: ${item.title || item.author_name || item.name}`);
    }
  }
}

async function setupPolicies() {
  console.log('\n🌐 Setting up public read access policy...');

  // In Directus 11, access control is via policies
  // List all policies
  const policiesRes = await request('/policies');
  if (!policiesRes.ok) {
    console.log('  ⚠ Could not list policies:', JSON.stringify(policiesRes.data).substring(0, 100));
    return;
  }

  // Find or use Public policy
  const policies = policiesRes.data?.data || [];
  console.log('  Found policies:', policies.map(p => `${p.name} (${p.id})`).join(', '));

  const publicPolicy = policies.find(p => p.name === 'Public' || p.name === '$public');
  if (!publicPolicy) {
    console.log('  ⚠ No Public policy found');
    return;
  }

  const collections = ['services', 'testimonials', 'job_openings', 'team'];
  for (const col of collections) {
    const res = await request('/permissions', 'POST', {
      policy: publicPolicy.id,
      collection: col,
      action: 'read',
      fields: ['*'],
      permissions: {},
      validation: {},
    });
    if (res.ok) {
      console.log(`  ✓ Public read on "${col}"`);
    } else {
      const msg = JSON.stringify(res.data);
      if (msg.includes('unique') || msg.includes('already')) {
        console.log(`  ⚠ Permission already exists for "${col}"`);
      } else {
        console.log(`  ⚠ Skipped "${col}": ${msg.substring(0, 150)}`);
      }
    }
  }
}

async function main() {
  console.log('🔌 Connecting to', BASE_URL, '...\n');

  // Verify token works
  const me = await request('/users/me');
  if (!me.ok) {
    console.error('❌ Token invalid:', JSON.stringify(me.data));
    process.exit(1);
  }
  console.log('✓ Authenticated as:', me.data?.data?.email);

  // ── SERVICES FIELDS ───────────────────────────────────────────────────────
  console.log('\n📋 Adding fields to "services"...');
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
  for (const f of serviceFields) await createField('services', f);

  // ── TESTIMONIALS FIELDS ───────────────────────────────────────────────────
  console.log('\n📋 Adding fields to "testimonials"...');
  const testimonialFields = [
    { field: 'status', type: 'string', schema: { data_type: 'character varying', default_value: 'draft', is_nullable: false }, meta: { interface: 'select-dropdown', display: 'labels', display_options: { choices: [{ text: 'Published', value: 'published', foreground: '#FFFFFF', background: '#2A9D8F' }, { text: 'Draft', value: 'draft', foreground: '#FFFFFF', background: '#8B9EB7' }] }, options: { choices: [{ text: 'Published', value: 'published' }, { text: 'Draft', value: 'draft' }] }, width: 'half', sort: 2 } },
    { field: 'sort', type: 'integer', schema: { data_type: 'integer', is_nullable: true }, meta: { interface: 'input', hidden: true, sort: 3 } },
    { field: 'quote', type: 'text', schema: { data_type: 'text', is_nullable: false }, meta: { interface: 'input-multiline', required: true, width: 'full', sort: 4 } },
    { field: 'author_name', type: 'string', schema: { data_type: 'character varying', is_nullable: false }, meta: { interface: 'input', required: true, width: 'half', sort: 5 } },
    { field: 'author_relation', type: 'string', schema: { data_type: 'character varying', is_nullable: false }, meta: { interface: 'input', required: true, note: 'e.g. Daughter of client, Care recipient, Son of client', width: 'half', sort: 6 } },
    { field: 'author_location', type: 'string', schema: { data_type: 'character varying', is_nullable: true }, meta: { interface: 'input', note: 'e.g. Slough, Windsor, Berkshire', width: 'half', sort: 7 } },
    { field: 'rating', type: 'integer', schema: { data_type: 'integer', default_value: 5, is_nullable: true }, meta: { interface: 'slider', options: { min: 1, max: 5, step: 1 }, width: 'half', sort: 8 } },
  ];
  for (const f of testimonialFields) await createField('testimonials', f);

  // ── JOB_OPENINGS FIELDS ───────────────────────────────────────────────────
  console.log('\n📋 Adding fields to "job_openings"...');
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
  for (const f of jobFields) await createField('job_openings', f);

  // ── TEAM FIELDS ───────────────────────────────────────────────────────────
  console.log('\n📋 Adding fields to "team"...');
  const teamFields = [
    { field: 'status', type: 'string', schema: { data_type: 'character varying', default_value: 'draft', is_nullable: false }, meta: { interface: 'select-dropdown', display: 'labels', display_options: { choices: [{ text: 'Published', value: 'published', foreground: '#FFFFFF', background: '#2A9D8F' }, { text: 'Draft', value: 'draft', foreground: '#FFFFFF', background: '#8B9EB7' }] }, options: { choices: [{ text: 'Published', value: 'published' }, { text: 'Draft', value: 'draft' }] }, width: 'half', sort: 2 } },
    { field: 'name', type: 'string', schema: { data_type: 'character varying', is_nullable: false }, meta: { interface: 'input', required: true, width: 'half', sort: 3 } },
    { field: 'role', type: 'string', schema: { data_type: 'character varying', is_nullable: false }, meta: { interface: 'input', required: true, width: 'half', sort: 4 } },
    { field: 'bio', type: 'text', schema: { data_type: 'text', is_nullable: true }, meta: { interface: 'input-multiline', width: 'full', sort: 5 } },
    { field: 'photo', type: 'uuid', schema: { data_type: 'uuid', is_nullable: true, foreign_key_table: 'directus_files', foreign_key_column: 'id' }, meta: { interface: 'file-image', special: ['file'], width: 'half', sort: 6 } },
    { field: 'nominated_individual', type: 'boolean', schema: { data_type: 'boolean', default_value: false, is_nullable: false }, meta: { interface: 'boolean', note: 'Mark if this person is the CQC Nominated Individual', width: 'half', sort: 7 } },
  ];
  for (const f of teamFields) await createField('team', f);

  // ── SEED DATA ─────────────────────────────────────────────────────────────
  const seedData = require('./seed-data.json');
  await seedItems('services', seedData.services);
  await seedItems('testimonials', seedData.testimonials);
  await seedItems('job_openings', seedData.job_openings);
  await seedItems('team', seedData.team);

  // ── PUBLIC PERMISSIONS ────────────────────────────────────────────────────
  await setupPolicies();

  console.log('\n✅ All done!');
}

main().catch(err => {
  console.error('\n❌ Error:', err.message || err);
  process.exit(1);
});
