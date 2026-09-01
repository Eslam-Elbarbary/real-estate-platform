'use client';

import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { siteConfig } from '@/config/site';
import { loginAction } from '../actions';

export function LoginForm({ sessionExpired = false }: { sessionExpired?: boolean }) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(
    sessionExpired ? 'انتهت صلاحية الجلسة. يرجى تسجيل الدخول مرة أخرى.' : null,
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const result = await loginAction({ email, password });

    if (result.ok) {
      router.push('/');
      router.refresh();
      return;
    }

    setError(result.error);
    setLoading(false);
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <p className="text-sm font-medium text-brand-700">
          {siteConfig.productName}
        </p>
        <h1 className="text-xl font-bold text-ink-950">تسجيل الدخول</h1>
        <p className="text-sm text-ink-600">
          أدخل بيانات حساب الإدارة للوصول إلى لوحة التحكم.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {error ? (
            <div
              role="alert"
              className="rounded-md border border-danger-200 bg-danger-50 px-3 py-2 text-sm text-danger-700"
            >
              {error}
            </div>
          ) : null}

          <Input
            id="email"
            name="email"
            type="email"
            label="البريد الإلكتروني"
            autoComplete="email"
            dir="ltr"
            className="text-start"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            disabled={loading}
            required
          />

          <Input
            id="password"
            name="password"
            type="password"
            label="كلمة المرور"
            autoComplete="current-password"
            dir="ltr"
            className="text-start"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            disabled={loading}
            required
          />

          <Button
            type="submit"
            variant="primary"
            className="w-full"
            disabled={loading}
          >
            {loading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
