import { Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@workspace/ui/components/chart"

import type { DayMetrics } from "@/lib/api/admin"
import { formatDay } from "@/lib/format"

const runsConfig = {
  runs_started: { label: "Started", color: "var(--series-1)" },
  runs_failed: { label: "Failed", color: "var(--series-2)" },
} satisfies ChartConfig

const costConfig = {
  llm_cost_usd: { label: "LLM $", color: "var(--series-1)" },
  api_cost_usd: { label: "Search $", color: "var(--series-2)" },
} satisfies ChartConfig

// Static charts: with entry animation on, recharts left the series undrawn
// once the animation finished (verified in Chromium).

export function ActivityCharts({ series }: { series: DayMetrics[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Runs per day</CardTitle>
          <CardDescription>Started and failed (UTC days)</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={runsConfig} className="aspect-auto h-56 w-full">
            <AreaChart data={series}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="day" tickLine={false} axisLine={false} minTickGap={24} tickFormatter={formatDay} />
              <ChartTooltip content={<ChartTooltipContent labelFormatter={(v) => formatDay(String(v))} />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Area isAnimationActive={false} dataKey="runs_started" type="monotone" fill="var(--color-runs_started)" fillOpacity={0.25} stroke="var(--color-runs_started)" />
              <Area isAnimationActive={false} dataKey="runs_failed" type="monotone" fill="var(--color-runs_failed)" fillOpacity={0.25} stroke="var(--color-runs_failed)" />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Spend per day</CardTitle>
          <CardDescription>Estimated from list prices</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={costConfig} className="aspect-auto h-56 w-full">
            <BarChart data={series}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="day" tickLine={false} axisLine={false} minTickGap={24} tickFormatter={formatDay} />
              <ChartTooltip content={<ChartTooltipContent labelFormatter={(v) => formatDay(String(v))} />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar isAnimationActive={false} dataKey="llm_cost_usd" stackId="cost" fill="var(--color-llm_cost_usd)" />
              <Bar isAnimationActive={false} dataKey="api_cost_usd" stackId="cost" fill="var(--color-api_cost_usd)" />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
