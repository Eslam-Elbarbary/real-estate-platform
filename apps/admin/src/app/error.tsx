'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { AdminError, getUserFacingErrorMessage } from '@/lib/errors';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

const isDev = process.env.NODE_ENV === 'development';

function resolveErrorTitle(error: Error): string {
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

  return 'حدث خطأ غير متوقع';
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  const title = resolveErrorTitle(error);
  const isGeneric = title === 'حدث خطأ غير متوقع';

  useEffect(() => {
    console.error('[admin:error-boundary]', {
      name: error.name,
      message: error.message,
      digest: error.digest,
      stack: error.stack,
    });
  }, [error]);

  return (
    <div className="flex min-h-full items-center justify-center px-4 py-16">
      <Card className="w-full max-w-md">
        <CardHeader>
          <h1 className="text-xl font-bold text-ink-950">{title}</h1>
          <p className="text-sm text-ink-600">
            {isGeneric
              ? 'تعذر تحميل الصفحة، حاول مرة أخرى.'
              : 'تعذر إكمال الطلب. يمكنك المحاولة مرة أخرى.'}
          </p>
          {isDev ? (
            <pre className="mt-3 max-h-40 overflow-auto rounded-md bg-ink-50 p-3 text-xs text-ink-700">
              {error instanceof AdminError
                ? JSON.stringify(
                    {
                      code: error.code,
                      message: error.message,
                      userMessage: error.userMessage,
                      status: error.status,
                      details: error.details,
                    },
                    null,
                    2,
                  )
                : `${error.name}: ${error.message}`}
            </pre>
          ) : null}
        </CardHeader>
        <CardContent>
          <Button type="button" className="w-full" onClick={reset}>
            إعادة المحاولة
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
