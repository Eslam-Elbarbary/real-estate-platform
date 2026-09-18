'use client';

import { useEffect, useRef, useState } from 'react';
import type { UpdatePropertyInput } from '../../types';
import type { WizardAutosaveStatus } from './wizard-types';

const DEFAULT_DEBOUNCE_MS = 7000;

export interface UseWizardAutosaveOptions {
  /** Only for existing DRAFT properties. */
  enabled: boolean;
  dirty: boolean;
  /** Bumps when form/location content changes while dirty. */
  revision: number;
  debounceMs?: number;
  buildPayload: () => UpdatePropertyInput;
  save: (
    payload: UpdatePropertyInput,
  ) => Promise<{ ok: true } | { ok: false; error: string }>;
  onSaved: () => void;
}

/**
 * Debounced draft autosave. Skips overlapping requests; keeps dirty if edits
 * happened during an in-flight save.
 */
export function useWizardAutosave({
  enabled,
  dirty,
  revision,
  debounceMs = DEFAULT_DEBOUNCE_MS,
  buildPayload,
  save,
  onSaved,
}: UseWizardAutosaveOptions): WizardAutosaveStatus {
  const [status, setStatus] = useState<WizardAutosaveStatus>('idle');
  const inFlightRef = useRef(false);
  const revisionRef = useRef(revision);
  const buildPayloadRef = useRef(buildPayload);
  const saveRef = useRef(save);
  const onSavedRef = useRef(onSaved);

  useEffect(() => {
    revisionRef.current = revision;
  }, [revision]);

  useEffect(() => {
    buildPayloadRef.current = buildPayload;
    saveRef.current = save;
    onSavedRef.current = onSaved;
  }, [buildPayload, save, onSaved]);

  useEffect(() => {
    if (!enabled) {
      setStatus('idle');
      return;
    }

    if (!dirty) {
      return;
    }

    const timer = window.setTimeout(() => {
      void (async () => {
        if (inFlightRef.current) {
          return;
        }

        const revisionAtStart = revisionRef.current;
        inFlightRef.current = true;
        setStatus('saving');

        try {
          const result = await saveRef.current(buildPayloadRef.current());
          if (result.ok) {
            setStatus('saved');
            // Only clear dirty if nothing changed during the request.
            if (revisionRef.current === revisionAtStart) {
              onSavedRef.current();
            }
          } else {
            setStatus('error');
          }
        } catch {
          setStatus('error');
        } finally {
          inFlightRef.current = false;
        }
      })();
    }, debounceMs);

    return () => window.clearTimeout(timer);
  }, [enabled, dirty, revision, debounceMs]);

  return status;
}
