#!/usr/bin/env node
/**
 * Adds the new detailed fields to the existing free_assessments collection.
 * Run: node scripts/add-assessment-fields.mjs
 */
import { readFileSync } from 'fs'
import { resolve } from 'path'

const envPath = resolve(process.cwd(), '.env.local')
try {
  const raw = readFileSync(envPath, 'utf-8')
  for (const line of raw.split('\n')) {
    const t = line.trim()
    if (!t || t.startsWith('#')) continue
    const idx = t.indexOf('=')
    if (idx === -1) continue
    const k = t.slice(0, idx).trim(), v = t.slice(idx + 1).trim()
    if (!process.env[k]) process.env[k] = v
  }
} catch {}

const BASE = process.env.NEXT_PUBLIC_DIRECTUS_URL
const TOKEN = process.env.DIRECTUS_TOKEN
const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${TOKEN}` }

async function req(method, path, body) {
  const res = await fetch(`${BASE}${path}`, { method, headers, body: body ? JSON.stringify(body) : undefined })
  const text = await res.text()
  if (!res.ok) throw new Error(`${method} ${path} → ${res.status}: ${text}`)
  return text ? JSON.parse(text) : null
}

async function fieldExists(f) {
  try { await req('GET', `/fields/free_assessments/${f}`); return true } catch { return false }
}

async function addField(def) {
  if (await fieldExists(def.field)) { console.log(`  ↩  exists: ${def.field}`); return }
  await req('POST', `/fields/free_assessments`, def)
  console.log(`  ✓  added: ${def.field}`)
}

const NEW_FIELDS = [
  {
    field: 'care_recipient_age_range', type: 'string',
    meta: { interface: 'select-dropdown', display: 'labels', sort: 6, width: 'half',
      options: { choices: [{ value: 'under_40', text: 'Under 40' }, { value: '40_65', text: '40–65' }, { value: '65_80', text: '65–80' }, { value: '80_plus', text: '80+' }] } },
    schema: { is_nullable: true },
  },
  {
    field: 'living_situation', type: 'string',
    meta: { interface: 'select-dropdown', display: 'labels', sort: 7, width: 'half',
      options: { choices: [{ value: 'own_home_alone', text: 'Own home — alone' }, { value: 'own_home_partner', text: 'Own home — with partner' }, { value: 'with_family', text: 'With family' }, { value: 'rented', text: 'Rented property' }] } },
    schema: { is_nullable: true },
  },
  {
    field: 'mobility_level', type: 'string',
    meta: { interface: 'select-dropdown', display: 'labels', sort: 8, width: 'half',
      options: { choices: [{ value: 'fully_mobile', text: 'Fully mobile' }, { value: 'walking_aid', text: 'Uses walking aid' }, { value: 'wheelchair', text: 'Wheelchair user' }, { value: 'bed_bound', text: 'Mostly bed-bound' }] } },
    schema: { is_nullable: true },
  },
  {
    field: 'current_care', type: 'string',
    meta: { interface: 'select-dropdown', display: 'labels', sort: 9, width: 'half',
      options: { choices: [{ value: 'none', text: 'No current care' }, { value: 'family', text: 'Family' }, { value: 'other_agency', text: 'Other agency' }, { value: 'social_services', text: 'Social services' }] } },
    schema: { is_nullable: true },
  },
  {
    field: 'care_frequency', type: 'string',
    meta: { interface: 'select-dropdown', display: 'labels', sort: 10, width: 'half',
      options: { choices: [{ value: 'few_hours', text: 'A few hours/week' }, { value: 'daily', text: 'Daily visits' }, { value: 'multiple_daily', text: 'Multiple daily' }, { value: 'live_in', text: 'Live-in care' }] } },
    schema: { is_nullable: true },
  },
  {
    field: 'medical_conditions', type: 'json',
    meta: { interface: 'tags', display: 'labels', sort: 11, width: 'full', note: 'Medical conditions of the care recipient' },
    schema: { is_nullable: true },
  },
]

async function main() {
  console.log('\n📋  Adding new fields to free_assessments...\n')
  for (const f of NEW_FIELDS) await addField(f)
  console.log('\n✅  Done!\n')
}

main().catch(e => { console.error('❌', e.message); process.exit(1) })
