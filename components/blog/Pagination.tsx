import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationProps {
  currentPage: number
  totalPages: number
  basePath: string // e.g. '/blog' or '/blog/category/care-tips'
}

export function Pagination({ currentPage, totalPages, basePath }: PaginationProps) {
  if (totalPages <= 1) return null

  const href = (page: number) => (page === 1 ? basePath : `${basePath}?page=${page}`)

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1
  )

  return (
    <nav aria-label="Pagination" className="flex items-center justify-center gap-2 mt-12">
      {/* Prev */}
      {currentPage > 1 ? (
        <Link
          href={href(currentPage - 1)}
          className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:border-brand-teal hover:text-brand-teal transition-colors"
          aria-label="Previous page"
        >
          <ChevronLeft className="w-4 h-4" aria-hidden="true" />
          Prev
        </Link>
      ) : (
        <span className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-300 bg-white border border-gray-100 rounded-lg cursor-not-allowed">
          <ChevronLeft className="w-4 h-4" aria-hidden="true" />
          Prev
        </span>
      )}

      {/* Page numbers */}
      {pages.map((page, i) => {
        const prev = pages[i - 1]
        return (
          <span key={page} className="flex items-center gap-2">
            {prev && page - prev > 1 && (
              <span className="text-gray-400 select-none">…</span>
            )}
            {page === currentPage ? (
              <span
                aria-current="page"
                className="w-9 h-9 flex items-center justify-center text-sm font-semibold text-white bg-brand-teal rounded-lg"
              >
                {page}
              </span>
            ) : (
              <Link
                href={href(page)}
                className="w-9 h-9 flex items-center justify-center text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:border-brand-teal hover:text-brand-teal transition-colors"
                aria-label={`Page ${page}`}
              >
                {page}
              </Link>
            )}
          </span>
        )
      })}

      {/* Next */}
      {currentPage < totalPages ? (
        <Link
          href={href(currentPage + 1)}
          className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:border-brand-teal hover:text-brand-teal transition-colors"
          aria-label="Next page"
        >
          Next
          <ChevronRight className="w-4 h-4" aria-hidden="true" />
        </Link>
      ) : (
        <span className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-300 bg-white border border-gray-100 rounded-lg cursor-not-allowed">
          Next
          <ChevronRight className="w-4 h-4" aria-hidden="true" />
        </span>
      )}
    </nav>
  )
}
