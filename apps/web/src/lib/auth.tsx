import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import type { Session } from "@supabase/supabase-js"

import { adminApi, type Me } from "@/lib/api/admin"
import { ApiError } from "@/lib/api/http"
import { supabase } from "@/lib/supabase"

/** loading -> signed-out | (checking ->) admin | forbidden. The backend's
 * /admin/me is the gate; nothing here trusts a client-side role claim. */
export type AuthState =
  | { status: "loading" }
  | { status: "signed-out" }
  | { status: "forbidden"; email: string | null }
  | { status: "error"; message: string }
  | { status: "admin"; me: Me }

const AuthContext = createContext<AuthState>({ status: "loading" })

async function resolve(session: Session | null): Promise<AuthState> {
  if (!session) return { status: "signed-out" }
  try {
    return { status: "admin", me: await adminApi.me() }
  } catch (error) {
    if (error instanceof ApiError && (error.status === 401 || error.status === 403)) {
      return { status: "forbidden", email: session.user.email ?? null }
    }
    return { status: "error", message: error instanceof Error ? error.message : "Could not reach the API" }
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({ status: "loading" })

  useEffect(() => {
    let cancelled = false
    const apply = (session: Session | null) => {
      void resolve(session).then((next) => !cancelled && setState(next))
    }
    void supabase.auth.getSession().then(({ data }) => apply(data.session))
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" || event === "SIGNED_OUT") apply(session)
    })
    return () => {
      cancelled = true
      data.subscription.unsubscribe()
    }
  }, [])

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthState {
  return useContext(AuthContext)
}

export function signOut() {
  return supabase.auth.signOut()
}
