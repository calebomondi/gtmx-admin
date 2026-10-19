import { Link } from "react-router-dom"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@workspace/ui/components/table"

import type { TopLace } from "@/lib/api/admin"

/** Laces ranked by runs, then Feed items; `showOwner` for cross-user lists. */
export function TopLacesTable({ rows, showOwner }: { rows: TopLace[]; showOwner?: boolean }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Lace</TableHead>
          {showOwner && <TableHead>Owner</TableHead>}
          <TableHead className="text-right">Runs</TableHead>
          <TableHead className="text-right">Feed items</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.length === 0 && (
          <TableRow>
            <TableCell colSpan={showOwner ? 4 : 3} className="text-center text-muted-foreground">
              No Lace activity yet
            </TableCell>
          </TableRow>
        )}
        {rows.map((l) => (
          <TableRow key={l.id}>
            <TableCell>
              <Link to={`/laces/${l.id}`} className="underline-offset-4 hover:underline">{l.name}</Link>
            </TableCell>
            {showOwner && <TableCell className="text-muted-foreground">{l.user_email ?? "Deleted user"}</TableCell>}
            <TableCell className="text-right tabular-nums">{l.runs}</TableCell>
            <TableCell className="text-right tabular-nums">{l.activity}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
