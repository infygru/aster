'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useState } from 'react'
import { Send, Loader2, CheckCircle } from 'lucide-react'

const schema = z.object({
  name: z.string().min(2, 'Please enter your full name'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  subject: z.enum(['general', 'assessment', 'complaint', 'other'], {
    errorMap: () => ({ message: 'Please select a subject' }),
  }),
  message: z.string().min(10, 'Please provide more detail (at least 10 characters)'),
  consent: z.boolean().refine((val) => val, {
    message: 'You must agree to our privacy policy to submit this form',
  }),
})

type FormData = z.infer<typeof schema>

export function ContactForm() {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    setSubmitError(null)
    try {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error('Submission failed')
    setIsSubmitted(true)
    reset()
    } catch {
      setSubmitError('Sorry, something went wrong. Please try again or call us directly.')
    }
  }

  if (isSubmitted) {
    return (
      <div className="text-center py-8">
        <CheckCircle className="w-16 h-16 text-violet-600 mx-auto mb-4" aria-hidden="true" />
        <h3 className="text-xl font-bold text-gray-900 mb-2">Message Sent!</h3>
        <p className="text-gray-600 text-sm mb-6">
          Thank you for contacting us. A member of our team will be in touch
          within 1 working day.
        </p>
        <button
          onClick={() => setIsSubmitted(false)}
          className="text-amber-600 hover:text-stone-900 text-sm font-medium transition-colors"
        >
          Send another message
        </button>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5"
      noValidate
      aria-label="Contact form"
    >
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="contact-name" className="block text-sm font-medium text-gray-700 mb-1.5">
            Full Name <span aria-label="required" className="text-red-500">*</span>
          </label>
          <input
            id="contact-name"
            type="text"
            autoComplete="name"
            {...register('name')}
            className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? 'contact-name-error' : undefined}
          />
          {errors.name && (
            <p id="contact-name-error" role="alert" className="mt-1 text-xs text-red-600">
              {errors.name.message}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="contact-email" className="block text-sm font-medium text-gray-700 mb-1.5">
            Email Address <span aria-label="required" className="text-red-500">*</span>
          </label>
          <input
            id="contact-email"
            type="email"
            autoComplete="email"
            {...register('email')}
            className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'contact-email-error' : undefined}
          />
          {errors.email && (
            <p id="contact-email-error" role="alert" className="mt-1 text-xs text-red-600">
              {errors.email.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="contact-phone" className="block text-sm font-medium text-gray-700 mb-1.5">
            Phone Number <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <input
            id="contact-phone"
            type="tel"
            autoComplete="tel"
            {...register('phone')}
            className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
          />
        </div>
        <div>
          <label htmlFor="contact-subject" className="block text-sm font-medium text-gray-700 mb-1.5">
            Subject <span aria-label="required" className="text-red-500">*</span>
          </label>
          <select
            id="contact-subject"
            {...register('subject')}
            className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all bg-white"
            aria-invalid={!!errors.subject}
          >
            <option value="">Select a subject...</option>
            <option value="assessment">Free Care Assessment</option>
            <option value="general">General Enquiry</option>
            <option value="complaint">Complaint or Concern</option>
            <option value="other">Other</option>
          </select>
          {errors.subject && (
            <p role="alert" className="mt-1 text-xs text-red-600">{errors.subject.message}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="contact-message" className="block text-sm font-medium text-gray-700 mb-1.5">
          Message <span aria-label="required" className="text-red-500">*</span>
        </label>
        <textarea
          id="contact-message"
          rows={4}
          {...register('message')}
          className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all resize-none"
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? 'contact-message-error' : undefined}
          placeholder="Please describe your care needs or enquiry..."
        />
        {errors.message && (
          <p id="contact-message-error" role="alert" className="mt-1 text-xs text-red-600">
            {errors.message.message}
          </p>
        )}
      </div>

      <div>
        <div className="flex items-start gap-3">
          <input
            id="contact-consent"
            type="checkbox"
            {...register('consent')}
            className="mt-0.5 w-4 h-4 text-violet-600 border-gray-300 rounded focus:ring-amber-400"
            aria-invalid={!!errors.consent}
          />
          <label htmlFor="contact-consent" className="text-xs text-gray-600 leading-relaxed">
            I agree to Aster Homecare UK processing my personal data in accordance
            with the{' '}
            <a href="/privacy" className="text-violet-600 hover:underline">
              Privacy Policy
            </a>
            . Data is processed securely and never shared with third parties without
            consent. <span aria-label="required" className="text-red-500">*</span>
          </label>
        </div>
        {errors.consent && (
          <p role="alert" className="mt-1 text-xs text-red-600 ml-7">
            {errors.consent.message}
          </p>
        )}
      </div>

      {submitError && (
        <p role="alert" className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
          {submitError}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors"
        aria-label={isSubmitting ? 'Sending message...' : 'Send message'}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
            Sending...
          </>
        ) : (
          <>
            <Send className="w-4 h-4" aria-hidden="true" />
            Send Message
          </>
        )}
      </button>
    </form>
  )
}
