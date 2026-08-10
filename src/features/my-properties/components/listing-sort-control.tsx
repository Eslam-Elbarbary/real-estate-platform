'use client';

import type { MyPropertiesQuery } from '../schemas';
import { myPropertiesCopy } from '../config/copy';

interface ListingSortControlProps {
  filters: MyPropertiesQuery;
}

export function ListingSortControl({ filters }: ListingSortControlProps) {
  return (
    <form method="get" action="/my-properties" className="inline-flex items-center gap-2">
      <input type="hidden" name="status" value={filters.status} />
      {filters.q ? <input type="hidden" name="q" value={filters.q} /> : null}
      <label
        htmlFor="my-properties-sort"
        className="text-xs font-semibold text-ink-600"
      >
        {myPropertiesCopy.sortBy}
      </label>
      <select
        id="my-properties-sort"
        name="sort"
        defaultValue={filters.sort}
        className="h-9 rounded-md border border-[#e5e5e5] bg-white px-2 text-sm text-ink-800"
        onChange={(event) => {
          event.currentTarget.form?.requestSubmit();
        }}
      >
        {(
          Object.keys(myPropertiesCopy.sortLabels) as Array<
            keyof typeof myPropertiesCopy.sortLabels
          >
        ).map((key) => (
          <option key={key} value={key}>
            {myPropertiesCopy.sortLabels[key]}
          </option>
        ))}
      </select>
    </form>
  );
}
