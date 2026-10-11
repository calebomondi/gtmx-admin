import { Badge } from "@workspace/ui/components/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@workspace/ui/components/table"

import type { TopWorkspace } from "@/lib/api/admin"
import { formatDuration } from "@/lib/format"

/** Workspaces ranked by active time, with visits; `showOwner` for cross-user lists. */
export function TopWorkspacesTable({ rows, showOwner }: { rows: TopWorkspace[]; showOwner?: boolean }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Workspace</TableHead>
          {showOwner && <TableHead>Owner</TableHead>}
          <TableHead className="text-right">Active time</TableHead>
          <TableHead className="text-right">Visits</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.length === 0 && (
          <TableRow>
            <TableCell colSpan={showOwner ? 4 : 3} className="text-center text-muted-foreground">
              No tracked time yet
            </TableCell>
          </TableRow>
        )}
        {rows.map((w) => (
          <TableRow key={w.id}>
            <TableCell>
              <span className="flex items-center gap-2">
                {w.name ?? "Untitled"}
                {w.offer_type && <Badge variant="outline" className="capitalize">{w.offer_type}</Badge>}
              </span>
            </TableCell>
            {showOwner && <TableCell className="text-muted-foreground">{w.user_email ?? "Deleted user"}</TableCell>}
            <TableCell className="text-right tabular-nums">{formatDuration(w.active_seconds)}</TableCell>
            <TableCell className="text-right tabular-nums">{w.visits}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
