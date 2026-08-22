import Link from 'next/link';
import { Container } from '@/components/ui/container';
import { getButtonClassName } from '@/components/ui/button';
import { routes } from '@/config/routes';

export default function CompoundNotFound() {
  return (
    <Container className="py-20 text-center">
      <p className="text-sm font-semibold text-brand-700">404</p>
      <h1 className="mt-2 text-2xl font-bold text-ink-900">
        الكمبوند غير موجود
      </h1>
      <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-ink-600">
        لم نتمكن من العثور على هذا المشروع. تحقق من الرابط أو عد إلى دليل
        الكمبوندات.
      </p>
      <Link
        href={routes.compounds.root}
        className={getButtonClassName({ className: 'mt-6 inline-flex' })}
      >
        العودة إلى دليل الكمبوند
      </Link>
    </Container>
  );
}
