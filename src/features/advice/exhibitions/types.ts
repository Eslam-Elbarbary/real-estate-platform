export type ExhibitionCategory =
  | 'real_estate_exhibition'
  | 'conference'
  | 'investment_event'
  | 'developer_event';

export interface ExhibitionContentSection {
  id: string;
  heading?: string;
  paragraphs: string[];
}

export interface RealEstateExhibition {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  category: ExhibitionCategory;
  categoryLabel: string;
  startDate: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
  locationName?: string;
  city?: string;
  venue?: string;
  organizerName?: string;
  coverImage: string;
  posterImage?: string;
  contentSections: ExhibitionContentSection[];
  featured?: boolean;
  createdAt: string;
}

export interface ExhibitionSearchParams {
  month?: string;
  date?: string;
}

export interface ExhibitionEventPreview {
  id: string;
  slug: string;
  title: string;
  coverImage: string;
  categoryLabel: string;
  formattedDate: string;
  formattedTime?: string;
}

export interface CalendarDayCell {
  iso: string;
  day: number;
  inCurrentMonth: boolean;
  isToday: boolean;
  isQueriedDate: boolean;
  events: ExhibitionEventPreview[];
}

export interface ExhibitionCalendarView {
  year: number;
  month: number;
  monthKey: string;
  monthLabel: string;
  prevMonthKey: string;
  nextMonthKey: string;
  todayMonthKey: string;
  weekdayLabels: string[];
  days: CalendarDayCell[];
  monthEventCount: number;
  queriedDate?: string;
  queriedDateHasEvents: boolean;
}

export interface ExhibitionDirectoryView {
  calendar: ExhibitionCalendarView;
}

export interface ExhibitionDetailsView {
  exhibition: RealEstateExhibition;
  related: RealEstateExhibition[];
}
