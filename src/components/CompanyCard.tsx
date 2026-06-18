import Link from 'next/link';
import Image from 'next/image';
import type { Company } from '@/lib/db/schema';

export function CompanyCard({ company }: { company: Company }) {
  return (
    <Link href={`/companies/${company.id}`} className="block group">
      <div className="card p-5 h-full flex flex-col gap-3 transition-shadow group-hover:shadow-lg">
        {/* Header row: avatar + city */}
        <div className="flex items-start justify-between gap-3">
          <div
            className="relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0"
            style={{ backgroundColor: '#1B3A52' }}
          >
            {company.logo_url ? (
              <Image src={company.logo_url} alt={company.company_name} fill className="object-contain p-1" unoptimized />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white font-bold text-xl">
                {company.company_name.charAt(0)}
              </div>
            )}
          </div>
          {company.city_region && (
            <span className="badge-navy">{company.city_region}</span>
          )}
        </div>

        {/* Name + industry */}
        <div>
          <h3 className="font-bold text-lg leading-snug" style={{ color: '#1B3A52' }}>
            {company.company_name}
          </h3>
          {company.primary_industry && (
            <span className="badge-teal mt-2 inline-block">{company.primary_industry}</span>
          )}
        </div>

        {/* Description */}
        {company.company_description && (
          <p className="text-sm text-gray-600 leading-relaxed flex-1 line-clamp-3">
            {company.company_description}
          </p>
        )}
      </div>
    </Link>
  );
}
