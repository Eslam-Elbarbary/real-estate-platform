import { Container } from '@/components/ui/container';
import { AdviceBreadcrumb } from '@/features/advice/components/advice-breadcrumb';
import { routes } from '@/config/routes';
import { researchCopy } from '../config';
import type { ResearchLandingView } from '../types';
import { ResearchContactCta } from './research-contact-cta';
import { ResearchHero } from './research-hero';
import { ResearchPartners } from './research-partners';
import { ResearchServices } from './research-services';
import { ResearchVideoSection } from './research-video-section';

interface ResearchPageProps {
  view: ResearchLandingView;
}

export function ResearchPage({ view }: ResearchPageProps) {
  return (
    <div className="bg-white pb-0">
      <Container advice className="pt-5">
        <AdviceBreadcrumb
          items={[
            { label: researchCopy.breadcrumbHome, href: routes.home },
            { label: researchCopy.breadcrumbKnow, href: routes.advice.root },
            {
              label: researchCopy.breadcrumbResearch,
              href: routes.advice.research.root,
            },
          ]}
        />
        <header className="mt-6 mb-8 max-w-3xl">
          <h1 className="text-xl font-extrabold text-ink-950 sm:text-2xl">
            {researchCopy.portalTitle}
          </h1>
          <p className="mt-2 text-sm font-semibold text-ink-700">
            {researchCopy.portalSubtitle}
          </p>
          <p className="mt-2 text-sm leading-7 text-ink-600">
            {researchCopy.portalIntro}
          </p>
        </header>
      </Container>

      <ResearchHero />

      <Container advice className="py-12">
        <ResearchServices services={view.services} />
        <ResearchVideoSection videos={view.videos} />
        <ResearchPartners partners={view.partners} />
      </Container>

      <ResearchContactCta />
    </div>
  );
}
