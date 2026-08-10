import { Container } from '@/components/ui/container';
import { ProfileCompletionAlert } from '@/features/my-properties/components/profile-completion-alert';
import type { Location } from '@/types';
import { activityCopy } from '../copy';
import type { PropertyAlert } from '../types';
import { AlertSubscribeForm } from './alert-subscribe-form';
import { AlertRow } from './alert-row';

interface AlertsPageProps {
  alerts: PropertyAlert[];
  locations: Location[];
}

export function AlertsPage({ alerts, locations }: AlertsPageProps) {
  return (
    <div className="bg-white pb-16">
      <ProfileCompletionAlert />
      <Container dashboard className="space-y-6 py-8 sm:py-10">
        <h1 className="text-3xl font-extrabold text-ink-950">
          {activityCopy.alerts.title}
        </h1>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(280px,320px)] lg:items-start">
          <section aria-labelledby="alerts-regions-title">
            <h2
              id="alerts-regions-title"
              className="mb-4 text-lg font-extrabold text-ink-950"
            >
              {activityCopy.alerts.regionsTitle}
            </h2>

            <div className="overflow-x-auto rounded-xl border border-[#e5e5e5]">
              <table className="min-w-full text-sm">
                <thead className="bg-[#f5f5f5] text-ink-700">
                  <tr>
                    <th className="px-3 py-3 text-start font-bold">
                      {activityCopy.alerts.location}
                    </th>
                    <th className="px-3 py-3 text-start font-bold">
                      {activityCopy.alerts.type}
                    </th>
                    <th className="px-3 py-3 text-start font-bold">
                      {activityCopy.alerts.section}
                    </th>
                    <th className="px-3 py-3 text-start font-bold">
                      {activityCopy.alerts.minPrice}
                    </th>
                    <th className="px-3 py-3 text-start font-bold">
                      {activityCopy.alerts.maxPrice}
                    </th>
                    <th className="px-3 py-3 text-center font-bold">
                      <span className="sr-only">الحالة</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {alerts.map((alert, index) => (
                    <AlertRow
                      key={alert.id}
                      alert={alert}
                      zebra={index % 2 === 1}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <AlertSubscribeForm locations={locations} />
        </div>
      </Container>
    </div>
  );
}
