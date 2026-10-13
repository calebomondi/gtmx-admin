import { Card, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card"

export interface Stat {
  label: string
  value: string
  note?: string
}

export function StatCards({ stats }: { stats: Stat[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
      {stats.map((s) => (
        <Card key={s.label}>
          <CardHeader>
            <CardDescription>{s.label}</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums">{s.value}</CardTitle>
            {s.note && <p className="text-xs text-muted-foreground">{s.note}</p>}
          </CardHeader>
        </Card>
      ))}
    </div>
  )
}
