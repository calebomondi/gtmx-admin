import * as Sentry from "@sentry/react"

import { env } from "@/lib/env"

/** Browser error reporting. Off unless VITE_SENTRY_DSN is set; the SDK sends
 * no personal data (IPs, cookies) by default. */
export function initSentry() {
  if (!env.sentryDsn) return
  Sentry.init({ dsn: env.sentryDsn, environment: env.sentryEnvironment })
}
