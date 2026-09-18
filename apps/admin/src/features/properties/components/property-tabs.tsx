'use client';

import { useId, useState, type ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

export type PropertyTabId =
  | 'overview'
  | 'pricing'
  | 'location'
  | 'owner'
  | 'media'
  | 'activity';

export interface PropertyTabItem {
  id: PropertyTabId;
  label: string;
  content: ReactNode;
}

interface PropertyTabsProps {
  tabs: PropertyTabItem[];
  defaultTab?: PropertyTabId;
  className?: string;
}

export function PropertyTabs({
  tabs,
  defaultTab,
  className,
}: PropertyTabsProps) {
  const baseId = useId();
  const initial =
    defaultTab && tabs.some((tab) => tab.id === defaultTab)
      ? defaultTab
      : (tabs[0]?.id ?? 'overview');
  const [activeId, setActiveId] = useState<PropertyTabId>(initial);
  const active = tabs.find((tab) => tab.id === activeId) ?? tabs[0];

  if (tabs.length === 0) {
    return null;
  }

  return (
    <div className={cn('space-y-4', className)}>
      <div className="-mx-1 overflow-x-auto px-1">
        <div
          role="tablist"
          aria-label="أقسام تفاصيل العقار"
          className="flex min-w-max gap-1 rounded-xl border border-border bg-surface-50/80 p-1"
        >
          {tabs.map((tab) => {
            const selected = tab.id === active?.id;
            return (
              <button
                key={tab.id}
                id={`${baseId}-tab-${tab.id}`}
                type="button"
                role="tab"
                aria-selected={selected}
                aria-controls={`${baseId}-panel-${tab.id}`}
                className={cn(
                  'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  selected
                    ? 'bg-white text-ink-900 shadow-sm'
                    : 'text-ink-500 hover:text-ink-800',
                )}
                onClick={() => setActiveId(tab.id)}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {active ? (
        <div
          id={`${baseId}-panel-${active.id}`}
          role="tabpanel"
          aria-labelledby={`${baseId}-tab-${active.id}`}
        >
          {active.content}
        </div>
      ) : null}
    </div>
  );
}
