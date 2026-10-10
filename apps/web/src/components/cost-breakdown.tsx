import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@workspace/ui/components/table"

import type { CostLine } from "@/lib/api/admin"
import { formatCount, formatUsd } from "@/lib/format"

export function CostBreakdown({ title, lines, tokens }: { title: string; lines: CostLine[]; tokens?: boolean }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="text-right">Calls</TableHead>
              {tokens && <TableHead className="text-right">Tokens in / out</TableHead>}
              <TableHead className="text-right">Cost</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {lines.length === 0 && (
              <TableRow>
                <TableCell colSpan={tokens ? 4 : 3} className="text-center text-muted-foreground">No usage recorded</TableCell>
              </TableRow>
            )}
            {lines.map((l) => (
              <TableRow key={l.name}>
                <TableCell className="font-mono text-xs">{l.name}</TableCell>
                <TableCell className="text-right tabular-nums">
                  {l.calls}
                  {l.failed_calls > 0 && <span className="text-destructive"> ({l.failed_calls} failed)</span>}
                </TableCell>
                {tokens && (
                  <TableCell className="text-right tabular-nums">
                    {formatCount(l.input_tokens)} / {formatCount(l.output_tokens)}
                  </TableCell>
                )}
                <TableCell className="text-right tabular-nums">{formatUsd(l.cost_usd)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
