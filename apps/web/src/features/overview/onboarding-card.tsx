import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@workspace/ui/components/chart"

import type { Engagement } from "@/lib/api/admin"
import { formatDay } from "@/lib/format"

const config = {
  onboardings_completed: { label: "Onboarded", color: "var(--series-2)" },
  onboardings_failed: { label: "Failed", color: "var(--series-5)" },
} satisfies ChartConfig

/** New Laces and how their onboarding ended, per day. */
export function OnboardingCard({ engagement: e }: { engagement: Engagement }) {
  const completed = e.series.reduce((n, d) => n + d.onboardings_completed, 0)
  const failed = e.series.reduce((n, d) => n + d.onboardings_failed, 0)
  return (
    <Card>
      <CardHeader>
        <CardTitle>Lace onboarding</CardTitle>
        <CardDescription>
          {e.laces_created} Laces created in this window · {completed} onboarded · {failed} failed
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} className="aspect-auto h-56 w-full">
          <BarChart data={e.series}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="day" tickLine={false} axisLine={false} minTickGap={24} tickFormatter={formatDay} />
            <YAxis allowDecimals={false} tickLine={false} axisLine={false} width={28} />
            <ChartTooltip content={<ChartTooltipContent labelFormatter={(v) => formatDay(String(v))} />} />
            <ChartLegend content={<ChartLegendContent />} />
            {(Object.keys(config) as (keyof typeof config)[]).map((k) => (
              <Bar key={k} isAnimationActive={false} dataKey={k} stackId="o" fill={`var(--color-${k})`} stroke="var(--card)" strokeWidth={1} />
            ))}
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
