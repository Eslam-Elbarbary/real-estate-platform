import Image from 'next/image';
import Link from 'next/link';
import { Container } from '@/components/ui/container';
import { uiLabels } from '@/config/labels';
import { knowItems } from '@/features/home/config/know-items';
import { cn } from '@/lib/utils/cn';

export function KnowSection() {
  return (
    <section className="bg-white py-8 sm:py-10">
      <Container>
        <h2 className="mb-4 text-lg font-bold text-ink-900 sm:text-xl">
          {uiLabels.knowHeading}
        </h2>

        <div className="grid auto-rows-fr gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {knowItems.map((item) => (
            <article
              key={item.id}
              className="flex h-[180px] overflow-hidden rounded-[19px] bg-surface-50 sm:h-[190px] lg:h-[196px]"
            >
              <div
                className={cn(
                  'flex min-w-0 flex-1 flex-col justify-center gap-2 px-5 py-4 sm:px-6',
                  item.imageSide === 'start' && 'order-2',
                )}
              >
                <h3 className="text-sm font-bold text-ink-900 sm:text-[15px]">
                  {item.title}
                </h3>
                <p className="text-xs leading-5 text-ink-600 sm:text-[13px] sm:leading-6">
                  {item.description}
                </p>
                {item.href ? (
                  <Link
                    href={item.href}
                    className="mt-0.5 inline-flex text-xs font-semibold text-brand-600 hover:text-brand-700 sm:text-[13px]"
                  >
                    {uiLabels.learnMore}
                  </Link>
                ) : (
                  <span className="mt-0.5 inline-flex cursor-default text-xs font-semibold text-ink-400 sm:text-[13px]">
                    {uiLabels.learnMore}
                  </span>
                )}
              </div>

              <div
                className={cn(
                  'relative w-[26%] min-w-[88px] shrink-0 self-stretch sm:w-[28%]',
                  item.imageSide === 'start' && 'order-1',
                )}
              >
                <Image
                  src={item.imageSrc}
                  alt={item.imageAlt}
                  fill
                  sizes="140px"
                  className="object-contain object-center p-3 sm:p-4"
                />
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
