import type { Engagement, Metrics } from "@/lib/api/admin"
import { formatDuration, formatPercent, formatUsd } from "@/lib/format"
import { StatCards } from "@/components/stat-cards"

export function MetricCards({ metrics }: { metrics: Metrics }) {
  const finished = (metrics.runs_by_status.completed ?? 0) + (metrics.runs_by_status.failed ?? 0)
  return (
    <StatCards
      stats={[
        { label: "Users", value: String(metrics.total_users), note: `${metrics.active_users} ran something` },
        { label: "Success rate", value: formatPercent(metrics.success_rate), note: `${finished} finished runs` },
        { label: "Avg run duration", value: formatDuration(metrics.avg_duration_s), note: "completed runs" },
        {
          label: "Estimated spend",
          value: formatUsd(metrics.llm_cost_usd + metrics.api_cost_usd),
          note: `LLM ${formatUsd(metrics.llm_cost_usd)} · search ${formatUsd(metrics.api_cost_usd)}`,
        },
      ]}
    />
  )
}

const perUser = (value: number | null) => (value === null ? "—" : value.toFixed(1))

export function EngagementCards({ engagement: e }: { engagement: Engagement }) {
  return (
    <StatCards
      stats={[
        {
          label: "Weekly active users",
          value: String(e.weekly_active_users),
          note: `${e.monthly_active_users} this month · ${e.returning_users} returning · stickiness ${formatPercent(e.stickiness)}`,
        },
        {
          label: "Time in app",
          value: formatDuration(e.total_active_seconds),
          note: `${formatDuration(e.avg_active_seconds_per_user)} per user · ${formatDuration(e.avg_session_seconds)} per session`,
        },
        {
          label: "Workspaces",
          value: String(e.workspaces_total),
          note: `${e.workspaces_created} new · ${perUser(e.avg_workspaces_per_user)} per user`,
        },
        {
          label: "Projects",
          value: String(e.projects_total),
          note: `${e.projects_created} new · ${perUser(e.avg_projects_per_user)} per user`,
        },
      ]}
    />
  )
}
