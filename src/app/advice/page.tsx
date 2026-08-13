import type { Metadata } from 'next';
import { createPageMetadata } from '@/lib/seo/metadata';
import { KnowMorePage } from '@/features/advice/know-more/components/know-more-page';
import { knowMoreCopy } from '@/features/advice/know-more/config';
import { routes } from '@/config/routes';

export async function generateMetadata(): Promise<Metadata> {
  return createPageMetadata({
    title: knowMoreCopy.seoTitle,
    description: knowMoreCopy.seoDescription,
    path: routes.advice.root,
  });
}

export default function AdviceKnowMoreRoute() {
  return <KnowMorePage />;
}
