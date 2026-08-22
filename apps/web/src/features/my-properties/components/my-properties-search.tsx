import type { MyPropertiesQuery } from '../schemas';
import { buildMyPropertiesHref } from '../search-params';
import { myPropertiesCopy } from '../config/copy';

interface MyPropertiesSearchProps {
  filters: MyPropertiesQuery;
}

export function MyPropertiesSearch({ filters }: MyPropertiesSearchProps) {
  return (
    <section className="rounded-xl border border-[#e5e5e5] bg-white p-4 sm:p-5">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-base font-extrabold text-ink-950">
          {myPropertiesCopy.searchTitle}
        </h2>
        <div className="flex items-center gap-3 text-xs">
          <span className="font-semibold text-ink-600">
            {myPropertiesCopy.advancedSearch}
          </span>
          <a
            href={buildMyPropertiesHref({
              status: filters.status,
              sort: filters.sort,
            })}
            className="font-semibold text-brand-700 hover:underline"
          >
            {myPropertiesCopy.cancel}
          </a>
        </div>
      </div>
      <form method="get" action="/my-properties" className="space-y-3">
        <input type="hidden" name="status" value={filters.status} />
        <input type="hidden" name="sort" value={filters.sort} />
        <label className="block text-sm" htmlFor="my-properties-q">
          <span className="sr-only">{myPropertiesCopy.searchPlaceholder}</span>
          <input
            id="my-properties-q"
            name="q"
            type="search"
            defaultValue={filters.q}
            placeholder={myPropertiesCopy.searchPlaceholder}
            className="h-11 w-full rounded-md border border-[#e5e5e5] bg-white px-3 text-sm text-ink-900 placeholder:text-ink-400 focus-visible:border-brand-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-200"
          />
        </label>
        <button
          type="submit"
          className="inline-flex h-10 items-center justify-center rounded-md bg-brand-600 px-6 text-sm font-bold text-white hover:bg-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
        >
          {myPropertiesCopy.searchSubmit}
        </button>
      </form>
    </section>
  );
}
