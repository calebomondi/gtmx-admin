import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@workspace/ui/components/table"

import type { Connections } from "@/lib/api/admin"

const PLATFORM_LABELS: Record<string, string> = {
  gmail: "Gmail", linkedin: "LinkedIn", instagram: "Instagram", tiktok: "TikTok", x: "X",
}

/** Which channels users connect, and which they actually send through. */
export function ConnectionsCard({ connections: c }: { connections: Connections }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Connected accounts</CardTitle>
        <CardDescription>
          {c.users_with_connections} users connected something · {c.avg_connections_per_user ?? "—"} per user ·
          sends in this window
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {c.error && <p className="border border-amber-500/40 px-3 py-2 text-sm text-amber-700 dark:text-amber-400">{c.error}</p>}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Platform</TableHead>
              <TableHead className="text-right">Connected users</TableHead>
              <TableHead className="text-right">Messages sent</TableHead>
              <TableHead className="text-right">Senders</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {c.platforms.map((p) => (
              <TableRow key={p.platform}>
                <TableCell>{PLATFORM_LABELS[p.platform] ?? p.platform}</TableCell>
                <TableCell className="text-right tabular-nums">{c.error ? "—" : p.connected_users}</TableCell>
                <TableCell className="text-right tabular-nums">{p.sends}</TableCell>
                <TableCell className="text-right tabular-nums">{p.senders}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
