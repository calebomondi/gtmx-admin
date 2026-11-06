import { toast } from "sonner"
import { Button } from "@workspace/ui/components/button"

import { ConfirmDialog } from "@/components/confirm-dialog"
import { adminApi, type WaitlistRow } from "@/lib/api/admin"

/** Take a signup off the pilot: their pilot request is dropped (freeing a
 * spot) and they leave Pilot access. They stay on the waitlist. For those who
 * asked for the pilot or were let in. The backend audits it. */
export function RemoveFromPilot({ row, onDone }: { row: WaitlistRow; onDone: () => void }) {
  if (!row.wants_pilot && row.status !== "invited") return null
  return (
    <div onClick={(e) => e.stopPropagation()}>
      <ConfirmDialog
        trigger={<Button size="sm" variant="ghost">Remove from pilot</Button>}
        title={`Remove ${row.email} from the pilot?`}
        description="Their pilot spot is freed and they're taken off Pilot access. They stay on the waitlist. Anyone already using a Lace keeps it. No email is sent."
        confirmLabel="Remove from pilot"
        onConfirm={() => adminApi.removeSignupFromPilot(row.id).then(() => {
          toast.success(`${row.email} is off the pilot`)
          onDone()
        })}
      />
    </div>
  )
}
