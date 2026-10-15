import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@workspace/ui/components/table"

import { adminApi, type QuotaRow } from "@/lib/api/admin"
import { useApi } from "@/lib/use-api"

function QuotaLine({ userId, row, onSaved }: { userId: string; row: QuotaRow; onSaved: () => void }) {
  const [value, setValue] = useState(row.override === null ? "" : String(row.override))
  const [busy, setBusy] = useState(false)
  // Compared against what we last saved, not the row prop, so the button is
  // right immediately after a save rather than after the list reloads.
  const [saved, setSaved] = useState(row.override)
  const parsed = value.trim() === "" ? null : Number(value)
  const invalid = parsed !== null && (!Number.isInteger(parsed) || parsed < 0 || parsed > 10000)
  const dirty = parsed !== saved

  const save = async () => {
    setBusy(true)
    try {
      await adminApi.setQuota(userId, row.kind, parsed)
      setSaved(parsed)
      toast.success(`${row.kind.replaceAll("_", " ")} cap ${parsed === null ? "reset to default" : `set to ${parsed}/day`}`)
      onSaved()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not save")
    } finally {
      setBusy(false)
    }
  }

  return (
    <TableRow>
      <TableCell>{row.kind.replaceAll("_", " ")}</TableCell>
      <TableCell className="text-right tabular-nums">{row.default_cap}</TableCell>
      <TableCell className="w-40">
        <Input
          inputMode="numeric"
          placeholder="default"
          value={value}
          aria-invalid={invalid}
          onChange={(e) => setValue(e.target.value)}
        />
      </TableCell>
      <TableCell className="w-24 text-right">
        <Button size="sm" variant="outline" disabled={!dirty || invalid || busy} onClick={() => void save()}>
          Save
        </Button>
      </TableCell>
    </TableRow>
  )
}

/** Per-kind daily run caps; an empty override means the default applies. */
export function QuotaEditor({ userId }: { userId: string }) {
  const { data, error, reload } = useApi(`quotas:${userId}`, () => adminApi.quotas(userId))
  if (error) return <p className="text-sm text-destructive">{error}</p>
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Run kind</TableHead>
          <TableHead className="text-right">Default / day</TableHead>
          <TableHead>Override</TableHead>
          <TableHead />
        </TableRow>
      </TableHeader>
      <TableBody>
        {data?.map((row) => (
          <QuotaLine key={row.kind} userId={userId} row={row} onSaved={reload} />
        ))}
      </TableBody>
    </Table>
  )
}
