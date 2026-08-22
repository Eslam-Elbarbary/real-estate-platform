import Image from 'next/image';
import { Star } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { marketingServicesCopy, marketingTestimonials } from '../config';

export function MarketingTestimonials() {
  return (
    <section className="bg-white py-12 sm:py-16">
      <Container marketing>
        <h2 className="text-center text-xl font-extrabold text-ink-950 sm:text-2xl">
          {marketingServicesCopy.testimonialsTitle}
        </h2>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {marketingTestimonials.map((item) => (
            <li
              key={item.id}
              className="rounded-xl border border-[#e8e8e8] bg-white p-5"
            >
              <div className="flex items-center gap-3">
                <div className="relative size-12 shrink-0 overflow-hidden rounded-full bg-surface-100">
                  <Image
                    src={item.avatarSrc}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                </div>
                <div>
                  <p className="text-sm font-extrabold text-ink-950">
                    {item.name}
                  </p>
                  <p className="text-xs text-ink-500">{item.company}</p>
                </div>
              </div>
              <div
                className="mt-3 flex gap-0.5 text-accent-500"
                aria-label={`${item.rating} من 5`}
              >
                {Array.from({ length: item.rating }).map((_, index) => (
                  <Star
                    key={index}
                    size={14}
                    fill="currentColor"
                    aria-hidden
                  />
                ))}
              </div>
              <p className="mt-3 text-sm leading-7 text-ink-700">{item.quote}</p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
