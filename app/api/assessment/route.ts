import { NextRequest, NextResponse } from 'next/server'
import { createDirectus, rest, staticToken, createItem } from '@directus/sdk'
import { z } from 'zod'

const schema = z.object({
  care_for:                 z.enum(['myself', 'family_member', 'other']),
  person_name:              z.string().optional(),
  relationship:             z.string().optional(),
  care_recipient_age_range: z.enum(['under_40', '40_65', '65_80', '80_plus']),
  living_situation:         z.enum(['own_home_alone', 'own_home_partner', 'with_family', 'rented']),
  mobility_level:           z.enum(['fully_mobile', 'walking_aid', 'wheelchair', 'bed_bound']),
  first_name:               z.string().min(1),
  last_name:                z.string().min(1),
  email:                    z.string().email(),
  phone:                    z.string().min(6),
  postcode:                 z.string().min(2),
  current_care:             z.enum(['none', 'family', 'other_agency', 'social_services']),
  care_needs:               z.array(z.string()).min(1),
  care_frequency:           z.enum(['few_hours', 'daily', 'multiple_daily', 'live_in']),
  medical_conditions:       z.array(z.string()).optional(),
  care_start:               z.enum(['urgent', 'asap', '1_month', '1_3_months', 'exploring']),
  preferred_contact_time:   z.enum(['morning', 'afternoon', 'evening', 'anytime']),
  how_heard:                z.string().optional(),
  additional_notes:         z.string().optional(),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = schema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation failed', details: parsed.error.flatten() }, { status: 422 })
    }

    const url = process.env.NEXT_PUBLIC_DIRECTUS_URL
    const token = process.env.DIRECTUS_TOKEN
    if (!url || !token) return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })

    const client = createDirectus(url).with(rest()).with(staticToken(token))
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || req.headers.get('x-real-ip') || 'unknown'

    await client.request(createItem('free_assessments' as never, {
      ...parsed.data,
      status: 'new',
      date_submitted: new Date().toISOString(),
      ip_address: ip,
    } as never))

    return NextResponse.json({ success: true }, { status: 201 })
  } catch (err) {
    console.error('[Assessment API]', err)
    return NextResponse.json({ error: 'Submission failed. Please try again.' }, { status: 500 })
  }
}
