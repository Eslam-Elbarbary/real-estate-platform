import { hasPermission } from '@/features/auth/permissions';
import type { PropertyStatus } from '@/types';

export type PropertyLifecycleAction =
  | 'approve'
  | 'reject'
  | 'publish'
  | 'unpublish'
  | 'archive'
  | 'restore'
  | 'delete';

export function canApproveProperty(
  status: PropertyStatus,
  permissions: string[],
): boolean {
  return (
    status === 'PENDING_REVIEW' &&
    hasPermission(permissions, 'properties.approve')
  );
}

export function canRejectProperty(
  status: PropertyStatus,
  permissions: string[],
): boolean {
  return (
    status === 'PENDING_REVIEW' &&
    hasPermission(permissions, 'properties.reject')
  );
}

export function canPublishProperty(
  status: PropertyStatus,
  permissions: string[],
): boolean {
  return (
    (status === 'DRAFT' || status === 'REJECTED' || status === 'EXPIRED') &&
    hasPermission(permissions, 'properties.publish')
  );
}

export function canUnpublishProperty(
  status: PropertyStatus,
  permissions: string[],
): boolean {
  return (
    status === 'PUBLISHED' && hasPermission(permissions, 'properties.publish')
  );
}

export function canArchiveProperty(
  status: PropertyStatus,
  permissions: string[],
): boolean {
  return (
    (status === 'PUBLISHED' ||
      status === 'REJECTED' ||
      status === 'EXPIRED') &&
    hasPermission(permissions, 'properties.archive')
  );
}

export function canRestoreProperty(
  status: PropertyStatus,
  permissions: string[],
): boolean {
  return (
    status === 'ARCHIVED' &&
    (hasPermission(permissions, 'properties.restore') ||
      hasPermission(permissions, 'properties.archive'))
  );
}

export function canDeleteProperty(
  status: PropertyStatus,
  permissions: string[],
): boolean {
  return (
    status === 'DRAFT' && hasPermission(permissions, 'properties.delete')
  );
}

export function canEditProperty(
  status: PropertyStatus,
  permissions: string[],
): boolean {
  return (
    hasPermission(permissions, 'properties.update') &&
    (status === 'PUBLISHED' ||
      status === 'DRAFT' ||
      status === 'REJECTED' ||
      status === 'EXPIRED' ||
      status === 'PENDING_PAYMENT' ||
      status === 'ARCHIVED')
  );
}

export function isEligibleForAction(
  action: PropertyLifecycleAction,
  status: PropertyStatus,
  permissions: string[],
): boolean {
  switch (action) {
    case 'approve':
      return canApproveProperty(status, permissions);
    case 'reject':
      return canRejectProperty(status, permissions);
    case 'publish':
      return canPublishProperty(status, permissions);
    case 'unpublish':
      return canUnpublishProperty(status, permissions);
    case 'archive':
      return canArchiveProperty(status, permissions);
    case 'restore':
      return canRestoreProperty(status, permissions);
    case 'delete':
      return canDeleteProperty(status, permissions);
    default:
      return false;
  }
}
