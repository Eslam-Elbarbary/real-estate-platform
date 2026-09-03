/** Tracks open native modal dialogs so stacked modals can be restored after one closes. */

const openModalDialogs = new Set<HTMLDialogElement>();

export function registerModalDialog(node: HTMLDialogElement): void {
  openModalDialogs.add(node);
}

export function unregisterModalDialog(node: HTMLDialogElement): void {
  openModalDialogs.delete(node);
}

export function isTopmostModalDialog(node: HTMLDialogElement): boolean {
  let topmost: HTMLDialogElement | null = null;

  for (const dialog of openModalDialogs) {
    if (dialog.open) {
      topmost = dialog;
    }
  }

  return topmost === node;
}

/** Re-open dialogs that should stay open after another modal in the stack closes. */
export function restoreModalDialogStack(): void {
  queueMicrotask(() => {
    for (const dialog of openModalDialogs) {
      if (dialog.isConnected && !dialog.open) {
        try {
          dialog.showModal();
        } catch {
          // Ignore if the dialog was removed or is already open.
        }
      }
    }
  });
}
