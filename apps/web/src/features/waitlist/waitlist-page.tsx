import { useState } from "react"
import { DownloadSimpleIcon } from "@phosphor-icons/react"
import { toast } from "sonner"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"

import { FilterSelect } from "@/components/filter-select"
import { PageShell } from "@/components/page-shell"
import { PagedTable, type Column } from "@/components/paged-table"
import { StatCards } from "@/components/stat-cards"
import { adminApi, WAITLIST_STATUSES, type WaitlistRow, type WaitlistStats } from "@/lib/api/admin"
import { formatRelative } from "@/lib/format"
import { useApi } from "@/lib/use-api"
import { useSearchState } from "@/lib/use-search-state"
import { SignupDialog } from "./signup-dialog"
import { StatusSelect } from "./status-select"
import { SELLS_TO_LABEL, STAGE_LABEL, sourceLine } from "./waitlist-labels"

const PILOT_FILTER = ["pilot only", "waitlist only"] as const

function statsCards(stats: WaitlistStats) {
  return [
    { label: "Signups", value: String(stats.total), note: `${stats.last_7_days} in the last 7 days` },
    { label: "Pilot opt-ins", value: `${stats.pilot.taken} / ${stats.pilot.total}`, note: `${stats.pilot.left} spots left` },
    { label: "Earning revenue or scaling", value: String((stats.by_stage.revenue ?? 0) + (stats.by_stage.scaling ?? 0)) },
    { label: "Sell to businesses", value: String((stats.by_sells_to.b2b ?? 0) + (stats.by_sells_to.both ?? 0)) },
  ]
}

export function WaitlistPage() {
  const search = useSearchState()
  const q = search.get("q")
  const status = search.get("status")
  const pilotFilter = search.get("pilot")
  const pilot = pilotFilter === "pilot only" ? true : pilotFilter === "waitlist only" ? false : undefined
  const [open, setOpen] = useState<WaitlistRow | null>(null)
  const [exporting, setExporting] = useState(false)
  const { data, error, loading, reload } = useApi(`waitlist:${search.key}`, () =>
    adminApi.waitlist({ page: search.page, q, status, pilot }),
  )
  const stats = useApi("waitlist-stats", () => adminApi.waitlistStats())

  const exportCsv = async () => {
    setExporting(true)
    try {
      await adminApi.exportWaitlist(`thalace-waitlist-${new Date().toISOString().slice(0, 10)}.csv`, { pilot, status })
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Export failed")
    } finally {
      setExporting(false)
    }
  }

  const columns: Column<WaitlistRow>[] = [
    {
      header: "Signup",
      cell: (r) => (
        <div className="flex flex-col">
          <span className="font-medium">{r.email}</span>
          {(r.name || r.company) && (
            <span className="text-xs text-muted-foreground">{[r.name, r.company].filter(Boolean).join(" · ")}</span>
          )}
        </div>
      ),
    },
    { header: "Pilot", hideBelow: "sm", cell: (r) => (r.wants_pilot ? <Badge>pilot</Badge> : <span className="text-muted-foreground">—</span>) },
    { header: "Stage", hideBelow: "md", cell: (r) => (r.stage ? STAGE_LABEL[r.stage] : "—") },
    { header: "Sells to", hideBelow: "lg", cell: (r) => (r.sells_to ? SELLS_TO_LABEL[r.sells_to] : "—") },
    { header: "Countries", hideBelow: "md", cell: (r) => r.countries.join(", ") || "—" },
    {
      header: "Wants Thalace to", hideBelow: "lg",
      className: "min-w-48 whitespace-normal",
      cell: (r) => <span className="line-clamp-2 max-w-72 text-sm">{r.expectations || "—"}</span>,
    },
    { header: "From", hideBelow: "lg", cell: (r) => sourceLine(r.source) },
    { header: "Joined", hideBelow: "sm", cell: (r) => formatRelative(r.created_at) },
    {
      header: "Status",
      cell: (r) => (
        <StatusSelect
          row={r}
          onChanged={() => {
            reload()
            stats.reload()
          }}
        />
      ),
    },
  ]

  return (
    <PageShell
      title="Waitlist"
      actions={
        <>
          <Input
            className="w-full sm:w-72"
            placeholder="Search email, name or company"
            defaultValue={q}
            onKeyDown={(e) => e.key === "Enter" && search.set("q", e.currentTarget.value.trim())}
          />
          <FilterSelect label="Signups" value={pilotFilter} options={PILOT_FILTER} onChange={(v) => search.set("pilot", v)} />
          <FilterSelect label="Statuses" value={status} options={WAITLIST_STATUSES} onChange={(v) => search.set("status", v)} />
          <Button variant="outline" onClick={() => void exportCsv()} disabled={exporting} className="ml-auto">
            <DownloadSimpleIcon />
            {exporting ? "Exporting…" : "Export CSV"}
          </Button>
        </>
      }
    >
      {stats.data && <StatCards stats={statsCards(stats.data)} />}
      <PagedTable
        columns={columns}
        data={data}
        loading={loading}
        error={error}
        empty={q || status || pilotFilter ? "No signups match these filters" : "No signups yet"}
        rowKey={(r) => r.id}
        onRowClick={setOpen}
        onPage={(p) => search.set("page", p)}
        onRetry={reload}
      />
      <SignupDialog row={open} onClose={() => setOpen(null)} />
    </PageShell>
  )
}
