import Image from 'next/image';
import Link from 'next/link';
import { Container } from '@/components/ui/container';
import { getButtonClassName } from '@/components/ui/button';
import { uiLabels } from '@/config/labels';
import { routes } from '@/config/routes';
import { siteConfig } from '@/config/site';

export function AiValuation() {
  return (
    <section className="bg-white py-5 sm:py-7">
      <Container>
        <div className="flex flex-col items-center gap-6 rounded-[22px] bg-surface-50 px-5 py-7 sm:flex-row sm:justify-between sm:px-10 sm:py-9">
          <div className="max-w-xl text-center sm:text-start">
            <h2 className="text-lg font-bold text-ink-900 sm:text-xl">
              {uiLabels.aiTitlePrefix}{' '}
              <span className="text-brand-600">{uiLabels.aiTitleAccent}</span>
            </h2>
            <p className="mt-2 text-sm leading-6 text-ink-600">
              {uiLabels.aiDescription}
            </p>
            <Link
              href={routes.addListing}
              className={getButtonClassName({
                className: 'mt-4 inline-flex',
                size: 'medium',
              })}
            >
              {uiLabels.aiCta}
            </Link>
          </div>

          <div className="relative h-48 w-36 overflow-hidden rounded-[1.75rem] border-[5px] border-ink-900 bg-white shadow-md sm:h-52 sm:w-40">
            <Image
              src={siteConfig.assets.aiPhone}
              alt="تقييم عقاري على الهاتف"
              fill
              sizes="160px"
              className="object-cover"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
