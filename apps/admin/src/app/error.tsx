'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-full items-center justify-center px-4 py-16">
      <Card className="w-full max-w-md">
        <CardHeader>
          <h1 className="text-xl font-bold text-ink-950">حدث خطأ غير متوقع</h1>
          <p className="text-sm text-ink-600">
            تعذر تحميل الصفحة، حاول مرة أخرى.
          </p>
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
