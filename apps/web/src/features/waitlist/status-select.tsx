import { useState } from "react"
import { toast } from "sonner"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@workspace/ui/components/select"

import { adminApi, WAITLIST_STATUSES, type WaitlistRow, type WaitlistStatus } from "@/lib/api/admin"

/** Move a signup through the pilot funnel; the backend audits each change. */
export function StatusSelect({ row, onChanged }: { row: WaitlistRow; onChanged: () => void }) {
  const [status, setStatus] = useState<WaitlistStatus>(row.status)
  const [saving, setSaving] = useState(false)

  const change = async (next: WaitlistStatus) => {
    const previous = status
    setStatus(next)
    setSaving(true)
    try {
      await adminApi.setWaitlistStatus(row.id, next)
      toast.success(`${row.email}: ${next}`)
      onChanged()
    } catch (error) {
      setStatus(previous)
      toast.error(error instanceof Error ? error.message : "Couldn't change the status")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <Select value={status} onValueChange={(v) => void change(v as WaitlistStatus)} disabled={saving}>
        <SelectTrigger className="h-8 w-32" aria-label={`Status of ${row.email}`}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {WAITLIST_STATUSES.map((s) => (
            <SelectItem key={s} value={s}>
              {s}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
