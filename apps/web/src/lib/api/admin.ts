// Typed client for /api/v1/admin/*. Shapes mirror backend/app/schemas/admin.py.
import { apiFetch } from "@/lib/api/http"

export type RunStatus = "pending" | "running" | "awaiting_input" | "completed" | "failed" | "cancelled"
export const RUN_STATUSES: RunStatus[] = ["pending", "running", "awaiting_input", "completed", "failed", "cancelled"]
export const TERMINAL_STATUSES: RunStatus[] = ["completed", "failed", "cancelled"]
export const RUN_KINDS = [
  "discovery", "competitors", "accounts", "competitor_research", "chat", "outreach_drafts", "monitor",
] as const
export type RunKind = (typeof RUN_KINDS)[number]

export interface Page<T> {
  items: T[]
  total: number
  page: number
  per_page: number
}

export interface Me {
  id: string
  name: string | null
  email: string | null
  avatar_url: string | null
}

export interface DayMetrics {
  day: string
  runs_started: number
  runs_failed: number
  active_users: number
  llm_cost_usd: number
  api_cost_usd: number
}

export interface CostLine {
  name: string
  calls: number
  failed_calls: number
  input_tokens: number
  output_tokens: number
  cost_usd: number | null
}

export interface KindMetrics {
  kind: string
  runs: number
  failed: number
  avg_duration_s: number | null
}

export interface Metrics {
  days: number
  total_users: number
  active_users: number
  runs_by_status: Record<string, number>
  runs_by_kind: KindMetrics[]
  success_rate: number | null
  avg_duration_s: number | null
  llm_cost_usd: number
  api_cost_usd: number
  llm_costs: CostLine[]
  api_costs: CostLine[]
  unpriced: string[]
  series: DayMetrics[]
}

export interface UserRow {
  id: string
  email: string | null
  name: string | null
  created_at: string | null
  last_sign_in_at: string | null
  is_admin: boolean
  suspended: boolean
  workspaces: number
  runs: number
  last_run_at: string | null
}

export interface WorkspaceRow {
  id: string
  name: string | null
  user_id: string
  user_email: string | null
  archived: boolean
  date_created: string
  last_activity: string
  competitors: number
  accounts: number
  runs: number
}

export interface RunRow {
  id: string
  kind: string
  status: RunStatus
  user_id: string
  user_email: string | null
  workspace_id: string | null
  workspace_name: string | null
  error: string | null
  created_at: string
  started_at: string | null
  finished_at: string | null
  duration_s: number | null
  cost_usd: number | null
}

export interface RunEvent {
  id: number
  type: string
  payload: Record<string, unknown>
  created_at: string
}

export interface RunDetail extends RunRow {
  input: Record<string, unknown> | null
  progress: Record<string, unknown> | null
  events: RunEvent[]
  events_truncated: boolean
  llm_costs: CostLine[]
  api_costs: CostLine[]
}

export interface UserDetail extends UserRow {
  spend_usd: number
  recent_runs: RunRow[]
  workspace_list: WorkspaceRow[]
}

export interface SignalRow {
  id: string
  workspace_id: string
  workspace_name: string | null
  run_id: string | null
  category: string
  title: string
  summary: string
  hot: boolean
  created_at: string
  user_id: string
  user_email: string | null
}

export interface QuotaRow {
  kind: string
  default_cap: number
  override: number | null
}

export interface AuditRow {
  id: string
  actor_id: string | null
  actor_email: string | null
  action: string
  target_type: string
  target_id: string | null
  before: Record<string, unknown> | null
  after: Record<string, unknown> | null
  created_at: string
}

export interface PageQuery {
  page: number
  per_page?: number
}

export const adminApi = {
  me: () => apiFetch<Me>("/me"),
  metrics: (days: number) => apiFetch<Metrics>("/metrics", { query: { days } }),

  users: (q: PageQuery & { q?: string }) => apiFetch<Page<UserRow>>("/users", { query: { ...q } }),
  user: (id: string) => apiFetch<UserDetail>(`/users/${id}`),
  grantAdmin: (id: string) => apiFetch<UserRow>(`/users/${id}/admin`, { method: "POST" }),
  revokeAdmin: (id: string) => apiFetch<UserRow>(`/users/${id}/admin`, { method: "DELETE" }),
  suspend: (id: string, reason: string) =>
    apiFetch<UserRow>(`/users/${id}/suspend`, { method: "POST", body: JSON.stringify({ reason }) }),
  reactivate: (id: string) => apiFetch<UserRow>(`/users/${id}/reactivate`, { method: "POST" }),
  quotas: (id: string) => apiFetch<QuotaRow[]>(`/users/${id}/quotas`),
  setQuota: (id: string, kind: string, daily_cap: number | null) =>
    apiFetch<QuotaRow[]>(`/users/${id}/quotas`, { method: "PUT", body: JSON.stringify({ kind, daily_cap }) }),

  workspaces: (q: PageQuery & { q?: string }) => apiFetch<Page<WorkspaceRow>>("/workspaces", { query: { ...q } }),

  runs: (q: PageQuery & { status?: string; kind?: string; user_id?: string }) =>
    apiFetch<Page<RunRow>>("/runs", { query: { ...q } }),
  run: (id: string) => apiFetch<RunDetail>(`/runs/${id}`),
  cancelRun: (id: string) => apiFetch<RunDetail>(`/runs/${id}/cancel`, { method: "POST" }),

  signals: (q: PageQuery & { category?: string }) => apiFetch<Page<SignalRow>>("/signals", { query: { ...q } }),
  audit: (q: PageQuery & { action?: string }) => apiFetch<Page<AuditRow>>("/audit-log", { query: { ...q } }),
}
