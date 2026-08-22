import Image from 'next/image';
import { Container } from '@/components/ui/container';
import { getButtonClassName } from '@/components/ui/button';
import { marketingPartners, marketingServicesCopy } from '../config';

export function MarketingPartners() {
  return (
    <section className="bg-white pb-6 pt-4 sm:pb-8">
      <Container marketing>
        <ul className="mx-auto grid max-w-5xl grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6 md:gap-4">
          {marketingPartners.map((partner) => (
            <li
              key={partner.id}
              className="flex items-center justify-center rounded-md border border-[#f0f0f0] bg-white px-2 py-3"
            >
              <Image
                src={partner.logoSrc}
                alt={partner.name}
                width={160}
                height={58}
                className="h-8 w-auto opacity-80 sm:h-9"
              />
            </li>
          ))}
        </ul>

        <div className="mt-10 flex justify-center">
          <a
            href="#marketing-lead-form"
            className={getButtonClassName({
              variant: 'outline',
              className:
                'h-11 rounded-full border-brand-200 px-8 font-bold text-brand-700 hover:bg-brand-50',
            })}
          >
            {marketingServicesCopy.partnersCta}
          </a>
        </div>
      </Container>
    </section>
  );
}
