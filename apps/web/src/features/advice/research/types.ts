export const researchRequestTypes = [
  'trends-report',
  'market-impact-report',
  'price-data',
  'custom-study',
  'contact',
] as const;

export type ResearchRequestType = (typeof researchRequestTypes)[number];

export type ResearchServiceBadge = {
  label: string;
  variant: 'warning' | 'success';
};

export type ResearchService = {
  id: ResearchRequestType;
  title: string;
  description: string;
  ctaLabel: string;
  badge?: ResearchServiceBadge;
};

export type ResearchVideo = {
  id: string;
  title: string;
  posterSrc: string;
  posterAlt: string;
};

export type ResearchPartner = {
  id: string;
  name: string;
  mark: string;
};

export type ResearchLandingView = {
  services: ResearchService[];
  videos: ResearchVideo[];
  partners: ResearchPartner[];
};

export type ResearchRequestDefinition = {
  type: ResearchRequestType;
  title: string;
  description: string;
  successTitle: string;
  successBody: string;
};
