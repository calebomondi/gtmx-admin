import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@workspace/ui/components/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Textarea } from "@workspace/ui/components/textarea"

import { adminApi } from "@/lib/api/admin"

// Mirrors backend/app/schemas/pilot.py MAX_EMAILS_PER_ADD.
const MAX_EMAILS = 100

/** Emails pasted in any shape (one per line, commas, spaces), deduplicated. */
function emailsIn(text: string): string[] {
  return [...new Set(text.split(/[\s,;]+/).map((e) => e.trim().toLowerCase()).filter(Boolean))]
}

/** Let people into the pilot by email: founders you've talked to, cofounders,
 * anyone not on the waitlist. */
export function AddEmails({ onAdded }: { onAdded: () => void }) {
  const [text, setText] = useState("")
  const [saving, setSaving] = useState(false)
  const emails = emailsIn(text)

  const add = async () => {
    setSaving(true)
    try {
      const { added } = await adminApi.addPilotAccess(emails)
      const skipped = emails.length - added
      toast.success(`Let in ${added} ${added === 1 ? "email" : "emails"}${skipped ? ` (${skipped} already in)` : ""}`)
      setText("")
      onAdded()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Couldn't add them")
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Let people in</CardTitle>
        <CardDescription>
          One or more emails, on separate lines or separated by commas. They can use Thalace as soon as they sign up
          with that email. Recorded in the audit log.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <Textarea value={text} onChange={(e) => setText(e.target.value)} rows={3}
                  placeholder={"founder@startup.com\ncofounder@startup.com"} aria-label="Emails to let in" />
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs text-muted-foreground">
            {emails.length > MAX_EMAILS ? `Up to ${MAX_EMAILS} at a time` : `${emails.length} ${emails.length === 1 ? "email" : "emails"}`}
          </span>
          <Button onClick={() => void add()} disabled={saving || emails.length === 0 || emails.length > MAX_EMAILS}>
            {saving ? "Adding…" : "Let in"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
