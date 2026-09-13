'use client';

import { useEffect, useState, useTransition } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Bookmark, Heart } from 'lucide-react';
import { routes } from '@/config/routes';
import { uiLabels } from '@/config/labels';
import { cn } from '@/lib/utils/cn';
import {
  addFavoriteAction,
  removeFavoriteAction,
} from './actions';

export type FavoriteButtonVariant = 'card' | 'map' | 'action';

interface FavoriteButtonProps {
  propertyId: string;
  initialIsFavorite?: boolean;
  variant?: FavoriteButtonVariant;
  className?: string;
}

function currentReturnTo(pathname: string): string {
  if (typeof window !== 'undefined') {
    return `${window.location.pathname}${window.location.search}`;
  }
  return pathname;
}

export function FavoriteButton({
  propertyId,
  initialIsFavorite = false,
  variant = 'card',
  className,
}: FavoriteButtonProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    setIsFavorite(initialIsFavorite);
  }, [initialIsFavorite, propertyId]);

  const toggle = () => {
    if (pending) {
      return;
    }

    setError(null);
    const next = !isFavorite;
    setIsFavorite(next);

    startTransition(async () => {
      const result = next
        ? await addFavoriteAction(propertyId)
        : await removeFavoriteAction(propertyId);

      if (!result.ok) {
        setIsFavorite(!next);
        if (result.code === 'UNAUTHORIZED') {
          router.push(
            routes.auth.loginWithReturnTo(currentReturnTo(pathname)),
          );
          return;
        }
        setError(result.error);
        return;
      }

      setIsFavorite(result.data.isFavorite);
      router.refresh();
    });
  };

  if (variant === 'action') {
    return (
      <div className={cn('relative', className)}>
        <button
          type="button"
          onClick={toggle}
          disabled={pending}
          aria-pressed={isFavorite}
          aria-label={
            isFavorite ? uiLabels.removeFavorite : uiLabels.addFavorite
          }
          className={cn(
            'inline-flex items-center gap-1.5 rounded-md px-2.5 py-2 text-sm font-semibold transition-colors hover:bg-surface-50',
            isFavorite
              ? 'bg-brand-50 text-brand-700'
              : 'text-brand-700 hover:text-brand-600',
            pending && 'opacity-70',
          )}
        >
          <Bookmark
            className={cn('size-[18px]', isFavorite && 'fill-brand-600')}
            aria-hidden
          />
          {uiLabels.saveAction}
        </button>
        {error ? (
          <p className="absolute top-full start-0 mt-1 max-w-[16rem] text-xs font-medium text-danger-600">
            {error}
          </p>
        ) : null}
      </div>
    );
  }

  if (variant === 'map') {
    return (
      <button
        type="button"
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          toggle();
        }}
        disabled={pending}
        aria-pressed={isFavorite}
        aria-label={isFavorite ? uiLabels.removeFavorite : uiLabels.addFavorite}
        title={error ?? undefined}
        className={cn(
          'inline-flex size-7 items-center justify-center text-ink-500 hover:text-brand-700',
          isFavorite && 'text-brand-700',
          pending && 'opacity-70',
          className,
        )}
      >
        <Heart
          className={cn('size-3.5', isFavorite && 'fill-brand-600 text-brand-600')}
          aria-hidden
        />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        toggle();
      }}
      disabled={pending}
      aria-pressed={isFavorite}
      aria-label={isFavorite ? uiLabels.removeFavorite : uiLabels.addFavorite}
      title={error ?? undefined}
      className={cn(
        'absolute top-3 start-3 z-10 inline-flex size-10 items-center justify-center rounded-full bg-white/95 text-ink-700 shadow-sm transition-colors hover:text-brand-700',
        pending && 'opacity-70',
        className,
      )}
    >
      <Heart
        className={cn('size-[18px]', isFavorite && 'fill-brand-600 text-brand-600')}
        aria-hidden
      />
    </button>
  );
}
