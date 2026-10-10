import { useNavigate } from "react-router-dom"
import { Input } from "@workspace/ui/components/input"

import { PageShell } from "@/components/page-shell"
import { PagedTable, type Column } from "@/components/paged-table"
import { adminApi, type WorkspaceRow } from "@/lib/api/admin"
import { formatRelative } from "@/lib/format"
import { useApi } from "@/lib/use-api"
import { useSearchState } from "@/lib/use-search-state"

const COLUMNS: Column<WorkspaceRow>[] = [
  {
    header: "Workspace",
    cell: (w) => (
      <span>
        {w.name ?? "Untitled"} {w.archived && <span className="text-muted-foreground">(archived)</span>}
      </span>
    ),
  },
  { header: "Owner", cell: (w) => w.user_email ?? <span className="font-mono text-xs">{w.user_id.slice(0, 8)}</span> },
  { header: "Competitors", cell: (w) => w.competitors, className: "text-right tabular-nums" },
  { header: "Accounts", cell: (w) => w.accounts, className: "text-right tabular-nums" },
  { header: "Runs", cell: (w) => w.runs, className: "text-right tabular-nums" },
  { header: "Last activity", cell: (w) => formatRelative(w.last_activity) },
  { header: "Created", cell: (w) => formatRelative(w.date_created) },
]

export function WorkspacesPage() {
  const navigate = useNavigate()
  const search = useSearchState()
  const q = search.get("q")
  const { data, error, loading, reload } = useApi(`workspaces:${search.key}`, () =>
    adminApi.workspaces({ page: search.page, q }),
  )
  return (
    <PageShell
      title="Workspaces"
      actions={
        <Input
          className="w-72"
          placeholder="Search workspace name"
          defaultValue={q}
          onKeyDown={(e) => e.key === "Enter" && search.set("q", e.currentTarget.value.trim())}
        />
      }
    >
      <PagedTable
        columns={COLUMNS}
        data={data}
        loading={loading}
        error={error}
        empty={q ? "No workspaces match that search" : "No workspaces yet"}
        rowKey={(w) => w.id}
        onRowClick={(w) => navigate(`/users/${w.user_id}`)}
        onPage={(p) => search.set("page", p)}
        onRetry={reload}
      />
    </PageShell>
  )
}
