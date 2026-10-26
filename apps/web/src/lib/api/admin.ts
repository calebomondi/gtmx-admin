// Typed client for /api/v1/admin/*. Shapes mirror backend/app/schemas/admin.py.
import { apiDownload, apiFetch } from "@/lib/api/http"

export type RunStatus = "pending" | "running" | "awaiting_input" | "completed" | "failed" | "cancelled"
export const RUN_STATUSES: RunStatus[] = ["pending", "running", "awaiting_input", "completed", "failed", "cancelled"]
export const TERMINAL_STATUSES: RunStatus[] = ["completed", "failed", "cancelled"]
export const RUN_KINDS = [
  "discovery", "competitors", "accounts", "competitor_research", "chat", "outreach_drafts", "outreach_reply",
  "monitor", "lace_onboarding", "lace_turn", "lace_competitors", "lace_monitor", "lace_accounts", "lace_contacts",
  "lace_drafts", "lace_reply", "lace_opportunities",
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
  onboarding_p50_s: number | null
  onboarding_p90_s: number | null
  spend_per_active_user_usd: number | null
  cost_per_onboarded_lace_usd: number | null
  top_spenders: UserSpend[]
}

export interface EngagementDay {
  day: string
  new_users: number
  active_users: number
  active_seconds: number
  laces_created: number
  onboardings_completed: number
  onboardings_failed: number
  /** Laces with any run that day. */
  laces_active: number
  /** Messages founders sent their Laces. */
  questions: number
  competitor_runs: number
  account_runs: number
  outreach_drafted: number
  outreach_sent: number
}

export interface TopLace {
  id: string
  name: string
  user_id: string
  user_email: string | null
  /** Runs in the window. */
  runs: number
  /** Feed items in the window. */
  activity: number
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
  laces_total: number
  laces_created: number
  avg_laces_per_user: number | null
  questions: number
  top_laces: TopLace[]
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
  laces_created: number
  onboardings_completed: number
  onboardings_failed: number
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
  laces: number
  runs: number
  last_run_at: string | null
  last_seen_at: string | null
  active_seconds_30d: number
  connections: number | null
}

/** Mirrors backend/app/schemas/admin.py AdminLaceRow. */
export interface LaceRow {
  id: string
  name: string
  website: string
  startup_name: string | null
  status: "onboarding" | "active" | "archived"
  user_id: string
  user_email: string | null
  created_at: string
  last_active_at: string
  facts: number
  /** Saved (tracked). */
  competitors: number
  /** Saved targets. */
  accounts: number
  contacts: number
  /** Outreach messages sent. */
  sent: number
  runs: number
  /** All its runs; null when any usage is unpriced. */
  cost_usd: number | null
}

/** Mirrors AdminLaceDetail. */
export interface LaceDetail extends LaceRow {
  suggestions: number
  drafts_waiting: number
  replies: number
  opportunities: number
  brief_frequency: "off" | "daily" | "weekly"
  brief_email: boolean
  recent_runs: RunRow[]
}

export interface RunRow {
  id: string
  kind: string
  status: RunStatus
  user_id: string
  user_email: string | null
  lace_id: string | null
  lace_name: string | null
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
  lace_list: LaceRow[]
  connection_list: UserConnection[]
  connections_error: string | null
  activity: { day: string; active_seconds: number }[]
  top_laces: TopLace[]
}

/** A message a founder sent their Lace. Mirrors AdminQuestionRow. */
export interface QuestionRow {
  run_id: string
  user_id: string
  user_email: string | null
  lace_id: string | null
  lace_name: string | null
  text: string
  /** How the Lace's turn on it ended, or that it is still running. */
  status: RunStatus
  created_at: string
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

/** An email let into the closed pilot. Mirrors backend/app/schemas/pilot.py PilotAccessRow. */
export interface PilotAccessRow {
  id: string
  email: string
  source: "admin" | "waitlist"
  granted_by_email: string | null
  created_at: string
  /** An account exists for this email. */
  signed_up: boolean
}

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

  laces: (q: PageQuery & { q?: string; user_id?: string }) => apiFetch<Page<LaceRow>>("/laces", { query: { ...q } }),
  lace: (id: string) => apiFetch<LaceDetail>(`/laces/${id}`),

  runs: (q: PageQuery & { status?: string; kind?: string; user_id?: string; lace_id?: string }) =>
    apiFetch<Page<RunRow>>("/runs", { query: { ...q } }),
  run: (id: string) => apiFetch<RunDetail>(`/runs/${id}`),
  cancelRun: (id: string) => apiFetch<RunDetail>(`/runs/${id}/cancel`, { method: "POST" }),

  questions: (q: PageQuery & { q?: string; user_id?: string; lace_id?: string }) =>
    apiFetch<Page<QuestionRow>>("/questions", { query: { ...q } }),
  pilotStatus: () => apiFetch<{ invite_only: boolean }>("/pilot-access/status"),
  pilotAccess: (q: PageQuery & { q?: string }) => apiFetch<Page<PilotAccessRow>>("/pilot-access", { query: { ...q } }),
  addPilotAccess: (emails: string[]) =>
    apiFetch<{ added: number }>("/pilot-access", { method: "POST", body: JSON.stringify({ emails }) }),
  removePilotAccess: (id: string) => apiFetch<void>(`/pilot-access/${id}`, { method: "DELETE" }),
  approveWaitlistSignup: (id: string) => apiFetch<WaitlistRow>(`/waitlist/${id}/approve`, { method: "POST" }),
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
