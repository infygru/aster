'use client'

import Link from 'next/link'
import { Shield, ExternalLink } from 'lucide-react'

interface CQCBadgeProps {
  variant?: 'hero' | 'footer' | 'inline'
}

export function CQCBadge({ variant = 'inline' }: CQCBadgeProps) {
  if (variant === 'hero') {
    return (
      <Link
        href="https://www.cqc.org.uk/provider/1-20633610286"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm text-white border border-white/20 rounded-xl py-3 px-5 hover:bg-white/20 transition-colors group"
        aria-label="View Aster Homecare UK on the CQC website (opens in new tab)"
      >
        <Shield className="w-6 h-6 text-amber-400" aria-hidden="true" />
        <div className="text-left">
          <p className="text-xs text-blue-200 leading-none mb-0.5">Regulated by</p>
          <p className="font-bold text-sm leading-none">Care Quality Commission</p>
        </div>
        <ExternalLink className="w-3.5 h-3.5 text-blue-300 group-hover:text-white ml-1" aria-hidden="true" />
      </Link>
    )
  }

  if (variant === 'footer') {
    return (
      <Link
        href="https://www.cqc.org.uk/provider/1-20633610286"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg py-2 px-3 hover:bg-white/10 transition-colors"
        aria-label="View CQC registration (opens in new tab)"
      >
        <Shield className="w-4 h-4 text-amber-400" aria-hidden="true" />
        <div>
          <p className="text-[10px] text-blue-300 leading-none">CQC Registered</p>
          <p className="text-xs font-medium text-white leading-none mt-0.5">ID: 1-20633610286</p>
        </div>
      </Link>
    )
  }

  return (
    <span className="inline-flex items-center gap-1.5 text-sm text-gray-700">
      <Shield className="w-4 h-4 text-brand-teal" aria-hidden="true" />
      <span>CQC Registered</span>
    </span>
  )
}
