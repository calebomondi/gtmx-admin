import { useState, type ReactNode } from "react"
import { toast } from "sonner"
import { Button } from "@workspace/ui/components/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog"
import { Textarea } from "@workspace/ui/components/textarea"

/** Every admin write is confirmed; `withReason` also collects the audit reason. */
export function ConfirmDialog({
  trigger,
  title,
  description,
  confirmLabel,
  destructive,
  withReason,
  onConfirm,
}: {
  trigger: ReactNode
  title: string
  description: string
  confirmLabel: string
  destructive?: boolean
  withReason?: boolean
  onConfirm: (reason: string) => Promise<unknown>
}) {
  const [open, setOpen] = useState(false)
  const [reason, setReason] = useState("")
  const [busy, setBusy] = useState(false)
  const blocked = busy || (withReason && reason.trim().length < 3)

  const confirm = async () => {
    setBusy(true)
    try {
      await onConfirm(reason.trim())
      setOpen(false)
      setReason("")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Action failed")
    } finally {
      setBusy(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {withReason && (
          <Textarea
            placeholder="Reason (recorded in the audit log)"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            maxLength={500}
          />
        )}
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={busy}>
            Cancel
          </Button>
          <Button variant={destructive ? "destructive" : "default"} onClick={() => void confirm()} disabled={blocked}>
            {busy ? "Working…" : confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
