'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { AdminError, getUserFacingErrorMessage } from '@/lib/errors';

interface PropertyDetailsErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

function resolveMessage(error: Error): string {
  const userMessage = getUserFacingErrorMessage(error);

  if (error instanceof AdminError) {
    return userMessage;
  }

  if (error.name === 'AdminError' && userMessage) {
    return userMessage;
  }

  if (userMessage && userMessage !== 'حدث خطأ غير متوقع. حاول مرة أخرى.') {
    return userMessage;
  }

  return 'تعذر تحميل تفاصيل العقار.';
}

export default function PropertyDetailsError({
  error,
  reset,
}: PropertyDetailsErrorProps) {
  const message = resolveMessage(error);

  useEffect(() => {
    console.error('[admin:property-details]', {
      name: error.name,
      message: error.message,
      digest: error.digest,
    });
  }, [error]);

  return (
    <div className="flex min-h-[50vh] items-center justify-center px-4 py-10">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <h1 className="text-lg font-bold text-ink-950">تعذر عرض العقار</h1>
          <p className="text-sm text-ink-600">{message}</p>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button type="button" variant="primary" onClick={reset}>
            إعادة المحاولة
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
