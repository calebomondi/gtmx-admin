import { Badge } from "@workspace/ui/components/badge"

import { FilterSelect } from "@/components/filter-select"
import { PageShell } from "@/components/page-shell"
import { PagedTable, type Column } from "@/components/paged-table"
import { adminApi, type SignalRow } from "@/lib/api/admin"
import { formatRelative } from "@/lib/format"
import { useApi } from "@/lib/use-api"
import { useSearchState } from "@/lib/use-search-state"

// Mirrors the categories emitted in backend/app/runs/signals.py.
const CATEGORIES = ["product", "competitor", "opportunity", "outbound", "agent"] as const

const COLUMNS: Column<SignalRow>[] = [
  {
    header: "Signal",
    cell: (s) => (
      <div className="flex flex-col">
        <span className="font-medium">
          {s.title} {s.hot && <Badge variant="destructive">hot</Badge>}
        </span>
        {s.summary && <span className="line-clamp-1 text-xs text-muted-foreground">{s.summary}</span>}
      </div>
    ),
  },
  { header: "Category", cell: (s) => s.category },
  { header: "User", cell: (s) => s.user_email ?? s.user_id.slice(0, 8) },
  { header: "Workspace", cell: (s) => s.workspace_name ?? "—" },
  { header: "When", cell: (s) => formatRelative(s.created_at) },
]

export function SignalsPage() {
  const search = useSearchState()
  const category = search.get("category")
  const { data, error, loading, reload } = useApi(`signals:${search.key}`, () =>
    adminApi.signals({ page: search.page, category }),
  )
  return (
    <PageShell
      title="Signals"
      actions={
        <FilterSelect label="Categories" value={category} options={CATEGORIES} onChange={(v) => search.set("category", v)} />
      }
    >
      <PagedTable
        columns={COLUMNS}
        data={data}
        loading={loading}
        error={error}
        empty="No signals yet"
        rowKey={(s) => s.id}
        onPage={(p) => search.set("page", p)}
        onRetry={reload}
      />
    </PageShell>
  )
}
