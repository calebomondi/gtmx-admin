import { Button } from "@workspace/ui/components/button"
import { Skeleton } from "@workspace/ui/components/skeleton"

/** Loading / error placeholder for a detail view before its data arrives. */
export function LoadState({ error, onRetry }: { error?: string; onRetry: () => void }) {
  if (!error) return <Skeleton className="h-64 w-full" />
  return (
    <div className="flex items-center justify-between border border-destructive/40 px-3 py-2 text-sm text-destructive">
      <span>{error}</span>
      <Button size="sm" variant="outline" onClick={onRetry}>
        Retry
      </Button>
    </div>
  )
}
