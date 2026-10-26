import { toast } from "sonner"
import { Button } from "@workspace/ui/components/button"

import { ConfirmDialog } from "@/components/confirm-dialog"
import { adminApi, type WaitlistRow } from "@/lib/api/admin"

/** Let a signup into the closed pilot (and mark them invited); for those
 * not yet invited. The backend audits it. */
export function LetIn({ row, onDone }: { row: WaitlistRow; onDone: () => void }) {
  if (row.status !== "new" && row.status !== "contacted") return null
  return (
    <div onClick={(e) => e.stopPropagation()}>
      <ConfirmDialog
        trigger={<Button size="sm" variant="outline">Let in</Button>}
        title={`Let ${row.email} into the pilot?`}
        description="They can use Thalace as soon as they sign up with this email, and the signup is marked invited. Tell them yourself: no email is sent."
        confirmLabel="Let in"
        onConfirm={() => adminApi.approveWaitlistSignup(row.id).then(() => {
          toast.success(`${row.email} is in`)
          onDone()
        })}
      />
    </div>
  )
}
