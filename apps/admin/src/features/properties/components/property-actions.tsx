'use client';

import { PropertyActionMenu } from './property-action-menu';
import type { PropertyStatus } from '@/types';

interface PropertyActionsProps {
  propertyId: string;
  status: PropertyStatus;
  permissions: string[];
  onEdit?: () => void;
}

/** Status workflow actions for the details header. */
export function PropertyActions({
  propertyId,
  status,
  permissions,
  onEdit,
}: PropertyActionsProps) {
  return (
    <PropertyActionMenu
      propertyId={propertyId}
      status={status}
      permissions={permissions}
      onEdit={onEdit}
      showView={false}
    />
  );
}
