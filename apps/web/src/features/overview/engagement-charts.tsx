import { useMemo, useState } from "react"
import { Bar, BarChart, CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@workspace/ui/components/chart"
import { ToggleGroup, ToggleGroupItem } from "@workspace/ui/components/toggle-group"

import type { EngagementDay } from "@/lib/api/admin"
import { formatDay } from "@/lib/format"

// Each series keeps its colour whichever others are toggled off.
const growthConfig = {
  new_users: { label: "New users", color: "var(--series-1)" },
  active_users: { label: "Active users", color: "var(--series-2)" },
  laces_created: { label: "Laces created", color: "var(--series-3)" },
  laces_active: { label: "Laces at work", color: "var(--series-4)" },
} satisfies ChartConfig
type GrowthKey = keyof typeof growthConfig
const GROWTH_KEYS = Object.keys(growthConfig) as GrowthKey[]

const timeConfig = {
  active_minutes: { label: "Active minutes", color: "var(--series-1)" },
} satisfies ChartConfig

const featureConfig = {
  questions: { label: "Questions", color: "var(--series-1)" },
  competitor_runs: { label: "Competitor research", color: "var(--series-2)" },
  account_runs: { label: "Account discovery", color: "var(--series-3)" },
  outreach_drafted: { label: "Outreach drafted", color: "var(--series-4)" },
  outreach_sent: { label: "Outreach sent", color: "var(--series-5)" },
} satisfies ChartConfig
const FEATURE_KEYS = Object.keys(featureConfig) as (keyof typeof featureConfig)[]

const dayAxis = <XAxis dataKey="day" tickLine={false} axisLine={false} minTickGap={24} tickFormatter={formatDay} />
const countAxis = <YAxis allowDecimals={false} tickLine={false} axisLine={false} width={28} />
const dayTooltip = <ChartTooltip content={<ChartTooltipContent labelFormatter={(v) => formatDay(String(v))} />} />

function ChartCard({ title, description, actions, children }: {
  title: string
  description: string
  actions?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <Card>
      <CardHeader className="flex flex-col gap-2">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
        {actions}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}

export function GrowthChart({ series }: { series: EngagementDay[] }) {
  const [shown, setShown] = useState<GrowthKey[]>(["new_users", "active_users", "laces_created", "laces_active"])
  return (
    <ChartCard
      title="Growth per day"
      description="Toggle a series to compare it on its own"
      actions={
        <ToggleGroup
          type="multiple"
          variant="outline"
          size="sm"
          className="flex-wrap"
          value={shown}
          onValueChange={(v) => setShown(v as GrowthKey[])}
        >
          {GROWTH_KEYS.map((k) => (
            <ToggleGroupItem key={k} value={k} className="text-xs">
              {growthConfig[k].label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      }
    >
      <ChartContainer config={growthConfig} className="aspect-auto h-64 w-full">
        <LineChart data={series}>
          <CartesianGrid vertical={false} />
          {dayAxis}
          {countAxis}
          {dayTooltip}
          <ChartLegend content={<ChartLegendContent />} />
          {GROWTH_KEYS.filter((k) => shown.includes(k)).map((k) => (
            <Line key={k} isAnimationActive={false} dataKey={k} type="monotone" stroke={`var(--color-${k})`} strokeWidth={2} dot={false} />
          ))}
        </LineChart>
      </ChartContainer>
    </ChartCard>
  )
}

export function TimeInAppChart({ series }: { series: EngagementDay[] }) {
  const data = useMemo(
    () => series.map((d) => ({ day: d.day, active_minutes: Math.round(d.active_seconds / 60) })),
    [series],
  )
  return (
    <ChartCard title="Time in app per day" description="Minutes of active use across all users (tab visible, recent input)">
      <ChartContainer config={timeConfig} className="aspect-auto h-64 w-full">
        <BarChart data={data}>
          <CartesianGrid vertical={false} />
          {dayAxis}
          {countAxis}
          {dayTooltip}
          <Bar isAnimationActive={false} dataKey="active_minutes" fill="var(--color-active_minutes)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ChartContainer>
    </ChartCard>
  )
}

export function FeatureUseChart({ series }: { series: EngagementDay[] }) {
  return (
    <ChartCard title="Feature use per day" description="What people do with their Laces">
      <ChartContainer config={featureConfig} className="aspect-auto h-64 w-full">
        <BarChart data={series}>
          <CartesianGrid vertical={false} />
          {dayAxis}
          {countAxis}
          {dayTooltip}
          <ChartLegend content={<ChartLegendContent />} />
          {FEATURE_KEYS.map((k) => (
            <Bar key={k} isAnimationActive={false} dataKey={k} stackId="use" fill={`var(--color-${k})`} stroke="var(--card)" strokeWidth={1} />
          ))}
        </BarChart>
      </ChartContainer>
    </ChartCard>
  )
}
