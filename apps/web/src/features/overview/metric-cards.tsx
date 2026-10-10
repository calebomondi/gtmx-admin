import { Card, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card"

import type { Metrics } from "@/lib/api/admin"
import { formatDuration, formatUsd } from "@/lib/format"

export function MetricCards({ metrics }: { metrics: Metrics }) {
  const finished = (metrics.runs_by_status.completed ?? 0) + (metrics.runs_by_status.failed ?? 0)
  const cards = [
    { label: "Users", value: String(metrics.total_users), note: `${metrics.active_users} ran something` },
    {
      label: "Success rate",
      value: metrics.success_rate === null ? "—" : `${Math.round(metrics.success_rate * 100)}%`,
      note: `${finished} finished runs`,
    },
    { label: "Avg run duration", value: formatDuration(metrics.avg_duration_s), note: "completed runs" },
    {
      label: "Estimated spend",
      value: formatUsd(metrics.llm_cost_usd + metrics.api_cost_usd),
      note: `LLM ${formatUsd(metrics.llm_cost_usd)} · search ${formatUsd(metrics.api_cost_usd)}`,
    },
  ]
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((c) => (
        <Card key={c.label}>
          <CardHeader>
            <CardDescription>{c.label}</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums">{c.value}</CardTitle>
            <p className="text-xs text-muted-foreground">{c.note}</p>
          </CardHeader>
        </Card>
      ))}
    </div>
  )
}
