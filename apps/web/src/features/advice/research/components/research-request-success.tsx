import { DEMO_RESEARCH_REQUEST_ID, researchCopy } from '../config';
import { routes } from '@/config/routes';
import Link from 'next/link';

interface ResearchRequestSuccessProps {
  requestId?: string;
}

export function ResearchRequestSuccess({
  requestId = DEMO_RESEARCH_REQUEST_ID,
}: ResearchRequestSuccessProps) {
  return (
    <div
      role="status"
      data-testid="research-request-success"
      className="rounded-xl border border-success-700/20 bg-white px-5 py-10 text-center"
    >
      <p className="text-lg font-extrabold text-success-700">تم استلام طلبك بنجاح</p>
      <p className="mt-2 text-sm leading-7 text-ink-600">
        وسيتواصل معك فريق الأبحاث بعد مراجعة التفاصيل.
      </p>
      <p className="mt-4 text-sm font-semibold text-ink-700">
        رقم الطلب:{' '}
        <span className="font-extrabold text-ink-950">{requestId}</span>
      </p>
      <Link
        href={routes.advice.research.root}
        className="mt-6 inline-flex text-sm font-semibold text-brand-700 hover:underline"
      >
        {researchCopy.backToResearch}
      </Link>
    </div>
  );
}
