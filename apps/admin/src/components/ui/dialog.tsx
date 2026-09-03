'use client';

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  type MouseEvent,
  type ReactNode,
} from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils/cn';
import {
  isTopmostModalDialog,
  registerModalDialog,
  restoreModalDialogStack,
  unregisterModalDialog,
} from './dialog-stack';

export interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children?: ReactNode;
  footer?: ReactNode;
  className?: string;
}

export function Dialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  className,
}: DialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const suppressCloseEventRef = useRef(false);
  const openRef = useRef(open);
  const titleId = useId();
  const descriptionId = useId();

  openRef.current = open;

  const requestClose = useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

  useEffect(() => {
    const node = dialogRef.current;
    if (!node) {
      return;
    }

    const dialogNode = node;

    function handleNativeClose(event: Event) {
      if (event.target !== dialogNode) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      if (suppressCloseEventRef.current) {
        restoreModalDialogStack();
        return;
      }

      if (!openRef.current) {
        restoreModalDialogStack();
        return;
      }

      if (!isTopmostModalDialog(dialogNode)) {
        restoreModalDialogStack();
        return;
      }

      onOpenChange(false);
      restoreModalDialogStack();
    }

    function handleNativeCancel(event: Event) {
      if (event.target !== dialogNode) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      if (!openRef.current) {
        restoreModalDialogStack();
        return;
      }

      if (!isTopmostModalDialog(dialogNode)) {
        restoreModalDialogStack();
        return;
      }

      onOpenChange(false);
      restoreModalDialogStack();
    }

    dialogNode.addEventListener('close', handleNativeClose);
    dialogNode.addEventListener('cancel', handleNativeCancel);

    return () => {
      dialogNode.removeEventListener('close', handleNativeClose);
      dialogNode.removeEventListener('cancel', handleNativeCancel);
    };
  }, [onOpenChange]);

  useEffect(() => {
    const node = dialogRef.current;
    if (!node) {
      return;
    }

    if (open) {
      if (!node.open) {
        node.showModal();
      }
      registerModalDialog(node);
    } else {
      unregisterModalDialog(node);
      if (node.open) {
        suppressCloseEventRef.current = true;
        node.close();
        suppressCloseEventRef.current = false;
      }
    }

    return () => {
      unregisterModalDialog(node);
    };
  }, [open]);

  useEffect(() => {
    function handleAnyDialogClose() {
      if (openRef.current) {
        restoreModalDialogStack();
      }
    }

    document.addEventListener('close', handleAnyDialogClose, true);

    return () => {
      document.removeEventListener('close', handleAnyDialogClose, true);
    };
  }, []);

  function handleCloseClick(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();
    requestClose();
  }

  return (
    <dialog
      ref={dialogRef}
      className={cn(
        'fixed inset-0 m-auto w-[min(100%-2rem,28rem)] rounded-xl border border-border bg-white p-0 text-ink-900 shadow-lg',
        'backdrop:bg-ink-950/40',
        'open:animate-none',
        className,
      )}
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
      onClick={(event) => {
        event.stopPropagation();
      }}
    >
      <div className="flex items-start justify-between gap-3 border-b border-border px-4 py-3">
        <div className="min-w-0 space-y-1">
          <h2 id={titleId} className="text-base font-semibold text-ink-950">
            {title}
          </h2>
          {description ? (
            <p id={descriptionId} className="text-sm text-ink-600">
              {description}
            </p>
          ) : null}
        </div>
        <Button
          type="button"
          variant="ghost"
          size="small"
          aria-label="إغلاق"
          onClick={handleCloseClick}
          onMouseDown={(event) => event.preventDefault()}
        >
          <X className="size-4" aria-hidden />
        </Button>
      </div>
      {children ? <div className="px-4 py-4">{children}</div> : null}
      {footer ? (
        <div
          className="flex flex-wrap items-center justify-end gap-2 border-t border-border px-4 py-3"
          onClick={(event) => event.stopPropagation()}
        >
          {footer}
        </div>
      ) : null}
    </dialog>
  );
}
