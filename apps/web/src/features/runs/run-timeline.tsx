import type { RunEvent } from "@/lib/api/admin"

function summary(event: RunEvent): string {
  const p = event.payload
  for (const key of ["message", "phase", "error", "question", "status"]) {
    if (typeof p[key] === "string") return p[key] as string
  }
  const text = JSON.stringify(p)
  return text.length > 160 ? `${text.slice(0, 160)}…` : text
}

export function RunTimeline({ events, truncated }: { events: RunEvent[]; truncated: boolean }) {
  if (events.length === 0) return <p className="text-sm text-muted-foreground">No events recorded.</p>
  const start = Date.parse(events[0].created_at)
  return (
    <ol className="flex flex-col">
      {events.map((e) => (
        <li key={e.id} className="grid grid-cols-[4.5rem_9rem_1fr] gap-3 border-b py-1.5 text-sm last:border-0">
          <span className="text-right font-mono text-xs text-muted-foreground tabular-nums">
            +{((Date.parse(e.created_at) - start) / 1000).toFixed(1)}s
          </span>
          <span className="font-mono text-xs">{e.type}</span>
          <details className="min-w-0">
            <summary className="cursor-pointer truncate">{summary(e)}</summary>
            <pre className="mt-1 overflow-x-auto bg-muted p-2 text-xs">{JSON.stringify(e.payload, null, 2)}</pre>
          </details>
        </li>
      ))}
      {truncated && <li className="py-2 text-xs text-muted-foreground">Showing the first {events.length} events.</li>}
    </ol>
  )
}
