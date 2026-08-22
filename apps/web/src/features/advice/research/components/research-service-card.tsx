import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { researchRequestHref } from '../config';
import type { ResearchService } from '../types';

interface ResearchServiceCardProps {
  service: ResearchService;
}

export function ResearchServiceCard({ service }: ResearchServiceCardProps) {
  return (
    <article
      data-testid={`research-service-${service.id}`}
      className="flex h-full flex-col border border-[#ececec] bg-white px-5 py-7 text-center shadow-sm"
    >
      <div className="flex min-h-8 items-center justify-center gap-2">
        <h3 className="text-base font-extrabold text-ink-950">{service.title}</h3>
        {service.badge ? (
          <Badge variant={service.badge.variant}>{service.badge.label}</Badge>
        ) : null}
      </div>
      <p className="mt-3 flex-1 text-sm leading-7 text-ink-600">{service.description}</p>
      <Link
        href={researchRequestHref(service.id)}
        className="mt-6 inline-flex h-10 items-center justify-center rounded-full border border-brand-600 px-5 text-sm font-bold text-brand-700 hover:bg-brand-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
      >
        {service.ctaLabel}
      </Link>
    </article>
  );
}
