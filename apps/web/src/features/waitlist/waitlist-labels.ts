import type { WaitlistRow } from "@/lib/api/admin"

export const STAGE_LABEL: Record<NonNullable<WaitlistRow["stage"]>, string> = {
  idea: "Idea",
  pre_revenue: "Pre-revenue",
  revenue: "Revenue",
  scaling: "Scaling",
}

export const SELLS_TO_LABEL: Record<NonNullable<WaitlistRow["sells_to"]>, string> = {
  b2b: "B2B",
  b2c: "B2C",
  both: "B2B + B2C",
}

/** Where a signup came from, in one short line. */
export function sourceLine(source: WaitlistRow["source"]): string {
  const utm = [source.utm_source, source.utm_medium, source.utm_campaign].filter(Boolean).join(" / ")
  if (utm) return utm
  if (source.referrer) {
    try {
      return new URL(source.referrer).hostname
    } catch {
      return source.referrer
    }
  }
  return "direct"
}
