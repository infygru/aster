#!/usr/bin/env node
/**
 * Create site_settings singleton collection in Directus 11
 * and seed it with default values.
 */

const BASE_URL = 'https://api.asterhomecare.co.uk';
const EMAIL = 'admin@infygru.com';
const PASSWORD = 'Admin@123!';

async function getToken() {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
  });
  const data = await res.json();
  if (!data?.data?.access_token) throw new Error('Login failed: ' + JSON.stringify(data));
  return data.data.access_token;
}

async function req(path, method = 'GET', body = null, token) {
  const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` };
  const res = await fetch(`${BASE_URL}${path}`, {
    method, headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  try { return { ok: res.ok, status: res.status, data: JSON.parse(text) }; }
  catch { return { ok: res.ok, status: res.status, data: text }; }
}

const COLLECTION = {
  collection: 'site_settings',
  meta: {
    icon: 'settings',
    note: 'Global site settings — logo, contact details, social links, hero content, SEO defaults.',
    singleton: true,
    hidden: false,
    accountability: 'all',
    color: '#1E3A5F',
    sort: 5,
    collapse: 'open',
  },
  schema: {},
  fields: [
    // ── BRANDING ────────────────────────────────────────────────────────────
    {
      field: 'site_name', type: 'string',
      schema: { data_type: 'character varying', default_value: 'Aster Homecare UK', is_nullable: true },
      meta: { interface: 'input', note: 'Site name used in browser tab and metadata', width: 'half', sort: 1,
              group: null, display: 'raw' },
    },
    {
      field: 'site_tagline', type: 'string',
      schema: { data_type: 'character varying', is_nullable: true },
      meta: { interface: 'input', note: 'Short tagline shown in header/footer', width: 'half', sort: 2 },
    },
    {
      field: 'logo', type: 'uuid',
      schema: { data_type: 'uuid', is_nullable: true, foreign_key_table: 'directus_files', foreign_key_column: 'id' },
      meta: { interface: 'file-image', special: ['file'], note: 'Primary logo (light backgrounds, recommended: SVG or PNG)', width: 'half', sort: 3 },
    },
    {
      field: 'logo_dark', type: 'uuid',
      schema: { data_type: 'uuid', is_nullable: true, foreign_key_table: 'directus_files', foreign_key_column: 'id' },
      meta: { interface: 'file-image', special: ['file'], note: 'Logo variant for dark backgrounds', width: 'half', sort: 4 },
    },
    {
      field: 'favicon', type: 'uuid',
      schema: { data_type: 'uuid', is_nullable: true, foreign_key_table: 'directus_files', foreign_key_column: 'id' },
      meta: { interface: 'file-image', special: ['file'], note: 'Browser favicon (ICO or PNG, 32×32)', width: 'half', sort: 5 },
    },

    // ── HERO ────────────────────────────────────────────────────────────────
    {
      field: 'hero_title', type: 'string',
      schema: { data_type: 'character varying', is_nullable: true },
      meta: { interface: 'input', note: 'Main headline on the homepage hero section', width: 'full', sort: 6 },
    },
    {
      field: 'hero_subtitle', type: 'text',
      schema: { data_type: 'text', is_nullable: true },
      meta: { interface: 'input-multiline', note: 'Supporting text beneath the hero headline', width: 'full', sort: 7 },
    },
    {
      field: 'hero_image', type: 'uuid',
      schema: { data_type: 'uuid', is_nullable: true, foreign_key_table: 'directus_files', foreign_key_column: 'id' },
      meta: { interface: 'file-image', special: ['file'], note: 'Hero background / feature image (1920×1080 recommended)', width: 'half', sort: 8 },
    },
    {
      field: 'hero_video_url', type: 'string',
      schema: { data_type: 'character varying', is_nullable: true },
      meta: { interface: 'input', note: 'Optional: URL to background video (MP4) or YouTube embed URL', width: 'half', sort: 9 },
    },

    // ── CONTACT ─────────────────────────────────────────────────────────────
    {
      field: 'phone', type: 'string',
      schema: { data_type: 'character varying', default_value: '01753 000000', is_nullable: true },
      meta: { interface: 'input', note: 'Main telephone number (shown in header and footer)', width: 'half', sort: 10 },
    },
    {
      field: 'phone_display', type: 'string',
      schema: { data_type: 'character varying', default_value: '01753 000000', is_nullable: true },
      meta: { interface: 'input', note: 'Formatted phone for display (e.g. 01753 000 000)', width: 'half', sort: 11 },
    },
    {
      field: 'email', type: 'string',
      schema: { data_type: 'character varying', default_value: 'info@asterhomecare.co.uk', is_nullable: true },
      meta: { interface: 'input', note: 'Primary enquiry email address', width: 'half', sort: 12 },
    },
    {
      field: 'email_careers', type: 'string',
      schema: { data_type: 'character varying', is_nullable: true },
      meta: { interface: 'input', note: 'Email for job applications (if different)', width: 'half', sort: 13 },
    },
    {
      field: 'address_line1', type: 'string',
      schema: { data_type: 'character varying', default_value: '7 Mackenzie Street', is_nullable: true },
      meta: { interface: 'input', width: 'half', sort: 14 },
    },
    {
      field: 'address_line2', type: 'string',
      schema: { data_type: 'character varying', is_nullable: true },
      meta: { interface: 'input', note: 'Address line 2 (optional)', width: 'half', sort: 15 },
    },
    {
      field: 'address_city', type: 'string',
      schema: { data_type: 'character varying', default_value: 'Slough', is_nullable: true },
      meta: { interface: 'input', width: 'half', sort: 16 },
    },
    {
      field: 'address_county', type: 'string',
      schema: { data_type: 'character varying', default_value: 'Berkshire', is_nullable: true },
      meta: { interface: 'input', width: 'half', sort: 17 },
    },
    {
      field: 'address_postcode', type: 'string',
      schema: { data_type: 'character varying', default_value: 'SL1 1XQ', is_nullable: true },
      meta: { interface: 'input', width: 'half', sort: 18 },
    },
    {
      field: 'google_maps_url', type: 'string',
      schema: { data_type: 'character varying', is_nullable: true },
      meta: { interface: 'input', note: 'Full Google Maps URL for the office/location', width: 'full', sort: 19 },
    },

    // ── SOCIAL LINKS ────────────────────────────────────────────────────────
    {
      field: 'facebook_url', type: 'string',
      schema: { data_type: 'character varying', is_nullable: true },
      meta: { interface: 'input', note: 'Full Facebook page URL', width: 'half', sort: 20 },
    },
    {
      field: 'instagram_url', type: 'string',
      schema: { data_type: 'character varying', is_nullable: true },
      meta: { interface: 'input', note: 'Full Instagram profile URL', width: 'half', sort: 21 },
    },
    {
      field: 'linkedin_url', type: 'string',
      schema: { data_type: 'character varying', is_nullable: true },
      meta: { interface: 'input', note: 'Full LinkedIn page URL', width: 'half', sort: 22 },
    },
    {
      field: 'twitter_x_url', type: 'string',
      schema: { data_type: 'character varying', is_nullable: true },
      meta: { interface: 'input', note: 'Full X (Twitter) profile URL', width: 'half', sort: 23 },
    },

    // ── BUSINESS / REGULATORY ───────────────────────────────────────────────
    {
      field: 'company_number', type: 'string',
      schema: { data_type: 'character varying', is_nullable: true },
      meta: { interface: 'input', note: 'Companies House registration number', width: 'half', sort: 24 },
    },
    {
      field: 'cqc_provider_id', type: 'string',
      schema: { data_type: 'character varying', default_value: '1-20633610286', is_nullable: true },
      meta: { interface: 'input', note: 'CQC Provider ID shown in compliance section', width: 'half', sort: 25 },
    },
    {
      field: 'cqc_location_id', type: 'string',
      schema: { data_type: 'character varying', is_nullable: true },
      meta: { interface: 'input', note: 'CQC Location ID (if separate from Provider ID)', width: 'half', sort: 26 },
    },
    {
      field: 'cqc_rating', type: 'string',
      schema: { data_type: 'character varying', is_nullable: true },
      meta: { interface: 'select-dropdown', note: 'Current CQC rating', options: { choices: [
        { text: 'Outstanding', value: 'Outstanding' },
        { text: 'Good', value: 'Good' },
        { text: 'Requires Improvement', value: 'Requires Improvement' },
        { text: 'Inadequate', value: 'Inadequate' },
        { text: 'Awaiting Inspection', value: 'Awaiting Inspection' },
      ]}, width: 'half', sort: 27 },
    },
    {
      field: 'cqc_report_url', type: 'string',
      schema: { data_type: 'character varying', is_nullable: true },
      meta: { interface: 'input', note: 'Link to the CQC inspection report page', width: 'half', sort: 28 },
    },

    // ── SEO DEFAULTS ────────────────────────────────────────────────────────
    {
      field: 'seo_title', type: 'string',
      schema: { data_type: 'character varying', is_nullable: true },
      meta: { interface: 'input', note: 'Default browser tab title (60 chars max)', width: 'full', sort: 29 },
    },
    {
      field: 'seo_description', type: 'text',
      schema: { data_type: 'text', is_nullable: true },
      meta: { interface: 'input-multiline', note: 'Default meta description (160 chars max)', width: 'full', sort: 30 },
    },
    {
      field: 'og_image', type: 'uuid',
      schema: { data_type: 'uuid', is_nullable: true, foreign_key_table: 'directus_files', foreign_key_column: 'id' },
      meta: { interface: 'file-image', special: ['file'], note: 'Default Open Graph / social share image (1200×630)', width: 'half', sort: 31 },
    },
    {
      field: 'google_analytics_id', type: 'string',
      schema: { data_type: 'character varying', is_nullable: true },
      meta: { interface: 'input', note: 'Google Analytics measurement ID (e.g. G-XXXXXXXXXX)', width: 'half', sort: 32 },
    },
  ],
};

const SEED = {
  site_name: 'Aster Homecare UK',
  site_tagline: 'CQC-Registered Home Care in Slough & Berkshire',
  hero_title: 'Compassionate Care, In The Comfort Of Your Own Home',
  hero_subtitle: 'CQC-registered home care services in Slough and Berkshire — personal care, companionship, and medication support delivered with dignity and kindness.',
  phone: '+441753000000',
  phone_display: '01753 000000',
  email: 'info@asterhomecare.co.uk',
  email_careers: 'careers@asterhomecare.co.uk',
  address_line1: '7 Mackenzie Street',
  address_line2: null,
  address_city: 'Slough',
  address_county: 'Berkshire',
  address_postcode: 'SL1 1XQ',
  google_maps_url: 'https://maps.google.com/?q=7+Mackenzie+Street+Slough+SL1+1XQ',
  facebook_url: null,
  instagram_url: null,
  linkedin_url: null,
  twitter_x_url: null,
  company_number: null,
  cqc_provider_id: '1-20633610286',
  cqc_location_id: null,
  cqc_rating: 'Awaiting Inspection',
  cqc_report_url: null,
  seo_title: 'Aster Homecare UK | CQC Registered Home Care in Slough',
  seo_description: 'Aster Homecare UK provides compassionate, CQC-registered home care services in Slough and Berkshire. Personal care, companionship, and medication support tailored to your needs.',
  google_analytics_id: null,
};

async function main() {
  console.log('🔐 Authenticating...');
  const token = await getToken();
  console.log('✓ Authenticated\n');

  // Check if collection already exists
  const existing = await req('/collections/site_settings', 'GET', null, token);
  if (existing.ok) {
    console.log('⚠ site_settings already exists — deleting and recreating...');
    await req('/collections/site_settings', 'DELETE', null, token);
    console.log('  ✓ Deleted\n');
  }

  console.log('📦 Creating site_settings singleton with all fields...');
  const res = await req('/collections', 'POST', COLLECTION, token);
  if (!res.ok) {
    console.error('✗ Failed to create collection:', JSON.stringify(res.data).substring(0, 400));
    process.exit(1);
  }
  console.log('  ✓ Collection created\n');

  // Re-auth before seeding (singletons use PATCH on the collection directly)
  console.log('🔐 Re-authenticating for seeding...');
  const token2 = await getToken();

  console.log('🌱 Seeding default site settings...');
  // For singletons: use POST (first time) or PATCH
  const seedRes = await req('/items/site_settings', 'POST', SEED, token2);
  if (!seedRes.ok) {
    const msg = JSON.stringify(seedRes.data);
    // Try PATCH in case record already exists
    if (msg.includes('unique') || msg.includes('already') || msg.includes('exists')) {
      const patchRes = await req('/items/site_settings', 'PATCH', SEED, token2);
      if (patchRes.ok) {
        console.log('  ✓ Updated existing record');
      } else {
        console.error('  ✗ PATCH failed:', JSON.stringify(patchRes.data).substring(0, 200));
      }
    } else {
      console.error('  ✗ Seed failed:', msg.substring(0, 300));
    }
  } else {
    console.log('  ✓ Default values seeded');
  }

  // Public read permission
  console.log('\n🌐 Adding public read permission...');
  const token3 = await getToken();
  const policiesRes = await req('/policies?limit=50', 'GET', null, token3);
  const publicPolicy = policiesRes.data?.data?.find(p => p.name === '$t:public_label' || p.name === 'Public');
  if (publicPolicy) {
    const permRes = await req('/permissions', 'POST', {
      policy: publicPolicy.id,
      collection: 'site_settings',
      action: 'read',
      fields: ['*'],
      permissions: {},
      validation: {},
    }, token3);
    if (permRes.ok) {
      console.log('  ✓ Public read enabled');
    } else {
      console.log('  ⚠', JSON.stringify(permRes.data).substring(0, 100));
    }
  } else {
    console.log('  ⚠ No public policy found');
  }

  console.log('\n✅ site_settings collection ready!');
  console.log('\nFields created:');
  console.log('  Branding:   site_name, site_tagline, logo, logo_dark, favicon');
  console.log('  Hero:       hero_title, hero_subtitle, hero_image, hero_video_url');
  console.log('  Contact:    phone, phone_display, email, email_careers,');
  console.log('              address_line1/2/city/county/postcode, google_maps_url');
  console.log('  Social:     facebook_url, instagram_url, linkedin_url, twitter_x_url');
  console.log('  Business:   company_number, cqc_provider_id, cqc_location_id,');
  console.log('              cqc_rating, cqc_report_url');
  console.log('  SEO:        seo_title, seo_description, og_image, google_analytics_id');
}

main().catch(err => {
  console.error('\n❌ Error:', err.message || err);
  process.exit(1);
});
