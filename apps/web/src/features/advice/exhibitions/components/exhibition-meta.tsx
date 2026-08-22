import { Bookmark, CalendarDays, Clock, MapPin } from 'lucide-react';
import {
  formatExhibitionDate,
  formatExhibitionPlace,
  formatTimeRange,
} from '../lib/calendar';
import { exhibitionCopy } from '../config';
import type { RealEstateExhibition } from '../types';

interface ExhibitionMetaProps {
  exhibition: RealEstateExhibition;
}

export function ExhibitionMeta({ exhibition }: ExhibitionMetaProps) {
  const dateLabel = formatExhibitionDate(exhibition.startDate);
  const timeLabel = formatTimeRange(exhibition.startTime, exhibition.endTime);
  const placeLabel = formatExhibitionPlace(exhibition);

  return (
    <div className="mt-3">
      <p className="text-sm text-ink-500">
        {exhibition.organizerName ? <span>{exhibition.organizerName}</span> : null}
        {exhibition.organizerName ? <span aria-hidden> · </span> : null}
        <time dateTime={exhibition.startDate}>{dateLabel}</time>
      </p>

      <dl
        className="mt-5 grid gap-5 border border-[#ececec] bg-white px-4 py-4 sm:grid-cols-3"
        data-testid="exhibition-info-block"
      >
        <div>
          <dt className="text-sm font-extrabold text-ink-950">{exhibitionCopy.time}</dt>
          <dd className="mt-2 space-y-1.5 text-sm text-ink-700">
            <p className="flex items-center gap-2">
              <CalendarDays className="size-4 shrink-0 text-ink-400" aria-hidden />
              <span>{dateLabel}</span>
            </p>
            {timeLabel ? (
              <p className="flex items-center gap-2">
                <Clock className="size-4 shrink-0 text-ink-400" aria-hidden />
                <span>{timeLabel}</span>
              </p>
            ) : null}
          </dd>
        </div>
        {placeLabel ? (
          <div>
            <dt className="text-sm font-extrabold text-ink-950">{exhibitionCopy.place}</dt>
            <dd className="mt-2 flex items-start gap-2 text-sm text-ink-700">
              <MapPin className="mt-0.5 size-4 shrink-0 text-ink-400" aria-hidden />
              <span>{placeLabel}</span>
            </dd>
          </div>
        ) : null}
        <div>
          <dt className="text-sm font-extrabold text-ink-950">{exhibitionCopy.category}</dt>
          <dd className="mt-2 flex items-center gap-2 text-sm text-ink-700">
            <Bookmark className="size-4 shrink-0 text-ink-400" aria-hidden />
            <span>{exhibition.categoryLabel}</span>
          </dd>
        </div>
      </dl>
    </div>
  );
}
