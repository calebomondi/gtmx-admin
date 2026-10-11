import { useNavigate, useParams } from "react-router-dom"
import { Badge } from "@workspace/ui/components/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@workspace/ui/components/table"

import { BackLink } from "@/components/back-link"
import { LoadState } from "@/components/load-state"
import { PageShell } from "@/components/page-shell"
import { RUN_COLUMNS } from "@/components/run-columns"
import { adminApi } from "@/lib/api/admin"
import { formatDuration, formatRelative, formatUsd } from "@/lib/format"
import { useApi } from "@/lib/use-api"
import { QuotaEditor } from "./quota-editor"
import { UserActions } from "./user-actions"
import { UserActivityCard, UserConnectionsCard } from "./user-engagement"

export function UserDetailPage() {
  const { userId = "" } = useParams()
  const navigate = useNavigate()
  const { data: user, error, reload } = useApi(`user:${userId}`, () => adminApi.user(userId))

  return (
    <PageShell title={user?.email ?? "User"}>
      <BackLink to="/users" label="All users" />
      {!user ? (
        <LoadState error={error} onRetry={reload} />
      ) : (
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-semibold">{user.name ?? user.email}</h2>
                {user.is_admin && <Badge>admin</Badge>}
                {user.suspended && <Badge variant="destructive">suspended</Badge>}
              </div>
              <p className="text-sm text-muted-foreground">
                {user.email} · joined {formatRelative(user.created_at)} · last sign-in {formatRelative(user.last_sign_in_at)}
              </p>
            </div>
            <UserActions user={user} onChanged={reload} />
          </div>

          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {[
              ["Workspaces", user.workspaces],
              ["Projects", user.projects],
              ["Runs", user.runs],
              ["Estimated spend", formatUsd(user.spend_usd)],
              ["Time in app (30d)", formatDuration(user.active_seconds_30d)],
              ["Last seen", formatRelative(user.last_seen_at)],
              ["Last run", formatRelative(user.last_run_at)],
              ["Connected accounts", user.connections ?? "—"],
            ].map(([label, value]) => (
              <Card key={String(label)}>
                <CardHeader>
                  <CardDescription>{label}</CardDescription>
                  <CardTitle className="text-xl tabular-nums">{value}</CardTitle>
                </CardHeader>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            <UserActivityCard user={user} />
            <UserConnectionsCard user={user} />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent runs</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    {RUN_COLUMNS.map((c) => (
                      <TableHead key={c.header} className={c.className}>{c.header}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {user.recent_runs.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={RUN_COLUMNS.length} className="text-center text-muted-foreground">
                        No runs yet
                      </TableCell>
                    </TableRow>
                  )}
                  {user.recent_runs.map((r) => (
                    <TableRow key={r.id} className="cursor-pointer" onClick={() => navigate(`/runs/${r.id}`)}>
                      {RUN_COLUMNS.map((c) => (
                        <TableCell key={c.header} className={c.className}>{c.cell(r)}</TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Workspaces</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-2 text-sm">
                {user.workspace_list.length === 0 && <p className="text-muted-foreground">No workspaces</p>}
                {user.workspace_list.map((w) => (
                  <div key={w.id} className="flex justify-between border-b pb-2 last:border-0">
                    <span className="flex items-center gap-2">
                      {w.name ?? "Untitled"}
                      {w.offer_type && <Badge variant="outline" className="capitalize">{w.offer_type}</Badge>}
                      {w.archived && <span className="text-muted-foreground">(archived)</span>}
                    </span>
                    <span className="text-muted-foreground">
                      {w.competitors} competitors · {w.accounts} accounts · {w.runs} runs
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Daily run limits</CardTitle>
                <CardDescription>Overrides apply to this user only; leave empty for the default.</CardDescription>
              </CardHeader>
              <CardContent>
                <QuotaEditor userId={user.id} />
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </PageShell>
  )
}
