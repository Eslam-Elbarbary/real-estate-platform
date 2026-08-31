'use client';

import { Toaster } from 'sonner';

export function ToastProvider() {
  return (
    <Toaster
      position="top-left"
      richColors
      theme="light"
      dir="rtl"
    />
  );
}
