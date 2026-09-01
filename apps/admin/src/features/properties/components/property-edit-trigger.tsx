'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { hasPermission } from '@/features/auth/permissions';
import type { UserRole } from '@/types';
import type { AdminPropertyDetails, PropertyFormCatalogs } from '../types';
import { PropertyEditDialog } from './property-edit-dialog';

interface PropertyEditTriggerProps {
  property: AdminPropertyDetails;
  catalogs: PropertyFormCatalogs;
  roles: UserRole[];
}

export function PropertyEditTrigger({
  property,
  catalogs,
  roles,
}: PropertyEditTriggerProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const canUpdate = hasPermission(roles, 'properties.update');

  if (!canUpdate) {
    return null;
  }

  return (
    <>
      <Button type="button" variant="outline" size="small" onClick={() => setOpen(true)}>
        تعديل العقار
      </Button>

      <PropertyEditDialog
        open={open}
        onOpenChange={setOpen}
        property={property}
        catalogs={catalogs}
        roles={roles}
        onSuccess={() => {
          void router.refresh();
        }}
      />
    </>
  );
}
