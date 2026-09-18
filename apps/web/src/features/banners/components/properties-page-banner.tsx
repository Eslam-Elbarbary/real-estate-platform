import Image from 'next/image';
import Link from 'next/link';
import { getPublicBanners } from '@/features/banners';

/** Properties search page marketing banner. Hidden when none are active. */
export async function PropertiesPageBanner() {
  const banners = await getPublicBanners('PROPERTIES_PAGE');
  const banner = banners[0];
  if (!banner) {
    return null;
  }

  const desktop = banner.imageUrl;
  const mobile = banner.mobileImageUrl?.trim() || desktop;
  const hasCta = Boolean(banner.buttonText?.trim() && banner.buttonUrl?.trim());

  return (
    <div className="relative mb-4 h-36 overflow-hidden rounded-xl sm:h-44">
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
      <div className="absolute inset-0 bg-black/40" />
      <div className="absolute inset-0 flex flex-col items-start justify-end gap-2 p-4 text-white sm:p-5">
        <p className="text-lg font-bold sm:text-xl">{banner.title}</p>
        {banner.description ? (
          <p className="max-w-2xl text-xs text-white/90 sm:text-sm">
            {banner.description}
          </p>
        ) : null}
        {hasCta ? (
          <Link
            href={banner.buttonUrl!}
            className="inline-flex h-9 items-center rounded-full bg-brand-600 px-3 text-xs font-bold hover:bg-brand-700"
          >
            {banner.buttonText}
          </Link>
        ) : null}
      </div>
    </div>
  );
}
