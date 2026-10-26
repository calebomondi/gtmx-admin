import { Link } from "react-router-dom"
import { buttonVariants } from "@workspace/ui/components/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@workspace/ui/components/table"
import { ToggleGroup, ToggleGroupItem } from "@workspace/ui/components/toggle-group"

import { LoadState } from "@/components/load-state"
import { PageShell } from "@/components/page-shell"
import { PagedTable, type Column } from "@/components/paged-table"
import { StatCards } from "@/components/stat-cards"
import { adminApi, type EventRow, type EventSummary } from "@/lib/api/admin"
import { formatCount, formatDateTime } from "@/lib/format"
import { useApi } from "@/lib/use-api"
import { useSearchState } from "@/lib/use-search-state"
import { eventLabel } from "./event-labels"

const WINDOWS = ["7", "30", "90"]

const RECENT: Column<EventRow>[] = [
  { header: "When", cell: (e) => formatDateTime(e.created_at) },
  { header: "Event", cell: (e) => eventLabel(e.name) },
  { header: "Detail", hideBelow: "sm", cell: (e) => <span className="font-mono text-xs">{e.detail ?? "—"}</span> },
  {
    header: "Who",
    hideBelow: "md",
    cell: (e) => <Link to={`/events?user_id=${e.user_id}`} className="underline-offset-4 hover:underline">{e.user_email ?? e.user_id.slice(0, 8)}</Link>,
  },
  {
    header: "Lace",
    hideBelow: "lg",
    cell: (e) => (e.lace_id ? <Link to={`/laces/${e.lace_id}`} className="underline-offset-4 hover:underline">{e.lace_name ?? "Deleted Lace"}</Link> : "—"),
  },
]

function MostUsed({ summary }: { summary: EventSummary }) {
  if (summary.totals.length === 0) return <p className="text-sm text-muted-foreground">Nothing recorded in this window.</p>
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Event</TableHead>
          <TableHead>Detail</TableHead>
          <TableHead className="text-right">Times</TableHead>
          <TableHead className="text-right">People</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {summary.totals.map((t) => (
          <TableRow key={`${t.name}:${t.detail ?? ""}`}>
            <TableCell>{eventLabel(t.name)}</TableCell>
            <TableCell className="font-mono text-xs">{t.detail ?? "—"}</TableCell>
            <TableCell className="text-right tabular-nums">{formatCount(t.count)}</TableCell>
            <TableCell className="text-right tabular-nums">{formatCount(t.users)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

/** What people do in the app: the most used pages and actions over a window
 * (all users, one user or one Lace), and the latest events in order. */
export function EventsPage() {
  const search = useSearchState()
  const days = WINDOWS.includes(search.get("days")) ? Number(search.get("days")) : 30
  const userId = search.get("user_id") || undefined
  const laceId = search.get("lace_id") || undefined
  const summary = useApi(`events-summary:${days}:${userId}:${laceId}`, () => adminApi.eventSummary({ days, user_id: userId, lace_id: laceId }))
  const recent = useApi(`events:${search.key}`, () => adminApi.events({ page: search.page, user_id: userId, lace_id: laceId }))
  const filtered = Boolean(userId || laceId)

  return (
    <PageShell
      title="Events"
      actions={
        <>
          <ToggleGroup type="single" variant="outline" value={String(days)} onValueChange={(v) => v && search.set("days", v)}>
            {WINDOWS.map((w) => <ToggleGroupItem key={w} value={w}>{w} days</ToggleGroupItem>)}
          </ToggleGroup>
          {filtered && (
            <Link to={`/events?days=${days}`} className={buttonVariants({ variant: "ghost" })}>
              {userId ? "One person" : "One Lace"} · Show everyone
            </Link>
          )}
        </>
      }
    >
      {summary.data ? (
        <StatCards
          stats={[
            { label: "Events", value: formatCount(summary.data.totals.reduce((n, t) => n + t.count, 0)), note: `last ${days} days` },
            { label: "People", value: formatCount(summary.data.people), note: "did anything in the app" },
            { label: "Busiest day", value: formatCount(Math.max(0, ...summary.data.per_day.map((d) => d.count))), note: "events" },
            { label: "Most people in a day", value: formatCount(Math.max(0, ...summary.data.per_day.map((d) => d.users))) },
          ]}
        />
      ) : (
        <LoadState error={summary.error} onRetry={summary.reload} />
      )}
      <Card>
        <CardHeader>
          <CardTitle>Most used</CardTitle>
          <CardDescription>Pages and actions, most frequent first. A Lace page reads lace_tab#section.</CardDescription>
        </CardHeader>
        <CardContent>{summary.data && <MostUsed summary={summary.data} />}</CardContent>
      </Card>
      <PagedTable
        columns={RECENT}
        data={recent.data}
        loading={recent.loading}
        error={recent.error}
        empty="No events yet"
        rowKey={(e) => String(e.id)}
        onPage={(p) => search.set("page", p)}
        onRetry={recent.reload}
      />
    </PageShell>
  )
}
