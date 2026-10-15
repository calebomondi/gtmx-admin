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
import { formatDay, formatPercent } from "@/lib/format"

const config = {
  products_created: { label: "Product", color: "var(--series-1)" },
  services_created: { label: "Service", color: "var(--series-2)" },
} satisfies ChartConfig

const SPLIT = [
  { key: "product", label: "Product", swatch: "bg-(--series-1)" },
  { key: "service", label: "Service", swatch: "bg-(--series-2)" },
  { key: "unknown", label: "Not recorded", swatch: "bg-muted-foreground" },
] as const

/** What people research: products or services, overall and per day. */
export function OfferSplit({ engagement }: { engagement: Engagement }) {
  const total = engagement.workspaces_total
  const parts = SPLIT.map((p) => ({ ...p, count: engagement.offer_types[p.key] ?? 0 })).filter((p) => p.count > 0)
  return (
    <Card>
      <CardHeader>
        <CardTitle>Product vs service</CardTitle>
        <CardDescription>All {total} workspaces, and new ones per day</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {total === 0 ? (
          <p className="text-sm text-muted-foreground">No workspaces yet</p>
        ) : (
          <>
            <div className="flex h-3 w-full gap-0.5 overflow-hidden rounded-full" role="img" aria-label="Workspaces by offer type">
              {parts.map((p) => (
                <div key={p.key} className={p.swatch} style={{ width: `${(p.count / total) * 100}%` }} />
              ))}
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm">
              {parts.map((p) => (
                <span key={p.key} className="flex items-center gap-2">
                  <span className={`size-2.5 rounded-sm ${p.swatch}`} />
                  {p.label} <span className="tabular-nums text-muted-foreground">{p.count} · {formatPercent(p.count / total)}</span>
                </span>
              ))}
            </div>
          </>
        )}
        <ChartContainer config={config} className="aspect-auto h-40 w-full">
          <BarChart data={engagement.series}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="day" tickLine={false} axisLine={false} minTickGap={24} tickFormatter={formatDay} />
            <YAxis allowDecimals={false} tickLine={false} axisLine={false} width={28} />
            <ChartTooltip content={<ChartTooltipContent labelFormatter={(v) => formatDay(String(v))} />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar isAnimationActive={false} dataKey="products_created" stackId="t" fill="var(--color-products_created)" stroke="var(--card)" strokeWidth={1} />
            <Bar isAnimationActive={false} dataKey="services_created" stackId="t" fill="var(--color-services_created)" stroke="var(--card)" strokeWidth={1} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
