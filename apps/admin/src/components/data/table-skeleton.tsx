import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils/cn';

export interface TableSkeletonProps {
  rows?: number;
  columns?: number;
  className?: string;
}

export function TableSkeleton({
  rows = 6,
  columns = 5,
  className,
}: TableSkeletonProps) {
  const rowKeys = Array.from({ length: rows }, (_, index) => `row-${index}`);
  const columnKeys = Array.from({ length: columns }, (_, index) => `col-${index}`);

  return (
    <Table className={className}>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          {columnKeys.map((columnKey) => (
            <TableHead key={columnKey}>
              <div className="h-3 w-20 animate-pulse rounded bg-surface-100" />
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {rowKeys.map((rowKey) => (
          <TableRow key={rowKey} className="hover:bg-transparent">
            {columnKeys.map((columnKey) => (
              <TableCell key={columnKey}>
                <div
                  className={cn(
                    'h-4 animate-pulse rounded bg-surface-100',
                    columnKey === columnKeys[0] ? 'w-24' : 'w-full max-w-[160px]',
                  )}
                />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
