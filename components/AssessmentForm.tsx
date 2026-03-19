'use client'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import {
  ArrowRight, ArrowLeft, CheckCircle, Loader2, ShieldCheck, Phone,
  User, Users, UserCheck,
  Home, Building2, HeartHandshake,
  Footprints, PersonStanding, Accessibility, BedDouble,
  Bath, Shirt, Pill, UtensilsCrossed, Bed, MoveVertical, ShoppingBag, Car, MessageCircle, Moon, House, Heart,
  Brain, Activity, Wind, Droplets, Zap, Eye, Ear, Bone, Laugh, AlertCircle,
  Clock, CalendarDays, Rocket, Search,
  CheckSquare, Sparkles
} from 'lucide-react'

// ─── Zod schemas ─────────────────────────────────────────────────────────────

const s1 = z.object({
  care_for:                 z.enum(['myself', 'family_member', 'other'], { errorMap: () => ({ message: 'Please choose one' }) }),
  person_name:              z.string().optional(),
  relationship:             z.string().optional(),
  care_recipient_age_range: z.enum(['under_40', '40_65', '65_80', '80_plus'], { errorMap: () => ({ message: 'Required' }) }),
  living_situation:         z.enum(['own_home_alone', 'own_home_partner', 'with_family', 'rented'], { errorMap: () => ({ message: 'Required' }) }),
  mobility_level:           z.enum(['fully_mobile', 'walking_aid', 'wheelchair', 'bed_bound'], { errorMap: () => ({ message: 'Required' }) }),
})
const s2 = z.object({
  first_name:   z.string().min(2, 'Required'),
  last_name:    z.string().min(2, 'Required'),
  email:        z.string().email('Enter a valid email'),
  phone:        z.string().min(10, 'Enter a valid phone number'),
  postcode:     z.string().min(2, 'Required'),
  current_care: z.enum(['none', 'family', 'other_agency', 'social_services'], { errorMap: () => ({ message: 'Required' }) }),
})
const s3 = z.object({
  care_needs:         z.array(z.string()).min(1, 'Select at least one'),
  care_frequency:     z.enum(['few_hours', 'daily', 'multiple_daily', 'live_in'], { errorMap: () => ({ message: 'Required' }) }),
  medical_conditions: z.array(z.string()).optional(),
})
const s4 = z.object({
  care_start:             z.enum(['urgent', 'asap', '1_month', '1_3_months', 'exploring'], { errorMap: () => ({ message: 'Required' }) }),
  preferred_contact_time: z.enum(['morning', 'afternoon', 'evening', 'anytime'], { errorMap: () => ({ message: 'Required' }) }),
  how_heard:              z.string().optional(),
  additional_notes:       z.string().optional(),
  consent:                z.boolean().refine(v => v, { message: 'You must agree to continue' }),
})

const fullSchema = s1.merge(s2).merge(s3).merge(s4)
type FD = z.infer<typeof fullSchema>

// ─── Constants ───────────────────────────────────────────────────────────────

const CARE_FOR_OPTIONS = [
  { value: 'myself',        icon: User,      title: 'Myself',          sub: 'I am enquiring for myself' },
  { value: 'family_member', icon: Users,     title: 'A family member', sub: 'Parent, spouse, sibling…' },
  { value: 'other',         icon: UserCheck, title: 'Someone else',    sub: 'Friend, neighbour, client…' },
]
const AGE_OPTIONS = [
  { value: 'under_40', title: 'Under 40' },
  { value: '40_65',    title: '40 – 65' },
  { value: '65_80',    title: '65 – 80' },
  { value: '80_plus',  title: '80+' },
]
const LIVING_OPTIONS = [
  { value: 'own_home_alone',   icon: Home,           title: 'Own home',        sub: 'Lives alone' },
  { value: 'own_home_partner', icon: HeartHandshake, title: 'Own home',        sub: 'Lives with partner' },
  { value: 'with_family',      icon: Users,          title: 'With family',     sub: 'Lives with family' },
  { value: 'rented',           icon: Building2,      title: 'Rented property', sub: 'Private or social rental' },
]
const MOBILITY_OPTIONS = [
  { value: 'fully_mobile', icon: Footprints,     title: 'Fully mobile',    sub: 'Moves independently' },
  { value: 'walking_aid',  icon: PersonStanding, title: 'Uses walking aid', sub: 'Stick, frame or zimmer' },
  { value: 'wheelchair',   icon: Accessibility,  title: 'Wheelchair user', sub: 'Manual or powered' },
  { value: 'bed_bound',    icon: BedDouble,      title: 'Mostly bed-bound', sub: 'Limited or no mobility' },
]
const CURRENT_CARE_OPTIONS = [
  { value: 'none',            title: 'No current care',     sub: 'Starting fresh' },
  { value: 'family',          title: 'Family provides care', sub: 'Informal support' },
  { value: 'other_agency',    title: 'Another care agency', sub: 'Looking to switch' },
  { value: 'social_services', title: 'Social services',     sub: 'Council-arranged care' },
]
const CARE_TASKS = [
  { value: 'Bathing & washing',        icon: Bath },
  { value: 'Dressing & grooming',      icon: Shirt },
  { value: 'Medication management',    icon: Pill },
  { value: 'Meal preparation',         icon: UtensilsCrossed },
  { value: 'Getting in/out of bed',    icon: Bed },
  { value: 'Mobility & moving around', icon: MoveVertical },
  { value: 'Light housekeeping',       icon: House },
  { value: 'Shopping & errands',       icon: ShoppingBag },
  { value: 'Transport & appointments', icon: Car },
  { value: 'Companionship',            icon: Heart },
  { value: 'Communication support',    icon: MessageCircle },
  { value: 'Night-time care',          icon: Moon },
]
const FREQUENCY_OPTIONS = [
  { value: 'few_hours',      icon: Clock,        title: 'A few hours a week',    sub: 'Occasional support' },
  { value: 'daily',          icon: CalendarDays, title: 'Once daily',            sub: 'Morning or evening visit' },
  { value: 'multiple_daily', icon: Activity,     title: 'Multiple visits daily', sub: 'Morning + evening + more' },
  { value: 'live_in',        icon: Home,         title: 'Live-in care',          sub: '24-hour support at home' },
]
const CONDITIONS = [
  { value: "Dementia / Alzheimer's", icon: Brain },
  { value: "Parkinson's disease",    icon: Activity },
  { value: 'Stroke / TIA',          icon: Zap },
  { value: 'Diabetes',              icon: Droplets },
  { value: 'COPD / Asthma',         icon: Wind },
  { value: 'Heart condition',        icon: Heart },
  { value: 'Depression / Anxiety',  icon: Laugh },
  { value: 'Cancer',                icon: AlertCircle },
  { value: 'Arthritis',             icon: Bone },
  { value: 'Epilepsy',              icon: Zap },
  { value: 'Visual impairment',     icon: Eye },
  { value: 'Hearing impairment',    icon: Ear },
  { value: 'Learning disability',   icon: Brain },
  { value: 'None / Other',          icon: CheckSquare },
]
const CARE_START_OPTIONS = [
  { value: 'urgent',     icon: Rocket,      title: 'Urgently',            sub: 'Within days' },
  { value: 'asap',       icon: ArrowRight,  title: 'As soon as possible', sub: 'Within 2–3 weeks' },
  { value: '1_month',    icon: CalendarDays,title: 'Within 1 month',      sub: 'Some flexibility' },
  { value: '1_3_months', icon: Clock,       title: '1–3 months',          sub: 'Planning ahead' },
  { value: 'exploring',  icon: Search,      title: 'Just exploring',      sub: 'No set timeline yet' },
]
const CONTACT_TIME_OPTIONS = [
  { value: 'morning',   title: 'Morning',   sub: '9am – 12pm' },
  { value: 'afternoon', title: 'Afternoon', sub: '12pm – 5pm' },
  { value: 'evening',   title: 'Evening',   sub: '5pm – 7pm' },
  { value: 'anytime',   title: 'Anytime',   sub: "We'll try our best" },
]
const STEPS = [
  { label: 'About the Person',  sub: 'Situation, living arrangements and mobility' },
  { label: 'Your Details',      sub: 'Contact info so we can arrange your visit' },
  { label: 'Care Needs',        sub: 'What support is needed day to day' },
  { label: 'Preferences',       sub: 'Timeline and best way to reach you' },
]

// ─── Rose/coral theme tokens ──────────────────────────────────────────────────
// Primary:  #E11D48 (rose-600) / #F43F5E (rose-500) / #BE123C (rose-700)
// Light:    #FFF1F2 (rose-50)  / #FECDD3 (rose-200)  / #FDA4AF (rose-300)
// Selected: amber border #FBBF24 + warm cream bg (kept)

// ─── Reusable components ──────────────────────────────────────────────────────

function FieldLabel({ htmlFor, children, required }: { htmlFor?: string; children: React.ReactNode; required?: boolean }) {
  return (
    <label htmlFor={htmlFor} className="block text-sm font-semibold mb-1.5 text-gray-700">
      {children}{required && <span className="text-red-400 ml-0.5">*</span>}
    </label>
  )
}

function TextInput({ id, error, ...rest }: React.InputHTMLAttributes<HTMLInputElement> & { id: string; error?: string }) {
  return (
    <>
      <input id={id} {...rest}
        className={`w-full rounded-xl border px-4 py-3 text-sm text-gray-900 outline-none transition-all focus:ring-2 focus:ring-rose-400 focus:border-rose-400 placeholder:text-gray-300 ${error ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white hover:border-rose-300'}`}
      />
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </>
  )
}

function PickCard({
  selected, onClick, icon: Icon, title, sub, compact,
}: {
  selected: boolean; onClick: () => void
  icon?: React.ComponentType<{ className?: string; style?: React.CSSProperties }>
  title: string; sub?: string; compact?: boolean
}) {
  return (
    <button type="button" onClick={onClick}
      className={`flex items-center gap-3 rounded-2xl border-2 text-left transition-all duration-150 ${compact ? 'p-3' : 'p-4'}`}
      style={{
        borderColor: selected ? '#FBBF24' : '#E5E7EB',
        background: selected ? 'linear-gradient(135deg, #FFFBEB, #FEF3C7)' : '#FAFAFA',
      }}>
      {Icon && (
        <div className={`rounded-xl flex items-center justify-center flex-shrink-0 ${compact ? 'w-9 h-9' : 'w-10 h-10'}`}
          style={{ background: selected ? 'linear-gradient(135deg, #E11D48, #F43F5E)' : '#F3F4F6' }}>
          <span style={{ color: selected ? '#fff' : '#9CA3AF' }}><Icon className={compact ? 'w-4 h-4' : 'w-4.5 h-4.5'} /></span>
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className={`font-semibold ${compact ? 'text-xs' : 'text-sm'}`}
          style={{ color: selected ? '#92400E' : '#374151' }}>{title}</p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
      {selected && (
        <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ml-1"
          style={{ background: 'linear-gradient(135deg, #E11D48, #F43F5E)' }}>
          <CheckCircle className="w-3 h-3 text-white" />
        </div>
      )}
    </button>
  )
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return <p className="text-sm font-bold text-gray-700 mb-3">{children}</p>
}

function FieldError({ msg }: { msg?: string }) {
  return msg ? <p className="text-xs text-red-500 mt-1.5">{msg}</p> : null
}

// ─── Main component ───────────────────────────────────────────────────────────

export function AssessmentForm() {
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [serverError, setServerError] = useState('')

  const { register, handleSubmit, trigger, watch, setValue, getValues, formState: { errors } } = useForm<FD>({
    resolver: zodResolver(fullSchema),
    defaultValues: { care_needs: [], medical_conditions: [], consent: false },
    mode: 'onBlur',
  })

  const all = watch()
  const careNeeds = watch('care_needs') ?? []
  const medConditions = watch('medical_conditions') ?? []

  function setEnum(field: keyof FD, val: unknown) {
    setValue(field as never, val as never, { shouldValidate: true })
  }
  function toggleArray(field: 'care_needs' | 'medical_conditions', val: string) {
    const cur: string[] = getValues(field) ?? []
    setValue(field, cur.includes(val) ? cur.filter(v => v !== val) : [...cur, val], { shouldValidate: true })
  }

  const stepValidFields: (keyof FD)[][] = [
    ['care_for', 'care_recipient_age_range', 'living_situation', 'mobility_level'],
    ['first_name', 'last_name', 'email', 'phone', 'postcode', 'current_care'],
    ['care_needs', 'care_frequency'],
    ['care_start', 'preferred_contact_time', 'consent'],
  ]

  async function next() {
    const ok = await trigger(stepValidFields[step])
    if (ok) { setStep(s => s + 1); window.scrollTo({ top: 0, behavior: 'smooth' }) }
  }

  async function onSubmit(data: FD) {
    setLoading(true); setServerError('')
    try {
      const res = await fetch('/api/assessment', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
      if (!res.ok) { const j = await res.json(); throw new Error(j.error || 'Submission failed') }
      setDone(true)
    } catch (e: unknown) {
      setServerError(e instanceof Error ? e.message : 'Something went wrong. Please try again.')
    } finally { setLoading(false) }
  }

  // ── Success ──────────────────────────────────────────────────────────────
  if (done) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-white">
        <div className="max-w-lg w-full bg-white rounded-3xl shadow-xl p-10 text-center"
          style={{ border: '1px solid #FECDD3' }}>
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ background: 'linear-gradient(135deg, #E11D48, #F43F5E)', boxShadow: '0 0 0 10px rgba(225,29,72,0.08)' }}>
            <CheckCircle className="w-10 h-10 text-white" />
          </div>

          <div className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-200 rounded-full px-3 py-1 mb-4">
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span className="text-amber-600 text-xs font-bold uppercase tracking-wide">Request Received</span>
          </div>

          <h1 className="text-2xl font-extrabold mb-3" style={{ color: '#0F172A' }}>
            Thank You, {all.first_name}!
          </h1>
          <p className="text-gray-500 leading-relaxed mb-2 text-sm">
            One of our care coordinators will call you on{' '}
            <span className="text-gray-800 font-semibold">{all.phone}</span> within 24 hours
            to arrange your free home assessment.
          </p>
          <p className="text-xs text-gray-300 mb-8">Reference: {Date.now().toString(36).toUpperCase()}</p>

          <div className="rounded-2xl p-5 mb-6 text-left" style={{ background: '#FFF1F2', border: '1px solid #FECDD3' }}>
            <p className="text-xs text-rose-600 font-bold uppercase tracking-wider mb-4">What happens next</p>
            {[
              'A coordinator calls to confirm your assessment date',
              'We visit you at home — free, zero obligation',
              'You receive your personalised care plan within 48 hours',
            ].map((t, i) => (
              <div key={i} className="flex items-start gap-3 mb-3 last:mb-0">
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black text-white flex-shrink-0 mt-0.5"
                  style={{ background: i % 2 === 0 ? 'linear-gradient(135deg, #E11D48, #F43F5E)' : '#FBBF24' }}>
                  {i + 1}
                </div>
                <p className="text-sm text-gray-600">{t}</p>
              </div>
            ))}
          </div>

          <p className="text-sm text-gray-400">
            Need to speak now?{' '}
            <a href="tel:+441753000000" className="text-rose-600 font-semibold hover:underline">Call 01753 000000</a>
          </p>
        </div>
      </div>
    )
  }

  const progressPct = ((step + 1) / STEPS.length) * 100

  // ── Wizard ───────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-white">

      {/* ── TOP NAV ── */}
      <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-rose-100">
        <div className="max-w-3xl mx-auto px-5 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #E11D48, #F43F5E)' }}>
              <span className="text-white font-black text-sm">A</span>
            </div>
            <div>
              <p className="font-bold text-sm leading-none" style={{ color: '#0F172A' }}>Aster Homecare</p>
              <p className="text-rose-400 text-[10px] leading-none mt-0.5 uppercase tracking-wide">UK Ltd</p>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-rose-400" />
              <span className="text-xs text-gray-400">CQC Registered</span>
            </div>
            <span className="text-xs font-semibold text-gray-400">Step {step + 1} of {STEPS.length}</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full h-1.5 bg-rose-50">
          <div className="h-full transition-all duration-500 ease-out rounded-full"
            style={{ width: `${progressPct}%`, background: 'linear-gradient(90deg, #E11D48, #F97316, #F59E0B)' }} />
        </div>
      </header>

      {/* ── MAIN ── */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10 md:py-14">

        {/* Step indicator pills */}
        <div className="flex items-center justify-center gap-2 mb-10">
          {STEPS.map((s, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold transition-all"
                style={{
                  background: i < step ? '#FFF1F2' : i === step ? 'linear-gradient(135deg, #E11D48, #F43F5E)' : '#F3F4F6',
                  color: i < step ? '#E11D48' : i === step ? '#fff' : '#9CA3AF',
                }}>
                <span className="w-4 h-4 rounded-full flex items-center justify-center text-[10px]"
                  style={{ background: i < step ? '#E11D48' : i === step ? 'rgba(255,255,255,0.25)' : '#E5E7EB', color: i < step ? '#fff' : 'inherit' }}>
                  {i < step ? '✓' : i + 1}
                </span>
                <span className="hidden sm:inline">{s.label}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className="w-6 h-0.5 rounded" style={{ background: i < step ? '#FDA4AF' : '#E5E7EB' }} />
              )}
            </div>
          ))}
        </div>

        {/* Step header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold mb-2" style={{ color: '#0F172A' }}>
            {STEPS[step].label}
          </h1>
          <p className="text-gray-400 text-sm">{STEPS[step].sub}</p>
        </div>

        {/* Form card */}
        <div className="bg-white rounded-3xl shadow-sm p-6 sm:p-8 md:p-10" style={{ border: '1px solid #FECDD3' }}>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>

            {/* ── STEP 1 ── */}
            {step === 0 && (
              <div className="space-y-8">
                <div>
                  <SectionHeading>Who needs care?</SectionHeading>
                  <div className="grid sm:grid-cols-3 gap-3">
                    {CARE_FOR_OPTIONS.map(o => (
                      <PickCard key={o.value} selected={all.care_for === o.value}
                        onClick={() => setEnum('care_for', o.value as FD['care_for'])}
                        icon={o.icon} title={o.title} sub={o.sub} />
                    ))}
                  </div>
                  <FieldError msg={errors.care_for?.message} />
                  {all.care_for && all.care_for !== 'myself' && (
                    <div className="grid sm:grid-cols-2 gap-3 mt-4 p-4 rounded-2xl bg-rose-50 border border-rose-100">
                      <div>
                        <FieldLabel htmlFor="person_name">Their name</FieldLabel>
                        <TextInput id="person_name" {...register('person_name')} placeholder="Full name" error={errors.person_name?.message} />
                      </div>
                      <div>
                        <FieldLabel htmlFor="relationship">Your relationship</FieldLabel>
                        <TextInput id="relationship" {...register('relationship')} placeholder="e.g. Daughter, Son" error={errors.relationship?.message} />
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <SectionHeading>Age range of the person needing care</SectionHeading>
                  <div className="grid grid-cols-4 gap-3">
                    {AGE_OPTIONS.map(o => (
                      <button key={o.value} type="button"
                        onClick={() => setEnum('care_recipient_age_range', o.value as FD['care_recipient_age_range'])}
                        className="py-3 rounded-2xl border-2 text-sm font-bold text-center transition-all"
                        style={{
                          borderColor: all.care_recipient_age_range === o.value ? '#FBBF24' : '#E5E7EB',
                          background: all.care_recipient_age_range === o.value ? 'linear-gradient(135deg, #FFFBEB, #FEF3C7)' : '#FAFAFA',
                          color: all.care_recipient_age_range === o.value ? '#92400E' : '#374151',
                        }}>
                        {o.title}
                      </button>
                    ))}
                  </div>
                  <FieldError msg={errors.care_recipient_age_range?.message} />
                </div>

                <div>
                  <SectionHeading>Living situation</SectionHeading>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {LIVING_OPTIONS.map(o => (
                      <PickCard key={o.value} selected={all.living_situation === o.value}
                        onClick={() => setEnum('living_situation', o.value as FD['living_situation'])}
                        icon={o.icon} title={o.title} sub={o.sub} />
                    ))}
                  </div>
                  <FieldError msg={errors.living_situation?.message} />
                </div>

                <div>
                  <SectionHeading>Mobility & movement</SectionHeading>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {MOBILITY_OPTIONS.map(o => (
                      <PickCard key={o.value} selected={all.mobility_level === o.value}
                        onClick={() => setEnum('mobility_level', o.value as FD['mobility_level'])}
                        icon={o.icon} title={o.title} sub={o.sub} />
                    ))}
                  </div>
                  <FieldError msg={errors.mobility_level?.message} />
                </div>
              </div>
            )}

            {/* ── STEP 2 ── */}
            {step === 1 && (
              <div className="space-y-7">
                <div>
                  <SectionHeading>Your contact information</SectionHeading>
                  <div className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <FieldLabel htmlFor="first_name" required>First name</FieldLabel>
                        <TextInput id="first_name" {...register('first_name')} placeholder="Jane" error={errors.first_name?.message} />
                      </div>
                      <div>
                        <FieldLabel htmlFor="last_name" required>Last name</FieldLabel>
                        <TextInput id="last_name" {...register('last_name')} placeholder="Smith" error={errors.last_name?.message} />
                      </div>
                    </div>
                    <div>
                      <FieldLabel htmlFor="email" required>Email address</FieldLabel>
                      <TextInput id="email" type="email" {...register('email')} placeholder="jane@example.com" error={errors.email?.message} />
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <FieldLabel htmlFor="phone" required>Phone number</FieldLabel>
                        <TextInput id="phone" type="tel" {...register('phone')} placeholder="07700 000000" error={errors.phone?.message} />
                      </div>
                      <div>
                        <FieldLabel htmlFor="postcode" required>Postcode</FieldLabel>
                        <TextInput id="postcode" {...register('postcode')} placeholder="SL1 1XQ" error={errors.postcode?.message} />
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <SectionHeading>Current care arrangements</SectionHeading>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {CURRENT_CARE_OPTIONS.map(o => (
                      <PickCard key={o.value} selected={all.current_care === o.value}
                        onClick={() => setEnum('current_care', o.value as FD['current_care'])}
                        title={o.title} sub={o.sub} />
                    ))}
                  </div>
                  <FieldError msg={errors.current_care?.message} />
                </div>
              </div>
            )}

            {/* ── STEP 3 ── */}
            {step === 2 && (
              <div className="space-y-8">
                <div>
                  <SectionHeading>Which care tasks are needed? <span className="text-gray-400 font-normal">(select all that apply)</span></SectionHeading>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {CARE_TASKS.map(({ value, icon: Icon }) => {
                      const sel = careNeeds.includes(value)
                      return (
                        <button key={value} type="button" onClick={() => toggleArray('care_needs', value)}
                          className="flex flex-col items-center gap-2 p-4 rounded-2xl border-2 text-center transition-all duration-150"
                          style={{
                            borderColor: sel ? '#FBBF24' : '#E5E7EB',
                            background: sel ? 'linear-gradient(135deg, #FFFBEB, #FEF3C7)' : '#FAFAFA',
                          }}>
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                            style={{ background: sel ? 'linear-gradient(135deg, #E11D48, #F43F5E)' : '#F3F4F6' }}>
                            <span style={{ color: sel ? '#fff' : '#9CA3AF' }}><Icon className="w-4 h-4" /></span>
                          </div>
                          <span className="text-xs font-semibold leading-tight" style={{ color: sel ? '#92400E' : '#374151' }}>{value}</span>
                        </button>
                      )
                    })}
                  </div>
                  <FieldError msg={errors.care_needs?.message} />
                </div>

                <div>
                  <SectionHeading>How often is care needed?</SectionHeading>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {FREQUENCY_OPTIONS.map(o => (
                      <PickCard key={o.value} selected={all.care_frequency === o.value}
                        onClick={() => setEnum('care_frequency', o.value as FD['care_frequency'])}
                        icon={o.icon} title={o.title} sub={o.sub} />
                    ))}
                  </div>
                  <FieldError msg={errors.care_frequency?.message} />
                </div>

                <div>
                  <SectionHeading>Medical conditions <span className="text-gray-400 font-normal">(optional — select all that apply)</span></SectionHeading>
                  <div className="flex flex-wrap gap-2">
                    {CONDITIONS.map(({ value, icon: Icon }) => {
                      const sel = medConditions.includes(value)
                      return (
                        <button key={value} type="button" onClick={() => toggleArray('medical_conditions', value)}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border text-xs font-semibold transition-all duration-150"
                          style={{
                            borderColor: sel ? '#E11D48' : '#E5E7EB',
                            background: sel ? '#FFF1F2' : '#F9FAFB',
                            color: sel ? '#BE123C' : '#6B7280',
                          }}>
                          <Icon className="w-3 h-3" />
                          {value}
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* ── STEP 4 ── */}
            {step === 3 && (
              <div className="space-y-7">
                <div>
                  <SectionHeading>When do you need care to start?</SectionHeading>
                  <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-3">
                    {CARE_START_OPTIONS.map(o => (
                      <PickCard key={o.value} selected={all.care_start === o.value}
                        onClick={() => setEnum('care_start', o.value as FD['care_start'])}
                        icon={o.icon} title={o.title} sub={o.sub} />
                    ))}
                  </div>
                  <FieldError msg={errors.care_start?.message} />
                </div>

                <div>
                  <SectionHeading>Best time to call you</SectionHeading>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {CONTACT_TIME_OPTIONS.map(o => (
                      <button key={o.value} type="button"
                        onClick={() => setEnum('preferred_contact_time', o.value as FD['preferred_contact_time'])}
                        className="p-3.5 rounded-2xl border-2 text-center transition-all"
                        style={{
                          borderColor: all.preferred_contact_time === o.value ? '#FBBF24' : '#E5E7EB',
                          background: all.preferred_contact_time === o.value ? 'linear-gradient(135deg, #FFFBEB, #FEF3C7)' : '#FAFAFA',
                        }}>
                        <p className="text-sm font-bold" style={{ color: all.preferred_contact_time === o.value ? '#92400E' : '#1F2937' }}>{o.title}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{o.sub}</p>
                      </button>
                    ))}
                  </div>
                  <FieldError msg={errors.preferred_contact_time?.message} />
                </div>

                <div>
                  <FieldLabel htmlFor="how_heard">How did you hear about us? <span className="text-gray-300 font-normal">(optional)</span></FieldLabel>
                  <select id="how_heard" {...register('how_heard')}
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none bg-white transition-all focus:ring-2 focus:ring-rose-400 hover:border-rose-300">
                    <option value="">Select…</option>
                    <option value="google">Google Search</option>
                    <option value="social">Social media</option>
                    <option value="referral">Friend or family referral</option>
                    <option value="nhs">NHS / social services</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <FieldLabel htmlFor="additional_notes">Anything else we should know? <span className="text-gray-300 font-normal">(optional)</span></FieldLabel>
                  <textarea id="additional_notes" {...register('additional_notes')} rows={4}
                    placeholder="Any specific requirements, concerns, or information that will help us prepare…"
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none resize-none transition-all focus:ring-2 focus:ring-rose-400 placeholder:text-gray-300 hover:border-rose-300" />
                </div>

                {/* Consent */}
                <div className="rounded-2xl p-5" style={{ background: '#FFF1F2', border: '1px solid #FECDD3' }}>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" {...register('consent')}
                      className="mt-0.5 w-4 h-4 rounded border-gray-300 text-rose-600 focus:ring-rose-400 flex-shrink-0" />
                    <span className="text-xs text-gray-600 leading-relaxed">
                      I agree to Aster Homecare UK processing my personal and health-related information to arrange a care assessment,
                      in accordance with the{' '}
                      <a href="/privacy" className="text-rose-600 underline hover:text-rose-800">Privacy Policy</a>.
                      I understand my data will be kept securely and I can withdraw consent at any time by contacting the office.
                    </span>
                  </label>
                  <FieldError msg={errors.consent?.message} />
                </div>

                {serverError && (
                  <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">{serverError}</div>
                )}
              </div>
            )}

            {/* ── Navigation ── */}
            <div className="flex items-center justify-between mt-10 pt-6 border-t border-gray-100">
              {step > 0 ? (
                <button type="button" onClick={() => setStep(s => s - 1)}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-gray-400 hover:text-rose-600 transition-colors py-3 px-4 rounded-xl hover:bg-rose-50">
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>
              ) : <div />}

              {step < STEPS.length - 1 ? (
                <button type="button" onClick={next}
                  className="inline-flex items-center gap-2 text-sm font-bold text-white px-8 py-3.5 rounded-2xl transition-all hover:scale-[1.02]"
                  style={{ background: 'linear-gradient(135deg, #BE123C, #E11D48, #F43F5E)', boxShadow: '0 4px 18px rgba(225,29,72,0.35)' }}>
                  Continue
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button type="submit" disabled={loading}
                  className="inline-flex items-center gap-2 text-sm font-bold text-white px-8 py-3.5 rounded-2xl transition-all hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{ background: 'linear-gradient(135deg, #BE123C, #E11D48, #F43F5E)', boxShadow: '0 4px 18px rgba(225,29,72,0.35)' }}>
                  {loading
                    ? <><Loader2 className="w-4 h-4 animate-spin" />Submitting…</>
                    : <>Submit Assessment Request <ArrowRight className="w-4 h-4" /></>}
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Trust footer */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8 text-xs text-gray-400">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-rose-400" />
            <span>CQC Registered Provider</span>
          </div>
          <span className="hidden sm:block opacity-30">·</span>
          <div className="flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-rose-400" />
            <a href="tel:+441753000000" className="hover:text-rose-600 transition-colors">01753 000000</a>
          </div>
          <span className="hidden sm:block opacity-30">·</span>
          <span>Free · No obligation · Confidential</span>
        </div>
      </main>
    </div>
  )
}
