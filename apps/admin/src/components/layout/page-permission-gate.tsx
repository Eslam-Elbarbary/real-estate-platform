import type { ReactNode } from 'react';
import Link from 'next/link';
import { ShieldAlert } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { routes } from '@/config/routes';
import { siteConfig } from '@/config/site';
import {
  hasAnyPermission,
  hasPermission,
  type AdminPermission,
} from '@/features/auth/permissions';

export type PagePermissionRequirement = AdminPermission | AdminPermission[];

export function hasPagePermission(
  permissions: string[],
  required: PagePermissionRequirement,
): boolean {
  if (Array.isArray(required)) {
    return hasAnyPermission(permissions, required);
  }

  return hasPermission(permissions, required);
}

interface PagePermissionDeniedProps {
  title?: string;
  description?: string;
}

/** Inline forbidden state — keeps the user logged in inside the admin shell. */
export function PagePermissionDenied({
  title = 'ليس لديك صلاحية للوصول',
  description = 'حسابك مسجّل الدخول، لكنه لا يملك الصلاحية المطلوبة لعرض هذه الصفحة. تواصل مع مسؤول المنصة إذا كنت تعتقد أن هذا خطأ.',
}: PagePermissionDeniedProps) {
  return (
    <div className="flex min-h-[50vh] items-center justify-center py-10">
      <Card className="w-full max-w-md border-border shadow-sm">
        <CardHeader className="space-y-3">
          <div className="flex size-11 items-center justify-center rounded-xl bg-amber-50 text-amber-700 ring-1 ring-amber-100">
            <ShieldAlert className="size-5" aria-hidden />
          </div>
          <p className="text-sm font-medium text-brand-700">{siteConfig.productName}</p>
          <h1 className="text-xl font-bold text-ink-950">{title}</h1>
          <p className="text-sm leading-relaxed text-ink-600">{description}</p>
        </CardHeader>
        <CardContent>
          <Link
            href={routes.home}
            className="inline-flex h-10 w-full items-center justify-center rounded-md bg-brand-600 text-sm font-medium text-white transition-colors hover:bg-brand-700"
          >
            العودة إلى لوحة التحكم
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}

interface PagePermissionGateProps {
  permissions: string[];
  required: PagePermissionRequirement;
  children: ReactNode;
}

/**
 * Renders children only when the session has the required permission(s).
 * Callers must check `hasPagePermission` before fetching page data so APIs
 * are not hit when access is denied.
 */
export function PagePermissionGate({
  permissions,
  required,
  children,
}: PagePermissionGateProps) {
  if (!hasPagePermission(permissions, required)) {
    return <PagePermissionDenied />;
  }

  return children;
}
