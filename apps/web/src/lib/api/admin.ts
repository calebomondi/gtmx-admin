// Typed client for /api/v1/admin/*. Shapes mirror backend/app/schemas/admin.py.
import { apiDownload, apiFetch } from "@/lib/api/http"

export type RunStatus = "pending" | "running" | "awaiting_input" | "completed" | "failed" | "cancelled"
export const RUN_STATUSES: RunStatus[] = ["pending", "running", "awaiting_input", "completed", "failed", "cancelled"]
export const TERMINAL_STATUSES: RunStatus[] = ["completed", "failed", "cancelled"]
export const RUN_KINDS = [
  "discovery", "competitors", "accounts", "competitor_research", "chat", "outreach_drafts", "outreach_reply",
  "monitor",
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

export interface UserSpend {
  user_id: string
  email: string | null
  runs: number
  cost_usd: number
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
  discovery_p50_s: number | null
  discovery_p90_s: number | null
  spend_per_active_user_usd: number | null
  cost_per_completed_discovery_usd: number | null
  top_spenders: UserSpend[]
}

export type OfferType = "product" | "service"

export interface EngagementDay {
  day: string
  new_users: number
  active_users: number
  active_seconds: number
  workspaces_created: number
  products_created: number
  services_created: number
  projects_created: number
  workspaces_interacted: number
  chat_messages: number
  competitor_runs: number
  account_runs: number
  outreach_drafted: number
  outreach_sent: number
}

export interface TopWorkspace {
  id: string
  name: string | null
  user_id: string
  user_email: string | null
  offer_type: OfferType | null
  active_seconds: number
  visits: number
}

export interface Engagement {
  days: number
  total_users: number
  new_users: number
  weekly_active_users: number
  monthly_active_users: number
  stickiness: number | null
  returning_users: number
  sessions: number
  active_time_users: number
  total_active_seconds: number
  avg_active_seconds_per_user: number | null
  avg_session_seconds: number | null
  workspaces_total: number
  workspaces_created: number
  projects_total: number
  projects_created: number
  avg_workspaces_per_user: number | null
  avg_projects_per_user: number | null
  offer_types: Record<OfferType | "unknown", number>
  top_workspaces: TopWorkspace[]
  series: EngagementDay[]
}

export interface FunnelStep {
  key: string
  label: string
  users: number
}

export interface Funnel {
  days: number
  steps: FunnelStep[]
  discoveries_started: number
  discoveries_completed: number
  interview_dropoffs: { question: string; runs: number }[]
  failure_reasons: { message: string; runs: number; last_at: string }[]
}

export interface PlatformUsage {
  platform: string
  connected_users: number
  sends: number
  senders: number
}

export interface Connections {
  days: number
  error: string | null
  users_with_connections: number
  avg_connections_per_user: number | null
  platforms: PlatformUsage[]
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
  projects: number
  runs: number
  last_run_at: string | null
  last_seen_at: string | null
  active_seconds_30d: number
  connections: number | null
}

export interface WorkspaceRow {
  id: string
  name: string | null
  offer_type: OfferType | null
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

export interface UserConnection {
  platform: string
  status: string
  display_name: string | null
  sends: number
}

export interface UserDetail extends UserRow {
  spend_usd: number
  recent_runs: RunRow[]
  workspace_list: WorkspaceRow[]
  connection_list: UserConnection[]
  connections_error: string | null
  activity: { day: string; active_seconds: number }[]
  top_workspaces: TopWorkspace[]
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

export type WaitlistStatus = "new" | "contacted" | "invited" | "onboarded"
export const WAITLIST_STATUSES: WaitlistStatus[] = ["new", "contacted", "invited", "onboarded"]

/** Mirrors backend/app/schemas/waitlist.py WaitlistSignupRow. */
export interface WaitlistRow {
  id: string
  email: string
  name: string | null
  company: string | null
  role: string | null
  stage: "idea" | "pre_revenue" | "revenue" | "scaling" | null
  sells_to: "b2b" | "b2c" | "both" | null
  countries: string[]
  wants_pilot: boolean
  expectations: string | null
  source: { utm_source?: string; utm_medium?: string; utm_campaign?: string; referrer?: string }
  status: WaitlistStatus
  confirmation_sent_at: string | null
  created_at: string
  updated_at: string
}

export interface WaitlistStats {
  total: number
  last_7_days: number
  pilot: { total: number; taken: number; left: number }
  by_day: { day: string; signups: number }[]
  by_stage: Record<string, number>
  by_sells_to: Record<string, number>
}

export interface WaitlistQuery extends PageQuery {
  q?: string
  pilot?: boolean
  status?: string
}

export const adminApi = {
  me: () => apiFetch<Me>("/me"),
  metrics: (days: number) => apiFetch<Metrics>("/metrics", { query: { days } }),
  engagement: (days: number) => apiFetch<Engagement>("/metrics/engagement", { query: { days } }),
  funnel: (days: number) => apiFetch<Funnel>("/metrics/funnel", { query: { days } }),
  connections: (days: number) => apiFetch<Connections>("/metrics/connections", { query: { days } }),

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

  waitlist: ({ pilot, ...q }: WaitlistQuery) =>
    apiFetch<Page<WaitlistRow>>("/waitlist", { query: { ...q, pilot: pilot === undefined ? undefined : String(pilot) } }),
  waitlistStats: () => apiFetch<WaitlistStats>("/waitlist/stats"),
  setWaitlistStatus: (id: string, status: WaitlistStatus) =>
    apiFetch<WaitlistRow>(`/waitlist/${id}`, { method: "PATCH", body: JSON.stringify({ status }) }),
  exportWaitlist: (filename: string, filters: { pilot?: boolean; status?: string }) =>
    apiDownload("/waitlist/export.csv", filename, {
      pilot: filters.pilot === undefined ? undefined : String(filters.pilot), status: filters.status,
    }),
}
