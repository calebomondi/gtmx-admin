import { useNavigate } from "react-router-dom"
import { Badge } from "@workspace/ui/components/badge"
import { Input } from "@workspace/ui/components/input"

import { PageShell } from "@/components/page-shell"
import { PagedTable, type Column } from "@/components/paged-table"
import { adminApi, type UserRow } from "@/lib/api/admin"
import { formatDuration, formatRelative } from "@/lib/format"
import { useApi } from "@/lib/use-api"
import { useSearchState } from "@/lib/use-search-state"

const COLUMNS: Column<UserRow>[] = [
  {
    header: "User",
    cell: (u) => (
      <div className="flex flex-col">
        <span className="font-medium">{u.email}</span>
        {u.name && <span className="text-xs text-muted-foreground">{u.name}</span>}
      </div>
    ),
  },
  {
    header: "Status",
    cell: (u) => (
      <div className="flex gap-3">
        {u.is_admin && <Badge>admin</Badge>}
        {u.suspended && <Badge variant="destructive">suspended</Badge>}
        {!u.is_admin && !u.suspended && <Badge variant="secondary">active</Badge>}
      </div>
    ),
  },
  { header: "Workspaces", cell: (u) => u.workspaces, className: "text-right tabular-nums" },
  { header: "Projects", cell: (u) => u.projects, className: "text-right tabular-nums" },
  { header: "Runs", cell: (u) => u.runs, className: "text-right tabular-nums" },
  { header: "Connected", cell: (u) => u.connections ?? "—", className: "text-right tabular-nums" },
  { header: "Time (30d)", cell: (u) => formatDuration(u.active_seconds_30d), className: "text-right tabular-nums" },
  { header: "Last seen", cell: (u) => formatRelative(u.last_seen_at) },
  { header: "Joined", cell: (u) => formatRelative(u.created_at) },
]

export function UsersPage() {
  const navigate = useNavigate()
  const search = useSearchState()
  const q = search.get("q")
  const { data, error, loading, reload } = useApi(`users:${search.key}`, () =>
    adminApi.users({ page: search.page, q }),
  )
  return (
    <PageShell
      title="Users"
      actions={
        <Input
          className="w-72"
          placeholder="Search email or name"
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
        empty={q ? "No users match that search" : "No users yet"}
        rowKey={(u) => u.id}
        onRowClick={(u) => navigate(`/users/${u.id}`)}
        onPage={(p) => search.set("page", p)}
        onRetry={reload}
      />
    </PageShell>
  )
}
