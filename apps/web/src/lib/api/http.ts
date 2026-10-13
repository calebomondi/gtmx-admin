import { env } from "@/lib/env"
import { getAccessToken } from "@/lib/supabase"

export class ApiError extends Error {
  readonly status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = "ApiError"
    this.status = status
  }
}

type Query = Record<string, string | number | null | undefined>

function withQuery(path: string, query?: Query): string {
  if (!query) return path
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== null && value !== "") params.set(key, String(value))
  }
  const qs = params.toString()
  return qs ? `${path}?${qs}` : path
}

/** Every admin request goes through here: bearer token and typed errors. */
async function request(path: string, init: RequestInit & { query?: Query } = {}): Promise<Response> {
  const { query, ...rest } = init
  const token = await getAccessToken()
  const response = await fetch(`${env.apiOrigin}/api/v1/admin${withQuery(path, query)}`, {
    ...rest,
    headers: {
      ...(rest.body ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...rest.headers,
    },
  })
  if (!response.ok) {
    let detail = `${response.status} ${response.statusText}`
    try {
      const body = (await response.json()) as { detail?: unknown }
      if (typeof body.detail === "string") detail = body.detail
      else if (Array.isArray(body.detail)) detail = "Invalid request"
    } catch {
      // non-JSON error body: keep the status text
    }
    throw new ApiError(response.status, detail)
  }
  return response
}

/** A JSON admin endpoint. */
export async function apiFetch<T>(path: string, init: RequestInit & { query?: Query } = {}): Promise<T> {
  const response = await request(path, init)
  if (response.status === 204) return undefined as T
  return (await response.json()) as T
}

/** A file from an admin endpoint (it needs the bearer token, so a plain link
 * can't fetch it), handed to the browser to save as `filename`. */
export async function apiDownload(path: string, filename: string, query?: Query): Promise<void> {
  const blob = await (await request(path, { query })).blob()
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}
