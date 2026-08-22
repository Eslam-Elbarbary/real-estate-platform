import { uiLabels } from '@/config/labels';

export const propertySectionNav = [
  { id: 'photos', label: uiLabels.sectionNavPhotos },
  { id: 'details', label: uiLabels.sectionNavDetails },
  { id: 'amenities', label: uiLabels.sectionNavAmenities },
  { id: 'location', label: uiLabels.sectionNavLocation },
  { id: 'statistics', label: uiLabels.sectionNavStatistics },
] as const;

export type PropertySectionId = (typeof propertySectionNav)[number]['id'];
