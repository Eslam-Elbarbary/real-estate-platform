'use client';

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type RefObject,
} from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import Link from 'next/link';
import { Bookmark, CalendarDays, Clock } from 'lucide-react';
import { routes } from '@/config/routes';
import { cn } from '@/lib/utils/cn';
import { exhibitionCopy } from '../config';
import type { ExhibitionEventPreview } from '../types';

interface ExhibitionPreviewPopoverProps {
  id: string;
  event: ExhibitionEventPreview;
  anchorRef: RefObject<HTMLButtonElement | null>;
  onClose: () => void;
}

function subscribe() {
  return () => {};
}

function useIsClient() {
  return useSyncExternalStore(subscribe, () => true, () => false);
}

export function ExhibitionPreviewPopover({
  id,
  event,
  anchorRef,
  onClose,
}: ExhibitionPreviewPopoverProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const isClient = useIsClient();
  const [mobile, setMobile] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });

  useLayoutEffect(() => {
    function update() {
      const compact = window.innerWidth < 640;
      setMobile(compact);
      const anchor = anchorRef.current;
      if (!anchor || compact) return;
      const rect = anchor.getBoundingClientRect();
      setCoords({
        top: rect.top,
        left: rect.left + rect.width / 2,
      });
    }

    update();
    window.addEventListener('resize', update);
    window.addEventListener('scroll', update, true);
    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('scroll', update, true);
    };
  }, [anchorRef]);

  useEffect(() => {
    const node = dialogRef.current;
    const focusable = node?.querySelector<HTMLElement>('a, button');
    focusable?.focus();

    function onKeyDown(keyboardEvent: KeyboardEvent) {
      if (keyboardEvent.key === 'Escape') {
        keyboardEvent.preventDefault();
        onClose();
      }
    }

    function onPointerDown(pointerEvent: PointerEvent) {
      const target = pointerEvent.target as Node;
      if (node?.contains(target) || anchorRef.current?.contains(target)) {
        return;
      }
      onClose();
    }

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('pointerdown', onPointerDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('pointerdown', onPointerDown);
    };
  }, [anchorRef, onClose]);

  if (!isClient) return null;

  return createPortal(
    <div
      ref={dialogRef}
      id={id}
      role="dialog"
      aria-modal="false"
      aria-labelledby={`${id}-title`}
      data-testid="exhibition-preview-popover"
      className={cn(
        'relative z-[60] w-[min(18.5rem,calc(100vw-2rem))] rounded-md border border-[#e4e4e4] bg-white p-3 shadow-lg sm:w-[19rem]',
        mobile
          ? 'fixed inset-x-4 bottom-4 mx-auto'
          : 'fixed',
      )}
      style={
        mobile
          ? undefined
          : {
              top: coords.top,
              left: coords.left,
              transform: 'translate(-50%, calc(-100% - 12px))',
            }
      }
    >
      {mobile ? null : (
        <span
          aria-hidden
          className="absolute left-1/2 top-full -mt-px size-2.5 -translate-x-1/2 rotate-45 border-b border-e border-[#e4e4e4] bg-white"
        />
      )}
      <div className="relative overflow-hidden bg-surface-50">
        <span
          aria-hidden
          className="absolute start-0 top-0 z-10 h-full w-1.5 bg-accent-500"
        />
        <div className="relative mx-auto h-16 w-28">
          <Image
            src={event.coverImage}
            alt=""
            fill
            className="object-contain p-2"
            sizes="112px"
          />
        </div>
      </div>
      <p
        id={`${id}-title`}
        className="mt-3 text-sm font-extrabold leading-6 text-ink-950"
      >
        {event.title}
      </p>
      <ul className="mt-2 space-y-1.5 text-xs text-ink-600">
        <li className="flex items-center gap-2">
          <CalendarDays className="size-3.5 shrink-0 text-ink-400" aria-hidden />
          <span>{event.formattedDate}</span>
        </li>
        {event.formattedTime ? (
          <li className="flex items-center gap-2">
            <Clock className="size-3.5 shrink-0 text-ink-400" aria-hidden />
            <span>{event.formattedTime}</span>
          </li>
        ) : null}
        <li className="flex items-center gap-2">
          <Bookmark className="size-3.5 shrink-0 text-ink-400" aria-hidden />
          <span>{event.categoryLabel}</span>
        </li>
      </ul>
      <p className="mt-3 text-center">
        <Link
          href={routes.advice.exhibitions.details(event.slug)}
          className="text-sm font-bold text-brand-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
        >
          {exhibitionCopy.details}
        </Link>
      </p>
    </div>,
    document.body,
  );
}
