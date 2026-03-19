import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { getTeam, getAssetUrl } from '@/lib/directus'
import type { DirectusTeamMember } from '@/lib/directus'

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

function TeamMemberCard({ member }: { member: DirectusTeamMember }) {
  return (
    <div className="bg-white rounded-2xl p-8 flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-1" style={{ border: '1px solid #E2E8F0', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
      {member.photo ? (
        <div className="relative w-24 h-24 rounded-full overflow-hidden mb-5 ring-4 ring-blue-200">
          <Image
            src={getAssetUrl(member.photo, { width: '192', height: '192', fit: 'cover' })}
            alt={member.name}
            width={96}
            height={96}
            className="object-cover w-full h-full"
          />
        </div>
      ) : (
        <div className="w-24 h-24 rounded-full flex items-center justify-center mb-5 ring-4 ring-blue-200"
          style={{ background: 'linear-gradient(135deg, #2563EB, #D97706)' }}>
          <span className="text-white text-2xl font-bold">
            {getInitials(member.name)}
          </span>
        </div>
      )}

      <h3 className="text-lg font-bold mb-1" style={{ color: '#0F172A' }}>{member.name}</h3>
      <p className="text-sm font-semibold mb-3" style={{ color: '#2563EB' }}>{member.role}</p>
      {member.bio && (
        <p className="text-sm leading-relaxed line-clamp-3" style={{ color: '#64748B' }}>{member.bio}</p>
      )}
    </div>
  )
}

export async function TeamPreview() {
  const team = await getTeam()
  const displayTeam = team.slice(0, 3)

  return (
    <section className="section-padding" style={{ background: '#F8FAFC' }} aria-labelledby="team-preview-heading">
      <div className="container-custom">
        <div className="text-center mb-12">
          <p className="font-semibold text-sm uppercase tracking-widest mb-3" style={{ color: '#D97706' }}>
            Our People
          </p>
          <h2
            id="team-preview-heading"
            className="text-3xl md:text-4xl font-bold text-balance"
            style={{ color: '#0F172A' }}
          >
            Meet Our Care Team
          </h2>
          <p className="mt-4 max-w-xl mx-auto leading-relaxed" style={{ color: '#64748B' }}>
            Our dedicated team of carers, coordinators, and managers are united
            by a passion for outstanding care.
          </p>
        </div>

        {displayTeam.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
            {displayTeam.map((member) => (
              <TeamMemberCard key={member.id} member={member} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-sm mb-6" style={{ color: '#64748B' }}>
              Meet the dedicated professionals behind Aster Homecare UK.
            </p>
          </div>
        )}

        <div className="text-center">
          <Link
            href="/about"
            className="inline-flex items-center gap-2 font-semibold transition-colors group text-base"
            style={{ color: '#2563EB' }}
            aria-label="Meet the full Aster Homecare team"
          >
            Meet the Full Team
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  )
}
