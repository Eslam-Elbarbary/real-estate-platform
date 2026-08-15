import Link from 'next/link';
import { Container } from '@/components/ui/container';
import { AdviceBreadcrumb } from '@/features/advice/components/advice-breadcrumb';
import { routes } from '@/config/routes';
import { researchCopy } from '../config';
import type { ResearchRequestDefinition } from '../types';
import { ResearchRequestForm } from './research-request-form';

interface ResearchRequestPageProps {
  definition: ResearchRequestDefinition;
}

export function ResearchRequestPage({ definition }: ResearchRequestPageProps) {
  return (
    <div className="bg-white pb-16 pt-5">
      <Container advice>
        <AdviceBreadcrumb
          items={[
            { label: researchCopy.breadcrumbHome, href: routes.home },
            { label: researchCopy.breadcrumbKnow, href: routes.advice.root },
            {
              label: researchCopy.breadcrumbResearch,
              href: routes.advice.research.root,
            },
            { label: definition.title, href: routes.advice.research.request(definition.type) },
          ]}
        />

        <div className="mx-auto mt-8 max-w-xl">
          <h1 className="text-2xl font-extrabold text-ink-950">{definition.title}</h1>
          <p className="mt-2 text-sm leading-7 text-ink-600">{definition.description}</p>
          <div className="mt-8">
            <ResearchRequestForm key={definition.type} type={definition.type} />
          </div>
          <Link
            href={routes.advice.research.root}
            className="mt-8 inline-flex text-sm font-semibold text-brand-700 hover:underline"
          >
            {researchCopy.backToResearch}
          </Link>
        </div>
      </Container>
    </div>
  );
}
