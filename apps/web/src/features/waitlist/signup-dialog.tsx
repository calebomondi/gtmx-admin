import type { ReactNode } from "react"
import { Badge } from "@workspace/ui/components/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@workspace/ui/components/dialog"

import type { WaitlistRow } from "@/lib/api/admin"
import { formatDateTime } from "@/lib/format"
import { SELLS_TO_LABEL, STAGE_LABEL, sourceLine } from "./waitlist-labels"

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid grid-cols-[8rem_1fr] gap-3 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="min-w-0 break-words">{children || "—"}</span>
    </div>
  )
}

/** Everything one signup told us, including what they expect Thalace to do. */
export function SignupDialog({ row, onClose }: { row: WaitlistRow | null; onClose: () => void }) {
  return (
    <Dialog open={row !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg">
        {row && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {row.name || row.email}
                {row.wants_pilot && <Badge>pilot</Badge>}
              </DialogTitle>
              <DialogDescription>{row.email}</DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-2.5">
              <Field label="Company">{row.company}</Field>
              <Field label="Role">{row.role}</Field>
              <Field label="Stage">{row.stage && STAGE_LABEL[row.stage]}</Field>
              <Field label="Sells to">{row.sells_to && SELLS_TO_LABEL[row.sells_to]}</Field>
              <Field label="Countries">{row.countries.join(", ")}</Field>
              <Field label="Status">{row.status}</Field>
              <Field label="Came from">{sourceLine(row.source)}</Field>
              <Field label="Joined">{formatDateTime(row.created_at)}</Field>
              <Field label="Email sent">{row.confirmation_sent_at ? formatDateTime(row.confirmation_sent_at) : "not yet"}</Field>
            </div>
            <div className="flex flex-col gap-1.5 border-t pt-3">
              <span className="text-sm text-muted-foreground">What they want Thalace to do</span>
              <p className="text-sm whitespace-pre-wrap">{row.expectations || "They didn't say."}</p>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
