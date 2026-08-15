import { getAppIcon } from '@/config/icons';
import { uiLabels } from '@/config/labels';
import { EgyptFlag } from './egypt-flag';

const ChevronIcon = getAppIcon('chevronDown');

export function MobileNavigationLanguage() {
  return (
    <button
      type="button"
      className="inline-flex min-h-11 items-center gap-1.5 rounded-md px-2 text-sm font-semibold text-ink-800 transition-colors hover:bg-surface-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
      aria-label={uiLabels.languageSwitchAria}
      title={uiLabels.languageSwitchAria}
      data-testid="mobile-nav-language"
    >
      <EgyptFlag />
      <span>{uiLabels.languageCode}</span>
      <ChevronIcon size={14} strokeWidth={2} aria-hidden />
    </button>
  );
}
