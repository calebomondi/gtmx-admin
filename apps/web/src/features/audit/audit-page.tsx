import { Link } from "react-router-dom"

import { FilterSelect } from "@/components/filter-select"
import { PageShell } from "@/components/page-shell"
import { PagedTable, type Column } from "@/components/paged-table"
import { adminApi, type AuditRow } from "@/lib/api/admin"
import { formatDateTime } from "@/lib/format"
import { useApi } from "@/lib/use-api"
import { useSearchState } from "@/lib/use-search-state"

const ACTIONS = ["admin.grant", "admin.revoke", "user.suspend", "user.reactivate", "run.cancel", "quota.set"] as const

function Change({ value }: { value: Record<string, unknown> | null }) {
  return <code className="text-xs break-all">{value ? JSON.stringify(value) : "—"}</code>
}

const COLUMNS: Column<AuditRow>[] = [
  { header: "When", cell: (a) => formatDateTime(a.created_at) },
  { header: "Who", hideBelow: "md", cell: (a) => a.actor_email ?? "system" },
  { header: "Action", cell: (a) => <span className="font-mono text-xs">{a.action}</span> },
  {
    header: "Target", hideBelow: "sm",
    cell: (a) => {
      if (!a.target_id) return a.target_type
      const to = a.target_type === "user" ? `/users/${a.target_id}` : a.target_type === "run" ? `/runs/${a.target_id}` : null
      const label = `${a.target_type} ${a.target_id.slice(0, 8)}`
      return to ? <Link className="underline-offset-4 hover:underline" to={to}>{label}</Link> : label
    },
  },
  { header: "Before", hideBelow: "lg", cell: (a) => <Change value={a.before} />, className: "min-w-48 max-w-64 whitespace-normal" },
  { header: "After", hideBelow: "lg", cell: (a) => <Change value={a.after} />, className: "min-w-48 max-w-64 whitespace-normal" },
]

export function AuditPage() {
  const search = useSearchState()
  const action = search.get("action")
  const { data, error, loading, reload } = useApi(`audit:${search.key}`, () =>
    adminApi.audit({ page: search.page, action }),
  )
  return (
    <PageShell
      title="Audit log"
      actions={<FilterSelect label="Actions" value={action} options={ACTIONS} onChange={(v) => search.set("action", v)} />}
    >
      <PagedTable
        columns={COLUMNS}
        data={data}
        loading={loading}
        error={error}
        empty="No admin actions recorded"
        rowKey={(a) => a.id}
        onPage={(p) => search.set("page", p)}
        onRetry={reload}
      />
    </PageShell>
  )
}
