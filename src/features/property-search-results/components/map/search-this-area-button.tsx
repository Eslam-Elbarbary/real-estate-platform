'use client';

import { uiLabels } from '@/config/labels';

interface SearchThisAreaButtonProps {
  visible: boolean;
  onClick: () => void;
}

export function SearchThisAreaButton({ visible, onClick }: SearchThisAreaButtonProps) {
  if (!visible) return null;

  return (
    <button
      type="button"
      data-testid="search-this-area"
      onClick={onClick}
      className="absolute start-1/2 top-4 z-[400] -translate-x-1/2 rounded-full bg-white px-4 py-2 text-sm font-bold text-brand-700 shadow-md hover:bg-brand-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
    >
      {uiLabels.searchThisArea}
    </button>
  );
}
