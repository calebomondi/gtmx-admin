import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@workspace/ui/components/table"

import type { Funnel } from "@/lib/api/admin"
import { formatPercent, formatRelative } from "@/lib/format"

/** How far users get, as a share of everyone who signed up. */
export function FunnelCard({ funnel }: { funnel: Funnel }) {
  const signedUp = funnel.steps[0]?.users ?? 0
  return (
    <Card>
      <CardHeader>
        <CardTitle>Activation funnel</CardTitle>
        <CardDescription>All time: users who reached each step, and the share kept from the step before</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {funnel.steps.map((step, i) => {
          const previous = i === 0 ? null : funnel.steps[i - 1].users
          return (
            <div key={step.key} className="flex flex-col gap-1">
              <div className="flex justify-between text-sm">
                <span>{step.label}</span>
                <span className="tabular-nums text-muted-foreground">
                  {step.users}
                  {previous !== null && ` · ${previous ? formatPercent(step.users / previous) : "—"} of previous`}
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-muted">
                <div
                  className="h-2 rounded-full bg-(--series-1)"
                  style={{ width: `${signedUp ? (step.users / signedUp) * 100 : 0}%` }}
                />
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}

/** How Lace onboardings end, and why runs fail. */
export function FailuresCard({ funnel }: { funnel: Funnel }) {
  const { onboardings_completed: completed, onboardings_failed: failed } = funnel
  const finished = completed + failed
  return (
    <Card>
      <CardHeader>
        <CardTitle>Failures</CardTitle>
        <CardDescription>
          {funnel.laces_created} Laces created in this window; {completed} of {finished} finished onboardings succeeded
          ({finished ? formatPercent(completed / finished) : "—"})
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Top failure reasons</TableHead>
              <TableHead className="text-right">Runs</TableHead>
              <TableHead className="text-right">Last</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {funnel.failure_reasons.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-muted-foreground">No failed runs</TableCell>
              </TableRow>
            )}
            {funnel.failure_reasons.map((f) => (
              <TableRow key={f.message}>
                <TableCell className="max-w-md text-xs whitespace-normal">{f.message}</TableCell>
                <TableCell className="text-right tabular-nums">{f.runs}</TableCell>
                <TableCell className="text-right text-muted-foreground">{formatRelative(f.last_at)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
