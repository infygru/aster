import { NextRequest, NextResponse } from 'next/server'
import { createDirectus, rest, staticToken, createItem } from '@directus/sdk'
import { z } from 'zod'

const schema = z.object({
  name:    z.string().min(2),
  email:   z.string().email(),
  phone:   z.string().optional(),
  subject: z.enum(['general', 'assessment', 'complaint', 'other']),
  message: z.string().min(10),
  consent: z.literal(true),
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

    await client.request(createItem('contact_submissions' as never, {
      ...parsed.data,
      status: 'new',
      date_submitted: new Date().toISOString(),
      ip_address: ip,
    } as never))

    return NextResponse.json({ success: true }, { status: 201 })
  } catch (err) {
    console.error('[Contact API]', err)
    return NextResponse.json({ error: 'Submission failed. Please try again.' }, { status: 500 })
  }
}
