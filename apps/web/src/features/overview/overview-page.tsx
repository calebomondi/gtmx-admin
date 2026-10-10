import { Button } from "@workspace/ui/components/button"
import { Skeleton } from "@workspace/ui/components/skeleton"
import { ToggleGroup, ToggleGroupItem } from "@workspace/ui/components/toggle-group"

import { PageShell } from "@/components/page-shell"
import { adminApi } from "@/lib/api/admin"
import { useApi } from "@/lib/use-api"
import { useSearchState } from "@/lib/use-search-state"
import { ActivityCharts } from "./activity-chart"
import { CostBreakdown } from "@/components/cost-breakdown"
import { RunsByKind } from "./runs-by-kind"
import { MetricCards } from "./metric-cards"

const WINDOWS = ["7", "30", "90"]

export function OverviewPage() {
  const search = useSearchState()
  const days = WINDOWS.includes(search.get("days")) ? Number(search.get("days")) : 30
  const { data, error, loading, reload } = useApi(`metrics:${days}`, () => adminApi.metrics(days))

  return (
    <PageShell
      title="Overview"
      actions={
        <ToggleGroup type="single" variant="outline" value={String(days)} onValueChange={(v) => v && search.set("days", v)}>
          {WINDOWS.map((w) => (
            <ToggleGroupItem key={w} value={w}>
              {w} days
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      }
    >
      {error && (
        <div className="flex items-center justify-between border border-destructive/40 px-3 py-2 text-sm text-destructive">
          <span>{error}</span>
          <Button size="sm" variant="outline" onClick={reload}>
            Retry
          </Button>
        </div>
      )}
      {!data && loading && <Skeleton className="h-96 w-full" />}
      {data && (
        <div className="flex flex-col gap-4">
          {data.unpriced.length > 0 && (
            <p className="border border-amber-500/40 px-3 py-2 text-sm text-amber-700 dark:text-amber-400">
              No price configured for {data.unpriced.join(", ")}: their spend is left out of the totals. Add
              them to LLM_PRICES / API_CALL_PRICES.
            </p>
          )}
          <MetricCards metrics={data} />
          <ActivityCharts series={data.series} />
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2 2xl:grid-cols-3">
            <RunsByKind rows={data.runs_by_kind} />
            <CostBreakdown title="LLM spend by model" lines={data.llm_costs} tokens />
            <CostBreakdown title="Search & scraping spend" lines={data.api_costs} />
          </div>
        </div>
      )}
    </PageShell>
  )
}
