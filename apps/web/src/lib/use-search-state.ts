import { useCallback } from "react"
import { useSearchParams } from "react-router-dom"

/** List state (page, filters) lives in the URL so back/forward and shared
 * links restore it. Changing any filter resets to page 1. */
export function useSearchState() {
  const [params, setParams] = useSearchParams()
  const page = Math.max(1, Number(params.get("page")) || 1)
  const get = useCallback((key: string) => params.get(key) ?? "", [params])
  const set = useCallback(
    (key: string, value: string | number) => {
      setParams((prev) => {
        const next = new URLSearchParams(prev)
        if (value === "" || value === null) next.delete(key)
        else next.set(key, String(value))
        if (key !== "page") next.delete("page")
        return next
      })
    },
    [setParams],
  )
  return { page, get, set, key: params.toString() }
}
