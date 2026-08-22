import Image from 'next/image';
import Link from 'next/link';
import { AppStoreBadges } from '@/components/ui/app-store-badges';
import { Container } from '@/components/ui/container';
import { routes } from '@/config/routes';
import { ProfileCompletionAlert } from '@/features/my-properties/components/profile-completion-alert';
import { activityCopy } from '../copy';
import type { UserNotification } from '../types';

interface NotificationsPageProps {
  notifications: UserNotification[];
}

export function NotificationsPage({ notifications }: NotificationsPageProps) {
  return (
    <div className="bg-white">
      <ProfileCompletionAlert />

      <Container dashboard className="py-6">
        <div className="flex flex-col items-center justify-between gap-6 overflow-hidden rounded-xl bg-brand-700 px-6 py-8 text-white sm:flex-row sm:px-10">
          <div className="max-w-xl text-center sm:text-start">
            <Link
              href={routes.compounds.root}
              className="block rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
            >
              <h2 className="text-xl font-extrabold sm:text-2xl">
                {activityCopy.notifications.promoTitle}
              </h2>
              <p className="mt-2 text-sm leading-7 text-white/90">
                {activityCopy.notifications.promoDescription}
              </p>
            </Link>
            <AppStoreBadges className="mt-4 justify-center sm:justify-start" size="sm" />
          </div>
          <Link
            href={routes.compounds.root}
            className="relative h-36 w-40 shrink-0 sm:h-40 sm:w-48"
            aria-label={activityCopy.notifications.promoTitle}
          >
            <Image
              src="/assets/home/app/phones.webp"
              alt=""
              fill
              className="object-contain"
              sizes="192px"
              priority
            />
          </Link>
        </div>
      </Container>

      <div className="border-y border-[#e8e8e8] bg-[#f5f5f5]">
        <Container dashboard className="py-3">
          <h1 className="text-base font-extrabold text-ink-900">
            {activityCopy.notifications.title}
          </h1>
        </Container>
      </div>

      <Container dashboard className="pb-20 pt-10">
        {notifications.length === 0 ? (
          <div className="flex min-h-[280px] items-center justify-center border-b border-[#e5e5e5] pb-16">
            <p className="text-base font-semibold text-ink-500">
              {activityCopy.notifications.empty}
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-[#eeeeee]">
            {notifications.map((item) => (
              <NotificationRow key={item.id} notification={item} />
            ))}
          </ul>
        )}
      </Container>
    </div>
  );
}

/** Internal reusable row for future non-empty states / tests. */
export function NotificationRow({
  notification,
}: {
  notification: UserNotification;
}) {
  const content = (
    <div className="flex flex-col gap-1 py-4">
      <p className="text-sm font-bold text-ink-950">{notification.title}</p>
      <p className="text-sm leading-6 text-ink-600">{notification.body}</p>
    </div>
  );

  if (notification.href) {
    return (
      <li>
        <Link href={notification.href} className="block hover:bg-surface-50">
          {content}
        </Link>
      </li>
    );
  }

  return <li>{content}</li>;
}
