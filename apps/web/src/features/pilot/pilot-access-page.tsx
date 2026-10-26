import { toast } from "sonner"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"

import { ConfirmDialog } from "@/components/confirm-dialog"
import { PageShell } from "@/components/page-shell"
import { PagedTable, type Column } from "@/components/paged-table"
import { adminApi, type PilotAccessRow } from "@/lib/api/admin"
import { formatRelative } from "@/lib/format"
import { useApi } from "@/lib/use-api"
import { useSearchState } from "@/lib/use-search-state"
import { AddEmails } from "./add-emails"

function columns(onRemoved: () => void): Column<PilotAccessRow>[] {
  return [
    {
      header: "Email",
      cell: (r) => (
        <span className="flex items-center gap-2">
          {r.email}
          {r.signed_up ? <Badge>signed up</Badge> : <Badge variant="secondary">not yet</Badge>}
        </span>
      ),
    },
    { header: "From", hideBelow: "sm", cell: (r) => (r.source === "waitlist" ? "Waitlist" : "Added by hand") },
    { header: "Let in by", hideBelow: "md", cell: (r) => r.granted_by_email ?? "—" },
    { header: "When", hideBelow: "sm", cell: (r) => formatRelative(r.created_at) },
    {
      header: "",
      className: "text-right",
      cell: (r) => (
        <ConfirmDialog
          trigger={<Button size="sm" variant="ghost">Remove</Button>}
          title={`Take ${r.email} out of the pilot?`}
          description="They can't use Thalace until you let them in again, unless they're on a Lace (invited or a member), which keeps them in."
          confirmLabel="Remove"
          destructive
          onConfirm={() => adminApi.removePilotAccess(r.id).then(() => {
            toast.success(`${r.email} removed`)
            onRemoved()
          })}
        />
      ),
    },
  ]
}

/** Who may use the app while the pilot is closed, and letting more in. */
export function PilotAccessPage() {
  const search = useSearchState()
  const q = search.get("q")
  const status = useApi("pilot-status", () => adminApi.pilotStatus())
  const { data, error, loading, reload } = useApi(`pilot-access:${search.key}`, () =>
    adminApi.pilotAccess({ page: search.page, q }),
  )
  return (
    <PageShell
      title="Pilot access"
      actions={
        <Input
          className="w-full sm:w-72"
          placeholder="Search emails"
          defaultValue={q}
          onKeyDown={(e) => e.key === "Enter" && search.set("q", e.currentTarget.value.trim())}
        />
      }
    >
      {status.data && (
        <p className="text-sm text-muted-foreground">
          {status.data.invite_only
            ? "The pilot is closed: only admins, the people below, people invited onto a Lace and accounts made before it closed can use Thalace."
            : "The pilot is open here (PILOT_INVITE_ONLY_SINCE is unset): anyone who signs up can use Thalace. This list applies once it's set."}
        </p>
      )}
      <AddEmails onAdded={reload} />
      <PagedTable
        columns={columns(reload)}
        data={data}
        loading={loading}
        error={error}
        empty={q ? "No email matches that search" : "Nobody let in yet"}
        rowKey={(r) => r.id}
        onPage={(p) => search.set("page", p)}
        onRetry={reload}
      />
    </PageShell>
  )
}
