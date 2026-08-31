import { Card, CardContent, CardHeader } from '@/components/ui/card';
import type { AdminPropertyOwner } from '../types';

interface PropertyOwnerCardProps {
  owner: AdminPropertyOwner;
}

export function PropertyOwnerCard({ owner }: PropertyOwnerCardProps) {
  const displayName = owner.name ?? owner.email;

  return (
    <Card>
      <CardHeader>
        <h2 className="text-base font-semibold text-ink-900">المالك</h2>
        <p className="text-sm text-ink-500">بيانات صاحب الإعلان</p>
      </CardHeader>
      <CardContent>
        <div className="flex items-start gap-3">
          {owner.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={owner.avatarUrl}
              alt={displayName}
              className="size-12 rounded-md object-cover"
            />
          ) : (
            <div className="flex size-12 items-center justify-center rounded-md bg-surface-100 text-sm font-semibold text-ink-600">
              {displayName.slice(0, 1)}
            </div>
          )}
          <div className="min-w-0 space-y-1">
            <p className="font-medium text-ink-900">{displayName}</p>
            <p className="truncate text-sm text-ink-600">{owner.email}</p>
            <p className="text-sm text-ink-600">{owner.phone ?? '—'}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
