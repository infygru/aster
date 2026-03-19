export interface Service {
  id: string
  title: string
  slug: string
  description: string
  icon?: string
  features?: string[]
  color?: 'blue' | 'teal' | 'gold'
  image?: string
  long_description?: string
}

export interface Testimonial {
  id: string
  quote: string
  author_name: string
  author_relation: string
  author_location?: string
  rating?: number
}

export interface JobOpening {
  id: string
  title: string
  slug: string
  department?: string
  location: string
  type: 'full-time' | 'part-time' | 'flexible'
  description: string
  requirements?: string[]
  salary_range?: string
  date_posted: string
  closing_date?: string
}

export interface TeamMember {
  id: string
  name: string
  role: string
  bio?: string
  photo?: string
  nominated_individual: boolean
}

export interface ContactFormData {
  name: string
  email: string
  phone?: string
  subject: 'general' | 'assessment' | 'complaint' | 'other'
  message: string
  consent: boolean
}

export interface CareerFormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  position: 'carer' | 'senior-carer' | 'care-coordinator' | 'other'
  experience: 'none' | 'less-1' | '1-3' | '3-plus'
  rightToWork: boolean
  dbsConsent: boolean
  message?: string
}
