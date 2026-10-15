import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@workspace/ui/components/table"

import type { KindMetrics } from "@/lib/api/admin"
import { formatDuration } from "@/lib/format"

export function RunsByKind({ rows }: { rows: KindMetrics[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Runs by kind</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Kind</TableHead>
              <TableHead className="text-right">Runs</TableHead>
              <TableHead className="text-right">Failed</TableHead>
              <TableHead className="text-right">Avg duration</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground">No runs in this window</TableCell>
              </TableRow>
            )}
            {rows.map((r) => (
              <TableRow key={r.kind}>
                <TableCell>{r.kind.replaceAll("_", " ")}</TableCell>
                <TableCell className="text-right tabular-nums">{r.runs}</TableCell>
                <TableCell className="text-right tabular-nums">{r.failed}</TableCell>
                <TableCell className="text-right">{formatDuration(r.avg_duration_s)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
