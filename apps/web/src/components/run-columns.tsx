import type { Column } from "@/components/paged-table"
import { StatusBadge } from "@/components/status-badge"
import type { RunRow } from "@/lib/api/admin"
import { formatDateTime, formatDuration, formatUsd } from "@/lib/format"

export const RUN_COLUMNS: Column<RunRow>[] = [
  { header: "Kind", cell: (r) => r.kind.replaceAll("_", " ") },
  { header: "Status", cell: (r) => <StatusBadge status={r.status} /> },
  { header: "User", hideBelow: "md", cell: (r) => r.user_email ?? <span className="font-mono text-xs">{r.user_id.slice(0, 8)}</span> },
  { header: "Lace", hideBelow: "lg", cell: (r) => r.lace_name ?? "—" },
  { header: "Started", hideBelow: "sm", cell: (r) => formatDateTime(r.created_at) },
  { header: "Duration", hideBelow: "md", cell: (r) => formatDuration(r.duration_s), className: "text-right" },
  { header: "Cost", hideBelow: "sm", cell: (r) => formatUsd(r.cost_usd), className: "text-right tabular-nums" },
]
