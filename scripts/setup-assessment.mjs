#!/usr/bin/env node
/**
 * Creates the free_assessments collection in Directus.
 * Run: node scripts/setup-assessment.mjs
 */

import { readFileSync } from 'fs'
import { resolve } from 'path'

// Load .env.local manually
const envPath = resolve(process.cwd(), '.env.local')
try {
  const raw = readFileSync(envPath, 'utf-8')
  for (const line of raw.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const idx = trimmed.indexOf('=')
    if (idx === -1) continue
    const key = trimmed.slice(0, idx).trim()
    const val = trimmed.slice(idx + 1).trim()
    if (!process.env[key]) process.env[key] = val
  }
} catch {
  console.warn('Could not load .env.local — using existing env vars')
}

const BASE = process.env.NEXT_PUBLIC_DIRECTUS_URL
const TOKEN = process.env.DIRECTUS_TOKEN

if (!BASE || !TOKEN) {
  console.error('Missing NEXT_PUBLIC_DIRECTUS_URL or DIRECTUS_TOKEN')
  process.exit(1)
}

const headers = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${TOKEN}`,
}

async function request(method, path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })
  const text = await res.text()
  if (!res.ok) {
    throw new Error(`${method} ${path} → ${res.status}: ${text}`)
  }
  return text ? JSON.parse(text) : null
}

async function collectionExists(name) {
  try {
    await request('GET', `/collections/${name}`)
    return true
  } catch {
    return false
  }
}

async function fieldExists(collection, field) {
  try {
    await request('GET', `/fields/${collection}/${field}`)
    return true
  } catch {
    return false
  }
}

async function createField(collection, fieldDef) {
  if (await fieldExists(collection, fieldDef.field)) {
    console.log(`  ↩  field already exists: ${fieldDef.field}`)
    return
  }
  await request('POST', `/fields/${collection}`, fieldDef)
  console.log(`  ✓  created field: ${fieldDef.field}`)
}

const FIELDS = [
  // ── Contact
  {
    field: 'first_name', type: 'string',
    meta: { interface: 'input', display: 'raw', required: true, sort: 1, group: null, options: { placeholder: 'First name' }, width: 'half' },
    schema: { is_nullable: false },
  },
  {
    field: 'last_name', type: 'string',
    meta: { interface: 'input', display: 'raw', required: true, sort: 2, width: 'half', options: { placeholder: 'Last name' } },
    schema: { is_nullable: false },
  },
  {
    field: 'email', type: 'string',
    meta: { interface: 'input', display: 'raw', required: true, sort: 3, width: 'half', options: { placeholder: 'Email address' } },
    schema: { is_nullable: false },
  },
  {
    field: 'phone', type: 'string',
    meta: { interface: 'input', display: 'raw', required: true, sort: 4, width: 'half', options: { placeholder: 'Phone number' } },
    schema: { is_nullable: false },
  },
  {
    field: 'postcode', type: 'string',
    meta: { interface: 'input', display: 'raw', required: true, sort: 5, width: 'half', options: { placeholder: 'Postcode' } },
    schema: { is_nullable: false },
  },
  // ── Care details
  {
    field: 'care_for', type: 'string',
    meta: {
      interface: 'select-dropdown',
      display: 'labels',
      required: true,
      sort: 6,
      width: 'half',
      options: {
        choices: [
          { value: 'myself',        text: 'Myself' },
          { value: 'family_member', text: 'A family member' },
          { value: 'other',         text: 'Someone else' },
        ],
      },
    },
    schema: { is_nullable: false },
  },
  {
    field: 'person_name', type: 'string',
    meta: { interface: 'input', display: 'raw', required: false, sort: 7, width: 'half', note: 'Name of the person receiving care (if not the enquirer)', options: { placeholder: 'Full name' } },
    schema: { is_nullable: true },
  },
  {
    field: 'relationship', type: 'string',
    meta: { interface: 'input', display: 'raw', required: false, sort: 8, width: 'half', note: 'Relationship to person needing care', options: { placeholder: 'e.g. Son, Daughter, Spouse' } },
    schema: { is_nullable: true },
  },
  {
    field: 'care_needs', type: 'json',
    meta: {
      interface: 'tags',
      display: 'labels',
      required: false,
      sort: 9,
      width: 'full',
      note: 'Types of care needed (multi-select)',
      options: {
        choices: [
          'Personal care',
          'Dementia care',
          'Mental health support',
          'Physical disability support',
          'Sensory impairment support',
          'Medication support',
          'Companionship',
          'Adults over 65',
          'Adults under 65',
        ],
      },
    },
    schema: { is_nullable: true },
  },
  {
    field: 'care_start', type: 'string',
    meta: {
      interface: 'select-dropdown',
      display: 'labels',
      required: true,
      sort: 10,
      width: 'half',
      options: {
        choices: [
          { value: 'asap',        text: 'As soon as possible' },
          { value: '1_month',     text: 'Within 1 month' },
          { value: '1_3_months',  text: '1–3 months' },
          { value: 'exploring',   text: 'Just exploring options' },
        ],
      },
    },
    schema: { is_nullable: false },
  },
  {
    field: 'preferred_contact_time', type: 'string',
    meta: {
      interface: 'select-dropdown',
      display: 'labels',
      required: true,
      sort: 11,
      width: 'half',
      options: {
        choices: [
          { value: 'morning',   text: 'Morning (9am – 12pm)' },
          { value: 'afternoon', text: 'Afternoon (12pm – 5pm)' },
          { value: 'evening',   text: 'Evening (5pm – 7pm)' },
          { value: 'anytime',   text: 'Anytime' },
        ],
      },
    },
    schema: { is_nullable: false },
  },
  {
    field: 'how_heard', type: 'string',
    meta: {
      interface: 'select-dropdown',
      display: 'raw',
      required: false,
      sort: 12,
      width: 'half',
      options: {
        choices: [
          { value: 'google',    text: 'Google Search' },
          { value: 'social',    text: 'Social Media' },
          { value: 'referral',  text: 'Friend / Family referral' },
          { value: 'nhs',       text: 'NHS / Social services' },
          { value: 'other',     text: 'Other' },
        ],
        allowOther: true,
      },
    },
    schema: { is_nullable: true },
  },
  {
    field: 'additional_notes', type: 'text',
    meta: { interface: 'input-multiline', display: 'raw', required: false, sort: 13, width: 'full', options: { placeholder: 'Any additional information…', rows: 4 } },
    schema: { is_nullable: true },
  },
  // ── Internal / admin fields
  {
    field: 'status', type: 'string',
    meta: {
      interface: 'select-dropdown',
      display: 'labels',
      required: false,
      sort: 14,
      width: 'half',
      note: 'Internal status — updated by staff',
      options: {
        choices: [
          { value: 'new',       text: '🆕 New' },
          { value: 'contacted', text: '📞 Contacted' },
          { value: 'assessed',  text: '✅ Assessed' },
          { value: 'converted', text: '🏆 Converted to client' },
          { value: 'closed',    text: '❌ Closed / Not suitable' },
        ],
      },
    },
    schema: { default_value: 'new', is_nullable: false },
  },
  {
    field: 'assigned_to', type: 'string',
    meta: { interface: 'input', display: 'raw', required: false, sort: 15, width: 'half', note: 'Staff member assigned to follow up' },
    schema: { is_nullable: true },
  },
  {
    field: 'internal_notes', type: 'text',
    meta: { interface: 'input-multiline', display: 'raw', required: false, sort: 16, width: 'full', note: 'Internal staff notes — not visible to client' },
    schema: { is_nullable: true },
  },
  {
    field: 'date_submitted', type: 'timestamp',
    meta: { interface: 'datetime', display: 'datetime', required: false, sort: 17, width: 'half', readonly: true },
    schema: { default_value: 'now', is_nullable: true },
  },
  {
    field: 'ip_address', type: 'string',
    meta: { interface: 'input', display: 'raw', required: false, sort: 18, width: 'half', readonly: true, note: 'Submitter IP for audit trail' },
    schema: { is_nullable: true },
  },
]

async function main() {
  console.log(`\n🔗  Directus: ${BASE}`)
  console.log('📋  Setting up free_assessments collection...\n')

  const exists = await collectionExists('free_assessments')

  if (!exists) {
    await request('POST', '/collections', {
      collection: 'free_assessments',
      meta: {
        collection: 'free_assessments',
        icon: 'assignment',
        note: 'Free care assessment enquiries submitted via the website',
        display_template: '{{first_name}} {{last_name}} — {{status}}',
        sort_field: null,
        archive_field: 'status',
        archive_value: 'closed',
        unarchive_value: 'new',
      },
      schema: { name: 'free_assessments' },
    })
    console.log('✓  Collection free_assessments created\n')
  } else {
    console.log('↩  Collection already exists — ensuring fields...\n')
  }

  for (const field of FIELDS) {
    await createField('free_assessments', field)
  }

  console.log('\n✅  Done! The free_assessments collection is ready in Directus.\n')
  console.log('Next steps:')
  console.log('  1. Open your Directus admin panel')
  console.log('  2. Go to Settings → Roles → Public')
  console.log('  3. Allow "create" on the free_assessments collection')
  console.log('     (so the website can submit without auth)\n')
}

main().catch((err) => {
  console.error('\n❌  Setup failed:', err.message)
  process.exit(1)
})
