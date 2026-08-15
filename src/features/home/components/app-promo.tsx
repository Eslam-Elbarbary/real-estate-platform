import Image from 'next/image';
import { StoreBadges } from '@/components/ui/app-store-badges';
import { Container } from '@/components/ui/container';
import { appStoreLinks } from '@/config/app-links';
import { uiLabels } from '@/config/labels';
import { AppPhoneMockups } from './app-phone-mockups';

export function AppPromo() {
  return (
    <section className="bg-surface-50 py-9 sm:py-11">
      <Container>
        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="order-1 lg:order-2">
            <AppPhoneMockups />
          </div>

          <div className="order-2 text-center lg:order-1 lg:text-start">
            <h2 className="text-[1.65rem] font-bold text-brand-600 sm:text-[1.85rem]">
              {uiLabels.appTitle}
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-ink-700 lg:mx-0">
              {uiLabels.appDescription}
            </p>
            <p className="mt-1.5 text-xs font-semibold text-ink-700 sm:text-[13px]">
              {uiLabels.appUsers}
            </p>

            <div className="mt-5 flex flex-col items-center gap-3 sm:flex-row sm:items-start lg:justify-start">
              <div className="rounded-xl bg-white p-2.5 shadow-sm">
                <Image
                  src={appStoreLinks.qr.src}
                  alt={uiLabels.scanForApp}
                  width={96}
                  height={96}
                  className="size-24"
                />
                <p className="mt-1.5 text-center text-[10px] font-medium text-ink-600">
                  {uiLabels.scanForApp}
                </p>
              </div>

              <StoreBadges
                className="flex-col items-start gap-2.5"
                size="large"
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
