import { Badge } from "@workspace/ui/components/badge"
import { cn } from "@workspace/ui/lib/utils"

const TONE: Record<string, string> = {
  completed: "text-emerald-600 dark:text-emerald-400",
  failed: "text-destructive",
  cancelled: "text-muted-foreground",
  running: "text-sky-600 dark:text-sky-400",
  pending: "text-muted-foreground",
  awaiting_input: "text-amber-600 dark:text-amber-400",
}

export function StatusBadge({ status }: { status: string }) {
  return (
    <Badge variant="outline" className={cn(TONE[status])}>
      {status.replace("_", " ")}
    </Badge>
  )
}
