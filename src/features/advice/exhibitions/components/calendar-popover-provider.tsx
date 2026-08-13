'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

interface CalendarPopoverContextValue {
  openId: string | null;
  setOpenId: (id: string | null) => void;
}

const CalendarPopoverContext = createContext<CalendarPopoverContextValue | null>(
  null,
);

export function CalendarPopoverProvider({ children }: { children: ReactNode }) {
  const [openId, setOpenId] = useState<string | null>(null);
  const value = useMemo(
    () => ({
      openId,
      setOpenId,
    }),
    [openId],
  );

  return (
    <CalendarPopoverContext.Provider value={value}>
      {children}
    </CalendarPopoverContext.Provider>
  );
}

export function useCalendarPopover(id: string) {
  const context = useContext(CalendarPopoverContext);
  if (!context) {
    throw new Error('useCalendarPopover must be used within CalendarPopoverProvider');
  }

  const open = context.openId === id;
  const setOpen = useCallback(
    (next: boolean) => {
      if (next) context.setOpenId(id);
      else context.setOpenId(null);
    },
    [context, id],
  );

  return { open, setOpen };
}
