import { useNavigate } from "react-router-dom"

import { FilterSelect } from "@/components/filter-select"
import { PageShell } from "@/components/page-shell"
import { PagedTable } from "@/components/paged-table"
import { RUN_COLUMNS } from "@/components/run-columns"
import { adminApi, RUN_KINDS, RUN_STATUSES } from "@/lib/api/admin"
import { useApi } from "@/lib/use-api"
import { useSearchState } from "@/lib/use-search-state"

export function RunsPage() {
  const navigate = useNavigate()
  const search = useSearchState()
  const status = search.get("status")
  const kind = search.get("kind")
  const { data, error, loading, reload } = useApi(`runs:${search.key}`, () =>
    adminApi.runs({ page: search.page, status, kind, user_id: search.get("user_id"), lace_id: search.get("lace_id") }),
  )
  return (
    <PageShell
      title="Runs"
      actions={
        <>
          <FilterSelect label="Statuses" value={status} options={RUN_STATUSES} onChange={(v) => search.set("status", v)} />
          <FilterSelect label="Kinds" value={kind} options={RUN_KINDS} onChange={(v) => search.set("kind", v)} />
        </>
      }
    >
      <PagedTable
        columns={RUN_COLUMNS}
        data={data}
        loading={loading}
        error={error}
        empty="No runs match these filters"
        rowKey={(r) => r.id}
        onRowClick={(r) => navigate(`/runs/${r.id}`)}
        onPage={(p) => search.set("page", p)}
        onRetry={reload}
      />
    </PageShell>
  )
}
