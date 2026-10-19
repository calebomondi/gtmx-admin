import { Link, useNavigate, useParams } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@workspace/ui/components/table"

import { BackLink } from "@/components/back-link"
import { LoadState } from "@/components/load-state"
import { PageShell } from "@/components/page-shell"
import { RUN_COLUMNS } from "@/components/run-columns"
import { StatCards } from "@/components/stat-cards"
import { StatusBadge } from "@/components/status-badge"
import { adminApi } from "@/lib/api/admin"
import { formatCount, formatDateTime, formatRelative, formatUsd } from "@/lib/format"
import { useApi } from "@/lib/use-api"

/** One Lace: whose it is, how far it has got, what waits on its founder,
 * and its recent runs with their cost. */
export function LaceDetailPage() {
  const { laceId = "" } = useParams()
  const navigate = useNavigate()
  const { data: lace, error, reload } = useApi(`lace:${laceId}`, () => adminApi.lace(laceId))

  return (
    <PageShell title={lace?.name ?? "Lace"}>
      <BackLink to="/laces" label="All Laces" />
      {!lace ? (
        <LoadState error={error} onRetry={reload} />
      ) : (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1 text-sm">
            <div className="flex items-center gap-3">
              <StatusBadge status={lace.status} />
              <a className="text-muted-foreground underline-offset-4 hover:underline" href={lace.website} target="_blank" rel="noreferrer">
                {lace.startup_name ?? lace.website}
              </a>
            </div>
            <p className="text-muted-foreground">
              <Link className="underline-offset-4 hover:underline" to={`/users/${lace.user_id}`}>
                {lace.user_email ?? lace.user_id}
              </Link>
              {" "}· created {formatDateTime(lace.created_at)} · last active {formatRelative(lace.last_active_at)} · brief{" "}
              {lace.brief_frequency}{lace.brief_email && " by email"}
            </p>
          </div>
          <StatCards
            stats={[
              { label: "Cost", value: formatUsd(lace.cost_usd), note: `${formatCount(lace.runs)} runs` },
              { label: "Saved accounts", value: formatCount(lace.accounts), note: `${formatCount(lace.contacts)} contacts` },
              { label: "Messages sent", value: formatCount(lace.sent), note: `${formatCount(lace.replies)} replies in` },
              { label: "Waiting on the founder", value: formatCount(lace.suggestions + lace.drafts_waiting),
                note: `${formatCount(lace.suggestions)} suggestions · ${formatCount(lace.drafts_waiting)} drafts` },
            ]}
          />
          <p className="text-xs text-muted-foreground">
            {formatCount(lace.facts)} facts · {formatCount(lace.competitors)} competitors tracked ·{" "}
            {formatCount(lace.opportunities)} open opportunities saved
          </p>
          <Card>
            <CardHeader>
              <CardTitle>Recent runs</CardTitle>
            </CardHeader>
            <CardContent>
              {lace.recent_runs.length === 0 ? (
                <p className="text-sm text-muted-foreground">No runs yet.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>{RUN_COLUMNS.map((c) => <TableHead key={c.header} className={c.className}>{c.header}</TableHead>)}</TableRow>
                  </TableHeader>
                  <TableBody>
                    {lace.recent_runs.map((r) => (
                      <TableRow key={r.id} className="cursor-pointer" onClick={() => navigate(`/runs/${r.id}`)}>
                        {RUN_COLUMNS.map((c) => <TableCell key={c.header} className={c.className}>{c.cell(r)}</TableCell>)}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
              <div className="mt-3 flex gap-4 text-sm">
                <Link className="underline-offset-4 hover:underline" to={`/runs?lace_id=${lace.id}`}>
                  All its runs
                </Link>
                <Link className="underline-offset-4 hover:underline" to={`/questions?lace_id=${lace.id}`}>
                  What the founder asked it
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </PageShell>
  )
}
