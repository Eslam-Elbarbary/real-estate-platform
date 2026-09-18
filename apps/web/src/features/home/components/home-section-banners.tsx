import Link from 'next/link';
import Image from 'next/image';
import { Container } from '@/components/ui/container';
import { getPublicBanners } from '@/features/banners';

/** Homepage mid-page marketing banners from CMS. Hidden when empty. */
export async function HomeSectionBanners() {
  const banners = await getPublicBanners('HOME_SECTION');
  if (banners.length === 0) {
    return null;
  }

  return (
    <section className="bg-white py-6 sm:py-8">
      <Container className="space-y-4">
        {banners.map((banner) => {
          const desktop = banner.imageUrl;
          const mobile = banner.mobileImageUrl?.trim() || desktop;
          const hasCta = Boolean(
            banner.buttonText?.trim() && banner.buttonUrl?.trim(),
          );

          return (
            <div
              key={banner.id}
              className="relative h-48 overflow-hidden rounded-xl sm:h-56 lg:h-64"
            >
              <Image
                src={desktop}
                alt={banner.title}
                fill
                sizes="100vw"
                className="hidden object-cover md:block"
                unoptimized={desktop.startsWith('http')}
              />
              <Image
                src={mobile}
                alt={banner.title}
                fill
                sizes="100vw"
                className="object-cover md:hidden"
                unoptimized={mobile.startsWith('http')}
              />
              <div className="absolute inset-0 bg-black/35" />
              <div className="absolute inset-0 flex flex-col items-start justify-end gap-2 p-5 text-white sm:p-6">
                <h2 className="text-xl font-bold sm:text-2xl">{banner.title}</h2>
                {banner.description ? (
                  <p className="max-w-2xl text-sm text-white/90">
                    {banner.description}
                  </p>
                ) : null}
                {hasCta ? (
                  <Link
                    href={banner.buttonUrl!}
                    className="inline-flex h-10 items-center rounded-full bg-brand-600 px-4 text-sm font-bold hover:bg-brand-700"
                  >
                    {banner.buttonText}
                  </Link>
                ) : null}
              </div>
            </div>
          );
        })}
      </Container>
    </section>
  );
}
