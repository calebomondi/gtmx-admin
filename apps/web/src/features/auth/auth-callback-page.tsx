import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"

import { supabase } from "@/lib/supabase"

/** Supabase reports a failed or cancelled OAuth sign-in in the query or the hash. */
function oauthError(): string | null {
  const params = [new URLSearchParams(window.location.search), new URLSearchParams(window.location.hash.slice(1))]
  for (const p of params) {
    const message = p.get("error_description") ?? p.get("error")
    if (message) return message
  }
  return null
}

/** OAuth lands here. The Supabase client reads the session from the URL on
 * load; once it has one, the console's own gate takes over at "/". */
export function AuthCallbackPage() {
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(oauthError)

  useEffect(() => {
    if (error) return
    let cancelled = false
    void supabase.auth.getSession().then(({ data, error: sessionError }) => {
      if (cancelled) return
      if (data.session) navigate("/", { replace: true })
      else setError(sessionError?.message ?? "Sign-in didn't complete. Try again.")
    })
    return () => {
      cancelled = true
    }
  }, [error, navigate])

  if (!error) {
    return <p className="flex min-h-svh items-center justify-center text-sm text-muted-foreground">Signing you in…</p>
  }
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-3 p-6 text-center">
      <h1 className="text-lg font-semibold">Sign-in failed</h1>
      <p className="max-w-md text-sm text-muted-foreground">{error}</p>
      <Link to="/" replace className="text-sm underline underline-offset-4">
        Back to sign in
      </Link>
    </div>
  )
}
