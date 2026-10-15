const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 4 })
const compact = new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 })

export function formatUsd(value: number | null | undefined): string {
  return value === null || value === undefined ? "unpriced" : usd.format(value)
}

export function formatCount(value: number): string {
  return compact.format(value)
}

export function formatDuration(seconds: number | null | undefined): string {
  if (seconds === null || seconds === undefined) return "—"
  if (seconds < 60) return `${Math.round(seconds)}s`
  const m = Math.floor(seconds / 60)
  return m < 60 ? `${m}m ${Math.round(seconds % 60)}s` : `${Math.floor(m / 60)}h ${m % 60}m`
}

export function formatDateTime(iso: string | null | undefined): string {
  if (!iso) return "—"
  return new Date(iso).toLocaleString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })
}

export function formatRelative(iso: string | null | undefined): string {
  if (!iso) return "never"
  const minutes = Math.floor((Date.now() - Date.parse(iso)) / 60_000)
  if (minutes < 1) return "just now"
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return days < 30 ? `${days}d ago` : formatDateTime(iso)
}

/** A UTC day ("2026-10-11") as a short axis/tooltip label. */
export function formatDay(day: string): string {
  return new Date(`${day}T00:00:00Z`).toLocaleDateString(undefined, { month: "short", day: "numeric", timeZone: "UTC" })
}

export function formatPercent(ratio: number | null | undefined): string {
  return ratio === null || ratio === undefined ? "—" : `${Math.round(ratio * 100)}%`
}
