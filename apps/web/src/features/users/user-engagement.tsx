import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { useMemo } from "react"
import { Badge } from "@workspace/ui/components/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@workspace/ui/components/chart"

import { TopLacesTable } from "@/components/top-laces"
import type { UserDetail } from "@/lib/api/admin"
import { formatDay } from "@/lib/format"

const config = { active_minutes: { label: "Active minutes", color: "var(--series-1)" } } satisfies ChartConfig

const PLATFORM_LABELS: Record<string, string> = {
  gmail: "Gmail", linkedin: "LinkedIn", instagram: "Instagram", tiktok: "TikTok", x: "X",
}

export function UserActivityCard({ user }: { user: UserDetail }) {
  const data = useMemo(
    () => user.activity.map((d) => ({ day: d.day, active_minutes: Math.round(d.active_seconds / 60) })),
    [user.activity],
  )
  return (
    <Card>
      <CardHeader>
        <CardTitle>Time in app</CardTitle>
        <CardDescription>Active minutes per day, last 30 days, and their busiest Laces</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <ChartContainer config={config} className="aspect-auto h-40 w-full">
          <BarChart data={data}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="day" tickLine={false} axisLine={false} minTickGap={24} tickFormatter={formatDay} />
            <YAxis allowDecimals={false} tickLine={false} axisLine={false} width={28} />
            <ChartTooltip content={<ChartTooltipContent labelFormatter={(v) => formatDay(String(v))} />} />
            <Bar isAnimationActive={false} dataKey="active_minutes" fill="var(--color-active_minutes)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>
        <TopLacesTable rows={user.top_laces} />
      </CardContent>
    </Card>
  )
}

export function UserConnectionsCard({ user }: { user: UserDetail }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Connected accounts</CardTitle>
        <CardDescription>Channels connected for outreach, and messages sent through each</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2 text-sm">
        {user.connections_error && <p className="text-amber-700 dark:text-amber-400">{user.connections_error}</p>}
        {!user.connections_error && user.connection_list.length === 0 && (
          <p className="text-muted-foreground">Nothing connected</p>
        )}
        {user.connection_list.map((c) => (
          <div key={`${c.platform}:${c.display_name}`} className="flex items-center justify-between border-b pb-2 last:border-0">
            <span className="flex items-center gap-2">
              {PLATFORM_LABELS[c.platform] ?? c.platform}
              {c.display_name && <span className="text-muted-foreground">{c.display_name}</span>}
              {c.status !== "live" && <Badge variant="secondary">{c.status.replace("_", " ")}</Badge>}
            </span>
            <span className="tabular-nums text-muted-foreground">{c.sends} sent</span>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
