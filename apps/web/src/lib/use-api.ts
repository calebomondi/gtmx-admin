import { useCallback, useEffect, useEffectEvent, useState } from "react"

interface Result<T> {
  key: string
  data?: T
  error?: string
}

/** Fetch whenever `key` changes. The last data stays visible while the next
 * key loads, so paging and filters don't flash an empty table. */
export function useApi<T>(key: string, fetcher: () => Promise<T>) {
  const [result, setResult] = useState<Result<T>>({ key: "" })
  const [nonce, setNonce] = useState(0)
  const requestKey = `${key}#${nonce}`
  const run = useEffectEvent(fetcher)

  useEffect(() => {
    let cancelled = false
    run().then(
      (data) => !cancelled && setResult({ key: requestKey, data }),
      (error: unknown) =>
        !cancelled &&
        setResult((prev) => ({
          key: requestKey,
          data: prev.data,
          error: error instanceof Error ? error.message : "Request failed",
        })),
    )
    return () => {
      cancelled = true
    }
  }, [requestKey])

  const reload = useCallback(() => setNonce((n) => n + 1), [])
  const settled = result.key === requestKey
  return { data: result.data, error: settled ? result.error : undefined, loading: !settled, reload }
}
