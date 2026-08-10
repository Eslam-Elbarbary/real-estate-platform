import { marketingServiceSections } from '../config';
import { MarketingHero } from './marketing-hero';
import { MarketingLeadStatsSection } from './marketing-stats';
import { MarketingServiceSection } from './marketing-service-section';
import { MarketingTestimonials } from './marketing-testimonials';
import { MarketingPartners } from './marketing-partners';
import { MarketingFinalCTA } from './marketing-final-cta';

export function MarketingServicesPage() {
  return (
    <div className="bg-white">
      <MarketingHero />
      <MarketingLeadStatsSection />
      <div id="marketing-services">
        {marketingServiceSections.map((section, index) => (
          <MarketingServiceSection
            key={section.id}
            section={section}
            priority={index === 0}
          />
        ))}
      </div>
      <MarketingTestimonials />
      <MarketingPartners />
      <MarketingFinalCTA />
    </div>
  );
}
