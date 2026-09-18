import type { ReactNode } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableEmptyRow,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils/cn';

export interface DataTableColumn<T> {
  key: string;
  label: string;
  className?: string;
  render: (row: T) => ReactNode;
}

export interface DataTableSelection<T> {
  getRowId: (row: T) => string;
  selectedIds: Set<string>;
  onToggleRow: (id: string) => void;
  onToggleAll: (checked: boolean) => void;
}

export interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  emptyMessage?: string;
  selection?: DataTableSelection<T>;
}

export function DataTable<T>({
  columns,
  data,
  emptyMessage = 'لا توجد بيانات',
  selection,
}: DataTableProps<T>) {
  const allIds = selection ? data.map((row) => selection.getRowId(row)) : [];
  const selectedOnPage = selection
    ? allIds.filter((id) => selection.selectedIds.has(id))
    : [];
  const allSelected =
    allIds.length > 0 && selectedOnPage.length === allIds.length;
  const someSelected =
    selectedOnPage.length > 0 && selectedOnPage.length < allIds.length;
  const colSpan = columns.length + (selection ? 1 : 0);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {selection ? (
            <TableHead className="w-12">
              <input
                type="checkbox"
                className="size-4 rounded border-border accent-brand-600"
                checked={allSelected}
                ref={(input) => {
                  if (input) {
                    input.indeterminate = someSelected;
                  }
                }}
                aria-label="تحديد كل الصفوف في الصفحة"
                onChange={(event) => {
                  selection.onToggleAll(event.target.checked);
                }}
              />
            </TableHead>
          ) : null}
          {columns.map((column) => (
            <TableHead key={column.key} className={column.className}>
              {column.label}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.length === 0 ? (
          <TableEmptyRow colSpan={colSpan}>{emptyMessage}</TableEmptyRow>
        ) : (
          data.map((row, rowIndex) => {
            const rowId = selection?.getRowId(row);
            const isSelected =
              rowId != null && selection?.selectedIds.has(rowId);

            return (
              <TableRow
                key={rowId ?? rowIndex}
                className={cn(isSelected && 'bg-brand-50/50')}
              >
                {selection && rowId ? (
                  <TableCell className="w-12">
                    <input
                      type="checkbox"
                      className="size-4 rounded border-border accent-brand-600"
                      checked={Boolean(isSelected)}
                      aria-label="تحديد الصف"
                      onChange={() => {
                        selection.onToggleRow(rowId);
                      }}
                    />
                  </TableCell>
                ) : null}
                {columns.map((column) => (
                  <TableCell key={column.key} className={column.className}>
                    {column.render(row)}
                  </TableCell>
                ))}
              </TableRow>
            );
          })
        )}
      </TableBody>
    </Table>
  );
}
