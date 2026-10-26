import { Link } from "react-router-dom"
import { toast } from "sonner"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"

import { FilterSelect } from "@/components/filter-select"
import { PageShell } from "@/components/page-shell"
import { PagedTable, type Column } from "@/components/paged-table"
import { adminApi, FEEDBACK_STATUSES, type FeedbackRow, type FeedbackStatus } from "@/lib/api/admin"
import { formatRelative } from "@/lib/format"
import { useApi } from "@/lib/use-api"
import { useSearchState } from "@/lib/use-search-state"

function columns(mark: (row: FeedbackRow, status: FeedbackStatus) => void): Column<FeedbackRow>[] {
  return [
    {
      header: "Feedback",
      cell: (f) => (
        <span className="flex max-w-xl flex-col gap-1">
          <span className={f.status === "new" ? "whitespace-pre-wrap font-medium" : "whitespace-pre-wrap"}>{f.text}</span>
          {f.path && <span className="font-mono text-xs text-muted-foreground">{f.path}</span>}
        </span>
      ),
    },
    {
      header: "From",
      hideBelow: "md",
      cell: (f) => (
        <Link to={`/users/${f.user_id}`} className="underline-offset-4 hover:underline">
          {f.email ?? f.user_id.slice(0, 8)}
        </Link>
      ),
    },
    {
      header: "Lace",
      hideBelow: "lg",
      cell: (f) =>
        f.lace_id ? (
          <Link to={`/laces/${f.lace_id}`} className="underline-offset-4 hover:underline">{f.lace_name ?? "Deleted Lace"}</Link>
        ) : (
          "—"
        ),
    },
    { header: "Sent", hideBelow: "sm", cell: (f) => formatRelative(f.created_at) },
    {
      header: "",
      className: "text-right",
      cell: (f) =>
        f.status === "new" ? (
          <Button size="sm" variant="outline" onClick={() => mark(f, "read")}>Mark read</Button>
        ) : (
          <Button size="sm" variant="ghost" onClick={() => mark(f, "new")}>Mark new</Button>
        ),
    },
  ]
}

/** What users sent from the app's feedback button, newest first, with the
 * page and Lace they were on. */
export function FeedbackPage() {
  const search = useSearchState()
  const q = search.get("q")
  const status = search.get("status")
  const { data, error, loading, reload } = useApi(`feedback:${search.key}`, () =>
    adminApi.feedback({ page: search.page, q, status: (status || undefined) as FeedbackStatus | undefined }),
  )
  const mark = (row: FeedbackRow, next: FeedbackStatus) => {
    adminApi.setFeedbackStatus(row.id, next).then(reload, (err: unknown) =>
      toast.error(err instanceof Error ? err.message : "Couldn't update it"))
  }
  return (
    <PageShell
      title="Feedback"
      actions={
        <>
          <Input
            className="w-full sm:w-72"
            placeholder="Search feedback or email"
            defaultValue={q}
            onKeyDown={(e) => e.key === "Enter" && search.set("q", e.currentTarget.value.trim())}
          />
          <FilterSelect label="Statuses" value={status} options={FEEDBACK_STATUSES} onChange={(v) => search.set("status", v)} />
        </>
      }
    >
      <PagedTable
        columns={columns(mark)}
        data={data}
        loading={loading}
        error={error}
        empty={q || status ? "No feedback matches these filters" : "No feedback yet"}
        rowKey={(row) => row.id}
        onPage={(p) => search.set("page", p)}
        onRetry={reload}
      />
    </PageShell>
  )
}
