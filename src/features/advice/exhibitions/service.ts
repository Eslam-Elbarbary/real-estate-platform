import { routes } from '@/config/routes';
import type { PageSeoInput } from '@/lib/seo/metadata';
import { exhibitionCopy, WEEKDAY_LABELS } from './config';
import {
  addMonths,
  buildCalendarDays,
  eventDates,
  formatMonthLabel,
  parseISODate,
  parseMonthKey,
  toEventPreview,
  toISODate,
  toMonthKey,
} from './lib/calendar';
import {
  getExhibitionRepository,
  type ExhibitionRepository,
} from './repository';
import { currentMonthKey } from './search-params';
import type {
  ExhibitionCalendarView,
  ExhibitionDetailsView,
  ExhibitionDirectoryView,
  ExhibitionSearchParams,
  RealEstateExhibition,
} from './types';

export class ExhibitionService {
  constructor(
    private readonly repository: ExhibitionRepository = getExhibitionRepository(),
  ) {}

  async getDirectoryView(
    params: ExhibitionSearchParams,
    now = new Date(),
  ): Promise<ExhibitionDirectoryView> {
    const exhibitions = await this.repository.getExhibitions();
    return {
      calendar: this.buildCalendar(exhibitions, params, now),
    };
  }

  async getExhibitionDetails(slug: string): Promise<ExhibitionDetailsView | null> {
    const exhibition = await this.repository.getExhibitionBySlug(slug);
    if (!exhibition) return null;

    const all = await this.repository.getExhibitions();
    return {
      exhibition,
      related: this.selectRelated(exhibition, all),
    };
  }

  async listSlugs(): Promise<string[]> {
    const exhibitions = await this.repository.getExhibitions();
    return exhibitions.map((item) => item.slug);
  }

  buildDirectoryMetadata(): PageSeoInput {
    return {
      title: exhibitionCopy.seoDirectoryTitle,
      description: exhibitionCopy.seoDirectoryDescription,
      path: routes.advice.exhibitions.root,
    };
  }

  buildDetailsMetadata(exhibition: RealEstateExhibition): PageSeoInput {
    return {
      title: exhibition.title,
      description: exhibition.shortDescription,
      path: routes.advice.exhibitions.details(exhibition.slug),
      image: exhibition.coverImage,
      type: 'article',
    };
  }

  private buildCalendar(
    exhibitions: RealEstateExhibition[],
    params: ExhibitionSearchParams,
    now: Date,
  ): ExhibitionCalendarView {
    const queriedDate =
      params.date && parseISODate(params.date) ? params.date : undefined;
    const fromDate = queriedDate ? parseISODate(queriedDate) : null;
    const fromMonth = params.month ? parseMonthKey(params.month) : null;

    const year = fromDate?.getFullYear() ?? fromMonth?.year ?? now.getFullYear();
    const month = fromDate
      ? fromDate.getMonth() + 1
      : (fromMonth?.month ?? now.getMonth() + 1);

    const eventsByDate = new Map<string, ReturnType<typeof toEventPreview>[]>();
    for (const event of exhibitions) {
      const preview = toEventPreview(event);
      for (const iso of eventDates(event)) {
        const list = eventsByDate.get(iso) ?? [];
        list.push(preview);
        eventsByDate.set(iso, list);
      }
    }

    const days = buildCalendarDays(
      year,
      month,
      eventsByDate,
      toISODate(now),
      queriedDate,
    );
    const monthEventCount = days.filter(
      (day) => day.inCurrentMonth && day.events.length > 0,
    ).length;
    const prev = addMonths(year, month, -1);
    const next = addMonths(year, month, 1);

    return {
      year,
      month,
      monthKey: toMonthKey(year, month),
      monthLabel: formatMonthLabel(year, month),
      prevMonthKey: toMonthKey(prev.year, prev.month),
      nextMonthKey: toMonthKey(next.year, next.month),
      todayMonthKey: currentMonthKey(now),
      weekdayLabels: [...WEEKDAY_LABELS],
      days,
      monthEventCount,
      queriedDate,
      queriedDateHasEvents: queriedDate
        ? (eventsByDate.get(queriedDate)?.length ?? 0) > 0
        : false,
    };
  }

  private selectRelated(
    exhibition: RealEstateExhibition,
    all: RealEstateExhibition[],
  ): RealEstateExhibition[] {
    const target = parseISODate(exhibition.startDate)?.getTime() ?? 0;
    const others = all.filter((item) => item.id !== exhibition.id);

    const byProximity = (left: RealEstateExhibition, right: RealEstateExhibition) => {
      const leftDelta = Math.abs(
        (parseISODate(left.startDate)?.getTime() ?? 0) - target,
      );
      const rightDelta = Math.abs(
        (parseISODate(right.startDate)?.getTime() ?? 0) - target,
      );
      return leftDelta - rightDelta;
    };

    const sameCategory = others
      .filter((item) => item.category === exhibition.category)
      .sort(byProximity);
    const rest = others
      .filter((item) => item.category !== exhibition.category)
      .sort(byProximity);

    return [...sameCategory, ...rest].slice(0, 3);
  }
}

let service: ExhibitionService | undefined;

export function getExhibitionService(): ExhibitionService {
  service ??= new ExhibitionService();
  return service;
}
