'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useState } from 'react'
import { Send, Loader2, CheckCircle } from 'lucide-react'

const schema = z.object({
  firstName: z.string().min(2, 'Please enter your first name'),
  lastName: z.string().min(2, 'Please enter your last name'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  position: z.enum(['carer', 'senior-carer', 'care-coordinator', 'other']),
  experience: z.enum(['none', 'less-1', '1-3', '3-plus']),
  rightToWork: z.boolean().refine((v) => v, { message: 'You must confirm your right to work in the UK' }),
  dbsConsent: z.boolean().refine((v) => v, { message: 'DBS check consent is required' }),
  message: z.string().optional(),
})

type FormData = z.infer<typeof schema>

export function CareersForm() {
  const [isSubmitted, setIsSubmitted] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: FormData) => {
    await new Promise((r) => setTimeout(r, 1500))
    console.log('Careers form submission:', data)
    setIsSubmitted(true)
    reset()
  }

  if (isSubmitted) {
    return (
      <div className="text-center py-8">
        <CheckCircle className="w-16 h-16 text-violet-600 mx-auto mb-4" aria-hidden="true" />
        <h3 className="text-xl font-bold text-gray-900 mb-2">Application Received!</h3>
        <p className="text-gray-600 text-sm">
          Thank you for your interest in joining Aster Homecare UK. We&apos;ll
          be in touch within 2 working days.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate aria-label="Career application form">
      <div className="grid sm:grid-cols-2 gap-5">
        {(['firstName', 'lastName'] as const).map((field) => (
          <div key={field}>
            <label htmlFor={`careers-${field}`} className="block text-sm font-medium text-gray-700 mb-1.5">
              {field === 'firstName' ? 'First Name' : 'Last Name'} <span className="text-red-500">*</span>
            </label>
            <input
              id={`careers-${field}`}
              type="text"
              {...register(field)}
              className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
              aria-invalid={!!errors[field]}
            />
            {errors[field] && <p role="alert" className="mt-1 text-xs text-red-600">{errors[field]?.message}</p>}
          </div>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="careers-email" className="block text-sm font-medium text-gray-700 mb-1.5">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            id="careers-email"
            type="email"
            {...register('email')}
            className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
          />
          {errors.email && <p role="alert" className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
        </div>
        <div>
          <label htmlFor="careers-phone" className="block text-sm font-medium text-gray-700 mb-1.5">
            Phone <span className="text-red-500">*</span>
          </label>
          <input
            id="careers-phone"
            type="tel"
            {...register('phone')}
            className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
          />
          {errors.phone && <p role="alert" className="mt-1 text-xs text-red-600">{errors.phone.message}</p>}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="careers-position" className="block text-sm font-medium text-gray-700 mb-1.5">
            Position of Interest <span className="text-red-500">*</span>
          </label>
          <select
            id="careers-position"
            {...register('position')}
            className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white"
          >
            <option value="">Select position...</option>
            <option value="carer">Care Worker</option>
            <option value="senior-carer">Senior Carer</option>
            <option value="care-coordinator">Care Coordinator</option>
            <option value="other">Other</option>
          </select>
          {errors.position && <p role="alert" className="mt-1 text-xs text-red-600">{errors.position.message}</p>}
        </div>
        <div>
          <label htmlFor="careers-experience" className="block text-sm font-medium text-gray-700 mb-1.5">
            Care Experience <span className="text-red-500">*</span>
          </label>
          <select
            id="careers-experience"
            {...register('experience')}
            className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white"
          >
            <option value="">Select experience...</option>
            <option value="none">No experience (will train)</option>
            <option value="less-1">Less than 1 year</option>
            <option value="1-3">1–3 years</option>
            <option value="3-plus">3+ years</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="careers-message" className="block text-sm font-medium text-gray-700 mb-1.5">
          Additional Information <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        <textarea
          id="careers-message"
          rows={3}
          {...register('message')}
          className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
          placeholder="Tell us a bit about yourself and why you want to join our team..."
        />
      </div>

      <div className="space-y-3">
        {[
          { field: 'rightToWork' as const, label: 'I confirm I have the right to work in the United Kingdom.' },
          { field: 'dbsConsent' as const, label: 'I consent to an Enhanced DBS check being carried out as part of the recruitment process.' },
        ].map(({ field, label }) => (
          <div key={field}>
            <div className="flex items-start gap-3">
              <input
                id={`careers-${field}`}
                type="checkbox"
                {...register(field)}
                className="mt-0.5 w-4 h-4 text-violet-600 border-gray-300 rounded focus:ring-amber-400"
              />
              <label htmlFor={`careers-${field}`} className="text-xs text-gray-600 leading-relaxed">
                {label} <span className="text-red-500">*</span>
              </label>
            </div>
            {errors[field] && <p role="alert" className="mt-1 text-xs text-red-600 ml-7">{errors[field]?.message}</p>}
          </div>
        ))}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
      >
        {isSubmitting ? (
          <><Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" /> Submitting...</>
        ) : (
          <><Send className="w-4 h-4" aria-hidden="true" /> Submit Application</>
        )}
      </button>
    </form>
  )
}
