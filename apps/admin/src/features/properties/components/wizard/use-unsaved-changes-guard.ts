'use client';

import { useEffect } from 'react';

/**
 * Warn on browser refresh/close and intercept in-app link navigations when
 * there are unsaved changes or an in-flight save.
 */
export function useUnsavedChangesGuard(
  dirty: boolean,
  message: string,
  options?: { isSaving?: boolean; savingMessage?: string },
) {
  const isSaving = options?.isSaving === true;
  const savingMessage =
    options?.savingMessage ??
    'جاري حفظ المسودة. المغادرة الآن قد تفقد آخر التغييرات. هل تريد المغادرة؟';
  const shouldBlock = dirty || isSaving;
  const confirmMessage = isSaving ? savingMessage : message;

  useEffect(() => {
    if (!shouldBlock) {
      return;
    }

    function handleBeforeUnload(event: BeforeUnloadEvent) {
      event.preventDefault();
      event.returnValue = '';
    }

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [shouldBlock]);

  useEffect(() => {
    if (!shouldBlock) {
      return;
    }

    function handleDocumentClick(event: MouseEvent) {
      if (event.defaultPrevented) {
        return;
      }
      if (event.button !== 0) {
        return;
      }
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }

      const target = event.target;
      if (!(target instanceof Element)) {
        return;
      }

      const anchor = target.closest('a');
      if (!anchor) {
        return;
      }

      if (anchor.target === '_blank' || anchor.hasAttribute('download')) {
        return;
      }

      const href = anchor.getAttribute('href');
      if (
        !href ||
        href.startsWith('#') ||
        href.startsWith('mailto:') ||
        href.startsWith('tel:')
      ) {
        return;
      }

      if (href === window.location.pathname + window.location.search) {
        return;
      }

      const confirmed = window.confirm(confirmMessage);
      if (!confirmed) {
        event.preventDefault();
        event.stopPropagation();
      }
    }

    document.addEventListener('click', handleDocumentClick, true);
    return () =>
      document.removeEventListener('click', handleDocumentClick, true);
  }, [shouldBlock, confirmMessage]);
}
