import { researchCopy } from '../config';
import type { ResearchService } from '../types';
import { ResearchServiceCard } from './research-service-card';

interface ResearchServicesProps {
  services: ResearchService[];
}

export function ResearchServices({ services }: ResearchServicesProps) {
  return (
    <section
      id="research-services"
      className="scroll-mt-24"
      aria-labelledby="research-services-heading"
    >
      <h2 id="research-services-heading" className="sr-only">
        {researchCopy.servicesHeading}
      </h2>
      <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {services.map((service) => (
          <li key={service.id}>
            <ResearchServiceCard service={service} />
          </li>
        ))}
      </ul>
    </section>
  );
}
