import type { Metadata } from 'next'
import { AssessmentForm } from '@/components/AssessmentForm'

export const metadata: Metadata = {
  title: 'Free Home Care Assessment | Aster Homecare UK',
  description:
    'Book your free, no-obligation home care assessment with Aster Homecare UK. CQC-registered care coordinators visit you at home across Slough, Windsor, Maidenhead, Bracknell, Reading and Berkshire.',
  openGraph: {
    title: 'Free Home Care Assessment — Aster Homecare UK',
    description: 'Book a free, no-obligation home care assessment. We come to you — no commitment required.',
  },
}

export default function AssessmentPage() {
  return <AssessmentForm />
}
