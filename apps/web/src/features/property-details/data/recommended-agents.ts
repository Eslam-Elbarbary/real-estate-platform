export interface RecommendedAgent {
  id: string;
  name: string;
  meta: string;
  initial: string;
}

/** Original demo agencies for the details-page strip (not Aqarmap content). */
export const recommendedAgents: RecommendedAgent[] = [
  {
    id: 'agent-nile',
    name: 'نايل للعقارات',
    meta: '١٢٨ إعلان',
    initial: 'ن',
  },
  {
    id: 'agent-horizon',
    name: 'هورايزون سكن',
    meta: '٩٤ إعلان',
    initial: 'ه',
  },
  {
    id: 'agent-delta',
    name: 'دلتا هومز',
    meta: '٧١ إعلان',
    initial: 'د',
  },
  {
    id: 'agent-cairo',
    name: 'كairo Estates',
    meta: '١٥٦ إعلان',
    initial: 'ك',
  },
  {
    id: 'agent-oasis',
    name: 'واحة العقارية',
    meta: '٦٣ إعلان',
    initial: 'و',
  },
  {
    id: 'agent-prime',
    name: 'برايم للتطوير',
    meta: '٢١٠ إعلان',
    initial: 'ب',
  },
];
