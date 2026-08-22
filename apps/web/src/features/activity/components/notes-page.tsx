'use client';

import { useEffect, useId, useRef, useState, createElement } from 'react';
import { StickyNote } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { routes } from '@/config/routes';
import { getButtonClassName } from '@/components/ui/button';
import { appIcons } from '@/config/icons';
import { createNoteAction } from '../actions';
import { activityCopy } from '../copy';
import { ActivityShell } from './activity-shell';
import { ActivityEmptyState } from './activity-empty-state';
import type { UserNote } from '../types';

interface NotesPageProps {
  notes: UserNote[];
}

export function NotesPage({ notes }: NotesPageProps) {
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  return (
    <ActivityShell
      sectionTitle={activityCopy.notes.section}
      navItems={[
        {
          id: 'notes',
          label: activityCopy.notes.pill,
          href: routes.notes,
          icon: 'notes',
          active: true,
        },
      ]}
    >
      {notes.length === 0 ? (
        <ActivityEmptyState
          icon={StickyNote}
          message={activityCopy.notes.empty}
          ctaLabel={activityCopy.notes.cta}
          onCtaClick={() => setOpen(true)}
        />
      ) : (
        <ul className="space-y-3">
          {notes.map((note) => (
            <li
              key={note.id}
              className="rounded-xl border border-[#e5e5e5] bg-white px-4 py-4 text-sm leading-7 text-ink-800"
            >
              {note.body}
            </li>
          ))}
          <li>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className={getButtonClassName({
                className: 'h-10 rounded-full px-6 font-bold',
              })}
            >
              {activityCopy.notes.cta}
            </button>
          </li>
        </ul>
      )}

      <NoteModal
        open={open}
        onClose={() => setOpen(false)}
        onSaved={() => {
          setOpen(false);
          setToast(activityCopy.notes.success);
          window.setTimeout(() => setToast(null), 2200);
        }}
      />

      {toast ? (
        <div
          role="status"
          className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-lg bg-ink-900 px-4 py-2 text-sm text-white shadow-lg"
        >
          {toast}
        </div>
      ) : null}
    </ActivityShell>
  );
}

function NoteModal({
  open,
  onClose,
  onSaved,
}: {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
}) {
  const router = useRouter();
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const [body, setBody] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialogRef.current?.querySelector<HTMLElement>('textarea, button')?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener('keydown', onKeyDown);
      previous?.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  async function submit() {
    const trimmed = body.trim();
    if (trimmed.length < 2) {
      setError('يرجى كتابة ملاحظة');
      return;
    }
    setPending(true);
    setError(null);
    try {
      await createNoteAction(trimmed);
      setBody('');
      router.refresh();
      onSaved();
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-ink-950/45"
        aria-label="إغلاق"
        onClick={onClose}
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-10 w-full max-w-md rounded-2xl bg-white p-5 shadow-lg"
      >
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 id={titleId} className="text-base font-extrabold text-ink-950">
            {activityCopy.notes.modalTitle}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex size-8 items-center justify-center rounded-md text-ink-600 hover:bg-surface-50"
            aria-label="إغلاق"
          >
            {createElement(appIcons.close, { size: 16, 'aria-hidden': true })}
          </button>
        </div>
        <label htmlFor="note-body" className="sr-only">
          {activityCopy.notes.placeholder}
        </label>
        <textarea
          id="note-body"
          value={body}
          onChange={(event) => setBody(event.target.value)}
          rows={5}
          placeholder={activityCopy.notes.placeholder}
          aria-invalid={Boolean(error)}
          className="w-full rounded-md border border-[#d0d0d0] px-3 py-2 text-sm text-ink-900 focus-visible:border-brand-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-200"
        />
        {error ? (
          <p className="mt-1 text-xs text-danger-600" role="alert">
            {error}
          </p>
        ) : null}
        <div className="mt-5 flex gap-2">
          <button
            type="button"
            disabled={pending}
            onClick={submit}
            className={getButtonClassName({
              className: 'h-10 flex-1 font-bold',
            })}
          >
            {activityCopy.notes.save}
          </button>
          <button
            type="button"
            onClick={onClose}
            className={getButtonClassName({
              variant: 'outline',
              className: 'h-10 flex-1',
            })}
          >
            {activityCopy.notes.cancel}
          </button>
        </div>
      </div>
    </div>
  );
}
