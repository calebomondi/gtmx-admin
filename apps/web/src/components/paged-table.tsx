import type { ReactNode } from "react"
import { Button } from "@workspace/ui/components/button"
import { Skeleton } from "@workspace/ui/components/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@workspace/ui/components/table"
import { cn } from "@workspace/ui/lib/utils"

import type { Page } from "@/lib/api/admin"

export interface Column<T> {
  header: string
  cell: (row: T) => ReactNode
  className?: string
}

interface Props<T> {
  columns: Column<T>[]
  data: Page<T> | undefined
  loading: boolean
  error?: string
  empty: string
  rowKey: (row: T) => string
  onRowClick?: (row: T) => void
  onPage: (page: number) => void
  onRetry: () => void
}

/** Every admin list: server-paginated, with loading, empty and error states. */
export function PagedTable<T>({ columns, data, loading, error, empty, rowKey, onRowClick, onPage, onRetry }: Props<T>) {
  const pages = data ? Math.max(1, Math.ceil(data.total / data.per_page)) : 1
  return (
    <div className="flex flex-col gap-3">
      {error && (
        <div className="flex items-center justify-between border border-destructive/40 px-3 py-2 text-sm text-destructive">
          <span>{error}</span>
          <Button size="sm" variant="outline" onClick={onRetry}>
            Retry
          </Button>
        </div>
      )}
      <div className={cn("overflow-x-auto border transition-opacity", loading && data && "opacity-60")}>
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((c) => (
                <TableHead key={c.header} className={c.className}>
                  {c.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {!data && loading &&
              Array.from({ length: 5 }, (_, i) => (
                <TableRow key={i}>
                  {columns.map((c) => (
                    <TableCell key={c.header}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            {data?.items.length === 0 && (
              <TableRow>
                <TableCell colSpan={columns.length} className="py-10 text-center text-muted-foreground">
                  {empty}
                </TableCell>
              </TableRow>
            )}
            {data?.items.map((row) => (
              <TableRow
                key={rowKey(row)}
                className={cn(onRowClick && "cursor-pointer")}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
              >
                {columns.map((c) => (
                  <TableCell key={c.header} className={c.className}>
                    {c.cell(row)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {data && data.total > 0 && (
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>
            {data.total} total · page {data.page} of {pages}
          </span>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" disabled={data.page <= 1} onClick={() => onPage(data.page - 1)}>
              Previous
            </Button>
            <Button size="sm" variant="outline" disabled={data.page >= pages} onClick={() => onPage(data.page + 1)}>
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
