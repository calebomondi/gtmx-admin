import { useNavigate } from "react-router-dom"
import { Input } from "@workspace/ui/components/input"

import { PageShell } from "@/components/page-shell"
import { PagedTable, type Column } from "@/components/paged-table"
import { StatusBadge } from "@/components/status-badge"
import { adminApi, type LaceRow } from "@/lib/api/admin"
import { formatRelative, formatUsd } from "@/lib/format"
import { useApi } from "@/lib/use-api"
import { useSearchState } from "@/lib/use-search-state"

const COLUMNS: Column<LaceRow>[] = [
  {
    header: "Lace",
    cell: (l) => (
      <span className="flex flex-col">
        <span>{l.name}</span>
        <span className="text-xs text-muted-foreground">{l.startup_name ?? l.website}</span>
      </span>
    ),
  },
  { header: "Status", hideBelow: "sm", cell: (l) => <StatusBadge status={l.status} /> },
  { header: "Owner", hideBelow: "md", cell: (l) => l.user_email ?? <span className="font-mono text-xs">{l.user_id.slice(0, 8)}</span> },
  { header: "Accounts", hideBelow: "lg", cell: (l) => l.accounts, className: "text-right tabular-nums" },
  { header: "Contacts", hideBelow: "lg", cell: (l) => l.contacts, className: "text-right tabular-nums" },
  { header: "Sent", hideBelow: "lg", cell: (l) => l.sent, className: "text-right tabular-nums" },
  { header: "Runs", hideBelow: "sm", cell: (l) => l.runs, className: "text-right tabular-nums" },
  { header: "Cost", hideBelow: "sm", cell: (l) => formatUsd(l.cost_usd), className: "text-right tabular-nums" },
  { header: "Last active", hideBelow: "md", cell: (l) => formatRelative(l.last_active_at) },
]

/** Every user's Laces, most recently active first. */
export function LacesPage() {
  const navigate = useNavigate()
  const search = useSearchState()
  const q = search.get("q")
  const { data, error, loading, reload } = useApi(`laces:${search.key}`, () =>
    adminApi.laces({ page: search.page, q, user_id: search.get("user_id") }),
  )
  return (
    <PageShell
      title="Laces"
      actions={
        <Input
          className="w-full sm:w-72"
          placeholder="Search name, website or startup"
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
        empty={q ? "No Laces match that search" : "No Laces yet"}
        rowKey={(l) => l.id}
        onRowClick={(l) => navigate(`/laces/${l.id}`)}
        onPage={(p) => search.set("page", p)}
        onRetry={reload}
      />
    </PageShell>
  )
}
