import type { ReactNode } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { ToggleGroup, ToggleGroupItem } from "@workspace/ui/components/toggle-group"

import { CostBreakdown } from "@/components/cost-breakdown"
import { LoadState } from "@/components/load-state"
import { PageShell } from "@/components/page-shell"
import { TopWorkspacesTable } from "@/components/top-workspaces"
import { adminApi } from "@/lib/api/admin"
import { useApi } from "@/lib/use-api"
import { useSearchState } from "@/lib/use-search-state"
import { ActivityCharts } from "./activity-chart"
import { ConnectionsCard } from "./connections-card"
import { EconomicsCard } from "./economics-card"
import { FeatureUseChart, GrowthChart, TimeInAppChart } from "./engagement-charts"
import { DropOffCard, FunnelCard } from "./funnel-card"
import { EngagementCards, MetricCards } from "./metric-cards"
import { OfferSplit } from "./offer-split"
import { RunsByKind } from "./runs-by-kind"

const WINDOWS = ["7", "30", "90"]

/** One data source's part of the page: its content once loaded, otherwise
 * its own skeleton or error, so one failing endpoint doesn't blank the rest. */
function Section<T>({ state, children }: { state: { data?: T; error?: string; reload: () => void }; children: (data: T) => ReactNode }) {
  return state.data ? children(state.data) : <LoadState error={state.error} onRetry={state.reload} />
}

const Grid = ({ children }: { children: ReactNode }) => <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">{children}</div>

export function OverviewPage() {
  const search = useSearchState()
  const days = WINDOWS.includes(search.get("days")) ? Number(search.get("days")) : 30
  const metrics = useApi(`metrics:${days}`, () => adminApi.metrics(days))
  const engagement = useApi(`engagement:${days}`, () => adminApi.engagement(days))
  const funnel = useApi(`funnel:${days}`, () => adminApi.funnel(days))
  const connections = useApi(`connections:${days}`, () => adminApi.connections(days))

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
      <div className="flex flex-col gap-4">
        {metrics.data && metrics.data.unpriced.length > 0 && (
          <p className="border border-amber-500/40 px-3 py-2 text-sm text-amber-700 dark:text-amber-400">
            No price configured for {metrics.data.unpriced.join(", ")}: their spend is left out of the totals. Add
            them to LLM_PRICES / API_CALL_PRICES.
          </p>
        )}
        <Section state={metrics}>{(m) => <MetricCards metrics={m} />}</Section>
        <Section state={engagement}>
          {(e) => (
            <>
              <EngagementCards engagement={e} />
              <Grid>
                <GrowthChart series={e.series} />
                <TimeInAppChart series={e.series} />
              </Grid>
            </>
          )}
        </Section>
        <Section state={metrics}>{(m) => <ActivityCharts series={m.series} />}</Section>
        <Section state={engagement}>
          {(e) => (
            <Grid>
              <FeatureUseChart series={e.series} />
              <OfferSplit engagement={e} />
            </Grid>
          )}
        </Section>
        <Section state={funnel}>
          {(f) => (
            <Grid>
              <FunnelCard funnel={f} />
              <DropOffCard funnel={f} />
            </Grid>
          )}
        </Section>
        <Grid>
          <Section state={connections}>{(c) => <ConnectionsCard connections={c} />}</Section>
          <Section state={metrics}>{(m) => <EconomicsCard metrics={m} />}</Section>
        </Grid>
        <Section state={engagement}>
          {(e) => (
            <Card>
              <CardHeader>
                <CardTitle>Most-used workspaces</CardTitle>
              </CardHeader>
              <CardContent>
                <TopWorkspacesTable rows={e.top_workspaces} showOwner />
              </CardContent>
            </Card>
          )}
        </Section>
        <Section state={metrics}>
          {(m) => (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2 2xl:grid-cols-3">
              <RunsByKind rows={m.runs_by_kind} />
              <CostBreakdown title="LLM spend by model" lines={m.llm_costs} tokens />
              <CostBreakdown title="Search & scraping spend" lines={m.api_costs} />
            </div>
          )}
        </Section>
      </div>
    </PageShell>
  )
}
