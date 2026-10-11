import { Link } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@workspace/ui/components/table"

import type { Metrics } from "@/lib/api/admin"
import { formatDuration, formatUsd } from "@/lib/format"

/** Speed and unit cost of the core flow, and who spends the most. */
export function EconomicsCard({ metrics: m }: { metrics: Metrics }) {
  const facts = [
    ["Discovery time (median)", formatDuration(m.discovery_p50_s)],
    ["Discovery time (slowest 10%)", formatDuration(m.discovery_p90_s)],
    ["Cost per finished discovery", m.cost_per_completed_discovery_usd === null ? "—" : formatUsd(m.cost_per_completed_discovery_usd)],
    ["Spend per active user", m.spend_per_active_user_usd === null ? "—" : formatUsd(m.spend_per_active_user_usd)],
  ]
  return (
    <Card>
      <CardHeader>
        <CardTitle>Speed and unit cost</CardTitle>
        <CardDescription>Priced usage only; see the unpriced warning above for anything left out</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <dl className="grid grid-cols-2 gap-3 text-sm">
          {facts.map(([label, value]) => (
            <div key={label}>
              <dt className="text-muted-foreground">{label}</dt>
              <dd className="text-lg font-semibold tabular-nums">{value}</dd>
            </div>
          ))}
        </dl>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Top spenders</TableHead>
              <TableHead className="text-right">Runs</TableHead>
              <TableHead className="text-right">Spend</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {m.top_spenders.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-muted-foreground">No priced usage</TableCell>
              </TableRow>
            )}
            {m.top_spenders.map((s) => (
              <TableRow key={s.user_id}>
                <TableCell>
                  <Link to={`/users/${s.user_id}`} className="underline-offset-4 hover:underline">
                    {s.email ?? "Deleted user"}
                  </Link>
                </TableCell>
                <TableCell className="text-right tabular-nums">{s.runs}</TableCell>
                <TableCell className="text-right tabular-nums">{formatUsd(s.cost_usd)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
