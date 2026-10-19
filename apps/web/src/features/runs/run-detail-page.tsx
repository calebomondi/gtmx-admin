import { useEffect } from "react"
import { Link, useParams } from "react-router-dom"
import { toast } from "sonner"
import { Button } from "@workspace/ui/components/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card"

import { BackLink } from "@/components/back-link"
import { ConfirmDialog } from "@/components/confirm-dialog"
import { LoadState } from "@/components/load-state"
import { PageShell } from "@/components/page-shell"
import { StatusBadge } from "@/components/status-badge"
import { CostBreakdown } from "@/components/cost-breakdown"
import { adminApi, TERMINAL_STATUSES } from "@/lib/api/admin"
import { formatDateTime, formatDuration, formatUsd } from "@/lib/format"
import { useApi } from "@/lib/use-api"
import { RunTimeline } from "./run-timeline"

const LIVE_POLL_MS = 3000

export function RunDetailPage() {
  const { runId = "" } = useParams()
  const { data: run, error, reload } = useApi(`run:${runId}`, () => adminApi.run(runId))
  const live = !!run && !TERMINAL_STATUSES.includes(run.status)

  useEffect(() => {
    if (!live) return
    const timer = window.setInterval(reload, LIVE_POLL_MS)
    return () => window.clearInterval(timer)
  }, [live, reload])

  return (
    <PageShell title={run ? `${run.kind.replaceAll("_", " ")} run` : "Run"}>
      <BackLink to="/runs" label="All runs" />
      {!run ? (
        <LoadState error={error} onRetry={reload} />
      ) : (
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-col gap-1 text-sm">
              <div className="flex items-center gap-3">
                <StatusBadge status={run.status} />
                {live && <span className="text-xs text-muted-foreground">live · refreshing every 3s</span>}
              </div>
              <p className="text-muted-foreground">
                <Link className="underline-offset-4 hover:underline" to={`/users/${run.user_id}`}>
                  {run.user_email ?? run.user_id}
                </Link>
                {run.lace_id && (
                  <> · <Link className="underline-offset-4 hover:underline" to={`/laces/${run.lace_id}`}>{run.lace_name}</Link></>
                )}{" "}· started {formatDateTime(run.created_at)} · took{" "}
                {formatDuration(run.duration_s)} · {formatUsd(run.cost_usd)}
              </p>
              {run.error && <p className="text-destructive">{run.error}</p>}
            </div>
            {live && (
              <ConfirmDialog
                trigger={<Button variant="destructive">Cancel run</Button>}
                title="Cancel this run?"
                description="The agent stops now and the user sees the run as cancelled by an administrator."
                confirmLabel="Cancel run"
                destructive
                onConfirm={() =>
                  adminApi.cancelRun(run.id).then(() => {
                    toast.success("Run cancelled")
                    reload()
                  })
                }
              />
            )}
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Timeline</CardTitle>
              <CardDescription>{run.events.length} events</CardDescription>
            </CardHeader>
            <CardContent>
              <RunTimeline events={run.events} truncated={run.events_truncated} />
            </CardContent>
          </Card>
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            <CostBreakdown title="LLM calls" lines={run.llm_costs} tokens />
            <CostBreakdown title="Search & scraping calls" lines={run.api_costs} />
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Input and progress</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              <pre className="overflow-x-auto bg-muted p-3 text-xs">{JSON.stringify(run.input, null, 2)}</pre>
              <pre className="overflow-x-auto bg-muted p-3 text-xs">{JSON.stringify(run.progress, null, 2)}</pre>
            </CardContent>
          </Card>
        </div>
      )}
    </PageShell>
  )
}
