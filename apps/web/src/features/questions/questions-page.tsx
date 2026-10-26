import { Link, useNavigate } from "react-router-dom"
import { Input } from "@workspace/ui/components/input"

import { PageShell } from "@/components/page-shell"
import { PagedTable, type Column } from "@/components/paged-table"
import { StatusBadge } from "@/components/status-badge"
import { adminApi, type QuestionRow } from "@/lib/api/admin"
import { formatRelative } from "@/lib/format"
import { useApi } from "@/lib/use-api"
import { useSearchState } from "@/lib/use-search-state"

const COLUMNS: Column<QuestionRow>[] = [
  { header: "Question", cell: (q) => <span className="line-clamp-3 max-w-xl whitespace-pre-wrap">{q.text}</span> },
  {
    header: "Lace",
    hideBelow: "md",
    cell: (q) =>
      q.lace_id ? (
        <Link to={`/laces/${q.lace_id}`} onClick={(e) => e.stopPropagation()} className="underline-offset-4 hover:underline">
          {q.lace_name ?? "Deleted Lace"}
        </Link>
      ) : (
        "—"
      ),
  },
  { header: "Founder", hideBelow: "lg", cell: (q) => q.user_email ?? <span className="font-mono text-xs">{q.user_id.slice(0, 8)}</span> },
  { header: "Turn", hideBelow: "sm", cell: (q) => <StatusBadge status={q.status} /> },
  { header: "Asked", hideBelow: "sm", cell: (q) => formatRelative(q.created_at) },
]

/** What founders ask their Laces, newest first; a row opens the run that answered it. */
export function QuestionsPage() {
  const navigate = useNavigate()
  const search = useSearchState()
  const q = search.get("q")
  const { data, error, loading, reload } = useApi(`questions:${search.key}`, () =>
    adminApi.questions({ page: search.page, q, user_id: search.get("user_id"), lace_id: search.get("lace_id") }),
  )
  return (
    <PageShell
      title="Questions"
      actions={
        <Input
          className="w-full sm:w-72"
          placeholder="Search what founders asked"
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
        empty={q ? "No questions match that search" : "No questions yet"}
        rowKey={(row) => row.run_id}
        onRowClick={(row) => navigate(`/runs/${row.run_id}`)}
        onPage={(p) => search.set("page", p)}
        onRetry={reload}
      />
    </PageShell>
  )
}
