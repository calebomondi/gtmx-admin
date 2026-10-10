import type { Column } from "@/components/paged-table"
import { StatusBadge } from "@/components/status-badge"
import type { RunRow } from "@/lib/api/admin"
import { formatDateTime, formatDuration, formatUsd } from "@/lib/format"

export const RUN_COLUMNS: Column<RunRow>[] = [
  { header: "Kind", cell: (r) => r.kind.replaceAll("_", " ") },
  { header: "Status", cell: (r) => <StatusBadge status={r.status} /> },
  { header: "User", cell: (r) => r.user_email ?? <span className="font-mono text-xs">{r.user_id.slice(0, 8)}</span> },
  { header: "Workspace", cell: (r) => r.workspace_name ?? "—" },
  { header: "Started", cell: (r) => formatDateTime(r.created_at) },
  { header: "Duration", cell: (r) => formatDuration(r.duration_s), className: "text-right" },
  { header: "Cost", cell: (r) => formatUsd(r.cost_usd), className: "text-right tabular-nums" },
]
